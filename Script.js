
function w3_open() {
  document.getElementById("mySidebar").style.width = "2660";
  document.getElementById("mySidebar").style.display = "block";
}

function closeit() {
  document.getElementById("mySidebar").style.display = "none";
  document.getElementById("mySidebar").style.width = "0";
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;
  return `${formattedMinutes}:${formattedSeconds}`;
}

function getAudioTime(audioElement) {
  const currentTime = audioElement.currentTime;
  const duration = audioElement.duration;
  const formattedCurrentTime = formatTime(currentTime);
  const formattedDuration = formatTime(duration);

  return {
    currentTime: formattedCurrentTime,
    duration: formattedDuration,
  };
}

let currentSong = new Audio();
let songs = []; // Array to store the list of songs
let currentIndex = 0; // Keep track of the current song index

async function getSongs() {
  let a = await fetch("/Songs/");
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let td = div.getElementsByTagName("a");

  songs = [];
  for (let index = 0; index < td.length; index++) {
    const element = td[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split("/Songs/")[1]);
    }
  }

  // Display the songs in the UI
  displaySongs();
}

function displaySongs() {
  const taka = document.querySelector(".taka");
  taka.innerHTML = ""; // Clear the existing content

  songs.forEach((song, index) => {
    let newAud = document.createElement("div");
    newAud.className = "myclass1";
    newAud.innerHTML = `<ol class="ola">
        <img class="invert" src="music.svg" alt="music">
        <div>
        <li>${song.replaceAll("%20", " ")}</li>
        <li>Chaitu</li>`;
    taka.appendChild(newAud);

    newAud.addEventListener("click", () => {
      document.querySelector(".songName").innerHTML = song.replaceAll("%20", " ");
      currentIndex = index;
      playCurrentSong();
    });
  });
}

function playCurrentSong() {
  currentSong.src = `/Songs/${songs[currentIndex]}`;
  currentSong.play();
  document.querySelector(".songName").innerHTML = songs[currentIndex].replaceAll("%20", " ");
  document.getElementById("play1").src = "pause.svg";
}

async function main() {
  await getSongs(); // Fetch and display songs

  currentSong.addEventListener("timeupdate", () => {
    let p = getAudioTime(currentSong);
    document.querySelector(".duration").innerHTML = p.duration;
    document.querySelector(".runningTime").innerHTML = p.currentTime;
    document.querySelector(".circle").style.left = `${currentSong.currentTime / currentSong.duration * 100}%`;
  });

  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = e.offsetX / e.target.getBoundingClientRect().width * 100;
    document.querySelector(".circle").style.left = `${percent}%`;
    currentSong.currentTime = (currentSong.duration) * percent / 100;
  });

  // Handle "play/pause" button click
  document.getElementById("play1").addEventListener("click", function () {
    if (currentSong.paused) {
      currentSong.play();
      document.getElementById("play1").src = "pause.svg";
    } else {
      document.getElementById("play1").src = "play.svg";
      currentSong.pause();
    }
  });

  // Handle "prev" button click
  document.getElementById("play0").addEventListener("click", function () {
    currentIndex = (currentIndex - 1 + songs.length) % songs.length;
    playCurrentSong();
  });

  // Handle "next" button click
  document.getElementById("play2").addEventListener("click", function () {
    currentIndex = (currentIndex + 1) % songs.length;
    playCurrentSong();
  });

  // Background changer (interval function)
  let changer = () => {
    let m1 = Math.floor(Math.random() * 255 + 1);
    let m2 = Math.floor(Math.random() * 255 + 1);
    let m3 = Math.floor(Math.random() * 255 + 1);
    return `rgb(${m1},${m2},${m3})`;
  };

  Array.from(document.querySelectorAll('.box')).forEach(box=>{
    box.addEventListener('click', function () {
    // Generate a random index
    const randomIndex = Math.floor(Math.random() * songs.length);
  
    // Update the currentIndex and play the random song
    currentIndex = randomIndex;
    playCurrentSong();
  })
});

  async function bgchanger() {
    return new Promise((resolve, reject) => {
      setInterval(() => {
        document.querySelectorAll(".changecolor")[0].style.backgroundColor = `${changer()}`;
        document.querySelectorAll(".changecolor")[1].style.backgroundColor = `${changer()}`;
        resolve("I am resolved");
        let p = `${new Date}`;
        let q = p.slice(22, 25);
        if (q == "59") {
          reject("It's 59!");
        }
      }, 1000);
    });
  }

  bgchanger();
}

main();
