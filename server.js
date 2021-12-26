require("dotenv").config();
const express = require('express')
const path = require("path");
const TelegramBot = require("node-telegram-bot-api");
const TOKEN = process.env.TOKEN;
const bot = new TelegramBot(TOKEN, { polling: true } );
const gameName = process.env.GAMENAME;
let url = 'https://dull-and-disorder.herokuapp.com/';
// let url = 'http://localhost:5000/'
const app = express()
let userID ='';
global.score = 0;

app.use(express.json())
app.use(express.static('public'))

// Matches /start
bot.onText(/\/start/, function onPhotoText(msg) {
    bot.sendGame(msg.chat.id, gameName);
});
  
// Handle callback queries
bot.on('callback_query', function onCallbackQuery(callbackQuery) {
  bot.answerCallbackQuery(callbackQuery.id, {url: url, show_alert: true});
  userID = callbackQuery.from.id
  console.log(userID);
//   console.log(score);
});

function setScore(){
    bot.setGameScore(userID,score);
    console.log(userID, score);
}

if (userID != '') setScore();

bot.onText(/help/, (msg) => bot.sendMessage(msg.from.id, "This Game App"));

app.listen(process.env.PORT || 5000)