import express, { type Request, type Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import { getAuth } from 'firebase-admin/auth';
import multer from 'multer';
const singleUpload = multer().single('avatar');
const PORT = 8000;

// Loading modules
import { analyzeData } from './analyze.ts';
import {
  geminiImageVision,
  geminiSemanticSearch,
  llamaSemanticSearch,
  openAImageVision,
  openAISemanticSearch,
  semanticSearch,
  claudeSemanticSearch,
} from './search.ts';
import { CLAUDE, DEEPSEEK, GEMINI, LLAMA, OPENAI } from './helper.ts';
import { textToImage } from './gemini.ts';
import { openAiTextToImage } from './chatgpt.ts';

// Multer Configuration
const storage = multer.diskStorage({
  destination: function (
    req: Request,
    file: any,
    cb: (arg0: null, arg1: string) => void
  ) {
    req.query;
    const ui = file;
    cb(null, 'server/uploads/'); // Store images in an 'uploads' folder
  },
  filename: function (
    req: Request,
    file: { originalname: any },
    cb: (arg0: null, arg1: any) => void
  ) {
    let peter = req.query;
    cb(null, file.originalname); // Maintain original filename
  },
});

// Multer Setup (For handling file uploads)
const upload = multer({
  storage,
  limits: { fileSize: 2000000 },
});

// Middleware
const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(helmet());
app.use(cors());
app.use(bodyParser.json()); // Middleware for parsing JSON request bodies
app.post('/profile', upload.single('avatar'), function (req, res) {
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
  //   upload.array('thumbnail', 12),
  upload.single('thumbnail'),
  async (
    req: { file: Express.Multer.File; body: { query: any } },
    res: any
  ) => {
    if (!req.file) {
      res.status(400).send('Error: No file uploaded.');
    } else {
      const body = JSON.parse(req.body.query);
      const { model, message, typeOfAI } = body;
      let result = '';
      switch (typeOfAI) {
        case GEMINI:
          result = await geminiImageVision(
            model,
            message,
            typeOfAI,
            `${req.file.destination}${req.file.filename}`,
            req.file.mimetype
          );
          break;
        case OPENAI:
          result = await openAImageVision(
            model,
            message,
            `${req.file.destination}${req.file.filename}`,
            req.file.mimetype
          );
          break;
        case CLAUDE:
        case LLAMA:
        case DEEPSEEK:
          result = 'No implemented yet';
          break;
      }

      res.status(200).json({ result });
    }
  }
);
app.post('/photos/generate', async (req: Request, res: Response) => {
  const body = req.body.query;
  const { model, message, typeOfAI } = body;
  let result = '';
  switch (typeOfAI) {
    case GEMINI:
      result = await textToImage(model, message);
      break;
    case OPENAI:
      result = await openAiTextToImage(model, message);
      break;
    case CLAUDE:
    case LLAMA:
    case DEEPSEEK:
      result = 'Not implemented yet';
      break;
    default:
      result = 'Unknown AI type';
      break;
  }

  res.status(200).json({ result });
});

// app.post('/setCustomClaims', async (req: Request, res: Response) => {
//   // Get the ID token passed.
//   const idToken = req.body.idToken;

//   // Verify the ID token and decode its payload.
//   const claims = await getAuth().verifyIdToken(idToken);

//   // Verify user is eligible for additional privileges.
//   if (
//     typeof claims.email !== 'undefined' &&
//     typeof claims.email_verified !== 'undefined' &&
//     claims.email_verified &&
//     claims.email.endsWith('@admin.example.com')
//   ) {
//     // Add custom claims for additional privileges.
//     await getAuth().setCustomUserClaims(claims.sub, {
//       admin: true,
//     });

//     // Tell client to refresh token on user.
//     res.end(
//       JSON.stringify({
//         status: 'success',
//       })
//     );
//   } else {
//     // Return nothing.
//     res.end(JSON.stringify({ status: 'ineligible' }));
//   }
// });

app.post(
  '/llama',
  async (req: { body: { query: any; idToken: string } }, res: any) => {
    // Verify the ID token and decode its payload.
    // const idToken = req.body.idToken;
    // getAuth().setUserCustomClaims
    // const claims = await getAuth()
    //   .verifyIdToken(idToken)
    //   .then((decodedToken) => {
    //     const uid = decodedToken.uid;
    //   })
    //   .catch((error) => {
    //     // Handle error
    //   });
    try {
      const result = await llamaSemanticSearch(req.body.query);
      console.log({ result });
      res.json({ result });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);
app.post('/gemini', async (req: Request, res: Response) => {
  try {
    const result = await geminiSemanticSearch(req.body.query);
    console.log({ result });
    res.json({ result });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});
app.post('/openai', async (req: Request, res: Response) => {
  // Verify the ID token and decode its payload.
  //   const claims = await getAuth().verifyIdToken(idToken);
  try {
    const result = await openAISemanticSearch(req.body.query);
    console.log({ result });
    res.json({ result });
  } catch (error) {
    console.error('Error with ChatGPT request:', error);
    res.status(500).send('Error communicating with ChatGPT');
  }
});
app.post('/claude', async (req: Request, res: Response) => {
  // Verify the ID token and decode its payload.
  //   const claims = await getAuth().verifyIdToken(idToken);
  try {
    const result = await claudeSemanticSearch(req.body.query);
    console.log({ result });
    res.json({ result });
  } catch (error) {
    console.error('Error with ChatGPT request:', error);
    res.status(500).send('Error communicating with ChatGPT');
  }
});

app.post('/search', async (req: Request, res: Response) => {
  try {
    const result = await semanticSearch(req.body.query);
    console.log({ result });
    res.json({ result });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});
app.post('/analyze', async (req: Request, res: Response) => {
  console.log(req.body.query.text);
  try {
    const analysis = await analyzeData(req.body.query.text);
    console.log(analysis);
    res.json(analysis);
  } catch (error: unknown) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
//   res.status(500).json({ message: err });
// });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
