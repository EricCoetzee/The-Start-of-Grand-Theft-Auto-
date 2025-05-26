document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menuToggle');
    const gameGrid = document.getElementById('gameGrid');
    const gameCards = document.querySelectorAll('.game-card');
    const resetBtn = document.getElementById('header');
    const heartbeat = document.getElementById('heartbeat');
    const sirenSound = document.getElementById('siren');
    const audios = document.querySelectorAll('audio');

    // Track if sounds are enabled
    let soundsEnabled = false;
    
    // Function to enable sounds
    function enableSounds() {
        if (soundsEnabled) return;
        soundsEnabled = true;
        
        // Warm up the audio elements by playing/pausing immediately
        audios.forEach(audio => {
            audio.volume = 0.5; // Set default volume
            audio.play().then(() => {
                audio.pause();
                audio.currentTime = 0;
            }).catch(e => console.log("Audio warmup:", e.message));
        });
        
        // Remove the enable button if it exists
        const enableBtn = document.getElementById('enableSoundBtn');
        if (enableBtn) {
            enableBtn.remove();
            const disBtn = document.createElement('button');
            disBtn.id = 'disableSoundBtn';
            disBtn.textContent = '🔊 Click to Disable Sound';
            disBtn.style.position = 'fixed';
            disBtn.style.bottom = '20px';
            disBtn.style.right = '20px';
            disBtn.style.zIndex = '1000';
            disBtn.style.padding = '10px 15px';
            disBtn.style.borderRadius = '5px';
            disBtn.style.backgroundColor = '#ff4757';
            disBtn.style.color = 'white';
            disBtn.style.border = 'none';
            disBtn.style.cursor = 'pointer';
            
            disBtn.addEventListener('click', function() {
                soundsEnabled = false;
                audios.forEach(audio => {
                    audio.pause();
                    audio.currentTime = 0;
                });
                disBtn.remove();
                createEnableButton();
            });
            
            document.body.appendChild(disBtn);
        }
    }

    // Create enable sound button (for first-time visitors)
    function createEnableButton() {
        const btn = document.createElement('button');
        btn.id = 'enableSoundBtn';
        btn.textContent = '🔊 Click to Enable Sound';
        btn.style.position = 'fixed';
        btn.style.bottom = '20px';
        btn.style.right = '20px';
        btn.style.zIndex = '1000';
        btn.style.padding = '10px 15px';
        btn.style.borderRadius = '5px';
        btn.style.backgroundColor = '#ff4757';
        btn.style.color = 'white';
        btn.style.border = 'none';
        btn.style.cursor = 'pointer';
        
        btn.addEventListener('click', function() {
            enableSounds();
            // Play a quick test sound
            if (sirenSound) {
                sirenSound.volume = 0.5;
                sirenSound.currentTime = 0;
                sirenSound.play().then(() => {
                    setTimeout(() => sirenSound.pause(), 500);
                });
            }
        });
        
        document.body.appendChild(btn);
    }

    // Check if we can play audio immediately
    Promise.all([...audios].map(audio => audio.play().then(() => {
        audio.pause();
        audio.currentTime = 0;
        soundsEnabled = true;
    }).catch(() => {}))).then(() => {
        if (!soundsEnabled) createEnableButton();
    });

    // Enable sounds on any user interaction
    document.addEventListener('click', enableSounds, { once: true });
    document.addEventListener('keydown', enableSounds, { once: true });

    // Play Sound on header hover
    resetBtn.addEventListener('mouseover', function() {
        if (!soundsEnabled) return;
        
        try {
            // Play siren sound
            if (sirenSound) {
                sirenSound.currentTime = 0;
                sirenSound.volume = 0.5;
                sirenSound.play().catch(e => console.log("Siren:", e.message));
            }
            
            // Play heartbeat
            if (heartbeat) {
                heartbeat.currentTime = 0;
                heartbeat.volume = 0.5;
                heartbeat.play().catch(e => console.log("Heartbeat:", e.message));
            }
        } catch (error) {
            console.log("Play error:", error.message);
        }
    });

    resetBtn.addEventListener('mouseleave', function() {
        try {
            // Fade out sounds
            if (heartbeat) {
                heartbeat.pause();
                heartbeat.currentTime = 0;
            }
            
            if (sirenSound) {
                sirenSound.pause();
                sirenSound.currentTime = 0;
            }
        } catch (error) {
            console.log("Pause error:", error.message);
        }
    });

    // Menu toggle functionality
    menuToggle.addEventListener('click', function() {
        gameGrid.classList.toggle('active');
        this.textContent = gameGrid.classList.contains('active') ? 
            'CLOSE MENU ✕' : 'GTA GAMES MENU ☰';
    });
    
    setTimeout(() => {
        gameGrid.style.opacity = '1';
    }, 300);

    async function getFile(game) {
        try {
            const response = await fetch(`./imgz/svgs/${game}.html`);
            if (!response.ok) {
                throw new Error("File not Found");
            }
            return await response.text();
        } catch (error) {
            console.error(`Error loading SVG: ${game}.html`, error);
            return `<text x="50" y="55" font-family="Arial" font-size="12" fill="white" text-anchor="middle">Alt</text>`;
        }
    }

    // Alternate SVGs for toggle - now stores functions that return promises
    const altSVGs = {
       gta6: () => getFile('gta6'),
       gtao: () => getFile('gtao'),
       gta5: () => getFile('gta5'),
       gta4: () => getFile('gta4'),
       gtaiii: () => getFile('gtaiii'),
       gtaii: () => getFile('gtaii'),
       gtasa: () => getFile('gtasa'),
       gtavc: () => getFile('gtavc'),
       gtavcs: () => getFile('gtavcs'),
       gtalcs: () => getFile('gtalcs'),
       gtactw: () => getFile('gtactw'),
       moregta: () => getFile('moregta')
    };

    const toggled = {};

    gameCards.forEach(card => {
        card.addEventListener('click', async function() {
            const game = this.getAttribute('data-game');
            const svg = this.querySelector('.game-icon');

            if (!toggled[game]) {
                try {
                    const svgContent = await altSVGs[game]();
                    svg.innerHTML = svgContent;
                    toggled[game] = true;
                    console.log(`Switched to alternative SVG for ${game}`);
                    document.getElementById(`${game}`).style.display = 'inline';
                } catch (error) {
                    console.error("Error loading SVG:", error);
                    svg.innerHTML = `<text x="50" y="55" font-family="Arial" font-size="12" fill="white" text-anchor="middle">Alt</text>`;
                }
            }

            this.classList.add('loading');
            setTimeout(() => {
                this.classList.remove('loading');
                if (confirm(`Loading ${this.querySelector('.game-title').textContent} content...`)) {
                    document.getElementById("character").src = `./imgz/svgs/svg-logo-change/${game}-logo-change.svg`;
                    landingContainer.style.display = 'flex';
                    setTimeout(() => {
                        jumpBtn.addEventListener("click", window.location.href = `https://www.${game}.unrealg.com`);
                    }, 8000);
                } else {
                    alert(`Whenever you are ready, click the Jump button to enter the game!`);
                } 
            }, 600);
        });
    });

    // Jump button functionality
    const jumpBtn = document.getElementById('jumpBtn');
    const landingContainer = document.getElementById('landingContainer');
    const portal = document.getElementById('portal');
    const character = document.getElementById('character');
    const portalSound = document.getElementById('portalSound');
    const jumpSound = document.getElementById('jumpSound');
    const mainContent = document.querySelector('.mainContent');
  
    if (jumpBtn) {
        jumpBtn.addEventListener('click', () => {
            // Disable the button to prevent multiple clicks
            jumpBtn.disabled = true;
            jumpBtn.style.display = 'none';
        
            // Play portal activation sound
            if (portalSound && soundsEnabled) {
                portalSound.currentTime = 0;
                portalSound.play();
            }
        
            // Activate the portal (make it visible)
            portal.classList.add('active');
        
            // Wait for the portal to fully appear before jumping
            setTimeout(() => {
                // Play jump sound
                if (jumpSound && soundsEnabled) {
                    jumpSound.currentTime = 0;
                    jumpSound.play();
                }
        
                // Add jump animation to the character
                character.style.animation = 'jump 2s forwards';
        
                // After the jump animation, reveal main content
                setTimeout(() => {
                    // Hide the portal and character
                    portal.style.display = 'none';
                    character.style.display = 'none';
        
                    // Show the main content
                    mainContent.style.display = 'block';
                }, 2000); // Duration matches the jump animation
            }, 1000); // Wait 1 second for the portal to appear
        });
    }

    // Enhanced live player count simulation
    let playerCount = 125890;
    const onlinePlayersElement = document.getElementById('onlinePlayers');
    
    function updatePlayerCount() {
        const randomChange = Math.floor(Math.random() * 1000) - 500;
        playerCount = Math.max(100000, playerCount + randomChange);
        
        // Add digital counting effect
        let currentDisplay = parseInt(onlinePlayersElement.textContent.replace(/,/g, ''));
        const increment = Math.floor((playerCount - currentDisplay) / 10);
        
        const countInterval = setInterval(() => {
            currentDisplay += increment;
            if ((increment > 0 && currentDisplay >= playerCount) || 
                (increment < 0 && currentDisplay <= playerCount)) {
                currentDisplay = playerCount;
                clearInterval(countInterval);
            }
            onlinePlayersElement.textContent = currentDisplay.toLocaleString();
            
            // Add glitch effect during update
            if (Math.random() > 0.7) {
                onlinePlayersElement.style.textShadow = `0 0 10px ${Math.random() > 0.5 ? 'var(--neon-purple)' : 'var(--neon-pink)'}`;
                setTimeout(() => {
                    onlinePlayersElement.style.textShadow = '0 0 15px rgba(249, 240, 2, 0.5)';
                }, 100);
            }
        }, 50);
    }
    
    // Initial update
    if (onlinePlayersElement) {
        updatePlayerCount();
        
        // Regular updates
        setInterval(updatePlayerCount, 5000);
    }
    
    // Add random card glitch effects
    const statCards = document.querySelectorAll('.stat-card');
    
    setInterval(() => {
        statCards.forEach(card => {
            if (Math.random() > 0.8) {
                card.classList.add('glitch-active');
                setTimeout(() => {
                    card.classList.remove('glitch-active');
                }, 200);
            }
        });
    }, 3000);
});