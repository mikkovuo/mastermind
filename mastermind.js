/*
Color of the pieces are defined in the CSS file
To get them getComputedStyle needs to be used
*/
const colors = [ window.getComputedStyle(document.querySelector('#colorbox0')).getPropertyValue('background-color'),
    window.getComputedStyle(document.querySelector('#colorbox1')).getPropertyValue('background-color'),
    window.getComputedStyle(document.querySelector('#colorbox2')).getPropertyValue('background-color'),
    window.getComputedStyle(document.querySelector('#colorbox3')).getPropertyValue('background-color'),
    window.getComputedStyle(document.querySelector('#colorbox4')).getPropertyValue('background-color'),
    window.getComputedStyle(document.querySelector('#colorbox5')).getPropertyValue('background-color')];


//Putting radios in an array
const colorRadio = [document.querySelector('#color0'),document.querySelector('#color1'),
    document.querySelector('#color2'),document.querySelector('#color3'),
    document.querySelector('#color4'),document.querySelector('#color5')];


const main = document.querySelector('main');
const checkButton = document.querySelector('#checkButton');


function getSelectedColorNumber(){
    maxColor = colorRadio.length;
    for(let ii =0 ; ii < maxColor; ii++){
        if(colorRadio[ii].checked){
            return ii;
            break;
        }
    }
}



//You can adjust the difficulty in here
let maxGuesses = 6;
//We start at the beginning
let currentGuessNumber = 0;


//Setting the secret row
let secretRow = [];
randomizeSecretRow();

//Some color variables
let activeColor = 'darkgray';
let passiveColor = 'gray';

//The main object of the game
class GuessRow {
    constructor(idNumber){
        this.guessRow = document.createElement('div');
        this.guessRow.classList.add('guessBox');
        //Here go the guesses of the user
        this.colorBox = [];
        for(let ii=0; ii < 4; ii++){
            this.colorBox[ii] = document.createElement('div');
            this.colorBox[ii].classList.add('colorbox');
            this.colorBox[ii].rowNumber = idNumber;
            this.colorBox[ii].value=-1; // -1 indicates that piece on yet colored
            // Clicking the piece, alters it's color and value
            this.colorBox[ii].addEventListener('click',this.setBoxColor);
            //We put this inside the guessRow div
            this.guessRow.appendChild(this.colorBox[ii]);
        }

        //This is where we store the results, it's empty at first
        this.resultBox = document.createElement('div');
        this.resultBox.classList.add('resultBox');
        this.guessRow.appendChild(this.resultBox);

        main.appendChild(this.guessRow);
    }

    setBoxColor(){
        //If condition prevents altering previous or future rows
        if (this.rowNumber === currentGuessNumber){
            this.value = getSelectedColorNumber(); // Here we get color that the user has picked and set as the value
            this.style.backgroundColor = colors[this.value];
        }
    }

    checkResult(){
        //Clean the infoparagraph
        infoPara.textContent = "";

        //Check for unset pieces
        for(let ii=0; ii<4;ii++){
            // if any of the values is not set, inform the user and terminate the function
            if(this.colorBox[ii].value === -1){
                infoPara.textContent = 'Fill the row completely!';
                return
            }
        }
        let correct = 0;
        let remaining = [];
        let remainingSecret = [];
        let resultPiece;
        //First we check if the piece is the correct color and in the right place
        for(let ii = 0; ii < 4; ii++){
            if(this.colorBox[ii].value === secretRow[ii]){
                correct++;

                //Adding an black piece to the results
                resultPiece = document.createElement('div');
                resultPiece.classList.add('blackCircle');
                this.resultBox.appendChild(resultPiece);
            }
            else{
                //If the piece was not correct, we put in these arrays for later analysis
                remaining.push(this.colorBox[ii].value);
                remainingSecret.push(secretRow[ii]);
            }

        }
        //Next we check if the remaining pieces are of the correct color
        let index;
        for(let ii = 0; ii < remainingSecret.length; ii++){
            index = remaining.indexOf(remainingSecret[ii])
            if( index >= 0){
                remaining.splice(index ,index); // remove the found correctly colored piece

                //Adding a white piece to the results
                resultPiece = document.createElement('div');
                resultPiece.classList.add('whiteCircle');
                this.resultBox.appendChild(resultPiece);
            }
        }

        //Finally we check if the user has won, lost or is ready to give the next guess
        if(correct === 4){
            youWin();
        }
        else if (currentGuessNumber === maxGuesses-1){
            youLose(); 
        }
        else{
            nextRow();
        }
    }
    //Setting color of the active row
    setActive(){  
        this.guessRow.style.backgroundColor=activeColor;
    }
    //Setting color of the passive row
    setPassive(){  
        this.guessRow.style.backgroundColor=passiveColor;
    }
}


//Setting up rows where guesses are put in
let guessRows = [];
for(let ii = 0; ii < maxGuesses; ii++){
    guessRows.push(new GuessRow(ii));
}
guessRows[0].setActive(); //Setting the color of first row as active

//Setting up the paragraph for informing the user
let infoPara = document.createElement('p');
infoPara.style.textAlign = 'center';
main.appendChild(infoPara);


//Setting up the div for the secret row for the loser
let secretAnswer = document.createElement('div');
secretAnswer.style.textAlign = 'center';
main.appendChild(secretAnswer);


// odd way to do this, but ok?
checkButton.addEventListener('click',checkResultCaller);

function checkResultCaller(){
    guessRows[currentGuessNumber].checkResult();
}

function randomizeSecretRow(){
    secretRow = [];
    for(let ii = 0; ii < 4; ii++){
        secretRow.push(Math.floor(Math.random()*6));
    }
}

function youWin(){
    infoPara.textContent = 'You win!';
    currentGuessNumber = -1; //Disabling the altering of any guessRows
    checkButton.disabled = true; //Disabling the check functionality
}

function youLose(){
    infoPara.textContent = 'You Lose! Correct answer:';

    //Revealing the correct answer for the loser
    let secretPiece;
    for(let ii=0; ii < 4; ii++){
        secretPiece = document.createElement('div');
        secretPiece.classList.add('colorbox');
        secretPiece.style.backgroundColor = colors[secretRow[ii]];
        secretAnswer.appendChild(secretPiece);

    }
    currentGuessNumber = -1;//Disabling the altering of any guessRows
    checkButton.disabled = true; //Disabling the check functionality
}

function nextRow(){
    //Moving on to the next row and altering the rows color accordingly
    guessRows[currentGuessNumber].setPassive();
    currentGuessNumber++;
    guessRows[currentGuessNumber].setActive();
}