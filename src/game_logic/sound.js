


export const createSoundManager = (k) => { 
    const soundManager = k.add([
        'sound_manager',
        k.state('on', ['on', 'off']),
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

    soundManager.on('play-bgm', async (soundsKey) => {
        const paused = soundManager.paused 

        if (soundManager.currentBGM) {
           await soundManager.currentBGM.stop();
           soundManager.currentBGM = null;
        } 
        
        soundManager.currentBGM = k.play(`${soundManager.sounds[soundsKey]}`, {
            volume: 0.0,
            loop: true, 
            paused: soundManager.state === 'on' ? false : true
        })
    })

    soundManager.onStateEnter('on', () => {
        soundManager.currentBGM.paused = false;
    })

    soundManager.onStateEnter('off', () => {
        soundManager.currentBGM.paused = true;
    })
    
    return soundManager;
}

