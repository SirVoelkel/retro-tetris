// --> Retro Tetris Game <--
//  _____________________
// |                      |
// |                      |
// |                      |
// |        _____         |
// |       |    |         |
// |       |____|         |
// |                      |
// |                      |
// |                      |
// |___                   |
// |  |__                 |
// |___  |            ____|
// |  |__|_________  |    |
// |______|_______|__|____|

// Definieren der Größe jedes Rasterraums
const gridSpace = 30;

// Deklarieren der Variablen
let fallingPiece;
let gridPieces = [];
let lineFades = [];
let gridWorkers = [];

let currentScore = 0;
let currentLevel = 1;
let linesCleared = 0;

let ticks = 0;
let updateEvery = 15;
let updateEveryCurrent = 15;
let fallSpeed = gridSpace * 0.5;
let pauseGame = false;
let gameOver = false;

// Definieren der Ränder des Spielbereichs
const gameEdgeLeft = 150;
const gameEdgeRight = 450;

//  Definieren Sie die Farben für die Figuren

const colors = [
    "#073763",
    "#ce7e00",
    "#0c343d",
    "#6a329f",
    "#6f3d9e",
    "#660000",
    "#134f5c",
];

// Die Setup-Funktion wird zu Beginn einmal aufgerufen
function setup(){
    createCanvas(600, 540);

    // Erstellen einer neuen fallenden Figur
    fallingPiece = new PlayPiece();
    fallingPiece.resetPiece();

    // Festlegen der Schriftart für den Text
    textFont('Roboto');
}





//=========== Wiederholter Aufruf der Zeichnen-Funktion ===========
function draw() {
    // Definieren der Farben im Spiel
    const colorDark = '#0d0d0d';
    const colorLight = '#304550';
    const colorBackground = '#e1eeb0';

    // Hintergrundfarbe setzen
    background(colorBackground);

    // Zeichnen des Infofeldes auf der rechten Seite
    fill(25);
    noStroke();
    rect(gameEdgeRight, 0, 150, height);
    
    // Zeichnen des Infofeldes auf der linken Seite
    rect(0, 0, gameEdgeLeft, height);

    // Zeichnen des Punktzahlrechtecks
    fill(colorBackground);
    rect(450, 80, 150, 70);

    // Zeichnen eines neuen Rechteckts
    rect(460, 405, 130, 130, 5, 5);
    
    // Zeichnen des Level Rechteckts
    rect(460, 210, 130, 60, 5, 5);

    // Zeichnen des Lines Rechteckts
    rect(460, 280, 130, 60, 5, 5);
    
    // Zeichnen der Punkte Linien
    fill(colorLight);
    rect(450, 85, 150, 20)
    rect(450, 110, 150, 4)
    rect(450, 140, 150, 4)
    
    // Zeichnen der Punktetafel
    fill(colorBackground);
    rect(460, 60, 130, 35, 5, 5);
    
    // Zeichnen des Rechtecks in der Punktetafel
    strokeWeight(3);
    noFill();
    stroke(colorLight);
    rect(465, 65, 120, 25, 5, 5);
    
    // Zeichnen eines neuen Rechteckts
    stroke(colorLight);
    rect(465, 410, 120, 120, 5, 5);
    
    // Zeichnen der Linien innerhalb des Rechtecks
    rect(465, 215, 120, 50, 5, 5);
    
    // Zeichnen der Linien innerhalb des Rechtecks
    rect(465, 285, 120, 50, 5, 5);
    
    // Zeichnen der Info's 
    fill(25);
    noStroke();
    textSize(24);
    textAlign(CENTER);
    text("Score", 525, 85);
    text("Level", 525, 238);
    text("Lines", 525, 308);

    // Zeichnen der aktuellen Info's
    textSize(24);
    textAlign(RIGHT);
    text(currentScore, 560, 135);
    text(currentLevel, 560, 260); 
    text(linesCleared, 560, 330);

    // Zeinen des Spielrands
    stroke(colorDark);
    line(gameEdgeRight, 0, gameEdgeRight, height);

    // Zeichnen der fallenden Figur 
    fallingPiece.show();

    // Geschwindigkeit der Figuren erhöhen
    if (keyIsDown (DOWN_ARROW) ) {
        updateEvery = 2;
    }
    else{
        updateEvery = updateEveryCurrent;
    }
    
    // Aktualisieren des Spielstatus
    if (!pauseGame) {
        ticks++;
        if (ticks >= updateEvery) {
            ticks = 0;
            fallingPiece.fall(fallSpeed);
        }
    }

    // Anzeigen der Figuren
    for (let i = 0; i < gridPieces.length; i++) {
        gridPieces[i].show();
    }

    // Anzeigen der geschafften Reihen
    for (let i = 0; i < lineFades.length; i++) {
        lineFades.show();
    }

    //  Verarbeiten der "gridWorkers"
    if (gridWorkers.length > 0) {
        gridWorkers[0].work();
    }

    // Erklärung der Steuerung
    textAlign(CENTER);
    fill(255);
    noStroke();
    textSize(14);
    text("Controls:\n↑\n ← ↓ →\n", 75, 155);
    text("Left and Right: \nmove side to side", 75, 230);
    text("Up:\nrotate",75, 280);
    text("Down:\nfall faster", 75, 330);
    text("R:\nreset game", 75, 380);  

    // "Game Over" Text Anzeigen
    if (gameOver) {
        fill(colorDark);
        textSize(54);
        textAlign(CENTER);
        text("Game Over!", 300, 270);
    }

    // Zeichnen des Spielrandes
    strokeWeight(3);
    stroke('#304550');
    noFill();
    rect(0, 0, width, height);
}

// Diese Funktion wird aufgrufen, beim drücken einer Taste
function keyPressed() {
    if (keyCode === 82) {
        // 'R' key
        resetGame();
    }
    if (!pauseGame) {
        if (keyCode === LEFT_ARROW) {
            fallingPiece.input(LEFT_ARROW);
        }
        else if (keyCode === RIGHT_ARROW){
            fallingPiece.input(RIGHT_ARROW);
        }
        if (keyCode === UP_ARROW) {
            fallingPiece.input(UP_ARROW);
        }
    }
}
//=============  Ende der Zeichnen-Funktion  =============





//=========== Klasse zum erstelllen der Figuren ===========
class PlayPiece{
    constructor(){
        this.pos = createVector(0, 0);
        this.rotation = 0;
        this.nextPieceType = Math.floor(Math.random() * 7);
        this.nextPieces = [];
        this.pieceType = 0;
        this.pieces = [];
        this.orientation = [];
        this.fallen = false;
    }

    // Generieren der nächsten Figur
    nextPiece(){
        this.nextPieceType = pseudoRandom(this.pieceType);
        this.nextPieces = [];

        const points = orientPoints(this.nextPieceType, 0);
        let xx = 525;
        let yy = 490;

        if (this.nextPieceType !== 0 && this.nextPieceType !== 3 && this.nextPieceType !== 5){
            xx += (gridSpace * 0.5);
        }
        
        if (this.nextPieceType == 5) {
            xx -= (gridSpace * 0.5); 
        }

        for (let i = 0; i < 4; i++) {
            this.nextPieces.push(new Square(xx + points[i][0] * gridSpace, yy + points[i][1] * gridSpace, this.nextPieceType));
        }
    }

    // Fallen der Figur
    fall(amount){
        if (!this.futureCollision(0, amount, this.rotation)) {
            this.addPos(0, amount);
            this.fallen = true;
        }
        else{
            if (!this.fallen) {
                pauseGame = true;
                gameOver = true;
            }
            else{
                this.commitShape();
            }
        }
    }

    // Figur zurück setzen
    resetPiece(){
        this.rotation = 0;
        this.fallen = false;
        this.pos.x = 330;
        this.pos.y = -60;

        this.pieceType = this.nextPieceType;


        this.nextPiece();   
        this.newPoints();
    }

    // Generieren der Punkte
    newPoints(){
        const points = orientPoints(this.pieceType, this.rotation);
        this.orientation = points;
        this.pieces = [];

        for (let i = 0; i < points.length; i++) {
            this.pieces.push(new Square(this.pos.x + points[i][0] * gridSpace, this.pos.y + points[i][1] * gridSpace, this.pieceType));
        }
    }

    // Position der Figur aktuellisieren
    updatePoints(){
        if (this.pieces) {
            const points = orientPoints(this.pieceType, this.rotation);
            this.orientation = points;
            for (let i = 0; i < 4; i++) {
                this.pieces[i].pos.x = this.pos.x + points[i][0] * gridSpace;
                this.pieces[i].pos.y = this.pos.y + points[i][1] * gridSpace;
            }
        }
    }
    
    // versetzen der aktuellen Figur
    addPos(x, y){
        this.pos.x += x;
        this.pos.y += y;

        if (this.pieces) {
            for (let i = 0; i < 4; i++) {
                this.pieces[i].pos.x += x;
                this.pieces[i].pos.y += y;
            }
        }
    }

    // Nach Kollision prüfen
    futureCollision(x, y, rotation){
        let xx, yy, points = 0;
        if (rotation !== this.rotation) {
            points = orientPoints(this.pieceType, rotation);
        }

        for(let i = 0; i < this.pieces.length; i++){
            if (points) {
                xx = this.pos.x + points[i][0] * gridSpace;
                yy = this.pos.y + points[i][1] * gridSpace;        
            }
            else{
                xx = this.pieces[i].pos.x + x;
                yy = this.pieces[i].pos.y + y;
            }
            if (xx < gameEdgeLeft || xx + gridSpace > gameEdgeRight || yy + gridSpace > height) {
                return true;
            }
            for (let j = 0; j < gridPieces.length; j++) {
                if (xx === gridPieces[j].pos.x) {
                    if (yy >= gridPieces[j].pos.y && yy < gridPieces[j].pos.y + gridSpace) {
                        return true;
                    }
                    if (yy + gridSpace > gridPieces[j].pos.y && yy + gridSpace <= gridPieces[j].pos.y + gridSpace) {
                        return true;
                    }
                } 
            }
        }
    }

    // Behandeln von Benutzereingaben
    input(key){
        switch (key) {
            case LEFT_ARROW:
                if (!this.futureCollision(-gridSpace, 0, this.rotation)) {
                    this.addPos(-gridSpace, 0);
                }
                break;
            case RIGHT_ARROW:
                if (!this.futureCollision(gridSpace, 0, this.rotation)) {
                    this.addPos(gridSpace, 0);
                }
                break;
            case UP_ARROW:
                let newRotation = this.rotation + 1;
                if (newRotation > 3) {
                    newRotation = 0;
                }
                if (!this.futureCollision(0, 0, newRotation)) {
                    this.rotation = newRotation;
                    this.updatePoints();
                }
                break;

        }
    }

    // Drehen der Figur
    rotate(){
        this.rotation += 1;
        if (this.rotation > 3) {
            this.rotation = 0;
        }
        this.updatePoints();
    }

    // Zeigt die aktuelle Figur
    show(){
        for (let i = 0; i < this.pieces.length; i++) {
            this.pieces[i].show();  
        }
        for (let i = 0; i < this.nextPieces.length; i++) {
            this.nextPieces[i].show();  
        }
    }

    // übernehemen der aktuellen Form
    commitShape(){
        for (let i = 0; i < this.pieces.length; i++) {
            gridPieces.push(this.pieces[i]);
        }
        this.resetPiece();
        analyzeGrid();
    }
}

//================ ENDE DER KLASSE =================





//============ Klasse für die Quadranten ============
class Square{
    constructor(x, y, type){
        this.pos = createVector(x, y);
        this.type = type;
    }

    // Quadrat anzeigen
    show(){
        strokeWeight(2);
        const colorDark = '#092e1d';
        const colorMid = colors[this.type];

        fill(colorMid);
        stroke(25);
        rect(this.pos.x, this.pos.y, gridSpace - 1, gridSpace - 1);

        noStroke();
        fill(255);
        rect(this.pos.x + 6, this.pos.y + 6, 18, 2);
        rect(this.pos.x + 6, this.pos.y + 6, 2, 16);
        fill(25);
        rect(this.pos.x + 6, this.pos.y + 20, 18, 2);
        rect(this.pos.x + 22, this.pos.y + 6, 2, 16);
    }       
}

// Generieren einer zufälligen Zahl für die Figuren
function pseudoRandom(previous){
    let roll = Math.floor(Math.random() * 8);
    if (roll === previous || roll === 7) {
        roll = Math.floor(Math.random() * 7);
    }
    return roll;
}

// Raster analyzieren und ggf. Linien löschen
function analyzeGrid(){
    let score = 0;
    while (checkLines()) {
        score += 100;
        linesCleared += 1;
        if (linesCleared % 10 === 0) {
            currentLevel += 1;
            if (updateEveryCurrent > 2) {
                updateEveryCurrent -= 1;
            }
        }
    }
    if (score > 100) {
        score *= 2;
    }
    currentScore += score;r
}

// Überprüfen des Rasters nach vorhandenen Linien
function checkLines(){
    for(let y = 0; y < height; y += gridSpace){
        let count = 0;
        for(let i = 0; i < gridPieces.length; i++){
            if(gridPieces[i].pos.y === y){
                count ++;
            }        
        }
        if (count === 10) {
            // Entfernen der Teile an der Y-Achse
            gridPieces = gridPieces.filter(piece => piece.pos.y !== y);
            // Bewegwn der Figuren nach unten
            for (let i = 0; i < gridPieces.length; i++){
                if (gridPieces[i].pos.y < y){
                    gridPieces[i].pos.y += gridSpace;
                }
            }
            return true;
        }
    }
    return false;
}

// Klasse für das Arbeitsraster
class Worker{
    constructor(y, amount){
        this.amountActual = 0;
        this.amountTotal = amount;
        this.yVal = y;
    }

    // Arbeiten am Raster
    work(){
        if (this.amountActual < this.amountTotal) {
            for (let j = 0; j < gridPieces.length; j++) {
                if (gridPieces[j].pos.y < y) {
                    gridPieces[j].pos.y += 5;
                }
            }

            this.amountActual += 5;
        }
        else{
            gridWorkers.shift();
        }
    }
}

// Zurück setzen des Spiels
function resetGame() {
    fallingPiece = new PlayPiece();
    fallingPiece.resetPiece();
    gridPieces = [];
    lineFades = [];
    gridWorkers = [];
    currentScore = 0;
    currentLevel = 1;
    linesCleared = 0;
    ticks = 0;
    updateEvery = 15;
    updateEveryCurrent = 15;
    fallSpeed = gridSpace * 0.5;
    pauseGame = false;
    gameOver = false;
}






