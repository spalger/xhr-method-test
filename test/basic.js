var methods = ['GET', 'POST', 'PUT', 'DELETE'];
var assert = require('assert');
var _ = require('lodash');

function sendReq(params, cb) {
  var xhr = new XMLHttpRequest();
  xhr.open(params.method || 'GET', 'http://spenceralger.com/echo/' + (params.status || ''), true);

  _.each(params.headers || {}, function (value, header) {
    xhr.setRequestHeader(header, value);
  });

  xhr.onreadystatechange = function () {
    if (xhr.readystate === 4) {
      cb(JSON.parse(xhr.responseText), xhr.status, xhr);
    }
  };

  xhr.send(params.body || void 0);
}

_.each(methods, function (method) {

  describe(method + ' method', function () {

    it('can be sent with just a URL', function (done) {

      sendReq({method: method}, function (resp, status) {
        assert(status === 200);
        assert(resp.body == null);
        done();
      });

    });

    it('can be sent with a body', function (done) {
      var reqBody = '{ "request": "body" }';
      sendReq({method: method, body: reqBody}, function (resp, status) {
        assert(status === 200);
        assert(resp.body === reqBody);
        done();
      });
    });

    it('can receive a 416', function (done) {
      sendReq({method: method, status: 416}, function (resp, status) {
        assert(status === 416);
        done();
      });
    });

    it('can receive a 418 with a body', function (done) {
      var reqBody = '{ "request": "body" }';
      sendReq({method: method, body: reqBody, status: 418}, function (resp, status) {
        assert(status === 418);
        assert(resp.body === reqBody);
        done();
      });
    });

  });

});
