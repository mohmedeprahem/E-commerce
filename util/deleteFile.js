const fs = require('fs');
const path = require('path')

exports.deleteFiles=  (files) => {
  for (const file of files) {
    const filePath = path.join(__dirname, '../', file.path);
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      console.log('File deleted successfully:', filePath);
    } catch (err) {
        console.error('Error deleting file:', filePath, err);
    }
  }
}