// API server Admin SDK app

// use firebase to verify
// import admin from 'firebase-admin';
import { applicationDefault, initializeApp } from 'firebase-admin/app';
import process from 'node:process';
import dotenv from 'dotenv';

dotenv.config();

// initialize firebase
const firebaseApp = initializeApp({
  credential: applicationDefault(),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
});

export default firebaseApp;
