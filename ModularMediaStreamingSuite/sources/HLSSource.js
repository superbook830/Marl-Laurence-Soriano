class HLSSource {
  constructor() {
    this.stream = "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8";
  }

  getStream() {
    return this.stream;
  }

  attachToVideo(videoElement) {
    if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
      // Safari supports native HLS
      videoElement.src = this.stream;
    } else if (window.Hls && Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(this.stream);
      hls.attachMedia(videoElement);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        videoElement.play();
      });
    } else {
      console.error("HLS not supported in this browser");
      alert("HLS is not supported in this browser. Try Chrome or Edge.");
    }
  }
}