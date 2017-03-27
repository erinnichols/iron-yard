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
  append(child) {
    this._li.appendChild(child.render());
  }
}

class UnorderedList {
  constructor() {
    this._ul = document.createElement('ul');
  }
  append(child) {
    this._ul.appendChild(child.render());
  }
  render() {
    return this._ul;
  }
}

class Link {
  constructor(url, text) {
    this._a = document.createElement('a');
    this.href = url;
    this.text = text;
  }
  render() {
    return this._a;
  }
  get href() {
    return this._a.href;
  }
  set href(value) {
    this._a.href = value;
  }
  get text() {
    return this._a.innerHTML;
  }
  set text(value) {
    this._a.innerHTML = value;
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

// add a live search widget

let liveSearch = new LiveSearch();
liveSearch.on('input', function() {
  if (this.value.length >= 3) {
    // do this stupid search thing
    new Ajax('https://api.github.com/search/repositories?q=' + this.value)
      .addHeader('Authorization', 'token 0769f07df1f34bacf719bd46c1ef19722c4c0d92')
      .addHeader('Accept', 'application/vnd.github.v3+json')
      .then(function(text) {
        let data = JSON.parse(text);
        let ul = new UnorderedList();
        data.items.forEach(function(repo) {
          let li = new ListItem();
          let link = new Link(repo.url, repo.name);
          li.append(link);
          ul.append(li);
        });
        document.body.replaceChild(ul.render(), document.body.lastChild);
      })
      .catch(x => console.error(x))
      .get();
  }
});

document.body.appendChild(liveSearch.render());

// load the initial list of repos

new Ajax('https://api.github.com/repositories')
  .addHeader('Authorization', 'token 0769f07df1f34bacf719bd46c1ef19722c4c0d92')
  .addHeader('Accept', 'application/vnd.github.v3+json')
  .then(function(text) {
    let data = JSON.parse(text);
    let ul = new UnorderedList();
    data.forEach(function(repo) {
      let li = new ListItem();
      let link = new Link(repo.url, repo.name)
      li.append(link);
      ul.append(li);
    });
    document.body.appendChild(ul.render());
  })
  .catch(x => console.error(x))
  .get();
