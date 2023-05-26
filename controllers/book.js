const Book = require("../models/book");

const fs = require("fs");
const sharp = require("sharp");

exports.createBook = (req, res, next) => {
    if (req.file) {
        try {
            if (!fs.existsSync("./images")) {
                // check if directory exists. Do so synchronously.
                fs.mkdirSync("./images");
            }
            const { buffer, originalname } = req.file;
            const name = originalname.split(" ").join("_");
            const ref = name + Date.now() + ".webp";
            sharp(buffer)
                .webp({ quality: 50 })
                .toFile("./images/" + ref);

            const bookObject = JSON.parse(req.body.book);
            delete bookObject._id;
            delete bookObject._userId;
            const book = new Book({
                ...bookObject,
                userId: req.auth.userId,
                imageUrl: `${req.protocol}://${req.get("host")}/images/${ref}`,
            });

            book.save()
                .then(() =>
                    res.status(201).json({ message: "livre enregistré" })
                )
                .catch((error) => res.status(400).json({ error }));
        } catch (error) {
            console.log(error);
        }
    } else {
        res.status(400).json({ message: "fichier image manquant" });
    }
};

exports.modifyBook = (req, res, next) => {
    if (req.file) {
        try {
            const { buffer, originalname } = req.file;
            const name = originalname.split(" ").join("_");
            const ref = name + Date.now() + ".webp";
            sharp(buffer)
                .webp({ quality: 50 })
                .toFile("./images/" + ref);
            const bookObject = req.file
                ? {
                      ...JSON.parse(req.body.book),
                      imageUrl: `${req.protocol}://${req.get("host")}/images/${
                          ref
                      }`,
                  }
                : { ...req.body };

            delete bookObject._userId;
            Book.findOne({ _id: req.params.id })
                .then((book) => {
                    if (book.userId != req.auth.userId) {
                        res.status(403).json({
                            message: "Unauthorized request",
                        });
                    } else {
                        const filename = book.imageUrl.split("/images/")[1];
                        fs.unlink(`images/${filename}`, () => {
                            Book.updateOne(
                                { _id: req.params.id },
                                { ...bookObject, _id: req.params.id }
                            )

                                .then(() =>
                                    res
                                        .status(200)
                                        .json({ message: "livre modifié" })
                                )
                                .catch((error) =>
                                    res.status(400).json({ error })
                                );
                        });
                    }
                })
                .catch((error) => {
                    res.status(400).json({ error });
                });
        } catch (error) {
            console.log(error);
        }
    }
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
    if (0 <= req.body.rating && req.body.rating <= 5) {
        const newRating = {
            userId: req.body.userId,
            grade: req.body.rating,
        };
        Book.findOne({ _id: req.params.id })
            .then((book) => {
                console.log(book.ratings);
                book.ratings.map((rating, index) => {
                    if (rating.userId === req.body.userId) {
                        res.status(400).json({
                            messsage: " vous avez déjà noté ce livre",
                        });
                    } else {
                        book.ratings.push(newRating);

                        book.save()
                            .then((book) => res.status(201).json(book))
                            .catch((error) => res.status(400).json({ error }));

                        const gradeArray = book.ratings.map(
                            (grade, index) => book.ratings[index].grade
                        );
                        const initialValue = 0;
                        const sum = gradeArray.reduce(
                            (accumulator, currentValue) =>
                                accumulator + currentValue,
                            initialValue
                        );

                        const averageRating = sum / gradeArray.length;
                        book.averageRating = Math.round(averageRating);
                    }
                });
            })
            .catch((error) => res.status(404).json({ error }));
    } else {
        res.status(400).json({ message: "note non comprise entre 0 et 5" });
    }
};

exports.bestRating = (req, res, next) => {
    Book.find()
        .then((books) => {
            const bestRatingSort = books.sort(
                (a, b) => b.averageRating - a.averageRating
            );
            const bestRating = bestRatingSort.slice(0, 3);
            res.status(200).json(bestRating);
        })
        .catch((error) => res.status(400).json({ error }));
};
