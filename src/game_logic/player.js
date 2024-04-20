import { k } from './kaboomCtx';

const pirate = k.loadSprite('pirate', './src/assets/pirate.png', {
    sliceX: 5,
    sliceY: 1,
    anims: {
        'idle': 0,
        'run': {from: 0, to: 4, loop: true, speed: 8 }
    }
})

const arrow = k.loadSprite('arrow', './src/assets/arrow.png');

export const createPlayer = () => {
    const playerScale = 1.0;
    const playerAreaScale = {scale: k.vec2(0.3, 0.6)};
    const playerJumpForce = 750;
    const playerBaseSpeed = 140;

    const player = k.add([
        k.sprite('pirate'), 
        { anim: 'idle', direction: k.RIGHT},
        k.pos(300, 184), 
        //scale constrains bounds to the right place :-)
        k.area(playerAreaScale),
        k.anchor('center'),
        k.scale(playerScale),
        k.body(),
        'player'
    ]);

    k.onKeyDown('right', () => {
        player.move(playerBaseSpeed, 0);
        if (player.curAnim() !== "run") {
            player.flipX = false;
            player.direction = k.RIGHT;
            player.play("run")
        }
    })

    k.onKeyDown('left', () => {
        player.move(-playerBaseSpeed, 0);
        if (player.curAnim() !== "run") {
            player.flipX = true;
            player.direction = k.LEFT;
            player.play("run");
        }
    })

    k.onKeyDown('down', () => {
        player.move(0, playerBaseSpeed);
        if (player.curAnim() !== "run") {
            player.direction = k.DOWN;
            player.play("run");
        }
    })

    k.onKeyDown('up', () => {
        player.move(0, -playerBaseSpeed);
        if (player.curAnim() !== "run") {
            player.direction = k.UP;
            player.play("run");
        }
    })

    k.onKeyRelease('right', () => {
        player.play('idle');
    })

    k.onKeyRelease('left', () => {
        player.play('idle');
    })

    k.onKeyRelease('up', () => {
        player.play('idle');
    })

    k.onKeyRelease('down', () => {
        player.play('idle');
    })

    k.onKeyPress("space", () => {
        k.debug.log('throw a shuriken baby');
        spawnArrow(player.pos, player.direction);
        // get the direction of the player
        // use that to instantiate a shuriken
        // and send it flying 
    })

    const spawnArrow = (playerPos, posDirection) => {
        const ARROW_SPEED = 300;
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
			k.scale(1.5),
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

