const five = require("johnny-five");
const board = new five.Board();

board.on("ready", function () {
  
  const lcd = new five.LCD({
    controller: "PCF8574", 
    address: 0x27,        
    rows: 2,           
    cols: 16               
  });

  const button = new five.Button({
    pin: 2,
    isPullup: true   
  });
  
  let dinoX = 1;
  let dinoY = 1;
  
  let isJumping = false;
  let score = 0;
  let isGameOver = false;
  let maxCols = 16;
  let treeY = 1;
  let treeX = maxCols;
  let speed = 300;
  let treeMoveInterval;
  const tree = 'T';  
  const dino = 'D';

  lcd.clear().print("Dino Game Start");
  lcd.clear();

  this.loop(10, () => {
    if(isGameOver) return;

    lcd.cursor(dinoX, dinoY).print(dino);    
  }); 

  treeMoveInterval = setInterval(moveTree, speed); 

  button.on("down", function () {
    if (isGameOver) {
      restartGame();
      return; 
    }
    
    if (isJumping) return; 
    jump(); 
  });
  
  function jump() {
    isJumping = true;
    dinoY = 0;
    dinoX = 2;
    lcd.cursor(1, 1).print(" ");
    lcd.cursor(dinoY, dinoX).print(dino);
  
    setTimeout(() => {
      dinoY = 1;
      lcd.cursor(0, 2).print(" ");
      lcd.cursor(dinoY, dinoX).print(dino);
  
      setTimeout(() => {
        dinoX = 1;
        lcd.cursor(1, 2).print(" ");
        lcd.cursor(dinoY, dinoX).print(dino);
  
        setTimeout(() => {
          isJumping = false; 
        }, 1000);
      }, 300);
    }, 300);
  }

  function moveTree() {
    if (!isGameOver){
      lcd.cursor(1, treeX);
      lcd.print(tree);

      if (treeX > 0) {
        lcd.cursor(1, treeX + 1);  
        lcd.print(" "); 
      }    
      
      if (treeX === dinoX && treeY === dinoY){ 
        endGame();
        return;
      }
        
      treeX = (treeX - 1) % maxCols; 
      if (treeX <= 0) {
        console.log("Score +1");
        treeX = maxCols;
        score++;

        if(score % 3 === 0 && speed > 0 && score != 0) {
          console.log("Speed Up");
          speed -= 30;
          clearInterval(treeMoveInterval);
          treeMoveInterval = setInterval(moveTree, speed);
        }
      }
    }
  }

  function endGame() {
    console.log("Game Over");
    isGameOver = true;
    clearInterval(treeMoveInterval);
    lcd.clear().cursor(0, 3).print("Game Over");
    
    setTimeout(() => {
      lcd.clear().cursor(0, 0).print("Final Score: " + score);
    }, 1000); 
  }

  function restartGame() {    
    console.log("Restart Game");
    lcd.clear();
    score = 0;
    speed = 300;
    treeX = maxCols;
    lcd.clear().print("Dino Game Start");
    lcd.clear();
    isGameOver = false;
    clearInterval(treeMoveInterval);
    treeMoveInterval = setInterval(moveTree, speed);
  }
});

