const messageInput = document.getElementById("message");
const dateInput = document.getElementById("date");
const passwordInput = document.getElementById("password");

const dateSeedOutput = document.getElementById("dateSeed");
const passwordSeedOutput = document.getElementById("passwordSeed");
const finalSeedOutput = document.getElementById("finalSeed");
const multiplierOutput = document.getElementById("multiplier");

const resultOutput = document.getElementById("result");
const errorOutput = document.getElementById("messageError");

const encryptButton = document.getElementById("encryptButton");
const decryptButton = document.getElementById("decryptButton");
const copyButton = document.getElementById("copyButton");
const currentDateButton = document.getElementById("currentDate");

let currentFinalSeed = [];


// ===============================
// LETRAS E NÚMEROS
// ===============================

function letterToNumber(letter){

    return letter.charCodeAt(0) - 64;

}


function numberToLetter(number){

    return String.fromCharCode(number + 64);

}




// ===============================
// MULTIPLICADOR DA DATA
// ===============================

function getMultiplier(date){

    let numbers = date.split("/").map(Number);


    if(numbers.length < 2){

        return 1;

    }


    let day = numbers[0];
    let month = numbers[1];


    return (day + month) * 2 + 1;

}




// ===============================
// SEED DA DATA
// ===============================

function generateDateSeed(date){


    let numbers =
    date
    .replace(/\D/g,"")
    .split("")
    .map(Number);



    numbers =
    numbers.filter(
        n => n !== 0
    );



    if(numbers.length === 0){

        return "";

    }



    let multiplied = [];



    for(let i = 0; i < numbers.length; i++){


        let current = numbers[i];


        // multiplicação circular:
        // último número × primeiro número

        let next =
        numbers[
            (i + 1) % numbers.length
        ];



        multiplied.push(
            current * next
        );


    }



    let result = "";



    for(let i = 0; i < numbers.length; i++){


        result += numbers[i];

        result += multiplied[i];

    }



    return result;

}





// ===============================
// SEED DA SENHA
// ===============================

function generatePasswordSeed(password){


    password =
    password
    .toUpperCase()
    .replace(/[^A-Z]/g,"");



    let result = [];



    for(let char of password){


        result.push(
            letterToNumber(char)
        );


    }



    return result;

}





// ===============================
// SEED FINAL
// ===============================

function generateFinalSeed(dateSeed,passwordSeed){



    if(!dateSeed || !passwordSeed.length){

        return [];

    }



    let data =
    dateSeed
    .split("")
    .map(Number);



    let pass =
    passwordSeed;



    let size =
    Math.max(
        data.length,
        pass.length
    );



    let result = [];



    for(let i = 0; i < size; i++){



        let a =
        data[
            i % data.length
        ];



        let b =
        pass[
            i % pass.length
        ];



        result.push(
            a + b
        );


    }



    return result;

}





// ===============================
// ATUALIZAR SEEDS
// ===============================

function updateSeeds(){


    let dateSeed =
    generateDateSeed(
        dateInput.value
    );



    let passwordSeed =
    generatePasswordSeed(
        passwordInput.value
    );



    currentFinalSeed =
    generateFinalSeed(
        dateSeed,
        passwordSeed
    );



    dateSeedOutput.textContent =
    dateSeed || "-";



    passwordSeedOutput.textContent =
    passwordSeed.join("") || "-";



    finalSeedOutput.textContent =
    currentFinalSeed.join("") || "-";



    multiplierOutput.textContent =
    getMultiplier(
        dateInput.value
    );

}





// ===============================
// INPUTS
// ===============================

messageInput.addEventListener(
"input",
()=>{


    messageInput.value =
    messageInput.value
    .toUpperCase()
    .replace(/[^A-Z]/g,"");


});





passwordInput.addEventListener(
"input",
()=>{


    passwordInput.value =
    passwordInput.value
    .toUpperCase()
    .replace(/[^A-Z]/g,"");


    updateSeeds();

});





dateInput.addEventListener(
"input",
updateSeeds
);







// ===============================
// DATA ATUAL
// ===============================

currentDateButton.addEventListener(
"click",
()=>{


    let today =
    new Date();



    let day =
    String(today.getDate())
    .padStart(2,"0");



    let month =
    String(today.getMonth()+1)
    .padStart(2,"0");



    let year =
    today.getFullYear();



    dateInput.value =
    `${day}/${month}/${year}`;



    updateSeeds();


});






// ===============================
// CRIPTOGRAFAR
// ===============================

function encrypt(text,seed,multiplier){


    let state = 0;

    let output = "";



    for(let i = 0; i < text.length; i++){



        let original =
        letterToNumber(
            text[i]
        );



        let key =
        seed[
            i % seed.length
        ];



        state =
        (
            state * multiplier
            +
            key
        )
        % 26;



        let encrypted =
        original + state;



        while(encrypted > 26){

            encrypted -= 26;

        }



        output +=
        numberToLetter(
            encrypted
        );


    }



    return output;

}





// ===============================
// DESCRIPTOGRAFAR
// ===============================

function decrypt(text,seed,multiplier){


    let state = 0;

    let output = "";



    for(let i = 0; i < text.length; i++){



        let encrypted =
        letterToNumber(
            text[i]
        );



        let key =
        seed[
            i % seed.length
        ];



        state =
        (
            state * multiplier
            +
            key
        )
        % 26;



        let original =
        encrypted - state;



        while(original <= 0){

            original += 26;

        }



        output +=
        numberToLetter(
            original
        );


    }



    return output;

}





// ===============================
// BOTÕES
// ===============================

encryptButton.addEventListener(
"click",
()=>{


    if(
        messageInput.value === ""
        ||
        currentFinalSeed.length === 0
    ){

        errorOutput.textContent =
        "Insira uma mensagem e uma seed válida";


        return;

    }



    errorOutput.textContent = "";



    resultOutput.textContent =
    encrypt(
        messageInput.value,
        currentFinalSeed,
        getMultiplier(dateInput.value)
    );


});







decryptButton.addEventListener(
"click",
()=>{


    if(
        messageInput.value === ""
        ||
        currentFinalSeed.length === 0
    ){

        errorOutput.textContent =
        "Insira uma mensagem criptografada e uma seed válida";


        return;

    }



    errorOutput.textContent = "";



    resultOutput.textContent =
    decrypt(
        messageInput.value,
        currentFinalSeed,
        getMultiplier(dateInput.value)
    );


});






// ===============================
// COPIAR
// ===============================

copyButton.addEventListener(
"click",
()=>{


    navigator.clipboard.writeText(
        resultOutput.textContent
    );


});





updateSeeds();
