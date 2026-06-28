// stripe.js
// Handles Stripe Checkout for Bath County Football Registration

// IMPORTANT:
// Replace this with your real Stripe publishable key
const STRIPE_PUBLISHABLE_KEY = "pk_test_51TY4WqCwV2fr5wElOCaw7QdlU1MGSM2ttrzRj5Kcou4iOF21naHDg8i7pOvH2qCtA233ocmjcLYnWJnNRYGlseOS00LmlRBW0f";

// Initialize Stripe
let stripe = Stripe(STRIPE_PUBLISHABLE_KEY);

/**
 * Called from registration.js
 * startCheckout({ ...registrationData, amount })
 */
async function startCheckout(registrationData) {
  try {
    // Create checkout session via Firebase Cloud Function
    const response = await fetch(
      "https://us-central1-bathcountyregistration.cloudfunctions.net/createCheckoutSession",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registrationData)
      }
    );

    const session = await response.json();

    if (!session.id) {
      console.error("Stripe session missing ID:", session);
      alert("Payment error: Unable to start checkout.");
      return;
    }

    // Redirect to Stripe Checkout
    const result = await stripe.redirectToCheckout({
      sessionId: session.id
    });

    if (result.error) {
      alert(result.error.message);
    }
  } catch (err) {
    console.error("Stripe Checkout Error:", err);
    alert("Unable to start payment. Please try again.");
  }
}
