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

class LiveSearch {
  constructor() {
    this._input = document.createElement('input');
  }

  on(name, callback) {
    this._input.addEventListener(name, function() {
      callback.call(this);
    });
  }

  render() {
    return this._input;
  }

}

let liveSearch = new LiveSearch();
liveSearch.on('input', function() {
  console.log(this.value);
  if (this.value.length >= 2) {
    // do this stupid search thing
    new Ajax('https://api.github.com/search/repositories?q=' + this.value)
      .then(function(text) {
        let data = JSON.parse(text);
        let ul = new UnorderedList();
        data.items.forEach(function(repo) {
          let li = new ListItem();
          li.text = repo.name;
          ul.addItem(li);
        });
        document.body.replaceChild(ul.render(), document.body.lastChild);
      })
      .get();
  }
});

document.body.appendChild(liveSearch.render());

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
