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
// CONJUNTO DE 100 CARACTERES
// ===============================
// 26 maiúsculas + 26 minúsculas + 10 números + 18 símbolos + 19 acentuados/ç + 1 espaço = 100
const CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@$*!?-_/()[]{}ÁÀÃÂáàãâÕÓÔõóôÉÊéêÍíÚúç' ";
const MODULO = CHARSET.length; // 100

function charToNumber(char) {
    const index = CHARSET.indexOf(char);
    return index !== -1 ? index : 0;
}

function numberToChar(number) {
    let index = number % MODULO;
    if (index < 0) index += MODULO;
    return CHARSET[index];
}

// ===============================
// OBTER DATA ATUAL FORMATADA
// ===============================
function getFormattedToday() {
    let today = new Date();
    let day = String(today.getDate()).padStart(2, "0");
    let month = String(today.getMonth() + 1).padStart(2, "0");
    let year = today.getFullYear();
    return `${day}/${month}/${year}`;
}

// ===============================
// NOVO MULTIPLICADOR (DATA + SENHA EM BINÁRIO)
// ===============================
function getMultiplier(date, password) {
    // 1. Extrai dia e mês da data
    let numbers = date.split("/").map(Number);
    let day = (numbers.length >= 1 && !isNaN(numbers[0])) ? numbers[0] : 0;
    let month = (numbers.length >= 2 && !isNaN(numbers[1])) ? numbers[1] : 0;
    let dateSum = day + month;

    // 2. Tamanho da senha e conversão para binário
    let passLength = password.length;
    
    if (passLength === 0) {
        return (dateSum * 2) + 1 || 1;
    }

    let binaryStr = passLength.toString(2);          // Ex: 9 -> "1001"
    let totalDigits = binaryStr.length;              // Ex: 4 algarismos
    let countOnes = binaryStr.split("1").length - 1;  // Ex: 2 uns (1001)

    let binaryFactor = totalDigits * countOnes;      // Ex: 4 * 2 = 8

    // 3. Aplica a fórmula: ((SomaData + FatorBinario) * 2) + 1
    let combinedSum = dateSum + binaryFactor;
    return (combinedSum * 2) + 1;
}

// ===============================
// SEED DA DATA
// ===============================
function generateDateSeed(date) {
    let numbers = date
        .replace(/\D/g, "")
        .split("")
        .map(Number)
        .filter(n => n !== 0);

    if (numbers.length === 0) return "";

    let multiplied = [];
    for (let i = 0; i < numbers.length; i++) {
        let current = numbers[i];
        let next = numbers[(i + 1) % numbers.length];
        multiplied.push(current * next);
    }

    let result = "";
    for (let i = 0; i < numbers.length; i++) {
        result += numbers[i];
        result += multiplied[i];
    }

    return result;
}

// ===============================
// SEED DA SENHA
// ===============================
function generatePasswordSeed(password) {
    let result = [];
    for (let char of password) {
        if (CHARSET.includes(char)) {
            result.push(charToNumber(char) + 1);
        }
    }
    return result;
}

// ===============================
// SEED FINAL
// ===============================
function generateFinalSeed(dateSeed, passwordSeed) {
    if (!dateSeed || !passwordSeed.length) return [];

    let data = dateSeed.split("").map(Number);
    let pass = passwordSeed;

    let size = Math.max(data.length, pass.length);
    let result = [];

    for (let i = 0; i < size; i++) {
        let a = data[i % data.length];
        let b = pass[i % pass.length];
        result.push(a + b);
    }

    return result;
}

// ===============================
// ATUALIZAR SEEDS
// ===============================
function updateSeeds() {
    let dateSeed = generateDateSeed(dateInput.value);
    let passwordSeed = generatePasswordSeed(passwordInput.value);

    currentFinalSeed = generateFinalSeed(dateSeed, passwordSeed);

    dateSeedOutput.textContent = dateSeed || "-";
    passwordSeedOutput.textContent = passwordSeed.join("") || "-";
    finalSeedOutput.textContent = currentFinalSeed.join("") || "-";
    multiplierOutput.textContent = getMultiplier(dateInput.value, passwordInput.value);
}

// ===============================
// INPUTS & MÁSCARAS
// ===============================
function filterAllowedChars(str) {
    return str.split("").filter(c => CHARSET.includes(c)).join("");
}

function formatDateInput(value) {
    let digits = value.replace(/\D/g, "");

    if (digits.length > 8) {
        digits = digits.slice(0, 8);
    }

    if (digits.length > 4) {
        return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
    } else if (digits.length > 2) {
        return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    }

    return digits;
}

messageInput.addEventListener("input", () => {
    messageInput.value = filterAllowedChars(messageInput.value);
});

passwordInput.addEventListener("input", () => {
    passwordInput.value = filterAllowedChars(passwordInput.value);
    updateSeeds();
});

dateInput.addEventListener("input", () => {
    dateInput.value = formatDateInput(dateInput.value);
    updateSeeds();
});

// ===============================
// DATA ATUAL (BOTÃO)
// ===============================
currentDateButton.addEventListener("click", () => {
    dateInput.value = getFormattedToday();
    updateSeeds();
});

// ===============================
// CRIPTOGRAFAR
// ===============================
function encrypt(text, seed, multiplier) {
    let state = 0;
    let output = "";

    for (let i = 0; i < text.length; i++) {
        let original = charToNumber(text[i]);
        let key = seed[i % seed.length];

        state = (state * multiplier + key) % MODULO;

        let encrypted = (original + state) % MODULO;
        output += numberToChar(encrypted);
    }

    return output;
}

// ===============================
// DESCRIPTOGRAFAR
// ===============================
function decrypt(text, seed, multiplier) {
    let state = 0;
    let output = "";

    for (let i = 0; i < text.length; i++) {
        let encrypted = charToNumber(text[i]);
        let key = seed[i % seed.length];

        state = (state * multiplier + key) % MODULO;

        let original = (encrypted - state) % MODULO;
        if (original < 0) original += MODULO;

        output += numberToChar(original);
    }

    return output;
}

// ===============================
// BOTÕES
// ===============================
encryptButton.addEventListener("click", () => {
    if (messageInput.value === "" || currentFinalSeed.length === 0) {
        errorOutput.textContent = "Insira uma mensagem e uma seed válida";
        return;
    }

    errorOutput.textContent = "";
    resultOutput.textContent = encrypt(
        messageInput.value,
        currentFinalSeed,
        getMultiplier(dateInput.value, passwordInput.value)
    );
});

decryptButton.addEventListener("click", () => {
    if (messageInput.value === "" || currentFinalSeed.length === 0) {
        errorOutput.textContent = "Insira uma mensagem criptografada e uma seed válida";
        return;
    }

    errorOutput.textContent = "";
    resultOutput.textContent = decrypt(
        messageInput.value,
        currentFinalSeed,
        getMultiplier(dateInput.value, passwordInput.value)
    );
});

// ===============================
// COPIAR
// ===============================
copyButton.addEventListener("click", () => {
    navigator.clipboard.writeText(resultOutput.textContent);
});

// Definir data de hoje no carregamento da página
dateInput.value = getFormattedToday();
updateSeeds();


const seedContent = document.getElementById("seedContent");
const toggleSeedIcon = document.getElementById("toggleSeedIcon");

// Alterna o ícone quando a área expande
seedContent.addEventListener("show.bs.collapse", () => {
    toggleSeedIcon.classList.remove("bi-arrow-down");
    toggleSeedIcon.classList.add("bi-arrow-up");
});

// Alterna o ícone quando a área recolhe
seedContent.addEventListener("hide.bs.collapse", () => {
    toggleSeedIcon.classList.remove("bi-arrow-up");
    toggleSeedIcon.classList.add("bi-arrow-down");
});
