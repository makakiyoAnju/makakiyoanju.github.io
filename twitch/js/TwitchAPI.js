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
