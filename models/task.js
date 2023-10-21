const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
    description:{
        type: String,
        required:true,
    },
    completed:{
        type: String,
        required: true,
    },
    deadline:{
        type:Date,
        required:true,
        default:new Date('2023-08-10')
    }
});

const Task = mongoose.model('Task',taskSchema);
module.exports = Task;