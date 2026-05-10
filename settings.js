// --- Language ---
const languageSelect = document.getElementById("language-select");
const savedLang = localStorage.getItem("app-language");
if (savedLang) {
  languageSelect.value = savedLang;
}
languageSelect.addEventListener("change", function () {
  localStorage.setItem("app-language", this.value);
});

// --- Reset App ---
document.getElementById("btn-reset-app").addEventListener("click", function () {
  if (!confirm("Are you sure you want to reset the app? This will clear all data.")) {
    return;
  }
  // Clear localStorage
  localStorage.clear();
  // Clear all cookies
  document.cookie.split(";").forEach(function (c) {
    var name = c.split("=")[0].trim();
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
  });
  // Redirect to home
  window.location.href = "./index.html";
});
