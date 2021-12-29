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

let userID = undefined;
let userName = undefined;
let inlineID = undefined;
let msgID = undefined;
let chatID = undefined;
let score = 0;
let highScoreCurrUser = 0;

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
bot.gameQuery(async (ctx) => {
  userID = ctx.callbackQuery.from.id;
  userName = ctx.callbackQuery.from.first_name +" @"+ ctx.callbackQuery.from.username;
  inlineID = ctx.callbackQuery.inline_message_id;
  if(ctx.callbackQuery.message){
    msgID = ctx.callbackQuery.message.message_id
    chatID = ctx.callbackQuery.message.chat.id
  }
  if(inlineID != undefined){
    msgID=undefined
    chatID=undefined
  }
  ctx.answerGameQuery(url)
  await highScore();
  console.log(userName+"::Highscore:" + highScoreCurrUser+'|user_id:'+userID+'|inline_id:'+inlineID+'|message_id:'+msgID+ '|chat_id:'+chatID)
})

app.put('/score', async (req,res) => {
  score = req.body.score
  // if(score > highScoreCurrUser){
    try{
      await bot.telegram.setGameScore(userID,score,inlineID, chatID, msgID); 
      console.log("Current_Score:"+ score +"|| Previous_HighScore:"+highScoreCurrUser+"|| New_Score_Updated.")
    } catch(e){
      if(e.response.description === 'Bad Request: BOT_SCORE_NOT_MODIFIED'){
        console.log("Error_code 400::Current Score less than High Score::Bad Request: BOT_SCORE_NOT_MODIFIED")
      }  else if(e.response.description === 'Bad Request: invalid user_id specified'){
        console.log("Error_code 400::Website User::Bad Request: invalid user_id specified")
      }
      else {
        console.log("Unknown error",e)
      }
    }
  // } else {console.log("Current_Score:"+ score +" < Previous_HighScore:"+highScoreCurrUser+" New_Score_NOT_updated.");}
})

async function highScore(){
  try{
    let higher = await bot.telegram.getGameHighScores(userID,inlineID, chatID, msgID);
    for(let i=0; i < higher.length; i++){
      if(higher[i].user.id === userID) {highScoreCurrUser = higher[i].score;}
    }
  } catch(e){
    console.log("Error while requesting Highscore Table", e)
  }
}

bot.launch()
app.listen(process.env.PORT || 5000)

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))