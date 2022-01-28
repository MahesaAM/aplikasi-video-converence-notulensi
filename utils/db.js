const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://mahesa:mahesa@cluster0.ks4il.mongodb.net/notulen?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
