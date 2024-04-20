import { k } from './kaboomCtx';


const oldMan = k.loadSprite('baddie_green_demon', './src/assets/baddie_green_demon.png', {
    sliceX: 4,
    sliceY: 4,
    anims: {
        'idle': 1
    }
})

export const createBaddieGreenDemon = () => {
    const scale = 1.5;

    const player = k.add([
        k.sprite('baddie_green_demon'), 
        k.pos(240, 180),
        {anim: 'idle'},
        k.area({scale: 1.5}),
        k.anchor('center'),
        k.scale(2),
        k.body({isStatic: true}),
        'baddie_green_demon'
//scale constrains bounds to the right place :-) 
    ]);
}