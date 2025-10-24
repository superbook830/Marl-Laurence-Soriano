class RemoteAPISource {
  constructor() {
    // These are direct-access MP4 demo streams (CORS-safe)
    const demoVideos = [
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4"
    ];

    // Pick one at random each time
    this.stream = demoVideos[Math.floor(Math.random() * demoVideos.length)];
  }

  getStream() {
    return this.stream;
  }
}
