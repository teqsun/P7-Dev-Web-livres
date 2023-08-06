const Book = require('../models/Book');
const fs = require('fs');

exports.createBook = (req,res, next) =>{
   const bookObject = JSON.parse(req.body.book)
   delete bookObject._id
   delete bookObject._userId
  // console.log(req.file.filename)
   const book = new Book({
    ...bookObject,
    userId: req.auth.userId,
    imageUrl:`${req.protocol}://${req.get('host')}/images/${req.file.filename}` ,
    
    
   })
   
   book.save()
   .then(() => { res.status(201).json({message: 'Objet enregistré !'})})
   .catch( error => {res.status(400).json( {error})})
  };
  

exports.modifyBook =(req, res, next) => {
 const bookObject = req.file ? {
  ...JSON.parse(req.body.book),
  imageUrl:`${req.protocol}://${req.get('host')}/images/${req.file.filename}`
 } : {...req.body};

 delete bookObject._userId
 Book.findOne({_id: req.params.id})
  .then((book) => {
      if (book.userId != req.auth.userId){
      res.status(401).json({ message : 'Not-autorized'})
    } else {
        Book.updateOne({ _id : req.params.id}, {...bookObject, _id: req.params.id})
        .then(()=> res.status(200).json({message : 'Objet-modifié'}))
        .catch(error => {res.status(400).json( {error})})
    }
  })
  .catch((error) => {
    res.status(400).json({ error });
  });
}

exports.bestRating = (req, res, next) => {
  const bookBestRatings = Book.find().sort({ rating : -1}).limit(3)
    .then(bookBestRating => res.status(200).json(bookBestRating))
    .catch(error => res.status(400).json({ error}))
    console.log("bookBestRatings:", bookBestRatings)

/*
const bookBestRatings = Book.find()
const bestBooks = bookBestRatings.sort((a,b)=> b.rating - a.rating).slice(0,3)
*/


   }


exports.deleteBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id})
  .then(book => {
      if (book.userId != req.auth.userId) {
          res.status(401).json({message: 'Not authorized'});
      } else {
          const filename = book.imageUrl.split('/images/')[1];
          fs.unlink(`./images/${filename}`, () => {
              Book.deleteOne({_id: req.params.id})
                  .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                  .catch(error => res.status(401).json({ error }));
          });
      }
  })
  .catch( error => {
      res.status(500).json({ error });
  });
        }

exports.getOneBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id})
    .then(book => res.status(200).json(book))
    .catch(error => res.status(404).json({ error}))
     
    }

exports.postRating = (req, res, next) => {

  const id = req.params.id
  console.log("id:",id)
  if (id == null || id=="undefined")
 {
  res.status(400).json({ message : "Book missing"})
  return
 }
 const rating = req.body.rating
 const userId = req.auth.userId
 const book = Book.findById(id)
 console.log("userid :", userId)
 console.log("book :", book)
 if (book == null){
  res.status(404).json({message : 'Book not found'})
  return
}

const ratingsCurrent = book.ratings;
console.log("currrentrating :", ratingsCurrent)
const checkRatingFromCurrentUser = ratingsCurrent.find((rating) => rating.userId == userId)
 if (checkRatingFromCurrentUser != null){
 res.status(400).json({message : 'Already rated'})
 return
}
 const newRating = {userId: userId, grade: rating}
 ratingsCurrent.push(newRating)
 book.averageRating = sumAverageRating(ratingsCurrent)
 book.save()
 res.status(201).json({message : 'Rating posted'})
}

function sumAverageRating(ratings){
  const allGrades = ratings.reduce((sum, rating) => sum + rating.grade, 0)
  return allGrades / ratings.length
}



exports.getAllBook = (req, res, next) => {
    Book.find()
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error}))
   }