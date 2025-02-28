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
let currentFolder;
function makecard(title, subtitle) {
  let div1 = document.createElement("div");
  div1.classList = "box";
  div1.innerHTML = `  
  
  
  <img class="img1" src="https://ichef.bbci.co.uk/news/976/cpsprodpb/159D0/production/_129082588_gettyimages-1241855988.jpg" alt="No internet">
 
  <div class="grid todays ">
    <p style="font-size: 10px" >Today's top picks!</p>
    <p style="font-size: 8px">Here are some pickes for you!</p>
  </div>

`;
  document.querySelector(".add").append(div1);
}

let currentSong = new Audio();
let songs = []; // Array to store the list of songs
let currentIndex = 0; // Keep track of the current song index
function playCurrentSong() {
  // console.log(currentFolder)

  currentSong.src = `/${currentFolder}/${songs[currentIndex]}`;
  currentSong.play();
  document.querySelector(".songName").innerHTML = songs[
    currentIndex
  ].replaceAll("%20", " ");
  document.getElementById("play1").src = "pause.svg";
}
async function getSongs(folder) {
  let a = await fetch(`./${folder}/`);
  console.log(a)
  currentFolder = folder;
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let td = div.getElementsByTagName("a");

  songs = [];
  for (let index = 0; index < td.length; index++) {
    const element = td[index];
    if (element.href.endsWith(".mp3")) {
     
      songs.push(element.href.split(`/${folder}/`)[1]);
    }
  }


 

  displaySongs();
}

function displaySongs() {
  const taka = document.querySelector(".taka").getElementsByTagName("div")[0];
  taka.innerHTML = ``; // Clear the existing content

  songs.forEach((song, index) => {
    if (!song) {
      console.warn(`Skipping undefined song at index ${index}`);
      return;
    }
  
    let newAud = document.createElement("div");
    newAud.className = "myclass1";
    newAud.innerHTML = `<ol class="ola">
          <img class="invert" src="music.svg" alt="music">
          <div>
          <li>${song.replaceAll("%20", " ")}</li>`;  
    taka.appendChild(newAud);
  });
  
  // songs.forEach((song, index) => {
  //   let newAud = document.createElement("div");
  //   newAud.className = "myclass1";
  //   newAud.innerHTML = `<ol class="ola">
  //       <img class="invert" src="music.svg" alt="music">
  //       <div>
  //       <li>${song.replaceAll("%20", " ")}</li>`;
  //   taka.appendChild(newAud);

  //   newAud.addEventListener("click", () => {
  //     document.querySelector(".songName").innerHTML = song.replaceAll(
  //       "%20",
  //       " "
  //     );
  //     currentIndex = index;
  //     playCurrentSong();
  //   });
  // });
}

async function displayAlbums() {
  let a = await fetch(`/Songs/`);
 //let a = await fetch(`/${songs}/`);
 let response = await a.text();

 console.log(response)
  let div = document.createElement("div");
  div.innerHTML = response;
  let anchors = div.getElementsByTagName("a");
  let container1 = document.querySelector(".p");
let array=  Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
      const e = array[index];
      
    
    if (e.href.includes("/Songs")&& !e.href.includes(".htaccess")) {
      let folder1 = e.href.split("/").slice(-2)[0];
      console.log(folder1);
     // let a = await fetch(`http://127.0.0.1:3000/songs/${folder1}/info.json`);
     let a = await fetch(`/Songs/${folder1}/info.json`);


      let response = await a.json();
      console.log(response);
      container1.innerHTML =
        container1.innerHTML +
        `<div class="box   "<div data-folder="${folder1}">
     <img class="img1" src="/Songs/${folder1}/cover.jpg" alt="No internet">
    
     <div class="grid todays ">
       <p style="font-size: 10px" >${response.title}</p>
       <p style="font-size: 8px">${response.subtitle}</p>
     </div>
   </div>`;
  }};

   // console.log("Load playlist when card is clicked")
   Array.from(document.getElementsByClassName("box")).forEach((e) => {
    e.addEventListener("click", async (item) => {
   
      await getSongs(`Songs/${item.currentTarget.dataset.folder}`);
      playCurrentSong();
    });
  });
}

async function main() {
  await getSongs("./Songs/happySongs"); 
  //  playCurrentSong();

  

  displayAlbums();

  currentSong.addEventListener("timeupdate", () => {
    let p = getAudioTime(currentSong);
    document.querySelector(".duration").innerHTML = p.duration;
    document.querySelector(".runningTime").innerHTML = p.currentTime;
    document.querySelector(".circle").style.left = `${
      (currentSong.currentTime / currentSong.duration) * 100
    }%`;
  });

  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = `${percent}%`;
    currentSong.currentTime = (currentSong.duration * percent) / 100;
  });

 
  document.getElementById("play1").addEventListener("click", function () {
    if (currentSong.paused) {
      currentSong.play();
      document.getElementById("play1").src = "pause.svg";
    } else {
      document.getElementById("play1").src = "play.svg";
      currentSong.pause();
    }
  });

  
  document.getElementById("play0").addEventListener("click", function () {
    currentIndex = (currentIndex - 1 + songs.length) % songs.length;
    playCurrentSong();
  });


  document.getElementById("play2").addEventListener("click", function () {
    currentIndex = (currentIndex + 1) % songs.length;
    playCurrentSong();
  });

  
  let changer = () => {
    let m1 = Math.floor(Math.random() * 255 + 1);
    let m2 = Math.floor(Math.random() * 255 + 1);
    let m3 = Math.floor(Math.random() * 255 + 1);
    return `rgb(${m1},${m2},${m3})`;
  };

  //   Array.from(document.querySelectorAll('.box')).forEach(box=>{
  //     box.addEventListener('click', function () {
  //     // Generate a random index
  //     const randomIndex = Math.floor(Math.random() * songs.length);

  //     // Update the currentIndex and play the random song
  //     currentIndex = randomIndex;
  //     playCurrentSong();
  //   })
  // });

  async function bgchanger() {
    return new Promise((resolve, reject) => {
      setInterval(() => {
        document.querySelectorAll(
          ".changecolor"
        )[0].style.backgroundColor = `${changer()}`;
        document.querySelectorAll(
          ".changecolor"
        )[1].style.backgroundColor = `${changer()}`;
        resolve("I am resolved");
        let p = `${new Date()}`;
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
