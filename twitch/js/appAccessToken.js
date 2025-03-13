let twitch = fetch('https://makakiyoanju.github.io/int/twitchCredentials.json').then(r => r.json()),
    clientId = twitch['client']['id'];
    clientSecret = twitch['client']['secret'];
    scopes = "";

async function getAppAccessToken() {
  const params = new URLSearchParams();
    params.append('client_id', clientId);
    params.append('client_secret', clientSecret);
    params.append('grant_type', 'client_credentials');
    params.append('scope', scopes);

  try {
    const response = await fetch('https://id.twitch.tv/oauth2/token', {
      method: 'POST',
      body: params,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}, message: ${data.message}`);
    }

    return data.access_token;
  } catch (error) {
    console.error('Error fetching app access token:', error);
    throw error; // Re-throw to handle it in the calling function
  }
}

async function callTwitchAPI(endpoint, accessToken) {
  try {
    const response = await fetch(endpoint, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Client-Id': clientId
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message || 'Unknown error'}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error calling Twitch API at ${endpoint}:`, error);
    throw error;
  }
}
