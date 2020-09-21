class UserComponent extends HTMLElement {

  constructor() {
    super();
    // console.log('initializing component.');

    // Setup a click listener on <vjs-component>
    this.addEventListener('click', e => {
      console.log('click.');
    });


  }

  connectedCallback() {
    // console.log('my component is connected!');

    fetch('components/user/user-component.html')
      .then((resp) => resp.text())
      .then((html_data) => {

        // get open attribute
        const userId = this.getAttribute('user-id');

        let node = document.createElement("content");
        node.innerHTML = `<style>@import url( 'components/user/user-component.css' )</style>${html_data}`;

        // const clone = document.importNode(template.content, true);
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(node);

        this.getUser(userId);
      }).catch((error) => {
        console.error(error);
      });
  }

  disconnectedCallback() {
     // console.log('my component is connected!');
  }

  // Getter to let component know what attributes
    // to watch for mutation
    static get observedAttributes() {
      return ['user-id'];
    }

  attributeChangedCallback(attr, oldValue, newValue) {
    console.log(attr);
    this.getUser(newValue);
    console.log(`${attr} was changed from ${oldValue} to ${newValue}!`)
  }

  getUser(userId) {
    if(!userId) return false;

    // Fetch the data for that user Id from the API and call the render method with this data
    fetch(`https://jsonplaceholder.typicode.com/users/${userId}`)
      .then((response) => response.json())
      .then((data) => {
        this.shadowRoot.querySelector('h1').innerText = data.name;
      })
      .catch((error) => {
        console.error(error);
      });
  }
}

//define custom component in shadowDOM
customElements.define('user-component', UserComponent);
