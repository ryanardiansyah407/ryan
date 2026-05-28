const skuInput =
  document.getElementById(
    "sku"
  );

const suggestions =
  document.getElementById(
    "suggestions"
  );

skuInput.addEventListener(
  "input",
  function() {

    const keyword =
      this.value.toLowerCase();

    suggestions.innerHTML =
      "";

    if (!keyword) return;

    const filtered =
      skuData
      .filter(item =>
        item.sku
        .toLowerCase()
        .includes(keyword)
      )
      .slice(0, 10);

    filtered.forEach(item => {

      suggestions.innerHTML += `
      <div
        class="suggestion-item"
        onclick="selectSKU('${item.sku}')">

        ${item.sku}

      </div>
      `;
    });
  }
);

function selectSKU(sku) {

  skuInput.value =
    sku;

  suggestions.innerHTML =
    "";
}
