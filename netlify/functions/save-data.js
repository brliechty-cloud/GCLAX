const crypto = require('crypto');

const GITHUB_OWNER = 'brliechty-cloud';
const GITHUB_REPO = 'GCLAX';
const FILE_PATH = 'src/site-data.json';

const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
};

exports.handler = async function (event) {
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers: CORS_HEADERS, body: '' };
    }

    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Method not allowed' }) };
    }

    let body;
    try {
        body = JSON.parse(event.body);
    } catch {
        return { statusCode: 400, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Invalid JSON' }) };
    }

    // Verify password against env var hash
    const expectedHash = process.env.ADMIN_PASSWORD_HASH;
    if (!expectedHash) {
        return { statusCode: 500, headers: CORS_HEADERS, body: JSON.stringify({ error: 'ADMIN_PASSWORD_HASH not set in Netlify env vars' }) };
    }
    const hash = crypto.createHash('sha256').update(body.password || '').digest('hex');
    if (hash !== expectedHash) {
        return { statusCode: 401, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Incorrect password' }) };
    }

    const token = process.env.GITHUB_TOKEN;
    if (!token) {
        return { statusCode: 500, headers: CORS_HEADERS, body: JSON.stringify({ error: 'GITHUB_TOKEN not set in Netlify env vars' }) };
    }

    const apiUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${FILE_PATH}`;
    const ghHeaders = {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'GCLax-Admin'
    };

    // Get current file SHA (required by GitHub API to update a file)
    const getRes = await fetch(apiUrl, { headers: ghHeaders });
    if (!getRes.ok) {
        return { statusCode: 500, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Could not read file from GitHub' }) };
    }
    const { sha } = await getRes.json();

    // Commit updated file
    const content = Buffer.from(JSON.stringify(body.data, null, 2)).toString('base64');
    const putRes = await fetch(apiUrl, {
        method: 'PUT',
        headers: { ...ghHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'Update site content via admin', content, sha })
    });

    if (!putRes.ok) {
        const err = await putRes.text();
        return { statusCode: 500, headers: CORS_HEADERS, body: JSON.stringify({ error: 'GitHub update failed: ' + err }) };
    }

    return { statusCode: 200, headers: CORS_HEADERS, body: JSON.stringify({ success: true }) };
};
