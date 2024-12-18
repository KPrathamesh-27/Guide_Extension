document.getElementById("capture-btn").addEventListener("click", () => {
    chrome.tabCapture.capture({ audio: false, video: true, videoConstraints: {
        mandatory: {
          minWidth: 1280,
          minHeight: 720,
          maxWidth: 1920,
          maxHeight: 1080
        }
      } 
    }, (stream) => {
      if (chrome.runtime.lastError) {
        console.error("Error capturing tab:", chrome.runtime.lastError.message);
        alert("Failed to capture the tab: " + chrome.runtime.lastError.message);
        return;
      }
  
      // Create canvas and video elements
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      const video = document.createElement("video");
  
      video.srcObject = stream;
      video.play();
  
      video.onloadedmetadata = () => {
        // Set canvas size to match the video stream
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
  
        // Draw the video frame onto the canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
  
        // Convert canvas to a downloadable image
        const frame = canvas.toDataURL("image/png");
  
        // Stop the video stream
        stream.getTracks().forEach((track) => track.stop());
  
        // Trigger the image download
        const a = document.createElement("a");
        a.href = frame;
        a.download = "tab-screenshot.png";
        a.click();
      };
    });
  });
  