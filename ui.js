function resetForm() {

  document.getElementById(
    "sku"
  ).value = "";

  selectedSKU = [];

  renderSKU();

  fileInput.value = "";

  document.getElementById(
    "preview"
  ).style.display =
    "none";

  document.getElementById(
    "old-preview"
  ).style.display =
    "none";

  document.getElementById(
    "bulk-preview"
  ).innerHTML =
    "";

  hideProgress();
}



/* =========================
PROGRESS
========================= */

function showProgress() {

  document.querySelector(
    ".progress-container"
  ).style.display =
    "block";
}

function hideProgress() {

  document.querySelector(
    ".progress-container"
  ).style.display =
    "none";

  updateProgress(0);
}

function updateProgress(percent) {

  document.getElementById(
    "progress-bar"
  ).style.width =
    percent + "%";
}



/* =========================
BUTTON STATE
========================= */

function setUploadLoading(
  loading
) {

  const btn =
    document.querySelector(
      '.button-group button'
    );

  btn.disabled =
    loading;

  btn.innerText =
    loading
    ? "Uploading..."
    : "Upload";
}