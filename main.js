const prevButton = document.getElementById("prev")

const nextButton = document.getElementById("next")
const repeatButton = document.getElementById("repeat")
const shuffleButton = document.getElementById("shuffle")
const audio = document.getElementById("audio")
const songImage = document.getElementById("song-image")
const songName = document.getElementById("song-name")
const songArtist = document.getElementById("song-artist")
const pauseButton = document.getElementById("pause")
const playButton = document.getElementById("play")
const playListButton = document.getElementById("playlist")

const maxDuration = document.getElementById("max-duration")
const currentTimeRef = document.getElementById("current-time")

const progressBar = document.getElementById("progress-bar")
const playListContainer = document.getElementById("playlist-container")
const closeButton = document.getElementById("close-button")
const playListSongs = document.getElementById("playlist-songs")

const currentProgress = document.getElementById("current-progress")

//index sarkı için

let index

//dongu
let loop = true



//karıştırıcı açık mı ?
let isShuffleActive = false

//sarkı listesi
const songsList = [
  {
    name: "Gelo Ew Ki Bu",
    link: "assets/gelo-ew-ki-bu.mp3",
    artist: "Aram Tigran",
    image: "aram-tigran.jpeg",
  },
  {
    name: "Gitme Kal",
    link: "assets/yara-bere-icindeyim.mp3",
    artist: "Hira-i Zerdust",
    image: "hirai.jpeg",
  },
  {
    name: "Aramam",
    link: "assets/aramam.mp3",
    artist: "Ibrahim Tatlises",
    image: "ibrahim-tatlises.jpeg",
  },
  {
    name: "Ax Eman",
    link: "assets/ax-eman.mp3",
    artist: "Rewsan Çeliker",
    image: "rewsan-celiker.jpeg",
  },
  {
    name: "Dinle",
    link: "assets/dinle.mp3",
    artist: "Mahsun Kırmızıgül",
    image: "mahsun.jpeg",
  },
]

//zaman formati ayarlama
const timeFormatter = (timeInput) => {
  let minute = Math.floor(timeInput / 60)
  minute = minute < 10 ? "0" + minute : minute
  let second = Math.floor(timeInput % 60)
  second = second < 10 ? "0" + second : second
  return `${minute}:${second}`
}

//şarkıyı çalma
const playAudio = () => {
  console.log("playAudio")
  audio.play()
  pauseButton.classList.remove("hide")
  playButton.classList.add("hide")
}

//sarkı atama
const setSong = (arrayIndex) => {
  if (loop == false && isShuffleActive == true) {
    arrayIndex = Math.floor(Math.rondom()*100)%5
  }
  console.log(arrayIndex + isShuffleActive)


  let { name, link, artist, image } = songsList[arrayIndex]
  audio.src = link
  songName.innerHTML = name
  songArtist.innerHTML = artist
  songImage.src = image

  audio.onloadedmetadata = () => {
    maxDuration.innerText = timeFormatter(audio.duration)
  };

  playListContainer.classList.add("hide")
  playAudio()
}

//sıradakini çal
const nextSong = () => {
  if (loop) {
    if (index == songsList.length - 1) {
      index = 0
    } else {
      index += 1
    }

    setSong(index)
  } else {
    let randIndex = Math.floor(Math.random() * songsList.length)
    setSong(randIndex)
  }
}

playListButton.addEventListener('click', ()=>{
    playListContainer.classList.remove('hide')
})

closeButton.addEventListener('click',()=>{
    playListContainer.classList.add('hide')
})




const pauseAudio = () => {
  audio.pause()
  pauseButton.classList.add("hide")
  playButton.classList.remove("hide")
}

setInterval(() => {
    currentTimeRef.innerHTML = timeFormatter(audio.currentTime)
    currentProgress.style.width = (audio.currentTime / audio.duration.toFixed(3)) * 100 + "%"
}, 1000);

progressBar.addEventListener("click",(event)=>{
   let coordStart = progressBar.getBoundingClientRect().left

   let coordEnd = event.clientX
   let progress = (coordEnd-coordStart) / progressBar.offsetWidth

    currentProgress.style.widow = progressBar * 100 + "%"

    audio.currentTime = progress * audio.duration
    audio.play()
    pauseButton.classList.remove('hide')
    playButton.classList.add('hide')
})

const previousSong = () => {
  console.log(index)
  if (index > 0) {
    index -= 1
  } else {
    index = songsList.length - 1
  }
  setSong(index)
}

repeatButton.addEventListener("click", () => {
  if (repeatButton.classList.contains("active")) {
    repeatButton.classList.remove("active")
    audio.loop = false
    console.log("tekrar kapatıldı")
  } else {
    repeatButton.classList.add("active")
    audio.loop = true
    console.log("tekrar açıldı")
  }
})

shuffleButton.addEventListener("click", () => {
  if (shuffleButton.classList.contains("active")) {
    isShuffleActive = false
    shuffleButton.classList.remove("active")
    audio.loop = true
    console.log("karıştırıcı kapatıldı")
  } else {
    shuffleButton.classList.add("active")
    audio.loop = false
    console.log("karıştırıcı açıldı")
  }
});

const initializePlaylist = () => {
  for (let i in songsList) {
    playListSongs.innerHTML += `<i class="playlistSong" 
      onlick="setSong(${i})"
      <div class="playlist-image-container">
            <img src="${songsList[i].image}"
         </div>
         <div class="playlist-song-details">
         <span id="playlist-song-name">
         ${songsList[i].name}
         </span>
         <span id="playlsit-song-artist-album">
         ${songsList[i].artist}
         </span>
         </div>
        </li>`
  }
}

//Tıklama Yakalama
nextButton.addEventListener("click", nextSong);
pauseButton.addEventListener("click", pauseAudio);
playButton.addEventListener("click", playAudio);
prevButton.addEventListener("click", previousSong);

//şarkı bittiğinde yakala
audio.onended = () => {
    nextSong()
}
audio.addEventListener('timeupdate' ,()=>{
    currentTimeRef.innerText = timeFormatter(audio.currentTime)
})

//ekran yüklendiğinde
window.onload = () => {
  index = 0
  setSong(index)
  //durdur ve şarkı listesi oluştur
  pauseAudio()
  initializePlaylist()
}
