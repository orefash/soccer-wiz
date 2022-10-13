let mongoose = require("mongoose");
let Schema = mongoose.Schema;

const levels = ['admin', 'superadmin'];

const adminSchema = new Schema({
  // id: {
  //   type: String,
  //   default: null,
  // },
  email: {
    type: String,
    required: [true, "email required"],
    unique: [true, "email already registered"],
  },
  firstName: String,
  lastName: String,
  profilePhoto: String,
  password: String,
  userTag: { type: Number, default: 0 },
  level: {
    type: String,
    enum: levels,
    default: 'admin',
  },
  source: { type: String, required: [true, "source not specified"] },
  registerDate: { type: Date, default: new Date() },
  lastVisited: { type: Date, default: new Date() }
});

var adminModel = mongoose.model("admin", adminSchema, "admin");

module.exports = adminModel;