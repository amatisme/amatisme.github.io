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

function addEntriesToPanel(entries,id) {
  //iterate entries and append to DOM
  entries.forEach((item, i) => {
     // add the vjs-components
     var node = document.createElement("entry-component");
     node.setAttribute('data-bind', 'user: id');
     node.setAttribute('user-id', 1);
     node.setAttribute('label', item.data.label);
     node.setAttribute('code', item.data.code);
     node.setAttribute('timestamp', setFormattedDate(item.data.date));

     document.getElementById(id).appendChild(node);
   });
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
  fetch('https://us-central1-amatisme.cloudfunctions.net/amatismeEntries')
    .then((response) => response.json())
    .then((data) => {
      //sort entries by date param
      data.sort((a, b) => new Date(a.data.date) - new Date(b.data.date)).reverse();

      //filter entries for panels
      let entries_blog = data.filter(item => item.data.category == "blog");
      let entries_code = data.filter(item => item.data.category == "code");
      let entries_design = data.filter(item => item.data.category == "design");
      let entries_pens = data.filter(item => item.data.category == "pens");

      //add to panels
      addEntriesToPanel(entries_blog,"blog");
      addEntriesToPanel(entries_design,"design");
      addEntriesToPanel(entries_code,"code");
      addEntriesToPanel(entries_pens,"pens");
    })
    .catch((error) => {
      console.error(error);
    });
})();
