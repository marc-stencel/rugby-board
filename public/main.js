const TEAM = document.querySelectorAll('.scoreboard__team');
const FLAG_DESCRIPTION = document.querySelectorAll('.scoreboard__description');
const SCOREBOARD_FLAG = document.querySelectorAll('.scoreboard__flag');

const RESULT_CONTENT = document.querySelectorAll('.result__content')
const RESULT_DESCRIPTION = document.querySelector('.result__description');

const FLAGS = document.querySelector('.flags');
const COUNTRIES = ['belgia', 'gruzja', 'hiszpania', 'holandia', 'niemcy', 'polska', 'portugalia', 'rumunia'];

const BTN_FORWARD = document.querySelector('.btn--forward');
const BTN_RESET = document.querySelector('.btn--reset');
const BTN_PLAY = document.querySelector('.btn--play');

// game icons
const TRY = 'fa-football';
const CONVERSION = 'fa-flag';
const PENALTY = 'fa-arrow-up';
const DROP_GOAL = 'fa-crosshairs';
const MISS = 'fa-xmark';

// icons to set
const ICONS = [TRY, CONVERSION, TRY, CONVERSION, PENALTY, PENALTY, PENALTY, DROP_GOAL, DROP_GOAL, DROP_GOAL];

// board = pitch with additions
const BOARD = document.querySelector('.board');
const PITCH = [...document.querySelectorAll('.board__element')];

// parts of the pitch
const AWAY_MAIN = document.querySelectorAll('.board__away-main');
const AWAY_INGOAL = document.querySelectorAll('.board__away-ingoal');
const HOME_MAIN = document.querySelectorAll('.board__home-main');
const HOME_INGOAL = document.querySelectorAll('.board__home-ingoal');

// ICONS[] index
let number = 0;

// game variables 
let round = 1;
let playerNumber = 0;
let points = [0, 0];
let isTry = false;

const teamSelectKey = (e) => (e.key === "Enter") && teamSelect(e);
FLAGS.addEventListener('click', teamSelect);
FLAGS.addEventListener('keydown', teamSelectKey);

BTN_FORWARD.addEventListener('click', confirmButton);
BTN_RESET.addEventListener('click', reset);

function teamSelect(e) {
  if (e.target.nodeName === "IMG") {
    const { country } = e.target.dataset;
    
    SCOREBOARD_FLAG[playerNumber].src = `img/flags/${COUNTRIES[country]}.png`;
    SCOREBOARD_FLAG[playerNumber].style.display = "block";
    FLAG_DESCRIPTION[playerNumber].textContent = COUNTRIES[country];

    inactiveBtn(BTN_FORWARD, false);
    
    if (SCOREBOARD_FLAG[1].src === SCOREBOARD_FLAG[0].src) FLAG_DESCRIPTION[1].textContent += ' II';
  };
};

// toggle btn disabled
const inactiveBtn = (btn, bool) => btn.disabled = bool;

function confirmButton() {
  // first team acceptance
  if (playerNumber === 0) {
    activeTeam();
    inactiveBtn(BTN_RESET, false);
    focusFlag();
    inactiveBtn(BTN_FORWARD, true);
  }

  // second team acceptance
  if (FLAG_DESCRIPTION[1].textContent) {
    BTN_FORWARD.removeEventListener('click', confirmButton);
    FLAGS.removeEventListener('click', teamSelect);
    FLAGS.removeEventListener('keydown', teamSelectKey);

    removeDisplay(FLAGS);
    removeDisplay(document.querySelector('.main__title--game'));

    RESULT_CONTENT.forEach(e => e.style.display = "block");

    document.querySelector('.scoreboard').classList.add('scoreboard--game');
    BOARD.classList.remove('board--inactive');
    
    activeTeam();
    showIcon(ICONS[number])

    removeDisplay(BTN_FORWARD);
    BTN_PLAY.style.display = "inline-block";

    reset();

    BTN_PLAY.addEventListener('click', startGame, {once: true});
    document.querySelector('.main--game').classList.add('main--game-landscape');

    addGameListeners(HOME_MAIN,'click', playerSetIcon,'keydown', setIconKey);
    addGameListeners(HOME_INGOAL,'click', playerSetConversion,'keydown', setConversionKey);

    PITCH.forEach(e => e.addEventListener('keydown', arrowsHandle));
  }
}

function addGameListeners(field, event1, func1, event2, func2) {
  field.forEach(e => {
    e.addEventListener(event1, func1);
    e.addEventListener(event2, func2);
  });
}

function removeGameListeners(field, event1, func1, event2, func2) {
  field.forEach(e => {
    e.removeEventListener(event1, func1);
    e.removeEventListener(event2, func2);
  });
}

function activeTeam() {
  TEAM.forEach(e => e.classList.toggle('scoreboard__team--active'));
  playerNumber === 0 ? playerNumber++ : playerNumber --;
}

// focus on the first flag during team selection
const focusFlag = () => document.querySelector('.flags__image').focus();

const removeDisplay = (element) => element.style.display = "none";

// show icon to set
const showIcon = (icon) => RESULT_DESCRIPTION.classList.add(icon);

// change icon to set
function changeIcon() {
  removeIcon();
  number < ICONS.length - 1 && showIcon(ICONS[number + 1])
  number++;
}

// remove icon example after set
const removeIcon = () => RESULT_DESCRIPTION.classList.remove(ICONS[number]);

// toggle possible elements on the pitch
const addActiveElements = (e) => e.classList.add('board__element--active');
const removeActiveElements = (e) => e.classList.remove('board__element--active');

function reset() {
  // during icons set
  if (!BOARD.classList.contains('board--inactive')) {
    inactiveBtn(BTN_PLAY, true);

    PITCH.forEach(e => e.classList.remove('select', 'select-invisible', TRY, PENALTY, DROP_GOAL, CONVERSION));

    HOME_MAIN.forEach(e => addActiveElements(e));
    HOME_INGOAL.forEach(e => removeActiveElements(e));

    isTry = false;
    removeIcon();
    number = 0;
    showIcon(ICONS[number]);
    
  // during team selection
  } else {
    FLAG_DESCRIPTION.forEach(e => e.textContent = "");
    SCOREBOARD_FLAG.forEach(e => {
      removeDisplay(e);
      e.src = "";
    });

    activeTeam();
    focusFlag();
    inactiveBtn(BTN_FORWARD, true);
  }

inactiveBtn(BTN_RESET, true);
}

// handle the pitch with a keyboard
const setIconKey = (e) => (e.key === "Enter") && playerSetIcon(e);
const setConversionKey = (e) => (e.key === "Enter") && playerSetConversion(e);
const playerMoveKey = (e) => (e.key === "Enter") && playerMove(e);
const playerConversionKey = (e) => (e.key === "Enter") && playerGameConversion(e);
function arrowsHandle(e) {
  let num = PITCH.indexOf(e.target);

  if (e.key === "ArrowRight") num++
  else if (e.key === "ArrowLeft") num--
  else if (e.key === "ArrowUp") num -= 5;
  else if (e.key === "ArrowDown") num += 5;
  
  num < 0 || num >= PITCH.length ? num : PITCH[num].focus();
}

function playerSetIcon(e) {
  const { classList } = e.target;

  if (playerNumber === 0 && !classList.contains('select') && !isTry && number < ICONS.length) {
    classList.add(ICONS[number], 'select');
    inactiveBtn(BTN_RESET, false);

    removeActiveElements(e.target);

    if (RESULT_DESCRIPTION.classList.contains(TRY)) {
      isTry = true;

      HOME_MAIN.forEach(e => removeActiveElements(e));
      checkRow(HOME_INGOAL, e);
    }

    computerSet();
    changeIcon();

    // check when icon set ends
    if (number === ICONS.length) {
      inactiveBtn(BTN_PLAY, false);
      HOME_MAIN.forEach(e => removeActiveElements(e));
      
      setTimeout(() => BTN_PLAY.focus(), 0);
    }
  }
}

// check conversion options
function checkRow(field, e) {
  const { row } = e.target.dataset;
  field.forEach(e => (e.dataset.row == row && !e.classList.contains('select')) && addActiveElements(e));
}

function playerSetConversion(e) {
  const { classList } = e.target;

  if ((isTry && classList.contains('board__element--active'))) {
    classList.add(ICONS[number], 'select');
    isTry = false;

    HOME_INGOAL.forEach(e => removeActiveElements(e));
    HOME_MAIN.forEach(e => (!e.classList.contains('select')) && addActiveElements(e));

    changeIcon();
  }
}

// draw a field element
function fieldDraw(field) {
  const drawNumber = Math.floor(Math.random() * field.length);
  const checkingArea = field[drawNumber].classList;
  
  return [drawNumber, checkingArea];
}

function computerSet() {
  const [ drawNumber, checkingArea ] = fieldDraw(AWAY_MAIN);
  
  // select-invisible = class contains computer move during icons set
  if (!checkingArea.contains('select-invisible')) {
    checkingArea.add(ICONS[number], 'select-invisible');

    const { row } = AWAY_MAIN[drawNumber].dataset;    
    
    if (RESULT_DESCRIPTION.classList.contains(TRY)) {

      computerConversion(AWAY_INGOAL, row);
      AWAY_INGOAL[convIndex].classList.add(CONVERSION, 'select-invisible');
    }
  } else computerSet();
}

function computerConversion(field, row) {
  const conv = [];
      
  field.forEach((e, i) => (e.dataset.row == row && !e.classList.contains('select-invisible')) && conv.push(i));

  const convNumber = Math.floor(Math.random() * conv.length);
  return convIndex = conv[convNumber];
}

function startGame() {
  BTN_RESET.removeEventListener('click', reset);
  
  removeDisplay(BTN_PLAY);
  removeDisplay(BTN_RESET);

  RESULT_DESCRIPTION.classList.remove('fa-solid');
  RESULT_DESCRIPTION.textContent = `runda ${round}`;
  
  PITCH.forEach(e => e.classList.remove('select', 'select-invisible'));
  
  HOME_MAIN.forEach(e => e.setAttribute("tabindex", "-1"));
  HOME_INGOAL.forEach(e => e.setAttribute("tabindex", "-1"));
  
  removeGameListeners(HOME_MAIN, 'click', playerSetIcon, 'keydown', setIconKey);
  removeGameListeners(HOME_INGOAL, 'click', playerSetConversion, 'keydown', setConversionKey);

  AWAY_MAIN.forEach(e => addActiveElements(e));

  addGameListeners(AWAY_MAIN,'click', playerMove,'keydown', playerMoveKey);
  addGameListeners(AWAY_INGOAL,'click', playerGameConversion,'keydown', playerConversionKey);
}

// player move during the game
function playerMove(e) {
  const { classList } = e.target;

  if (playerNumber === 0 && !classList.contains('select') && !isTry) {
    classList.add('select');

    checkScore(classList, e);

    AWAY_MAIN.forEach(e => removeActiveElements(e));

    if (isTry === false && playerNumber === 0) {
      activeTeam();
      setTimeout(computerMove, 1500);
    }
  }
}

// check potential points
function checkScore(area, e) {
  if (area.contains(TRY)) {
    tryScore();

    if (playerNumber == 0) checkRow(AWAY_INGOAL, e);

  } else if (area.contains(PENALTY) || area.contains(DROP_GOAL)) points[playerNumber] += 3;
  else area.add(MISS);

  addPoints(playerNumber);
}

// enable conversion
function tryScore() {
  points[playerNumber] += 5;
  isTry = true;
}

const addPoints = (playerNumber) => RESULT_CONTENT[playerNumber].textContent = points[playerNumber];

function playerGameConversion(e) {
  const { classList } = e.target;
  if (playerNumber === 0 && classList.contains('board__element--active')) {

    checkConversion(classList);
    classList.add('select');
    AWAY_INGOAL.forEach(e => removeActiveElements(e));

    isTry = false;

    activeTeam();
    setTimeout(computerMove, 1500);
  }
}

// check conversion accuracy
function checkConversion(area) {
  if (area.contains(CONVERSION)) {
    points[playerNumber] += 2; 
    addPoints(playerNumber);
  } else area.add(MISS);
}

// computer move during the game
function computerMove() {
  const [ drawNumber, checkingArea ] = fieldDraw(HOME_MAIN);
  
  if (!checkingArea.contains('select')) {
    checkingArea.add('select', 'hit');
    
    checkScore(checkingArea);
    
    // check the possibility of conversion
    if (isTry) {
      
        const { row } = HOME_MAIN[drawNumber].dataset;
        
        computerConversion(HOME_INGOAL, row);
        const { classList } = HOME_INGOAL[convIndex];
        
        checkConversion(classList);
        
        classList.add('select', 'hit');
        isTry = false;
    }

    setTimeout(() => {
      AWAY_MAIN.forEach(e => (!e.classList.contains('select')) && addActiveElements(e));
      
      if (round === 12) return gameOver();  
  
      round++;
      RESULT_DESCRIPTION.textContent = `runda ${round}`;
      activeTeam();
    }, 1000);
    
  } else computerMove();
}

function gameOver() {
  TEAM[1].classList.toggle('scoreboard__team--active');

  if (points[0] > points[1]) RESULT_DESCRIPTION.textContent = 'WYGRANA';
  else if (points[0] < points[1]) RESULT_DESCRIPTION.textContent = 'PRZEGRANA';
  else RESULT_DESCRIPTION.textContent = 'REMIS';
  
  AWAY_MAIN.forEach(e => removeActiveElements(e));

  document.querySelector('.fa-trophy').classList.add('menu__icon--play');
}