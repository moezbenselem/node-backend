const path = require('path');

const express = require('express');

const publicController = require('../controllers/public');

const router = express.Router();


router.get('/events/:eventId',publicController.getEvent);
router.get('/events', publicController.getEvents);
router.post('/myEvents', publicController.getMyEvents);

router.post('/participate', publicController.postParticipate);
router.post('/remove', publicController.postRemove);
//router.get('/products/:productId', publicController.getProduct);


module.exports = router;
