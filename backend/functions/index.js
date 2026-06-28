/* ============================================================
   Firebase Cloud Functions + Stripe Backend
   ============================================================ */

const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

const db = admin.firestore();

// Load Stripe using Firebase v7 secrets
const stripe = require("stripe")(process.env.STRIPE_SECRET);

/* ============================================================
   CREATE PAYMENT INTENT
   Called by /javascript/stripe.js
   ============================================================ */

exports.createPaymentIntent = functions.https.onRequest(async (req, res) => {
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        res.status(204).send("");
        return;
    }

    try {
        const { registrationId, amount } = req.body;

        if (!registrationId || !amount) {
            return res.status(400).json({ error: "Missing fields" });
        }

        // Create Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: "Youth Football Registration"
                        },
                        unit_amount: amount * 100 // convert to cents
                    },
                    quantity: 1
                }
            ],
            success_url: "https://bathcountyfootball.github.io/bcfootball/success.html?session_id={CHECKOUT_SESSION_ID}",
            cancel_url: "https://bathcountyfootball.github.io/bcfootball/cancel.html",
            metadata: {
                registrationId: registrationId
            }
        });

        res.json({ clientSecret: session.id });

    } catch (error) {
        console.error("Error creating payment intent:", error);
        res.status(500).json({ error: error.message });
    }
});

/* ============================================================
   STRIPE WEBHOOK — CONFIRM PAYMENT
   ============================================================ */

exports.stripeWebhook = functions.https.onRequest(async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.rawBody,
            sig,
            functions.config().stripe.webhook
        );
    } catch (err) {
        console.error("Webhook signature error:", err);
        return res.status(400).send("Webhook Error");
    }

    // Handle successful payment
    if (event.type === "checkout.session.completed") {
        const session = event.data.object;
        const registrationId = session.metadata.registrationId;

        try {
            await db.collection("registrations")
                .doc(registrationId)
                .update({ paymentStatus: "paid" });

            console.log("Payment marked as paid:", registrationId);

        } catch (error) {
            console.error("Error updating Firestore:", error);
        }
    }

    res.json({ received: true });
});
