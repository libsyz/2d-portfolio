import { k } from './kaboomCtx.js';

// load the sprite
const mapSprite = k.loadSprite('game_map', './src/game_map.png');
const mapData = await (await fetch("./src/game_map.json")).json();

// instatiate the map
export const createMap = () => {
    const layers = mapData.layers;
    const map = k.add([k.sprite("game_map"), k.pos(0), k.scale(1)]);

    // add boundaries 
    for (const layer of layers) {
        if (layer.name === "bounds") {
            for (const boundary of layer.objects) {
                    map.add([
                        k.area({
                        shape: new k.Rect(k.vec2(0), boundary.width, boundary.height),
                        }),
                        k.body({ isStatic: true }),
                        k.pos(boundary.x, boundary.y),
                        'boundary',
                    ]);
            }
        }

        if (layer.name === 'teleport') {
            for (const gate of layer.objects) { 
                map.add([
                    k.area({
                        shape: new k.Rect(k.vec2(0), gate.width, gate.height)
                    }),
                    k.body({isStatic: true}),
                    k.pos(gate.x, gate.y),
                    gate.name
                ])
            }
        }
    }
}