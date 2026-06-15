// Netlify Function to save portfolio JSON back to GitHub repository
// Requires a GitHub Personal Access Token set as an environment variable named GITHUB_TOKEN
// and writes to 'data/portfolio.json' in the repository.

const OWNER = process.env.GITHUB_REPO_OWNER || 'nzasn1194';
const REPO = process.env.GITHUB_REPO_NAME || 'ninoasan-portfolio';
const PATH = 'data/portfolio.json';

exports.handler = async function (event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return { statusCode: 500, body: 'Server missing configuration (GITHUB_TOKEN)' };
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch (err) {
    return { statusCode: 400, body: 'Invalid JSON' };
  }

  const portfolio = body.portfolio;
  if (!portfolio) {
    return { statusCode: 400, body: 'Missing portfolio data' };
  }

  const content = Buffer.from(JSON.stringify(portfolio, null, 2)).toString('base64');
  const fetchOpts = (method, url, extra) => ({
    method,
    headers: {
      Authorization: `token ${token}`,
      'User-Agent': 'netlify-function',
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    },
    body: extra ? JSON.stringify(extra) : undefined,
  });

  const getUrl = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${PATH}`;

  try {
    // Check if file exists to get sha
    const getRes = await fetch(getUrl, fetchOpts('GET', getUrl));
    let sha = null;
    if (getRes.status === 200) {
      const data = await getRes.json();
      sha = data.sha;
    }

    const commitMessage = 'Update portfolio data (via Netlify function)';
    const putBody = { message: commitMessage, content, committer: { name: 'Netlify', email: 'deploy@netlify.com' } };
    if (sha) putBody.sha = sha;

    const putRes = await fetch(getUrl, fetchOpts('PUT', getUrl, putBody));
    if (!putRes.ok) {
      const errText = await putRes.text();
      console.warn('GitHub API error', putRes.status, errText);
      return { statusCode: 500, body: `GitHub API error: ${putRes.status}` };
    }

    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    console.error('Save portfolio error', err);
    return { statusCode: 500, body: 'Internal Server Error' };
  }
};
