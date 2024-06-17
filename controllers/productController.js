const productModel = require("../models/productModel");
const { deleteFile } = require("../utils/fileupload");
// Create a new product
exports.createProduct = async (req, res) => {
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
        };
        console.log(productData)

        // Convert tags from a comma-separated string to an array, if necessary
        if (typeof productData.tags === "string") {
            productData.tags = productData.tags.split(",").map((tag) => tag.trim());
        }
        const newProduct = new productModel(productData);
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

// Get a single product by ID
exports.getProductById = async (req, res) => {
    try {
        const product = await productModel.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update a product
exports.updateProductById = async (req, res) => {
    try {
        const productId = req.params.id;
        console.log(productId)
        const product = await productModel.findById(productId);

        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        // Check if a new file is uploaded
        if (req.file) {
            // Delete the old file
            if (product.imageUrl) {
                deleteFile(product.imageUrl);
            }
            console.log(`file=${req.file.filename}`)
            // Update with new image URL
            req.body.imageUrl = `products/${req.file.filename}`;
        } else {
            // If no new file is uploaded, remove imageUrl from req.body to prevent overwriting
            delete req.body.imageUrl;
        }
        // Update the product
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

// Delete a product by ID
exports.deleteProductById = async (req, res) => {
    try {
        const deletedProduct = await productModel.findByIdAndDelete(req.params.id);
        if (!deletedProduct) {
            return res.status(404).json({ error: "Product not found" });
        }
        deleteFile(deletedProduct.imageUrl);
        res.json({ message: "Product deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
