"use strict";
const textIn = document.querySelector("#input-text--original");
const textOut = document.querySelector(".output__text");
const mirror = document.querySelector("#input-text--mirror");
const boxFound = document.querySelector(".box--found");
const boxNotFound = document.querySelector(".box--not-found");
const testString = "¿hasTa qué HORas";
const invalid = new RegExp(/[^a-z|\s]/);
const uppercases = new RegExp(/[a-z| ]/);
const canTranslate = true;
const errorsContainer = document.querySelector(".input__info");
let invalidInput = false;
const INPUT_STATE = {
  VALID: false,
  EMPTY: true,
};
const btnEncrypt = document.querySelector("#encrypt");
const btnDecrypt = document.querySelector("#decrypt");
const btnCopy = document.querySelector("#copy");

const dictionary = {
  toEncrypt: {
    a: "ai",
    e: "enter",
    i: "imes",
    o: "ober",
    u: "ufat",
  },
  toDecrypt: {}, // To be generated dinamically
};

const charTypes = {
  specialChars: {
    isValid: false,
    pattern: "À-Üà-ü",
  },
  uppercases: {
    isValid: false,
    pattern: "A-Z",
  },
  lowercases: {
    isValid: true,
    pattern: "a-z",
  },
  numbers: {
    isValid: false,
    pattern: "0-9",
  },
  linebreaks: {
    isValid: true,
    pattern: "\r|\r\n|\n",
  },
};

function keysOf(dictionary) {
  return Object.keys(dictionary);
}

function concatPatternsIfValidIs(boolean) {
  const types = keysOf(charTypes);
  const filtered = types.reduce((result, type) => {
    if (charTypes[type].isValid === boolean) {
      result.push(charTypes[type].pattern);
    }
    return result;
  }, []);
  const pattern = filtered.join("|");
  return pattern;
}

function generateValidationPattern() {
  const allowSpecialChars = charTypes.specialChars.isValid;
  let content = "";
  if (allowSpecialChars) {
    content += charTypes.specialChars.regExp;
    content += concatPatternsIfValidIs(false);
  } else {
    content += concatPatternsIfValidIs(true);
    content += " "; // For empty spaces
  }
  validationStrings.valid = `[${content}]`;
}

function invertDictionary(dictionary) {
  const newDictionary = keysOf(dictionary).reduce((result, key) => {
    const value = dictionary[key];
    result[value] = key;
    return result;
  }, {});
  return newDictionary;
}

function setTextOut(newText) {
  textOut.textContent = newText;
}

function translateText(original, dictionary) {
  let pattern = keysOf(dictionary).join("|");
  const regExp = new RegExp(pattern, "g");
  const translation = original.replace(regExp, (match) => dictionary[match]);
  return translation;
}

// TODO: replace string with text.cipher
function validateInput(string, className) {
  let anyInvalidChar = false;

  // Generate innerHTML for mirror
  const patternLinebreaks = charTypes.linebreaks.pattern;
  const pattern = getPatternIfValidIs(false) + patternLinebreaks;
  const regExp = new RegExp(pattern, "g");
  const mirrorContent = string.replace(regExp, (match) => {
    if (patternLinebreaks.test(match)) {
      return "<br />";
    } else {
      anyInvalidChar = true;
      return `<span class=${className}>${match}</span>`;
    }
  });
  // Update mirror
  mirror.innerHTML = mirrorContent;

  return anyInvalidChar;
}

btnDecrypt.addEventListener("click", () => {
  const cipher = textIn.value;
  if (!cipher && !invalidInput) {
    boxNotFound.classList.remove("hidden");
    boxFound.classList.add("hidden");
    return;
  }
  const plain = translateText(cipher, dictionary.toDecrypt);
  boxNotFound.classList.add("hidden");
  boxFound.classList.remove("hidden");
  setTextOut(plain);
});

btnCopy.addEventListener("click", () => {
  const copy = textOut.textContent;
  console.log("copying");
  navigator.clipboard.writeText(copy);
});

btnEncrypt.addEventListener("click", (e) => {
  const plain = textIn.value;
  if (!plain && !invalidInput) {
    boxNotFound.classList.remove("hidden");
    boxFound.classList.add("hidden");
    return;
  }
  const cipher = translateText(plain, dictionary.toEncrypt);
  boxNotFound.classList.add("hidden");
  boxFound.classList.remove("hidden");
  textOut.textContent = cipher;
});

function init() {
  textIn.value = "";
  dictionary.toDecrypt = invertDictionary(dictionary.toEncrypt);
}

textIn.addEventListener("input", (e) => {
  const plain = textIn.value;
  const invalidNewInput = validateInput(plain, "invalid");
  if (invalidNewInput !== invalidInput) {
    errorsContainer.classList.toggle("with-errors");
    invalidInput = invalidNewInput;
  }
  const container = document.querySelector(".input-text__container");
  const offset = mirror.offsetHeight - mirror.clientHeight;
  textIn.style.height = "auto";
  const newHeight = e.target.scrollHeight + offset + "px";
  textIn.style.height = newHeight;
  const minHeight = 250;
  if (parseFloat(newHeight) >= minHeight) {
    container.style.height = newHeight;
  } else {
    container.style.height = minHeight + "px";
  }
});

init();
