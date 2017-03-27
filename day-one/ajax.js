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
    this._headers = [];
  }

  addHeader(k, v) {
    // just kidding!
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
    xhr.setRequestHeader('Authorization', 'token 3db815c6c7372e03b9bb87c6ceeb60b2a66c5035');
    xhr.setRequestHeader('Accept', 'application/vnd.github.v3+json');
    xhr.addEventListener('readystatechange', () => {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status >= 200 && xhr.status < 300) {
          let data = xhr.response;
          console.log('response type', xhr.responseType);
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
