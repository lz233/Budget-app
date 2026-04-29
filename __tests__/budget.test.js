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

describe("budget interactions", () => {
  beforeEach(() => {
    jest.resetModules();
    setupDom();
    require("../chart.js");
    require("../budget.js");
  });

  test("shows error toast on empty title", () => {
    const addExpenseBtn = document.querySelector(".add-expense");
    const toast = document.getElementById("toast");

    addExpenseBtn.click();

    expect(toast.classList.contains("show")).toBe(true);
    expect(toast.textContent).toBe("Please enter a title.");
    expect(toast.style.backgroundColor).toBe("rgb(192, 57, 43)"); // jsdom parses #c0392b as rgb
  });

  test("shows error toast on invalid amount", () => {
    const expenseTitle = document.getElementById("expense-title-input");
    const addExpenseBtn = document.querySelector(".add-expense");
    const toast = document.getElementById("toast");

    expenseTitle.value = "Coffee";
    // Amount is left empty
    addExpenseBtn.click();

    expect(toast.classList.contains("show")).toBe(true);
    expect(toast.textContent).toBe("Please enter an amount.");
    expect(toast.style.backgroundColor).toBe("rgb(192, 57, 43)");
  });

  test("shows success toast on valid input and updates list", () => {
    const expenseTitle = document.getElementById("expense-title-input");
    const expenseAmount = document.getElementById("expense-amount-input");
    const addExpenseBtn = document.querySelector(".add-expense");
    const toast = document.getElementById("toast");

    expenseTitle.value = "Coffee";
    expenseAmount.value = "5.50";
    addExpenseBtn.click();

    expect(toast.classList.contains("show")).toBe(true);
    expect(toast.textContent).toBe("Expense added successfully!");
    expect(toast.style.backgroundColor).toBe("rgb(39, 174, 96)"); // #27ae60

    // Also verify it was added to the list
    const expenseList = document.querySelector("#expense .list");
    expect(expenseList.children.length).toBe(1);
    expect(expenseList.children[0].textContent).toContain("Coffee : $5.5");
  });

  test("shows cookie banner on load if no consent", () => {
    const cookieModal = document.getElementById("cookie-modal");
    // Since localStorage was cleared in setupDom, hide class should be removed
    expect(cookieModal.classList.contains("hide")).toBe(false);
  });

  test("hides cookie banner and saves consent when clicking essential", () => {
    const cookieModal = document.getElementById("cookie-modal");
    const btnEssential = document.getElementById("btn-essential-cookies");
    const toast = document.getElementById("toast");

    btnEssential.click();

    expect(localStorage.getItem("cookie_consent")).toBe("essential");
    expect(cookieModal.classList.contains("hide")).toBe(true);
  });

  test("hides cookie banner and saves consent when clicking all cookies", () => {
    const cookieModal = document.getElementById("cookie-modal");
    const btnAll = document.getElementById("btn-all-cookies");
    const toast = document.getElementById("toast");

    btnAll.click();

    expect(localStorage.getItem("cookie_consent")).toBe("all");
    expect(cookieModal.classList.contains("hide")).toBe(true);
  });
});
