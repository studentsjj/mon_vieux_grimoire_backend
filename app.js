const express = require('express'); 


const mongoose = require('mongoose');
const path =require('path');

mongoose.connect('mongodb+srv://marielouise04:Ocmongodb2023@clusteroc.fy4ooxv.mongodb.net/?retryWrites=true&w=majority',
{ useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express(); 
const bookRoutes = require('./routes/book');
const userRoutes = require('./routes/user');
app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

app.use('/api/books', bookRoutes);
app.use('/api/auth', userRoutes);
//app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/images', express.static("./images"));
module.exports = app; 
