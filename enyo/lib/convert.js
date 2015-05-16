/*
from http://blog.tinisles.com/2011/10/google-authenticator-one-time-password-algorithm-in-javascript/
*/

function dec2hex(s) { return (s < 15.5 ? '0' : '') + Math.round(s).toString(16); }
function hex2dec(s) { return parseInt(s, 16); }

function base32tohex(base32) {
	var base32chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
	var bits = "";
	var hex = "";

	for (var i = 0; i < base32.length; i++) {
		var val = base32chars.indexOf(base32.charAt(i).toUpperCase());
		bits += leftpad(val.toString(2), 5, '0');
	}
	for (var i = 0; i+4 <= bits.length; i+=4) {
		var chunk = bits.substr(i, 4);
		hex = hex + parseInt(chunk, 2).toString(16) ;
	}
	return hex;
}

function leftpad(str, len, pad) {
	if (len + 1 >= str.length) {
		str = Array(len + 1 - str.length).join(pad) + str;
	}
	return str;
}

