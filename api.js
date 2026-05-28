async function loadSKU() {

  try {

    const response =
      await fetch(
        API_URL +
        "?action=getSKU"
      );

    skuData =
      await response.json();

    updateDashboard();

  } catch(err) {

    console.log(err);
  }
}