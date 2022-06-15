const mongoose = require('mongoose')
const Notulen = mongoose.model('Notulen', {
    idRapat : {
        type: String
    },
    notulen: {
        type: Object
    },
    jam: {
        type: String
    }
})

module.exports = Notulen;