const mongoose = require('mongoose')
const Notulen = mongoose.model('Notulen', {
    idRapat : {
        type: String
    },
    notulen: {
        type: Object
    }
})

module.exports = Notulen;