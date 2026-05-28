function updateDashboard() {

  const total =
    skuData.length;

  const withImage =
    skuData.filter(
      item => item.link
    ).length;

  const withoutImage =
    total - withImage;

  document.getElementById(
    "total-sku"
  ).innerText = total;

  document.getElementById(
    "with-image"
  ).innerText = withImage;

  document.getElementById(
    "without-image"
  ).innerText = withoutImage;
}