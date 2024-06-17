const router = require('express').Router();
const productController = require('../controllers/productController');
const { upload } = require('../utils/fileupload');


// Create a new product
router.post('/create', upload('/products').single('productImage'), productController.createProduct);

// Get all products
router.get('/products', productController.getAllProducts);

// Get a single product by ID
router.get('/product/:id', productController.getProductById);

// Update a product by ID
router.put('/update/:id', upload('/products').single('productImage'), productController.updateProductById);

// Delete a product by ID
router.delete('/delete/:id', productController.deleteProductById);




module.exports = router;