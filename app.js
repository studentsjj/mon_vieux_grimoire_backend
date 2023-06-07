const express = require('express'); 
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const path = require('path');

mongoose.connect(process.env.CONNECT_MONGODB,
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

app.use(helmet({
  crossOriginResourcePolicy: {policy: 'same-site'},
  crossOriginEmbedderPolicy: {policy: 'require-corp'},
}));

const corsOption = {
  'origin' : '*',
  'allowedHeaders' : 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization',
  'methods' : 'GET, POST, PUT, DELETE, PATCH, OPTIONS'
  
}
app.use(cors(corsOption))
/*app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });*/

const bookRoutes = require('./routes/book');
const userRoutes = require('./routes/user');
app.use('/api/books', bookRoutes);
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname,'./images')));
module.exports = app; 
