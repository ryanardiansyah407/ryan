function filterSKU(type) {

  const result =
    document.getElementById(
      "filter-result"
    );

  result.innerHTML =
    "";

  let filtered = [];



  if (
    type == "all"
  ) {

    filtered =
      skuData;

  } else if (
    type == "with-image"
  ) {

    filtered =
      skuData.filter(
        item => item.link
      );

  } else {

    filtered =
      skuData.filter(
        item => !item.link
      );
  }



  filtered.forEach(item => {

    result.innerHTML += `
    <div class="filter-item">

      <div>

        <b>${item.sku}</b>

        <br>

        ${item.kategori || ""}

      </div>

      ${
        item.link
        ?

        `<img src="${item.link}">`

        :

        `❌`
      }

    </div>
    `;
  });
}
