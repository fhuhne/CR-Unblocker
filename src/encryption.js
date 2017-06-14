/**
 * Export function
 * @param  {Object} global The object that should receive the exported functions.
 */
((global) => {
	const IvLength = 16;
	const AlgorithmName = 'AES-CBC';

	/**
	 * Encrypts a text using a string key
	 * @param  {String} key       The key to encrypt the data with.
	 * @param  {String} plaintext The data to encrypt.
	 * @return {Object}           An object containing the used intialization vector and the cipher text both encoded in base64 in the properties `iv` and `cipher`.
	 */
	function encrypt(key, plaintext) {
		let keyBuffer = new TextEncoder().encode(key);
		let textBuffer = new TextEncoder().encode(plaintext);
		let iv = crypto.getRandomValues(new Uint8Array(IvLength));

		let alg = { name: AlgorithmName, iv: iv };
		return new Promise((resolve, reject) => {
			crypto.subtle.digest('SHA-256', keyBuffer)
				.then(keyHash => crypto.subtle.importKey('raw', keyHash, alg, false, ['encrypt']))
				.then(cryptoKey => crypto.subtle.encrypt(alg, cryptoKey, textBuffer))
				.then(encrypted => {
					resolve({ iv: btoa(String.fromCharCode(...iv)), cipher: btoa(String.fromCharCode(...new Uint8Array(encrypted))) });
				})
				.catch(_e => reject(_e));
		});
	}

	/**
	 * Decrypts data using a string key.
	 * @param  {String} key       The key to decrypt the data with. Must be the exact same key used for encryption.
	 * @param  {Object} encrypted An object containing the initialization vector and the cipher text both encoded in base64 in the properties `iv` and `cipher`.
	 * @return {String}           The decrypted data.
	 */
	function decrypt(key, encrypted) {
		let keyBuffer = new TextEncoder().encode(key);
		let textBuffer = Uint8Array.from(atob(encrypted.cipher), c => c.charCodeAt(0));
		let iv = Uint8Array.from(atob(encrypted.iv), c => c.charCodeAt(0));

		let alg = { name: AlgorithmName, iv: iv };
		return new Promise((resolve, reject) => {
			crypto.subtle.digest('SHA-256', keyBuffer)
				.then(keyHash => crypto.subtle.importKey('raw', keyHash, alg, false, ['decrypt']))
				.then(cryptoKey => crypto.subtle.decrypt(alg, cryptoKey, textBuffer))
				.then(decrypted => {
					resolve(new TextDecoder().decode(decrypted));
				})
				.catch(_e => reject(_e));
		});
	}

	if (!global.encrypt) {
		global.encrypt = encrypt;
	}
	if (!global.decrypt) {
		global.decrypt = decrypt;
	}
})(this || {});
