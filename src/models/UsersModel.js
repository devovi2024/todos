const mongoose = require('mongoose');
const DataSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String },
    mobile: { type: String },
    password: { type: String, required: true },
    photo: { type: String },
    createdDate: { type: Date, default: Date.now }
  },
  { versionKey: false }
);

const UsersModel = mongoose.model('users', DataSchema);
module.exports = UsersModel;
