// --- Language ---
const languageSelect = document.getElementById("language-select");
const savedLang = (typeof i18n !== "undefined") ? i18n.getLang() : (localStorage.getItem("app-language") || "en");
languageSelect.value = savedLang;

languageSelect.addEventListener("change", function () {
  var lang = this.value;
  if (typeof i18n !== "undefined") {
    i18n.setLang(lang);
  } else {
    localStorage.setItem("app-language", lang);
  }
});

// --- Reset App ---
document.getElementById("btn-reset-app").addEventListener("click", function () {
  var msg = (typeof i18n !== "undefined") ? i18n.t("settings.confirm_reset") : "Are you sure you want to reset the app? This will clear all data.";
  if (!confirm(msg)) {
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
