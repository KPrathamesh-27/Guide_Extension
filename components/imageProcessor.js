class ImageProcessor {
    constructor(baseUrl = 'http://localhost:3000') {
        this.baseUrl = baseUrl;
    }

    async processImage(imageDataUrl, userInput) {
        const formData = new FormData();
        const blob = this.dataURLToBlob(imageDataUrl);
        formData.append("image", blob, "capture.png");
        formData.append("userInput", userInput);

        const response = await fetch(`${this.baseUrl}/process-image`, {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    }

    dataURLToBlob(dataURL) {
        const byteString = atob(dataURL.split(",")[1]);
        const mimeString = dataURL.split(",")[0].split(":")[1].split(";")[0];
        const arrayBuffer = new ArrayBuffer(byteString.length);
        const uint8Array = new Uint8Array(arrayBuffer);

        for (let i = 0; i < byteString.length; i++) {
            uint8Array[i] = byteString.charCodeAt(i);
        }

        return new Blob([uint8Array], { type: mimeString });
    }
}

export default ImageProcessor;