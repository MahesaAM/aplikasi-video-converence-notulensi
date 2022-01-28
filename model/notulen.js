const mongoose = require('mongoose')
const Notulen = mongoose.model('Notulen', {
    idRoom : {
        type: String
    },
    idAnggota: {
        type: String
    },
    text: {
        type: String
    }
})

module.exports = Notulen;