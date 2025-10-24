class EqualizerPlugin {
  apply(videoElement) {
    videoElement.style.filter = "contrast(1.2) brightness(1.1)";
  }

  remove(videoElement) {
    videoElement.style.filter = "none";
  }
}