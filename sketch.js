var dog,happyDog,database,foodS,foodStock,dogImg,feedTime,lastFed,foodObj;
var gameState=0;
var readState;
var bedroom,washroom,garden,sadDog,livingroom;

function preload(){
	dogImg=loadImage("dog1.png");
  happyDog=loadImage("dog2.png");
  bedroom=loadImage("BedRoom.png");
  garden=loadImage("Garden.png");
  washroom=loadImage("WashRoom.png");
  sadDog=loadImage("sadDog.png")
  milkBottle2=loadImage("Milk.png");
  livingroom=loadImage("Living Room.png");


}

function setup() {
	
  database = firebase.database();
  createCanvas(1000,500);

  foodObj= new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
   
  dog=createSprite(830,180,50,20);
  dog.addImage(dogImg);
  dog.scale=0.2
  
  feed=createButton("feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

  }


function draw() {  
   background("green");
  
   foodObj.display();
    //addFoods(foodS);
    
    if(foodS) {
    dog.addImage(happyDog);
    milkBottle2.visible=false;
    }else{
    dog.addImage(sadDog);
    milkBottle2.visible=true;
    }
    
  fedTime=database.ref('feedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  })
  
  readState=database.ref('gameState');
  readState.on("value",function (data){
   gameState=data.val();
  })


   currentTime=hour();
if(currentTime==(lastFed+1)){
update("Playing");
foodObj.garden();
}else if(currentTime==(lastFed+2)){
update("Sleeping");
foodObj. bedroom();
}else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
update("Bathing");
foodObj.washroom();
}else{
update("Hungry")
foodObj.display();
}


   if(gameState!="Hungry"){
     feed.hide();
     addFood.hide();
     dog.remove();
   }else{
     feed.show();
     addFood.show();
     dog.addImage(sadDog);
   }
 
   if(gameState===1){
    dog.addImage(happyDog);
    dog.scale=8.175;
    dog.y=250;
    }
    
    if(gameState===2){
      dog.addImage(sadDog);
      dog.scale=0.175;
      dog.y=250;
      }
       
      var button=createButton("Feed the Dog");
      button.position(480,125);
      if(button.mousePressed(function(){
      foodS=foodS-1;
      gameState=1;
      database.ref('/').update({'gameState': gameState})
      }));

      var Bath=createButton("I want to take bath");
      Bath.position(580,125);
      if(Bath.mousePressed(function(){
      gameState=3;
      database.ref('/').update({'gameState':gameState});
      }));
      if(gameState===3){
      dog.addImage(washroom);
      dog.scale=1;
      milkBotitle2.visible=false;
      }
         
      var Sleep=createButton("I am very sleepy");
      Sleep.position(710,125);
      if(Sleep.mousePressed(function(){
      gameState=4;
      database.ref('/').update({'gameState':gameState});
      }));
     if(gameState===4){
     dog.addImage(bedroom);
     dog.scale=1;
     milkBotitle2.visible=false;
}
    var Play=createButton("Lets play !");
    Play.position(500,160);
    if(Play.mousePressed(function(){
    gameState=5;
    database.ref('/').update({'gameState':gameState});
    }));
    if(gameState===5){
   dog.addImage(livingroom);
   dog.scale-1;
   milkBotitle2.visible=false;
}

   var PlayInGarden=createButton("Lets play in park");
   PlayInGarden.position(585,160);
   if(PlayInGarden.mousePressed(function(){
   gameState=6;
   database.ref('/').update({'gameState':gameState});
   }));
   if(gameState===6){
   dog.y=175;
   dog.addImage(garden);
   dog.scale=1;
   milkBottle2.visible=false;
}



  drawSprites();

}

function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}

//function writeStock(x){
  //database.ref('/').update({
  //food:x
 // })
//}

function feedDog(){
  dog.addImage(happyDog);
  foodObj.updateFoodStock(foodObj.getFoodStock()-1);

  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour(),
    gameState:"hungry"
  })
}

function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

function update(state){
  database.ref('/').update({
     gameState:state
  });
}

