import {
  promises as fsPromises
} from 'fs'; // Import the 'fs.promises' module
import {
  stringify
} from 'csv-stringify';

import {
  Client,
  GatewayIntentBits
} from 'discord.js';


import initCycleTLS from 'cycletls';
import tough from 'tough-cookie';


async function processCookies(response, url, cookieJar) {
  if (response.headers["Set-Cookie"] instanceof Array) {
    response.headers["Set-Cookie"].map(
      async (cookieString) => await cookieJar.setCookie(cookieString, url)
    );
  } else {
    await cookieJar.setCookie(response.headers["Set-Cookie"], url);
  }
}
const Cookie = tough.Cookie;
async function fetchDataFromAPI() {
  // Initiate CycleTLS
  const cycleTLS = await initCycleTLS();
  const cookieJar = new tough.CookieJar();


  // Original 'ja3' value
  const originalJa3 = '771,4865-4866-4867-49195-49199-49196-49200-52393-52392-49171-49172-156-157-47-53,45-65281-27-0-35-51-23-16-17513-10-13-11-18-43-5,29-23-24,0';

  // Split the originalJa3 string by commas to work on individual parts
  const parts = originalJa3.split(',');

  // Split the third part (the one you want to randomize) by hyphens
  const thirdPart = parts[2].split('-');
  // Remove the '0' from the thirdPart
  // const zeroPart = thirdPart.shift();

  // Shuffle the remaining numbers within the thirdPart
  for (let i = 0; i < thirdPart.length; i++) {
    const j = Math.floor(Math.random() * thirdPart.length);
    [thirdPart[i], thirdPart[j]] = [thirdPart[j], thirdPart[i]];
  }

  // Join the shuffled third part back together with hyphens and add the '0-' at the beginning
  const shuffledThirdPart = `${thirdPart.join('-')}`;

  // Reconstruct the original string with the shuffled part
  const shuffledJa3 = `${parts[0]},${parts[1]},${shuffledThirdPart},${parts[3]},${parts[4]}`;





  // Create the headers object with the initial headers
  const headers = {
    "sec-ch-ua": "\"Chromium\";v=\"118\", \"Google Chrome\";v=\"118\", \"Not=A?Brand\";v=\"99\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "Windows",
    "upgrade-insecure-requests": "1",
    "accept": "application/json, text/plain, */*",
    "sec-fetch-site": "same-origin",
    "sec-fetch-mode": "cors",
    "sec-fetch-user": "?1",
    "sec-fetch-dest": "empty",
    "Sec-Ch-Ua-Mobile":"?0",
    "Sec-Ch-Ua-Platform": "Windows",

    "referer": "https://kick.com/iqd964/",
    "accept-encoding": "gzip, deflate, br",
    "accept-language": "en-US,en;q=0.9,ar;q=0.8,es;q=0.7"
  };

  // const headers =
  //   {

  //     "sec-ch-ua": "\"Chromium\";v=\"118\", \"Google Chrome\";v=\"118\", \"Not=A?Brand\";v=\"99\"",
  //     "sec-ch-ua-mobile": "?0",
  //     "sec-ch-ua-platform": "Windows",
  //     "upgrade-insecure-requests": "1",
  //     "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36",
  //     "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
  //     "sec-fetch-site": "same-origin",
  //     "sec-fetch-mode": "navigate",
  //     "sec-fetch-user": "?1",
  //     "sec-fetch-dest": "document",
  //     "accept-encoding": "gzip, deflate, br",
  //     "accept-language": "en-US,en;q=0.9,ar;q=0.8,es;q=0.7"
  //   };


  // Configure the r
  // Send request
  const apiResponse = await cycleTLS('https://kick.com/api/v2/channels/243615/messages', {
    body: '',
    ja3: shuffledJa3,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36',
    headers: headers,
    headerOrder: ["method", "authority", "scheme", "path"]

  }, 'get');
  if (apiResponse.status !== 200) {
    await processCookies(
      apiResponse,
      "https://kick.com/api/v2/channels/243615/messages",
      cookieJar
    );

    // Update the headers object with the new cookies
    headers.cookie = await cookieJar.getCookieString("https://kick.com/api/v2/channels/243615/messages");
    console.log('trying with cookies',headers)
    // Re-send the request with the updated headers
    return cycleTLS('https://kick.com/api/v2/channels/243615/messages', {
      body: '',
      ja3: shuffledJa3,
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36',
      headers: headers,
      headerOrder: ["method", "authority", "scheme", "path"]
    }, 'get');
  }


  // Cleanly exit CycleTLS
  cycleTLS.exit();
  return apiResponse;
}


const csv_filename = 'user_data.csv';

async function saveTestData() {
  try {
    // Test data
    const testData = [{
        name: 'Alice',
        age: 30,
        city: 'New York'
      },
      {
        name: 'Bob',
        age: 25,
        city: 'Los Angeles'
      },
      {
        name: 'Charlie',
        age: 35,
        city: 'Chicago'
      },
    ];

    // Define column headers
    const columns = ['name', 'age', 'city'];

    // Use csv-stringify to convert the test data to CSV format with headers
    const csvData = await stringify(testData, {
      columns,
      header: true
    });

    // Write the CSV data to the file
    await fsPromises.writeFile(csv_filename, csvData);

    console.log(`Test data saved to ${csv_filename}`);
  } catch (error) {
    console.error('Error saving test data:', error);
  }
}

// Call the function to save the test data
// saveTestData();

const client = new Client({
  intents: [GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// Function to generate a random 6-digit code
function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000);
}



async function createEmptyFileIfNotExists(filename) {
  try {
    await fsPromises.access(filename); // Check if the file exists
  } catch (err) {
    // File doesn't exist; create an empty file
    await fsPromises.writeFile(filename, '');
    console.log(`Created empty file: ${filename}`);
  }
}
async function deleteUserDataByIndex(indexToDelete) {
  try {

    // Read existing user data from the CSV
    const data = await fsPromises.readFile(csv_filename, 'utf-8');
    const rows = data.trim().split('\n');
    const headers = rows.shift().split(',');

    const userRecords = rows.map((row) => {
      const values = row.split(',');
      const userRecord = {};

      headers.forEach((header, index) => {
        userRecord[header] = values[index];
      });

      return userRecord;
    });

    // Check if the provided index is within the valid range
    if (indexToDelete >= 0 && indexToDelete < userRecords.length) {
      // Delete the record at the specified index
      userRecords.splice(indexToDelete, 1);

      // Prepare the updated data as an array of objects
      const updatedData = userRecords;

      // Define the column headers
      const columns = ['discordUserId', 'verificationCode', 'otherPlatformUsername', 'isLinked'];

      // Use csv-stringify to convert the updated data to CSV format with headers
      const csvData = await stringify(updatedData, {
        columns,
        header: true,
      });

      // Write the updated CSV data back to the file
      await fsPromises.writeFile(csv_filename, csvData);

      console.log('User data deleted successfully.');
    } else {
      console.error('Invalid index provided for deletion.');
    }
  } catch (error) {
    console.error('Error deleting user data:', error.message);
    return error.message; // Return the error message
  }
}
async function editUserDataByIndex(indexToEdit, updatedData) {
  try {

    // Read existing user data from the CSV
    const data = await fsPromises.readFile(csv_filename, 'utf-8');
    const rows = data.trim().split('\n');
    const headers = rows.shift().split(',');

    const userRecords = rows.map((row) => {
      const values = row.split(',');
      const userRecord = {};

      headers.forEach((header, index) => {
        userRecord[header] = values[index];
      });

      return userRecord;
    });

    // Check if the provided index is within the valid range
    if (indexToEdit >= 0 && indexToEdit < userRecords.length) {
      // Update the user record at the specified index with the provided data
      userRecords[indexToEdit] = updatedData;

      // Prepare the updated data as an array of objects
      const updatedUserData = userRecords;

      // Define the column headers
      const columns = ['discordUserId', 'verificationCode', 'otherPlatformUsername', 'isLinked'];

      // Use csv-stringify to convert the updated data to CSV format with headers
      const csvData = await stringify(updatedUserData, {
        columns,
        header: true,
      });

      // Write the updated CSV data back to the file
      await fsPromises.writeFile(csv_filename, csvData);

      console.log('User data edited successfully.');
    } else {
      console.error('Invalid index provided for editing.');
    }
  } catch (error) {
    console.error('Error editing user data:', error.message);
    return error.message; // Return the error message
  }
}

async function updateUserData(discordUserId, verificationCode, otherPlatformUsername, isLinked) {
  try {
    createEmptyFileIfNotExists(csv_filename);

    // Read existing user data from the CSV
    const data = await fsPromises.readFile(csv_filename, 'utf-8');
    const rows = data.trim().split('\n');
    const headers = rows.shift().split(',');

    const userRecords = rows.map((row) => {
      const values = row.split(',');
      const userRecord = {};

      headers.forEach((header, index) => {
        userRecord[header] = values[index];
      });

      return userRecord;
    });


    const existingdiscordRecord = userRecords.find(
      (userRecord) => userRecord.discordUserId === discordUserId
    );
    
      
   // check an existing record with the same platform username then reject the entire request
   if(otherPlatformUsername != null){
    const existingUserRecord = userRecords.find(
      (userRecord) => userRecord.otherPlatformUsername === otherPlatformUsername
    );
    if (existingUserRecord?.otherPlatformUsername == otherPlatformUsername ){
      //here should we remove the previous recorded information with that discord id
      deleteUserDataByIndex(userRecords.indexOf(existingdiscordRecord))
      
      throw new Error('This this kick account is already linked.',);

    } 
  }
    if(existingdiscordRecord?.discordUserId == undefined ){

       // Create a new user record
       const newUserRecord = {
        discordUserId: discordUserId,
        verificationCode: verificationCode,
        otherPlatformUsername: otherPlatformUsername,
        isLinked: isLinked.toString(),
      };

      userRecords.push(newUserRecord);
      console.log('this user not recorded ')
    }
    else if(existingdiscordRecord.otherPlatformUsername == ''){
       console.log('this user recorded but still not linked')

       if(isLinked){
        //if its true then update cuz this means everything done well and the otherPlatformUsername not used before
        const updatedData = {
          discordUserId: discordUserId,
          verificationCode: verificationCode,
          otherPlatformUsername: otherPlatformUsername,
          isLinked: isLinked.toString(),
        };
        editUserDataByIndex(userRecords.indexOf(existingdiscordRecord) ,updatedData)
        console.log('this user recorded and now linked')

       }
    }
    else if (existingdiscordRecord.otherPlatformUsername !== ''){
      console.log('this user recorded and linked')
      throw new Error('This  discord account is already linked.');

    }

    // Prepare the updated data as an array of objects
    const updatedData = userRecords;

    // Define the column headers
    const columns = ['discordUserId', 'verificationCode', 'otherPlatformUsername', 'isLinked'];

    // Use csv-stringify to convert the updated data to CSV format with headers
    const csvData = await stringify(updatedData, {
      columns,
      header: true,
    });

    // Write the updated CSV data back to the file
    await fsPromises.writeFile(csv_filename, csvData);

    console.log('User data updated successfully.');
  } catch (error) {
    console.error('Error updating user data:', error.message);
    return error.message; // Return the error message
  }
}


// Event handler for when the bot is ready

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

// Event handler for when a message is received
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  
  const user = await message.author.fetch(); // Fetch the user object

  console.log(message.content)
  // Check if the message starts with the !verify command
  if (message.content.startsWith('!verify')) {
    // Generate a random 6-digit verification code
    const verificationCode = generateVerificationCode();

    // Record the verification code with the user's Discord ID
    const userId = message.author.id;
    const errorMessage = await updateUserData(userId, verificationCode, null, false);
    if (errorMessage) {
     user.send('Error updating user data:' + errorMessage);

      return;
    }
    // Reply to the user with the verification code
    user.send(` Your verification code is: !verify ${verificationCode} and expire in 5min \n https://kick.com/iqd964/chatroom
        `);

    // Check the API endpoint for the verification code and username
    // (You should implement this part using the API request and response)
    const apiResponse = await fetchVerificationDataFromAPI(verificationCode);
    console.log('apiresponse', apiResponse)

    if (apiResponse) {
      const {
        username,
        isLinked
      } = apiResponse;

      // Update user data with the received information and set is_linked to true
      const errorMessage = await updateUserData(userId, verificationCode, username, isLinked);
      if (errorMessage) {
       user.send('Error updating user data:' + errorMessage);
        return;
      }

      // Find the guild (server) where you want to assign the role
      const guild = message.guild;

      // Find the member (user) who sent the message
      const member = message.member;

      // Find the role by its ID
      // const role = guild.roles.cache.get(1158892295052075168);
      const role = member.guild.roles.cache.find(role => role.name === "kick");

      if (member && role) {
        // Assign the role to the member
        await member.roles.add(role);
        try {
          await member.setNickname(username);
        } catch (error) {
          console.error('Error:', error);
        }
        // Change the nickname (username) of the member

      }
      // Reply to the user that their account is now linked
     user.send(`Your account is now linked with username '${username}'.`);

    } else {
      // Handle the case where the API response does not contain the expected data
     user.send('Unable to verify your account. Please try again later.');
    }
  }
});

// Function to fetch verification data from the API
async function fetchVerificationDataFromAPI(verificationCode) {
  let R = null;
  try {

    const totalTime = 5 * 60 * 1000; // 5 minutes in milliseconds
    const fetchInterval = Math.floor(Math.random() * 15) * 10000; // seconds in milliseconds
    let elapsedTime = 0;
    let foundCode = false; // Flag to indicate if a code match is found

    while (elapsedTime < totalTime && !foundCode) {

      try {
        const response = await fetchDataFromAPI();
        if (response.status === 200) {
          console.log('fetch msg')


          
          const messages = response.body.data.messages;
          // console.log('response',data)

          messages.forEach((message) => {
            const content = message.content;

            // Use regex to find a 6-digit code in the message content
            const codeMatch = content.match(/!verify\s+(\d{6})/);
            
            if (!codeMatch || !codeMatch[1]) {
              

              console.log("No valid !verify followed by a 6-digit code found in the content. Skipping to the next message.");
              // Skip to the next iteration of the loop
              return; // This will move to the next message in the 'messages' array
            }
            const codeString = codeMatch[1]; // Assuming the matched code is in the first position of the array
            // Converting the matched code from string to integer
            const codeInteger = parseInt(codeString, 10);
            if (codeInteger == verificationCode) {
              console.log('code match done')
              foundCode = true; // Set the flag to exit the loop

              R = {
                username: message.sender.username,
                isLinked: true, // Assuming that a successful API response indicates a linked account
              };

              return;

            }
          })
        }else {

          console.log(response)


        }
        // Continue with your logic using 'username' and 'isLinked'
      } catch (error) {
        console.error('Error:', error);
      }
      elapsedTime += fetchInterval;

      // Sleep for the specified interval before the next fetch
      await new Promise((resolve) => setTimeout(resolve, fetchInterval));

    }

  } catch (error) {
    console.error('Error fetching data from API:', error);
  }
  return R;
}

// Log in using your bot token
client.login(process.env.BOT_TOKEN);
