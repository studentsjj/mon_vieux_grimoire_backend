const multer = require('multer');

const storage = multer.memoryStorage ({
    destination: (req, file, callback) => {
        callback(null, 'images');
    },
    filename: (req, file, callback) => {
        callback(null, filename);
    }
});

module.exports = multer({storage: storage}).single('image');

