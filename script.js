function removeStampBackground() {
  var img = document.getElementById("stamp-img");
  if (!img) return;

  function process() {
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    ctx.drawImage(img, 0, 0);

    try {
      var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      var data = imageData.data;

      for (var i = 0; i < data.length; i += 4) {
        var r = data[i];
        var g = data[i + 1];
        var b = data[i + 2];
        var max = Math.max(r, g, b);
        var min = Math.min(r, g, b);
        if (max > 170 && (max - min) < 45) {
          data[i + 3] = 0;
        }
      }

      ctx.putImageData(imageData, 0, 0);
      img.src = canvas.toDataURL("image/png");
    } catch (e) {}
  }

  if (img.complete) process();
  else img.onload = process;
}

function updateCertificate() {
  var nameVal = document.getElementById("input-name").value;
  var idVal = document.getElementById("input-id").value;

  document.getElementById("cert-name").innerText = nameVal
    ? nameVal
    : "_______________________";
  document.getElementById("cert-id").innerText = idVal
    ? idVal
    : "_______________________";
}

function generatePDF() {
  var element = document.getElementById("certificate-container");
  var name = document.getElementById("input-name").value || "Certificado";

  html2canvas(element, {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    letterRendering: true,
    backgroundColor: null
  }).then(function (canvas) {
    var imgData = canvas.toDataURL("image/jpeg", 0.95);
    var pdf = new jspdf.jsPDF("landscape", "pt", "a4");
    var w = pdf.internal.pageSize.getWidth();
    var h = pdf.internal.pageSize.getHeight();
    pdf.addImage(imgData, "JPEG", 0, 0, w, h);
    pdf.save("Certificado_" + name + ".pdf");
  }).catch(function (err) {
    alert("Error: " + err.message);
  });
}

window.addEventListener("DOMContentLoaded", function () {
  removeStampBackground();
});
