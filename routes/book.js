const express = require('express');
const router = express.Router();
const sanitize = require('../middelware/sanitize');
const auth = require('../middelware/auth');
const multer = require('../middelware/multer-config');
const bookCtrl = require('../controllers/book');

router.post('/', auth, multer, sanitize, bookCtrl.createBook);
router.put('/:id', auth, multer, sanitize, bookCtrl.modifyBook);
router.delete('/:id', auth, bookCtrl.deleteBook);
router.post('/:id/rating', auth, sanitize, bookCtrl.ratingBook);
router.get('/bestrating', bookCtrl.bestRating)
router.get('/:id', bookCtrl.getOneBook);
router.get('/', bookCtrl.getAllBooks);

module.exports = router;