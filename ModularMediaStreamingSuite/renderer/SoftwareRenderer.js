class SoftwareRenderer extends Renderer {
  render(source, videoElement) {
    videoElement.src = source.getStream();
  }
}