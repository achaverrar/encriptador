"use strict";
const textIn = document.querySelector("#inputOriginal");
const mirror = document.querySelector("#inputMirror");
const textOut = document.querySelector(".output__result");
const boxFound = document.querySelector(".output--success");
const boxNotFound = document.querySelector(".output--failure");
const errorsContainer = document.querySelector(".error");
const ouputBox = document.querySelector(".output-section");
let invalidInput = false;
let showingOutput = false;
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

const patterns = {
  valid: "a-z ",
  invalid: "[^a-z ]",
  linebreaks: "\r|\r\n|\n",
};

function keysOf(dictionary) {
  return Object.keys(dictionary);
}

function invertDictionary(dictionary) {
  const newDictionary = keysOf(dictionary).reduce((result, key) => {
    const value = dictionary[key];
    result[value] = key;
    return result;
  }, {});
  return newDictionary;
}

function translateText(original, dictionary) {
  let pattern = keysOf(dictionary).join("|");
  const regExp = new RegExp(pattern, "g");
  const translation = original.replace(regExp, (match) => dictionary[match]);
  return translation;
}

// TODO: replace string with text.input
function validateInput(string, className) {
  let anyInvalidChar = false;

  // Generate regular expressions for validation
  const regExpInvalids = new RegExp(patterns.invalid, "g");
  const regExpLinebreaks = new RegExp(patterns.linebreaks);

  // Generate innerHTML for mirror
  const mirrorContent = string.replace(regExpInvalids, (match) => {
    if (regExpLinebreaks.test(match)) {
      return "<br/>";
    } else {
      anyInvalidChar = true;
      return `<span class=${className}>${match}</span>`;
    }
  });
  // Update mirror
  // An extra <br> tag is added to fix bug with synchronization
  mirror.innerHTML = mirrorContent + "<br/>";

  return anyInvalidChar;
}

function init() {
  textIn.value = "";
  textIn.focus();
  dictionary.toDecrypt = invertDictionary(dictionary.toEncrypt);
}

btnDecrypt.addEventListener("click", () => {
  const cipher = textIn.value;
  if (!cipher || invalidInput) {
    boxNotFound.classList.remove("hidden");
    boxFound.classList.add("hidden");
    return;
  }
  const plain = translateText(cipher, dictionary.toDecrypt);
  boxNotFound.classList.add("hidden");
  boxFound.classList.remove("hidden");
  textOut.innerText = plain;
  showingOutput = true;
  ouputBox.focus();
});

btnCopy.addEventListener("click", () => {
  const copy = textOut.textContent;
  navigator.clipboard.writeText(copy);
});

btnEncrypt.addEventListener("click", (e) => {
  const plain = textIn.value;
  if (!plain || invalidInput) {
    boxNotFound.classList.remove("hidden");
    boxFound.classList.add("hidden");
    return;
  }
  const cipher = translateText(plain, dictionary.toEncrypt);
  boxNotFound.classList.add("hidden");
  boxFound.classList.remove("hidden");
  textOut.innerText = cipher;
  showingOutput = true;
  ouputBox.focus();
});

textIn.addEventListener("input", (e) => {
  if (showingOutput) {
    textOut.innerText = "";
    showingOutput = false;
    // TO-DO: add box with instructions instead
    boxNotFound.classList.remove("hidden");
    boxFound.classList.add("hidden");
  }
  const plain = textIn.value;
  const newInputValidity = validateInput(plain, "invalid");
  const oldInputValidity = invalidInput;
  if (newInputValidity !== oldInputValidity) {
    errorsContainer.classList.toggle("with-errors");
    invalidInput = !invalidInput;
  }
  /* const container = document.querySelector(".input");
  const offset = mirror.offsetHeight - mirror.clientHeight;
  textIn.style.height = "auto";
  const newHeight = e.target.scrollHeight + offset + "px";
  textIn.style.height = newHeight;
  const minHeight = 250;
  if (parseFloat(newHeight) >= minHeight) {
    container.style.height = newHeight;
  } else {
    container.style.height = minHeight + "px";
  } */
});

textIn.addEventListener("scroll", () => (mirror.scrollTop = textIn.scrollTop));
/* document.querySelector(".input-section").addEventListener("click", (e) => {
  const closestDiv = e.target.closest("div");
  if (closestDiv.className === "container") return;
  textIn.focus();
}); */

textIn.addEventListener("click", (e) => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
init();
