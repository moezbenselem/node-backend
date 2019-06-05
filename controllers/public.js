const Event = require('../models/event');
const UserEvent = require('../models/userEvent');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const io = require('../socket');

exports.getMyEvents = (req, res, next) => {
  const userId = req.body.userId;

  UserEvent.findAll({
    attributes: ['eventId'],
    where: {
      userId: userId
    }
  }).then(events => {
    const listEvents = [];
    for (let index = 0; index < events.length; index++) {
      listEvents.push(events[index].eventId);
    }
    console.log(listEvents);
    return Event.findAll(
      {
        where: {
          id: { [Op.in]: listEvents }
        }
      }
    )
  })
    .then(myEvents => {
      res.json({
        events:myEvents
      });
    })
    .catch(err => {
      console.log(err);
      res.json({
        error:err
      });
    });

};

exports.getEvent = (req, res, next) => {

  const id = req.params.eventId;

  Event.findAll(
    {
      where: {
        id: id
      }
    }
  )
    .then(events => {
      const event = events[0];
      res.json(event);
    })
    .catch(err => {
      console.log(err);
    });


};


exports.getEvents = (req, res, next) => {
  const query = req.query.query;
  const date = req.query.date;
  if (query && date) {

    Event.findAll(
      {
        where: {
          title: { [Op.like]: [`${query}%`] },
          date: { [Op.like]: [`${date}%`] }
        }
      }
    )
      .then(events => {
        res.json(events);
      })
      .catch(err => {
        console.log(err);
      });

  }
  else if (query) {

    Event.findAll({ where: { title: { [Op.like]: [`${query}%`] } } }
    )
      .then(events => {
        res.json(events);
      })
      .catch(err => {
        console.log(err);
      });

  } else {

    Event.findAll()
      .then(events => {
        res.json(events);
      })
      .catch(err => {
        console.log(err);
      });
  }
};


exports.postParticipate = (req, res, next) => {

  const eventId = req.body.eventId;
  const userId = req.body.userId;


  UserEvent.create({
    userId: userId,
    eventId: eventId
  }).then(result => {
    console.log('Event Participated !');
    res.json({
      success: true,
      message: null
    });
  }).catch(err => {
    res.json({
      success: false,
      message: err
    });
  });

}

exports.postRemove = (req, res, next) => {

  const eventId = req.body.eventId;
  const userId = req.body.userId;
  UserEvent.findAll({
    where: { userId: userId, eventId: eventId }
  }).then(events => {
    events[0].destroy();
    console.log('Event Removed !');
    res.json({
      success:true
    });
  }).catch(err=>{
    res.json({
      success:false
    });
  });
}
