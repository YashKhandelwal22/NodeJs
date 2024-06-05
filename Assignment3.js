/*Original Callback-Based Code*/

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'example.txt');

// Create a file
fs.writeFile(filePath, 'Hello World', (err) => {
  if (err) {
    console.error('Error creating file:', err);
    return;
  }
  console.log('File created successfully.');

  // Read the file
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      return;
    }
    console.log('File content:', data);

    // Delete the file
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error('Error deleting file:', err);
        return;
      }
      console.log('File deleted successfully.');
    });
  });
});

/*Refactored Code Using Promises*/

const fs = require('fs').promises;
const path = require('path');

const filePath = path.join(__dirname, 'example.txt');

fs.writeFile(filePath, 'Hello World')
  .then(() => {
    console.log('File created successfully.');
    return fs.readFile(filePath, 'utf8');
  })
  .then((data) => {
    console.log('File content:', data);
    return fs.unlink(filePath);
  })
  .then(() => {
    console.log('File deleted successfully.');
  })
  .catch((err) => {
    console.error('Error:', err);
  });

/*Refactored Code Using Async/Await*/

const fs = require('fs').promises;
const path = require('path');

const filePath = path.join(__dirname, 'example.txt');

async function manageFile() {
  try {
    await fs.writeFile(filePath, 'Hello World');
    console.log('File created successfully.');

    const data = await fs.readFile(filePath, 'utf8');
    console.log('File content:', data);

    await fs.unlink(filePath);
    console.log('File deleted successfully.');
  } catch (err) {
    console.error('Error:', err);
  }
}

manageFile();
