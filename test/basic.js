var methods = ['GET', 'POST', 'PUT', 'DELETE'];
var assert = require('assert');
var _ = require('lodash');

function sendReq(method, body, headers, respCode, cb) {
  var xhr = new XMLHttpRequest();
  xhr.open(method || 'GET', 'http://spenceralger.com/echo/' + (respCode || ''), true);

  _.each(headers || {}, function (value, header) {
    xhr.setRequestHeader(header, value);
  });

  xhr.onreadystatechange = function () {
    if (xhr.readystate === 4) {
      cb(JSON.parse(xhr.responseText), xhr.status, xhr);
    }
  };

  xhr.send(body || void 0);
}

_.each(methods, function (method) {

  describe(method + ' method', function () {

    it('can be sent with just a URL', function (done) {

      sendReq(method, null, null, null, function (resp, status) {
        assert(status === 200);
        assert(resp.body == null);
        done();
      });

    });

    it('can be sent with a body', function (done) {
      var reqBody = '{ "request": "body" }';
      sendReq(method, reqBody, null, null, function (resp, status) {
        assert(status === 200);
        assert(resp.body === reqBody);
        done();
      });
    });

    it('can receive a 416', function (done) {
      sendReq(416, method, null, null, function (resp, status) {
        assert(status === 416);
        done();
      });
    });

    it('can receive a 418 with a body', function (done) {
      var reqBody = '{ "request": "body" }';
      sendReq(418, method, reqBody, null, function (resp, status) {
        assert(status === 418);
        assert(resp.body === reqBody);
        done();
      });
    });

  });

});
