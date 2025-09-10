const wrapper = document.querySelector(".wrapper"),
musicImg = wrapper.querySelector(".img-area img"),
musicName = wrapper.querySelector(".song-details .name"),
musicArtist = wrapper.querySelector(".song-details .artist"),
mainAudio = wrapper.querySelector("#main-audio"),
playPauseBtn = wrapper.querySelector(".play-pause"),
prevBtn = wrapper.querySelector("#prev"),
nextBtn = wrapper.querySelector("#next"),
progressArea = wrapper.querySelector(".progress-area"),
progressBar = wrapper.querySelector(".progress-bar"),
musicList = wrapper.querySelector(".music-list"),
showMoreBtn = wrapper.querySelector("#more-music"),
hideMusicBtn = musicList.querySelector("#close");


const pauseIcon = '<i class="fa-solid fa-pause bg-clip"></i>';
const playIcon =  '<i class="fa-solid fa-play bg-clip"></i>';

let musicIndex = Math.floor((Math.random() * allMusic.length) + 1); 
window.addEventListener("load", ()=>{
    loadMusic(musicIndex); //calling load music function once window loads
    playingNow();
})
//load music function
function loadMusic(indexNumb) {
    musicName.innerText = allMusic[indexNumb - 1].name;
    musicArtist.innerText = allMusic[indexNumb - 1].artist;
    musicImg.src = `assets/img/${allMusic[indexNumb - 1].img}.jpg`;
    mainAudio.src = `assets/audio/${allMusic[indexNumb - 1].src}.mp3`;
}

//play music function
function playMusic(){
    wrapper.classList.add("paused");
    playPauseBtn.innerHTML = pauseIcon;
    mainAudio.play();
}

//pause music function
function pauseMusic(){
    wrapper.classList.remove("paused");
    playPauseBtn.innerHTML = playIcon;
    mainAudio.pause();
}

//next music function
function nextMusic(){
     musicIndex++;
     musicIndex > allMusic.length ? musicIndex = 1 : musicIndex = musicIndex;
     loadMusic(musicIndex)
     playMusic();
     playingNow();
}

//prev music function
function prevMusic(){
    musicIndex--;
    musicIndex <1  ? musicIndex = allMusic.length : musicIndex = musicIndex;
    loadMusic(musicIndex)
    playMusic();
    playingNow();
}

//play or pause music
playPauseBtn.addEventListener("click", ()=>{
    const isMusicPaused = wrapper.classList.contains("paused");

    isMusicPaused ? pauseMusic() : playMusic();
    playingNow();
});

//next music btn event
nextBtn.addEventListener("click", ()=>{
    nextMusic(); //calling next music function
});

prevBtn.addEventListener("click", ()=>{
    prevMusic(); //calling prev music function
});

//update progress bar width
mainAudio.addEventListener("timeupdate", (e)=>{
    const currentTime = e.target.currentTime; //current time of song
    const duration = e.target.duration; // duration of song
    let progressWidth = (currentTime / duration) * 100;
    progressBar.style.width = `${progressWidth}%`;

    let musicCurrentTime = wrapper.querySelector(".current"),
    musicDuration = wrapper.querySelector(".duration");

    mainAudio.addEventListener("loadeddata", ()=>{
        //update total audio duration
        let audioDuration = mainAudio.duration;
        let totalMin = Math.floor(audioDuration / 60);
        let totalSec = Math.floor(audioDuration % 60);
        if (totalSec < 10) {
            totalSec = `0${totalSec}`; //adding 0 if less than 10
        }
        musicDuration.innerText = `${totalMin}:${totalSec}`;
    
    });
    //update song current time
    let CurrentMin = Math.floor(currentTime / 60);
    let CurrentSec = Math.floor(currentTime % 60);
    if (CurrentSec < 10) {
        CurrentSec = `0${CurrentSec}`; //adding 0 if less than 10
    }
    musicCurrentTime.innerText = `${CurrentMin}:${CurrentSec}`;
});

//update playing song current time according to progress bar width
progressArea.addEventListener("click", (e)=>{
    let progressWidthVal = progressArea.clientWidth; //getting width of progress bar
    let clickedOffSetX = e.offsetX; //getting offset x value
    let songDuration = mainAudio.duration; //getting song total duration

    mainAudio.currentTime = (clickedOffSetX / progressWidthVal) * songDuration;
    playMusic();
});

//repeat , shuffle song
const repeatBtn = wrapper.querySelector("#repeat-plist");
const repeatControl = wrapper.querySelector(".repeat-control");
repeatBtn.addEventListener("click", ()=>{
    //get innerText of repeat control then we will change it accordingly

    let getText = repeatControl.innerText; //getting innerHTML of button
    // alert(getText);
    // //let's to different changes on different button click using switch

    let repeat = '<i class="fa-solid fa-repeat bg-clip text-dark"></i>';
    let repeatOne = '<i class="fa-solid fa-repeat bg-clip text-primary"></i>';
    let shuffle = '<i class="fa-solid fa-random bg-clip"></i>'


    switch (getText) {
        case "repeat": // button is repeat
            repeatControl.innerHTML = "repeat-one";
            repeatBtn.innerHTML = repeatOne;
            repeatBtn.setAttribute("title", "Song looped");
            break;
    
       case "repeat-one":
            repeatControl.innerHTML = "shuffle";
            repeatBtn.innerHTML = shuffle;
            repeatBtn.setAttribute("title", "Songs played randomly");
            break;

        case "shuffle":
            repeatControl.innerHTML = "repeat";
            repeatBtn.innerHTML = repeat;
            repeatBtn.setAttribute("title", "Playlist looped");
            break;
        
    }

}); 

//what to do after song ended
mainAudio.addEventListener("ended", ()=>{
    //this will happen according to repeat button option
    let getText = repeatControl.innerText; //getting innerHTML of button
    switch (getText) {
        case "repeat": // button is repeat
           nextMusic(); //if button is repeat then call the nextMusic function so the next music plays
            break;
    
       case "repeat-one":
           mainAudio.currentTime = 0; //changing audio current time to zero will make it to play from the begining
           loadMusic(musicIndex);
           playMusic();
           playingNow()
            break;

        case "shuffle":
            //generating random index between the max range of array length
           let randIndex = Math.floor((Math.random() * allMusic.length) + 1); 
           do {
                randIndex = Math.floor((Math.random() * allMusic.length) + 1); 
           } while (musicIndex == randIndex);
           musicIndex = randIndex;
           loadMusic(musicIndex);
           playMusic();
           playingNow()
            break;
        
    }

});

showMoreBtn.addEventListener("click", ()=>{
    musicList.classList.toggle("show");
});

hideMusicBtn.addEventListener("click", ()=>{
    showMoreBtn.click();
});

const ulTag = wrapper.querySelector("ul");
for (let i = 0; i < allMusic.length; i++) {
    let liTag = ` <li li-index="${i + 1}">
                    <div class="_row">
                        <span>${allMusic[i].name}</span>
                        <p>${allMusic[i].artist}</p>
                         <audio class="${allMusic[i].src}" src="assets/audio/${allMusic[i].src}.mp3"></audio>
                    </div>
                    <span id="${allMusic[i].src}">3:40</span>
                </li>`;
    ulTag.insertAdjacentHTML("beforeend", liTag); 
    

    let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);

    let  liAudioDuration = ulTag.querySelector(`#${allMusic[i].src}`);

    liAudioTag.addEventListener("loadeddata", ()=>{
        let audioDuration = liAudioTag.duration;
        let totalMin = Math.floor(audioDuration / 60)
        let totalSec = Math.floor(audioDuration % 60)
        if (totalSec < 10) {
            totalSec = `0${totalSec}`; //adding 0 if less than 10
        }
        liAudioDuration.innerText = `${totalMin}:${totalSec}`;
        //adding t-duration attribute
        liAudioDuration.setAttribute("t-duration", `${totalMin}:${totalSec}`);
    });
}

//adding onclick attribute
const allLiTags = ulTag.querySelectorAll("li");

function playingNow() {
    for (let j = 0; j < allLiTags.length; j++) {
        let audioTag = allLiTags[j].querySelector(`#${allMusic[j].src}`);
        if (allLiTags[j].classList.contains("playing")) {
            allLiTags[j].classList.remove("playing");

            //getting audio duration and pass it to duration inner text
          let aDuration = audioTag.getAttribute("t-duration");  
          audioTag.innerText = aDuration;
        }
        if(allLiTags[j].getAttribute("li-index") == musicIndex){
            allLiTags[j].classList.add("playing");
            audioTag.innerText = "ikuyimba";
        }
       allLiTags[j].setAttribute("onclick", "clicked(this)"); 
    }
}

//playing song on click
function clicked(element) {
    let getLiIndex = element.getAttribute("li-index");
    musicIndex = getLiIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}



