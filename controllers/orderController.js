const Product = require('../models/productModel');

// Get all orders
const Order = require('../models/orderModel'); // Make sure you have the correct path to your Order model
const Customer = require('../models/customerModel');

exports.getAllOrders = async (req, res) => {
    const pageNo = parseInt(req.query.page) || 1;
    const resultPerPage = parseInt(req.query.limit) || 10;

    if (pageNo < 1 || resultPerPage < 1) {
        return res.status(400).json({ message: 'Invalid page or limit number' });
    }

    try {
        const orders = await Order.find({ user: req.user._id })
            .populate({ path: 'customer', model: 'Customer' })
            .populate({ path: 'items.product', model: 'Product', options: { lean: true } })
            .skip((pageNo - 1) * resultPerPage)
            .limit(resultPerPage)
            .lean();

        const totalOrders = await Order.countDocuments({ user: req.user._id });
        const totalPages = Math.ceil(totalOrders / resultPerPage);

        res.status(200).json({
            orders,
            totalOrders,
            totalPages,
            currentPage: pageNo,
            perPage: resultPerPage
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders', error: error.message });
    }
};


// Get a single order by ID
exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findOne({ _id: req.params.id, user: req.user._id }).populate('Customer').populate('items.product');
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching order', error: error.message });
    }
};

// Create a new order
exports.createOrder = async (req, res) => {
    try {
        const { items } = req.body;

        // Validate if products exist and belong to the user
        for (const item of items) {
            console.log(item)
            const product = await Product.findOne({ _id: item.product, user: req.user._id });
            if (!product) {
                return res.status(400).json({ message: `Product with ID ${item.product} does not exist or you do not have access to it` });
            }
        }
        const customer = await Customer.findOne({ _id: req.body.customer, user: req.user._id });
        if (!customer) {
            return res.status(400).json({ message: `Customer with ID ${req.body.customer} does not exist or you do not have access to it` });
        }
        const newOrder = new Order({ ...req.body, user: req.user._id });
        const savedOrder = await newOrder.save();
        res.status(201).json(savedOrder);
    } catch (error) {
        res.status(400).json({ message: 'Error creating order', error: error.message });
    }
};

// Update an order
exports.updateOrder = async (req, res) => {
    try {
        const updatedOrder = await Order.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            req.body,
            { new: true }
        );
        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json(updatedOrder);
    } catch (error) {
        res.status(400).json({ message: 'Error updating order', error: error.message });
    }
};

// Delete an order
exports.deleteOrder = async (req, res) => {
    try {
        const deletedOrder = await Order.findOneAndDelete({ _id: req.params.id, user: req.user._id });
        if (!deletedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting order', error: error.message });
    }
};

exports.getSalesAnalytics = async (req, res) => {
    try {
        const salesData = await Order.aggregate([
            {
                $group: {
                    _id: null,
                    totalSales: { $sum: "$total" },
                    averageSales: { $avg: "$total" }
                }
            }
        ]);

        const result = {
            totalSales: salesData[0] ? salesData[0].totalSales : 0,
            averageSales: salesData[0] ? salesData[0].averageSales : 0
        };

        res.json(result);
    } catch (error) {
        console.error('Error fetching sales analytics:', error);
        res.status(500).send('Internal Server Error');
    }
};
