import { k } from './kaboomCtx';

const pirate = k.loadSprite('player', './src/assets/player.png', {
    sliceX: 4,
    sliceY: 5,
    anims: {
        'idle-down': 0,
        'idle-up': 4,
        'idle-left': 8,
        'idle-right': 12,
        'down': {from: 0, to: 3, loop: true, speed: 8 },
        'up': {from: 4, to: 7, loop: true, speed: 8 },
        'left': {from: 8, to: 11, loop: true, speed: 8},
        'right': {from: 12, to: 15, loop: true, speed: 8}
    }
})

const arrow = k.loadSprite('arrow', './src/assets/arrow.png');

export const createPlayer = () => {
    const playerScale = 4;
    const playerAreaScale = {scale: k.vec2(0.3, 0.6)};
    const playerJumpForce = 750;
    const playerBaseSpeed = 340;

    const player = k.add([
        k.sprite('player'), 
        { anim: 'idle-down', direction: k.DOWN},
        k.pos(20, 20), 
        //scale constrains bounds to the right place :-)
        k.area(playerAreaScale),
        k.anchor('center'),
        k.scale(playerScale),
        k.body(),
        'player'
    ]);

    k.onKeyDown('right', () => {
        player.move(playerBaseSpeed, 0);
        if (player.curAnim() !== "right") {
            player.direction = k.RIGHT;
            player.play("right")
        }
    })

    k.onKeyDown('left', () => {
        player.move(-playerBaseSpeed, 0);
        if (player.curAnim() !== "left") {
            player.direction = k.LEFT;
            player.play("left");
        }
    })

    k.onKeyDown('down', () => {
        player.move(0, playerBaseSpeed);
        if (player.curAnim() !== "down") {
            player.direction = k.DOWN;
            player.play("down");
        }
    })

    k.onKeyDown('up', () => {
        player.move(0, -playerBaseSpeed);
        if (player.curAnim() !== "up") {
            player.direction = k.UP;
            player.play("up");
        }
    })

    k.onKeyRelease('right', () => {
        player.play('idle-right');
    })

    k.onKeyRelease('left', () => {
        player.play('idle-left');
    })

    k.onKeyRelease('up', () => {
        player.play('idle-up');
    })

    k.onKeyRelease('down', () => {
        player.play('idle-down');
    })

    k.onKeyPress("space", () => {
        spawnArrow(player.pos, player.direction);
        // get the direction of the player
        // use that to instantiate a shuriken
        // and send it flying 
    })

    const spawnArrow = (playerPos, posDirection) => {
        const ARROW_SPEED = 800;
        let rotation = 0;

        if (posDirection === k.RIGHT) {
            rotation = 0;
        } else if (posDirection === k.LEFT ) { 
            rotation = 180;
        } else if (posDirection === k.UP) {
            rotation = 270
        } else {
            rotation = 90
        }
		k.add([
			k.sprite('arrow'),
			k.area(),
			k.pos(playerPos),
			k.anchor("center"),
            k.rotate(rotation),
			k.color(127, 127, 255),
			k.scale(4),
			k.move(posDirection, ARROW_SPEED),
			k.offscreen({ destroy: true }),
			// strings here means a tag
			"arrow",
		])
	}


    // player.onUpdate(() => {
    //     console.log(player.pos.x);
    //     if (player.pos.x > 100) {
    //      k.camPos(player.pos);
    //     }
    // })

    return player;
}

