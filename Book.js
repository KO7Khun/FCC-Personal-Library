const mongoose = require('mongoose');
const {Schema} = mongoose;

const bookSchema = new Schema({
  title : String,
  comments : [String],
  commentcount : Number
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;