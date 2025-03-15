async function getUser(user) { 
  return await fetch(`https://api.twitch.tv/helix/users?login=${user}`, header)
  .then(u => u.json())
  .then(async (u) => {
    let _in = u['data'][0], 
        hex = await getUserColor(_in['id']);
    
    return {
      id: _in['id'],
      name: _in['display_name'],
      avatar: _in['profile_image_url'],
      color: hex || '#' + md5(user).slice(26)
    }
  })
  .catch(err => {
    return undefined;
  });
}

async function getUserColor(uid) {
  return await fetch(`https://api.twitch.tv/helix/chat/color?user_id=${uid}`, header)
    .then(d => d.json())
    .then(({ data }) => data[0]['color'])
    .catch(err => { return });
}

async function getClip(id) {
  const url ='https://gql.twitch.tv/gql', 
        head = {
          'Client-ID': 'kimne78kx3ncx6brgo4mv6wki5h1ko',
          'Content-Type': 'application/json',
        }
        data = `{
                  "operationName": "VideoAccessToken_Clip",
                  "variables": { 
                    "platform": "web",
                    "slug": "${id}"
                  },
                  "extensions": {
                    "persistedQuery": {
                      "version": 1,
                      "sha256Hash": "6fd3af2b22989506269b9ac02dd87eb4a6688392d67d94e41a6886f1e9f5c00f"
                    }
                  }
                }`;

  const json = 
            await fetch(url, {
              method: 'POST',
              headers: head,
              body: data,
            })
            .then(r => r.json());

  let signature = json['data']['clip']['playbackAccessToken']['signature'], 
      token = encodeURIComponent(json['data']['clip']['playbackAccessToken']['value']), 
      source = json['data']['clip']['videoQualities'][0]['sourceURL'];

  const clip_url = `${source}?sig=${signature}&token=${token}`;

  return clip_url;
}
