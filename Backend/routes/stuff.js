const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')
const multer = require('../middleware/multer-config')

const stuffCtrl = require('../controllers/stuff')

router.get('/', stuffCtrl.getAllBook);
router.post('/',auth,multer, stuffCtrl.createBook)

router.get('/bestrating', stuffCtrl.bestRating)

router.get('/:id', stuffCtrl.getOneBook );
router.put('/:id',auth, multer, stuffCtrl.modifyBook ); 
router.delete('/:id',auth,multer, stuffCtrl.deleteBook); 

router.post('/:id/rating', auth, stuffCtrl.postRating)

module.exports = router;