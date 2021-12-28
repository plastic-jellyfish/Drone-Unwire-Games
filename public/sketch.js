let _people = []; 
let numPeople =100;
let dronex, droney, dronew, droneh, shoot, dspeed, ex, dx=0, k;
let fear;
let devkill =0 , civilian =0, sec;
let savedTime = 0;
let active;
let totalTime = 1000;
let _width, _height;
let a=0 ,b=0;
let s=0;
let _DroneFlag = 0;
let _WiredFlag = 0;
let _peopleYellow = [];
let _power = [];
let sc=0;
let numYellow =10;
let savedTime1 = 0;
let activeYellow;
let numPower =5;
let activePower=0;
let font, font1;
let overlay = document.querySelector('.overlay')
let share = document.querySelector('.share')
let resign1 = document.querySelector('.resign-button1')
let resign2 = document.querySelector('.resign-button2')
let dShow=0,wShow=0;
let score =0;
let sendScore=0;

function preload() {
    font = loadFont('assets/ZillaSlab-Regular.ttf');
    font1 = loadFont('assets/Kanit-Light.ttf');
    _width = select(".container2").width;
    _height = select(".container2").height;
    score = 0;
}

function setup() {
  var drone = createCanvas(_width,_height);  
  drone.parent('drone');
  // console.log(score);
}

function windowResized() {
    _width = select(".container2").width;
    _height = select(".container2").height;
    resizeCanvas(_width, _height);
    if((_DroneFlag == 0) && (_WiredFlag == 0)) _Menu();
    if(_DroneFlag == 1) _Drone();
    if(_WiredFlag == 1) _Wired();
}

function draw() {
  if((_DroneFlag == 0) && (_WiredFlag == 0)) _Menu();
  if(_DroneFlag == 1) _Drone();
  if(_WiredFlag == 1) _Wired();

  // select(".share").touchStarted(()=>{
  //   TelegramGameProxy.shareScore()
  //   console.log("gameOver"+score)
  // })
  // select(".share").mousePressed(()=>{
  //   console.log("GameOver"+score)
  //   TelegramGameProxy.shareScore()
  // })
}
//******************************************************************************************//
//***********************************MENU************************************************//
//******************************************************************************************//

function _Menu(){
  removeElements()
  overlay.classList.add('show')
  share.classList.add('show')
  let droneButton = createButton('Feeling Dull...');
  droneButton.style('background','#fff')
  droneButton.style('font-size','20px')
  droneButton.style('border','0')
  droneButton.style('padding','25px')
  droneButton.position(.25*_width, .45*_height)
  droneButton.style('width','200px')
  droneButton.style('box-shadow', '10px 10px #000')
  droneButton.mousePressed(() => {
    share.classList.remove('show')
    restartDrone();
    dShow=1;
    sendScore=1;
    _Drone();
  })

  let unwireButton = createButton('Feeling Anarchy');
  unwireButton.style('background','#fff')
  unwireButton.style('font-size','20px')
  unwireButton.style('border','0')
  unwireButton.style('padding','25px')
  unwireButton.position(.25*_width, .65*_height)
  unwireButton.style('width','200px')
  unwireButton.style('box-shadow', '10px 10px #000')
  unwireButton.mousePressed(() => {
    share.classList.remove('show')
    restartWired();
    wShow=1;
    sendScore=1;
    _Wired();
  })
}

//******************************************************************************************//
//***********************************DRONE************************************************//
//******************************************************************************************//

function _Drone() {
  removeElements()
  overlay.classList.remove('show')
  let title1 = document.getElementById('droneTitle')
  if(dShow ==0) title1.classList.add('show')
  let text1 = document.getElementById('droneText')
  if(dShow ==0) text1.classList.add('show')
  if(dShow ==0) resign1.classList.add('show')
  let press = document.querySelector('.Shoot')
  if(dShow ==0) press.classList.add('show')
  let bg1 = document.querySelector('.parent')
  bg1.classList.add('drone')
  
  let dOverlay = document.querySelector('.droneOverlay')
  if(dShow ==1) dOverlay.classList.add('show')
  dOverlay.addEventListener('click' , () => {
    dOverlay.classList.remove('show')
    dShow =0;
  })

  _DroneFlag = 1;
  resign1.addEventListener('click' , () => {
    removeElements()
    title1.classList.remove('show')
    text1.classList.remove('show')
    bg1.classList.remove('wired')
    press.classList.remove('show')
    resign1.classList.remove('show')
    overlay.classList.add('show')
    _DroneFlag =0;
    _WiredFlag =0;
    console.log(_DroneFlag, _WiredFlag, score)
    setScore.call();
    score = 0;
  })

  background(10);
  buildings();
  let eye = map(dronex,0,width, width/2 - 50, width/2 + 50);
  fill(255);
  noStroke();
  ellipse(width/2, droney, 250, droneh+10);
  beginShape();
    vertex(width/2 - 150, droney);
    vertex(width/2 - 100, droney-50);
    vertex(width/2 + 100, droney-50);
    vertex(width/2 + 150, droney);
    vertex(width/2 + 100, droney+50);
    vertex(width/2 - 100, droney+50);
  endShape();
  fill(0,50,200,50);
  ellipse(eye, droney, droneh-35);
  fill(0,100,200,50);
  ellipse(eye, droney, droneh-25);
  fill(0,50,200,50);
  ellipse(eye, droney, droneh-55);
  fill(0,100,200,50);
  ellipse(eye, droney, droneh-95);

  noStroke();
  fill(255, 20);
  for (let a=0; a<100; a+=20) {
    quad(eye, droney, eye, droney, dronex-((dronew-100)+a), height, dronex+((dronew-100)+a), height);
  }
  strokeWeight(5);
  stroke(255, 0, 0, shoot);
  line(eye, droney, dronex, height);

  if (fear<100) {
    let passedTime = millis() - savedTime;
    if (passedTime > totalTime) {
      fear=fear+1;
      if (active<99) {
        active=active+1;
        // console.log(active);
      }
      
      savedTime = millis(); // Save the current time to restart the timer!
    }
    drone();
    for (let i =0 ; i<active;i++) {
      _people[i].move();
      _people[i].display();
    }
  }

  if (fear>=100) {
    overlay.classList.add('show')
    dOverlay.classList.remove('show')
    let reset = createP('Dull Day & Fine Job! You killed '+devkill+' Deviants & '+civilian+' Civilians today.\n Continue working Next Shift?');
    reset.style('background','#0050ff')
    reset.style('font-size','20px')
    reset.style('border','0')
    reset.style('padding','25px')
    reset.position(_width/2-120, _height/2-200)
    reset.style('width','200px')
    reset.style('height','400px')
    reset.style('box-shadow', '10px 10px #000')

    let yes = createButton('YES');
    yes.style('background','#fff')
    yes.style('font-size','20px')
    yes.style('border','0')
    yes.style('padding','25px')
    yes.position(_width/2-50, _height/2)
    yes.style('width','100px')
    // yes.style('height','400px')
    yes.style('box-shadow', '2px 2px #000')
    yes.mousePressed(() => {
      restartDrone();
      _Drone();
      setScore.call();
      score = 0;
    })

    let no = createButton('NO');
    no.style('background','#fff')
    no.style('font-size','20px')
    no.style('border','0')
    no.style('padding','25px')
    no.position(_width/2-50, _height/2+100)
    no.style('width','100px')
    // yes.style('height','400px')
    no.style('box-shadow', '2px 2px #000')
    no.mousePressed(() => {
      removeElements()
      title1.classList.remove('show')
      text1.classList.remove('show')
      press.classList.remove('show')
      bg1.classList.remove('drone')
      resign1.classList.remove('show')
      overlay.classList.add('show')
      _DroneFlag =0;
      setScore.call();
      score = 0;
    })
    // console.log(score)
  }

  fill(0);
  noStroke();
  textSize(15);
  textAlign(RIGHT,CENTER);
  text("Anxiety ", (width/2)-15, droney-30);
  text("Deviants killed :", (width/2)+10, droney+0);
  text("Civilians killed :", (width/2)+10, droney+25);
  text(devkill, (width/2)+25, droney+0);
  text(civilian, (width/2)+25, droney+25);

  noStroke();
  fill(255, 0, 0);
  rect((width/2)-10, droney-30, (width/2)-10+fear, droney-30+7,5);
  noFill();
  stroke(0);
  strokeWeight(1);
  rect((width/2)-11, droney-32, (width/2)-11+105, droney-30+11,5);
}

function setScore(){
  if(sendScore == 1){
    let response = axios.put('/score',{score:score})
    console.log('scoreSet', response)
    sendScore=0;
  }
}

function restartDrone() {
  removeElements();
  devkill =0;
  civilian=0;
  dronex = width/2;
  droney = 0.15 * height;
  dronew = 0.1 * width;
  droneh = 0.2 * height;
  dspeed=1;
  shoot=50;
  savedTime = millis();
  active=20;
  ex=0;
  k=0.05;
  s = width;
  textFont(font);
  textSize(12);
  fear = 0;
  rectMode(CORNERS);

  // _people = new People[numPeople];
  for (let i=0; i<numPeople; i++) {
    newpeople = new People(i);
    _people[i] = newpeople;
  }
}

function buildings(){
  noStroke();
  fill(0,100,100,20);
  for(let i =a ; i < width; i += 100){
    rect(i,.8*height,i+50,.6*height);
  }
  fill(100,20);
  for(let i = b ; i < width; i += 100){
    rect(i,height,i+30,.8*height);
  }
  fill(0,100,200,50);
  ellipse(s,.2*height,50,50);
  ellipse(s+30,.25*height,100,50);
  rect(s+100, .2*height, s+200, .19*height)
  rect(s-50, .25*height, s-150, .24*height)
  a += 1;
  if(a>50) a=-50;
  b -= 1;
  if(b<-100) b=0;
  s -= 1;
  if(s<-200) s=width+200;
}

class People {
  // float head, body, x, speed, limb;
  // int deviant, r, g, b, life;

  constructor(i) {
    this.head = random(10, 20);
    this.body = random(30, 70);
    this.limb= 0.4 * this.body;
    this.x = random(-width, 2*width);
    this.life = 1;
    this.speed = random(-1.5, 1.5);
    if (this.speed>0) {
      this.speed = this.speed + 0.5;
    }
    else { 
      this.speed = this.speed - 0.5;
    }
    this.deviant=int(random(2));
    if (this.deviant == 1) {
      this.r = random(255);
      this.g = random(255);
      this.b = random(255);
    }
  }

  move() {
    if ((this.x<-width)||(this.x>(2*width))) {
      this.speed = this.speed * -1;
    }
    this.x = this.x + this.speed;
  }

  kill() {
    this.speed=0;
    this.body = this.head/2;
    this.life = 0;
  }

  display() {
    if (this.life==1) {
      if ((this.deviant == 1) && ((this.x > (dronex-dronew))&&(this.x < (dronex+dronew)))) {
        fill(this.r, this.g, this.b);
        stroke(this.r, this.g, this.b);
      }
      else if ((this.deviant == 0) && ((this.x > (dronex-dronew))&&(this.x < (dronex+dronew)))) {
        fill(255);
        stroke(255);
      }
      else {
        fill(255, 100);
        stroke(255, 100);
      }
      strokeWeight(0);
      ellipse(this.x, (height - this.body), this.head, this.head);
      strokeWeight(5);
      noFill();
      if (this.speed>0) {
        bezier(this.x, height-this.body, this.x-(2*this.head), height-this.limb, this.x+(2*this.head), height-this.limb, (this.x-this.head)+dx, height);
        curve( this.x-(2*this.head), height-this.body, this.x, height-(this.body/2), (this.x+this.head)-dx, height, this.x+(2*this.head), height-this.limb );
        curve( this.x-(2*this.head), height-this.body, this.x-(this.head/2), height-(this.body*3/4), (this.x+this.head)-dx, height-(this.body/2), this.x+(2*this.head), height-this.limb );
        curve( this.x-(2*this.head), height-this.body, this.x-(this.head/2), height-(this.body*3/4), (this.x-this.head)+dx, height-(this.body/2), this.x+(2*this.head), height-this.limb );
      }
      else {
        bezier(this.x, height-this.body, this.x+(2*this.head), height-this.limb, this.x-(2*this.head), height-this.limb, (this.x+this.head)-dx, height);
        curve( this.x+(2*this.head), height-this.limb, this.x, height-(this.body/2), (this.x-this.head)+dx, height, this.x-(2*this.head), height-this.body);
        curve( this.x+(2*this.head), height-this.limb, this.x+(this.head/2), height-(this.body*3/4), (this.x-this.head)+dx, height-(this.body/2), this.x-(2*this.head), height-this.body);
        curve(this.x+(2*this.head), height-this.limb, this.x+(this.head/2), height-(this.body*3/4), (this.x+this.head)-dx, height-(this.body/2), this.x-(2*this.head), height-this.body);
      }

      if ((dx<0)||(dx>(2*this.head))) {
        k=k*-1;
      }
      dx=dx+k;
    }
    if (this.life==0) {
      if ((this.deviant==1) && ((this.x>(dronex-dronew))&&(this.x<(dronex+dronew)))) {
        fill(this.r,this.g, this.b);
      }
      else if ((this.deviant==0) && ((this.x>(dronex-dronew))&&(this.x<(dronex+dronew)))) {
        fill(255);
      }
      else {
        fill(255, 100);
      }
      noStroke();
      triangle(this.x, height-this.head, this.x-this.head, height, this.x+this.head, height);
    }
  }
}

function drone() {
    if ((dronex>= 0)&&(dronex<=width)) {
        dronex=dronex+dspeed;       
    }
    if (dronex<0) {
        dronex=0;
        dspeed *= -1;
    }
    if (dronex>width) {
        dronex=width;
        dspeed *= -1;
    }
 
    select(".Shoot").touchStarted(()=>{
      shoot=255;
      for (let i=0; i<active ; i++) {
        if ((_people[i].x >= (dronex-_people[i].head)) && (_people[i].x <= (dronex+_people[i].head))) {
          if ((_people[i].deviant == 1) && (_people[i].life==1)) {
            devkill=devkill+1;
            if (fear>10) {
              fear=fear-1;
            }
          }
          else if ((_people[i].deviant == 0) && (_people[i].life==1)) {
            civilian=civilian+1;
            fear=fear+1;
          }
          _people[i].kill();
        }
      }
    })
    select(".Shoot").touchEnded(()=>{
      if (shoot == 255) {
          shoot=50;
        }
    })
    
    select(".Shoot").mousePressed(()=>{
        shoot=255;
        for (let i=0; i<active ; i++) {
          if ((_people[i].x >= (dronex-_people[i].head)) && (_people[i].x <= (dronex+_people[i].head))) {
            if ((_people[i].deviant == 1) && (_people[i].life==1)) {
              devkill=devkill+1;
              score +=1;
              if (fear>10) {
                fear=fear-1;
              }
            }
            else if ((_people[i].deviant == 0) && (_people[i].life==1)) {
              civilian=civilian+1;
              score +=1;
              fear=fear+1;
            }
            _people[i].kill();
          }
        }
    })
    select(".Shoot").mouseReleased(()=>{
        if (shoot == 255) {
            shoot=50;
          }
    })
}

//******************************************************************************************//
//***********************************UNWIRED************************************************//
//******************************************************************************************//

function _Wired() {
  removeElements()
  overlay.classList.remove('show')
  let title = document.getElementById('wiredTitle')
  if(wShow == 0) title.classList.add('show')
  let text = document.getElementById('wiredText')
  if(wShow == 0) text.classList.add('show')
  if(wShow ==0) resign2.classList.add('show')
  let bg = document.querySelector('.parent')
  bg.classList.add('wired')

  let wOverlay = document.querySelector('.wiredOverlay')
  if(wShow == 1) wOverlay.classList.add('show')
  wOverlay.addEventListener('click', () => {
    wOverlay.classList.remove('show')
    wShow = 0;
  })

  background(150);
  _WiredFlag = 1;

  resign2.addEventListener('click' , () => {
    title.classList.remove('show')
    text.classList.remove('show')
    resign2.classList.remove('show')
    bg.classList.remove('wired')
    _WiredFlag = 0;
    _DroneFlag =0;
    console.log(_DroneFlag, _WiredFlag, score)
    setScore.call();
    score = 0;
  })
  
  if (activePower>0) {
    for (let j =0 ; j<numPower;j++) {
      _power[j].display();
      _power[j].attack();
      if (_power[j].plife==1) {
        _power[j].scan();
      }
      _power[j].recover();
    }

    for (let i =0 ; i<numYellow;i++) {
      _peopleYellow[i].display();
      _peopleYellow[i].move();
    }

    fill(0, 150);
    noStroke();
    rect(mouseX, mouseY, 30, 15, 10);
    stroke(250);
    fill(0, 0, 255);
    // ellipse(mouseX, mouseY, 20, 20);
    rect(mouseX, mouseY, 20, 20);
  }
  else {
    for (let j =0 ; j<numPower;j++) {
      _power[j].display();
    }
    for (let i =0 ; i<numYellow;i++) {
      _peopleYellow[i].display();
    }
    fill(255, 150);
    noStroke();
    rect(mouseX, mouseY, 40, 15, 10);
    stroke(250);
    fill(0, 0, 255);
    ellipse(mouseX, mouseY, 20, 20);

    overlay.classList.add('show')
    wOverlay.classList.remove('show')
    let reset = createP('Good Job! The Red Circles are destructed and you have unwired all the Yellows. Want to Un-wire more?');
    reset.style('background','#0050ff')
    reset.style('font-size','20px')
    reset.style('border','0')
    reset.style('padding','25px')
    reset.position(width/2-120, _height/2-200)
    reset.style('width','200px')
    reset.style('height','400px')
    reset.style('box-shadow', '10px 10px #000')

    let yes = createButton('YES');
    yes.style('background','#fff')
    yes.style('font-size','20px')
    yes.style('border','0')
    yes.style('padding','25px')
    yes.position(_width/2-50, _height/2)
    yes.style('width','100px')
    // yes.style('height','400px')
    yes.style('box-shadow', '2px 2px #000')
    yes.mousePressed(() => {
      restartWired();
      _Wired();
      setScore.call();
      score = 0;
    })

    let no = createButton('NO');
    no.style('background','#fff')
    no.style('font-size','20px')
    no.style('border','0')
    no.style('padding','25px')
    no.position(_width/2-50, _height/2+100)
    no.style('width','100px')
    // yes.style('height','400px')
    no.style('box-shadow', '2px 2px #000')
    no.mousePressed(() => {
      removeElements()
      title.classList.remove('show')
      text.classList.remove('show')
      bg.classList.remove('wired')
      resign2.classList.remove('show')
      _WiredFlag =0;
      setScore.call();
      score = 0;
    })
  }
}

function restartWired() {
  removeElements();
  activeYellow= 0;
  noCursor();
  rectMode(CENTER);
  textFont(font1);
  textSize(12);
  textAlign(CENTER,CENTER);

  for (let i=0; i<numYellow; i++) {
    newpeople = new PeopleYellow(i);
    _peopleYellow[i] = newpeople;
  }
  for (let j=0; j<numPower; j++) {
    newpower = new Power(j);
    _power[j] = newpower;
  }
  activePower=numPower;
}

class PeopleYellow {
  // let x, y, speedx, speedy, speedwx, speedwy;
  // let wired, life;

  constructor(i) {
    this.life = 1;
    this.wired =1;
    this.x = random(100, _width-100);
    this.y = random(100, _height-100);
    this.speedx = random(-0.5, 0.5);
    this.speedy = random(-0.5, 0.5);
    if (this.speedx>0) {
      this.speedx = this.speedx+ 0.5;
    }
    else { 
      this.speedx = this.speedx- 0.5;
    }
    // console.log('people:'+i+':'+this.life)
  }

  move() {
    if ((this.wired==1) ||((this.wired==0)&&(this.activePower==0))) {
      if ((this.x>(mouseX-10))&&(this.x<(mouseX+10))&&(this.y>(mouseY-10))&&(this.y<(mouseY+10))) {
        this.talk();
        let passedTime = millis() - savedTime;
        // console.log(millis(), passedTime, savedTime)

        if (passedTime > (2* totalTime)) {
          //          activeYellow=activeYellow+1;
          this.wired=0;
          savedTime = millis(); // Save the current time to restart the timer!
          // console.log(savedTime)
          score += 1;
        }
      }
      else {
        if ((this.x<0)||(this.x>width)) {
          this.speedx=this.speedx*-1;
        }
        if ((this.y<0)||(this.y>height)) {
          this.speedy=this.speedy*-1;
        }
        this.x=this.x+this.speedx;
        this.y=this.y+this.speedy;
      }
    }
    if ((this.wired==0) &&(activePower>0)) {
      let j=0;
      for (let i=(numPower-1); i>=0; i--) {
        if (_power[i].plife==1) {
          j=i;
        }
      }

      this.speedwx=(_power[j].px-this.x)/100;
      this.speedwy=(_power[j].py-this.y)/100;
      this.x=this.x+this.speedwx;
      this.y=this.y+this.speedwy;
    }
  }

  talk() {
    fill(255);
    noStroke();
    textSize(14);
    // textAlign(RIGHT);
    text("#@*%", this.x+30, mouseY-20);
  }

  display() {
    if (this.life==1) {
      fill(0, 150);
      noStroke();
      // rect(this.x, this.y, 40, 15, 10);

      if (this.wired==1) {
        fill(255, 255, 0, 200);
        stroke(100);
      }
      else if (this.wired==0) {
        fill(255, 200);
        stroke(255);
      }

      strokeWeight(2);
      // ellipse(this.x, this.y, 20, 20);
      triangle(this.x-15,this.y+15,this.x+15,this.y+15,this.x,this.y-10);
    }
  }
}

class Power {
//   let px, py;
//   let plife, strength, recoverTime;

  constructor(i) {
    this.plife = 1;
    if (i==0) {
      this.px=(_width/4);
      this.py=(_height/4);
    }
    if (i==1) {
      this.px=(_width/4)*3;
      this.py= (_height/4);
    }
    if (i==2) {
      this.px=(_width/2);
      this.py= (_height/2);
    }
    if (i==3) {
      this.px=(_width/4);
      this.py= (_height/4)*3;
    }
    if (i==4) {
      this.px=(_width/4)*3;
      this.py= (_height/4)*3;
    }
    this.strength=4;
    this.recoverTime=0;
    // console.log('power:'+i+':'+this.plife)
  }

  scan()
  {
    let passedTime1 = millis() - savedTime1;
    if (passedTime1 > (1*totalTime)) {

      if ((_peopleYellow[sc].wired)==0) {
        _peopleYellow[sc].wired=1;
      }

      sc=sc+1;
      if (sc==numYellow) {
        sc=0;
      }
      savedTime1 = millis(); // Save the current time to restart the timer!
    }
  }

  attack() {
    for (let i=0;i<numPower;i++) {
      for (let j =0;j<numYellow;j++) {
        if ((_peopleYellow[j].wired==0)&&(_power[i].plife==1)) {

          if ((_peopleYellow[j].x>=(_power[i].px-20)) && (_peopleYellow[j].x<=(_power[i].px+20))&&(_peopleYellow[j].y>=(_power[i].py-20)) && (_peopleYellow[j].y<=(_power[i].py+20))) {
            //              print(" x:"+_peopleYellow[j].x+" px:"+_power[i].px+" y:"+_peopleYellow[j].y+" py:"+_power[i].py);
            activeYellow=activeYellow+1;
            if (activeYellow==1) {
              _power[i].strength=3;
            }
            else if (activeYellow==2) {
              _power[i].strength=2;
            }
            else if (activeYellow==3) {
              _power[i].strength=1;
            }
            //           print(" Pow:"+i+" Strength:"+_power[i].strength+" activeYellow:"+activeYellow);
          }
          if (activeYellow>=4) {
            _power[i].plife=0;
            _power[i].strength=0;
            _power[i].recoverTime = millis();
            for (let k =0;k<numYellow;k++) {
              if (activePower>1) {
                _peopleYellow[k].wired=1;
              }
            }
            activeYellow=0;
            activePower=activePower-1;
            score+=10;
            // console.log(score);
          }
        }
      }
      activeYellow=0;
    }
  }

  recover() {
    if (this.plife==0) {
      let passedTime2 = millis() - this.recoverTime;
      fill(0);
      noStroke();
      textSize(18);
      textAlign(CENTER,CENTER);
      text(int(((120*totalTime)/1000)-(passedTime2/1000)), this.px, this.py);
      if (passedTime2 > (120*totalTime)) {
        this.plife=1;
        this.strength=4;
        this.activePower=this.activePower+1;
      }
    }
  }
  display() {
    if (this.plife==1) {
      strokeWeight(5);
      stroke(255, 255, 0, 50);    
      line(this.px, this.py, _peopleYellow[sc].x, _peopleYellow[sc].y);
      stroke(50, 10);
      for (let i=0; i<numYellow;i++) {
        if ((i!=sc)&&(_peopleYellow[i].wired==1)) {
          line(this.px, this.py, _peopleYellow[i].x, _peopleYellow[i].y);
        }
      }
    }

    if ((this.plife==1)&&(this.strength==4)) {
      fill(255, 0, 0);
    }
    else if ((this.plife==1)&&(this.strength==3)) {
      fill(255, 128, 0);
    }
    else if ((this.plife==1)&&(this.strength==2)) {
      fill(255, 200, 0);
    }
    else if ((this.plife==1)&&(this.strength==1)) {
      fill(255, 250, 0);
    }
    else if (this.plife==0) {
      fill(150);
    }
    stroke(100);
    strokeWeight(3);
    ellipse(this.px, this.py, 50, 50);
  }
}
