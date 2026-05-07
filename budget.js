//SELECT ELEMENTS
const balanceEl = document.querySelector(".balance .value");
const incomeTotalEl = document.querySelector(".income-total");
const outcomeTotalEl = document.querySelector(".outcome-total");
const incomeEl = document.querySelector("#income");
const expenseEl = document.querySelector("#expense");
const allEl = document.querySelector("#all");
const incomeList = document.querySelector("#income .list");
const expenseList = document.querySelector("#expense .list");
const allList = document.querySelector("#all .list");

//SELECT BUTTONS
const expenseBtn = document.querySelector(".first-tab");
const incomeBtn = document.querySelector(".second-tab");
const allBtn = document.querySelector(".third-tab");

//INPUT BTS
const addExpense = document.querySelector(".add-expense");
const expenseTitle = document.getElementById("expense-title-input");
const expenseAmount = document.getElementById("expense-amount-input");

const addIncome = document.querySelector(".add-income");
const incomeTitle = document.getElementById("income-title-input");
const incomeAmount = document.getElementById("income-amount-input");

//VARIABLES
let ENTRY_LIST;
let balance = 0,
  income = 0,
  outcome = 0;
const DELETE = "delete",
  EDIT = "edit";

function validateInput(titleRaw, amountRaw) {
  const title = String(titleRaw || "").trim();
  if (title.length === 0) return { valid: false, message: "Please enter a title." };
  if (title.length > 50) return { valid: false, message: "Title must be 50 characters or fewer." };

  if (amountRaw === "" || amountRaw === null) {
    return { valid: false, message: "Please enter an amount." };
  }

  const amount = Number(amountRaw);
  if (!Number.isFinite(amount)) return { valid: false, message: "Amount must be a number." };
  if (amount < 0.01) return { valid: false, message: "Amount must be greater than zero." };
  if (amount > 9999999) return { valid: false, message: "Amount is too large." };
  if (Math.round(amount * 100) / 100 !== amount) {
    return { valid: false, message: "Use at most 2 decimal places." };
  }

  return { valid: true, title, amount };
}

function loadEntryList() {
  const raw = localStorage.getItem("entry_list");

  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((entry) => {
      return (
        entry &&
        (entry.type === "income" || entry.type === "expense") &&
        typeof entry.title === "string" &&
        typeof entry.amount === "number" &&
        Number.isFinite(entry.amount)
      );
    });
  } catch (error) {
    console.warn("Invalid entry_list in localStorage, resetting to empty array.", error);
    return [];
  }
}

function saveEntryList() {
  localStorage.setItem("entry_list", JSON.stringify(ENTRY_LIST));
}

// LOOK IF THERE IS DATA IN LOCAL STORAGE
ENTRY_LIST = loadEntryList();
updateUI();

//EVENT LISTENERS
expenseBtn.addEventListener("click", function () {
  show(expenseEl);
  hide([incomeEl, allEl]);
  active(expenseBtn);
  inactive([incomeBtn, allBtn]);
});
incomeBtn.addEventListener("click", function () {
  show(incomeEl);
  hide([expenseEl, allEl]);
  active(incomeBtn);
  inactive([expenseBtn, allBtn]);
});
allBtn.addEventListener("click", function () {
  show(allEl);
  hide([incomeEl, expenseEl]);
  active(allBtn);
  inactive([incomeBtn, expenseBtn]);
});

addExpense.addEventListener("click", function () {
  const result = validateInput(expenseTitle.value, expenseAmount.value);
  if (!result.valid) {
    showToast(result.message, true);
    return;
  }
  ENTRY_LIST.push({ type: "expense", title: result.title, amount: result.amount });
  updateUI();
  clearInput([expenseTitle, expenseAmount]);
  showToast("Expense added successfully!");
});

addIncome.addEventListener("click", function () {
  const result = validateInput(incomeTitle.value, incomeAmount.value);
  if (!result.valid) {
    showToast(result.message, true);
    return;
  }
  ENTRY_LIST.push({ type: "income", title: result.title, amount: result.amount });
  updateUI();
  clearInput([incomeTitle, incomeAmount]);
  showToast("Income added successfully!");
});

incomeList.addEventListener("click", deleteOrEdit);
expenseList.addEventListener("click", deleteOrEdit);
allList.addEventListener("click", deleteOrEdit);

// HELEPER FUNCS
function deleteOrEdit(event) {
  const targetBtn = event.target;
  const entry = targetBtn.parentNode;

  if (targetBtn.id == EDIT) {
    editEntry(entry);
  } else if (targetBtn.id == DELETE) {
    deleteEntry(entry);
  }
}

function deleteEntry(entry) {
  ENTRY_LIST.splice(entry.id, 1);
  updateUI();
}

function editEntry(entry) {
  const ENTRY = ENTRY_LIST[entry.id];

  if (ENTRY.type == "income") {
    incomeTitle.value = ENTRY.title;
    incomeAmount.value = ENTRY.amount;
  } else if (ENTRY.type == "expense") {
    expenseTitle.value = ENTRY.title;
    expenseAmount.value = ENTRY.amount;
  }
  deleteEntry(entry);
}

function updateUI() {
  income = calculateTotal("income", ENTRY_LIST);
  outcome = calculateTotal("expense", ENTRY_LIST);
  balance = Math.abs(calculateBalance(income, outcome));

  let sign = income >= outcome ? "$" : "-$";

  //UPDATE UI
  balanceEl.replaceChildren();
  const balSmall = document.createElement("small");
  balSmall.textContent = sign;
  balanceEl.appendChild(balSmall);
  balanceEl.appendChild(document.createTextNode(String(balance)));

  outcomeTotalEl.replaceChildren();
  const outSmall = document.createElement("small");
  outSmall.textContent = "$";
  outcomeTotalEl.appendChild(outSmall);
  outcomeTotalEl.appendChild(document.createTextNode(String(outcome)));

  incomeTotalEl.replaceChildren();
  const incSmall = document.createElement("small");
  incSmall.textContent = "$";
  incomeTotalEl.appendChild(incSmall);
  incomeTotalEl.appendChild(document.createTextNode(String(income)));

  clearElement([expenseList, incomeList, allList]);

  ENTRY_LIST.forEach((entry, index) => {
    if (entry.type == "expense") {
      showEntry(expenseList, entry.type, entry.title, entry.amount, index);
    } else if (entry.type == "income") {
      showEntry(incomeList, entry.type, entry.title, entry.amount, index);
    }
    showEntry(allList, entry.type, entry.title, entry.amount, index);
  });

  updateChart(income, outcome);
  saveEntryList();
}

function showEntry(list, type, title, amount, id) {
  const li = document.createElement("li");
  li.dataset.id = id;
  li.className = type;

  const body = document.createElement("div");
  body.className = "entry";
  body.textContent = `${title} : $${amount}`;
  li.appendChild(body);

  const editBtn = document.createElement("button");
  editBtn.type = "button";
  editBtn.className = "edit-btn";
  editBtn.dataset.action = "edit";
  editBtn.setAttribute("aria-label", "Edit entry");
  li.appendChild(editBtn);

  const deleteBtn = document.createElement("button");
  deleteBtn.type = "button";
  deleteBtn.className = "delete-btn";
  deleteBtn.dataset.action = "delete";
  deleteBtn.setAttribute("aria-label", "Delete entry");
  li.appendChild(deleteBtn);

  list.insertBefore(li, list.firstChild);
}

function clearElement(elements) {
  elements.forEach((element) => {
    element.innerHTML = "";
  });
}

function calculateTotal(type, list) {
  let sum = 0;
  list.forEach((entry) => {
    if (entry.type == type) {
      sum += entry.amount;
    }
  });
  return sum;
}

function calculateBalance(income, outcome) {
  return income - outcome;
}

function clearInput(inputs) {
  inputs.forEach((input) => {
    input.value = "";
  });
}

function show(element) {
  element.classList.remove("hide");
}

function hide(elements) {
  elements.forEach((element) => {
    element.classList.add("hide");
  });
}

function active(element) {
  element.classList.add("focus");
}

function inactive(elements) {
  elements.forEach((element) => {
    element.classList.remove("focus");
  });
}

function showToast(message, isError = false) {
  const toast = document.getElementById("toast");
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("show");
  toast.style.backgroundColor = isError ? "#c0392b" : "#27ae60";

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2000);
}