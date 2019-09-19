<%@ tag body-content="empty" trimDirectiveWhitespaces="true"%>
<%@ attribute name="actionNameKey" required="true" type="java.lang.String"%>
<%@ attribute name="action" required="true" type="java.lang.String"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<%@ taglib prefix="formElement" tagdir="/WEB-INF/tags/responsive/formElement"%>
<%@ taglib prefix="ycommerce" uri="http://hybris.com/tld/ycommercetags"%>

<spring:htmlEscape defaultHtmlEscape="true" />

<c:set var="hideDescription" value="checkout.login.loginAndCheckout" />

<div class="login-page__headline">
	<spring:theme code="login.title" />
</div>
<script type="text/javascript">
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Recorder = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
    "use strict";
    
    module.exports = require("./recorder").Recorder;
    
    },{"./recorder":2}],2:[function(require,module,exports){
    'use strict';
    
    var _createClass = (function () {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
            }
        }return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
        };
    })();
    
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Recorder = undefined;
    
    var _inlineWorker = require('inline-worker');
    
    var _inlineWorker2 = _interopRequireDefault(_inlineWorker);
    
    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
    }
    
    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }
    
    var Recorder = exports.Recorder = (function () {
        function Recorder(source, cfg) {
            var _this = this;
    
            _classCallCheck(this, Recorder);
    
            this.config = {
                bufferLen: 4096,
                numChannels: 1, // important
                mimeType: 'audio/wav'
            };
            this.recording = false;
            this.callbacks = {
                getBuffer: [],
                exportWAV: []
            };
    
            Object.assign(this.config, cfg);
            this.context = source.context;
            this.node = (this.context.createScriptProcessor || this.context.createJavaScriptNode).call(this.context, this.config.bufferLen, this.config.numChannels, this.config.numChannels);
    
            this.node.onaudioprocess = function (e) {
                if (!_this.recording) return;
    
                var buffer = [];
                for (var channel = 0; channel < _this.config.numChannels; channel++) {
                    buffer.push(e.inputBuffer.getChannelData(channel));
                }
                _this.worker.postMessage({
                    command: 'record',
                    buffer: buffer
                });
            };
    
            source.connect(this.node);
            this.node.connect(this.context.destination); //this should not be necessary
    
            var self = {};
            this.worker = new _inlineWorker2.default(function () {
                var recLength = 0,
                    recBuffers = [],
                    sampleRate = undefined,
                    numChannels = undefined;
    
                self.onmessage = function (e) {
                    switch (e.data.command) {
                        case 'init':
                            init(e.data.config);
                            break;
                        case 'record':
                            record(e.data.buffer);
                            break;
                        case 'exportWAV':
                            exportWAV(e.data.type);
                            break;
                        case 'getBuffer':
                            getBuffer();
                            break;
                        case 'clear':
                            clear();
                            break;
                    }
                };
    
                function init(config) {
                    sampleRate = config.sampleRate;
                    numChannels = config.numChannels;
                    initBuffers();
                }
    
        
                function record(inputBuffer) {
                    /* important - downsampling */
                    var ratio = sampleRate / 16000,
                        newLength = Math.round(inputBuffer[0].length / ratio),
                        result = new Float32Array(newLength),
                        offsetResult = 0,
                        offsetBuffer = 0,
                        next,
                        accumulator,
                        i,
                        count;
                
                    while (offsetResult < result.length) {
                        next = Math.round((offsetResult + 1) * ratio);
                        accumulator = 0;
                        count = 0;
                        for (i = offsetBuffer; i < next && i < inputBuffer[0].length; i += 1) {
                            accumulator += inputBuffer[0][i];
                            count += 1;
                        }
                        result[offsetResult] = Math.min(1, accumulator / count);
                        offsetResult += 1;
                        offsetBuffer = next;
                    }
                    recBuffers[0].push(result);
                    recLength += result.length;
                }
    
                function exportWAV(type) {
                    var buffers = [];
                    for (var channel = 0; channel < numChannels; channel++) {
                        buffers.push(mergeBuffers(recBuffers[channel], recLength));
                    }
                    var interleaved = undefined;
                    if (numChannels === 2) {
                        interleaved = interleave(buffers[0], buffers[1]);
                    } else {
                        interleaved = buffers[0];
                    }
                    var dataview = encodeWAV(interleaved);
                    var audioBlob = new Blob([dataview], { type: type });
    
                    self.postMessage({ command: 'exportWAV', data: audioBlob });
                }
    
                function getBuffer() {
                    var buffers = [];
                    for (var channel = 0; channel < numChannels; channel++) {
                        buffers.push(mergeBuffers(recBuffers[channel], recLength));
                    }
                    self.postMessage({ command: 'getBuffer', data: buffers });
                }
    
                function clear() {
                    recLength = 0;
                    recBuffers = [];
                    initBuffers();
                }
    
                function initBuffers() {
                    for (var channel = 0; channel < numChannels; channel++) {
                        recBuffers[channel] = [];
                    }
                }
    
                function mergeBuffers(recBuffers, recLength) {
                    var result = new Float32Array(recLength);
                    var offset = 0;
                    for (var i = 0; i < recBuffers.length; i++) {
                        result.set(recBuffers[i], offset);
                        offset += recBuffers[i].length;
                    }
                    return result;
                }
    
                function interleave(inputL, inputR) {
                    var length = inputL.length + inputR.length;
                    var result = new Float32Array(length);
    
                    var index = 0,
                        inputIndex = 0;
    
                    while (index < length) {
                        result[index++] = inputL[inputIndex];
                        result[index++] = inputR[inputIndex];
                        inputIndex++;
                    }
                    return result;
                }
    
                function floatTo16BitPCM(output, offset, input) {
                    for (var i = 0; i < input.length; i++, offset += 2) {
                        var s = Math.max(-1, Math.min(1, input[i]));
                        output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
                    }
                }
    
                function writeString(view, offset, string) {
                    for (var i = 0; i < string.length; i++) {
                        view.setUint8(offset + i, string.charCodeAt(i));
                    }
                }

                function encodeWAV(samples) {
                    'use strict';
                
                    var buffer = new ArrayBuffer(44 + (samples.length * 2)),
                        view = new DataView(buffer);
                
                    /* RIFF identifier */
                    writeString(view, 0, 'RIFF');
                    /* RIFF chunk length */
                    view.setUint32(4, 36 + (samples.length * 2), true);
                    /* RIFF type */
                    writeString(view, 8, 'WAVE');
                    /* format chunk identifier */
                    writeString(view, 12, 'fmt ');
                    /* format chunk length */
                    view.setUint32(16, 16, true);
                    /* sample format (raw) */
                    view.setUint16(20, 1, true);
                    /* channel count */
                    view.setUint16(22, 1, true);
                    /* sample rate */
                    view.setUint32(24, 16000, true); // important
                    /* byte rate (sample rate * block align) */
                    view.setUint32(28, 16000 * 2, true); // important
                    /* block align (channel count * bytes per sample) */
                    view.setUint16(32, 2, true);
                    /* bits per sample */
                    view.setUint16(34, 16, true);
                    /* data chunk identifier */
                    writeString(view, 36, 'data');
                    /* data chunk length */
                    view.setUint32(40, samples.length * 2, true);
                
                    floatTo16BitPCM(view, 44, samples);
                
                    return view;
                }
            }, self);
    
            this.worker.postMessage({
                command: 'init',
                config: {
                    sampleRate: this.context.sampleRate,
                    numChannels: this.config.numChannels
                }
            });
    
            this.worker.onmessage = function (e) {
                var cb = _this.callbacks[e.data.command].pop();
                if (typeof cb == 'function') {
                    cb(e.data.data);
                }
            };
        }
    
        _createClass(Recorder, [{
            key: 'record',
            value: function record() {
                this.recording = true;
            }
        }, {
            key: 'stop',
            value: function stop() {
                this.recording = false;
            }
        }, {
            key: 'clear',
            value: function clear() {
                this.worker.postMessage({ command: 'clear' });
            }
        }, {
            key: 'getBuffer',
            value: function getBuffer(cb) {
                cb = cb || this.config.callback;
                if (!cb) throw new Error('Callback not set');
    
                this.callbacks.getBuffer.push(cb);
    
                this.worker.postMessage({ command: 'getBuffer' });
            }
        }, {
            key: 'exportWAV',
            value: function exportWAV(cb, mimeType) {
                mimeType = mimeType || this.config.mimeType;
                cb = cb || this.config.callback;
                if (!cb) throw new Error('Callback not set');
    
                this.callbacks.exportWAV.push(cb);
    
                this.worker.postMessage({
                    command: 'exportWAV',
                    type: mimeType
                });
            }
        }], [{
            key: 'forceDownload',
            value: function forceDownload(blob, filename) {
                var url = (window.URL || window.webkitURL).createObjectURL(blob);
                var link = window.document.createElement('a');
                link.href = url;
                link.download = filename || 'output.wav';
                var click = document.createEvent("Event");
                click.initEvent("click", true, true);
                link.dispatchEvent(click);
            }
        }]);
    
        return Recorder;
    })();
    
    exports.default = Recorder;
    
    },{"inline-worker":3}],3:[function(require,module,exports){
    "use strict";
    
    module.exports = require("./inline-worker");
    },{"./inline-worker":4}],4:[function(require,module,exports){
    (function (global){
    "use strict";
    
    var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
    
    var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };
    
    var WORKER_ENABLED = !!(global === global.window && global.URL && global.Blob && global.Worker);
    
    var InlineWorker = (function () {
      function InlineWorker(func, self) {
        var _this = this;
    
        _classCallCheck(this, InlineWorker);
    
        if (WORKER_ENABLED) {
          var functionBody = func.toString().trim().match(/^function\s*\w*\s*\([\w\s,]*\)\s*{([\w\W]*?)}$/)[1];
          var url = global.URL.createObjectURL(new global.Blob([functionBody], { type: "text/javascript" }));
    
          return new global.Worker(url);
        }
    
        this.self = self;
        this.self.postMessage = function (data) {
          setTimeout(function () {
            _this.onmessage({ data: data });
          }, 0);
        };
    
        setTimeout(function () {
          func.call(self);
        }, 0);
      }
    
      _createClass(InlineWorker, {
        postMessage: {
          value: function postMessage(data) {
            var _this = this;
    
            setTimeout(function () {
              _this.self.onmessage({ data: data });
            }, 0);
          }
        }
      });
    
      return InlineWorker;
    })();
    
    module.exports = InlineWorker;
    }).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
    },{}]},{},[1])(1)
    });
function enrollNewVerificationProfile(){
	navigator.getUserMedia({audio: true}, function(stream){
		console.log('I\'m listening... say one of the predefined phrases...');
		onMediaSuccess(stream, createVerificationProfile, 4);
	}, onMediaError);
}

var recorder;
var audio_context;

function onMediaSuccess(stream, callback, secondsOfAudio) {
    audio_context = audio_context || new window.AudioContext;
    var input = audio_context.createMediaStreamSource(stream);
    recorder = new Recorder(input);
    recorder.record();
    
	setTimeout(() => { StopListening(callback); }, secondsOfAudio*1000);
}

function onMediaError(e) {
    console.error('media error', e);
}

function StopListening(callback){
	console.log('...working...');
    recorder && recorder.stop();
    recorder.exportWAV(function(blob) {
        callback(blob);
    });
    recorder.clear();
}

function createVerificationProfile(blob){
	console.log("gaga");
	/*var myurl = window.location.pathname;
	var fd = new FormData();
	//fd.append('fname', 'voice.wav');
	fd.append('data', blob);
	$.ajax({
	   url: '',
	   type: 'POST',
	   contentType: 'multipart/form-data',  
	   data: fd,
	   processData: false
	});*/
	/*var url = URL.createObjectURL(blob);
	var request = new XMLHttpRequest();
	request.withCredentials = true;
	request.open("POST", 'https://electronics.local:9002/AzureHackathonstorefront/speakerrecognition/enrollnewverificationprofile', true);
	request.withCredentials = true;
	request.setRequestHeader('Content-Type','multipart/form-data');  
	request.send(blob);*/
	var hidden_elem = document.getElementById("myfile");
	var reader = new FileReader();
	reader.readAsDataURL(blob);
	var base64data;
	reader.onloadend = (event) => {
	    // The contents of the BLOB are in reader.result:
	    base64data = reader.result;                
      	console.log(base64data);
	    hidden_elem.value = "SR:"+base64data;
	    document.getElementById("mypasswordform").submit();
	}
	
}

function startListeningForVerification(){
	navigator.getUserMedia({audio: true}, function(stream){onMediaSuccess(stream, verifyProfile, 4)}, onMediaError);
}

function verifyProfile(blob){
	var hidden_elem = document.getElementById("j_password");
	var reader = new FileReader();
	reader.readAsDataURL(blob);
	var base64data;
	reader.onloadend = (event) => {
	    // The contents of the BLOB are in reader.result:
	    base64data = reader.result;                
      	console.log(base64data);
	    hidden_elem.value = base64data;
	    document.getElementById("myloginform").submit();
	}
}
(function () {
	// Cross browser sound recording using the web audio API
	navigator.getUserMedia = ( navigator.getUserMedia ||
							navigator.webkitGetUserMedia ||
							navigator.mozGetUserMedia ||
							navigator.msGetUserMedia);

	
	
})();
</script>
<c:if test="${actionNameKey ne hideDescription}">
	<p>
		<spring:theme code="login.description" />
	</p>
</c:if>

<form:form action="${action}" method="post" commandName="loginForm" id="myloginform">
	<c:if test="${not empty message}">
		<span class="has-error"> <spring:theme code="${message}" />
		</span>
	</c:if>	
		
		<formElement:formInputBox idKey="j_username" labelKey="login.email"
			path="j_username" mandatory="true" />
		<formElement:formPasswordBox idKey="j_password"
			labelKey="login.password" path="j_password" inputCSS="form-control"
			mandatory="true" />
		
			<div class="forgotten-password">
				<ycommerce:testId code="login_forgotPassword_link">
					<a href="#" data-link="<c:url value='/login/pw/request'/>" class="js-password-forgotten" data-cbox-title="<spring:theme code="forgottenPwd.title"/>">
						<spring:theme code="login.link.forgottenPwd" />
					</a>
				</ycommerce:testId>
			</div>
		<ycommerce:testId code="loginAndCheckoutButton">
			<button type="submit" class="btn btn-primary btn-block">
				<spring:theme code="${actionNameKey}" />
			</button>
		</ycommerce:testId>
		<select id="loginselect"> </select>
		<script type="text/javascript">
					var slash = window.location.pathname.indexOf('/electronics');
					var url = window.location.pathname.substring(0, slash)+"/speakerrecognition/getverificationphrases";
					console.log(window.location);
				    console.log(url);
				    function reqListener () {
				    	  console.log(this.responseText);
				    	  var obj = JSON.parse(this.responseText);
				    	  console.log(obj);
				    	  var select = document.getElementById("loginselect");
				    	  for (var i = 0; i< obj.length; i++){
				    		    var opt = document.createElement('option');
				    		    opt.value = obj[i].phrase;
				    		    opt.innerHTML = obj[i].phrase;
				    		    select.appendChild(opt);
				    		   
				    		}
				    }

				    	var oReq = new XMLHttpRequest();
				    	oReq.onload = reqListener;
				    	oReq.open("GET", url, true);
				    	oReq.send();
				</script>
		<ycommerce:testId code="vrloginButton">
			<button type="button" class="btn btn-primary btn-block" onclick="startListeningForVerification();">
				Voice Login
			</button>
			
			<video id="player" class="btn-block" controls autoplay></video>
			<button id="capture" type="button" class="btn btn-primary btn-block">
				Face Login
			</button>
		
			<canvas id="canvas1" width=320 height=240></canvas>
			<canvas id="canvas2" width=320 height=240></canvas>
			<canvas id="canvas3" width=320 height=240></canvas>
				<script>
				 const player = document.getElementById('player');
				  const canvas1 = document.getElementById('canvas1');
				  const context1 = canvas1.getContext('2d');
				  const captureButton = document.getElementById('capture');
				
				  const constraints = {
				    video: true,
				  };
				
				  captureButton.addEventListener('click', () => {
				    // Draw the video frame to the canvas.
				    context1.drawImage(player, 0, 0, canvas1.width, canvas1.height);
				    canvas1.toBlob(function(blob) {
											  var reader3 = new FileReader();
												reader3.readAsDataURL(blob);
												var base64data3;
												var hidden_elem = document.getElementById("j_password");
												reader3.onloadend = (event) => {
												    // The contents of the BLOB are in reader.result:
												    base64data3 = reader3.result;  
												    console.log(base64data3);              
												    hidden_elem.value = base64data3;
											      	console.log(hidden_elem.value);
												    document.getElementById("myloginform").submit();
												}
										  
										      }, 'image/jpeg');
				
				  });
				
				  // Attach the video stream to the video element and autoplay.
				  navigator.mediaDevices.getUserMedia(constraints)
				    .then((stream) => {
				      player.srcObject = stream;
				    });
				</script>
		</ycommerce:testId>
	
	<c:if test="${expressCheckoutAllowed}">
		<button type="submit" class="btn btn-default btn-block expressCheckoutButton"><spring:theme code="text.expresscheckout.header" /></button>
		<input id="expressCheckoutCheckbox" name="expressCheckoutEnabled" type="checkbox" class="form left doExpressCheckout display-none" />
	</c:if>

</form:form>

