/*
 *
 *
 *       Complete the API routing below
 *       
 *       
 */

'use strict';

const Book = require('../Book')

module.exports = function (app) {

  app.route('/api/books')
    .get(async function (req, res) {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      try {
        let books = await Book.find()
        res.status(200).json([...books])
      } catch (e) {
        res.send(e.message)
      }
    })

    .post(async function (req, res) {
      let title = req.body.title;
      //response will contain new book object including atleast _id and title
      try {
        if (!title) throw new Error('missing required field title')
        let book = new Book({
          title: title
        })
        book.commentcount = 0
        await book.save()
        res.status(200).json({
          _id: book._id,
          title: book.title
        })
      } catch (e) {
        //error message for empty field title.
        res.send(e.message)
      }
    })

    .delete(async function (req, res) {
      //if successful response will be 'complete delete successful'
      try {
        await Book.deleteMany()
        res.status(200).json('complete delete successful')
      } catch (e) {
        res.send(e.message)
      }
    });



  app.route('/api/books/:id')
    .get(async function (req, res) {
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      try {
        let book = await Book.findById(bookid)
        if (!book) throw new Error('no book exists')
        res.status(200).json(book)
      } catch (e) {
        if (e.message === 'no book exists') return res.send(e.message)
        res.send('Something went wrong! Pls try again.')
      }
    })

    .post(async function (req, res) {
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
      try {
        if(!comment) throw new Error('missing required field comment')
        let book = await Book.findById(bookid)
        if (!book) throw new Error('no book exists')
        book.comments.push(comment)
        book.commentcount += 1
        await book.save()
        res.status(200).json(book)
      } catch (e) {
        if (e.message === 'no book exists') return res.send(e.message)
        if (e.message === 'missing required field comment') return res.send(e.message)
        res.send('Something went wrong! Pls try again.')
      }
    })

    .delete(async function (req, res) {
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      try {
        let book = await Book.findById(bookid)
        if (!book) throw new Error('no book exists')
        if (book) {
          await book.delete()
          res.status(200).send('delete successful')
        }
      } catch (e) {
        if (e.message === 'no book exists') return res.send(e.message)
        res.send('Something went wrong! Pls try again.')
      }
    });

};