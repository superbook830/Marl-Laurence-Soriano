# 🎬 Modular Media Streaming Suite

A modular, front-end media player built with plain JavaScript — supporting **local MP4 playback**, **HLS streaming**, **remote API sources**, and **optional plugins** like subtitles, equalizer FX, and watermark overlay.

---

## 🧩 Features

- Modular structure (Renderer, Sources, Plugins)
- Supports:
  - Local MP4 files
  - HLS streams (`.m3u8`)
  - Remote API video sources
- Plugin toggles for:
  - Subtitles
  - Equalizer effects
  - Watermark overlay
- Works offline with Service Worker caching
- Uses [HLS.js](https://github.com/video-dev/hls.js) for adaptive streaming

---

## 🏗 Folder Structure

```
ModularMediaStreamingSuite/
├── index.html
├── app.js
├── sw.js
│
├── assets/
│   ├── favicon.ico
│   ├── logo.png
│
├── renderer/
│   ├── Renderer.js
│   ├── HardwareRenderer.js
│   └── SoftwareRenderer.js
│
├── sources/
│   ├── LocalSource.js
│   ├── HLSSource.js
│   ├── RemoteAPISource.js
│   └── ProxySource.js
│
├── plugins/
│   ├── PluginManager.js
│   ├── SubtitlePlugin.js
│   ├── EqualizerPlugin.js
│   └── WatermarkPlugin.js
│
└── style/
    └── main.css
```

---

## 🚀 How to Run the Project

Because the Service Worker and media streaming APIs require an HTTP context,  
**you must run the project on a local web server**, not just open it by double-clicking.

### 🧰 Option 1: Using Python (Quick Start)

```bash
# Navigate to the project folder
cd ModularMediaStreamingSuite

# Run a local web server on port 8080
python -m http.server 8080
```

Then open your browser to:

👉 http://localhost:8080

---

### 🧰 Option 2: Using Node.js (http-server)

If you have Node.js installed:

```bash
npm install -g http-server
http-server . -p 8080
```

Then open:

👉 http://localhost:8080

---

## 🎥 Running the Demo

Once opened in your browser:

1. Choose a **Media Source**:
   - ▶️ “Play Local File” → select an MP4 file
   - 🌐 “Stream HLS” → plays from sample HLS link
   - ☁️ “Remote API” → plays from demo MP4 URLs

2. Select **Renderer** (Hardware or Software)

3. Toggle plugins (Subtitles, Equalizer, Watermark)

4. Enjoy playback and test modules dynamically.

---

## 🧪 Testing

There are no automated tests — but you can manually test:

- Source modules (`Local`, `HLS`, `Remote API`)
- Renderer switching (`Hardware`, `Software`)
- Plugin toggles
- Caching via Service Worker (try reloading offline)

To verify caching:
1. Run once online.
2. Disconnect internet.
3. Reload — cached assets and videos should still play (if cached).

---

## 🧩 Notes

- Service Worker won’t work if opened directly via `file://`
- Works best in **Chrome, Edge, or Firefox**
- Demo public MP4s are included in `RemoteAPISource.js`

---

## 🖼️ Credits

- **HLS.js** – Adaptive video playback
- **Open source demo MP4s** – Sample public media for testing
- Built with ❤️ using **plain JavaScript**
