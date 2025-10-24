class MediaFacade {
  constructor(videoElement) {
    this.video = videoElement;
    this.renderer = null;
    this.plugins = [];
  }

  setRenderer(renderer) {
    this.renderer = renderer;
  }

  playSource(source) {
    if (!this.renderer) {
      console.error("Renderer not set!");
      return;
    }

    this.renderer.render(source, this.video);
    this.video.play();
  }

  applyPlugin(plugin) {
    plugin.apply(this.video);
    this.plugins.push(plugin);
  }
}
