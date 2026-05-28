const dropArea =
  document.getElementById(
    "drop-area"
  );

const fileInput =
  document.getElementById(
    "image"
  );



/* =========================
CLICK
========================= */

dropArea.addEventListener(
  "click",
  () => {

    fileInput.click();
  }
);



/* =========================
DRAG OVER
========================= */

dropArea.addEventListener(
  "dragover",
  (e) => {

    e.preventDefault();

    dropArea.classList.add(
      "dragover"
    );
  }
);



/* =========================
DRAG LEAVE
========================= */

dropArea.addEventListener(
  "dragleave",
  () => {

    dropArea.classList.remove(
      "dragover"
    );
  }
);



/* =========================
DROP
========================= */

dropArea.addEventListener(
  "drop",
  (e) => {

    e.preventDefault();

    dropArea.classList.remove(
      "dragover"
    );

    const files =
      e.dataTransfer.files;

    fileInput.files =
      files;

    handleFiles(files);

    previewImage(
      files[0]
    );
  }
);



/* =========================
CHANGE
========================= */

fileInput.addEventListener(
  "change",
  () => {

    handleFiles(
      fileInput.files
    );

    previewImage(
      fileInput.files[0]
    );
  }
);



/* =========================
HANDLE FILES
========================= */

function handleFiles(files) {

  const bulkPreview =
    document.getElementById(
      "bulk-preview"
    );

  bulkPreview.innerHTML =
    "";

  Array.from(files)
    .forEach(file => {

      const filename =
        file.name
        .split(".")[0];

      const result =
        findBestSKU(
          filename
        );

      if (result) {

        if (
          !selectedSKU.includes(
            result.sku
          )
        ) {

          selectedSKU.push(
            result.sku
          );
        }

        bulkPreview.innerHTML += `
        <div class="bulk-item">

          ✅ ${file.name}
          <br>
          → ${result.sku}

        </div>
        `;

      } else {

        bulkPreview.innerHTML += `
        <div class="bulk-item">

          ❌ ${file.name}
          <br>
          SKU tidak ditemukan

        </div>
        `;
      }
    });

  renderSKU();
}

/* =========================
UPLOAD IMAGE
========================= */

async function uploadImage() {

  const files =
    Array.from(
      fileInput.files
    );

  const status =
    document.getElementById(
      "status"
    );

  if (
    files.length == 0
  ) {

    alert(
      "Pilih foto dulu"
    );

    return;
  }

  showProgress();

  setUploadLoading(true);

  try {

    let uploadQueue = [];



    /* =====================
    MODE 1
    1 FOTO → BANYAK SKU
    ===================== */

    if (
      files.length == 1 &&
      selectedSKU.length > 0
    ) {

      const file =
        files[0];

      const base64 =
        await compressImage(
          file
        );

      uploadQueue =
        selectedSKU.map(
          sku => ({

            sku,

            image: base64
          })
        );
    }



    /* =====================
    MODE 2
    MULTI FOTO
    ===================== */

    else {

      for (
        const file of files
      ) {

        const filename =
          file.name
          .split(".")[0];

        const result =
          findBestSKU(
            filename
          );

        if (!result)
          continue;

        const base64 =
          await compressImage(
            file
          );

        uploadQueue.push({

          sku: result.sku,

          image: base64
        });
      }
    }



    /* =====================
    BATCH CONFIG
    ===================== */

    const BATCH_SIZE = 5;

    let completed = 0;

    const total =
      uploadQueue.length;



    /* =====================
    PROCESS BATCH
    ===================== */

    for (
      let i = 0;
      i < total;
      i += BATCH_SIZE
    ) {

      const batch =
        uploadQueue.slice(
          i,
          i + BATCH_SIZE
        );



      await Promise.all(

        batch.map(
          async(item) => {

            await fetch(
              API_URL,
              {

                method: "POST",

                body: JSON.stringify({

                  sku: item.sku,

                  image: item.image,

                  mime: "image/jpeg"
                })
              }
            );

            completed++;

            const percent =
              Math.round(
                (
                  completed /
                  total
                ) * 100
              );

            updateProgress(
              percent
            );

            status.innerHTML =
              `Uploading ${completed}/${total}`;
          }
        )
      );
    }



    status.innerHTML =
      `✅ ${total} upload selesai`;

    resetForm();

    await loadSKU();

  } catch(err) {

    console.log(err);

    status.innerHTML =
      "❌ Upload gagal";
  }

  setUploadLoading(false);
}
/* =========================
DELETE IMAGE
========================= */

async function deleteImage() {

  const status =
    document.getElementById(
      "status"
    );

  if (
    selectedSKU.length == 0
  ) {

    alert(
      "Pilih SKU dulu"
    );

    return;
  }

  const confirmDelete =
    confirm(
      `Hapus foto dari ${selectedSKU.length} SKU?`
    );

  if (!confirmDelete)
    return;

  status.innerHTML =
    "Deleting...";

  try {

    await Promise.all(

      selectedSKU.map(
        sku => {

          return fetch(
            API_URL,
            {

              method: "POST",

              body: JSON.stringify({

                action: "delete",

                sku: sku
              })
            }
          );
        }
      )
    );

    status.innerHTML =
      "✅ Foto berhasil dihapus";

    resetForm();

    await loadSKU();

  } catch(err) {

    console.log(err);

    status.innerHTML =
      "❌ Gagal menghapus foto";
  }
}


let oauthToken = null;
let pickerInited = false;
let selectedFile = null;

function initPicker() {
  gapi.load("auth", { callback: onAuthApiLoad });
  gapi.load("picker", { callback: onPickerApiLoad });
}

function onAuthApiLoad() {
  gapi.auth.authorize(
    {
      client_id: CLIENT_ID,
      scope: ["https://www.googleapis.com/auth/drive.file"],
      immediate: false
    },
    handleAuth
  );
}

function handleAuth(authResult) {
  if (authResult && !authResult.error) {
    oauthToken = authResult.access_token;
    createPicker();
  }
}

function createPicker() {
  if (pickerInited && oauthToken) {

    const picker = new google.picker.PickerBuilder()
      .addView(google.picker.ViewId.DOCS_IMAGES)
      .setOAuthToken(oauthToken)
      .setDeveloperKey(DEVELOPER_KEY)
      .setCallback(pickerCallback)
      .build();

    picker.setVisible(true);
  }
}

function pickerCallback(data) {

  if (data.action === google.picker.Action.PICKED) {

    selectedFile = data.docs[0];

    console.log("FILE:", selectedFile.url);
  }
}

function openPicker() {
  initPicker();
}
