import { k } from './kaboomCtx.js';
import { createInteraction } from './interaction.js'

// load the sprite
const mapSprite = k.loadSprite('map', './src/assets/map.png');
const mapData = await (await fetch("./src/mapdata/map.json")).json();
// instatiate the map
export const createMap = () => {
    const layers = mapData.layers;
    const map = k.add([k.sprite("map"), 
        k.pos(0), 
        k.scale(4)]);

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

        if (layer.name === 'scene') {
            for (const scene of layer.objects) { 
                map.add([
                    k.area({
                        shape: new k.Rect(k.vec2(0), scene.width, scene.height)
                    }),
                    k.pos(scene.x, scene.y),
                    scene.name
                ])
            }
        }

        if (layer.name === 'interaction') {
            debugger
            for ( const obj of layer.objects ) {
                // I would have to create the interactable based on the name 
                // look for 
                createInteraction(map, obj);
            }
            
        }

    }
}