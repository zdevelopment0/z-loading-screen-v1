document.addEventListener('DOMContentLoaded', function() {
    const loadingBar = document.querySelector('.loading-bar');
    const loadingPercentage = document.querySelector('.loading-percentage');
    const playButton = document.querySelector('.play-btn');
    const volumeButton = document.querySelector('.volume-btn');
    const nextButton = document.querySelector('.next-btn');
    const progressBar = document.querySelector('.progress');
    const progressContainer = document.querySelector('.progress-bar');
    const currentTimeEl = document.querySelector('.current-time');
    const totalTimeEl = document.querySelector('.total-time');
    const container = document.querySelector('.container');
    
    const audio = new Audio('music/song.mp3');
    audio.volume = 0.1;
    audio.play()
    let isPlaying = false;
    
    createVolumeControls();
    
    let loadingProgress = 0;
    const loadingInterval = setInterval(() => {
        loadingProgress += Math.random() * 3 + 1;
        if (loadingProgress > 100) {
            loadingProgress = 100;
            clearInterval(loadingInterval);
            setTimeout(() => {
                if (typeof fivem !== 'undefined') {
                    fivem.emit('loadingScreenFinished');
                }
            }, 1000);
        }
        loadingBar.style.width = `${loadingProgress}%`;
        loadingPercentage.textContent = `${Math.floor(loadingProgress)}%`;
    }, 500);
    
    playButton.addEventListener('click', function() {
        isPlaying = !isPlaying;
        if (isPlaying) {
            audio.pause();
            playButton.innerHTML = '<i class="fas fa-play"></i>';
        } else {
            audio.play();
            playButton.innerHTML = '<i class="fas fa-pause"></i>';
        }
        addRippleEffect(this);
    });
    
    nextButton.addEventListener('click', function() {
        audio.currentTime = 0;
        if (!isPlaying) {
            audio.play();
            playButton.innerHTML = '<i class="fas fa-pause"></i>';
            isPlaying = true;
        }
        addRippleEffect(this);
    });
    
    audio.addEventListener('timeupdate', function() {
        const percent = (audio.currentTime / audio.duration) * 100;
        progressBar.style.width = `${percent}%`;
        const currentMinutes = Math.floor(audio.currentTime / 60);
        const currentSeconds = Math.floor(audio.currentTime % 60);
        currentTimeEl.textContent = `${currentMinutes}:${currentSeconds < 10 ? '0' : ''}${currentSeconds}`;
    });
    
    audio.addEventListener('canplaythrough', function() {
        audio.play();
        const totalMinutes = Math.floor(audio.duration / 60);
        const totalSeconds = Math.floor(audio.duration % 60);
        totalTimeEl.textContent = `${totalMinutes}:${totalSeconds < 10 ? '0' : ''}${totalSeconds}`;
    });
    
    progressContainer.addEventListener('click', function(e) {
        const rect = this.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        audio.currentTime = percent * audio.duration;
    });
    
    const serverInfo = document.querySelector('.server-info');
    const musicPlayer = document.querySelector('.music-player');
    const socialIcons = document.querySelectorAll('.social-icon');
    const buttons = document.querySelectorAll('.bottom-right-buttons button');
    
    const musicBtn = document.querySelector('.music-btn');
    const keyboardBtn = document.querySelector('.keyboard-btn');
    const eyeBtn = document.querySelector('.eye-btn');
    const closeBtn = document.querySelector('.close-btn');
    
    musicBtn.addEventListener('click', function() {
        musicPlayer.style.display = musicPlayer.style.display === 'none' ? 'block' : 'none';
        addRippleEffect(this);
    });
    
    eyeBtn.addEventListener('click', function() {
        container.classList.toggle('blurred');
        if (container.classList.contains('blurred')) {
            container.style.filter = 'blur(5px)';
        } else {
            container.style.filter = 'none';
        }
        addRippleEffect(this);
    });
    
    keyboardBtn.addEventListener('click', function() {
        showKeyboardShortcuts();
        addRippleEffect(this);
    });
    
    closeBtn.addEventListener('click', function() {
        musicPlayer.style.display = 'none';
        if (document.querySelector('.keyboard-shortcuts')) {
            document.querySelector('.keyboard-shortcuts').remove();
        }
        if (document.querySelector('.volume-controls.active')) {
            document.querySelector('.volume-controls').classList.remove('active');
        }
        container.style.filter = 'none';
        addRippleEffect(this);
    });
    
    function createVolumeControls() {
        const volumeControls = document.createElement('div');
        volumeControls.className = 'volume-controls';
        volumeControls.innerHTML = `
            <div class="volume-slider">
                <div class="volume-level"></div>
            </div>
            <div class="volume-options">
                <button class="volume-option" data-volume="0"></button>
                <button class="volume-option" data-volume="0.3"></button>
                <button class="volume-option" data-volume="0.7"></button>
                <button class="volume-option" data-volume="1"></button>
            </div>
        `;
        document.querySelector('.container').appendChild(volumeControls);
        document.querySelector('.volume-level').style.width = `${audio.volume * 100}%`;
        const volumeSlider = document.querySelector('.volume-slider');
        let isDragging = false;
        
        volumeSlider.addEventListener('mousedown', function(e) {
            isDragging = true;
            updateVolumeFromMouse(e);
        });
        
        document.addEventListener('mousemove', function(e) {
            if (isDragging) {
                updateVolumeFromMouse(e);
            }
        });
        
        document.addEventListener('mouseup', function() {
            isDragging = false;
        });
        
        function updateVolumeFromMouse(e) {
            const rect = volumeSlider.getBoundingClientRect();
            const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
            setVolume(percent);
        }
        
        const volumeOptions = document.querySelectorAll('.volume-option');
        volumeOptions.forEach(option => {
            option.addEventListener('click', function() {
                setVolume(parseFloat(this.dataset.volume));
            });
        });
    }
    
    function setVolume(value) {
        value = Math.max(0, Math.min(1, value));
        audio.volume = value;
        document.querySelector('.volume-level').style.width = `${value * 100}%`;
        if (value === 0) {
            volumeButton.innerHTML = '<i class="fas fa-volume-mute"></i>';
            volumeButton.dataset.volume = 'mute';
        } else if (value <= 0.3) {
            volumeButton.innerHTML = '<i class="fas fa-volume-down"></i>';
            volumeButton.dataset.volume = 'low';
        } else if (value <= 0.7) {
            volumeButton.innerHTML = '<i class="fas fa-volume-down"></i>';
            volumeButton.dataset.volume = 'medium';
        } else {
            volumeButton.innerHTML = '<i class="fas fa-volume-up"></i>';
            volumeButton.dataset.volume = 'high';
        }
    }
    
    function showKeyboardShortcuts() {
        if (document.querySelector('.keyboard-shortcuts')) {
            document.querySelector('.keyboard-shortcuts').remove();
            return;
        }
        const keyboardShortcuts = document.createElement('div');
        keyboardShortcuts.className = 'keyboard-shortcuts';
        keyboardShortcuts.style.position = 'absolute';
        keyboardShortcuts.style.top = '50%';
        keyboardShortcuts.style.left = '50%';
        keyboardShortcuts.style.transform = 'translate(-50%, -50%)';
        keyboardShortcuts.style.backgroundColor = 'rgba(12, 12, 18, 0.9)';
        keyboardShortcuts.style.borderRadius = '12px';
        keyboardShortcuts.style.padding = '20px';
        keyboardShortcuts.style.zIndex = '100';
        keyboardShortcuts.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.4)';
        keyboardShortcuts.style.border = '1px solid rgba(255, 255, 255, 0.1)';
        keyboardShortcuts.style.backdropFilter = 'blur(10px)';
        keyboardShortcuts.style.color = 'white';
        keyboardShortcuts.innerHTML = `
            <h2 style="margin-bottom: 15px; font-size: 20px; font-weight: 600;">Keyboard Shortcuts</h2>
            <div style="display: grid; grid-template-columns: auto 1fr; gap: 10px; align-items: center;">
                <kbd style="background: rgba(255,255,255,0.1); padding: 3px 6px; border-radius: 4px; font-family: monospace;">M</kbd>
                <span>Toggle Music</span>
                <kbd style="background: rgba(255,255,255,0.1); padding: 3px 6px; border-radius: 4px; font-family: monospace;">Space</kbd>
                <span>Play/Pause Music</span>
                <kbd style="background: rgba(255,255,255,0.1); padding: 3px 6px; border-radius: 4px; font-family: monospace;">↑/↓</kbd>
                <span>Volume Up/Down</span>
                <kbd style="background: rgba(255,255,255,0.1); padding: 3px 6px; border-radius: 4px; font-family: monospace;">ESC</kbd>
                <span>Close All</span>
            </div>
        `;
        document.querySelector('.container').appendChild(keyboardShortcuts);
    }
    
    function addRippleEffect(button) {
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        button.appendChild(ripple);
        const buttonRect = button.getBoundingClientRect();
        const size = Math.max(buttonRect.width, buttonRect.height);
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${-size/2 + buttonRect.width/2}px`;
        ripple.style.top = `${-size/2 + buttonRect.height/2}px`;
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
        ripple.style.transform = 'scale(0)';
        ripple.style.animation = 'ripple 0.6s linear';
        if (!document.querySelector('#ripple-animation')) {
            const style = document.createElement('style');
            style.id = 'ripple-animation';
            style.textContent = `
                @keyframes ripple {
                    to { transform: scale(2.5); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

document.addEventListener('DOMContentLoaded', function() {
    const audio = new Audio('music/song.mp3');
    audio.volume = 0.5;
    let isPlaying = false;

    function playMusic() {
        audio.muted = true;
        audio.play().then(() => {
            audio.muted = false;
            isPlaying = true;
        }).catch(error => {
            document.addEventListener('click', function once() {
                audio.play().then(() => {
                    isPlaying = true;
                }).catch(err => {});
                document.removeEventListener('click', once);
            });
        });
    }

    playMusic();

    document.getElementById('playMusic').addEventListener('click', function() {
        if (isPlaying) {
            audio.pause();
            this.textContent = "Play Music";
        } else {
            audio.play();
            this.textContent = "Pause Music";
        }
        isPlaying = !isPlaying;
    });
});

window.addEventListener('resize', function() {
    if (document.querySelector('.keyboard-shortcuts')) {
        document.querySelector('.keyboard-shortcuts').remove();
    }
    if (document.querySelector('.volume-controls.active')) {
        document.querySelector('.volume-controls').classList.remove('active');
    }
    container.style.filter = 'none';
});

window.addEventListener('beforeunload', function() {
    audio.pause();
    audio.currentTime = 0;
});
});