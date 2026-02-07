import { trackGameStage } from "./analytics.js";

import kaplay from "kaplay";

import pixelScriptFontUrl from "/src/fonts/pixel-script.ttf";
import maruMinyaFontUrl from "/src/fonts/maru-minya.ttf";
import pixelifySansUrl from "/src/fonts/pixelify-sans.ttf";
import micro5FontUrl from "/src/fonts/micro-5-regular.ttf";

import parchmentSpriteUrl from "./../assets/parchment.png";
import playerSpriteUrl from "/src/assets/player.png";



const BASE_W = 720;
const BASE_H = 1600;
const RESUME_URL = 'https://miguel-jimenez.super.site/';
const canvas = document.getElementById('mobile-game');

function sizeCanvasCss() {

    const vw = window.innerWidth;
    const vh = window.innerHeight;
  
    const scale = Math.min(vw / BASE_W, vh / BASE_H);
  
    canvas.style.width = `${BASE_W * scale}px`;
    canvas.style.height = `${BASE_H * scale}px`;
    canvas.style.left = "50%";
    canvas.style.top = "50%";
    canvas.style.transform = "translate(-50%, -50%)";
    canvas.style.position = "fixed";
  }

  window.addEventListener("resize", sizeCanvasCss);

// Load Kaplay
const k =  kaplay({
    global: false,
    touchToMouse: true, 
    canvas: document.getElementById("mobile-game"),
    height: 1600,
    width: 720,
    loadingScreen: true
});

// retrigger resize function after kaplay is loaded


const addMobileMenuPlayer = (menuObj, xPos, yPos) => {
    const playerScale = 4;
    const menuPlayer = menuObj.add([
        k.sprite('player'),
        k.pos(xPos, yPos),
        k.anchor('center'),
        k.scale(playerScale),
        k.body(),
        k.area(),
        'player',
    ])

    menuPlayer.play('idle-down');

    return menuPlayer;
}

// Load Fonts
k.loadFont("pixel-script", pixelScriptFontUrl);
k.loadFont("maru-minya", maruMinyaFontUrl);
k.loadFont("pixelify-sans", pixelifySansUrl);
k.loadFont("micro-5", micro5FontUrl);


// load sprites
k.loadSprite('menu-parchment', parchmentSpriteUrl);
k.loadSprite('player', playerSpriteUrl, {
    sliceX: 4,
    sliceY: 6,
    anims: {
        'idle-down': 0,
        'idle-up': 4,
        'idle-left': 8,
        'idle-right': 12,
        'attack-down': 16,
        'attack-up': 17,
        'attack-left': 18,
        'attack-right': 19,
        'hurt': 20,
        'down': {from: 0, to: 3, loop: true, speed: 8 },
        'up': {from: 4, to: 7, loop: true, speed: 8 },
        'left': {from: 8, to: 11, loop: true, speed: 8},
        'right': {from: 12, to: 15, loop: true, speed: 8},
        'hooray': 21,
        'yes': 22,
        'jutsu': 23,
        'dance': {from: 21, to: 23, loop: true, speed: 2 }
    }
})

// load sounds

k.setBackground(12, 12, 12);

k.scene('mobile-menu', () => {
    sizeCanvasCss();
    trackGameStage('mobile-menu');
    const menuTitleContainer = k.add([
        k.anchor('center'),
        k.pos(BASE_W / 2, BASE_H / 2 - 100),
        k.color(50, 169, 69),
        k.opacity(0),
        k.rect(10, 10),
    ])

    const parchment = menuTitleContainer.add([
        k.sprite('menu-parchment'),
        k.anchor('center'),
        k.scale(0.80),
        k.pos(0, -70),
        k.opacity(1)
    ])

    const scrollText = menuTitleContainer.add([
        k.text("すみません!", {
            size: 32,
            width: 480,
            align: 'center',
            font: "maru-minya",
        }),
        k.anchor('center'),
        k.pos(0, -70),
        k.color(5, 5, 5),
        k.opacity(1)
    ])

    const title = menuTitleContainer.add([
        k.text("MOBILE VERSION\n IN PROGRESS!",
            {
            size: 42, // 48 pixels tall
            width: 600,
            align: 'center', // it'll wrap to next line when width exceeds this value
            font: "pixelify-sans", // specify any font you loaded or browser built-in
            }
        ),
        k.anchor('center'),
        k.pos(0, 20),
        k.area(),
        k.color(20, 155, 96),
        'title'
    ])


    const subtitle = menuTitleContainer.add([
        k.anchor('center'),
        k.text("Please switch to desktop\n for the full experience",
            {
            size: 25,
            width: 480, // it'll wrap to next line when width exceeds this value
            font: "pixelify-sans",
            align: 'center' // specify any font you loaded or browser built-in
            }
        ),
        k.anchor('center'),
        k.color(200, 200, 200),
        k.pos(0, 130)
    ])


    const credits = menuTitleContainer.add([
        k.anchor('center'),
        k.text("2025 © BY MIGUEL JIMENEZ",
            {
            size: 20,
            width: 480, // it'll wrap to next line when width exceeds this value
            font: "micro-5",
            align: 'center' // specify any font you loaded or browser built-in
            }
        ),
        k.color(200, 200, 200),
        k.pos(0, 400)
    ])

    const menuPlayer = addMobileMenuPlayer(menuTitleContainer, 0, 220 )

    k.loop(1, ()=> {
        menuPlayer.play('hurt');
        k.wait(0.2, () => {
            menuPlayer.play('idle-down');
        })
    })


    const goToResumeContainer = k.add([
        k.rect(100, 100),
        k.anchor('center'),
        k.pos(BASE_W / 2, BASE_W / 2 * 2.75),
        k.color(60, 169, 69),
        k.opacity(0),
        k.body(),
        k.area(),
        'go-to-resume-container'
    ])

    goToResumeContainer.onClick(() => {
        window.location.assign(RESUME_URL);
    })

    const goToResumeText = goToResumeContainer.add([
        k.text("Tap To See Resume", {
            size: 30, 
            width: 300, 
            align: 'left',
            font: "pixelify-sans"
        }),
        k.color(248, 169, 69),
        k.pos(0, 0),
        k.area(),
        k.body(),
        k.anchor('center'),
    ])

    k.onClick(() => {
        window.location.assign(RESUME_URL);
    })

    k.onKeyPress('space', () => {
        k.setBackground(120, 120, 70);
    })

})

k.go('mobile-menu');