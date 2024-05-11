import { k } from './kaboomCtx.js';
import { createInteraction } from './interaction.js'

// load the sprite
const mapSprite = k.loadSprite('house_map', './src/assets/house_map.png');
const mapData = await (await fetch("./src/mapdata/house_map.json")).json();
// instatiate the map
export const createHouseMap = () => {
    const layers = mapData.layers;
    const houseMap = k.add([k.sprite("house_map"), 
        k.pos(0), 
        k.scale(4)]);

    // add boundaries 
    for (const layer of layers) {
        if (layer.name === "bounds") {
            for (const boundary of layer.objects) {
                    houseMap.add([
                        k.area({
                        shape: new k.Rect(k.vec2(0), boundary.width, boundary.height),
                        }),
                        k.body({ isStatic: true }),
                        k.pos(boundary.x, boundary.y),
                        'boundary',
                    ]);
            }
        }


        // NO INTERACTIONS SET IN THE MAP YET
        // if (layer.name === 'interaction') {

        //     for ( const obj of layer.objects ) {
        //         // I would have to create the interactable based on the name 
        //         // look for 
        //         createInteraction(map, obj);
        //     }
            
        // }

    }
}