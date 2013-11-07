/* global XDomainRequest:true */
var methods = ['GET', 'POST', 'PUT', 'DELETE'];
var _ = require('lodash');
var assert = require('assert');

function sendReq(params, cb) {
  var xhr;
  if (typeof XDomainRequest !== 'undefined') {
    xhr = new XDomainRequest();
  } else {
    xhr = new XMLHttpRequest();
  }
  xhr.open(params.method || 'GET', 'http://spenceralger.com/echo/' + (params.status || ''), true);

  if (typeof xhr.setRequestHeader === 'function') {
    _.each(params.headers || {}, function (value, header) {
      xhr.setRequestHeader(header, value);
    });
  }

  xhr.onreadystatechange = function () {
    var body;
    if (xhr.readyState === 4) {
      if (window.JSON) {
        body = JSON.parse(xhr.responseText);
      } else {
        /* jshint evil: true */
        eval('body = ' + xhr.responseText);
      }
      cb(body, xhr.status, xhr);
    }
  };

  xhr.send(params.body || void 0);
}

_.each(methods, function (method) {
  var reqBody = '{ "request": "body" }';

  describe(method + ' method', function () {
    it('can be sent with just a URL', function (done) {
      sendReq({method: method}, function (resp, status) {
        assert(status === 200, 'status should be 200');
        assert(!resp.body, 'resp.body should be empty');
        done();
      });
    });

    it('can receive a 416', function (done) {
      sendReq({method: method, status: 416}, function (resp, status) {
        assert(status === 416, 'status should be 416');
        assert(!resp.body, 'resp.body should be empty');
        done();
      });
    });

    if (method !== 'GET') {
      it('can be sent with a body', function (done) {
        sendReq({method: method, body: reqBody}, function (resp, status) {
          assert(status === 200, 'status should be 200');
          assert(resp.body === reqBody, 'resp.body should be ' + reqBody);
          done();
        });
      });

      it('can receive a 418 with a body', function (done) {
        sendReq({method: method, body: reqBody, status: 418}, function (resp, status) {
          assert(status === 418, 'status should be 418');
          assert(resp.body === reqBody, 'resp.body should be ' + reqBody);
          done();
        });
      });
    }

  });

});
