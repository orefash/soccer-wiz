let mongoose = require("mongoose");
let Schema = mongoose.Schema;

const accountSchema = new Schema({
  number: String,
  bank: String
}, { _id : false });


const userSchema = new Schema({
  id: {
    type: String,
    default: null,
  },
  email: {
    type: String,
    required: [true, "email required"],
    unique: [true, "email already registered"],
  },
  firstName: String,
  lastName: String,
  profilePhoto: String,
  userTag: { type: Number, default: 1 },
  password: String,
  country: String,
  reward_points: { type: Number, default: 0 },
  wallet_balance: { type: Number, default: 0 },
  account: [accountSchema],
  source: { type: String, required: [true, "source not specified"] },
  registerDate: { type: Date, default: new Date() },
  lastVisited: { type: Date, default: new Date() }
},
{ timestamps: true });

var userModel = mongoose.model("user", userSchema, "user");

module.exports = userModel;