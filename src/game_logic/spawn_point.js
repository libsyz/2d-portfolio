import { k } from './kaboomCtx';

export const createSpawnPoint = (map, obj) => { 
        map.add([
                k.pos(obj.x, obj.y), 
                obj.name
                ])
        }
