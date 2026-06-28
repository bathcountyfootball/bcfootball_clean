/**
 * Bath County Football Registration
 * Firebase Cloud Functions Backend
 * Node.js 20 — firebase-functions v2
 */

const functions = require("firebase-functions/v2");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");
const { defineSecret } = require("firebase-functions/params");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// Initialize Firebase Admin
admin.initializeApp();
const db = admin.firestore();

// Stripe secret key stored in Firebase environment parameters
const STRIPE_SECRET = defineSecret("STRIPE_SECRET_KEY");

/**
 * Create Stripe Checkout Session
 * Called from stripe.js → startCheckout()
 */
exports.createCheckoutSession = functions.https.onRequest(
  { secrets: [STRIPE_SECRET] },
  async (req, res) => {
    try {
      const data = req.body;

      // Basic fee logic (same as frontend)
      let base = 75;
      if (data.league === "Flag") base = 50;
      if (data.league === "Middle School") base = 100;
      if (data.league === "High School") base = 125;

      const siblingDiscount = 0; // Expand later
      const total = base - siblingDiscount;

      // Create Stripe Checkout session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: `Bath County Football Registration — ${data.playerName}`,
              },
              unit_amount: total * 100,
            },
            quantity: 1,
          },
        ],
        success_url: "https://bathcountyfootball.github.io/bcfootball_clean/registration-success.html",
        cancel_url: "https://bathcountyfootball.github.io/bcfootball_clean/registration-cancel.html",
        metadata: {
          playerName: data.playerName,
          guardianName: data.guardianName,
          league: data.league,
          firestoreId: data.firestoreId || "",
        },
      });

      res.json({ id: session.id });
    } catch (err) {
      logger.error("Stripe session error:", err);
      res.status(500).json({ error: err.message });
    }
  }
);

/**
 * Stripe Webhook — confirms payment
 * Updates Firestore: paymentStatus = "paid"
 */
exports.stripeWebhook = functions.https.onRequest(
  { secrets: [STRIPE_SECRET] },
  async (req, res) => {
    let event;

    try {
      const sig = req.headers["stripe-signature"];
      event = stripe.webhooks.constructEvent(
        req.rawBody,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      logger.error("Webhook signature error:", err);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle successful payment
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      const firestoreId = session.metadata.firestoreId;

      if (firestoreId) {
        await db.collection("registrations")
          .doc(firestoreId)
          .update({
            paymentStatus: "paid",
            stripeSessionId: session.id,
            paidAt: new Date().toISOString(),
          });

        logger.info(`Payment confirmed for ${firestoreId}`);
      }
    }

    res.json({ received: true });
  }
);

/**
 * Save registration BEFORE payment
 * Called from firebase.js → saveRegistration()
 */
exports.saveRegistration = functions.https.onCall(async (data) => {
  try {
    const timestamp = new Date().toISOString();

    const docRef = await db.collection("registrations").add({
      ...data,
      timestamp,
      paymentStatus: "pending",
    });

    return { firestoreId: docRef.id };
  } catch (err) {
    logger.error("Save registration error:", err);
    throw new functions.https.HttpsError("internal", err.message);
  }
});
