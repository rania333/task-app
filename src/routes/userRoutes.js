const express = require('express');
const userController = require('../controllers/userController');
const auth = require('../middlwares/auth');
const upload = require('../middlwares/fileUploads');

const router = express.Router();

router.post('/login', userController.login);
router.post('/logout', auth, userController.logout);
router.post('/logoutAll', auth, userController.logoutAll);
router.post('/', userController.createUser);
router.get('/me', auth, userController.myProfile);
router.get('/:id', userController.findOneUser)
router.get('/', auth, userController.findAllUsers)
router.patch('/me', auth, userController.updateUser)
router.delete('/me',auth , userController.deleteUser)
router.post('/me/avatar', auth, upload.single('pic'), userController.addAvatar
, (err, req, res, nxt) => { //l rab3a de to handle error
    res.status(400).send({
        error: err.message
    });
});
router.delete('/me/avatar', auth, userController.deleteAvatar);
router.get('/:id/avatar', userController.getAvatar);

module.exports = router;