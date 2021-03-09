'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputHeight = document.querySelector('.form__input--feet');
const inputTime = document.querySelector('.form__input--hours');
const inputWeight = document.querySelector('.form__input--weight');

let music = document.querySelector('.music');
let modalMusic = document.querySelector('.modalMusic');
let overlayMusic = document.querySelector('.overlayMusic');
let inputMusic = document.querySelector('.form__input--music');
let play = document.querySelector('.play');
let pause = document.querySelector('.pause');

let mapClass = document.querySelector('.mapClass');

let labelTimer = document.querySelector('.timer');
let timerIcon = document.querySelector('.timerIcon');
let modalTimer = document.querySelector('.modalTimer');
let overlayTimer = document.querySelector('.overlayTimer');
let start = document.querySelector('.start');
let pauseTimer = document.querySelector('.pauseTimer');
let stop = document.querySelector('.stop');

let map,
  mapEvent,
  counter = 1,
  distance;

//CALC DISTANCE
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1); // deg2rad below
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  d = Math.round(d * 10) / 10;
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

navigator.geolocation.getCurrentPosition(
  function(pos) {
    let { latitude } = pos.coords;
    let { longitude } = pos.coords;
    //console.log(latitude, longitude);
    //console.log(`https://www.google.com/maps/@${latitude},${longitude},15z`);
    let coord = [latitude, longitude];
    map = L.map('map').setView(coord, 13); //'map' comes from  id=map in HTML

    //MARKER TO CURRENT LOCN
    L.marker([latitude, longitude])
      .addTo(map)
      .bindPopup(
        L.popup({
          //POPUP
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: 'running-popup'
        })
      )
      .setPopupContent('Current Location')
      .openPopup();

    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    //ON CLICKMAP
    map.on('click', function(el) {
      mapEvent = el;

      let { lat, lng } = mapEvent.latlng;

      //DESIGNING LOCATION ICON
      let myIcon = L.icon({
        iconUrl: 'location-pin-connectsafely-37.png',
        iconSize: [45, 50],
        iconAnchor: null,
        popupAnchor: [0, -20],
        autoClose: true
      });

      L.marker([lat, lng], { icon: myIcon })
        .addTo(map)
        .bindPopup(
          L.popup({
            maxWidth: 250,
            minWidth: 100,
            autoClose: false,
            closeOnClick: false,
            className: 'cycling-popup'
          })
        )
        .setPopupContent(`Cardio Session ${counter}`)
        .openPopup();
      form.classList.remove('hidden');
      inputWeight.focus();
      distance = getDistanceFromLatLonInKm(latitude, longitude, lat, lng);
      counter++;
    });
  },
  function() {
    alert('LOCATION PERMISSION DENIED!');
  }
);
function calories(h, w, s) {
  s = (5 / 18) * s;
  h = h * 0.3048;
  let ans = 0.035 * w + ((s ^ 2) / h) * 0.029 * w;
  return ans;
}
form.addEventListener('submit', function(el) {
  el.preventDefault();
  let inputHeightVal = Number(inputHeight.value);
  let inputWeightVal = Number(inputWeight.value);
  let inputTimeVal = Number(inputTime.value);
  // console.log(
  //   inputHeightVal,
  //   inputTimeVal,
  //   inputWeightVal,
  //   counter - 1,
  //   distance
  // );
  let steps = Math.round(distance * 1250);
  let speed = distance / inputTimeVal;
  let cal = calories(inputHeightVal, inputWeightVal, speed);
  cal = Math.round(cal * 10) / 10;
  let html = ` <li class="workout workout--running" data-id="1234567890">
  <h2 class="workout__title">Cardio Session ${counter - 1}</h2>
  <div class="workout__details">
    <span class="workout__icon">🏃‍♂️</span>
    <span class="workout__value">${distance}</span>
    <span class="workout__unit">km</span>
  </div>


  <div class="workout__details">
    <span class="workout__icon">&nbsp🦶🏼</span>
    <span class="workout__value">${steps}</span>
    <span class="workout__unit">Steps</span>
  </div>
  <div class="workout__details">
  <span class="workout__icon">&nbsp&nbsp🔥</span>
  <span class="workout__value">${cal}</span>
  <span class="workout__unit">&nbspCalories&nbspPer&nbspMinute</span>
</div>
</li>`;
  inputHeight.value = inputTime.value = inputWeight.value = '';
  form.insertAdjacentHTML('afterend', html);

  form.classList.add('hidden');
  audio = new Audio('audioSound.wav');
  audio.play();
});
function removeHiddenMusic() {
  modalMusic.classList.remove('hiddenMusic');
  overlayMusic.classList.remove('hiddenMusic');
}
function addHiddenMusic() {
  modalMusic.classList.add('hiddenMusic');
  overlayMusic.classList.add('hiddenMusic');
}
function removeHiddenTimer() {
  modalTimer.classList.remove('hiddenTimer');
  overlayTimer.classList.remove('hiddenTimer');
}
function addHiddenTimer() {
  modalTimer.classList.add('hiddenTimer');
  overlayTimer.classList.add('hiddenTimer');
}
let timer,
  alter = 0,
  time;
function setTimer() {
  // SET TIMER FOR WORKOUT
  if (alter === 0) time = 0;
  let rick = function() {
    let min = String(Math.trunc(time / 60)).padStart(2, 0);
    let sec = String(time % 60).padStart(2, 0);
    labelTimer.textContent = `${min} : ${sec}`;

    time++;
  };
  rick(); //FOR IMMIDIATE CALL

  let timer = setInterval(rick, 1000);
  return timer;
}

timerIcon.addEventListener('click', function(el) {
  el.preventDefault();

  removeHiddenTimer();
  mapClass.classList.add('hiddenMap');
});

start.addEventListener('click', function() {
  timer = setTimer();
  alter = 0;
});

pauseTimer.addEventListener('click', function() {
  clearInterval(timer);
  alter = 1;
});

stop.addEventListener('click', function() {
  clearInterval(timer);
  alter = 0;
  labelTimer.textContent = `00 : 00`;
});

music.addEventListener('click', function(el) {
  el.preventDefault();
  removeHiddenMusic();
  mapClass.classList.add('hiddenMap');
});
let audio,
  flag = 0;
function addSound(audioPara) {
  audio = new Audio(audioPara);
  if (flag === 0) audio.play();
  flag = 1;
}

play.addEventListener('click', function(el) {
  el.preventDefault();
  let inputMusicVal = inputMusic.value;
  addSound(`music-${inputMusicVal}.mp3`);
});
pause.addEventListener('click', function(el) {
  el.preventDefault();
  audio.pause();
  inputMusic.value = '';
  flag = 0;
});
overlayMusic.addEventListener('click', function() {
  addHiddenMusic();
  mapClass.classList.remove('hiddenMap');
});
overlayTimer.addEventListener('click', function() {
  addHiddenTimer();
  mapClass.classList.remove('hiddenMap');
  clearInterval(timer);
});
