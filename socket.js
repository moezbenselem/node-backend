let io;

module.exports = {
    init: httpServer => {
        io = require('socket.io')(httpServer);
        return io;
    },
    getIO:()=>{
        if(!io){
            throw new Error('Not Socket Found !');
        }
        return io;
    }
}