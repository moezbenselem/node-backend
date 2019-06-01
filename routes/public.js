const path = require('path');

const express = require('express');

const publicController = require('../controllers/public');

const router = express.Router();


router.get('/events/:eventId',publicController.getEvent);
router.get('/events', publicController.getEvents);
router.get('/myEvents', publicController.getMyEvents);

router.post('/myEvents', publicController.postParticipate);
router.get('/remove/:eventId', publicController.postRemove);
//router.get('/products/:productId', publicController.getProduct);


module.exports = router;
