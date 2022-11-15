document.getElementById("Song").addEventListener("click", getData);
const input = document.querySelector("input");
input.addEventListener("keypress", playSongs);
var listContainer = document.getElementById("list-container");
var myModal = document.getElementById("myModal");
const h1 = document.getElementById("playlist_head");
const progress = document.getElementById("progress");
const currentTimeStatic = document.getElementById("current-time");
const durationStatic = document.getElementById("duration");
const progress_div = document.getElementById("progress-div");
var regex = new RegExp("^[a-zA-Z0-9 ]*$");
document.getElementById("modalBtn").addEventListener("click", function () {
  myModal.style.display = "none";
  audio.pause();
});
  
var audio;
var modalImg = document.getElementById("modal-img");
var audioSrc = document.getElementById("audio-src");
var songTitle = document.getElementById("song-title");
const play = document.getElementById("play");
const next = document.getElementById("next");
const menu_icon = document.getElementById("menu-icon");
const sidebar = document.getElementById("sidebar");

menu_icon.addEventListener("click", () => {
  sidebar.classList.toggle("small_sidebar");
});

let isPlaying = false;
const playMusic = () => {
  audio.play();
  isPlaying = true;
  play.classList.replace("fa-play", "fa-pause");
};
const pauseMusic = () => {
  isPlaying = false;
  audio.pause();
  play.classList.replace("fa-pause", "fa-play");
};
play.addEventListener("click", () => {
  isPlaying ? pauseMusic() : playMusic();
});
function myFunc(song, image, title) {
  myModal.style.display = "flex";
  audio = new Audio(song);
  audio.addEventListener("timeupdate", (e) => {
    const { currentTime, duration } = e.path[0];
    let progress_time = (currentTime / duration) * 100;
    progress.style.width = `${progress_time}%`;
    if (progress.style.width === "100%") {
      console.log(play.classList);
      play.classList.replace("fa-pause", "fa-play");
    }
    //duration
    let min_duration = Math.floor(duration / 60);
    let sec_duration = Math.floor(duration % 60);
    let total_duration = `${min_duration}:${sec_duration}`;
    if (duration) {
      durationStatic.innerHTML = total_duration;
    }
    //current Time
    let min_currentTime = Math.floor(currentTime / 60);
    let sec_currentTime = Math.floor(currentTime % 60);
    if (sec_currentTime < 10) {
      sec_currentTime = `0${sec_currentTime}`;
    }
    let total_currentTime = `${min_currentTime}:${sec_currentTime}`;

    currentTimeStatic.innerHTML = total_currentTime;
  });
  progress_div.addEventListener("click", (e) => {
    let duration = audio.duration;
    let move_progress = (e.offsetX / e.srcElement.clientWidth) * duration;
    audio.currentTime = move_progress;
  });
  console.log("audio ", audio.src);
  modalImg.src = image;
  // audioSrc.src = audio.src;
  songTitle.innerHTML = title;

  audio.pause();
  console.log(modalImg.src);
}
const CLIENT_ID = "94d397db951549bbae0e8996e31aafc3";
const CLIENT_SECRET = "58037c60e9cd4e30b35cbd0eb09d49e9";
var token;
function fetchApi() {
  console.log("asd");
  fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    body: "grant_type=client_credentials",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Basic " + btoa(CLIENT_ID + ":" + CLIENT_SECRET),
    },
  }).then((response) => {
    response.json().then((data) => {
      console.log("data", data);
      token = data.access_token;
      localStorage.setItem("token", token);
      console.log("data.access_token", token);
    });
  });
}
fetchApi();
var query;
async function playSongs(e) {
  if (e.key === "Enter") {
    query = e.target.value;
    await getData();
  }

  query = e.target.value;
}
var track1;
async function getData() {
  if (query) {
    listContainer.innerHTML = "";

    let setAbc = await getTrackData(query);
    let url = setAbc.tracks.items[0].preview_url;

    console.log("asdsf", listContainer.innerHTML);
    h1.innerHTML = "Spotify Playlist";
    setAbc.tracks.items.map((element, index) => {
      listContainer.innerHTML += `<div class="vid-list" ;>
      <a href="#myModal" id="openModal" onclick="myFunc('${element.preview_url}' , '${element.album.images[0].url}' , '${element.album.name}')" ><img src=${element.album.images[0].url} alt="" class="thumbnails" id="myImg"/></a>
      <div class="video-info">
        <p id="song-title">${element.album.name}</p> 
        
      </div>
    </div>`;
      console.log("element[index]", element);
    });

    var openModal = document.getElementById("openModal");
    console.log(openModal);
    openModal.addEventListener("click", () => {
      myModal.style.display = "flex";
    });
    input.value = "";
  } else {
    alert("Please enter some value");
  }
}

var abc;
var getData;
async function getTrackData(query) {
  var getToken = localStorage.getItem("token");

  console.log("tokensad", token);

  let response = await fetch(
    `https://api.spotify.com/v1/search?q=${query}&type=track`,
    {
      method: "GET",
      headers: { Authorization: "Bearer " + getToken },
    }
  );
  getData = await response.json();
  console.log(getData);
  if (getData) {
    abc = getData.tracks.items[0].preview_url;
  } else {
    console.log("sorry");
  }
  return getData;
}

