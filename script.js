// --------------------- Playable Ad Code ---------------------
const audioCtx = new AudioContext();
let stage = 1;

// Mute all videos except the lobby initially.
document.querySelectorAll("video").forEach(video => {
    if (video.id !== "lobbyVideo") {
        video.muted = true;
    }
});

// Grab essential elements.
const lobbyVideo = document.getElementById("lobbyVideo");
const playButton = document.getElementById("playButton");
const fingerLoop = document.getElementById("fingerLoop");
const lobbyFinalFrame = document.getElementById("lobbyFinalFrame");

const triviaBackgroundVideo = document.getElementById("triviaBackgroundVideo");

const finalScreen = document.getElementById("finalScreen");
const submitBtn = document.getElementById("submitBtn");
const inBtn = document.getElementById("inBtn");
const privacyBtn = document.getElementById("privacyBtn");
const confetti = document.getElementById("confetti");
const phoneInput = document.querySelector(".phone-input");

const music = document.getElementById("music");

// Grab other video elements.
const Q1_entrance = document.getElementById("Q1_entrance");
const Q1_A = document.getElementById("Q1_A");
const Q1_B = document.getElementById("Q1_B");
const Q1_C = document.getElementById("Q1_C");
const Q1_D = document.getElementById("Q1_D");

const Q2_entrance = document.getElementById("Q2_entrance");
const Q2_A = document.getElementById("Q2_A");
const Q2_B = document.getElementById("Q2_B");
const Q2_C = document.getElementById("Q2_C");
const Q2_D = document.getElementById("Q2_D");

const Q3_entrance = document.getElementById("Q3_entrance");
const Q3_A = document.getElementById("Q3_A");
const Q3_B = document.getElementById("Q3_B");
const Q3_C = document.getElementById("Q3_C");
const Q3_D = document.getElementById("Q3_D");

const triviaBtnWrapper = document.querySelector(".trivia-btn-wrapper");
const aButton = document.getElementById("aButton");
const bButton = document.getElementById("bButton");
const cButton = document.getElementById("cButton");
const dButton = document.getElementById("dButton");

const bad = document.getElementById("bad");
const better = document.getElementById("better");
const good = document.getElementById("good");
const best = document.getElementById("best");
const bestLoop = document.getElementById("bestLoop");

const first = document.getElementById("first");
const second = document.getElementById("second");
const third = document.getElementById("third");

// Display the start screen.
displayStartScreen();

lobbyVideo.addEventListener("timeupdate", function onUpdate() {
    if (this.currentTime >= this.duration - 0.2) {
        lobbyVideo.style.display = "none";
        lobbyFinalFrame.style.display = "block";
        fingerLoop.style.zIndex = 20;
        playVideoOnDemand(fingerLoop);
        lobbyVideo.removeEventListener("timeupdate", onUpdate);
    }
});

playButton.addEventListener("click", () => {
    if (areAllVideosPaused()) {
        playLoopingMusic(0.3, 1);
        playVideoOnDemand(triviaBackgroundVideo);
        playVideoOnDemand(bad);
        triviaBtnWrapper.style.display = "flex";
        let pass = false;
        triviaBackgroundVideo.addEventListener("timeupdate", function onUpdate() {
            if (!pass && this.currentTime >= 1) {
                lobbyFinalFrame.style.display = "none";
                fingerLoop.style.display = "none";
                playButton.style.display = "none";
                pass = true;
            }
            if (this.currentTime >= this.duration - 0.3) {
                Q1_entrance.style.display = "flex";
                first.style.display = "flex";
                playVideoOnDemand(Q1_entrance);
                playVideoOnDemand(first);
                triviaBackgroundVideo.removeEventListener("timeupdate", onUpdate);
            }
        });
    }
});

// Example event listeners for answer buttons.
aButton.addEventListener("click", () => {
    if (areAllVideosPaused()) {
        if (stage === 1) {
            Q1_entrance.style.display = "none";
            playVideoOnDemand(Q1_A);
            Q1_A.addEventListener("timeupdate", function onUpdate() {
                if (this.currentTime >= this.duration - 0.3) {
                    Q1_A.style.display = "none";
                    Q1_entrance.style.display = "flex";
                    Q1_A.removeEventListener("timeupdate", onUpdate);
                }
            });
        } else if (stage === 2) {
            stage++;
            Q2_entrance.style.display = "none";
            better.style.display = "none";
            playVideoOnDemand(Q2_A);
            playVideoOnDemand(good);
            Q2_A.addEventListener("timeupdate", function onUpdate() {
                if (this.currentTime >= this.duration - 0.3) {
                    Q2_A.style.display = "none";
                    second.style.display = "none";
                    playVideoOnDemand(Q3_entrance);
                    playVideoOnDemand(third);
                    Q2_A.removeEventListener("timeupdate", onUpdate);
                }
            });
        } else if (stage === 3) {
            Q3_entrance.style.display = "none";
            good.style.display = "none";
            playVideoOnDemand(Q3_A);
            playVideoOnDemand(best);
            best.addEventListener("timeupdate", function onUpdate() {
                if (this.currentTime >= this.duration - 0.3) {
                    best.style.display = "none";
                    bestLoop.setAttribute("loop", "");
                    playVideoOnDemand(bestLoop);
                    best.removeEventListener("timeupdate", onUpdate);
                }
            });
            Q3_A.addEventListener("timeupdate", function onUpdate() {
                if (this.currentTime >= this.duration - 0.3) {
                    triviaBtnWrapper.style.display = "none";
                    playVideoOnDemand(finalScreen);
                    finalScreen.addEventListener("timeupdate", function onUpdate() {
                        if (this.currentTime >= 4.19) {
                            fadeOutLoopingMusic(2);
                            hideAllVideosExceptFinal();
                            finalScreen.removeEventListener("timeupdate", onUpdate);
                        }
                    });
                    Q3_A.removeEventListener("timeupdate", onUpdate);
                }
            });
        }
    }
});

bButton.addEventListener("click", () => {
    if (areAllVideosPaused()) {
        if (stage === 1) {
            Q1_entrance.style.display = "none";
            playVideoOnDemand(Q1_B);
            Q1_B.addEventListener("timeupdate", function onUpdate() {
                if (this.currentTime >= this.duration - 0.3) {
                    Q1_B.style.display = "none";
                    Q1_entrance.style.display = "flex";
                    Q1_B.removeEventListener("timeupdate", onUpdate);
                }
            });
        } else if (stage === 2) {
            Q2_entrance.style.display = "none";
            playVideoOnDemand(Q2_B);
            Q2_B.addEventListener("timeupdate", function onUpdate() {
                if (this.currentTime >= this.duration - 0.3) {
                    Q2_B.style.display = "none";
                    Q2_entrance.style.display = "flex";
                    Q2_B.removeEventListener("timeupdate", onUpdate);
                }
            });
        } else if (stage === 3) {
            Q3_entrance.style.display = "none";
            playVideoOnDemand(Q3_B);
            Q3_B.addEventListener("timeupdate", function onUpdate() {
                if (this.currentTime >= this.duration - 0.3) {
                    Q3_B.style.display = "none";
                    Q3_entrance.style.display = "flex";
                    Q3_B.removeEventListener("timeupdate", onUpdate);
                }
            });
        }
    }
});

cButton.addEventListener("click", () => {
    if (areAllVideosPaused()) {
        if (stage === 1) {
            Q1_entrance.style.display = "none";
            playVideoOnDemand(Q1_C);
            Q1_C.addEventListener("timeupdate", function onUpdate() {
                if (this.currentTime >= this.duration - 0.3) {
                    Q1_C.style.display = "none";
                    Q1_entrance.style.display = "flex";
                    Q1_C.removeEventListener("timeupdate", onUpdate);
                }
            });
        } else if (stage === 2) {
            Q2_entrance.style.display = "none";
            playVideoOnDemand(Q2_C);
            Q2_C.addEventListener("timeupdate", function onUpdate() {
                if (this.currentTime >= this.duration - 0.3) {
                    Q2_C.style.display = "none";
                    Q2_entrance.style.display = "flex";
                    Q2_C.removeEventListener("timeupdate", onUpdate);
                }
            });
        } else if (stage === 3) {
            Q3_entrance.style.display = "none";
            playVideoOnDemand(Q3_C);
            Q3_C.addEventListener("timeupdate", function onUpdate() {
                if (this.currentTime >= this.duration - 0.3) {
                    Q3_C.style.display = "none";
                    Q3_entrance.style.display = "flex";
                    Q3_C.removeEventListener("timeupdate", onUpdate);
                }
            });
        }
    }
});

dButton.addEventListener("click", () => {
    if (areAllVideosPaused()) {
        if (stage === 1) {
            stage++;
            Q1_entrance.style.display = "none";
            bad.style.display = "none";
            playVideoOnDemand(Q1_D);
            playVideoOnDemand(better);
            Q1_D.addEventListener("timeupdate", function onUpdate() {
                if (this.currentTime >= this.duration - 0.3) {
                    Q1_D.style.display = "none";
                    first.style.display = "none";
                    playVideoOnDemand(Q2_entrance);
                    playVideoOnDemand(second);
                    Q1_D.removeEventListener("timeupdate", onUpdate);
                }
            });
        } else if (stage === 2) {
            Q2_entrance.style.display = "none";
            playVideoOnDemand(Q2_D);
            Q2_D.addEventListener("timeupdate", function onUpdate() {
                if (this.currentTime >= this.duration - 0.3) {
                    Q2_D.style.display = "none";
                    Q2_entrance.style.display = "flex";
                    Q2_D.removeEventListener("timeupdate", onUpdate);
                }
            });
        } else if (stage === 3) {
            Q3_entrance.style.display = "none";
            playVideoOnDemand(Q3_D);
            Q3_D.addEventListener("timeupdate", function onUpdate() {
                if (this.currentTime >= this.duration - 0.3) {
                    Q3_D.style.display = "none";
                    Q3_entrance.style.display = "flex";
                    Q3_D.removeEventListener("timeupdate", onUpdate);
                }
            });
        }
    }
});

finalScreen.addEventListener("timeupdate", function onUpdate() {
    if (this.currentTime >= this.duration - 1) {
        console.log('hereqwa');
        confetti.style.zIndex = 60;
        playVideoOnDemand(confetti);
        finalScreen.removeEventListener("timeupdate", onUpdate);
    }
});

// Helper Functions
function displayStartScreen() {
    lobbyVideo.style.display = "flex";
    lobbyVideo.play();
    playButton.style.display = "block";
}

function areAllVideosPaused() {
    const ignoredIds = ["bestLoop", "fingerLoop"];

    const activeVideos = [...document.querySelectorAll("video")].filter(
        video => !video.paused && !ignoredIds.includes(video.id)
    );

    return activeVideos.length === 0;
}

function playVideoOnDemand(videoElement) {
    videoElement.preload = "auto";
    videoElement.style.display = "flex";
    videoElement.muted = false;
    videoElement.play();
}

function playLoopingMusic(targetVolume = 1, fadeInDuration = 2) {
    music.volume = 0;
    music.loop = true;
    music.play();
    const steps = 20;
    const stepDuration = fadeInDuration / steps;
    let currentStep = 0;
    const interval = setInterval(() => {
        currentStep++;
        music.volume = Math.min(targetVolume, (targetVolume / steps) * currentStep);
        if (currentStep >= steps) {
            clearInterval(interval);
        }
    }, stepDuration * 1000);
}

function fadeOutLoopingMusic(fadeOutDuration = 2) {
    const initialVolume = music.volume;
    const steps = 20;
    const stepDuration = fadeOutDuration / steps;
    let currentStep = 0;
    const interval = setInterval(() => {
        currentStep++;
        music.volume = Math.max(0, initialVolume * (1 - currentStep / steps));
        if (currentStep >= steps) {
            clearInterval(interval);
            music.pause();
        }
    }, stepDuration * 1000);
}

function hideAllVideosExceptFinal() {
    const videos = document.querySelectorAll("video");
    videos.forEach(video => {
      if (video.id !== "finalScreen") {
        video.style.display = "none"; // Hide all videos except the final one
      }
    });
  }