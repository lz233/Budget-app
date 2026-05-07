const fs = require("node:fs");
const path = require("node:path");

function setupDom() {
  const htmlPath = path.join(__dirname, "..", "index.html");
  const html = fs.readFileSync(htmlPath, "utf8");
  document.open();
  document.write(html);
  document.close();

  HTMLCanvasElement.prototype.getContext = function getContext() {
    return {
      lineWidth: 0,
      strokeStyle: "",
      beginPath() {},
      arc() {},
      stroke() {},
      clearRect() {}
    };
  };

  localStorage.clear();
}

function loadApp() {
  require("../chart.js");
  require("../budget.js");
}

describe("budget interactions", () => {
  beforeEach(() => {
    jest.resetModules();
    setupDom();
  });

  test("loads empty entry list when localStorage has no entry_list", () => {
    loadApp();

    const balanceValue = document.querySelector(".balance .value");
    const incomeTotal = document.querySelector(".income-total");
    const outcomeTotal = document.querySelector(".outcome-total");

    expect(balanceValue.textContent).toContain("0");
    expect(incomeTotal.textContent).toContain("0");
    expect(outcomeTotal.textContent).toContain("0");
  });

  test("loads valid entry list from localStorage", () => {
    localStorage.setItem(
      "entry_list",
      JSON.stringify([
        { type: "income", title: "Salary", amount: 1000 },
        { type: "expense", title: "Coffee", amount: 5.5 }
      ])
    );

    loadApp();

    const incomeList = document.querySelector("#income .list");
    const expenseList = document.querySelector("#expense .list");
    const allList = document.querySelector("#all .list");
    const incomeTotal = document.querySelector(".income-total");
    const outcomeTotal = document.querySelector(".outcome-total");

    expect(incomeList.children.length).toBe(1);
    expect(expenseList.children.length).toBe(1);
    expect(allList.children.length).toBe(2);
    expect(incomeTotal.textContent).toContain("1000");
    expect(outcomeTotal.textContent).toContain("5.5");
  });

  test("recovers safely when localStorage contains invalid JSON", () => {
    localStorage.setItem("entry_list", "{bad json");

    expect(() => {
      loadApp();
    }).not.toThrow();

    const balanceValue = document.querySelector(".balance .value");
    const allList = document.querySelector("#all .list");

    expect(balanceValue.textContent).toContain("0");
    expect(allList.children.length).toBe(0);
  });

  test("recovers safely when localStorage contains non-array JSON", () => {
    localStorage.setItem("entry_list", JSON.stringify({ type: "income" }));

    expect(() => {
      loadApp();
    }).not.toThrow();

    const allList = document.querySelector("#all .list");
    expect(allList.children.length).toBe(0);
  });

  test("filters invalid entries from localStorage", () => {
    localStorage.setItem(
      "entry_list",
      JSON.stringify([
        { type: "income", title: "Salary", amount: 1000 },
        { type: "bad-type", title: "Broken", amount: 10 },
        { type: "expense", title: "Rent", amount: "900" },
        null
      ])
    );

    loadApp();

    const incomeList = document.querySelector("#income .list");
    const expenseList = document.querySelector("#expense .list");
    const allList = document.querySelector("#all .list");

    expect(incomeList.children.length).toBe(1);
    expect(expenseList.children.length).toBe(0);
    expect(allList.children.length).toBe(1);
    expect(allList.textContent).toContain("Salary : $1000");
  });

  test("shows error toast on empty title", () => {
    loadApp();

    const addExpenseBtn = document.querySelector(".add-expense");
    const toast = document.getElementById("toast");

    addExpenseBtn.click();

    expect(toast.classList.contains("show")).toBe(true);
    expect(toast.textContent).toBe("Please enter a title.");
    expect(toast.style.backgroundColor).toBe("rgb(192, 57, 43)");
  });

  test("shows error toast on invalid amount", () => {
    loadApp();

    const expenseTitle = document.getElementById("expense-title-input");
    const addExpenseBtn = document.querySelector(".add-expense");
    const toast = document.getElementById("toast");

    expenseTitle.value = "Coffee";
    addExpenseBtn.click();

    expect(toast.classList.contains("show")).toBe(true);
    expect(toast.textContent).toBe("Please enter an amount.");
    expect(toast.style.backgroundColor).toBe("rgb(192, 57, 43)");
  });

  test("shows success toast on valid input and updates list", () => {
    loadApp();

    const expenseTitle = document.getElementById("expense-title-input");
    const expenseAmount = document.getElementById("expense-amount-input");
    const addExpenseBtn = document.querySelector(".add-expense");
    const toast = document.getElementById("toast");

    expenseTitle.value = "Coffee";
    expenseAmount.value = "5.50";
    addExpenseBtn.click();

    expect(toast.classList.contains("show")).toBe(true);
    expect(toast.textContent).toBe("Expense added successfully!");
    expect(toast.style.backgroundColor).toBe("rgb(39, 174, 96)");

    const expenseList = document.querySelector("#expense .list");
    expect(expenseList.children.length).toBe(1);
    expect(expenseList.children[0].textContent).toContain("Coffee : $5.5");
  });

  test("shows cookie banner on load if no consent", () => {
    loadApp();

    const cookieModal = document.getElementById("cookie-modal");
    expect(cookieModal.classList.contains("hide")).toBe(false);
  });

  test("hides cookie banner and saves consent when clicking essential", () => {
    loadApp();

    const cookieModal = document.getElementById("cookie-modal");
    const btnEssential = document.getElementById("btn-essential-cookies");

    btnEssential.click();

    expect(localStorage.getItem("cookie_consent")).toBe("essential");
    expect(cookieModal.classList.contains("hide")).toBe(true);
  });

  test("hides cookie banner and saves consent when clicking all cookies", () => {
    loadApp();

    const cookieModal = document.getElementById("cookie-modal");
    const btnAll = document.getElementById("btn-all-cookies");

    btnAll.click();

    expect(localStorage.getItem("cookie_consent")).toBe("all");
    expect(cookieModal.classList.contains("hide")).toBe(true);
  });
});