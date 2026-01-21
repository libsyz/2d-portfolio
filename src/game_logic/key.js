import { k } from './kaboomCtx';

import treasureKeySpriteUrl from '/src/assets/key.png';

k.loadSprite('treasure_key', treasureKeySpriteUrl, {
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
