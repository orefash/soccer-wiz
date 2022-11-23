

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
let mongoose = require("mongoose");
let Schema = mongoose.Schema;

const accountSchema = new Schema({
  number: String,
  bank: String
}, { _id: false });


const statuses = ["active", "suspended"]

const userSchema = new Schema({
  googleId: {
    type: String,
    default: null,
  },
  facebookId: {
    type: String,
    default: null,
  },
  email: {
    type: String,
    match: [/\S+@\S+\.\S+/, 'is invalid'],
    index: true,
    // required: [true, "email required"],
    unique: [true, "email already registered"],
  },
  firstName: String,
  lastName: String,
  username: {
    type: String,
    // unique: true,
    // index: true
  },
  profilePhoto: String,
  phone: String,
  role: {
    type: String,
    default: "USER",
    required: [true, "user role is required"],
    enum: ["ADMIN", "USER"], // Payment gateway might differs as the application grows
  },
  password: String,
  country: String,
  status: {
    type: String,
    enum: statuses,
    required: true,
    default: 'active',
  },
  reward_points: { type: Number, default: 0 },
  wallet_balance: { type: Number, default: 0 },
  totalScore: {
    type: Number,
    default: 0
  },
  gamesPlayed: {
    type: Number,
    default: 0
  },
  account: accountSchema,
  source: { type: String, required: [true, "source not specified"] },
  registerDate: { type: Date, default: new Date() },
  lastVisited: { type: Date, default: new Date() }
},
  { timestamps: true });

// const secretOrKey = "secret";
const secretOrKey = process.env.JWT_SECRET;
const jwtExpiry = process.env.JWT_EXPIRY;


userSchema.methods.generateJWT = function () {
  const token = jwt.sign(
    {
      
      id: this._id,
      source: this.source,
      email: this.email,
      iat: Math.floor(Date.now() / 1000),
    },
    secretOrKey,
    {
      expiresIn: jwtExpiry,
      // algorithm: "RS256",
    }
  );
  console.log(`token generated: date: ${Date.now()} - token: ${token} - expires: ${jwtExpiry}`)
  return token;
};

userSchema.methods.registerUser = (newUser, callback) => {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (errh, hash) => {
      if (err) {
        console.log(err);
      }
      // set pasword to hash
      newUser.password = hash;
      newUser.save(callback);
    });
  });
};

userSchema.methods.comparePassword = function (candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) return callback(err);
    callback(null, isMatch);
  });
};

userSchema.methods.toJSON = function () {


  const avgPoints = 0
  if (this.role === 'USER') {
    if (this.gamesPlayed > 0)
       avgPoints = this.totalScore / this.gamesPlayed
  }
  return {
    id: this._id,
    source: this.source,
    email: this.email,
    username: this.username,
    role: this.role,
    phone: this.phone,
    avgPoints: avgPoints,
    totalScore: this.totalScore,
    gamesPlayed: this.gamesPlayed,
    status: this.status,
    wallet_balance: this.wallet_balance,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

var userModel = mongoose.model("user", userSchema, "user");

module.exports = userModel;