import { TIMOUT_SECONDS } from './config.js';
function timeout(s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
}

export async function AJAX(url, uploadData = undefined) {
  try {
    const res = uploadData
      ? await Promise.race([
          fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(uploadData),
          }),
          timeout(TIMOUT_SECONDS),
        ])
      : await Promise.race([fetch(url), timeout(TIMOUT_SECONDS)]);
    const data = await res.json();
    if (!res.ok) throw new Error(`${data.message}: ${res.status}`);
    return data;
  } catch (err) {
    throw err;
  }
}
/*
export async function getJSON(url) {
  try {
    const res = await Promise.race([fetch(url), timeout(TIMOUT_SECONDS)]);
    const data = await res.json();
    if (!res.ok) throw new Error(`${data.message}: ${res.status}`);
    return data;
  } catch (err) {
    throw err;
  }
}
export async function sendJSON(url, uploadData) {
  try {
    const res = await Promise.race([
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(uploadData),
      }),
      timeout(TIMOUT_SECONDS),
    ]);
    const data = await res.json();
    if (!res.ok) throw new Error(`${data.message}: ${res.status}`);
    return data;
  } catch (err) {
    throw err;
  }
}
*/
