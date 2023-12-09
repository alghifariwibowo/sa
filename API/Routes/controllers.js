const express = require('express');
const { db, isAuthorized } = require('./config');
const router = express.Router();

// Fetch list of products
router.get('/products', isAuthorized, (req, res) => {
    const sql = 'SELECT product_id, name, imageurl FROM products';
    db.query(sql, (err, results) => {
      if (err) {
        console.error('Error retrieving user information from MySQL:', err);
        res.status(500).send('Internal Server Error');
      } else {
          res.json(results);
      }
    });
});

// Fetch products's information by id
router.get('/products/:productId', isAuthorized, (req, res) => {
    const productId = req.params.productId;

    const sql = 'SELECT * FROM products WHERE product_id = ?';
    db.query(sql, [productId], (err, results) => {
      if (err) {
        res.status(500).send('Internal Server Error');
      } else {
        if (results.length > 0) {
          const product = results[0];
          res.status(200).json(product);
        } else {
          res.status(404).send('Buah tidak ditemukan.');
        }
      }
    });
});

// Fetch products's information by fruit type
router.get('/products/rec/:fruitName', isAuthorized, (req, res) => {
  const fruitName = req.params.fruitName; 

  const sql = 'SELECT product_id, name, imageurl FROM products WHERE fruit LIKE ?';
  db.query(sql, [`%${fruitName}%`], (err, results) => { 
    if (err) {
      res.status(500).send('Internal Server Error');
    } else {
      if (results.length === 0) {
        res.status(404).send('Buah tidak ditemukan.');
      } else {
        res.json(results);
      }
    }
  });
});

// Add to favorites
router.post('/add-fav/:userId/:productId', isAuthorized, (req, res) => {
    const { userId, productId } = req.params;
  
    const sql = 'INSERT INTO favorites (user_id, product_id) VALUES (?, ?)';
    db.query(sql, [userId, productId], (err, result) => {
      if (err) {
        console.error('Error adding product to favorites in MySQL:', err);
        res.status(500).send('Internal Server Error');
      } else {
        const response = {
          userId: userId,
          productId: productId,
          message: 'Produk berhasil ditambahkan ke favorit.'
        };
        res.status(200).json(response);
      }
    });
});

// Delete from favorites
router.post('/del-fav/:userId/:productId', isAuthorized, (req, res) => {
  const { userId, productId } = req.params;
  
    const sql = 'DELETE FROM favorites WHERE user_id = ? AND product_id = ?';
    db.query(sql, [userId, productId], (err, result) => {
      if (err) {
        console.error('Error adding product to favorites in MySQL:', err);
        res.status(500).send('Internal Server Error');
      } else {
        const response = {
          userId: userId,
          productId: productId,
          message: 'Produk berhasil dihapus dari favorit.'
        };
        res.status(200).json(response);
      }
    });
});

router.get('/favorites/:userId', isAuthorized, (req, res) => {
    const userId = req.params.userId;

    const sql = `SELECT products.product_id, products.name, products.imageurl
      FROM favorites
      JOIN products ON favorites.product_id = products.product_id
      WHERE favorites.user_id = ?`;
  
    db.query(sql, [userId], (err, results) => {
      if (err) {
        console.error('Error fetching favorite products from MySQL:', err);
        res.status(500).send('Gagal menambahkan ke favorit');
      } else {
        res.status(200).json(results);
      }
    });
});

module.exports = router;
