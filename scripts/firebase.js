/* ============================================================
   FIREBASE INITIALIZATION
   Replace the config object with YOUR Firebase project settings
   ============================================================ */

const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

/* ============================================================
   SAVE REGISTRATION TO FIRESTORE
   Called after payment is completed or marked pending
   ============================================================ */

async function saveRegistrationToFirestore(registrationData) {
    try {
        const docRef = await db.collection("registrations").add({
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),

            // Parent info
            parentName: registrationData.parent.name,
            parentEmail: registrationData.parent.email,
            parentPhone: registrationData.parent.phone,
            parentAddress: registrationData.parent.address,

            // Player info
            playerName: registrationData.player.name,
            playerGrade: registrationData.player.grade,
            playerDob: registrationData.player.dob,
            playerJersey: registrationData.player.jersey,

            // Medical info
            medicalConditions: registrationData.medical.conditions,
            emergencyName: registrationData.medical.emergencyName,
            emergencyPhone: registrationData.medical.emergencyPhone,

            // League + pricing
            league: registrationData.league,
            registrationType: "Season",
            basePrice: registrationData.price,
            discount: registrationData.discount,
            totalPaid: registrationData.total,

            // Physical (Jr Pro only)
            physicalStatus: registrationData.physicalStatus || "N/A",

            // Signature
            signature: registrationData.signature,

            // Payment status
            paymentStatus: registrationData.total > 0 ? "pending" : "free"
        });

        console.log("Registration saved with ID:", docRef.id);
        return docRef.id;

    } catch (error) {
        console.error("Error saving registration:", error);
        alert("There was an error saving your registration. Please try again.");
        return null;
    }
}

/* ============================================================
   UPDATE PAYMENT STATUS AFTER STRIPE PAYMENT
   ============================================================ */

async function markPaymentComplete(registrationId) {
    try {
        await db.collection("registrations").doc(registrationId).update({
            paymentStatus: "paid"
        });

        console.log("Payment marked as complete for:", registrationId);

    } catch (error) {
        console.error("Error updating payment status:", error);
    }
}
