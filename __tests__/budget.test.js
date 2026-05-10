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

  test("handles non-array entry_list JSON gracefully", () => {
    localStorage.setItem("entry_list", '"just a string"');

    expect(() => loadApp()).not.toThrow();
    expect(localStorage.getItem("entry_list")).toBe("[]");
  });

  test("loads valid entries from localStorage", () => {
    const entries = [
      { type: "expense", title: "Coffee", amount: 5.5 },
      { type: "income", title: "Salary", amount: 1000 },
    ];
    localStorage.setItem("entry_list", JSON.stringify(entries));
    loadApp();

    const allList = document.querySelector("#all .list");
    expect(allList.children.length).toBe(2);
    expect(localStorage.getItem("entry_list")).toContain("Coffee");
    expect(localStorage.getItem("entry_list")).toContain("Salary");
  });

  test("filters out invalid entries from localStorage", () => {
    const entries = [
      { type: "expense", title: "Coffee", amount: 5.5 },
      { type: "bad", title: "Invalid", amount: 10 },
      null,
      { type: "income", title: "Salary", amount: Infinity },
      { type: "income", title: 123, amount: 10 },
    ];
    localStorage.setItem("entry_list", JSON.stringify(entries));
    loadApp();

    // Only the first valid entry should remain
    const allList = document.querySelector("#all .list");
    expect(allList.children.length).toBe(1);
  });

  test("hides cookie banner when consent already exists", () => {
    localStorage.setItem("cookie_consent", "all");
    loadApp();

    const cookieModal = document.getElementById("cookie-modal");
    expect(cookieModal.classList.contains("hide")).toBe(true);
  });

  test("shows error toast for amount with too many decimals", () => {
    loadApp();

    const expenseTitle = document.getElementById("expense-title-input");
    const expenseAmount = document.getElementById("expense-amount-input");
    const addExpenseBtn = document.querySelector(".add-expense");
    const toast = document.getElementById("toast");

    expenseTitle.value = "Coffee";
    expenseAmount.value = "5.555";
    addExpenseBtn.click();

    expect(toast.classList.contains("show")).toBe(true);
    expect(toast.textContent).toBe("Use at most 2 decimal places.");
    expect(toast.style.backgroundColor).toBe("rgb(192, 57, 43)");
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

  test("deletes an expense via delete button", () => {
    loadApp();

    const expenseTitle = document.getElementById("expense-title-input");
    const expenseAmount = document.getElementById("expense-amount-input");
    const addExpenseBtn = document.querySelector(".add-expense");
    const expenseList = document.querySelector("#expense .list");

    expenseTitle.value = "Coffee";
    expenseAmount.value = "5.50";
    addExpenseBtn.click();
    jest.runAllTimers();

    expect(expenseList.children.length).toBe(1);

    const deleteBtn = expenseList.querySelector(".delete-btn");
    expect(deleteBtn).not.toBeNull();
    deleteBtn.click();

    expect(expenseList.children.length).toBe(0);
    expect(localStorage.getItem("entry_list")).toBe("[]");
  });

  test("deletes an income via delete button", () => {
    loadApp();

    const incomeTitle = document.getElementById("income-title-input");
    const incomeAmount = document.getElementById("income-amount-input");
    const addIncomeBtn = document.querySelector(".add-income");
    const incomeList = document.querySelector("#income .list");

    incomeTitle.value = "Salary";
    incomeAmount.value = "1000";
    addIncomeBtn.click();
    jest.runAllTimers();

    expect(incomeList.children.length).toBe(1);

    const deleteBtn = incomeList.querySelector(".delete-btn");
    deleteBtn.click();

    expect(incomeList.children.length).toBe(0);
    expect(localStorage.getItem("entry_list")).toBe("[]");
  });

  test("deletes from the all list via delete button", () => {
    loadApp();

    const expenseTitle = document.getElementById("expense-title-input");
    const expenseAmount = document.getElementById("expense-amount-input");
    const addExpenseBtn = document.querySelector(".add-expense");
    const allList = document.querySelector("#all .list");

    expenseTitle.value = "Lunch";
    expenseAmount.value = "12";
    addExpenseBtn.click();
    jest.runAllTimers();

    expect(allList.children.length).toBe(1);

    const deleteBtn = allList.querySelector(".delete-btn");
    deleteBtn.click();

    expect(allList.children.length).toBe(0);
  });

  test("edits an expense via edit button", () => {
    loadApp();

    const expenseTitle = document.getElementById("expense-title-input");
    const expenseAmount = document.getElementById("expense-amount-input");
    const addExpenseBtn = document.querySelector(".add-expense");
    const expenseList = document.querySelector("#expense .list");

    expenseTitle.value = "Coffee";
    expenseAmount.value = "5.50";
    addExpenseBtn.click();
    jest.runAllTimers();

    const editBtn = expenseList.querySelector(".edit-btn");
    expect(editBtn).not.toBeNull();
    editBtn.click();

    // Entry should be removed from list and values populated in inputs
    expect(expenseList.children.length).toBe(0);
    expect(expenseTitle.value).toBe("Coffee");
    expect(expenseAmount.value).toBe("5.5");
  });

  test("edits an income via edit button", () => {
    loadApp();

    const incomeTitle = document.getElementById("income-title-input");
    const incomeAmount = document.getElementById("income-amount-input");
    const addIncomeBtn = document.querySelector(".add-income");
    const incomeList = document.querySelector("#income .list");

    incomeTitle.value = "Salary";
    incomeAmount.value = "1000";
    addIncomeBtn.click();
    jest.runAllTimers();

    const editBtn = incomeList.querySelector(".edit-btn");
    editBtn.click();

    expect(incomeList.children.length).toBe(0);
    expect(incomeTitle.value).toBe("Salary");
    expect(incomeAmount.value).toBe("1000");
  });

  // --- Tab switching ---

  test("clicking Expenses tab shows expense panel and hides others", () => {
    loadApp();

    const expenseBtn = document.querySelector(".first-tab");
    const expenseEl = document.querySelector("#expense");
    const incomeEl = document.querySelector("#income");
    const allEl = document.querySelector("#all");

    expenseBtn.click();

    expect(expenseEl.classList.contains("hide")).toBe(false);
    expect(incomeEl.classList.contains("hide")).toBe(true);
    expect(allEl.classList.contains("hide")).toBe(true);
    expect(expenseBtn.classList.contains("focus")).toBe(true);
  });

  test("clicking Income tab shows income panel and hides others", () => {
    loadApp();

    const incomeBtn = document.querySelector(".second-tab");
    const expenseEl = document.querySelector("#expense");
    const incomeEl = document.querySelector("#income");
    const allEl = document.querySelector("#all");

    incomeBtn.click();

    expect(incomeEl.classList.contains("hide")).toBe(false);
    expect(expenseEl.classList.contains("hide")).toBe(true);
    expect(allEl.classList.contains("hide")).toBe(true);
    expect(incomeBtn.classList.contains("focus")).toBe(true);
  });

  test("clicking All tab shows all panel and hides others", () => {
    loadApp();

    const expenseBtn = document.querySelector(".first-tab");
    const allBtn = document.querySelector(".third-tab");
    const expenseEl = document.querySelector("#expense");
    const incomeEl = document.querySelector("#income");
    const allEl = document.querySelector("#all");

    // First switch to expenses
    expenseBtn.click();
    expect(expenseEl.classList.contains("hide")).toBe(false);

    // Then switch back to all
    allBtn.click();

    expect(allEl.classList.contains("hide")).toBe(false);
    expect(incomeEl.classList.contains("hide")).toBe(true);
    expect(expenseEl.classList.contains("hide")).toBe(true);
    expect(allBtn.classList.contains("focus")).toBe(true);
    expect(expenseBtn.classList.contains("focus")).toBe(false);
  });

  // --- Income validation error ---

  test("shows error toast on empty income title", () => {
    loadApp();

    const addIncomeBtn = document.querySelector(".add-income");
    const toast = document.getElementById("toast");

    addIncomeBtn.click();

    expect(toast.classList.contains("show")).toBe(true);
    expect(toast.textContent).toBe("Please enter a title.");
    expect(toast.style.backgroundColor).toBe("rgb(192, 57, 43)");
  });

  test("shows error toast on empty income amount", () => {
    loadApp();

    const incomeTitle = document.getElementById("income-title-input");
    const addIncomeBtn = document.querySelector(".add-income");
    const toast = document.getElementById("toast");

    incomeTitle.value = "Salary";
    addIncomeBtn.click();

    expect(toast.classList.contains("show")).toBe(true);
    expect(toast.textContent).toBe("Please enter an amount.");
    expect(toast.style.backgroundColor).toBe("rgb(192, 57, 43)");
  });

  // --- Balance display ---

  test("displays correct balance with income and expenses", () => {
    loadApp();

    // Add income
    const incomeTitle = document.getElementById("income-title-input");
    const incomeAmount = document.getElementById("income-amount-input");
    const addIncomeBtn = document.querySelector(".add-income");
    incomeTitle.value = "Salary";
    incomeAmount.value = "1000";
    addIncomeBtn.click();
    jest.runAllTimers();

    // Add expense
    const expenseTitle = document.getElementById("expense-title-input");
    const expenseAmount = document.getElementById("expense-amount-input");
    const addExpenseBtn = document.querySelector(".add-expense");
    expenseTitle.value = "Rent";
    expenseAmount.value = "600";
    addExpenseBtn.click();
    jest.runAllTimers();

    const balance = document.querySelector(".balance .value");
    expect(balance.textContent).toContain("400");

    const incomeTotalEl = document.querySelector(".income-total");
    expect(incomeTotalEl.textContent).toContain("1000");

    const outcomeTotalEl = document.querySelector(".outcome-total");
    expect(outcomeTotalEl.textContent).toContain("600");
  });

  test("displays negative balance when expenses exceed income", () => {
    loadApp();

    const expenseTitle = document.getElementById("expense-title-input");
    const expenseAmount = document.getElementById("expense-amount-input");
    const addExpenseBtn = document.querySelector(".add-expense");
    expenseTitle.value = "Rent";
    expenseAmount.value = "500";
    addExpenseBtn.click();
    jest.runAllTimers();

    const balance = document.querySelector(".balance .value");
    expect(balance.textContent).toContain("-$");
    expect(balance.textContent).toContain("500");
  });
});