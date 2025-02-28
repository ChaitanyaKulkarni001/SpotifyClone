
function w3_open() {
  document.getElementById("mySidebar").style.width = "2660";
  document.getElementById("mySidebar").style.display = "block";
}

function closeit() {
  document.getElementById("mySidebar").style.display = "none";
  document.getElementById("mySidebar").style.width = "0";
}

// ============================================================
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const formattedSeconds =
    remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;
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
function playMusic(track) {
  currentSong.src = `/Songs/${track}`;
  currentSong.play();
  play1.src = "pause.svg";
}
async function main() {
  async function getSongs() {
    let a = await fetch("/Songs/");
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let td = div.getElementsByTagName("a");

    let songs = [];
    for (let index = 0; index < td.length; index++) {
      const element = td[index];

      if (element.href.endsWith(".mp3")) {
        songs.push(element.href.split("/Songs/")[1]);
      }
    }
    for (const song of songs) {
      let newAud = document.createElement("div");
      newAud.className = "myclass1";
      newAud.innerHTML = `<ol class="ola">
          <img class="invert" src="music.svg" alt="music">
          <div>
          
          <li> ${song.replaceAll("%20", " ")}</li>
          <li>Chaitu</li>`;
      document.querySelector(".taka").append(newAud);

      currentSong.addEventListener("timeupdate", () => {
        let p = getAudioTime(currentSong);
        // console.log(p.currentTime);
        // console.log(p.duration);
        
          document.querySelector(".duration").innerHTML = p.duration;
          document.querySelector(".runningTime").innerHTML = p.currentTime;
            // console.log()
          
            document.querySelector(".circle").style.left=`${currentSong.currentTime/currentSong.duration*100}%`;

    });

    document.querySelector(".seekbar").addEventListener("click", (e) => {
      let percent=e.offsetX / e.target.getBoundingClientRect().width * 100;
      document.querySelector(".circle").style.left = `${percent}%`;
      currentSong.currentTime=(currentSong.duration)*percent/100;
  });
  
      newAud.addEventListener("click", () => {
        document.querySelector(".songName").innerHTML = song.replaceAll(
          "%20",
          " "
        );
        playMusic(song);
        
      });
    }

    return songs;
  }








  
  let res = await getSongs();
  console.log(res);

  document.getElementById("play1").addEventListener("click", function () {
    if (currentSong.paused) {
      console.log("played");
      currentSong.play();
      document.getElementById("play1").src = "play.svg";

      play1.src = "play.svg";
    } else {
      console.log("paused");
      document.getElementById("play1").src = "pause.svg";
      currentSong.pause();
    }
  });


  let songs = await getSongs();
  let currentIndex = 0; // Keep track of the current song index

  // Function to play the current song
  function playCurrentSong() {
    currentSong.src = `/Songs/${songs[currentIndex]}`;
    currentSong.play();
    document.querySelector(".songName").innerHTML = songs[currentIndex].replaceAll("%20", " ");
    document.getElementById("play1").src = "pause.svg";
  }

  // Handle "prev" button click
  document.getElementById("play0").addEventListener("click", function () {
    currentIndex = (currentIndex - 1 + songs.length) % songs.length; // Move to the previous song
    playCurrentSong();
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

  // Handle "next" button click
  document.getElementById("play2").addEventListener("click", function () {
    currentIndex = (currentIndex + 1) % songs.length; // Move to the next song
    playCurrentSong();
  });



  let changer=()=>{
    let m1=Math.floor(Math.random()*255+1);
    let m2=Math.floor(Math.random()*255+1);
    let m3=Math.floor(Math.random()*255+1);
    return `rgb(${m1},${m2},${m3})`
}        

async function bgchanger(){
    return new Promise((resolve,reject)=>{
         setInterval(() => {
    document.querySelectorAll(".changecolor")[0].style.backgroundColor=`${changer()}`;
    document.querySelectorAll(".changecolor")[1].style.backgroundColor=`${changer()}`;
    resolve("I am resolved")
    let p=`${new Date}`;
    let q=p.slice(22,25)
   // console.log(q);
    if(q=="59"){
        reject("Its 59!");
    }
    
}, 1000);
    })  }
    bgchanger();
}
main();