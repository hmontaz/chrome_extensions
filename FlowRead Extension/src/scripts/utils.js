function normalizeHost(host) {
    if (!host) return host; // Return empty string unchanged
    host = host.toLowerCase(); // Convert to lowercase
    host = host.trim();// Trim whitespace
    host = host.split('://')[1] || host; // Handle cases with or without protocol
    host = host.split('?')[0]; // Remove any query parameters
    // host = host.split('/')[0]; // Remove any path or query parameters
    return host.replace(/^www\./, '');// Remove 'www.' prefix if present
}

function isMatching(host, pattern) {
    if (!host || !pattern) return false;
    host = normalizeHost(host);
    pattern = normalizeHost(pattern);
    return host === pattern;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { normalizeHost };
}