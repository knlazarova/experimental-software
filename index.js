// index.js

require('./app/index')  
const express = require('express')  
const app = express()  
var exphbs  = require('express-handlebars');
const port = 3000
const path = require('path')  
'use strict'
const pg = require('pg')  
const conString = 'postgres://knlaz:knlaz@localhost:5432/knlaz' // make sure to match your own database's credentials
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('view engine', '.hbs')  
app.set('views', path.join(__dirname, 'views'))  
//app.use(express.static(path.join(__dirname + '/public')));

app.use('/img',express.static(path.join(__dirname, 'public/images')));
app.use('/js',express.static(path.join(__dirname, 'public/javascripts')));
app.use('/css',express.static(path.join(__dirname, 'public/stylesheets')));

app.post('/participants-info', function (req, res, next) {
  const participant = req.body;
  console.log('sending participant info: ',req.body)
	pg.connect(conString, function (err,client) {
    if (err) {
    	console.log("CANT CONNECT TO DB");
    	return next(err)
      // pass the error to the express error handler
    }
    client.query('INSERT INTO participant_info (email, participant_name, uni_degree, age) VALUES ($1, $2, $3, $4);', 
      [participant.email, participant.name, participant.uniDegree, participant.age], function (err, result) {
    //this done callback signals the pg driver that the connection can be closed or returned to the connection pool
    
     if (err){
        console.log('theres been an error in inserting participant_info to db')
        return res.sendStatus(500);
      }
      return res.sendStatus(200);
    })
  })

})

app.post('/research-answers-db', function(req, res, next) {
  const researchAnswers = req.body;
  console.log('about to post to db', req.body);
  pg.connect(conString, function(err,client,done){
    if (err){
      console.log('cannot connect to db')
    }
    for (var i = researchAnswers.length - 1; i >= 0; i--) {
    client.query('INSERT INTO participants_answers values ($1, $2, $3, $4, $5);', 
        [researchAnswers[i].question_id, researchAnswers[i].participant_id, 
        researchAnswers[i].answer, researchAnswers[i].time, researchAnswers[i].correct], function(err, result){
    if (err){
        console.log('theres been an error in inserting participants answers to db')
        res.send();
      }
      return res.send();
      res.sendStatus(200);
    }) //end of client query
}  

  })
});

app.listen(port, (err) => {  
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
})

app.engine('.hbs', exphbs({  
  defaultLayout: 'main',
  extname: '.hbs',
  layoutsDir: path.join(__dirname, 'views/layouts')
}))


app.get('/home', (request, response)=>{
	response.render('home',{})
})

app.get('/login', (request, response)=>{
	response.render('login',{})
})

app.get('/questionnaire-answers', (request, response)=>{
	response.render('questionnaire-answers',{})
})

app.get('/participants-questionnaire', (request, response)=>{
	response.render('participants-questionnaire',{})
})

app.get('/consent-form', (request, response)=>{
  response.render('consent-form',{})
})


app.get('/research-answers', (request, response)=>{
  response.render('research-answers',{})
})

app.get('/training', (request, response)=>{
  response.render('training',{})
})


app.get('/research-answers-db', (request, response)=>{
    pg.connect(conString, function (err,client) {
    if (err) {
      console.log("CANT CONNECT TO DB");
    }
   
   client.query('SELECT * FROM public.participants_answers', [], function(err,result){     
      if (err){
        console.log('An error occured when trying to retrieve participants research answers');
        return response.sendStatus(500);
      }
      //console.log("json(result): ", response.json(result));
      return response.json(result.rows);

 })

})
  })

app.get('/questionnaire-answers-db', (request,response) =>{
    pg.connect(conString, function (err,client) {
    if (err) {
      console.log("CANT CONNECT TO DB");
    }
   
   client.query('SELECT * FROM public.participant_info', [], function(err,result){     
      if (err){
        console.log('An error occured when trying to retrieve participants research answers');
        return response.sendStatus(500);
      }
      //console.log("json(result): ", response.json(result));
      return response.json(result.rows);

 })

})
  })

app.get('/get-participantId', (request, response)=>{
    pg.connect(conString, function (err,client) {
    if (err) {
      console.log("CANT CONNECT TO DB");
    }
   
   client.query('SELECT participant_id FROM public.participant_info WHERE participant_id=(Select max(participant_id) from public.participant_info)', [], function(err,result){     
      if (err){
        console.log('An error occured when trying to retrieve the participant ID')
        return response.sendStatus(500);
      }
      //console.log("json(result): ", response.json(result));
      return response.json(result.rows);

 })

})
})

app.get('/db-questions', (request, response)=>{
    pg.connect(conString, function (err,client) {
    if (err) {
      console.log("CANT CONNECT TO DB");
    }
    var getQuestions = client.query('SELECT * FROM public.questions;');
   // var getParticipantId = client.query('SELECT participant_id FROM public.participant_info')
   client.query('SELECT * FROM public.questions;', [], function(err,result){     
      if (err){
        console.log('errorrrrrrrrrrrrrrrrrrrr')
        return response.sendStatus(500);
      }
      
      return response.json(result.rows);
     //response.json("[{\"question_id\": 1,\"question\": \"How many nodes does the graph have\",\"one\": \"1\"}]");
 })

})
})
//[{"question_id": 1,"question": "How many nodes does the graph have","one": "1"}]

app.get('/welcome', (request, response)=>{
	response.render('welcome',{})
})

app.get('/research-questions', (request, response)=>{
  response.render('research-questions',{})
})

app.get('/thank-you', (request, response)=>{
	response.render('thank-you',{})
})
