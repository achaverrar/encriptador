"use strict";
const textIn = document.querySelector("#input__text");
const textOut = document.querySelector(".output__text");

const btnEncrypt = document.querySelector("#encrypt");
const btnDecrypt = document.querySelector("#decrypt");
const btnCopy = document.querySelector("#copy");

const dictionary = [
  ["a", "ai"],
  ["e", "enter"],
  ["i", "imes"],
  ["o", "ober"],
  ["u", "ufat"],
];
/* 
Regex
invalid chars: /[^(a-z| )]/g

*/
function init() {
  textIn.value = "";
}

function getTextIn() {
  return textIn.value;
}

function setTextOut(newText) {
  textOut.textContent = newText;
}

function getTextOut() {
  return textOut.textContent;
}

function translate(original, dictionary) {
  const transformed = dictionary.reduce((result, pair) => {
    const find = pair[0];
    const replace = pair[1].toUpperCase();
    result = result.replaceAll(find, replace);
    return result;
  }, original);
  return transformed.toLowerCase();
}

init();

//textIn.addEventListener("input", (e) => {
/* btnEncrypt.addEventListener("click", () => {
  const textToEncrypt = getTextIn();
  //const encrypted = translateMssg(textToEncrypt, keysEncrypt);
  const encrypted = translate(textToEncrypt, dictionary);
  setTextOut(encrypted);
}); */

btnDecrypt.addEventListener("click", () => {
  const textToDecrypt = getTextIn();
  //const decrypted = translateMssg(textToDecrypt, keysDecrypt);
  const keysDecrypt = dictionary.map((pair) => pair.reverse());
  const decrypted = translate(textToDecrypt, keysDecrypt);
  setTextOut(decrypted);
});

btnCopy.addEventListener("click", () => {
  const copy = getTextOut();
  console.log("copying");
  navigator.clipboard.writeText(copy);
});

// Test
textIn.addEventListener("keydown", (e) => {
  //const text = e.target.value;
  const text = e.key;
  if (text.match(/[a-z| ]/)) return;
  if (text.match(/[A-Z]/)) {
    console.log("Uppercases aren't supported");
  } else if (text.match(/[0-9]/)) {
    console.log("Numbers aren't supported");
  } else {
    console.log("special chars aren't supported");
  }
  console.log(text);

  /* 
  Find words that don't satisfy conditions
  Retreive the first
  Surrounded a copy with b tags or create a span with that content
  Replace the word in the original text
  repeat with the next word


  Create an array with all of the invalid chars/strings
  delete duplicates
  replace them all using a loop
  */
});

/* Validar texto por caracteres invalidos*/
/* verificar seguridad */
/* colorear chars invalidos */
/* https://regexr.com/ */

/* 
  ["a", "ai*"],
  ["u", "ufat"],
  ["o", "obe*r"],
  [/(i(?!\*))/g, "ime*s"],
  [/(e(?!\*))/g, "enter"],
  [/(\*)/g, ""],

*/
// const testString = "¿hasTa qué HORas";
const testString = "¿hasTa qué HORas";
//let testString = "abcdefghijklmnopqrstuvwxyz";
//testString += testString.toUpperCase();
//const testString = "hasta que horas";
//const testString = "hasta Que horas";
//const invalid = /[^(a-z| )]/g;
const invalid = new RegExp(/[^(a-z| )]/);

function validate(text, constraints) {
  let string = text.replaceAll(new RegExp(/<\/?b>/g), "");
  let onSelect = false;
  let newString = "";
  //const check = new RegExp(constraints);
  for (let i = 0; i < string.length; i++) {
    const curChar = string[i];
    const isMatch = constraints.test(curChar);
    // console.log(curChar, isMatch);
    // new RegExp(/[^(a-z| )]/g).test("Z")
    if (isMatch && !onSelect) {
      newString = newString + "<b>" + curChar;
      onSelect = true;
    } else if (isMatch) {
      newString = newString + curChar;
    } else if (!isMatch && onSelect) {
      newString = newString + "</b>" + curChar;
      onSelect = false;
    } else {
      newString += curChar;
      onSelect = false;
    }
  }
  /* while (prevIndex < string.length) {
    const curIndex = string.indexOf(constraints, prevIndex);
    console.log(prevIndex, curIndex, onSelect);
    if (curIndex !== -1 && !onSelect) {
      newString =
        newString +
        string.slice(prevIndex, curIndex) +
        "<b>" +
        string[curIndex];
      prevIndex = curIndex + 1;
      onSelect = true;
      console.log("entré");
    } else if (curIndex === -1 && onSelect) {
      newString += "</b>" + string.slice(prevIndex);
      onSelect = false;
      prevIndex = string.length;
    } else {
      newString = "notFound";
      prevIndex = string.length;
    }
  } */

  return newString;
  /* if(curIndex === 0) {
      newString += "<b>" + string[curIndex];
      onSelect = true;
      prevIndex++;
    }
    else if(curIndex !== -1 && !onSelect) {

    } */
}

btnEncrypt.addEventListener("click", (e) => {
  console.log("validating");
  const plain = textIn.textContent;
  const cipher = validate(plain, invalid);
  textIn.innerHTML = cipher;
});

const inputHidden = document.querySelector("#input__text--hidden");
inputHidden.addEventListener("input", (e) => {
  const plain = inputHidden.value;
  const cipher = validate(plain, invalid);
  textIn.innerHTML = cipher;
});

// Event to get selected text: onselect

// Gets cursor's position in string
inputHidden.addEventListener("keyup", (e) => {
  console.log(e.target);
  console.log(e.target.selectionStart);
});

// Gets delimiters of a text selection
/* inputHidden.addEventListener("select", (e) => {
  console.log("HI");
  console.log(e.target);
  console.log(e.target.selectionStart);
  console.log(e.target.selectionEnd);
}); */
