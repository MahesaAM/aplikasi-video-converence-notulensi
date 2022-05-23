require('../utils/db');
const Notulen = require('../model/notulen');

function insertNotulen(nama,notulen) {
    Notulen.updateOne(
        {$push: {
          notulen: {
            $each: [{nama:nama, notulen:notulen}]
          }
        }
      }).where({idRapat: req.query.kode});
}

module.exports = insertNotulen;