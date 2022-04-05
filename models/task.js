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
        default:new Date('2022-04-14')
    }
});

const Task = mongoose.model('Task',taskSchema);
module.exports = Task;