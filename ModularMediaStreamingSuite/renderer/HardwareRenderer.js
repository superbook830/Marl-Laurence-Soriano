class HardwareRenderer extends Renderer {
  render(source, videoElement) {
    if (typeof source.attachToVideo === "function") {
      // For sources like HLS that need setup
      source.attachToVideo(videoElement);
    } else {
      videoElement.src = source.getStream();
    }
  }
}