const router = require('express').Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');
const { upload } = require('../utils/fileupload');

// Create a new product
router.post('/create', authMiddleware, upload('/products').single('productImage'), productController.createProduct);

// Get all products (with optional pagination)
router.get('/', authMiddleware, productController.productPagination);

// Get a single product by ID
router.get('/:id', authMiddleware, productController.getProductById);

// Update a product by ID
router.put('/:id', authMiddleware, upload('/products').single('productImage'), productController.updateProductById);

// Delete a product by ID
router.delete('/:id', authMiddleware, productController.deleteProductById);

module.exports = router;