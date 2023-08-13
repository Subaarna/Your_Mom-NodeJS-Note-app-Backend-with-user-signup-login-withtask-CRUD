const express = require("express");
const router = express.Router();
const posts = require("../controller/userController");
const userController = require('../controller/userController');
const addTask = require("../controller/userController");



router.get('/posts', (req, res) => {
    res.json(posts);
});

router.post('/signup', userController.createUser);
router.post('/login', userController.login);
router.post('/addtask',userController.addTask);

module.exports = router;