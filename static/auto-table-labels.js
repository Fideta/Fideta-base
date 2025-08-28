function wrapAndLabelTable(table) {
  // Ignore déjà traité
  if (table.closest(".theme-table-container")) return;

  const wrapper = document.createElement("div");
  wrapper.className = "theme-table-container";
  table.parentNode.insertBefore(wrapper, table);
  wrapper.appendChild(table);

  const headers = Array.from(table.querySelectorAll("thead th")).map((th) =>
    th.textContent.trim()
  );

  table.querySelectorAll("tbody tr").forEach((row) => {
    row.querySelectorAll("td").forEach((td, i) => {
      if (headers[i]) td.setAttribute("data-label", headers[i]);
    });
  });
}

function processAllTables() {
  document.querySelectorAll("table").forEach(wrapAndLabelTable);
}

// 🔁 Observe les changements dynamiques du DOM
const observer = new MutationObserver(() => {
  processAllTables();
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});

// Appelle une fois au chargement initial
window.addEventListener("load", () => {
  setTimeout(processAllTables, 200);
});
