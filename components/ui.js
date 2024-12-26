class UI {
    constructor() {
        this.resultDiv = document.getElementById("result");
        this.timeTakenDiv = document.getElementById("time-taken");
        this.loadingDiv = document.getElementById("loading");
        this.progressBar = document.querySelector(".progress-fill");
    }

    showLoading() {
        this.resultDiv.style.display = "none";
        this.timeTakenDiv.innerText = "";
        this.loadingDiv.style.display = "block";
        this.startProgress();
    }

    hideLoading() {
        this.loadingDiv.style.display = "none";
        this.stopProgress();
    }

    startProgress() {
        this.progressBar.style.width = "0%";
        this.progressInterval = setInterval(() => {
            const currentWidth = parseInt(this.progressBar.style.width);
            if (currentWidth < 90) {
                this.progressBar.style.width = `${currentWidth + 1}%`;
            }
        }, 100);
    }

    stopProgress() {
        clearInterval(this.progressInterval);
        this.progressBar.style.width = "100%";
        setTimeout(() => {
            this.progressBar.style.width = "0%";
        }, 200);
    }

    displayResult(result) {
        this.resultDiv.style.display = "block";
        const points = result.generatedText.split(/\d+\.\s/).filter(Boolean);
        
        let formattedResult = `<div class="result-header">Key Insights:</div><ul class="result-list">`;
        points.forEach(point => {
            formattedResult += `<li class="result-item">${point.trim()}</li>`;
        });
        formattedResult += `</ul>`;
        
        this.resultDiv.innerHTML = formattedResult;
    }

    displayError(error) {
        this.resultDiv.style.display = "block";
        this.resultDiv.innerHTML = `
            <div class="error-message">
                <span class="error-icon">⚠️</span>
                <span class="error-text">${error.message}</span>
            </div>
        `;
    }

    updateTimeTaken(startTime) {
        const timeTaken = ((performance.now() - startTime) / 1000).toFixed(2);
        this.timeTakenDiv.innerText = `Processed in ${timeTaken} seconds`;
    }
}

export default UI;