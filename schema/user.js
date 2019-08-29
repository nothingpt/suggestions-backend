const mongoose = require('mongoose');
const { Schema } = mongoose;

// type User {
//   id: ID! 
//   name: String!
//   email: String! 
//   password: String!
//   resetToken: String
//   resetTokenExpiry: Float
// }

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    default: "OPEN"
  },
  resetToken: String,
  resetTokenExpiry: Number
});

const User = mongoose.model('user', userSchema);

module.exports = { User };
