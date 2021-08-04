const taskModel = require('../models/taskModel');

exports.createTask = async (req, res) => {
    try {
        //const task = new taskModel(req.body);
        const task = new taskModel({
            ...req.body,
            createdBy: req.userId
        });
        await task.save();
        return res.status(201).send(task);

    } catch (e) {
        return res.status(401).send(e);
    }
}

exports.findAllTasks = async (req, res) => {
    try {
        //da l filter
        const match = {};
        if (req.query.completed) {
            match.completed = req.query.completed === 'true'
        }
        //da l pagination
        //const tasksPerPage = 2;
        const limit = req.query.limit ? parseInt(req.query.limit) : 10;
        const skip = req.query.skip ? parseInt(req.query.skip) : 0;
        //da ll sort ?sortBy=createdBy:desc
        const sort = {};
        if (req.query.sortBy) {
            const parts = req.query.sortBy.split(':'); // [createdby, desc]
            sort[parts[0]] = parts[1] === 'desc' ? -1 : 1; 
        }
        const tasks = await taskModel.find({createdBy: req.userId, ...match})
        .skip(skip).limit(limit).sort(sort);
        //.sort({'description': -1});
        // const tasks = await taskModel.find({createdBy: req.userId, ...match}, 
        // ['description', 'completed'],
        // {limit: limit, skip: skip, sort: {'description': -1}}); //desc da y3ni -1
        return res.status(200).send({search_result: tasks.length, tasks});
    } catch (e) {
        return res.status(500).send(e);
    }
}

exports.findOneTask = async (req, res) => {
    try {
        const taskId = req.params.id;
        //const task = await taskModel.findById(taskId);
        const task = await taskModel.findOne({_id: taskId, createdBy: req.userId});
        if(!task) {
            return res.status(404).send("you're not authorized to perform this operation");
        }
        return res.status(200).send(task);
    } catch(e) {
        return res.status(500).send(e);
    }
}

exports.updateTask = async (req, res) => {
    //to check that body element are what in model
    const updates = Object.keys(req.body);
    const allowedUpdates = ['description', 'completed'];
    const isValid = updates.every(el => {
        return allowedUpdates.includes(el);
    })
    if(!isValid) {
        return res.status(400).send({err: 'invalid updates'});
    }
    try {
        //const task = await taskModel.findByIdAndUpdate(req.params.id, req.body, {new: true});
        //const task = await taskModel.findById(req.params.id);
        const task = await taskModel.findOne({_id: req.params.id, createdBy: req.userId});
        if (!task) {
            return res.status(404).send("you're not authorized to perform this operation");
        }
        updates.forEach(el => {
            return task[el] = req.body[el];
        });
        await task.save();
        res.status(200).send(task);
    } catch(e) {
        return res.status(500).send(e);
    }
}

exports.deletetask = async (req, res) => {
    try {
        //const task = await taskModel.findByIdAndDelete(req.params.id);
        const task = await taskModel.findOneAndDelete({_id: req.params.id, createdBy: req.userId});
        if (!task) {
            return res.status(404).send("you're not authorized to perform this operation");
        }
        res.status(200).send(task);
    } catch (e) {
        res.status(500).send(e);
    }
}