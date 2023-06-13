const express = require('express'); 
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

mongoose.connect('mongodb+srv://marielouise04:Ocmongodb2023@clusteroc.fy4ooxv.mongodb.net/?retryWrites=true&w=majority',
{ useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express(); 

app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})
app.use(limiter);

const corsOption = {
  'origin' : '*',
  'allowedHeaders' : 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization',
  'methods' : 'GET, POST, PUT, DELETE, PATCH, OPTIONS'
}
app.use(cors(corsOption))

app.use(helmet({
  crossOriginResourcePolicy: {policy: 'same-site'},
  crossOriginEmbedderPolicy: {policy: 'require-corp'},
}));

const bookRoutes = require('./routes/book');
const userRoutes = require('./routes/user');
app.use('/api/books', bookRoutes);
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname,'./images')));

module.exports = app; 
