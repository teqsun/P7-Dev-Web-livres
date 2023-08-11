const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')
const multer = require('../middleware/multer-config')
const optimizeImage = require('../middleware/sharp');

const stuffCtrl = require('../controllers/stuff')

router.get('/', stuffCtrl.getAllBook);
router.post('/',auth,multer,optimizeImage, stuffCtrl.createBook)

router.get('/bestrating', stuffCtrl.bestRating)

router.get('/:id', stuffCtrl.getOneBook );
router.put('/:id',auth, multer,optimizeImage, stuffCtrl.modifyBook ); 
router.delete('/:id',auth,multer, stuffCtrl.deleteBook); 

router.post('/:id/rating', auth,optimizeImage , stuffCtrl.postRating)

module.exports = router;