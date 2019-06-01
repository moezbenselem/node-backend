const Event = require('../models/event');
const User = require('../models/user');
const Sequelize = require('Sequelize');
const io = require('../socket');
const jwt = require('jsonwebtoken')


exports.getEditEvent = (req, res, next) => {
  const isLoggedIn = req.session.isLoggedIn;
  console.log('inside getEditEvent');
  const editMode = req.query.edit;

  if (isLoggedIn) {

    if (!editMode) {
      console.log('redirected here');
      return res.redirect('/');
    }
    const eventId = req.params.eventId;
    Event.findOne({
      where: {
        id: eventId
      }
    })
      .then(event => {
        if (!event) {
          console.log('redirected here 2');
          return res.redirect('/');
        }
        res.render('admin/edit-event', {
          pageTitle: 'Edit Event',
          path: '/admin/add-event',
          editing: true,
          user: 'admin',
          event: event
        });
      })
      .catch(err => console.log(err));

  }
  else {
    res.redirect('/admin/login');
  }

}

exports.postEditEvent = (req, res, next) => {
  const title = req.body.title;
  const place = req.body.place;
  const type = req.body.type;
  const date = req.body.date;

  Event.update({
    title: title,
    place: place,
    type: type,
    date: date
  },
    { returning: true, where: { id: req.body.eventId } })
    .then(result => {
      // console.log(result);
      console.log('Updated Event!');
      res.json({
        "success": true,
        "message": "event updated"
      });
    })
    .catch(err => {
      console.log(err);
      res.json({
        "success": false,
        "message": "event update failed"
      });
    });
};


exports.postAddEvent = (req, res, next) => {
  const title = req.body.title;
  const place = req.body.place;
  const type = req.body.type;
  const date = req.body.date;
  const user = req.body.user;

  Event.create({
    title: title,
    place: place,
    type: type,
    date: date,
    userId: user
  })
    .then(result => {
      // console.log(result);
      console.log('Created Event!');
      console.log('Event : ', result.dataValues);
      const event = result.dataValues;
      io.getIO().emit('posts', { action: 'create', event: event });

      res.json({
        "success": true,
        "message": "Event Created"
      });
    })
    .catch(err => {
      console.log(err);
      res.json({
        "success": false,
        "message": "event creation  failed"
      });
    });
};

exports.postRegister = (req, res, next) => {

  const name = req.body.name;
  const lastname = req.body.lastname;
  const email = req.body.email;
  const password = req.body.password;
  const token = jwt.sign(email + password, 'mysecretkey');
  //console.log('token : ',token);
  User.create({
    name: name,
    lastname: lastname,
    email: email,
    password: password,
    token: token
  })
    .then(result => {
      // console.log(result);

      console.log('Created User!');
      res.json({
        "sucess": true,
        "message": "user created"
      });
    })
    .catch(err => {
      console.log(err);
      res.json({
        "sucess": false,
        "message": "user was not created"
      });
    });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  jwt.sign(email + password, "mysecretkey");

  User.findOne({
    where: {
      email: email,
      password: password
    }
  }
  ).then(user => {
    if (!user) {
      res.json({
        "success": false,
        "message": "login failed"
      });
    }
    const today = new Date();
    const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    const dateTime = date + ' ' + time;

    console.log('datetime : ', dateTime);
    const current = new Date(dateTime);
    console.log('selected user : ',user);
    const tokenCreation = new Date(user.tokenCreation);
    const dateC = tokenCreation.getFullYear() + '-' + (tokenCreation.getMonth() + 1) + '-' + tokenCreation.getDate();
    const timeC = tokenCreation.getHours() + 1 + ":" + tokenCreation.getMinutes() + ":" + tokenCreation.getSeconds();
    const dateTimeC = dateC + ' ' + timeC;

    const tokenDate = new Date(dateTimeC);

    if (current > tokenDate) {
      console.log('must update');
    } else {
      console.log('token fine');
    }
    User.update(
      { tokenCreation: dateTime, expires: 3600 },
      {
        where: {
          email: email,
          password: password
        }
      }
    ).then(result => {
      console.log('LOGGED IN!')
      res.json({
        "success": true,
        "message": "user logged in successfully",
        "data": user
      });
    });


  });
};

exports.postIsAuth = (req, res, next) => {

  const token = req.body.token;
  console.log('recieved token :', token);
  User.findOne({
    where: {
      token: token
    }
  }
  ).then(user => {

    if (user) {

      const today = new Date();
      const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
      const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      const dateTime = date + ' ' + time;

      const current = new Date(dateTime);

      const tokenCreation = new Date(user.tokenCreation);
      const dateC = tokenCreation.getFullYear() + '-' + (tokenCreation.getMonth() + 1) + '-' + tokenCreation.getDate();
      const timeC = tokenCreation.getHours() + 1 + ":" + tokenCreation.getMinutes() + ":" + tokenCreation.getSeconds();
      const dateTimeC = dateC + ' ' + timeC;

      const tokenDate = new Date(dateTimeC);

      if (current > tokenDate) {
        console.log('must update');
        res.json({
          "isAuth": false,
          "message": "user session expired"
        });
      } else {
        console.log('token fine');
        res.json({
          "isAuth": true,
          "message": "user session fine"
        });
      }
    } else {
      res.json({
        "isAuth": false,
        "message": "No User found"
      });
    }
  });


};

exports.postEvents = (req, res, next) => {
  const user = req.body.userId;
  Event.findAll({ where: { userId: user } })
    .then(events => {
      console.log('inside find All Evnets line 261');
      res.json(events);
    })
    .catch(err => console.log(err));
};

exports.postDelete = (req, res, next) => {
  const eventId = req.body.eventId;
  console.log('event id from delete : ', eventId);
  console.log('inside post delete');
  Event.findOne({ where: { id: eventId } }).then(event => {
    if (!event) {
      console.log('inside !event');
      res.json({
        "success": false,
        "message": "Event id or user id not exact"
      });
    } else {
      event.destroy().then(result => {
        console.log('event removed !');
        io.getIO().emit('posts', { action: 'delete', eventId: eventId });
        res.json({
          "success": true,
          "message": "Event removed"
        });
      });

    }
  })
    .catch(err => console.log(err));

}