const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const path = require('path');
const stuffRoutes = require('./routes/stuff')
const userRoutes = require('./routes/user')

const app = express();

app.use(express.json());

mongoose.connect('mongodb+srv://Yohan:rSDrSc5ZUgNVck3U@cluster0.vc98hgn.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(bodyParser.json())

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

app.use('/api/books', stuffRoutes)
app.use('/api/auth', userRoutes)
app.use('/images', express.static(path.join(__dirname, 'images')))

module.exports = app;