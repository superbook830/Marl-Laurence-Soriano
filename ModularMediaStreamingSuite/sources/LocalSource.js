class LocalSource {
  constructor() {
    this.stream = null;
  }

  async selectFile() {
    return new Promise((resolve, reject) => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "video/*";

      input.onchange = (event) => {
        const file = event.target.files[0];
        if (file) {
          this.stream = URL.createObjectURL(file);
          resolve(this.stream);
        } else {
          reject("No file selected");
        }
      };

      input.click();
    });
  }

  getStream() {
    return this.stream;
  }
}