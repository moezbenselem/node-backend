const path = require('path');

const express = require("express");

const adminController = require('../controllers/admin');

const router = express.Router();


// admin/add-event with GET
//router.get('/add-event',adminController.getAddEvent);
// admin/events with GET
router.post('/events',adminController.postEvents);

router.post('/delete-event/',adminController.postDelete);

// admin/add-event with POST
router.post('/add-event',adminController.postAddEvent);
router.post('/edit-event',adminController.postEditEvent);

//router.get('/register', adminController.getRegister);
//router.get('/login', adminController.getLogin);

router.post('/register', adminController.postRegister);
router.post('/login', adminController.postLogin);
router.post('/auth', adminController.postIsAuth);


module.exports = router;