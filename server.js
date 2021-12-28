require("dotenv").config();
const express = require('express')
const path = require("path");
const { Telegraf, Markup } = require('telegraf')
const { resolve } = require("path");
const TOKEN = process.env.TOKEN;
const bot = new Telegraf(TOKEN)
const gameName = process.env.GAMENAME;
let url = 'https://dull-and-disorder.herokuapp.com/';
// let url = 'http://localhost:5000/'
const app = express()
const log4js = require("log4js");
log4js.configure({
  appenders: { cheese: { type: "file", filename: "cheese.log" } },
  categories: { default: { appenders: ["cheese"], level: "error" } }
});
const logger = log4js.getLogger("cheese");

let userID = undefined;
let inlineID = undefined;
let msgID = undefined;
let chatID = undefined;
let score = 0;

const markup = Markup.inlineKeyboard([
  Markup.button.game('🎮 Play now!'),
  Markup.button.url('Telegraf help', 'http://telegraf.js.org')
])

app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.static('public'))

app.get('/', (req,res) => {
  res.render('index')
})

bot.start((ctx) => ctx.replyWithGame(gameName))
bot.command('foo', (ctx) => ctx.replyWithGame(gameName, markup))
bot.command('help', (ctx) => ctx.reply('This is Game Bot!'))
bot.gameQuery((ctx) => {
  userID = ctx.callbackQuery.from.id;
  inlineID = ctx.callbackQuery.inline_message_id;
  if(ctx.callbackQuery.message){
    msgID = ctx.callbackQuery.message.message_id
    chatID = ctx.callbackQuery.message.chat.id
  }
  if(inlineID != undefined){
    msgID=undefined
    chatID=undefined
  }
  console.log('user_id:'+userID+', inline_id:'+inlineID+', message_id:'+msgID+ ', chat_id:'+chatID );
  logger.error('user_id:'+userID+', inline_id:'+inlineID+', message_id:'+msgID+ ', chat_id:'+chatID );
  ctx.answerGameQuery(url)
})

app.put('/score', async (req,res) => {
  score = req.body.score
  try{
    await bot.telegram.setGameScore(userID,score,inlineID, chatID, msgID); 
  } catch(e){
    if(e.response.error_code === 400){
      console.log("Error_code 400 Score not modified")
    } else {
      console.log("Unknown error",e)
    }
    logger.error("Cheese is too ripe! Set Score Error",e);
  }
  // bot.telegram.sendMessage(userID, "Score:"+ score)
  console.log(score)
  logger.error("Cheese is Comté."+score);
})

// bot.command('score', async (ctx) => {
//   ctx.reply('HighScoreTable:')
//   let highScore = await bot.telegram.getGameHighScores(userID,inlineID, chatID, msgID);
//   console.log(highScore.position)
//   console.log(highScore.score)
//   // ctx.reply("HighScoreTable:"+"position:"+ highScore.position + "user:"+ highScore.user.first_name + "score:" + highScore.score)
// });


// logger.trace("Entering cheese testing");
// logger.debug("Got cheese.");
// logger.info("Cheese is Comté.");
// logger.warn("Cheese is quite smelly.");
// logger.error("Cheese is too ripe!");
// logger.fatal("Cheese was breeding ground for listeria.");

bot.launch()
app.listen(process.env.PORT || 5000)

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))