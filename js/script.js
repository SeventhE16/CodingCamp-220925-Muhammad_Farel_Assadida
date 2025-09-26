welcomeMessage();

/// Welcome Message
function welcomeMessage() {
    /// Prompt user for their name
    let username = prompt("Masukkan namamu:");
    /// If a name is entered, display it in the header; otherwise, show a default message
    if (username) {

        /// Display the username in the header
        document.getElementById("username").innerHTML = username;
    } else {

        /// If no name is entered, show a default welcome message
        alert("Selamat datang, Pelanggan!");
    }
}

/// Form Validation
function validateForm() {
    /// Get form values
    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let message = document.getElementById("message").value;

    /// Simple validation
    if (name === "" || email === "" || message === "") {
        /// If any field is empty, show an alert
        alert("Tolong isi semua kolom sebelum mengirim.");
    } else {
        /// If all fields are filled, show a success message
        alert(`Terimakasih, ${name}! kolom berhasil dikirim!`);
        /// Optionally, you can reset the form here
        document.getElementById("contactForm").reset();
    }
}