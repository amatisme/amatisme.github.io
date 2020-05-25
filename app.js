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

function processData(data) {
  // get new entries from data.json
  let entries = JSON.parse(data);
  console.log(entries)

  //sort entries by date param
  entries.sort((a, b) => parseInt(a.data.date) - parseInt(b.data.date)).reverse();

  //iterate entries and append to DOM
  entries.forEach((item, i) => {
     // create new elements
     var node = document.createElement("content");
     var label = document.createElement("label");
     var code = document.createElement("code");

     // create text nodes and populate content
     let labelText = document.createTextNode("> run update " + item.data.date);
     let codeText = document.createTextNode(item.data.code);

     let codeHTML = document.createElement('div');
     codeHTML.innerHTML = '<b>test</b>';

     //apend new text
     label.appendChild(labelText);

     // code.appendChild(codeText);
     code.innerHTML = item.data.code;
     // code.appendChild(codeDiv);

     //append new elements
     node.appendChild(label);
     node.appendChild(code);
     document.getElementById("entries").appendChild(node);
   });
}

function handler() {
  if(this.status == 200 &&
    this.responseText != null &&
    this.responseText) {
    // success!
    processData(this.responseText);
  } else {
    // something went wrong
    console.log("Error: Could not connect to data source.");
  }
}

//Use an IIFE for the hell of it! lol
(function() {
    var client = new XMLHttpRequest();
    client.onload = handler;
    client.open("GET", "https://us-central1-amatisme.cloudfunctions.net/amatismeEntries");
    // client.open("GET", "./data.json"); dev
    client.setRequestHeader('Access-Control-Allow-Headers', '*');
    client.setRequestHeader('Access-Control-Allow-Origin', '*');
    client.setRequestHeader('Access-Control-Allow-Credentials', true);
    client.send();
})();
