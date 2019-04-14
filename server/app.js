var app = require('express')();
const socket = require('socket.io');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var cors = require('cors')

const User = require('./api/models/user')
const Chatroom = require('./api/models/chatroom')
const EventLog = require('./api/models/eventLog')


//Importing Routes
const loginRoute = require('./api/routes/login')
const signupRoute = require('./api/routes/signup')
const chatroomRoute = require('./api/routes/chatroom')
const userRoute = require('./api/routes/user')
const eventRoute = require('./api/routes/eventLog')


//Setting up body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//MongoDB Connection
mongoose.connect("mongodb://root:" + process.env.MONGO_ATLAS_PW + "@cluster0-shard-00-00-q5jmf.mongodb.net:27017,cluster0-shard-00-01-q5jmf.mongodb.net:27017,cluster0-shard-00-02-q5jmf.mongodb.net:27017/chatApp?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true", { useNewUrlParser: true })

//deprecation warning suppression
mongoose.Promise = global.Promise;

//CORS error handling: to filter request before forwarded to routes
app.use(cors())
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET, OPTIONS')
        return res.status(200).json({});
    }
    next();
});

//using the routes
app.use('/api/login', loginRoute);
app.use('/api/signup', signupRoute);
app.use('/api/chatrooms', chatroomRoute);
app.use('/api/users', userRoute);
app.use('/api/events', eventRoute)


app.use((error, req, res, next) => {
    if (error) {
        res.status(500).json({
            error: {
                message: error.message
            }
        });
    } else {
        res.status(200);
    }
});

const server = app.listen(3002 || 3200, () => {
    console.log("Server started on port " + 3002 + "...");
});
const io = socket.listen(server);
io.sockets.on('connection', (socket) => {

    console.log("Socket Connected!")

    let date = new Date()
    let currentTimeStamp = date.getHours() + ":" + (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes())
    let currentDateStamp = date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear()


    //On Message Event
    socket.on('message', (data) => {
        io.in(data.room).emit('new message', { user: data.user, message: data.message, time: currentTimeStamp });
        Chatroom.updateOne({ name: data.room }, { $push: { messages: { user: data.user, message: data.message, time: currentTimeStamp } } })
            .exec()
            .then(result => {
                console.log("Chat Updated!")
            })
            .catch(err => {
                console.log(err);
            });

        let event = new EventLog({
            _id: new mongoose.Types.ObjectId(),
            type: 'message',
            user: data.user,
            room: data.room,
            date: currentDateStamp,
            time: currentTimeStamp,
            content: data
        })
        event.save()
            .then(result => {
                console.log("Event Log Updated!")
            })

    });

    //On Join Event
    socket.on('join', (data) => {

        console.log(data)

        socket.join(data.room);
        socket.broadcast.in(data.room).emit('join', { user: data.user })
        Chatroom.findOne({ name: data.room })
            .exec()
            .then(result => {

                if (result && data.room) {
                    Chatroom.updateOne({ name: data.room }, { $addToSet: { users: data.user } })
                        .exec()
                        .then(result => {
                            if (result) {
                                console.log(data.user + " joined!")
                            }
                        })

                } else {
                    if(data.room === ''){
                        return
                    }
                    const room = new Chatroom({
                        _id: new mongoose.Types.ObjectId(),
                        name: data.room,
                        users: [data.user]
                    });
                    room.save()
                        .then(result => {
                            console.log("Chatroom Created!")
                        })
                }

                let event = new EventLog({
                    _id: new mongoose.Types.ObjectId(),
                    type: 'join',
                    user: data.user,
                    room: data.room,
                    date: currentDateStamp,
                    time: currentTimeStamp,
                    content: data
                })
                event.save()
                    .then(result => {
                        console.log("Event Log Updated!")
                    })
            })
            .catch(err => {
                console.log(err)
            })

    });


    //On Typing Event
    socket.on('typing', (data) => {
        socket.broadcast.in(data.room).emit('typing', { data: data, isTyping: true })
    });

    socket.on('leave', (data) => {
        socket.broadcast.in(data.room).emit('leave', { user: data.user })
        Chatroom.updateOne({ name: data.room }, { $pull: { users: data.user } })
            .exec()
            .then(result => {
                if (result) {
                    console.log(data.user + " left the room!")
                }
                let event = new EventLog({
                    _id: new mongoose.Types.ObjectId(),
                    type: 'leave',
                    user: data.user,
                    room: data.room,
                    date: currentDateStamp,
                    time: currentTimeStamp,
                    content: data
                })
                event.save()
                    .then(result => {
                        console.log("Event Log Updated!")
                    })
            })
        socket.leave(data.room)
    });

})

module.exports = app;