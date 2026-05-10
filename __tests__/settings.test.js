const fs = require("fs");
const path = require("path");

function setupSettingsDom() {
  const htmlPath = path.join(__dirname, "..", "settings.html");
  const html = fs.readFileSync(htmlPath, "utf8");

  document.open();
  document.write(html);
  document.close();

  localStorage.clear();
}

function loadSettings() {
  require("../settings.js");
}

describe("settings page", () => {
  let originalConsoleError;

  beforeEach(() => {
    jest.resetModules();
    setupSettingsDom();
    // Suppress jsdom "Not implemented: navigation" errors
    originalConsoleError = console.error;
    console.error = jest.fn((...args) => {
      const msg = args[0] && args[0].toString ? args[0].toString() : "";
      if (!msg.includes("Not implemented: navigation")) {
        originalConsoleError.apply(console, args);
      }
    });
  });

  afterEach(() => {
    console.error = originalConsoleError;
  });

  // --- Language selector ---

  test("defaults to English when no saved language", () => {
    loadSettings();

    const select = document.getElementById("language-select");
    expect(select).not.toBeNull();
    expect(select.value).toBe("en");
  });

  test("restores saved language from localStorage", () => {
    localStorage.setItem("app-language", "cn");
    loadSettings();

    const select = document.getElementById("language-select");
    expect(select.value).toBe("cn");
  });

  test("saves language to localStorage on change", () => {
    loadSettings();

    const select = document.getElementById("language-select");
    select.value = "cn";
    select.dispatchEvent(new Event("change"));

    expect(localStorage.getItem("app-language")).toBe("cn");
  });

  test("updates localStorage when switching language back", () => {
    localStorage.setItem("app-language", "cn");
    loadSettings();

    const select = document.getElementById("language-select");
    select.value = "en";
    select.dispatchEvent(new Event("change"));

    expect(localStorage.getItem("app-language")).toBe("en");
  });

  // --- Privacy Policy link ---

  test("contains a link to privacy policy", () => {
    const link = document.querySelector('a.settings-link[href="./privacy.html"]');
    expect(link).not.toBeNull();
    expect(link.textContent).toBe("Privacy Policy");
  });

  // --- Reset App ---

  test("reset button exists", () => {
    const btn = document.getElementById("btn-reset-app");
    expect(btn).not.toBeNull();
    expect(btn.textContent).toBe("Reset App");
  });

  test("reset clears localStorage when confirmed", () => {
    loadSettings();

    // Populate some data
    localStorage.setItem("app-language", "cn");
    localStorage.setItem("entry_list", '[{"title":"Coffee","amount":5}]');
    localStorage.setItem("cookie_consent", "all");

    // Mock confirm to return true
    window.confirm = jest.fn(() => true);

    document.getElementById("btn-reset-app").click();

    expect(window.confirm).toHaveBeenCalled();
    expect(localStorage.length).toBe(0);
  });

  test("reset does nothing when cancelled", () => {
    loadSettings();

    localStorage.setItem("app-language", "cn");

    // Mock confirm to return false
    window.confirm = jest.fn(() => false);

    document.getElementById("btn-reset-app").click();

    expect(window.confirm).toHaveBeenCalled();
    // Data should still be there
    expect(localStorage.getItem("app-language")).toBe("cn");
  });

  test("reset clears cookies", () => {
    loadSettings();

    // Set a test cookie
    document.cookie = "test_cookie=hello;path=/";

    window.confirm = jest.fn(() => true);

    document.getElementById("btn-reset-app").click();

    // Cookie should be expired (value cleared)
    expect(document.cookie).not.toContain("test_cookie=hello");
  });
});

// --- Tests WITH i18n loaded (covers i18n-dependent branches) ---
describe("settings page with i18n", () => {
  let originalConsoleError;

  function setupWithI18n() {
    const htmlPath = path.join(__dirname, "..", "settings.html");
    const html = fs.readFileSync(htmlPath, "utf8");
    document.open();
    document.write(html);
    document.close();
    localStorage.clear();

    // Load i18n via require() so Jest can track coverage
    global.i18n = require("../i18n.js");
  }

  beforeEach(() => {
    jest.resetModules();
    setupWithI18n();
    originalConsoleError = console.error;
    console.error = jest.fn((...args) => {
      const msg = args[0] && args[0].toString ? args[0].toString() : "";
      if (!msg.includes("Not implemented: navigation")) {
        originalConsoleError.apply(console, args);
      }
    });
  });

  afterEach(() => {
    console.error = originalConsoleError;
    delete global.i18n;
  });

  test("reads language from i18n.getLang() on load", () => {
    i18n.setLang("cn");
    require("../settings.js");

    const select = document.getElementById("language-select");
    expect(select.value).toBe("cn");
  });

  test("calls i18n.setLang() on language change", () => {
    require("../settings.js");

    const setLangSpy = jest.fn(i18n.setLang.bind(i18n));
    i18n.setLang = setLangSpy;

    const select = document.getElementById("language-select");
    select.value = "cn";
    select.dispatchEvent(new Event("change"));

    expect(setLangSpy).toHaveBeenCalledWith("cn");
  });

  test("uses i18n.t() for reset confirm message", () => {
    require("../settings.js");

    window.confirm = jest.fn(() => false);

    document.getElementById("btn-reset-app").click();

    // Confirm should have been called with the translated message
    expect(window.confirm).toHaveBeenCalledWith(
      i18n.t("settings.confirm_reset")
    );
  });
});
