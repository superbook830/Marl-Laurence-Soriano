class SubtitlePlugin {
  apply(videoElement) {
    let subtitle = document.createElement("div");
    subtitle.id = "subtitle-overlay";
    subtitle.textContent = "Now playing: Demo subtitles on screen.";
    subtitle.style.position = "absolute";
    subtitle.style.bottom = "60px";
    subtitle.style.width = "100%";
    subtitle.style.textAlign = "center";
    subtitle.style.color = "white";
    subtitle.style.textShadow = "2px 2px 4px black";
    subtitle.style.fontSize = "20px";
    subtitle.style.pointerEvents = "none";
    subtitle.style.zIndex = "98";

    videoElement.parentElement.style.position = "relative";
    videoElement.parentElement.appendChild(subtitle);
  }

  remove(videoElement) {
    const subtitle = document.getElementById("subtitle-overlay");
    if (subtitle) subtitle.remove();
  }
}