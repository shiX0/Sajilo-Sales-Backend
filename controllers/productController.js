const productModel = require("../models/productModel");
const { deleteFile } = require("../utils/fileupload");

// Create a new product
exports.createProduct = async (req, res) => {
    console.log("user id:=" + req.user);
    try {
        // Handle file upload
        if (!req.file) {
            return res.status(400).json({ error: "Please provide a product image" });
            // req.file.filename = 'default.jpeg'
        }
        console.log(req.file.filename);

        const productData = {
            ...req.body,
            imageUrl: `products/${req.file.filename}`,
            user: req.user._id
        };
        // console.log(productData)

        // Convert tags from a comma-separated string to an array, if necessary
        if (typeof productData.tags === "string") {
            productData.tags = productData.tags.split(",").map((tag) => tag.trim());
        }
        const newProduct = new productModel(productData);
        console.log(newProduct)
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (err) {
        res.status(400).json({ error: err.message });
        deleteFile(`products/${req.file.filename}`);
    }
};

// Get all products
exports.getAllProducts = async (req, res) => {
    try {
        const products = await productModel.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get a single product by ID (only if created by the requesting user)
exports.getProductById = async (req, res) => {
    try {
        const product = await productModel.findOne({ _id: req.params.id, user: req.user._id });
        if (!product) {
            return res.status(404).json({ error: "Product not found or you don't have permission to view it" });
        }
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update a product (only if created by the requesting user)
exports.updateProductById = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await productModel.findOne({ _id: productId, user: req.user._id });
        if (!product) {
            return res.status(404).json({ error: "Product not found or you don't have permission to update it" });
        }

        if (req.file) {
            if (product.imageUrl) {
                deleteFile(product.imageUrl);
            }
            console.log(`file=${req.file.filename}`);
            req.body.imageUrl = `products/${req.file.filename}`;
        } else {
            delete req.body.imageUrl;
        }

        const updatedProduct = await productModel.findByIdAndUpdate(
            productId,
            req.body,
            { new: true }
        );
        res.json(updatedProduct);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Delete a product by ID (only if created by the requesting user)
exports.deleteProductById = async (req, res) => {
    try {
        const deletedProduct = await productModel.findOneAndDelete({ _id: req.params.id, user: req.user._id });
        if (!deletedProduct) {
            return res.status(404).json({ error: "Product not found or you don't have permission to delete it" });
        }
        deleteFile(deletedProduct.imageUrl);
        res.json({ message: "Product deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Product pagination (only for products created by the requesting user)
exports.productPagination = async (req, res) => {
    const pageNo = parseInt(req.query.page) || 1;
    const resultPerPage = parseInt(req.query.limit) || 10;
    console.log(`Page: ${pageNo}, Results per page: ${resultPerPage}`);

    try {
        const products = await productModel.find({ user: req.user._id })
            .skip((pageNo - 1) * resultPerPage)
            .limit(resultPerPage)
            .lean();

        if (products.length === 0) {
            return res.status(400).json({
                'success': false,
                'message': "No Products Found!"
            });
        }

        res.status(200).json({
            'success': true,
            'message': "Products Fetched!",
            'products': products
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            'success': false,
            'message': "Server Error"
        });
    }
};