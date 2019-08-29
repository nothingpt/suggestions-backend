const mongoose = require('mongoose');
const { Schema } = mongoose;

/*
 type Suggestion {
    id: ID!
    title: String!
    suggestion: String!
    status: StatusEnum
    comment: String
    created_at: Date
    updated_at: Date
    visible: Boolean
    closed: Boolean
  }
*/

const suggestionSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  suggestion: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: "NOT_APPROVED"
  },
  comment: String,
  created_at: {
    type: Date,
    default: Date.now()
  },
  updated_at: {
    type: Date,
    default: Date.now()
  },
  visible: {
    type: Boolean,
    default: false
  },
  closed: {
    type: Boolean,
    default: false
  }
});

const Suggestion = mongoose.model('suggestion', suggestionSchema);

module.exports = { Suggestion };
