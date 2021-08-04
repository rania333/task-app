const express = require('express');
const taskController = require('../controllers/taskController');
const auth = require('../middlwares/auth');
const router = express.Router();

router.post('/', auth, taskController.createTask);
router.get('/:id', auth, taskController.findOneTask);
router.get('/', auth, taskController.findAllTasks);
router.patch('/:id', auth, taskController.updateTask);
router.delete('/:id', auth, taskController.deletetask);

module.exports = router