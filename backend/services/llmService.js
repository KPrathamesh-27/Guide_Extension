const { HfInference } = require('@huggingface/inference');

class LLMService {
    constructor(apiKey) {
        this.client = new HfInference(apiKey);
    }

    async processText(ocrText, userInput, imageFile) {
        try {
            const messages = this.constructMessages(ocrText, userInput, imageFile);
            const chatCompletion = await this.client.chatCompletion({
                model: "meta-llama/Llama-3.2-11B-Vision-Instruct",
                messages,
                max_tokens: 500,
                temperature: 0.7,
                top_p: 0.9,
                repetition_penalty: 1.2
            });

            return this.formatResponse(chatCompletion);
        } catch (error) {
            console.error('LLM Processing Error:', error);
            throw new Error('Failed to process text with LLM');
        }
    }

    constructMessages(ocrText, userInput, imageFile) {
        const messages = [
            {
                role: "system",
                content: "You are an intelligent assistant that analyzes screen captures and extracted text. Provide clear, concise insights and summaries."
            },
            {
                role: "user",
                content: [
                    {
                        type: "text",
                        text: `Analyze the following extracted text: ${ocrText}`
                    }
                ]
            }
        ];

        if (userInput) {
            messages.push({
                role: "user",
                content: [
                    {
                        type: "text",
                        text: userInput
                    }
                ]
            });
        }

        // Optionally add image data if needed
        if (imageFile && imageFile.buffer) {
            const imageData = {
                type: "image_url",
                image_url: {
                    url: `data:${imageFile.mimetype};base64,${imageFile.buffer.toString('base64')}`
                }
            };
            messages[1].content.push(imageData);
        }

        return messages;
    }

    formatResponse(chatCompletion) {
        if (!chatCompletion.choices || chatCompletion.choices.length === 0) {
            throw new Error('Invalid response from LLM');
        }

        const response = chatCompletion.choices[0].message.content;
        
        // Format response into numbered points if it isn't already
        if (!response.match(/^\d+\./m)) {
            const points = response.split('\n').filter(line => line.trim());
            return points.map((point, index) => `${index + 1}. ${point}`).join('\n');
        }

        return response;
    }
}
module.exports = { LLMService };