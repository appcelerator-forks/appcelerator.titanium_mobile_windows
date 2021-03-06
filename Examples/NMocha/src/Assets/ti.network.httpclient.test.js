/*
 * Appcelerator Titanium Mobile
 * Copyright (c) 2011-2016 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */
var should = require('./should'),
	utilities = require('./utilities/utilities');

describe('Titanium.Network.HTTPClient', function () {
	it('apiName', function () {
		should(Ti.Network.HTTPClient.apiName).be.eql('Ti.Network.HTTPClient');
	});

	(utilities.isWindowsDesktop() ? it.skip : it)('responseXML', function (finish) {
		this.timeout(6e4);

		var xhr = Ti.Network.createHTTPClient();
		xhr.setTimeout(6e4);

		xhr.onload = function (e) {
			should(xhr.responseXML === null).be.false;
			should(xhr.responseXML.nodeType).eql(9); // DOCUMENT_NODE
			finish();
		};
		xhr.onerror = function (e) {
			Ti.API.debug(e);
			finish(new Error('failed to retrieve RSS feed: ' + e));
		};

		xhr.open('GET', 'http://www.appcelerator.com/feed');
		xhr.send();
	});

	// Test for TIMOB-4513
	it.skip('secureValidateProperty', function (finish) {
		var xhr = Ti.Network.createHTTPClient();
		should(xhr).be.an.Object;

		should(xhr.validatesSecureCertificate).be.undefined;
		xhr.validatesSecureCertificate = true;
		should(xhr.validatesSecureCertificate).be.true;
		xhr.validatesSecureCertificate = false;
		should(xhr.validatesSecureCertificate).be.false;

		xhr.setValidatesSecureCertificate(true);
		should(xhr.getValidatesSecureCertificate()).be.true;
		xhr.setValidatesSecureCertificate(false);
		should(xhr.getValidatesSecureCertificate()).be.false;

		finish();
	});

	(utilities.isWindowsDesktop() ? it.skip : it)('downloadLargeFile', function (finish) {
		this.timeout(6e4);

		var xhr = Ti.Network.createHTTPClient();
		xhr.setTimeout(6e4);

		xhr.onload = function (e) {
			// should(xhr.responseData.length).be.greaterThan(0);
			finish();
		};
		xhr.onerror = function (e) {
			Ti.API.debug(e);
			finish(new Error('failed to retrieve large image: ' + e));
		};

		xhr.open('GET', 'https://userscontent2.emaze.com/images/de1f3140-6f4e-4a67-9626-14c39a8f93a2/18aaaec3-31fb-463b-bac9-19d848f7a583.png');
		xhr.send();
	});

	it('TIMOB-23127', function (finish) {
		this.timeout(6e4);

		var xhr = Ti.Network.createHTTPClient();
		xhr.setTimeout(6e4);

		xhr.onload = function (e) {
			finish();
		};

		xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		xhr.open('POST', 'http://www.appcelerator.com/');
		xhr.send('TIMOB-23127');
	});

	it('TIMOB-23214', function (finish) {
		this.timeout(6e4);

		var xhr = Ti.Network.createHTTPClient();
		xhr.setTimeout(6e4);

		xhr.onload = function (e) {
			finish();
		};

		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.open('GET', 'http://www.appcelerator.com/');
		xhr.send();
	});

	it('TIMOB-19042', function (finish) {
		this.timeout(6e4);

		var xhr = Ti.Network.createHTTPClient();
		xhr.setTimeout(6e4);

		xhr.onload = function (e) {
			finish(new Error('onload shouldn\'t fire for an URL returning 404'));
		};
		xhr.onerror = function (e) {
			should(e.code).eql(404);
			finish();
		};

		xhr.open('GET', 'http://www.httpbin.org/gert'); // BAD URL, should get 404
		xhr.send();
	});

	// https://appcelerator.lighthouseapp.com/projects/32238/tickets/2156-android-invalid-redirect-alert-on-xhr-file-download
	// https://appcelerator.lighthouseapp.com/projects/32238/tickets/1381-android-buffer-large-xhr-downloads
	(utilities.isWindowsDesktop() ? it.skip : it)('largeFileWithRedirect', function (finish) {
		this.timeout(6e4);

		var xhr = Ti.Network.createHTTPClient();
		xhr.setTimeout(6e4);

		xhr.onload = function (e) {
			//should(xhr.responseData.length).be.greaterThan(0);
			finish();
		};
		xhr.onerror = function (e) {
			Ti.API.debug(e);
			finish(new Error('failed to retrieve redirected large image: ' + e));
		};

		xhr.open('GET', 'http://www.httpbin.org/redirect-to?url=https%3A%2F%2Fuserscontent2.emaze.com%2Fimages%2Fde1f3140-6f4e-4a67-9626-14c39a8f93a2%2F18aaaec3-31fb-463b-bac9-19d848f7a583.png');
		xhr.send();
	});

	// https://appcelerator.lighthouseapp.com/projects/32238-titanium-mobile/tickets/1649-android-httpclientsend-with-no-argument-causes-npe
	it('emptyPOSTSend', function (finish) {
		this.timeout(3e4);
		var xhr = Ti.Network.createHTTPClient();
		xhr.setTimeout(3e4);
		xhr.onload = function (e) {
			finish();
		};
		xhr.onerror = function (e) {
			Ti.API.debug(e);
			finish(new Error('failed to post empty request: ' + e));
		};

		xhr.open('POST', 'http://www.httpbin.org/post');
		xhr.send();
	});

	//https://appcelerator.lighthouseapp.com/projects/32238/tickets/2339
	it.skip('responseHeadersBug', function (finish) {
		this.timeout(3e4);
		var xhr = Ti.Network.createHTTPClient();
		xhr.setTimeout(3e4);
		xhr.onload = function (e) {
			var allHeaders = xhr.getAllResponseHeaders();
			should(allHeaders.indexOf('Server:')).be.within(0, 1 / 0);
			var header = xhr.getResponseHeader('Server');
			should(header.length).be.greaterThan(0);
			finish();
		};
		xhr.onerror = function (e) {
			Ti.API.debug(e);
			finish(new Error('failed to retrieve headers: ' + e));
		};
		xhr.open('GET', 'http://www.appcelerator.com');
		xhr.send();
	});

	it('requestHeaderMethods', function (finish) {
		this.timeout(3e4);
		var xhr = Ti.Network.createHTTPClient();
		xhr.setTimeout(3e4);
		xhr.onload = function (e) {
			var response;
			should(e.code).eql(0);
			if (xhr.status == 200) {
				should(e.success).eql(true);

				response = JSON.parse(xhr.responseText);
				response['adhocHeader'].should.eql('notcleared');
				response.should.not.have.property('clearedHeader');
			} else if (xhr.status != 503) { // service unavailable (over quota)
				fail('Received unexpected response: ' + xhr.status);
				return;
			}
			finish();
		};
		xhr.onerror = function (e) {
			if (xhr.status != 503) { // service unavailable (over quota)
				fail('Received unexpected response: ' + xhr.status);
				return;
			}
			finish();
		};
		xhr.open('GET', 'http://headers.jsontest.com/');
		xhr.setRequestHeader('adhocHeader', 'notcleared');
		xhr.setRequestHeader('clearedHeader', 'notcleared');
		should(function () {
			xhr.setRequestHeader('clearedHeader', null);
		}).not.throw();
		xhr.send();
	});

	it('sendData', function (finish) {
		this.timeout(3e4);
		var xhr = Ti.Network.createHTTPClient();
		xhr.setTimeout(3e4);
		xhr.onload = function (e) {
			finish();
		};
		xhr.onerror = function (e) {
			Ti.API.debug(e);
			finish(new Error('failed to send data: ' + e));
		};
		xhr.open('POST', 'http://www.httpbin.org/post');
		xhr.send({
			message: 'check me out',
			numericid: 1234
		});
	});

	// Confirms that only the selected cookie is deleted
	it.skip('clearCookiePositiveTest', function (finish) {
		this.timeout(3e4);
		var timer = 0;
		var second_cookie_fn = function (e) {
			var second_cookie_string = this.getResponseHeader('Set-Cookie').split.skip(';')[0];
			clearTimeout(timer);
			// New Cookie should be different.
			should(cookie_string).not.be.eql(second_cookie_string);
			finish();
		};
		var xhr = Ti.Network.createHTTPClient();
		var done = false;
		var cookie_string;
		xhr.setTimeout(3e4);
		xhr.onload = function (e) {
			cookie_string = this.getResponseHeader('Set-Cookie').split.skip(';')[0];
			xhr.clearCookies('https://my.appcelerator.com');
			xhr.onload = second_cookie_fn;
			xhr.open('GET', 'https://my.appcelerator.com/auth/login');
			xhr.send();
		};
		xhr.onerror = function (e) {
			clearTimeout(timer);
			should(e).should.be.type('undefined');
		};
		xhr.open('GET', 'https://my.appcelerator.com/auth/login');
		xhr.send();
	});

	// Confirms that only the selected cookie is deleted
	it.skip('clearCookieUnaffectedCheck', function (finish) {
		this.timeout(3e4);
		var timer = 0;
		var second_cookie_fn = function (e) {
			Ti.API.info('Second Load');
			var second_cookie_string = this.getResponseHeader('Set-Cookie').split.skip(';')[0];
			clearTimeout(timer);
			// Cookie should be the same
			should(cookie_string).eql(second_cookie_string);
			finish();
		};
		var xhr = Ti.Network.createHTTPClient();
		var done = false;
		var cookie_string;
		xhr.setTimeout(3e4);
		xhr.onload = function (e) {
			cookie_string = this.getResponseHeader('Set-Cookie').split.skip(';')[0];
			xhr.clearCookies('http://www.microsoft.com');
			xhr.onload = second_cookie_fn;
			xhr.open('GET', 'https://my.appcelerator.com/auth/login');
			xhr.send();
		};
		xhr.onerror = function (e) {
			clearTimeout(timer);
			should(e).should.be.type('undefined');
		};
		xhr.open('GET', 'https://my.appcelerator.com/auth/login');
		xhr.send();
	});

	// https://jira.appcelerator.org/browse/TIMOB-2849
	it.skip('setCookieClearCookieWithMultipleHTTPClients', function (finish) {
		this.timeout(3e4);
		var xhr = Ti.Network.createHTTPClient();
		xhr.setTimeout(3e4);
		xhr.onload = function (e) {
			var resp = JSON.parse(this.responseText);
			should(resp.cookies.k1).eql('v1');
			should(resp.cookies.k2).eql('v2');
			var xhr2 = Ti.Network.createHTTPClient();
			xhr2.setTimeout(3e4);
			xhr2.onload = function (e) {
				Ti.API.info('Clear Cookie');
				var resp2 = JSON.parse(this.responseText);
				should(resp2.cookies.hasOwnProperty('v1')).be.false;
				should(resp2.cookies.hasOwnProperty('v2')).be.false;
				finish();
			};
			xhr2.open('GET', 'http://www.httpbin.org/cookies/delete?k2=&k1=');
			xhr2.send();
		};
		xhr.open('GET', 'http://www.httpbin.org/cookies/set?k2=v2&k1=v1');
		xhr.send();
	});

	// https://jira.appcelerator.org/browse/TIMOB-11751
	// https://jira.appcelerator.org/browse/TIMOB-17403
	it.skip('callbackTestForGETMethod', function (finish) {
		this.timeout(30000);

		var xhr = Ti.Network.createHTTPClient();
		xhr.setTimeout(30000);

		var dataStreamFinished = false;

		xhr.onreadystatechange = function (e) {
			if (this.readyState == this.DONE) {
				if (dataStreamFinished) {
					finish();
				} else {
					finish(new Error('onreadystatechange done fired before 100% progress'));
				}
			}
		};

		xhr.ondatastream = function (e) {
			should(e.progress).be.ok;
			if (e.progress >= 1) dataStreamFinished = true;
		};

		xhr.onerror = function (e) {
			should(e).should.be.type('undefined');
		};

		xhr.open('GET', 'http://www.appcelerator.com/assets/The_iPad_App_Wave.pdf');
		xhr.send();
	});

	it.skip('callbackTestForPOSTMethod', function (finish) {
		this.timeout(3e4);
		var xhr = Ti.Network.createHTTPClient();
		xhr.setTimeout(3e4);
		var sendStreamFinished = false;
		xhr.onreadystatechange = function (e) {
			if (this.readyState == this.DONE && sendStreamFinished) finish();
		};
		xhr.onsendstream = function (e) {
			should(e.progress).be.ok;
			if (e.progress >= .99) sendStreamFinished = true;
		};
		xhr.onerror = function (e) {
			should(e).should.be.type('undefined');
		};
		var buffer = Ti.createBuffer({
			length: 1024 * 10
		}).toBlob();
		xhr.open('POST', 'http://www.httpbin.org/post');
		xhr.send({
			data: buffer,
			username: 'fgsandford1000',
			password: 'sanford1000',
			message: 'check me out'
		});
	});

	it.skip('POST multipart/form-data containing Ti.Blob', function (finish) {
		this.timeout(6e4);

		var xhr = Ti.Network.createHTTPClient(),
			imageFile = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, 'Logo.png'),
			newId = new Date().getTime(),
			newName = 'HEY_YOU_GUYS_WAIT_FOR_ME-' + newId,
			form,
			blob = imageFile.read(imageFile);

		xhr.setTimeout(6e4);

		xhr.onload = function (e) {
			//should(e.code).eql(200);// because our API is insane, this always returns 0
			should(xhr.status).eql(200);
			var result = JSON.parse(xhr.responseText);
			// check sent headers
			should(result).have.property('headers');
			should(result.headers).have.property('Content-Type');
			should(result.headers['Content-Type']).startWith('multipart/form-data');

			// check name got added
			should(result).have.property('form');
			should(result.form).have.property('name');
			should(result.form.name).eql(newName);

			// check blob data
			should(result).have.property('files');
			should(result.files).have.property('attachment');
			// image/png (Android), image/png (Windows). Ideally this would match the mimetype/contenttype of the file (which it does for Android/Windows). Let's hope it does on iOS?
			should(result.files.attachment).eql('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAACWCAYAAAA8AXHiAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAsNJREFUeNrs3b1NI0EYgGG8InQZlEFCdl1AfhGRayCiABKugMvJaIECKMP53hgZ6QJujXwzuzvf97zSyoEt2Z55NLO2/LMZx/FCqt1gCASWwBJYElgCS2BJYAksgSWBJbAElgSWwBJYElgCS2BJYAksgSWBJbAElgSWwBJYElgCS2BJYAksgSWBJbAUusuOHuur6froxoolW6GUdSv8qn057jebzXukSRnH8apcPJZja8VapsPAPx4nAiqwqqxU4XBFQdUzrPtouCZQPYA1U8dzqjC4plCV5/oCFlxQRTh57x1XVFQRXhV2iysyqhCwesQVHVUYWD3hyoAqFKwecGVBFQ7WmnGV+95mQRUS1hpxZUMVFtaacP2F6ioLqtCw1oArK6rwsJbElRlVClhL4MqOKg2sOXFNoPqVBVUqWHPgmkD1Uu77OdNYp/vMeytcJ1A9ZBvnlF+mqI0LKrCq44IKrOq4oAKrOi6owKqOCyqwquOCCqzquKACqwmucuygAqsFrmuowGqBCyqwquF6+8fVv40QWGdVTtZ3X2x/n4X6lRuw5kX1Y+ImW7jAqoEq1A+RgLUiVOWc6w0usGqj2p94KwIusM5DdeKtCLjAOh8VXGA1QwUXWM1QwQVWM1RwgdUMFVxgfaK6q40KruSwyuQeQN22QAVXUlhHVLuWqOBKBmtOVHAlgbUEKriCw1oSVXZcQzJU+zlRZcY1QAUXWP+PatF/Ys2Ea4AKLrA6R5UJ1wAVXGAFQZUB1wAVXGAFQxUZ1wDV+nGBNV8/I6H6Bi6wZmobDdUJXN11GWAuDsieyvZ4ISuWwJLO2NJtIbJiCSyBJYElsASWBJbAElgSWAJLYElgCSyBJYElsASWBJbAElgSWAJLYElgCSyBJYElsASWBJbAElgSWAJLYElgCSyBJYElsASWBJbAElgSWFqyPwIMAMpfdKkmd/FSAAAAAElFTkSuQmCC');

			finish();
		};
		xhr.onerror = function (e) {
			finish(new Error(e.error || this.responseText));
		};

		xhr.open('POST', 'http://www.httpbin.org/post');

		form = {
			name: newName,
			attachment: blob
		};

		xhr.send(form);
	});
});
