const { Storage } = require('@google-cloud/storage');
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const secretKey = process.env.JWT_SECRET;

// Cloud Storage Configuration
const keyFilePath = './storageCredentials.json';
const storage = new Storage({
  keyFilename: keyFilePath,
  projectId: 'fruityfit-dev',
});
const bucketName = 'fruityfit-bucket2';
const bucket = storage.bucket(bucketName);

// MySQL Connection
const db = mysql.createConnection({
  host: '34.128.105.210',
  user: 'root',
  password: 'fruityfit-123',
  database: 'fruityfit_db',
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
  } else {
    console.log('Connected to the database');
  }
});

const isAuthorized = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
      return res.status(401).json({ message: "Token tidak ditemukan" });
  }

  const splitToken = token.split(' ')[1];

  jwt.verify(splitToken, secretKey, (err, result) => {
      if (err) {
          return res.status(401).json({ message: "Token tidak valid" });
      }
      req.user = result;
      next();
  });
};

module.exports = { storage, bucket, bucketName, db, isAuthorized, secretKey};
