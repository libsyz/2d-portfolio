import kaplay from "kaplay";

export const k = kaplay({
    global: false,
    touchToMouse: true, 
    canvas: document.getElementById("game"),
    height: 688,
    width: 1270,
    loadingScreen: true
});



