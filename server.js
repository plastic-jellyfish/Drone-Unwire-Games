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
let userID = null;
let chatID = null;
let msgID = null;
let score = null;
// userID = 1029745540;
// chatID = 1029745540;
// msgID = 183;

app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.static('public'))

app.get('/', (req,res) => {
  res.render('index')
})

app.put('/score', (req,res) => {
  score = req.body.score
  res.json(req.body)
  if (userID != null) { 
    let scoreSet = bot.setGameScore(userID,score,chatID,msgID); 
    bot.sendMessage(userID, "Score:"+ score)
    bot.sendMessage(userID, "Score:"+ scoreSet.game.title)
  }
  console.log(score, scoreSet.game.title)
})

// Matches /start
bot.onText(/\/start/, function onPhotoText(msg) {
    bot.sendGame(msg.chat.id, gameName);
});
  
// Handle callback queries
bot.on('callback_query', function onCallbackQuery(callbackQuery) {
  bot.answerCallbackQuery(callbackQuery.id, {url: url, show_alert: true});
  userID = callbackQuery.from.id
  chatID = callbackQuery.message.chat.id
  msgID = callbackQuery.message.message_id
  console.log(userID, chatID, msgID);
});

bot.onText(/help/, (msg) => bot.sendMessage(msg.from.id, "This is a Game App"));
bot.onText(/score/, (msg) =>{ 
  let highScore = bot.getGameHighScores(msg.from.id, msg.message.chat.id, msg.message.message_id)
  bot.sendMessage(msg.from.id, "Score:"+score)
  bot.sendMessage(msg.from.id,"HighScore", {"position": highScore.position, "user": highScore.user, "score": highScore.score})
});

app.listen(process.env.PORT || 5000)