const Customer = require("../models/customerModel");
const Order = require("../models/orderModel");

const metricsController = {
    getMetrics: async (req, res) => {
        try {
            // Calculate total revenue
            const totalRevenueResult = await Order.aggregate([
                { $match: { user: req.user._id } },
                { $group: { _id: null, total: { $sum: '$total' } } },
                { $project: { _id: 0, total: 1 } },
            ]);
            const totalRevenue = totalRevenueResult.length > 0 ? totalRevenueResult[0].total : 'N/A';

            // Get new customers
            const newCustomersCount = await Customer.countDocuments({
                user: req.user._id,
                createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
            });
            const newCustomers = newCustomersCount || 'N/A';

            // Calculate average order value
            const orderCount = await Order.countDocuments({ user: req.user._id });
            const averageOrderValue = orderCount > 0 ? totalRevenue / orderCount : 'N/A';

            // Get sales by category
            const salesByCategoryResult = await Order.aggregate([
                { $match: { user: req.user._id } },
                { $unwind: '$items' },
                { $lookup: { from: 'products', localField: 'items.product', foreignField: '_id', as: 'product' } },
                { $unwind: '$product' },
                { $group: { _id: '$product.category', value: { $sum: '$items.quantity' } } },
                { $project: { _id: 0, category: '$_id', value: 1 } },
                { $sort: { value: -1 } }, // Sort by value in descending order
                { $limit: 5 } // Limit to top 5
            ]);
            const salesByCategory = salesByCategoryResult.length > 0 ? salesByCategoryResult : [{ category: 'N/A', value: 'N/A' }];

            // Get sales trends
            const salesTrendsResult = await Order.aggregate([
                { $match: { user: req.user._id } },
                { $group: { _id: { $month: '$createdAt' }, value: { $sum: '$total' } } },
                { $project: { _id: 0, month: '$_id', value: 1 } },
                { $sort: { month: 1 } },
            ]);
            const salesTrends = salesTrendsResult.length > 0 ? salesTrendsResult : [{ month: 'N/A', value: 'N/A' }];

            // Get top products
            const topProductsResult = await Order.aggregate([
                { $match: { user: req.user._id } },
                { $unwind: '$items' },
                { $lookup: { from: 'products', localField: 'items.product', foreignField: '_id', as: 'product' } },
                { $unwind: '$product' },
                { $group: { _id: '$product._id', name: { $first: '$product.name' }, unitsSold: { $sum: '$items.quantity' }, revenue: { $sum: { $multiply: ['$items.quantity', '$product.price'] } } } },
                { $sort: { revenue: -1 } },
                { $limit: 8 },
                { $project: { _id: 0, name: 1, unitsSold: 1, revenue: 1 } },
            ]);
            const topProducts = topProductsResult.length > 0 ? topProductsResult : [{ name: 'N/A', unitsSold: 'N/A', revenue: 'N/A' }];

            const topCustomersResult = await Order.aggregate([
                { $match: { user: req.user._id } },
                { $group: { _id: '$customer', totalSpent: { $sum: '$total' } } },
                { $lookup: { from: 'customers', localField: '_id', foreignField: '_id', as: 'customer' } },
                { $unwind: '$customer' },
                { $project: { _id: 0, name: '$customer.name', email: '$customer.email', totalSpent: 1 } },
                { $sort: { totalSpent: -1 } },
                { $limit: 5 } // Limit to top 5 customers
            ]);
            const topCustomers = topCustomersResult.length > 0 ? topCustomersResult : [{ name: 'N/A', totalSpent: 'N/A' }];
            res.json({
                totalRevenue,
                newCustomers,
                averageOrderValue,
                salesByCategory,
                salesTrends,
                topProducts,
                topCustomers
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'An error occurred while fetching the metrics' });
        }
    },
};

module.exports = metricsController;