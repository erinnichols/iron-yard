/*
 * var ajax = new Ajax();
 * ajax
 *  .then(fn)   // success (all 200s)
 *  .catch(fn); // 404, no internet connection
 *  .get();
 */

class Ajax {

  constructor(url) {
    this._thenChain = [];
    this._catchChain = [];
    this._url = url;
    this._headers = new Map();
  }

  addHeader(k, v) {
    this._headers.set(k, v);
    return this;
  }

  then(fn) {
    // success
    this._thenChain.push(fn);
    return this;
  }

  catch(fn) {
    // failure
    this._catchChain.push(fn);
    return this;
  }

  get() {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', this._url, true);
    this._headers.forEach(function (value, key) {
      xhr.setRequestHeader(key, value);
    });
    xhr.addEventListener('readystatechange', () => {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status >= 200 && xhr.status < 300) {
          let data = xhr.response;
          this._thenChain.forEach(function (callback) {
            data = callback(data);
          });
        } else if (xhr.status >= 400) {
          let err = {
            code: xhr.status,
            body: xhr.responseText,
            message: xhr.statusText
          };
          this._catchChain.forEach(function (callback) {
            err = callback(err);
          });
        }
      }
    });
    xhr.send();
  }

}
