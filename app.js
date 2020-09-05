const path = require('path');
const express = require("express");
const bodyParser = require("body-parser");

const sequelize = require('./Util/database');


const User = require('./models/user');
const Event = require('./models/event');
const UserEvent = require('./models/userEvent.js');

const app = express();

const adminRoutes = require('./routes/admin');
const publicRoutes = require('./routes/public');



app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://event-manager-a59e4.firebaseapp.com');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  next();
});



app.use('/admin', adminRoutes);
app.use(publicRoutes);
//app.use(errorController.get404);

Event.belongsTo(User, { constraint: true, onDelete: 'CASCADE' });
User.hasMany(Event);
Event.belongsToMany(User, { through: UserEvent });

sequelize
  //.sync({ force: true })
  .sync()
  .then(result => {
    console.log("sequelize success !");
    let port = process.env.PORT || 3310;
    console.log('port used : ', port);
    const server = app.listen(port, () => `Server running on port ${port}`);;
    const io = require('./socket').init(server);
    io.on('connection', socket => {
      console.log("client connected !!!");
    });
  });

