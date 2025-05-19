document.addEventListener("DOMContentLoaded", function () {
  const popup = document.getElementById("cookie-popup");
  const acceptButton = popup.querySelector(".accept");

  if (!localStorage.getItem("cookiesAccepted")) {
    popup.classList.remove("hidden");
  }

  acceptButton.addEventListener("click", function () {
    popup.classList.add("hidden");
    localStorage.setItem("cookiesAccepted", "true");
  });
});
