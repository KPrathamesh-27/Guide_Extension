const express = require('express');
let fileType;
(async () => {
  fileType = (await import("file-type")).fileTypeFromBuffer;
})();
const { imageValidation } = require('./middleware/imageValidation.js');
const { OCRService } = require('./services/ocrService.js');
const { LLMService } = require('./services/llmService.js');
const config = require('./config.js');
const cors = require('cors');

const app = express();
app.use(cors());

const ocrService = new OCRService();
const llmService = new LLMService(config.hfApiKey);

app.post("/process-image", 
    imageValidation,
    async (req, res) => {
        try {
            // Extract text using OCR
            const ocrText = await ocrService.extractText(req.file.buffer);
            
            // Process with LLM
            const llmResponse = await llmService.processText(
                ocrText,
                req.body.userInput,
                req.file
            );
            
            res.json({
                success: true,
                ocrText,
                generatedText: llmResponse
            });
        } catch (error) {
            console.error("Error processing image:", error);
            res.status(500).json({ 
                success: false,
                message: "Error processing image" 
            });
        }
    }
);

const PORT = config.port || 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});