const express = require('express');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser'); 
const { execSync } = require('child_process'); 
const app = express();
const path = require('path');
const port = 3000;

const isRequestFromServer = (req) => {
  return req.headers['user-agent'].startsWith('node-fetch');
};

// Serve the 'TotalDownloads.txt' content to the website
app.get('/getTotalDownloadsContent', (req, res) => {
  try {
    const filePath = __dirname + '/index_files/assets/TotalDownloads.txt';

    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      res.status(200).send(fileContent);
    } else {
      res.status(404).send('TotalDownloads.txt not found.');
    }
  } catch (error) {
    console.error('Error getting total downloads:', error);
    res.status(500).send('Internal server error.');
  }
});

app.use((req, res, next) => {
  if (!isRequestFromServer(req) && req.url === '/assets/TotalDownloads.txt') {
    res.status(403).send('Access Forbidden');
  } else {
    next();
  }
});

// Add the new code for creating support chat
app.post('/createChat', (req, res) => {
  const clientIP = req.ip;
  const { name } = req.body;

  // Check if the user is an agent
  if (supportAgents.includes(clientIP)) {
    try {
      const ticketID = generateTicketID();
      const folderPath = `./chat/${ticketID}`;

      fs.mkdirSync(folderPath);

      // Create index.html
      fs.writeFileSync(`${folderPath}/index.html`, generateHTML());

      // Create chat.txt
      fs.writeFileSync(`${folderPath}/chat.txt`, `Server: An Agent Will Be With ${name} Soon.\n`);

      // Send Discord message
      sendDiscordMessage(ticketID);

      res.send(`Support ticket created successfully. Ticket ID: ${ticketID}`);
    } catch (error) {
      console.error('Error creating chat:', error);
      res.status(500).send('Internal server error.');
    }
  } else {
    res.status(403).send('Unauthorized access.');
  }
});

// Helper functions remain unchanged

app.use(express.static(path.join(__dirname, 'index_files')));
app.use(express.json());
app.use(cookieParser());

app.post('/incrementTotalDownloads', (req, res) => {
  try {
    const filePath = __dirname + '/index_files/assets/TotalDownloads.txt';

    let currentDownloads = 0;
    let additionalNumber = 1;

    if (fs.existsSync(filePath)) {
      currentDownloads = parseInt(fs.readFileSync(filePath, 'utf-8')) || 0;
    }
    currentDownloads += additionalNumber;
    fs.writeFileSync(filePath, currentDownloads.toString(), 'utf-8');

    res.cookie('downloaded', 0, { maxAge: 0, httpOnly: true });

    res.status(200).send('Total downloads incremented successfully.');
  } catch (error) {
    console.error('Error incrementing total downloads:', error);
    res.status(500).send('Internal server error.');
  }
});

app.get('/getTotalDownloads', (req, res) => {
  try {
    const filePath = __dirname + '/index_files/assets/TotalDownloads.txt';

    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      res.status(200).send(fileContent);
    } else {
      res.status(404).send('TotalDownloads.txt not found.');
    }
  } catch (error) {
    console.error('Error getting total downloads:', error);
    res.status(500).send('Internal server error.');
  }
});

app.use((req, res, next) => {
  res.status(404).sendFile(__dirname + '/404.html');
});

const server = app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

process.on('SIGINT', () => {
  console.log('Server shutting down...');
  server.close(() => {
    process.exit(0);
  });
});

module.exports = app;