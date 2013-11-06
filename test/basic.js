var methods = ['GET', 'POST', 'PUT', 'DELETE'];
var assert = require('assert');
var _ = require('lodash');

function sendReq(path, method, body, headers, cb) {
  var xhr = new XMLHttpRequest();
  xhr.open(method || 'GET', 'http://httpbin.org' + path, true);

  _.each(headers || {}, function (value, header) {
    xhr.setRequestHeader(header, value);
  });

  xhr.onreadystatechange = function () {
    if (xhr.readystate === 4) {
      cb(xhr.responseText, xhr.status, xhr);
    }
  };

  xhr.send(body || void 0);
}

methods.forEach(function (method) {

  describe(method + ' method', function () {

    it('can be sent with just a URL', function (done) {

      sendReq('/' + method.toLowerCase(), method, null, null, function (body, status) {
        body = JSON.parse(body);
        assert(status === 200);
        assert(body.data == null);
        done();
      });

    });

    it('can be sent with a body', function (done) {
      var reqBody = '{ "request": "body" }';
      sendReq('/' + method.toLowerCase(), method, reqBody, null, function (respBody, status) {
        respBody = JSON.parse(respBody);
        assert(status === 200);
        assert(respBody.data === reqBody);
        done();
      });
    });

    // it('can receive a 416', function (done) {
    //   sendReq('/status/416', method, null, null, function (respBody, status) {
    //     assert(status === 416);
    //     done();
    //   });
    // });

    // it('can receive a 418 with a body', function (done) {
    //   var reqBody = '{ "request": "body" }';
    //   sendReq('/status/418', method, reqBody, null, function (respBody, status) {
    //     assert(status === 418);
    //     assert()
    //     done();
    //   });
    // });

  });

});
