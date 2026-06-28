// firebase.js
// Handles Firebase initialization + saving registration data

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXX",
  authDomain: "bathcountyregistration.firebaseapp.com",
  projectId: "bathcountyregistration",
  storageBucket: "bathcountyregistration.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:xxxxxxxxxxxx"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

/**
 * Called from registration.js
 * saveRegistration(registrationData)
 */
async function saveRegistration(registrationData) {
  try {
    const timestamp = new Date().toISOString();

    const docData = {
      ...registrationData,
      timestamp,
      paymentStatus: "pending",   // updated to "paid" by webhook
      league: registrationData.league || "Unknown",
      playerName: registrationData.playerName || "",
      guardianName: registrationData.guardianName || "",
      signatureDate: registrationData.signatureDate || "",
    };

    await db.collection("registrations").add(docData);

    console.log("Registration saved:", docData);
  } catch (err) {
    console.error("Firebase Save Error:", err);
    alert("Unable to save registration. Please try again.");
  }
}
