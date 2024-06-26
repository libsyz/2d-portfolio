
// File keeps the creation of objects that are in the map and can be inspected are 'talked to' on collision

import { k } from './kaboomCtx';

export const createInteraction = (map, obj) => { 
        map.add([
            k.area({
                shape: new k.Rect(k.vec2(0), obj.width, obj.height)
                }),
                k.body({isStatic: true}),
                k.pos(obj.x, obj.y),
                obj.name
                ])
        }
