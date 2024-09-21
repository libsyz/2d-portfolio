import kaplay from "kaplay";

export const k = kaplay({
    global: false,
    touchToMouse: true, 
    canvas: document.getElementById("game"),
    height: 704,
    width: 1280
});



