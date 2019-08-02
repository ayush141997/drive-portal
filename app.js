const express = require('express')
const app = express()
const server = require('http').Server(app)
const session = require('express-session')
const bodyParser = require('body-parser')
const io = require('socket.io')(server)

app.use(express.static(__dirname + '/public'))
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json({ limit: '10mb' }))
app.use(session({ secret: 'hack the secret of drive portal' }))

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Token");
    res.header("Access-Control-Allow-Methods", "*")
    next();
});

require('./routes')(app)
require('./algorithm').socket(io)

let port = 3000 | process.env.PORT
server.listen(port, () => {
    console.log(`Listening on ${port}`)
})