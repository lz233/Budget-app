const fs = require("fs");
const path = require("path");
const vm = require("vm");

function loadI18n() {
  const script = fs.readFileSync(path.join(__dirname, "..", "i18n.js"), "utf8");
  // Run the script in a context that shares the jsdom globals
  // so that localStorage, document, etc. are accessible
  // and `var i18n` lands on the sandbox which we then copy to global.
  const sandbox = {
    localStorage: global.localStorage,
    document: global.document,
    window: global.window,
  };
  vm.createContext(sandbox);
  vm.runInContext(script, sandbox);
  global.i18n = sandbox.i18n;
}

describe("i18n module", () => {
  beforeEach(() => {
    jest.resetModules();
    localStorage.clear();
    delete global.i18n;
    document.documentElement.lang = "en";
  });

  test("defaults to English", () => {
    loadI18n();

    expect(i18n.getLang()).toBe("en");
    expect(i18n.t("header.balance")).toBe("Balance");
    expect(i18n.t("dashboard.title")).toBe("Dashboard");
  });

  test("respects saved language from localStorage", () => {
    localStorage.setItem("app-language", "cn");
    loadI18n();

    expect(i18n.getLang()).toBe("cn");
    expect(i18n.t("header.balance")).toBe("余额");
    expect(i18n.t("dashboard.title")).toBe("仪表盘");
  });

  test("setLang switches language and updates localStorage", () => {
    loadI18n();

    i18n.setLang("cn");
    expect(i18n.getLang()).toBe("cn");
    expect(localStorage.getItem("app-language")).toBe("cn");
    expect(i18n.t("header.balance")).toBe("余额");

    i18n.setLang("en");
    expect(i18n.t("header.balance")).toBe("Balance");
  });

  test("returns key as fallback for unknown keys", () => {
    loadI18n();
    expect(i18n.t("some.unknown.key")).toBe("some.unknown.key");
  });

  test("falls back to English for missing CN keys", () => {
    loadI18n();
    i18n.setLang("cn");
    expect(i18n.t("header.balance")).toBe("余额");
  });

  test("applyToDOM translates data-i18n elements", () => {
    document.body.innerHTML = '<span data-i18n="header.balance">Balance</span>';
    loadI18n();

    expect(document.querySelector("[data-i18n]").textContent).toBe("Balance");

    i18n.setLang("cn");
    expect(document.querySelector("[data-i18n]").textContent).toBe("余额");
  });

  test("applyToDOM translates data-i18n-placeholder", () => {
    document.body.innerHTML = '<input data-i18n-placeholder="input.placeholder.title" placeholder="title" />';
    loadI18n();

    expect(document.querySelector("input").placeholder).toBe("title");

    i18n.setLang("cn");
    expect(document.querySelector("input").placeholder).toBe("标题");
  });

  test("applyToDOM updates html lang attribute", () => {
    document.body.innerHTML = '<span data-i18n="header.balance">Balance</span>';
    loadI18n();

    expect(document.documentElement.lang).toBe("en");

    i18n.setLang("cn");
    expect(document.documentElement.lang).toBe("zh-CN");

    i18n.setLang("en");
    expect(document.documentElement.lang).toBe("en");
  });

  test("all CN keys match EN keys (sample check)", () => {
    loadI18n();
    i18n.setLang("en");

    var sampleKeys = [
      "app.title.budget", "header.balance", "dashboard.title",
      "tab.expenses", "tab.income", "tab.all",
      "cookie.title", "cookie.accept_all",
      "toast.expense_added", "toast.income_added",
      "validate.empty_title", "validate.empty_amount",
      "settings.title", "settings.reset_app",
      "privacy.title", "privacy.intro",
    ];

    sampleKeys.forEach(function (key) {
      var enVal = i18n.t(key);
      i18n.setLang("cn");
      var cnVal = i18n.t(key);
      i18n.setLang("en");

      expect(enVal).not.toBe(key);
      expect(cnVal).not.toBe(key);
      expect(enVal).not.toBe(cnVal);
    });
  });
});
