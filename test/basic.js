var methods = ['GET', 'POST', 'PUT', 'DELETE'];
var assert = require('assert');
var _ = require('lodash');

var should = require('should');

function sendReq(params, cb) {
  var xhr = new XMLHttpRequest();
  xhr.open(params.method || 'GET', 'http://spenceralger.com/echo/' + (params.status || ''), true);

  _.each(params.headers || {}, function (value, header) {
    xhr.setRequestHeader(header, value);
  });

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      cb(JSON.parse(xhr.responseText), xhr.status, xhr);
    }
  };

  xhr.send(params.body || void 0);
}

_.each(methods, function (method) {

  describe(method + ' method', function () {

    it('can be sent with just a URL', function (done) {

      sendReq({method: method}, function (resp, status) {
        status.should.equal(200);
        resp.body.should.not.be.ok;
        done();
      });

    });

    it('can receive a 416', function (done) {
      sendReq({method: method, status: 416}, function (resp, status) {
        status.should.equal(416);
        resp.body.should.not.be.ok;
        done();
      });
    });

    if (method !== 'GET') {
      it('can be sent with a body', function (done) {
        var reqBody = '{ "request": "body" }';
        sendReq({method: method, body: reqBody}, function (resp, status) {
          status.should.equal(200);
          resp.body.should.equal(reqBody);
          done();
        });
      });

      it('can receive a 418 with a body', function (done) {
        var reqBody = '{ "request": "body" }';
        sendReq({method: method, body: reqBody, status: 418}, function (resp, status) {
          status.should.equal(418);
          resp.body.should.equal(reqBody);
          done();
        });
      });
    }

  });

});
