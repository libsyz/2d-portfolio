import { k } from './kaboomCtx';



k.loadSprite('treasure_key', './src/assets/key.png', {
    sliceX: 1,
    sliceY: 1
})

export const createKey = () => {
    const keyScale = 4;
    const key = k.add([
        k.sprite('treasure_key'),
        k.pos(0, 0),
        k.anchor('center'),
        k.scale(keyScale),
        k.area(),
        'key'
    ]);


    return key;
}
