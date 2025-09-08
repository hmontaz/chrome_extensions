const assert = require('assert');
const { normalizeHost } = require('../src/scripts/utils.js');

describe('normalizeHost', () => {
    it('trims whitespace', () => {
        assert.strictEqual(normalizeHost('  www.example.com  '), 'example.com');
    })

    it('removes http:// prefix', () => {
        assert.strictEqual(normalizeHost('http://www.example.com'), 'example.com');
        assert.strictEqual(normalizeHost('https://www.example.com'), 'example.com');
    })

    it('removes www and lowercases', () => {
        assert.strictEqual(normalizeHost('WWW.Google.com'), 'google.com');
    });

    it('keeps non-www domains intact', () => {
        assert.strictEqual(normalizeHost('sub.example.org'), 'sub.example.org');
    });

    it('removes query parameters', () => {
        assert.strictEqual(normalizeHost('https://www.example.com/path/to/resource?query=param'), 'example.com/path/to/resource');
    });

    it('returns empty string unchanged', () => {
        assert.strictEqual(normalizeHost(''), '');
    });
});
