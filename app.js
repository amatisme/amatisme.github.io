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

function toggleSection(section) {
  let elem = document.getElementById(section);

  //toggle if visible
  if(elem.style.display === "none" || !elem.style.display) {
    elem.style.display = "grid";
  }

  //hide others
  let sections = Array.from(document.getElementsByTagName("article"));
  sections.forEach((item, i) => {
    if(item.id !== section) {
      document.getElementById(item.id).style.display = "none";
    }
  });

}

function processData(data) {
  // get new entries from data.json
  let entries = JSON.parse(data);
  console.log(entries)

  //sort entries by date param
  entries.sort((a, b) => new Date(a.data.date) - new Date(b.data.date)).reverse();

  //filter entries for panels
  let entries_blog = entries.filter(item => item.data.category == "blog");
  let entries_code = entries.filter(item => item.data.category == "code");
  let entries_design = entries.filter(item => item.data.category == "design");

  //add to panels
  addEntriesToPanel(entries_blog,"blog");
  addEntriesToPanel(entries_design,"design");
  addEntriesToPanel(entries_code,"code");


}

function addEntriesToPanel(entries,id) {
  //iterate entries and append to DOM
  entries.forEach((item, i) => {
     // create new elements
     var node = document.createElement("content");
     var run = document.createElement("label");
     run.classList.add("timestamp");
     var label = document.createElement("label");
     var code = document.createElement("code");
     var timestamp = document.createElement("label");
     timestamp.classList.add("timestamp");

     // create text nodes and populate content
     // let labelText = document.createTextNode("> run " + item.data.label);
     let runText = document.createTextNode("> run update");
     let labelText = document.createTextNode(item.data.label);
     let dateText = document.createTextNode(setFormattedDate(item.data.date));
     let codeHTML = document.createElement('div');

     //apend new text
     run.appendChild(runText);
     label.appendChild(labelText);
     timestamp.appendChild(dateText);

     // code.appendChild(codeText);
     code.innerHTML = item.data.code;
     // code.appendChild(codeDiv);

     //append new elements
     node.appendChild(run);
     node.appendChild(label);
     node.appendChild(timestamp);
     node.appendChild(code);
     document.getElementById(id).appendChild(node);
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

function setFormattedDate(d) {
  //date format, months Array
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  var then = new Date(d);
  var then_ddmmyyyy = then.getDate() + then.getMonth() + then.getYear();
  var then_ddmmyyyyhhmm = then_ddmmyyyy + then.getHours() + then.getMinutes();

  var now = new Date();
  var now_ddmmyyyy = now.getDate() + now.getMonth() + now.getYear();
  var now_ddmmyyyyhhmm = now_ddmmyyyy + now.getHours() + now.getMinutes();

  if (now_ddmmyyyyhhmm == then_ddmmyyyyhhmm) {
      return 'seconds ago...';
  } else if (now_ddmmyyyy == then_ddmmyyyy) {
      return 'Today at ' + then.getHours() + ':' + then.getMinutes();
  } else {
      return then.getDate() + ' ' + months[then.getMonth()] + ' ' + then.getFullYear();
  }
}

//Use an IIFE for the hell of it! lol
(function() {
    var client = new XMLHttpRequest();
    client.onload = handler;
    client.open("GET", "https://us-central1-amatisme.cloudfunctions.net/amatismeEntries");
    // client.open("GET", "./data.json");
    client.setRequestHeader('Access-Control-Allow-Headers', '*');
    client.setRequestHeader('Access-Control-Allow-Origin', '*');
    client.setRequestHeader('Access-Control-Allow-Credentials', true);
    client.send();
})();
