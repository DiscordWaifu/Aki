'use strict';

const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const readFileAsync = (filePath) => new Promise((resolve, reject) => {
	fs.readFile(filePath, (err, data) => {
		if (err) return reject(err);
		return resolve(data);
	});
});

/**
 * Class for creating and verifying JSON web tokens
 * Call loadCert() before using sign() or verify()
 */
class JWT {

	/**
     * Creates a new JWT handler instance
     *
     * @param {string} algorithm The algorithm to be used. If undefined RS256 will be used as algorithm.
     */
	constructor(algorithm) {
		this.cert = null;
		this.pubCert = null;
		this.algorithm = algorithm || 'RS256';
	}

	/**
     * Loads the certificate from the given file path
     *
     * @param {string} privCertFilePath The path where the cert is located
     * @param {string} pubCertFilePath The path where the public cert is located if algorithm is asym
     */
	async loadCert(privCertFilePath, pubCertFilePath) {
		if (privCertFilePath) this.cert = await readFileAsync(path.resolve(privCertFilePath));
		if (pubCertFilePath) this.pubCert = await readFileAsync(path.resolve(pubCertFilePath));
	}

	/**
     * Signs a payload and returns a JSON web token
     *
     * @param {Object} payload The payload to be signed
     * @returns {Promise<string>} The JSON web token
     */
	sign(payload) {
		return new Promise((resolve, reject) => {
			if (!this.cert) return reject(Error('Certificate not loaded yet.'));
			return jwt.sign(payload, this.cert, { algorithm: this.algorithm }, (err, token) => {
				if (err) return reject(err);
				return resolve(token);
			});
		});
	}

	/**
     * Verifies a JSON web token and returns its payload
     *
     * @param {string} token The JSON web token
     * @returns {Promise<Object|Error>} The payload
     */
	verify(token) {
		return new Promise((resolve, reject) => {
			const cert = this.pubCert ? this.pubCert : this.cert;
			if (!this.cert) return reject(Error('Certificate not loaded yet.'));
			return jwt.verify(token, cert, { algorithm: this.algorithm }, (err, decoded) => {
				if (err) return reject(err);
				return resolve(decoded);
			});
		});
	}

	/**
     * Decodes a JSON web token
     *
     * WARNING: DO NOT USE THIS FUNCTION FOR UNTRUSTED TOKENS
     * ONLY USE THIS FUNCTION FOR GETTING THE DATA
     * USE verify() IF YOU HAVE AN UNTRUSTED TOKEN
     *
     * @param {string} token The JSON web token
     * @returns {Object} The payload
     */
	decode(token) {
		return jwt.decode(token);
	}

}

module.exports = JWT;
