
const initCycleTLS = require('cycletls');
// Typescript: import initCycleTLS from 'cycletls';
async function api (){
  // Initiate CycleTLS
  const cycleTLS = await initCycleTLS();

  // Send request
   apiResponse = await cycleTLS('https://kick.com/api/v2/channels/243615/messages', {
    body: '',
    ja3: '771,4865-4867-4866-49195-49199-52393-52392-49196-49200-49162-49161-49171-49172-51-57-47-53-10,0-23-65281-10-11-35-16-5-51-43-13-45-28-21,29-23-24-25-256-257,0',
    userAgent: 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:87.0) Gecko/20100101 Firefox/87.0',
    headers: {
    
        "cache-control": "no-cache",
        "upgrade-insecure-requests": "1",
        "Accept":" application/json, text/plain, */*",
        "sec-fetch-site":" none",
        "sec-fetch-mode":" navigate",
        "sec-fetch-user":" ?1",
        "sec-fetch-dest":" document",
        "accept-encoding":" gzip, deflate, br",
        "accept-language":" de,en-US;q=0.7,en;q=0.3",
        "pragma":" no-cache",
        "te":" trailers",
        "user-agent":" Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:87.0) Gecko/20100101 Firefox/87.0"
    }   ,
    headerOrder: ["connection", "host"]

  }, 'get');

  // Cleanly exit CycleTLS
  cycleTLS.exit();
  return apiResponse;
}

(async () => {
 const  apiResponse = await api();
 console.log(apiResponse.body.data)
})();


