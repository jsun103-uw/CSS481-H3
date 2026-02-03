document.addEventListener("DOMContentLoaded", initializeDocument)

const numClass = "num"
const opClass = "op"
const clearClass = "clear"
const commandClass = "command"

const clearCMD = "CLEAR"
const submitCMD = "SUBMIT"


//simple 2-state state machine
const ParseState = {
    NUMBERSTART: 0, // number or negative -
                    // cannot be submitted in this form; means empty or last item is an operation

    NUMBEREND: 1,   // number or operation valid
                    // can be submitted
}

// regex for operation with decimals
const divReg = /(\d+(\.\d+)?)\/(\d+(\.\d+)?)/;
const multReg = /(\d+(\.\d+)?)×(\d+(\.\d+)?)/;
const addReg = /(\d+(\.\d+)?)\+(\d+(\.\d+)?)/;
const subReg = /(\d+(\.\d+)?)\-(\d+(\.\d+)?)/;

//combined into array for iterability
const RegexArr = [
    [divReg, function(n1, n2) { return parseFloat(n1) / parseFloat(n2); }],
    [multReg, function(n1, n2) { return parseFloat(n1) * parseFloat(n2); }],
    [addReg, function(n1, n2) { return parseFloat(n1) + parseFloat(n2); }],
    [subReg, function(n1, n2) { return parseFloat(n1) - parseFloat(n2); }],
]

//regex for key input
const opReg = /^\/|\+|-$/
const opRegMult = /^X|x|\*$/

//* variables for state machine and calculator operation
// input text display
let input;

// string of input
let operation;

// state machine
let parseState;


//setup listeners after content loaded
function initializeDocument() {
    input = document.getElementById("calc-input")

    document.addEventListener("keyup", keypressed);

    for (let button of document.getElementsByClassName("button-container")[0].children) {
        button.addEventListener("click", buttonpressed)
    }
    newExpression();
}

// converts key input into valdiated input
function keypressed(event) {
    let key = event.key;
    if (!isNaN(key)) numpressed(key, false);
    else if (key === "Enter") numpressed(submitCMD, true);
    else if (key === "Backspace") numpressed(clearCMD, true);
    else if (opReg.test(key)) numpressed(key, false);
    else if (opRegMult.test(key)) numpressed("×", false);
}

// converts button input into valdiated input
function buttonpressed(event) {
    event.target.blur()
    numpressed(event.target.value, event.target.classList.contains("command"));
}

// handles validated input
function numpressed(value, cmd) {
    console.log(value);
    // Submitting or clearing
    if (cmd) {
        switch (value) {
            case clearCMD:
                //clear everything
                operation = "";
                parseState = ParseState.NUMBERSTART;
                input.innerHTML = operation;
                break;
            case submitCMD:
                if (parseState != ParseState.NUMBEREND || input.innerHTML.length === 0) return;
                console.log(input.innerHTML);
                input.innerHTML = parseExpression(input.innerHTML);
                // reset operation 
                operation = "";
                parseState = ParseState.NUMBERSTART;
                break;
        }
    }
    // writing to display
    else {
        switch(parseState) {
            case ParseState.NUMBERSTART: //NUMBERSTART only accepts numeric values
                if (isNaN(value)) return; 
                parseState = ParseState.NUMBEREND;
                break;
            case ParseState.NUMBEREND: // NUMBEREND accepts any noncommand value (operation/number)
                if (isNaN(value)) parseState = ParseState.NUMBERSTART;
                break;
        }
        operation += value;
        input.innerHTML = operation;
    }
}

// clear input
function newExpression() {
    operation = "";
    parseState = ParseState.NUMBERSTART;
}


// calculate the input. The input should be sanitized due to input rules
function parseExpression(expression) {
    if (expression.length === 0) return 0;
    let regResult;
    for (let i = 0; i < RegexArr.length; i ++) {
        while ((regResult = RegexArr[i][0].exec(expression)) != null) {
            expression = expression.replace(regResult[0], RegexArr[i][1](regResult[1], regResult[3]));
        }
    }
    return parseFloat(expression);
}