document.addEventListener("DOMContentLoaded", () => {
  showWelcome();
});

function showWelcome() {
  const usernameEl = document.getElementById("username");
  if (!usernameEl) return;

  let username = localStorage.getItem("username");

  if (!username) {
    username = prompt("Masukin nama lo:");

    if (username && username.trim() !== "") {
      localStorage.setItem("username", username.trim());
    } else {
      username = "Pelanggan";
    }
  }

  usernameEl.textContent = `Halo, ${username}!`;
}

function validateForm() {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();

  if (!name || !email || !message) {
    alert("Isi semua field dulu bro");
    return false;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
  if (!emailPattern.test(email)) {
    alert("Email gak valid");
    return false;
  }

  alert(`Makasih ${name}, pesan lo udah masuk!`);
  document.getElementById("contact-form").reset();
  return false;
}
