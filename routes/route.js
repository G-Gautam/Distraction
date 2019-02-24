const express = require('express');
const router = express.Router();

// Require the controllers WHICH WE DID NOT CREATE YET!!
const product_controller = require('../controllers/controller');


// a simple test url to check that all of our files are communicating correctly.
router.post('/pdfOnline', product_controller.pdfOnline);

router.post('/article', product_controller.article);

router.post('/youtubeSub', product_controller.ytSub);

router.post('/youtubeTag', product_controller.ytTag);

// router.get('/compare', product_controller.compare);



module.exports = router;
