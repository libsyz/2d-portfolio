
import kaplay from "kaplay";


import pixelScriptFontUrl from "/src/fonts/pixel-script.ttf";
import maruMinyaFontUrl from "/src/fonts/maru-minya.ttf";
import pixelifySansUrl from "/src/fonts/pixelify-sans.ttf";
import micro5FontUrl from "/src/fonts/micro-5-regular.ttf";


const BASE_W = 720;
const BASE_H = 1600;
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

  
const k = kaplay({
    global: false,
    touchToMouse: true, 
    canvas: document.getElementById("mobile-game"),
    height: 1600,
    width: 720,
    loadingScreen: true
});

k.wait(0.1, ()=> {
    sizeCanvasCss();
})

k.loadFont("pixel-script", pixelScriptFontUrl);
k.loadFont("maru-minya", maruMinyaFontUrl);
k.loadFont("pixelify-sans", pixelifySansUrl);
k.loadFont("micro-5", micro5FontUrl);

k.setBackground(0, 10, 129);

k.make([
    k.rect(100,200),
    k.pos(100, 100),
    k.color(255, 255, 255)
])

k.make([
    k.rect(100,20),
    k.pos(150, 150),
    k.color(0, 0, 0)
])

const menuOptionsComp = () => {
    const selectedColor = new k.Color(255, 255, 255);
    const unselectedColor = new k.Color(248, 169, 69);

    return {
        add() { 
            this.onStateEnter('selected', () => {
                this.color = selectedColor;
                k.play('dialog-select');
                addMenuPlayer(this, -150, -10);
            }) 
            this.onStateEnter('unselected', () => {
                this.color = unselectedColor;
                if (this.children.length > 0 ) {
                    this.children.forEach(el => el.destroy());
                }
            })
        }
    }
}

const menuTitleContainer = k.add([
    k.anchor('center'),
    k.pos(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 - 100),
    k.color(50, 169, 69),
    k.opacity(0),
    k.rect(10, 10),
])

const parchment = menuTitleContainer.add([
    k.sprite('menu-parchment'),
    k.anchor('center'),
    k.pos(0, -50),
    k.opacity(1)
])

const scrollText = menuTitleContainer.add([
    k.text("私を雇ってもらう", {
        size: 40,
        width: 480,
        align: 'center',
        font: "maru-minya",
    }),
    k.anchor('center'),
    k.pos(0, -50),
    k.color(5, 5, 5),
    k.opacity(1)
])

const title = menuTitleContainer.add([
    k.text("THE LOST NINJA SCROLLS",
        {
        size: 48, // 48 pixels tall
        width: 600,
        align: 'center', // it'll wrap to next line when width exceeds this value
        font: "pixelify-sans", // specify any font you loaded or browser built-in
        }
    ),
    k.anchor('center'),
    k.pos(0, 20),
    k.color(20, 155, 96)
])


const subtitle = menuTitleContainer.add([
    k.anchor('center'),
    k.text("An interactive CV adventure",
        {
        size: 32,
        width: 480, // it'll wrap to next line when width exceeds this value
        font: "pixel-script",
        align: 'center' // specify any font you loaded or browser built-in
        }
    ),
    k.anchor('center'),
    k.color(200, 200, 200),
    k.pos(0, 70)
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


const menuOptionsContainer = k.add([
    k.rect(10, 10),
    k.anchor('center'),
    k.pos(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 3 * 2),
    k.color(60, 169, 69),
    k.opacity(0),
    'menu-options-container'
])

const startGame = menuOptionsContainer.add([
    k.text("Start Game", {
        size: 30, 
        width: 200, 
        align: 'left',
        font: "pixelify-sans"
    }),
    k.color(248, 169, 69),
    'menu-option', 
    k.pos(0, 0),
    k.anchor('center'),
    k.state('selected', ['selected', 'unselected']),
    menuOptionsComp(),
])

const downloadResume = menuOptionsContainer.add([
    k.text("See Resume", {
        size: 30, 
        width: 200, 
        align: 'left',
        font: "pixelify-sans"
    }),
    k.color(248, 169, 69),
    'menu-option', 
    k.pos(0, 60),
    k.anchor('center'),
    k.state('unselected', ['selected', 'unselected']),
    menuOptionsComp(),
])
