require("dotenv").config();
const express = require('express')
const path = require("path");
const TelegramBot = require("node-telegram-bot-api");
const { resolve } = require("path");
const TOKEN = process.env.TOKEN;
const bot = new TelegramBot(TOKEN, { polling: true } );
const gameName = process.env.GAMENAME;
let url = 'https://dull-and-disorder.herokuapp.com/';
// let url = 'http://localhost:5000/'
const app = express()
let userID = null;
let inlineID = null;
let msgID = null;
let score = 0;
// userID = '1029745540';
// chatID = 1029745540;
// msgID = 244;
var user ={
  userID: null
};

user.userID = userID;

app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.static('public'))

app.get('/', (req,res) => {
  res.render('index')
})

app.put('/score', (req,res) => {
  score = req.body.score
  // bot.sendMessage(userID, "Score:"+ score)
  try{
   let SS = bot.setGameScore(userID,score,inlineID); 
   console.log(SS)
  } catch(e){
    console.log("setScore Failed",e)  
  }
})

// Matches /start
bot.onText(/\/start/, function onPhotoText(msg) {
    bot.sendGame(msg.chat.id, gameName);
});
  
// Handle callback queries
bot.on('callback_query', function onCallbackQuery(callbackQuery) {
  bot.answerCallbackQuery(callbackQuery.id, {url: url, show_alert: true});
  userID = callbackQuery.from.id
  inlineID = callbackQuery.inline_message_id
  // msgID = callbackQuery.message.message_id
  console.log(userID);
  console.log(inlineID);
  // console.log(msgID);
  // console.log(callbackQuery);
});

bot.on("polling_error", console.log);

bot.onText(/help/, (msg) => bot.sendMessage(msg.from.id, "This is a Game App"));
bot.onText(/score/, (msg) =>{ 
    console.log(msg.from.id, msgID)
    let res = bot.getGameHighScores(msg.from.id,chatID)
    console.log(res)
    bot.sendMessage(msg.from.id, "Score:"+score)
    // bot.sendMessage(msg.from.id,"HighScoreTable", {"position": highScore.position, "user": highScore.user, "score": highScore.score})
});

app.listen(process.env.PORT || 5000)