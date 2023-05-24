const express = require('express');

const router = express.Router();
const auth = require('../middelware/auth');
const multer = require('../middelware/multer-config');
const bookCtrl = require('../controllers/book');


router.get('/', bookCtrl.getAllBooks);
router.post('/', auth, multer, bookCtrl.createBook);
router.get('/bestrating', bookCtrl.bestRating)
router.get('/:id', bookCtrl.getOneBook);
router.put('/:id', auth, multer, bookCtrl.modifyBook);
router.delete('/:id', auth, bookCtrl.deleteBook);
router.post('/:id/rating', auth, bookCtrl.ratingBook);


module.exports = router;