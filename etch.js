const container = document.querySelector("#container");

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function drawGrid(gridLen) {
    console.log('drawGrid');
    removeAllChildNodes(container);
    container.style.gridTemplateColumns = 'repeat(' + gridLen + ', ' + (960/gridLen) + 'px)';
    
    let boxSide = 960/gridLen;

    for(i=0; i<gridLen*gridLen; i++) {
        const divBox = document.createElement('div');
        divBox.classList.add("box");
        divBox.style.width = boxSide + 'px';
        divBox.style.height = boxSide + 'px';
        container.appendChild(divBox);
        console.log(divBox);
    }
    let divBoxes = document.querySelectorAll('.box');
    divBoxes.forEach(sq => sq.addEventListener('mouseover', addBoxColor));
}

//Found this
function rgb2hsl (r, g, b) {
    var max, min, h, s, l, d;
    r /= 255;
    g /= 255;
    b /= 255;
    max = Math.max(r, g, b);
    min = Math.min(r, g, b);
    l = (max + min) / 2;
    if (max == min) {
        h = s = 0;
    } else {
        d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break
            case g:
                h = (b - r) / d + 2;
                break
            case b:
                h = (r - g) / d + 4;
                break
        }
        h /= 6;
    }
    h = Math.floor(h * 360);
    s = Math.floor(s * 100);
    l = Math.floor(l * 100);
    return [ h, s, l];
}

function removeSpaces(s) {
    while (s.indexOf(' ') >= 0) {
        s = s.replace(" ", "");
    }
    return s;
}

function getRGB(color) {
    let ar = color.replace("'", "");
    ar = ar.substring(4);
    ar = ar.substring(0,ar.indexOf(')'));
    ar = removeSpaces(ar);
    console.log("ar: " + ar);
    ar = ar.replace("(","");
    ar = ar.replace(")","");
    arj = ar.split(",");
    return arj;
}

function lightenDarkenHSL(lightness, amt) {
    //100% is white, 0% is black
    lightness = lightness + amt;
    
    if (lightness < 0) {
        lightness = 0;
    } else if (lightness > 100) {
        lightness = 100;
    }

    return lightness;
}

function hsl2Text(color) {
    return 'hsl(' + color[0] + ',' + color[1] + '%,' + color[2] + '%)';
}

//Found this
function randomColor() {
    return Math.floor(Math.random()*16777215).toString(16);
}

function addBoxColor(e) {
    let color = e.target.style.background;
    if (color == '') {
        if (useRandomColor) {
            color = "#" + randomColor();
        } else {
            color = initialColor;
        }
    } else {
        //darken color
        let rgbAr = getRGB(color);
        color = rgb2hsl(rgbAr[0], rgbAr[1], rgbAr[2]);
        color[2] = lightenDarkenHSL(color[2], -10);
        color = hsl2Text(color);
    }
    e.target.style.background = color;
}

const clearBtn = document.querySelector('#clearBtn');

function clearGrid() {
    let divBoxes = document.querySelectorAll('.box');
    divBoxes.forEach(sq => sq.style.background = 'white'); 

    let selection=0;
    do {
        selection = parseInt(window.prompt("Enter the number of squares you want", ""), 10);
    } while(isNaN(selection) || selection > 100 || selection < 1);

    setRandomChoices();
    drawGrid(selection);
}

clearBtn.addEventListener('click', clearGrid);

function chooseRandom() {
    let rand = Math.floor(Math.random() * 5) + 1;
    switch(rand) {
        case 1:
            //light yellow
            initialColor = 'rgb(255,255,102)';
            useRandomColor = false;
            break;
        case 2:
            //light pink
            initialColor = 'rgb(222,93,131)';
            useRandomColor = false;
            break;
        case 3:
            //light green
            initialColor = 'rgb(152,251,152)';
            useRandomColor = false;
            break;
        case 4:
            //light blue
            initialColor = 'rgb(240,248,255)';
            useRandomColor = false;
            break;
        case 5:
            //random
            useRandomColor = true;
            initialColor = '';
        default:
    }
}

function setRandomChoices(initialCall) {
    if (initialCall) {
        chooseRandom();
    } else {
        let oldUseRandomColor = useRandomColor;
        let oldInitialColor = initialColor;
        do {
            chooseRandom();
        } while ((oldInitialColor == initialColor) && (oldUseRandomColor == useRandomColor))
    }
}

function loadForm() {
    setRandomChoices(true);
    drawGrid(16);
}

let initialColor = '';
let useRandomColor = false;

document.onload = loadForm();