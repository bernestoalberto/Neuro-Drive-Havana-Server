import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import multer from 'multer';
const singleUpload = multer().single('avatar');
const PORT = 8000;

// Loading modules

import { analyzeData } from './analyze.js';
import {
  semanticSearch,
  geminiSemanticSearch,
  openAISemanticSearch,
  llamaSemanticSearch,
} from './search.js';

// Multer Configuration
const storage = multer.diskStorage({
  destination: function (
    req: any,
    file: any,
    cb: (arg0: null, arg1: string) => void
  ) {
    cb(null, 'uploads/'); // Store images in an 'uploads' folder
  },
  filename: function (
    req: any,
    file: { originalname: any },
    cb: (arg0: null, arg1: any) => void
  ) {
    cb(null, file.originalname); // Maintain original filename
  },
});
// Multer Setup (For handling file uploads)
const upload = multer({ storage });
// const upload = multer({ dest: 'uploads/' });

// Middleware
const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors());
app.use(bodyParser.json()); // Middleware for parsing JSON request bodies
app.post('/profile', upload.single('avatar'), function (req, res, next) {
  singleUpload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
    } else if (err) {
      // An unknown error occurred when uploading.
    }

    // Everything went fine.
  });
});
app.post(
  '/photos/upload',
  upload.array('photos', 12),
  (req: { body: { file: File; query: any } }, res: any, next: any) => {
    if (!req.body.file) {
      res.status(400).send('Error: No file uploaded.');
    } else {
      res.send('Image uploaded successfully!');
    }
  }
);

app.post(
  '/setCustomClaims',
  async (
    req: { body: { idToken: any } },
    res: { end: (arg0: string) => void }
  ) => {
    // Get the ID token passed.
    const idToken = req.body.idToken;

    // Verify the ID token and decode its payload.
    const claims = await getAuth().verifyIdToken(idToken);

    // Verify user is eligible for additional privileges.
    if (
      typeof claims.email !== 'undefined' &&
      typeof claims.email_verified !== 'undefined' &&
      claims.email_verified &&
      claims.email.endsWith('@admin.example.com')
    ) {
      // Add custom claims for additional privileges.
      await getAuth().setCustomUserClaims(claims.sub, {
        admin: true,
      });

      // Tell client to refresh token on user.
      res.end(
        JSON.stringify({
          status: 'success',
        })
      );
    } else {
      // Return nothing.
      res.end(JSON.stringify({ status: 'ineligible' }));
    }
  }
);
app.post('/llama', async (req: { body: { query: any } }, res: any) => {
  try {
    const result = await llamaSemanticSearch(req.body.query);
    console.log({ result });
    res.json({ result });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});
app.post('/gemini', async (req: { body: { query: any } }, res: any) => {
  try {
    const result = await geminiSemanticSearch(req.body.query);
    console.log({ result });
    res.json({ result });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});
app.post('/openai', async (req: { body: { query: any } }, res: any) => {
  try {
    const result = await openAISemanticSearch(req.body.query);
    console.log({ result });
    res.json({ result });
  } catch (error) {
    console.error('Error with ChatGPT request:', error);
    res.status(500).send('Error communicating with ChatGPT');
  }
});

app.post('/search', async (req: { body: { query: any } }, res: any) => {
  try {
    const result = await semanticSearch(req.body.query);
    console.log({ result });
    res.json({ result });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});
app.post('/analyze', async (req: { body: { query: any } }, res: any) => {
  console.log(req.body.query.text);
  try {
    const analysis = await analyzeData(req.body.query.text);
    console.log(analysis);
    res.json(analysis);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

function getAuth(): any {
  return getAuth()
    .getUserByEmail('user@admin.example.com')
    .then((user: any) => {
      // Confirm user is verified.
      if (user.emailVerified) {
        // Add custom claims for additional privileges.
        // This will be picked up by the user on token refresh or next sign in on new device.
        return getAuth().setCustomUserClaims(user.uid, {
          admin: true,
        });
      }
    })
    .catch((error: any) => {
      console.log(error);
    });
}
