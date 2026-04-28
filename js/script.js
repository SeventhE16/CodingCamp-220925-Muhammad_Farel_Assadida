document.addEventListener("DOMContentLoaded", () => {
    showWelcome();
});

function showWelcome() {
    let username = localStorage.getItem("username");

    if (!username) {
        username = prompt("Masukin nama lo:");

        if (username && username.trim() !== "") {
            localStorage.setItem("username", username);
        } else {
            username = "Pelanggan";
        }
    }

    document.getElementById("username").textContent = username;
}

function validateForm() {
    let name = document.getElementById("name").value.trim();
    let email = document.getElementById("email").value.trim();
    let message = document.getElementById("message").value.trim();

    // validasi kosong
    if (!name || !email || !message) {
        alert("Isi semua field dulu bro");
        return false;
    }

    let emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,}$/;
    if (!email.match(emailPattern)) {
        alert("Email gak valid");
        return false;
    }

    alert(`Makasih ${name}, pesan lo udah masuk!`);

    document.querySelector("form").reset();

    return false; // biar gak reload
}
