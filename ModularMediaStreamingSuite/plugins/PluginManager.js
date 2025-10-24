class PluginManager {
  constructor(videoElement) {
    this.video = videoElement;
    this.activePlugins = [];
  }

  applyPlugin(plugin) {
    plugin.apply(this.video);
    this.activePlugins.push(plugin);
  }

  removePlugin(pluginType) {
    this.activePlugins = this.activePlugins.filter(p => {
      if (p instanceof pluginType) {
        p.remove(this.video);
        return false;
      }
      return true;
    });
  }
}