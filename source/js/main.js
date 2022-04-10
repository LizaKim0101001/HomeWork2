//переменные для редактирования canvas
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const backGround = new Image();
backGround.src = "./img/background.png";
const food = new Image();
food.src = "./img/eat.svg"

//размер ячеек
const cell = 20;

//переменные для счета и умножителя очков
let score = 0;
let scoreFactor = 1;

//переменная для записи координат еды
let foodCoord = {};

// регуляторы сложности игры
let gameDifficulty = 'easy';
let timeOut = 0; // уменьшает или увеличивает скорость перерисовки (передвижения) змейки

// получаем элемент, куда записываем результат
const scoreHolder = document.querySelector('#score')


//массив с объектами, куда заисанно начальное положение змейки
const startCoordForSnake = [
    {
        x: 10*cell,
        y: 9*cell,
    },
    {
        x: 10*cell,
        y: 10*cell,
    }
]

// объявляем змейку
let solidSnake = [];
let newHead = {}
let direction = 'up';
//запуск игры по нажатию на кнопку
let start; 

const btnStart = document.querySelector('#start');
const btnStop = document.querySelector('#stop');

btnStart.addEventListener('click', startGame);
btnStop.addEventListener('click', stopGame);

//для окончания игры
function stopGame() {
    clearInterval(start);
    restartGame()
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}
//для начала игры
function startGame() {
    newFoodcoord()
    restartSnake()
    gameSettings()
    start = setInterval(draw, timeOut);
}

//слушатели событий для управления змейкой
document.addEventListener('keydown', function (event) {
    let keyName = event.keyCode;
    if ((keyName == '37'|| keyName == '65') && direction !='right'){ 
        direction ='left';
    }
    else if ((keyName == '38' || keyName == '87') && direction !='down'){
        direction ='up';
     }
    else if ((keyName == '39' || keyName ==  '68') && direction !='left'){
        direction ='right';
    }
    else if ((keyName == '40' || keyName == '83') && direction !='up'){
        direction ='down';
    }
})

//функция по отрисовки змейки
function draw (){
    ctx.drawImage(backGround, 0, 0);
    ctx.drawImage(food, foodCoord.x, foodCoord.y);

    let newX = solidSnake[0].x
    let newY = solidSnake[0].y

    drawSnake(solidSnake)
    snakeEat( newX, newY)
    borderCollision(newX, newY)
    snakeHead( newX, newY)
    snakeEatItself(newHead, solidSnake)
}

function drawSnake(array) {
    for (let i = 0; i <  array.length; i++) {
        if (i == 0){
            ctx.fillStyle='green';
        } else{
            ctx.fillStyle='blue';
        }
        ctx.fillRect(array[i].x, array[i].y, 20, 20);
    }
}
// если еда съедена, то увеличиваем наши баллы 
function snakeEat(x, y) {
    if (x == foodCoord.x && y == foodCoord.y ) {
        score = score + (1 * scoreFactor);
        scoreWrite()
        newFoodcoord()
    } else{
        solidSnake.pop()
    }
}

// функция для добавления голове новых координат
function snakeHead(x, y) {
    if (direction == 'up') {
        y = y - cell;
    } 
    if (direction == 'down'){
        y = y + cell
    }
    if (direction == 'left') {
        x = x - cell
    }
    if (direction == 'right') {
        x = x + cell
    }
    newHead = {
        x:x, 
        y:y,
    }
    solidSnake.unshift(newHead);
    return newHead
}
// функция для сброса начальных значений
function restartGame() {
    newFoodcoord();
    restartSnake();
    gameDifficulty = 'easy';
    direction = 'up';
    score = 0;
    scoreWrite();
    document.querySelector("#text-difficulty").textContent = 'Выберите сложность:'
}

// если коснешься рамки, умрешь
function borderCollision(x, y){
    if (x < cell || x > canvas.width) {
        stopGame()
    } else if( y < cell || y > canvas.height){
        stopGame()
    }
}

// функция для получения рандомного положения еды на поле
function getRandomNumber(min, max) {
    return (Math.random() * (max - min ) + min).toFixed(0)
}

//функция для получения новых координат для еды
function newFoodcoord() {
    foodCoord = {
        x: getRandomNumber(0, canvas.width/20) * 20,
        y: getRandomNumber(0, canvas.height/20) * 20,
    }
}

//если голова коснется тела, game over
function snakeEatItself(head, arr) {
    for (let i = 1; i < arr.length; i++) {
       if (head.x == arr[i].x && head.y == arr[i].y) {
            stopGame();
       }
    }
}

//запись результата 
function scoreWrite() {
    scoreHolder.textContent = score;
}
//после проигрыша переписываем начальное положение змейки
function restartSnake() {
    solidSnake =[];
    for (let i = 0; i < startCoordForSnake.length; i++) {
        solidSnake[i] = startCoordForSnake[i];
    }
}
//слушатель событий для получения выбора сложности игры
document.querySelector(".game-difficulty").addEventListener('click', function (event) {
    let tagName = event.target.tagName.toLowerCase()
    if (tagName === "button") {
       gameDifficulty = event.target.id.toLowerCase().toString();
    }
    document.querySelector("#text-difficulty").textContent = `Вы выбрали сложность: ${gameDifficulty}`;
})


//функция, которая устанавливает сложность игры и увеличивает множитель для счета
function gameSettings() {
    if (gameDifficulty == 'easy') {
        scoreFactor = 1;
        timeOut = 500;
    } else if (gameDifficulty == 'medium') {
        scoreFactor = 10;
        timeOut = 300;
    } else if(gameDifficulty == 'hard'){
        scoreFactor = 20;
        timeOut = 150;
    }
}