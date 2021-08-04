const path = require('path');
const express = require('express');
require('./src/DB/mongoose');
const userRoutes = require('./src/routes/userRoutes');
const taskRoutes = require('./src/routes/taskRoutes');
const { env } = require('process');

const app = express();
app.use(express.json()); //parse data into object
//to serve static folder in images folder to images
app.use(express.static(path.join( __dirname, './src/avatar')));

app.use('/users', userRoutes);
app.use('/tasks', taskRoutes);

app.listen(env.PORT, () => {
    console.log(`server is up on port ${env.PORT}`);
});

// const taskModel = require('./src/models/taskModel');
// const userModel = require('./src/models/userModel');

// const main = async () => {
//     // const task = await taskModel.findById('60a1d9a50b78560458960f00')
//     // //.populate('createdBy');
//     // await task.populate('createdBy', {password: 0, tokens: 0})//.execPopulate()
//     // console.log(task.createdBy);
//     const user = await userModel.findById('60a1d5c670e94123a80c1fff')
//     .populate('tasks');
//     console.log(user.tasks);
// }
// main();