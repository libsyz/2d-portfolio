
export const soundManager = () => { 

    const BGMSounds = {
        main: 'bgm-main', 
        office: 'bgm-office',
        temple: 'bgm-temple', 
        cave: 'bgm-cave', 
        house: 'bgm-house'
    }


    const soundManager = k.make([
        'sound_manager',
        {
            currentBGM: null
        }
    ])

    BGMSounds.keys.forEach((key) => {
        soundManager.on(`play-bgm-${key}`, () => {

            if (soundManager.currentBGM) {
                soundManager.currentBGM.stop();
            }
            
            soundManager = k.play(BGMSounds[k])
        })
    })
    
}