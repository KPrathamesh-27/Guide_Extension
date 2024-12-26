const Tesseract = require('tesseract.js');

class OCRService {
    async extractText(imageBuffer) {
        const { data: { text } } = await Tesseract.recognize(
            imageBuffer,
            'eng+spa+fra+deu+ita+por+rus+chi_sim+chi_tra+jpn+kor',
        );
        return text;
    }
}
module.exports = { OCRService };