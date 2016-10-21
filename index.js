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

const participants = []
var name;
var id;

app.post('/participants', function (err,client) {
	pg.connect(conString, function (err,client) {
    if (err) {
    	console.log("CANT CONNECT TO DB");
    	return next(err)
      // pass the error to the express error handler
    }
    client.query('INSERT INTO participants (id, name) VALUES (1, \'bla\');', [], function (err, result) {
    //this done callback signals the pg driver that the connection can be closed or returned to the connection pool
    })
  })

})

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

app.set('view engine', '.hbs')  
app.set('views', path.join(__dirname, 'views'))  

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

app.get('/research-answers', (request, response)=>{
	response.render('research-answers',{})
})

app.get('/research-questions', (request, response)=>{
	response.render('research-questions',{})
})

app.get('/welcome', (request, response)=>{
	response.render('welcome',{})
})

app.get('/thank-you', (request, response)=>{
	response.render('thank-you',{})
})

