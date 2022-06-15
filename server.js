const express = require('express')
const app = express()
const bodyparser = require('body-parser');
const urlencodedparser = bodyparser.urlencoded({extended:false})
// const cors = require('cors')
// app.use(cors())
const server = require('http').Server(app)
const io = require('socket.io')(server)

const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
  debug: true
});
require('./utils/db');
const Notulen = require('./model/notulen');
// const { v4: uuidV4 } = require('uuid')

app.use('/peerjs', peerServer);
// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.get('/', (req,res) => {
  res.redirect(`/notulen`)
})

app.get('/notulen', async (req, res) => {

  const notulen = await Notulen.find();
  console.log(notulen)
  res.render('notulenDaftar', {
    notulen:notulen
  })

})

app.get('/rapat', async (req, res) => {
  Notulen.countDocuments({idRapat: req.query.kode}, function(err, c) {
    if (c==0) {
      Notulen.insertMany([{ idRapat : req.query.kode, notulen: [] }], (err) => console.log(err));
    }
});

  res.render('rapat', { roomId: req.query.kode })
})

app.post('/insertNotulen', (req, res) => {
  Notulen.updateOne(
    {$push: {
      notulen: {
        $each: [{
              nama:req.body.notulen.nama,
              notulen:req.body.notulen.notulen,
              jam:req.body.notulen.jam,
  }]}}}, function(err){
    if(err){
            console.log(err);
    }
}).where({idRapat: req.body.idRapat});
});

app.post('/getNotulen', urlencodedparser, async (req, res) => {  
  const notulen = await Notulen.findOne({'idRapat': req.body.kode});
 res.json([notulen.notulen,notulen.notulen.length])

});

io.on('connection', socket => {
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId)
    socket.to(roomId).broadcast.emit('user-connected', userId);
    // messages
    socket.on('message', (message) => {
      //send message to the same room
      io.to(roomId).emit('createMessage', message)
  }); 

    socket.on('disconnect', () => {
      socket.to(roomId).broadcast.emit('user-disconnected', userId)
    })
  })
})


server.listen(process.env.PORT||3030)
