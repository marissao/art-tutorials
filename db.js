const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

const uri = process.env.ATLAS_URI;
// mongoose.set('useCreateIndex', true); // Removes error "DeprecationWarning: collection.ensureIndex is deprecated. Use createIndexes instead."
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => console.log("MongoDB connection established"));