


import { k } from './kaboomCtx';
import interviewerFaceSpriteUrl from './../assets/interviewer_face.png';
import interviewerSpriteUrl from './../assets/interviewer_idle.png';

const interviewerFace = k.loadSprite('interviewer_face', interviewerFaceSpriteUrl);

const interviewer = k.loadSprite('interviewer', interviewerSpriteUrl, {
    sliceX: 4,
    sliceY: 1,
    anims: {
        'idle-down': 1,
        'idle-up': 2,
        'idle-left': 3, 
        'idle-right': 4 
    }
})

export const createInterviewer = () => {
    const scale = 1.5;

    const interviewer = k.add([
        k.sprite('interviewer'), 
        k.pos(340, 180),
        {anim: 'idle-left'},
        k.area({scale: 2.5}),
        k.anchor('center'),
        k.scale(2),
        k.body({isStatic: true}),
        'interviewer_idle'
//scale constrains bounds to the right place :-) 
    ]);

    return interviewer;
}