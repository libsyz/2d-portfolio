
// File keeps the creation of objects that are in the map and can be inspected are 'talked to' on collision

import { k } from './kaboomCtx';

export const createInteraction = (map, obj) => { 
    const mapInteractables = {
        mailbox: () => { 
            map.add([
                    k.area({
                        shape: new k.Rect(k.vec2(0), obj.width, obj.height)
                    }),
                    k.body({isStatic: true}),
                    k.pos(obj.x, obj.y),
                    obj.name
                ])
        },
        house_door: () => {
            map.add([
                k.area({
                    shape: new k.Rect(k.vec2(0), obj.width, obj.height)
                }),
                k.body({isStatic: true}),
                k.pos(obj.x, obj.y),
                obj.name
            ])
        },
        psychology_diploma: () => {
            map.add([
                k.area({
                    shape: new k.Rect(k.vec2(0), obj.width, obj.height)
                }),
                k.body({isStatic: true}),
                k.pos(obj.x, obj.y),
                obj.name
            ])
        }

        
    }


    mapInteractables[obj.name]();
    setCollision(obj.name);
}


const setCollision = (objName) => { 

}