document.getElementById("capture-btn").addEventListener("click", () => {
  // Get the current active tab
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const currentTab = tabs[0];

    if (!currentTab) {
      alert("Cannot capture this tab: Restricted page.");
      return;
    }

    chrome.tabCapture.capture(
      {
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
      },
      (stream) => {
        if (chrome.runtime.lastError) {
          console.log("Error capturing tab:", chrome.runtime.lastError.message);
          return;
        }

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        const video = document.createElement("video");

        video.srcObject = stream;
        video.play();

        video.onloadedmetadata = () => {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;

          // Draw the video frame onto the canvas
          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          // Convert canvas to a downloadable image
          const frame = canvas.toDataURL("image/png");
          // Stop the video stream
          stream.getTracks().forEach((track) => track.stop());
          // Send the image and additional input to the backend
          sendToBackend(frame);
        };
      }
    );
  });
});

async function sendToBackend(imageDataUrl) {
  console.log("Sending image to backend...");

  const userInput = document.getElementById("user-input")?.value || "";
  const formData = new FormData();

  const resultDiv = document.getElementById("result");
  const timeTakenDiv = document.getElementById("time-taken");
  const loadingDiv = document.getElementById("loading");

  // Show the loading spinner and hide previous results
  resultDiv.style.display = "none";
  timeTakenDiv.innerText = "";
  loadingDiv.style.display = "block";

  console.time("Backend Request Time");
  const startTime = performance.now();

  try {
    // Convert DataURL to Blob and append it
    const blob = dataURLToBlob(imageDataUrl);
    formData.append("image", blob, "capture.png");
    formData.append("userInput", userInput);

    // Send request to backend
    const response = await fetch("http://localhost:3000/process-image", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();
    const endTime = performance.now();
    console.timeEnd("Backend Request Time");

    // Hide loading and show result
    loadingDiv.style.display = "none";
    resultDiv.style.display = "block";
    
    if (response.ok) {
      // Split the generatedText into lines based on points
      const points = result.generatedText.split(/\d+\.\s/).filter(Boolean);
    
      let formattedResult = `<strong>Here are the key points:</strong><br><ul>`;
      points.forEach(point => {
        formattedResult += `<li>${point.trim()}</li>`;
      });
      formattedResult += `</ul>`;
    
      resultDiv.innerHTML = formattedResult;
    } else {
      resultDiv.innerHTML = `<strong>Error:</strong> ${result.message}`;
    }
    

    // Display time taken
    const timeTaken = ((endTime - startTime) / 1000).toFixed(2); // in seconds
    timeTakenDiv.innerText = `Time Taken: ${timeTaken} seconds`;

  } catch (error) {
    const endTime = performance.now();
    loadingDiv.style.display = "none";
    console.error("Error sending to backend:", error);

    resultDiv.style.display = "block";
    resultDiv.innerHTML = `<strong>Connection Error:</strong> Failed to connect to the backend.`;

    const timeTaken = ((endTime - startTime) / 1000).toFixed(2);
    timeTakenDiv.innerText = `Time Taken: ${timeTaken} seconds`;
  }
}

// Helper function: Convert DataURL to Blob
function dataURLToBlob(dataURL) {
  const byteString = atob(dataURL.split(",")[1]);
  const mimeString = dataURL.split(",")[0].split(":")[1].split(";")[0];
  const arrayBuffer = new ArrayBuffer(byteString.length);
  const uint8Array = new Uint8Array(arrayBuffer);

  for (let i = 0; i < byteString.length; i++) {
    uint8Array[i] = byteString.charCodeAt(i);
  }

  return new Blob([uint8Array], { type: mimeString });
}
