const io = require('socket.io-client')

export default function () {

  const socket = io.connect('http://localhost:3002')

  function registerHandler(onMessageReceived) {
    socket.on('new message', onMessageReceived)
  }

  function unregisterHandler() {
    socket.off('message')
  }

  function join(chatroomName, cb) {
    socket.emit('join', {user: localStorage.getItem('username'),room: chatroomName }, cb)
  }

  function leave(chatroomName, cb) {
    socket.emit('leave', {user: localStorage.getItem('username'),room: chatroomName }, cb)
  }

  function message(chatroomName, msg, user, cb) {
    let data = { room:chatroomName, user:user , message: msg }
    socket.emit('message', data , cb)
  }

  socket.on('error', function (err) {
    console.log('received socket error:')
    console.log(err)
  })

  return {
    join,
    leave,
    message,
    registerHandler,
    unregisterHandler
  }
}

