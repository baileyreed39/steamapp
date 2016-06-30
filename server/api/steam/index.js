'use strict';

var express = require('express');
var controller = require('./steam.controller');

var router = express.Router();

router.get('/news', controller.news);
router.get('/friends', controller.friends);
router.get('/profile', controller.profile);
//router.get('/friendProfiles', controller.friendProfiles);
//router.get('/myGames', controller.myGames);
// router.get('/:id', controller.show);
// router.post('/', controller.create);
// router.put('/:id', controller.update);
// router.patch('/:id', controller.update);
// router.delete('/:id', controller.destroy);

module.exports = router;