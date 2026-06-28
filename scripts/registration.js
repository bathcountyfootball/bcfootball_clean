// registration.js

document.getElementById("registrationForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const registrationData = {
        league: document.getElementById("league").value,
        parentName: document.getElementById("parentName").value,
        parentEmail: document.getElementById("parentEmail").value,
        parentPhone: document.getElementById("parentPhone").value,
        parentAddress: document.getElementById("parentAddress").value,
        playerName: document.getElementById("playerName").value,
        playerBirthdate: document.getElementById("playerBirthdate").value,
        playerAge: document.getElementById("playerAge").value,
        playerGrade: document.getElementById("playerGrade").value,
        school: document.getElementById("school").value,
        gender: document.getElementById("gender").value,
        doctor: document.getElementById("doctor").value,
        doctorPhone: document.getElementById("doctorPhone").value,
        allergies: document.getElementById("allergies").value,
        signature: document.getElementById("signature").value,
        paymentOption: document.getElementById("paymentOption").value,
        paymentStatus: "Pending"
    };

    try {
        await fetch(
            "https://script.google.com/macros/s/AKfycbzFonVe10t-NbnLSGOq885K405MkIJguS_7PnB6V95vXjUS32ite_xdLdZ3QdytNi6T/exec",
            {
                method: "POST",
                body: JSON.stringify(registrationData)
            }
        );

        document.getElementById("registrationForm").style.display = "none";
        document.getElementById("confirmation").style.display = "block";

    } catch (error) {
        alert("There was an error saving your registration.");
        console.error(error);
    }
});
