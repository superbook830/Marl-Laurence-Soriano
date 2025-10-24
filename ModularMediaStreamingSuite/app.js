window.addEventListener("DOMContentLoaded", () => {
  // ================================
  // SERVICE WORKER: REMOTE-PROXY + CACHE STREAMS
  // ================================
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("sw.js")
      .then((reg) => console.log("✅ Service Worker registered:", reg.scope))
      .catch((err) => console.error("Service Worker registration failed:", err));
  }

  // ================================
  // CORE INITIALIZATION
  // ================================
  const video = document.getElementById("mediaPlayer");
  const player = new MediaFacade(video);
  const pluginManager = new PluginManager(video);

  const rendererSelect = document.getElementById("rendererSelect");
  const btnLocal = document.getElementById("btnLocal");
  const btnHLS = document.getElementById("btnHLS");
  const btnAPI = document.getElementById("btnAPI");

  const chkSub = document.getElementById("subtitles");
  const chkEq = document.getElementById("equalizer");
  const chkWM = document.getElementById("watermark");
  const playlistContainer = document.getElementById("playlistContainer");

  let currentPlaylist = [];
  let currentIndex = -1;

  // ================================
  // DEFAULT RENDERER + OVERLAY MESSAGE
  // ================================
  player.setRenderer(new HardwareRenderer());

  const overlayMsg = document.createElement("div");
  overlayMsg.id = "rendererOverlay";
  overlayMsg.style.position = "absolute";
  overlayMsg.style.top = "10px";
  overlayMsg.style.right = "10px";
  overlayMsg.style.padding = "8px 14px";
  overlayMsg.style.background = "rgba(0,0,0,0.7)";
  overlayMsg.style.color = "white";
  overlayMsg.style.fontSize = "14px";
  overlayMsg.style.borderRadius = "10px";
  overlayMsg.style.transition = "opacity 0.6s ease";
  overlayMsg.style.opacity = "0";
  overlayMsg.style.pointerEvents = "none";
  overlayMsg.style.zIndex = "99";
  document.getElementById("player-container").appendChild(overlayMsg);

  // Renderer overlay
  function showRendererOverlay(type) {
    overlayMsg.textContent = `Rendered with ${type} Renderer`;
    overlayMsg.style.opacity = "1";
    setTimeout(() => (overlayMsg.style.opacity = "0"), 2500);
  }

  // 🟢 Proxy caching overlay
  function showProxyOverlay(status) {
    overlayMsg.textContent = status;
    overlayMsg.style.opacity = "1";
    setTimeout(() => (overlayMsg.style.opacity = "0"), 2500);
  }

  showRendererOverlay("Hardware");

  // ================================
  // RENDERER SWITCHING
  // ================================
  rendererSelect.addEventListener("change", () => {
    const type = rendererSelect.value;
    const renderer =
      type === "hardware" ? new HardwareRenderer() : new SoftwareRenderer();
    player.setRenderer(renderer);
    showRendererOverlay(type === "hardware" ? "Hardware" : "Software");
  });

  // ================================
  // SOURCE HANDLERS
  // ================================
  btnLocal.addEventListener("click", async () => {
    const source = new LocalSource();
    try {
      await source.selectFile();
      player.playSource(source);
    } catch (err) {
      console.error("Local file selection failed:", err);
    }
  });

  btnHLS.addEventListener("click", () => {
    const source = new HLSSource();
    player.playSource(source);
  });

  btnAPI.addEventListener("click", () => {
    const source = new RemoteAPISource();
    player.playSource(source);
  });

  // ================================
  // PLUGIN TOGGLES
  // ================================
  const handlePluginToggle = (checkbox, PluginClass) => {
    checkbox.addEventListener("change", () => {
      if (checkbox.checked) pluginManager.applyPlugin(new PluginClass());
      else pluginManager.removePlugin(PluginClass);
    });
  };

  handlePluginToggle(chkSub, SubtitlePlugin);
  handlePluginToggle(chkEq, EqualizerPlugin);
  handlePluginToggle(chkWM, WatermarkPlugin);

  // ================================
  // COMPOSITE PLAYLIST FEATURE
  // ================================
  async function loadPlaylist(folderPath = "playlist") {
    try {
      playlistContainer.innerHTML = `<p>Loading playlist...</p>`;
      const res = await fetch(`${folderPath}/index.json`);
      const playlistItems = await res.json();
      currentPlaylist = playlistItems;
      playlistContainer.innerHTML = "";

      if (folderPath !== "playlist") {
        const backBtn = createPlaylistItem("⬅️ Back", "back");
        backBtn.addEventListener("click", () => {
          const parentPath = folderPath.split("/").slice(0, -1).join("/");
          loadPlaylist(parentPath || "playlist");
        });
        playlistContainer.appendChild(backBtn);
      }

      playlistItems.forEach((item, index) => {
        if (item.type === "file" || item.type === "url") {
          const videoItem = createPlaylistItem(`🎬 ${item.name}`, "file");
          videoItem.addEventListener("click", () => {
            playItem(item, folderPath, index);
            highlightActiveItem(videoItem);
          });
          playlistContainer.appendChild(videoItem);
        } else if (item.type === "folder") {
          const folderItem = createPlaylistItem(`📁 ${item.name}`, "folder");
          folderItem.addEventListener("click", () => {
            loadPlaylist(`${folderPath}/${item.name}`);
          });
          playlistContainer.appendChild(folderItem);
        }
      });
    } catch (error) {
      playlistContainer.innerHTML = `
        <p>⚠️ Could not load playlist. Ensure index.json exists in <code>${folderPath}</code>.</p>
      `;
      console.error("Error loading playlist:", error);
    }
  }

  // ================================
  // PLAY VIDEO (LOCAL OR REMOTE + HLS)
  // ================================
  function playItem(item, folderPath, index) {
    currentIndex = index;
    const sourcePath = item.path || item.url || `${folderPath}/${item.name}`;
    const finalPath = sourcePath.startsWith("http")
      ? sourcePath
      : `${sourcePath}`;

    // 🟢 Show proxy overlay when playing a remote file
    if (finalPath.startsWith("http")) {
      showProxyOverlay("Streaming via Proxy Cache...");
    }

    if (finalPath.endsWith(".m3u8")) {
      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(finalPath);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => video.play());
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = finalPath;
        video.play();
      } else {
        alert("HLS not supported on this browser.");
      }
    } else {
      video.src = finalPath;
      video.play();
    }

    // 🟢 Notify when cache completes (after fetch)
    caches.match(finalPath).then((cacheHit) => {
      if (cacheHit) {
        showProxyOverlay("✅ Serving from Cache");
      }
    });
  }

  // Auto-play next video
  video.addEventListener("ended", () => {
    if (currentPlaylist.length > 0 && currentIndex < currentPlaylist.length - 1) {
      const nextItem = currentPlaylist[currentIndex + 1];
      if (nextItem.type === "file" || nextItem.type === "url") {
        playItem(nextItem, "playlist", currentIndex + 1);
        highlightActiveItem(playlistContainer.children[currentIndex + 1]);
      }
    }
  });

  // ================================
  // UI HELPERS
  // ================================
  function createPlaylistItem(label, type) {
    const item = document.createElement("div");
    item.className = `playlist-item playlist-${type}`;
    item.textContent = label;
    return item;
  }

  function highlightActiveItem(selectedItem) {
    document
      .querySelectorAll(".playlist-item")
      .forEach((el) => el.classList.remove("active"));
    selectedItem.classList.add("active");
  }

  // Initialize playlist
  loadPlaylist();
});