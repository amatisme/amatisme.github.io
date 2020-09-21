class Binding {
  constructor(prop, handler, el) {
    this.prop = prop;
    this.handler = handler;
    this.el = el;
  }

  bind() {
    let bindingHandler = Binder.handlers[this.handler];
    bindingHandler.bind(this);
    Binder.subscribe(this.prop, () => {
      bindingHandler.react(this);
    })
  }

  setValue(value) {
    Binder.scope[this.prop] = value;
  }

  getValue() {
    return Binder.scope[this.prop];
  }

  setTheAttribute(attr, value) {
    console.log(value);
    console.log(Binder.scope[this.prop]);
  }
}

class Binder {
  static setScope(scope) {
    this.scope = scope;
  }

  static redefine() {
    let keys = Object.keys(this.scope);
    keys.forEach((key) => {
      let value = this.scope[key];
      delete this.scope[key];

      Object.defineProperty(this.scope, key, {
        get() {
          return value;
        },
        set(newValue) {
          const shouldNotify = value != newValue;
          value = newValue;
          if (shouldNotify) {
            Binder.notify(key);
          }
        }
      })
    })
  }

  static subscribe(key, callback) {
    this.subscriptions.push({
      key: key,
      cb: callback
    });
  }

  static notify(key, callback) {
    const subscriptions = this.subscriptions.filter(
      subscription => subscription.key == key
    );
    subscriptions.forEach(subscription => {
      subscription.cb();
    });
  }
}



class ValueBindingHandler {
  bind(binding) {
    binding.el.addEventListener('input', () => {
      this.listener(binding);
    });
    this.react(binding);
  }
  react(binding) {
    binding.el.value = binding.getValue();
  }
  listener(binding) {
    let value = binding.el.value;
    binding.setValue(value);
  }
}

class TextBindingHandler {
  bind(binding) {
    this.react(binding);
  }
  react(binding) {
    binding.el.innerText = binding.getValue();
  }
}

class UserBindingHandler {
  bind(binding) {
    this.react(binding);
  }
  react(binding) {
    // listener in component
    binding.el.setAttribute('user-id', binding.getValue());
  }
}

Binder.subscriptions = [];
Binder.scope = {};
Binder.handlers = {
  value: new ValueBindingHandler(),
  text: new TextBindingHandler(),
  user: new UserBindingHandler()
}

// data bind example startup
Binder.setScope({
  id: 1
});
Binder.redefine();

const els = document.querySelectorAll('[data-bind]');
els.forEach(el => {
  const expressionParts = el.getAttribute('data-bind').split(':');
  const bindingHandler = expressionParts[0].trim();
  const scopeKey = expressionParts[1].trim();
  const binding = new Binding(scopeKey, bindingHandler, el);
  binding.bind();
});
