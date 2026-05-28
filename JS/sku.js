function addSKU() {

  const sku =
    document.getElementById(
      "sku"
    ).value.trim();

  if (!sku) return;

  if (
    selectedSKU.includes(sku)
  ) {

    alert(
      "SKU sudah ada"
    );

    return;
  }

  selectedSKU.push(sku);

  renderSKU();



  /* =========================
  OLD IMAGE
  ========================= */

  const oldPreview =
    document.getElementById(
      "old-preview"
    );

  const found =
    skuData.find(
      item =>
        item.sku == sku
    );

  if (
    found &&
    found.link
  ) {

    oldPreview.src =
      found.link +
      "&t=" +
      new Date().getTime();

    oldPreview.style.display =
      "block";

  } else {

    oldPreview.style.display =
      "none";
  }



  document.getElementById(
    "sku"
  ).value = "";
}

function renderSKU() {

  const container =
    document.getElementById(
      "sku-container"
    );

  container.innerHTML =
    "";

  selectedSKU.forEach(
    (sku, index) => {

      container.innerHTML += `
      <div class="sku-item">

        <span>${sku}</span>

        <button
          class="remove-btn"
          onclick="removeSKU(${index})">

          X

        </button>

      </div>
      `;
    }
  );
}

function removeSKU(index) {

  selectedSKU.splice(
    index,
    1
  );

  renderSKU();
}
