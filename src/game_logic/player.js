import { k } from './kaboomCtx';

const pirate = k.loadSprite('pirate', './src/assets/pirate.png', {
    sliceX: 5,
    sliceY: 1,
    anims: {
        'idle': 0,
        'run': {from: 0, to: 4, loop: true, speed: 8 }
    }
})

export const createPlayer = () => {
    const playerScale = 1.0;
    const playerAreaScale = {scale: k.vec2(0.3, 0.6)};
    const playerJumpForce = 750;
    const playerBaseSpeed = 140;

    const player = k.add([
        k.sprite('pirate'), 
        { anim: 'idle'},
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
            player.play("run")
        }
    })

    k.onKeyDown('left', () => {
        player.move(-playerBaseSpeed, 0);
        if (player.curAnim() !== "run") {
            player.flipX = true;
            player.play("run");
        }
    })

    k.onKeyDown('down', () => {
        player.move(0, playerBaseSpeed);
        if (player.curAnim() !== "run") {
            player.play("run");
        }
    })

    k.onKeyDown('up', () => {
        player.move(0, -playerBaseSpeed);
        if (player.curAnim() !== "run") {
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
        if (player.isGrounded()) {
            player.jump(playerJumpForce)
        }
    })

    // player.onUpdate(() => {
    //     console.log(player.pos.x);
    //     if (player.pos.x > 100) {
    //      k.camPos(player.pos);
    //     }
    // })

    return player;
}

