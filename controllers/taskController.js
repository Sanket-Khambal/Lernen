const { db } = require('../models/task');
const Task = require('../models/task');

const task_index = (req, res) => {
  Task.find()
    .then(result => {
      res.render('dashboard', { tasks: result, title: 'All tasks' });
    })
    .catch(err => {
      console.log(err);
    });
}

const task_details = (req, res) => {
  const id = req.params.id;
  console.log(id)
  Task.findById(id)
    .then(result => {
      console.log(result)
      res.render('details', { task: result, title: 'Task Details' });
    })
    .catch(err => {
      console.log(err);
      res.render('404', { title: 'Task not found' });
    });
}

const task_create_get = (req, res) => {
  res.render('create', { title: 'Create a new task' });
}

const task_create_post = (req, res) => {
  console.log(req.body)
  const task =  Task(req.body);
  task.save()
    .then(result => {
      res.redirect('/tasks');
    })
    .catch(err => {
      console.log(err);
    });
}

const task_delete = (req, res) => {
  const id = req.params.id;
  Task.findByIdAndDelete(id)
    .then(result => {
      res.json({ redirect: '/tasks' });
    })
    .catch(err => {
      console.log(err);
    });
}

const task_update = (req,res)=>{
  var query = {completed:"false"};
  var newquery = {$set:{completed:"true"}};
  Task.updateOne(query,newquery)
    .then(result=>{
      res.json({redirect:'/tasks'});
    })
    .catch(err=>{
      console.log(err);
    })
}

module.exports = {
  task_index, 
  task_details, 
  task_create_get, 
  task_create_post,
  task_delete, 
  task_update
}