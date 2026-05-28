function normalizeText(text) {

  return text
    .toLowerCase()
    .replace(/\.[^/.]+$/, "")
    .replace(/[^a-z0-9]/g, "");
}



/* =========================
LEVENSHTEIN
========================= */

function levenshtein(a, b) {

  const matrix = [];

  for (let i = 0; i <= b.length; i++) {

    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {

    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {

    for (let j = 1; j <= a.length; j++) {

      if (
        b.charAt(i - 1) ==
        a.charAt(j - 1)
      ) {

        matrix[i][j] =
          matrix[i - 1][j - 1];

      } else {

        matrix[i][j] =
          Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
      }
    }
  }

  return matrix[b.length][a.length];
}



/* =========================
FIND BEST SKU
========================= */

function findBestSKU(filename) {

  const cleanFile =
    normalizeText(filename);

  let bestMatch = null;

  let bestScore = 999;

  for (const item of skuData) {

    const cleanSku =
      normalizeText(
        item.sku
      );

    if (
      cleanFile ==
      cleanSku
    ) {

      return {
        sku: item.sku,
        score: 0
      };
    }

    if (
      cleanFile.includes(
        cleanSku
      ) ||
      cleanSku.includes(
        cleanFile
      )
    ) {

      return {
        sku: item.sku,
        score: 1
      };
    }

    const distance =
      levenshtein(
        cleanFile,
        cleanSku
      );

    if (
      distance <
      bestScore
    ) {

      bestScore =
        distance;

      bestMatch =
        item.sku;
    }
  }

  if (
    bestScore <= 3
  ) {

    return {
      sku: bestMatch,
      score: bestScore
    };
  }

  return null;
}



/* =========================
PREVIEW
========================= */

function previewImage(file) {

  if (!file) return;

  const reader =
    new FileReader();

  reader.onload =
    function(e) {

      const preview =
        document.getElementById(
          "preview"
        );

      preview.src =
        e.target.result;

      preview.style.display =
        "block";
    }

  reader.readAsDataURL(
    file
  );
}

async function compressImage(file) {

  return new Promise(
    (resolve) => {

      const reader =
        new FileReader();

      reader.readAsDataURL(
        file
      );

      reader.onload =
        function(event) {

          const img =
            new Image();

          img.src =
            event.target.result;

          img.onload =
            function() {

              const canvas =
                document.createElement(
                  "canvas"
                );

              const maxWidth =
                1200;

              let width =
                img.width;

              let height =
                img.height;

              if (
                width > maxWidth
              ) {

                height =
                  height *
                  (
                    maxWidth /
                    width
                  );

                width =
                  maxWidth;
              }

              canvas.width =
                width;

              canvas.height =
                height;

              const ctx =
                canvas.getContext(
                  "2d"
                );

              ctx.drawImage(
                img,
                0,
                0,
                width,
                height
              );

              const base64 =
                canvas
                .toDataURL(
                  "image/jpeg",
                  0.7
                )
                .split(",")[1];

              resolve(base64);
            };
        };
    }
  );
}
