import { k } from './kaboomCtx';

export const createSpawnPoint = (map, obj) => { 
        map.add([
                k.rect(obj.width, obj.height),
                k.pos(obj.x, obj.y), 
                k.area(),
                k.opacity(0),
                k.body({isStatic: true}),
                obj.name
                ])
        }
