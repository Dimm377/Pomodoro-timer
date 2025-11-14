const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 8080;

app.use(express.static('.'));
// Endpoint daftar file audoio
app.get('/api/get-audio-files', (req, res) => {
  const musicDir = path.join(__dirname, 'music');

  fs.readdir(musicDir, (err, files) => {
    if (err) {
      console.error('Error reading music directory:', err);
      res.status(500).json({ error: 'Failed to read music directory' });
      return;
    }

    const mp3Files = files.filter(file => {
      return path.extname(file).toLowerCase() === '.mp3';
    });

    const audioFiles = mp3Files.map(file => {
      return {
        name: file,
        path: `/music/${file}`
      };
    });
    
    res.json(audioFiles);
  });
});

app.post('/api/save-audio-setting', express.json(), (req, res) => {
  const { selectedAudio } = req.body;
  console.log('Audio setting saved:', selectedAudio);
  res.json({ success: true });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log('Pomodoro timer app is now running at this address');
});