const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const fs = require('fs')
const maxSize = 2 * 1024 * 1024; // 2MB

const storage = (destination) => multer.diskStorage({
    destination: (req, file, cb) => {
        const relativePath = destination ? destination : 'uploads';
        cb(null, path.join(__dirname, '..', 'public', relativePath));
    },
    filename: (req, file, cb) => {
        const fileExt = path.extname(file.originalname);
        const randomName = crypto.randomBytes(16).toString('hex');
        cb(null, `${randomName}${fileExt}`);
    },
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = /\.(jpg|jpeg|png|gif)$/;
    if (!allowedTypes.test(path.extname(file.originalname).toLowerCase())) {
        return cb(new Error('Only JPG, JPEG, PNG, and GIF files are allowed.'), false);
    }
    cb(null, true);
};

const upload = (destination) => multer({
    storage: storage(destination),
    fileFilter,
    limits: { fileSize: maxSize },
});



const deleteFile = (relativeFilePath) => {
    const absoluteFilePath = path.join(__dirname, '..', 'public', relativeFilePath);
    fs.unlink(absoluteFilePath, (err) => {
        if (err) {
            console.error(`Error deleting file: ${absoluteFilePath}`, err);
        } else {
            console.log(`File deleted: ${absoluteFilePath}`);
        }
    });
};

module.exports = { upload, deleteFile };
