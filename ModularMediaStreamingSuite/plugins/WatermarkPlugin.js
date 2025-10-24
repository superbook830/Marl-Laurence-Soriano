class WatermarkPlugin {
  apply(videoElement) {
    let watermark = document.createElement("div");
    watermark.id = "watermark-overlay";
    watermark.textContent = "Modular Media Streaming Suite";
    watermark.style.position = "absolute";
    watermark.style.bottom = "10px";
    watermark.style.right = "20px";
    watermark.style.opacity = "0.6";
    watermark.style.fontSize = "16px";
    watermark.style.fontWeight = "bold";
    watermark.style.color = "white";
    watermark.style.pointerEvents = "none";
    watermark.style.zIndex = "98";

    videoElement.parentElement.style.position = "relative";
    videoElement.parentElement.appendChild(watermark);
  }

  remove(videoElement) {
    const watermark = document.getElementById("watermark-overlay");
    if (watermark) watermark.remove();
  }
}