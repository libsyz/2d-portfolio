import { k } from './kaboomCtx';

const oldManFace = k.loadSprite('old_man_face', './src/assets/old_man_face.png');

const oldMan = k.loadSprite('old_man_idle', './src/assets/old_man_idle.png', {
    sliceX: 4,
    sliceY: 1,
    anims: {
        'idle': 0
    }
})

export const createOldMan = () => {
    const scale = 1.5;

    const player = k.add([
        k.sprite('old_man_idle'), 
        k.pos(240, 180),
        {anim: 'idle'},
        k.area({scale: 1.5}),
        k.anchor('center'),
        k.scale(1),
        k.body({isStatic: true}),
        'old_man_idle'
//scale constrains bounds to the right place :-) 
    ]);
}

