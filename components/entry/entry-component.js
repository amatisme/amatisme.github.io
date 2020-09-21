class EntryComponent extends HTMLElement {

  constructor() {
    super();

    // Setup a click listener on <vjs-component>
    this.addEventListener('click', e => {
      console.log('click.');
    });


  }

  connectedCallback() {
    fetch('components/entry/entry-component.html')
      .then((resp) => resp.text())
      .then((data) => {

        let node = document.createElement('div');
        node.innerHTML = `<style>@import url( 'components/entry/entry-component.css' )</style>${data}`;

        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(node);
        this.shadowRoot.querySelector('#label').innerText = this.getAttribute('label');
        this.shadowRoot.querySelector('#html').innerHTML = this.getAttribute('code');
        this.shadowRoot.querySelector('#timestamp').innerText = this.getAttribute('timestamp');
      }).catch((error) => {
        console.error(error);
      });
  }

  disconnectedCallback() {}
}

//define custom component in shadowDOM
customElements.define('entry-component', EntryComponent);
