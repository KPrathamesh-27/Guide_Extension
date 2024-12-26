class ScreenCapture {
  constructor() {
    this.constraints = {
      audio: false,
      video: true,
      videoConstraints: {
        mandatory: {
          minWidth: 1280,
          minHeight: 720,
          maxWidth: 1920,
          maxHeight: 1080,
        },
      },
    };
  }

  async validateTab(tab) {
    if (
      !tab ||
      tab.url.startsWith("chrome://") ||
      tab.url.startsWith("about:")
    ) {
      throw new Error("Cannot capture this tab: Restricted page.");
    }
    return true;
  }

  async captureTab() {
    const [currentTab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    await this.validateTab(currentTab);

    return new Promise((resolve, reject) => {
      chrome.tabCapture.capture(this.constraints, (stream) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
          return;
        }
        resolve(stream);
      });
    });
  }

  async captureFrame(stream) {
    const video = document.createElement("video");
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    return new Promise((resolve) => {
      video.srcObject = stream;
      video.onloadedmetadata = () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        video.play();
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        stream.getTracks().forEach((track) => track.stop());
        resolve(canvas.toDataURL("image/png"));
      };
    });
  }
}

export default ScreenCapture;
