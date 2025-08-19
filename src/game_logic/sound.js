


export const createSoundManager = (k) => { 
    const soundManager = k.make([
        'sound_manager',
        {
            currentBGM: null,
            sounds: {
                main: 'bgm-main', 
                office: 'bgm-office',
                temple: 'bgm-temple', 
                cave: 'bgm-cave', 
                house: 'bgm-house'
            }
        }
    ])

    soundManager.on('play-bgm', async (sound) => {

        if (soundManager.currentBGM) {
           await soundManager.currentBGM.stop();
           soundManager.currentBGM = null;
        } 
        
        soundManager.currentBGM = k.play(`${soundManager.sounds[sound]}`, {
            loop: true,
            volume: 0.7
        })
    })

    soundManager.on('toggle', () => {
        k.debug.log('receiving message from UI');
    })
    

    // soundManager.init();
            
            
    //     })
    // })
    
    return soundManager;
}