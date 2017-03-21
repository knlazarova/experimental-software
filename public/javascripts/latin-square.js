//latin square generator

const fs = require('fs');
latinSquare = require('latin-square')

var participants = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36]
var makeRow = latinSquare(participants)
var latinSquareQuestions = participants.map(makeRow)
count = 0

for (var i = latinSquareQuestions.length - 1; i >= 0; i--) {
  count++
}
