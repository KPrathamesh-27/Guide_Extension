const multer = require('multer');

let fileType;

(async () => {
    const { fileTypeFromBuffer } = await import('file-type');
    fileType = fileTypeFromBuffer;
})();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    }
}).single('image');

const imageValidation = async (req, res, next) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({
                success: false,
                message: 'File upload error'
            });
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No image uploaded'
            });
        }

        try {
            const fileTypeResult = await fileType(req.file.buffer);
            if (!fileTypeResult || !['image/jpeg', 'image/png'].includes(fileTypeResult.mime)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid file type. Only JPEG and PNG are supported.'
                });
            }

            req.file.mimetype = fileTypeResult.mime;
            next();
        } catch (error) {
            console.error('File validation error:', error);
            return res.status(500).json({
                success: false,
                message: 'Error validating file'
            });
        }
    });
};

module.exports = { imageValidation };