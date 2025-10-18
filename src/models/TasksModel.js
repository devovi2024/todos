const mongoose = require('mongoose');

const DataSchema = new mongoose.Schema(
  {
    email: { type: String },
    title: { type: String },
    description: { type: String },
    status: { type: String},
    createdDate: { type: Date, default: Date.now }
  },
  { versionKey: false }
);

const TasksModel = mongoose.model('tasks', DataSchema);
module.exports = TasksModel;
