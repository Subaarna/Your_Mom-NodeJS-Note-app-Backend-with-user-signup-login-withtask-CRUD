const express = require("express");
const router = express.Router();
const posts = require("../controller/userController");
const userController = require('../controller/userController');
const upload = require ('../helpers/profileHelper');


router.get('/posts', (req, res) => {
    res.json(posts,);
});

router.post('/signup', userController.createUser);
router.post('/login', userController.login);
router.post('/addtask',userController.addTask);
router.put('/updatetask', userController.updateTask);
router.get('/getalltask', userController.getAllTasks);
router.delete('/deletetask', userController.deleteTask);
router.delete('/deleteuser', userController.deleteUser);

router.post('/upload-profile-picture', upload.single('profilePicture'), userController.uploadProfile);

router.get("/profile-picture/:userId", userController.getProfilePicture);

router.get("/getuser", userController.getUserByAuth);
router.get("/getAllUsers", userController.getAllUsers);



module.exports = router;