// Netlify Function to safely save portfolio JSON back to GitHub
// - Requires GITHUB_TOKEN (repo scope) set in Netlify Environment variables
// - Will reject portfolio payloads that include data-URI image strings (to avoid large commits)
// - Commits to `data/portfolio.json` in the repository

const OWNER = process.env.GITHUB_REPO_OWNER || process.env.GITHUB_REPO_OWNER_DEFAULT || process.env.GIT_OWNER || 'nzasn1194';
const REPO = process.env.GITHUB_REPO_NAME || process.env.GITHUB_REPO_NAME_DEFAULT || process.env.GIT_REPO || 'ninoasan-portfolio';
const PATH = 'data/portfolio.json';

function containsDataUri(obj) {
  if (!obj) return false;
  if (typeof obj === 'string') return obj.startsWith('data:');
  if (Array.isArray(obj)) return obj.some(containsDataUri);
  if (typeof obj === 'object') return Object.values(obj).some(containsDataUri);
  return false;
}

exports.handler = async function (event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return { statusCode: 500, body: 'Server misconfigured: missing GITHUB_TOKEN' };
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch (err) {
    return { statusCode: 400, body: 'Invalid JSON' };
  }

  const portfolio = body.portfolio;
  if (!portfolio || typeof portfolio !== 'object') {
    return { statusCode: 400, body: 'Missing or invalid portfolio data' };
  }

  if (containsDataUri(portfolio)) {
    return { statusCode: 400, body: 'Portfolio contains data-URI images. Please upload images (Cloudinary) and save again.' };
  }

  const content = Buffer.from(JSON.stringify(portfolio, null, 2)).toString('base64');
  const getUrl = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${PATH}`;

  const headers = {
    Authorization: `token ${token}`,
    'User-Agent': 'netlify-function',
    Accept: 'application/vnd.github.v3+json',
    'Content-Type': 'application/json',
  };

  try {
    // Get existing file to retrieve sha
    const getRes = await fetch(getUrl, { method: 'GET', headers });
    let sha = null;
    if (getRes.status === 200) {
      const data = await getRes.json();
      sha = data.sha;
    }

    const putBody = { message: 'Update portfolio data (via Netlify)', content, committer: { name: 'Netlify', email: 'deploy@netlify.com' } };
    if (sha) putBody.sha = sha;

    const putRes = await fetch(getUrl, { method: 'PUT', headers, body: JSON.stringify(putBody) });
    if (!putRes.ok) {
      const text = await putRes.text();
      console.warn('GitHub API error', putRes.status, text);
      return { statusCode: 500, body: `GitHub API error: ${putRes.status}` };
    }

    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    console.error('Error saving portfolio', err);
    return { statusCode: 500, body: 'Internal Server Error' };
  }
};
