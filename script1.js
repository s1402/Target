'use strict';
let inputData = document.querySelector('.input-data');
let plusIcon = document.querySelector('.plus-icon');
let elements = document.querySelector('.elements');
let deleteIcon = document.querySelector('.delete-icon');
let pushText = document.querySelector('.push-input');
let pushMin = document.querySelector('.form__input--min');
let pushSec = document.querySelector('.form__input--sec');
let pushBtn = document.querySelector('.form__btn--push');

let notificationText = document.querySelector('h1');

let modal = document.querySelector('.modal');
let modalWorkout = document.querySelector('.modalWorkout');

const labelTimer = document.querySelector('.timer');

let closeModal = document.querySelector('.close-modal');

let overlay = document.querySelector('.overlay');
let overlayWorkout = document.querySelector('.overlayWorkout');

let tick = document.querySelector('.tick');
let cross = document.querySelector('.cross');

// button.addEventListener("click", function(el) {
//   el.preventDefault();

// });
let current = [];
let timer;

//SESSION TIMEOUT:

function setTimer() {
  // SET TIMER OF 5 MIN

  let time = 10 * 60;
  let rick = function() {
    let min = String(Math.trunc(time / 60)).padStart(2, 0);
    let sec = String(time % 60).padStart(2, 0);
    labelTimer.textContent = `${min} : ${sec}`;

    //IF TIME=0 SEC LOGOUT
    if (time === 0) {
      // HIDE UI
      clearInterval(timer);
      addHidden();
      current.splice(0); //CURRENT ARRAY ->EMPTY
      current.push('TASKS');
      displayElements(current);
      inputData.value = ' ';
      pushText.value = ' ';
      pushMin.value = ' ';
      pushSec.value = ' ';
    }
    time--;
  };
  rick(); //FOR IMMIDIATE CALL

  let timer = setInterval(rick, 1000);
  return timer;
}
timer = setTimer();

//DISPLAY ELEMENTS
function displayElements(l) {
  elements.innerHTML = '';
  l.forEach(function(el, i) {
    let html = ` 
    <div class="elements-row">
      <div class="element-content">${el}</div>
    </div>
  
  `;

    elements.insertAdjacentHTML('beforeend', html);
  });
}
function deleteElement(l, x) {
  if (l.includes(x)) {
    let i = l.findIndex(function(el) {
      return el == x;
    });

    l.splice(i, 1);
    if (l.length == 0) l.push('TASKS');
    displayElements(l);
  } else {
    //console.log('Wrong Input');
  }
}

//PUSH NOTIFICATION BTN
function removeHidden() {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
}
function addHidden() {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
}
function removeHiddenWorkout() {
  modalWorkout.classList.remove('hiddenWorkout');
  overlayWorkout.classList.remove('hiddenWorkout');
}
function addHiddenWorkout() {
  modalWorkout.classList.add('hiddenWorkout');
  overlayWorkout.classList.add('hiddenWorkout');
}

function addSound(audioPara) {
  let audio = new Audio(audioPara);
  audio.play();
}
function calcTime(x, y) {
  //CONVERT MILLISECONDS
  //console.log(x, y);
  return (x * 60 + y) * 1000;
}

//+PLUS ICON
plusIcon.addEventListener('click', function(el) {
  el.preventDefault();

  let inputDataVal = inputData.value;
  inputDataVal = inputDataVal
    .toUpperCase()
    .split(' ')
    .join(''); //REMOVE WHITESPACES

  inputData.value = ' ';

  if (current.includes('TASKS')) current.splice(0, 1);

  if (!current.includes(inputDataVal)) current.push(inputDataVal);
  displayElements(current);

  //WORKOUT MODE
  if (inputDataVal === 'WORKOUT') {
    addSound('zapsplat_sport_dumbbell_collar_spin_tighten_004_61902.mp3');
    removeHiddenWorkout();
  }

  //TIMER
  if (timer) clearInterval(timer);
  timer = setTimer();
});

//DELETE ICON
deleteIcon.addEventListener('click', function(el) {
  el.preventDefault();
  let inputDataVal = inputData.value;
  inputDataVal = inputDataVal
    .toUpperCase()
    .split(' ')
    .join(''); //REMOVE WHITESPACES
  inputData.value = ' ';
  deleteElement(current, inputDataVal);

  if (timer) clearInterval(timer);
  timer = setTimer();
});

//NOTIFICATION ICON
pushBtn.addEventListener('click', function(el) {
  el.preventDefault();
  let inputText = pushText.value;
  let inputMin = Number(pushMin.value);
  let inputSec = Number(pushSec.value);
  inputText = inputText
    .toUpperCase()
    .split(' ')
    .join(''); //REMOVE WHITESPACES

  if (current.includes(inputText)) {
    setTimeout(function() {
      addSound('redmi-note-8-pro-notification.mp3');

      notificationText.textContent = `Perform the Task:    ${inputText}`;
      removeHidden();

      //console.log(inputText, inputMin + inputSec);
    }, calcTime(inputMin, inputSec));
  }
  pushText.value = ' ';
  pushMin.value = ' ';
  pushSec.value = ' ';

  if (timer) clearInterval(timer);
  timer = setTimer();
});

document.addEventListener('keydown', function(r) {
  //console.log(`${r.key} key pressed!`);
  if (r.key === 'Escape') {
    addHidden();
    addHiddenWorkout();
  }

  if (timer) clearInterval(timer);
  timer = setTimer();
});

closeModal.addEventListener('click', function() {
  addHidden();

  if (timer) clearInterval(timer);
  timer = setTimer();
});

overlay.addEventListener('click', function() {
  addHidden();

  if (timer) clearInterval(timer);
  timer = setTimer();
});

overlayWorkout.addEventListener('click', function() {
  addHiddenWorkout();

  if (timer) clearInterval(timer);
  timer = setTimer();
});

cross.addEventListener('click', function() {
  addHiddenWorkout();

  if (timer) clearInterval(timer);
  timer = setTimer();
});

tick.addEventListener('click', function() {
  window.location = 'derived.html';
});
