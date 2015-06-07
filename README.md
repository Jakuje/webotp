## Description

WebOTP is javascript implementation of OTP (one-time-password) in javascript Enyo framework for mobile phones, primarily for WebOS.

Application is inspired by FreeOTP for Android and iOS, some code is taken directly from RFC 6238, which describes Time-Based One-Time-Passwords algorithms.

There is used cryptographic librarly CryptoJS 3.1 [1], which is available under New BSD License.

This application can make your login into various services more safe using two-factor authentication. If you are interested, where you can use it, see [2].

## Changelog
* 1.0.2
  - Handling HOTP in better way
  - Minor changes in add/edit token scene

* 1.0.1
  - Crop canvas that was overlying other controls
  - Removed "default" services
  - Correct forms validation
  - Help scene

* 1.0.0
  - Initial release

## References

[1] https://code.google.com/p/crypto-js/

[2] https://twofactorauth.org/
