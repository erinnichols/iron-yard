class ListItem {
  constructor() {
    this._li = document.createElement('li');
  }

  set text(value) {
    this._li.innerHTML = value;
  }

  get text() {
    return this._li.innerHTML;
  }

  render() {
    return this._li;
  }
}

class UnorderedList {
  constructor() {
    this._ul = document.createElement('ul');
  }

  addItem(item) {
    this._ul.appendChild(item.render());
  }

  render() {
    return this._ul;
  }
}

new Ajax('https://api.github.com/repositories')
  .then(function(text) {
    let data = JSON.parse(text);
    let ul = new UnorderedList();
    data.forEach(function(repo) {
      let li = new ListItem();
      li.text = repo.name;
      ul.addItem(li);
    });
    document.body.appendChild(ul.render());
  })
  .get();
