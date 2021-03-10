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
        //divBox.style.background = "grey";
        //divBox.style.background = 'hsl(0,0%,90%)';
        container.appendChild(divBox);
        console.log(divBox);
    }
    let divBoxes = document.querySelectorAll('.box');
    divBoxes.forEach(sq => sq.addEventListener('mouseover', addBoxColor));
}

//function rgbToHsl(rgbColor) {
//    return 'hsl(0,0%,10%)';
//}

function rgb2hsl(r, g, b) {
    // see https://en.wikipedia.org/wiki/HSL_and_HSV#Formal_derivation
    // convert r,g,b [0,255] range to [0,1]
    r = r / 255,
    g = g / 255,
    b = b / 255;
    // get the min and max of r,g,b
    var max = Math.max(r, g, b);
    var min = Math.min(r, g, b);
    // lightness is the average of the largest and smallest color components
    var lum = (max + min) / 2;
    var hue;
    var sat;
    if (max == min) { // no saturation
        hue = 0;
        sat = 0;
    } else {
        var c = max - min; // chroma
        // saturation is simply the chroma scaled to fill
        // the interval [0, 1] for every combination of hue and lightness
        sat = c / (1 - Math.abs(2 * lum - 1));
        switch(max) {
            case r:
                // hue = (g - b) / c;
                // hue = ((g - b) / c) % 6;
                // hue = (g - b) / c + (g < b ? 6 : 0);
                break;
            case g:
                hue = (b - r) / c + 2;
                break;
            case b:
                hue = (r - g) / c + 4;
                break;
        }
    }
    hue = Math.round(hue * 60); // °
    sat = Math.round(sat * 100); // %
    lum = Math.round(lum * 100); // %
    return [hue, sat, lum];
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

function darkenHSL(lightness, amt) {
    //100% is white, 0% is black
    console.log('old lightness: ' + lightness)
    lightness = lightness + amt;
    
    if (lightness < 0) {
        lightness = 0;
    } else if (lightness > 100) {
        lightness = 100;
    }

    console.log('new lightness: ' + lightness);
    return lightness;
}

function hsl2Text(color) {
    return 'hsl(' + color[0] + ',' + color[1] + '%,' + color[2] + '%)';
}

function changeTestButtonColor(e) {
    let color = e.target.style.background;
    if (color == '') {
        color = 'hsl(300,45%,88%)';
    }
    else {
        console.log('color: ' + color);
        let rgbAr = getRGB(color);
        console.log('RGB color: ' + rgbAr);
        color = rgb2hsl(rgbAr[0], rgbAr[1], rgbAr[2]);
        console.log('HSL color: ' + color); 
        color[2] = darkenHSL(color[2], -10);
        console.log('HSL color: ' + color);
        color = hsl2Text(color);
        console.log('hsl2Text: ' + color);
        //color = 'hsl(0,0%,10%)';
    }
    e.target.style.background = color;
}

function addBoxColor(e) {
    //let randomColor = Math.floor(Math.random()*16777215).toString(16);
    //let color = e.target.style.background;
    //if (color == 'white') {
    //    color = 'pink';
    //}
    //let darkerColor = lightenDarkenColor(color, -10);
    //e.target.style.background = '#' + darkerColor;
    //e.target.style.background = "#CCCCCC"; //"rgb(220,220,220)";
    let color = e.target.style.background;
    //let hexColor = rgb2hex(color);
    //let newColor = lightenDarkenColor(hexColor, -20);
    console.log('color: ' + color);
    //console.log('colorHex: ' + hexColor);
    //console.log('newColor: ' + newColor);
    //e.target.style.background = newColor;
}
/*
function rgb2hex(rgb) {
    rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    function hex(x) {
        return ("0" + parseInt(x).toString(16)).slice(-2);
    }
    return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}*/

const clearBtn = document.querySelector('#clearBtn');

function clearGrid() {
    let divBoxes = document.querySelectorAll('.box');
    divBoxes.forEach(sq => sq.style.background = 'white'); 

    let selection=0;
    do {
        selection = parseInt(window.prompt("Enter the number of squares you want", ""), 10);
    } while(isNaN(selection) || selection > 100 || selection < 1);

    drawGrid(selection);
}

clearBtn.addEventListener('click', clearGrid);

document.onload = drawGrid(16);

const testButton = document.querySelector('#testButton');
testButton.addEventListener('click', changeTestButtonColor);