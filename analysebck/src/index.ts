import express from 'express';
import multer from 'multer';
import { analyzeCode } from '../../analyseext/analysecode/src/analyze';
import path from 'path';
import fs from 'fs';

const app = express();
const PORT = process.env.PORT || 3000;
const upload = multer({ dest: 'uploads/' });

app.use(express.static('frontend/build'));

app.post('/api/code-analysis', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const filePath = req.file.path;
  const code = fs.readFileSync(filePath, 'utf8');
  const isReact = path.extname(req.file.originalname) === '.jsx' || path.extname(req.file.originalname) === '.js'; // Adjust logic as needed
  try {
    const result = await analyzeCode(code, isReact);
    fs.unlinkSync(filePath); // Delete the file after analysis
    res.json(result);
  } catch (error) {
    fs.unlinkSync(filePath); // Ensure the file is deleted in case of an error
    res.status(500).send('Error analyzing code');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
