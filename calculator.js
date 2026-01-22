document.addEventListener("DOMContentLoaded", initializeDocument)

const numClass = "num"
const opClass = "op"
const cearClass = "clear"
const commandClass = "command"

let input;

function initializeDocument() {
    console.log("brusdfsdfh");
    input = document.getElementById("calc-input")


    for (let button of document.getElementsByClassName("button-container")[0].children) {
        console.log(button.value);
        button.addEventListener("click", numpressed)
        
    }
}

function numpressed(event) {
    console.log(event.target.value);
    if (event.target.classList.contains("command")) {
        console.log("CMD!");

    }
    else {
        input.innerHTML += event.target.value;
    }

}