const Book = require("../models/book");

const fs = require("fs");

exports.createBook = (req, res, next) => {
    const bookObject = JSON.parse(req.body.book);
    delete bookObject._id;
    delete bookObject._userId;
    const book = new Book({
        ...bookObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
            req.file.filename
        }`,
    });

    book.save()
        .then(() => res.status(201).json({ message: "livre enregistré" }))
        .catch((error) => res.status(400).json({ error }));
};

exports.modifyBook = (req, res, next) => {
    const bookObject = req.file
        ? {
              ...JSON.parse(req.body.book),
              imageUrl: `${req.protocol}://${req.get("host")}/images/${
                  req.file.filename
              }`,
          }
        : { ...req.body };

    delete bookObject._userId;
    Book.findOne({ _id: req.params.id })
        .then((book) => {
            if (book.userId != req.auth.userId) {
                res.status(403).json({ message: "Unauthorized request" });
            } else {
                Book.updateOne(
                    { _id: req.params.id },
                    { ...bookObject, _id: req.params.id }
                )

                    .then(() =>
                        res.status(200).json({ message: "livre modifié" })
                    )
                    .catch((error) => res.status(400).json({ error }));
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
};

exports.deleteBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then((book) => {
            if (book.userId != req.auth.userId) {
                res.status(403).json({ message: "Not authorized" });
            } else {
                const filename = book.imageUrl.split("/images/")[1];
                console.log(filename);
                fs.unlink(`images/${filename}`, () => {
                    Book.deleteOne({ _id: req.params.id })
                        .then(() => {
                            res.status(200).json({
                                message: "livre supprimé !",
                            });
                        })
                        .catch((error) => res.status(401).json({ error }));
                });
            }
        })
        .catch((error) => {
            res.status(500).json({ error });
        });
};

exports.getAllBooks = (req, res, next) => {
    Book.find()
        .then((books) => res.status(200).json(books))
        .catch((error) => res.status(400).json({ error }));
};

exports.getOneBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then((book) => res.status(200).json(book))
        .catch((error) => res.status(404).json({ error }));
};

exports.ratingBook = (req, res, next) => {
    const newRating = {
        userId: req.body.userId,
        grade: req.body.rating,
    };
    console.log(newRating);

    Book.findOne({ _id: req.params.id })
        .then((book) => {
            book.ratings.push(newRating);
            console.log(book.ratings);

            book.save()
                .then((book) => res.status(201).json(book))
                .catch((error) => res.status(400).json({ error }));
            console.log(book.ratings[0].grade);
            const gradeArray = book.ratings.map(
                (grade, index) => book.ratings[index].grade
            );
            const initialValue = 0;
            const somme = gradeArray.reduce(
                (accumulator, currentValue) => accumulator + currentValue,
                initialValue
            );
            console.log(somme);
            const averageRating = somme / gradeArray.length;
            book.averageRating = Math.round(averageRating);
        })
        .catch((error) => res.status(404).json({ error }));
};
