const mongoose = require('mongoose');
const schema = mongoose.Schema;
const taskSchema = schema({
    description: {
        type: String,
    },
    completed: {
        type: Boolean,
        default: false
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' 
    }
}, {
    Timestamp: true
}
);

module.exports = mongoose.model('Task', taskSchema);