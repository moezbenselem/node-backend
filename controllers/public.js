const Event = require('../models/event');
const UserEvent = require('../models/userEvent');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const io = require('../socket');

exports.getMyEvents = (req,res,next) =>{

  const id = req.params.eventId;
  
    if(user =='admin'){
      UserEvent.findAll({
        attributes:['eventId'],
        where :{
          userId: req.session.userId
        }
      }).then(events =>{
        
        
        const listEvents =[];
        for (let index = 0; index < events.length; index++) {
          listEvents.push(events[index].eventId);
            
        }
        console.log(listEvents);
        return Event.findAll( 
          {
            where: { 
                  id: { [Op.in]: listEvents}
                  }
          }
        )
      })
      .then(myEvents => {
        res.render('public/my-events', {
          events: myEvents,
          pageTitle: 'My Events',
          path: '/myEvents',
          user: user
        });
      })
      .catch(err => {
        console.log(err);
      });
    }
    else{
      res.redirect('/admin/login');
    }
  

};

exports.getEvent = (req,res,next) =>{

  const id = req.params.eventId;
  
  Event.findAll( 
    {
      where: { 
              id:id
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
                  title: { [Op.like]: [`${query}%`]} ,
                  date:{ [Op.like]: [`${date}%`]}
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

    Event.findAll( {where: { title: { [Op.like]: [`${query}%`]} } }
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


exports.postParticipate = (req,res,next)=>{

  const eventId = req.body.eventId;
  const userId = req.session.userId;

  if(req.session.isLoggedIn){
    UserEvent.create({
      userId:userId,
      eventId:eventId
    }).then(result=>{
      console.log('Event Participated !');
      res.redirect('/myEvents');
    }).catch(err=>{
      res.redirect('/myEvents');
    });
  }
  else{
    res.redirect('/admin/login');
  }
  
}
  exports.postRemove = (req,res,next)=>{

    const eventId = req.params.eventId;
    const userId = req.session.userId;
    console.log('In post remove!');
    UserEvent.findAll({
      where:{userId:userId , eventId:eventId}
    }).then(events=>{
      events[0].destroy();
      console.log('Event Removed !');
      res.redirect('/myEvents');
    });
  }
