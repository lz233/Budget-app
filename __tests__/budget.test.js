const fs = require("fs");
const path = require("path");

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
      clearRect() {},
      fillRect() {},
      fillText() {},
      measureText() {
        return { width: 0 };
      }
    };
  };

  localStorage.clear();
  jest.useFakeTimers();
}

function loadApp() {
  require("../chart.js");
  require("../budget.js");
}

describe("budget app helpers and edge cases", () => {
  beforeEach(() => {
    jest.resetModules();
    setupDom();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test("loads with empty localStorage", () => {
    loadApp();

    expect(localStorage.getItem("entry_list")).toBe("[]");
    const balance = document.querySelector(".balance .value");
    expect(balance).not.toBeNull();
    expect(balance.textContent).toContain("0");
  });

  test("handles invalid entry_list JSON gracefully", () => {
    localStorage.setItem("entry_list", "{bad json");

    expect(() => loadApp()).not.toThrow();
    expect(localStorage.getItem("entry_list")).toBe("[]");
  });

  test("shows cookie banner when no consent exists", () => {
    loadApp();

    const cookieModal = document.getElementById("cookie-modal");
    expect(cookieModal).not.toBeNull();
    expect(cookieModal.classList.contains("hide")).toBe(false);
  });

  test("hides cookie banner and saves essential consent", () => {
    loadApp();

    const cookieModal = document.getElementById("cookie-modal");
    const btnEssential = document.getElementById("btn-essential-cookies");

    expect(btnEssential).not.toBeNull();
    btnEssential.click();

    expect(localStorage.getItem("cookie_consent")).toBe("essential");
    expect(cookieModal.classList.contains("hide")).toBe(true);
  });

  test("hides cookie banner and saves all consent", () => {
    loadApp();

    const cookieModal = document.getElementById("cookie-modal");
    const btnAll = document.getElementById("btn-all-cookies");

    expect(btnAll).not.toBeNull();
    btnAll.click();

    expect(localStorage.getItem("cookie_consent")).toBe("all");
    expect(cookieModal.classList.contains("hide")).toBe(true);
  });

  test("shows error toast on empty expense title", () => {
    loadApp();

    const addExpenseBtn = document.querySelector(".add-expense");
    const toast = document.getElementById("toast");

    expect(addExpenseBtn).not.toBeNull();
    expect(toast).not.toBeNull();

    addExpenseBtn.click();

    expect(toast.classList.contains("show")).toBe(true);
    expect(toast.textContent).toBe("Please enter a title.");
    expect(toast.style.backgroundColor).toBe("rgb(192, 57, 43)");
  });

  test("shows error toast on empty expense amount", () => {
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

  test("adds a valid expense", () => {
    loadApp();

    const expenseTitle = document.getElementById("expense-title-input");
    const expenseAmount = document.getElementById("expense-amount-input");
    const addExpenseBtn = document.querySelector(".add-expense");
    const toast = document.getElementById("toast");
    const expenseList = document.querySelector("#expense .list");

    expenseTitle.value = "Coffee";
    expenseAmount.value = "5.50";
    addExpenseBtn.click();

    expect(toast.classList.contains("show")).toBe(true);
    expect(toast.textContent).toBe("Expense added successfully!");
    expect(expenseList.children.length).toBeGreaterThan(0);
    expect(localStorage.getItem("entry_list")).toContain("Coffee");
  });

  test("adds a valid income", () => {
    loadApp();

    const incomeTitle = document.getElementById("income-title-input");
    const incomeAmount = document.getElementById("income-amount-input");
    const addIncomeBtn = document.querySelector(".add-income");
    const toast = document.getElementById("toast");
    const incomeList = document.querySelector("#income .list");

    incomeTitle.value = "Salary";
    incomeAmount.value = "1000";
    addIncomeBtn.click();

    expect(toast.classList.contains("show")).toBe(true);
    expect(toast.textContent).toBe("Income added successfully!");
    expect(incomeList.children.length).toBeGreaterThan(0);
    expect(localStorage.getItem("entry_list")).toContain("Salary");
  });

  test("auto-hides toast after timer runs", () => {
    loadApp();

    const addExpenseBtn = document.querySelector(".add-expense");
    const toast = document.getElementById("toast");

    addExpenseBtn.click();
    expect(toast.classList.contains("show")).toBe(true);

    jest.runAllTimers();

    expect(toast.classList.contains("show")).toBe(false);
  });
});