const fs = require("node:fs");
const path = require("node:path");

function setupDomFromIndexHtml() {
  const htmlPath = path.join(__dirname, "..", "index.html");
  const html = fs.readFileSync(htmlPath, "utf8");

  // Replace the current document with the real HTML.
  document.open();
  document.write(html);
  document.close();

  // jsdom doesn't implement canvas; stub a minimal 2d context.
  // eslint-disable-next-line no-undef
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

describe("app smoke", () => {
  test("loads scripts and renders initial totals", () => {
    setupDomFromIndexHtml();

    // Load scripts in the same order as index.html
    require("../chart.js");
    require("../budget.js");

    const balanceValue = document.querySelector(".balance .value");
    expect(balanceValue).not.toBeNull();
    expect(balanceValue.textContent).toContain("0");

    const incomeTotal = document.querySelector(".income-total");
    const outcomeTotal = document.querySelector(".outcome-total");
    expect(incomeTotal.textContent).toContain("0");
    expect(outcomeTotal.textContent).toContain("0");
  });
});
