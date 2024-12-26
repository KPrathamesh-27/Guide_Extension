module.exports = {
    port: process.env.PORT || 3000,
    hfApiKey: "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",
    maxFileSize: 10 * 1024 * 1024, // 10MB
    supportedMimeTypes: ['image/jpeg', 'image/png'],
    llmModel: "meta-llama/Llama-3.2-11B-Vision-Instruct",
    cors: {
        origin: ['chrome-extension://*', 'http://localhost:*'],
        methods: ['POST'],
        allowedHeaders: ['Content-Type']
    }
};
