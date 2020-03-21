// define which theme should load next
const themeMap = {
  dark: 'light',
  light: 'console',
  console: 'dark'
};

// Load the existing theme in local storage
const theme = localStorage.getItem('theme');
const bodyClass = document.body.classList;
theme && bodyClass.add(theme);

// Change the theme on a button click
function toggleTheme() {
  let currentTheme = localStorage.getItem('theme');
  // if no theme exist, default to first style define in body tag
  const current = (currentTheme ? currentTheme : document.body.classList[0]);
  const next = themeMap[current];
  // replace the value
  bodyClass.replace(current, next);
  // set local storage to save
  localStorage.setItem('theme', next);
}

// get new entries from data.json
let entries = JSON.parse(data);

//iterate entries and append to DOM
entries.forEach((item, i) => {
   // create new elements
   var node = document.createElement("content");
   var label = document.createElement("label");
   var code = document.createElement("code");

   // create text nodes and populate content
   let labelText = document.createTextNode("> run update " + item.date);
   let codeText = document.createTextNode(item.code);

   //apend new text
   label.appendChild(labelText);
   code.appendChild(codeText);

   //append new elements
   node.appendChild(label);
   node.appendChild(code);
   document.getElementById("entries").appendChild(node);
 });
