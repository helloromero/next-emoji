const app = require('express')()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const nextApp = next({ dev })
const nextHandler = nextApp.getRequestHandler()

let port = 3000
let history = ['🥝', '🍑', '🫐', '🍋', '🍓', '🍆', '🍊', '🥔']

io.on('connection', (socket) => {

  // sents history back to all local users
  io.emit('history', history)

  // updates history and sends new data to all local users
  socket.on('emojiState', (data) => {
    history = data
    io.emit('emojiState', data)
  });

  // send respnse time back to local 
  socket.on('time', (data) => {
    const d = new Date()
    const ms = d.getMilliseconds()
    let duration = ms - data
    duration = (duration < 0) ? 'over 1 second 😢' : duration += 'ms'
    io.emit('time', duration)
  });
});

nextApp.prepare().then(() => {
  app.get('*', (req, res) => {
    return nextHandler(req, res)
  })

  server.listen(port, (err) => {
    if (err) throw err
    console.log(`-- Ready on http://localhost:${port}`)
  })
})