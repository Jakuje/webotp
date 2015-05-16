enyo.kind({
	kind: enyo.Component,
	name: "WebOTP.Crypto",
	service: null,
	getPIN: function(service){
		this.service = service;
		if (service.type == 0) { // TOTP
			var time = new Date().getTime() / 1000.0 / service.interval;
			var counter = Math.floor(time);
			return this.getHOTPbase32(service.algorithm, service.digits, service.secret, counter);
		} else { // HOTP
			service.counter++;
			this.doStore();
			return this.getHOTPbase32(service.algorithm, service.digits, service.secret, service.counter);
		}
	},
	getAlgorithm: function(algorithm){
		switch (algorithm){
			case "SHA1":
				return CryptoJS.HmacSHA1;
			case "MD5":
				return CryptoJS.HmacMD5;
			case "SHA256":
				return CryptoJS.HmacSHA256;
			case "SHA512":
				return CryptoJS.HmacSHA512;
			default:
				return null;
		}
	},
	getHOTPbase32: function(algorithm, digits, key, counter) {
		var hexKey = base32tohex(key);
		return this.getHOTP(algorithm, digits, hexKey, counter);
	},
	getHOTP: function(algorithm, digits, hexKey, counter) {
		// create the HMAC
		var digest = [];

		var wordKey = CryptoJS.enc.Hex.parse(hexKey);

		var hexCounter = leftpad(dec2hex(counter), 16, '0');
		var wordCounter = CryptoJS.enc.Hex.parse(hexCounter);

		var hmac = this.getAlgorithm(algorithm);
		var wordDigest = hmac(wordCounter, wordKey);
		var digest = wordDigest.toString(CryptoJS.enc.Hex);

		// Truncate
		var offset = hex2dec(digest[digest.length-1]);
		var otp = (hex2dec(digest.substr(offset * 2, 8)) & hex2dec('7fffffff')) + '';
		otp = otp.substr(otp.length - digits, digits);
		otp = leftpad(otp, digits, '0');
		return otp;
	},
	test: function() {
		// test vectors from https://tools.ietf.org/html/rfc6238
		var seed = "3132333435363738393031323334353637383930";
		// Seed for HMAC-SHA256 - 32 bytes
		var seed32 = "3132333435363738393031323334353637383930" +
			"313233343536373839303132";
		// Seed for HMAC-SHA512 - 64 bytes
		var seed64 = "3132333435363738393031323334353637383930" +
			"3132333435363738393031323334353637383930" +
			"3132333435363738393031323334353637383930" +
			"31323334";
		var testTime = [59, 1111111109, 1111111111, 1234567890, 2000000000, 20000000000];
		var X = 30;
		var T0 = 0;
		console.log("+---------------+-----------------------+" +
			"------------------+--------+--------+");
		console.log("|  Time(sec)    |   Time (UTC format)   " +
			"| Value of T(Hex)  |  TOTP  | Mode   |");
		console.log("+---------------+-----------------------+" +
			"------------------+--------+--------+");
		for (var i = 0; i < testTime.length; i++) {
			var T = Math.floor((testTime[i] - T0)/X);
			var steps = leftpad(dec2hex(T), 16, 0);
			var utcTime = new Date(testTime[i]*1000).toUTCString();
			var fmtTime = leftpad(testTime[i], 16, ' ');
			console.log("|  " + fmtTime + "  |  " + utcTime + "  | " + steps + " | " 
			+ this.getHOTP("SHA1", 8, seed, T) + "| SHA1   |");
			console.log("|  " + fmtTime + "  |  " + utcTime + "  | " + steps + " | "
			+ this.getHOTP("SHA256", 8, seed32, T) + "| SHA256 |");
			console.log("|  " + fmtTime + "  |  " + utcTime + "  | " + steps + " | "
			+ this.getHOTP("SHA512", 8, seed64, T) + "| SHA512 |");
			console.log("+---------------+-----------------------+" +
			"------------------+--------+--------+");
		}
	},
	validateBase32: function(value) {
		var base32chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
		var newValue = "";
		for (var i = 0; i < value.length; i++) {
			if (base32chars.indexOf(value.charAt(i).toUpperCase()) != -1){
				newValue += value.charAt(i).toUpperCase();
			}
		}
		return newValue;
	}
});
