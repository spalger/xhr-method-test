/* global XDomainRequest:true */
var methods = ['GET', 'HEAD', 'POST', 'PUT', 'DELETE'];
var _ = require('lodash');
var assert = require('assert');

function sendReq(params, cb) {
  var xhr = new XMLHttpRequest();
  if (("withCredentials" in xhr) === false) {
    xhr = new XDomainRequest();
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
      if (xhr.responseText) {
        if (window.JSON) {
          body = JSON.parse(xhr.responseText);
        } else {
          /* jshint evil: true */
          eval('body = ' + xhr.responseText);
        }
      }
      cb(body, xhr.status, xhr);
    }
  };

  if (params.body) {
    xhr.send(params.body);
  } else {
    xhr.send();
  }

}

_.each(methods, function (method) {
  var reqBody;
  if (method === 'GET') {
    reqBody = '';
  } else if (method !== 'HEAD') {
    reqBody = '{ "request": "body" }';
  }

  describe(method + ' method', function () {
    it('can be sent with just a URL', function (done) {
      sendReq({method: method}, function (resp, status) {
        assert(status === 200, 'status should be 200');
        if (reqBody !== void 0) {
          assert(!resp.body, 'resp.body should be empty');
        }
        done();
      });
    });

    it('can receive a 416', function (done) {
      sendReq({method: method, status: 416}, function (resp, status) {
        assert(status === 416, 'status should be 416');
        if (reqBody !== void 0) {
          assert(!resp.body, 'resp.body should be empty');
        }
        done();
      });
    });


    it('can be sent with a body', function (done) {
      sendReq({method: method, body: reqBody}, function (resp, status) {
        assert(status === 200, 'status should be 200');
        if (reqBody !== void 0) {
          assert(resp.body === reqBody, 'resp.body should be ' + reqBody);
        }
        done();
      });
    });

    it('can receive a 418 with a body', function (done) {
      sendReq({method: method, body: reqBody, status: 418}, function (resp, status) {
        assert(status === 418, 'status should be 418');
        if (reqBody !== void 0) {
          assert(resp.body === reqBody, 'resp.body should be ' + reqBody);
        }
        done();
      });
    });

  });

});
