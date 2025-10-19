const jwt = require('jsonwebtoken');
const UserModel = require('../models/UsersModel');

exports.registration = async (req, res) => {
  try {
    const data = await UserModel.create(req.body);
    res.status(201).json({ status: "Success", data });
  } catch (err) {
    res.status(400).json({ status: "Fail", message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const data = await UserModel.aggregate([
      { $match: req.body },
      { $project: { _id: 0, email: 1, firstName: 1, lastName: 1, mobile: 1 } }
    ]);

    if (data.length) {
      const payload = {
        exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
        data: data[0].email
      };
      const token = jwt.sign(payload, "SecretKey123456");
      res.status(200).json({ status: "Success", token, data: data[0] });
    } else {
      res.status(401).json({ status: "Fail", message: "Unauthorized" });
    }
  } catch (err) {
    res.status(400).json({ status: "Fail", message: err.message });
  }
};

exports.profileUpdate = async (req, res) => {
  try {
    const email = req.headers['email'];
    const data = await UserModel.updateOne({ email }, req.body);
    res.status(200).json({ status: "Success", data });
  } catch (err) {
    res.status(400).json({ status: "Fail", message: err.message });
  }
};
