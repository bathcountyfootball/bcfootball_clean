/* ============================================================
   STRIPE PAYMENT HANDLING
   This file works with your Firebase Cloud Function:
   /createPaymentIntent
   ============================================================ */

// Replace with your real Stripe publishable key
const stripe = Stripe(pk_test_51TY4WqCwV2fr5wElOCaw7QdlU1MGSM2ttrzRj5Kcou4iOF21naHDg8i7pOvH2qCtA233ocmjcLYnWJnNRYGlseOS00LmlRBW0f);

/* ============================================================
   CREATE PAYMENT INTENT (CALLS YOUR CLOUD FUNCTION)
   ============================================================ */

async function createPaymentIntent(registrationId, amount) {
    try {
        const response = await fetch(
            "https://YOUR_CLOUD_FUNCTION_URL/createPaymentIntent",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    registrationId: registrationId,
                    amount: amount
                })
            }
        );

        const data = await response.json();

        if (!data.clientSecret) {
            throw new Error("No client secret returned from server.");
        }

        return data.clientSecret;

    } catch (error) {
        console.error("Error creating payment intent:", error);
        alert("There was an issue starting your payment. Please try again.");
        return null;
    }
}

/* ============================================================
   REDIRECT TO STRIPE CHECKOUT
   ============================================================ */

async function submitRegistration() {
    console.log("Submitting registration:", registrationData);

    // 1. Save registration to Firestore
    const registrationId = await saveRegistrationToFirestore(registrationData);

    if (!registrationId) {
        alert("Could not save registration. Please try again.");
        return;
    }

    // 2. If total is $0 (never happens now, but safe)
    if (registrationData.total === 0) {
        await markPaymentComplete(registrationId);
        return showConfirmation(registrationId);
    }

    // 3. Create Stripe Payment Intent
    const clientSecret = await createPaymentIntent(
        registrationId,
        registrationData.total
    );

    if (!clientSecret) return;

    // 4. Redirect to Stripe Checkout
    const { error } = await stripe.redirectToCheckout({
        sessionId: clientSecret
    });

    if (error) {
        console.error("Stripe redirect error:", error);
        alert("Payment could not be started. Please try again.");
    }
}

/* ============================================================
   SHOW CONFIRMATION PAGE
   ============================================================ */

function showConfirmation(registrationId) {
    document.getElementById("confirmLeague").textContent =
        registrationData.league === "JrPro" ? "Jr Pro Season" : "Flag Season";

    document.getElementById("confirmPlayer").textContent =
        registrationData.player.name;

    document.getElementById("confirmParent").textContent =
        registrationData.parent.name;

    document.getElementById("confirmTotal").textContent =
        `$${registrationData.total}`;

    showStep("stepConfirm", 7);
}
