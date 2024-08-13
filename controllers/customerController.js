const Customer = require("../models/customerModel");

const customerController = {
  // Create a new customer
  async createCustomer(req, res) {
    // console.log(req.user)
    try {
      const newCustomer = new Customer({ ...req.body, user: req.user._id })
      const customer = await newCustomer.save();
      res.status(201).json(customer);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Read all customers
  async getAllCustomers(req, res) {
    // page no (received from user)
    const pageNo = parseInt(req.query.page) || 1;
    // limit(results per page)
    const resultPerPage = parseInt(req.query.limit) || 10;
    try {
      const customers =
        await Customer.find({ user: req.user._id })
          .skip((pageNo - 1) * resultPerPage)
          .limit(resultPerPage)
          .lean();
      res.json(customers);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Read a specific customer
  async getCustomerById(req, res) {
    try {
      const customer = await Customer.findById(req.params.id);
      if (!customer) {
        return res.status(404).json({ error: "Customer not found" });
      }
      res.json(customer);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Update a customer
  async updateCustomer(req, res) {
    try {
      const customer = await Customer.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      if (!customer) {
        return res.status(404).json({ error: "Customer not found" });
      }
      res.json(customer);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Delete a customer
  async deleteCustomer(req, res) {
    try {
      const customer = await Customer.findByIdAndDelete(req.params.id);
      if (!customer) {
        return res.status(404).json({ error: "Customer not found" });
      }
      res.json({ message: "Customer deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getCustomerAnalytics(req, res) {
    console.log('Controller invoked');
    console.log('User:', req.user);

    try {
      const userId = req.user._id;

      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      // Total number of customers for the specific user
      const totalCustomers = await Customer.countDocuments({ user: userId });

      // Number of new customers this month for the specific user
      const newCustomersThisMonth = await Customer.countDocuments({
        user: userId,
        createdAt: { $gte: startOfMonth },
      });

      // Average time since creation (in days) for the specific user's customers
      const customers = await Customer.find({ user: userId });
      const totalDaysSinceCreation = customers.reduce((sum, customer) => {
        const diffInMs = now - customer.createdAt;
        const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
        return sum + diffInDays;
      }, 0);
      const averageDaysSinceCreation = customers.length > 0
        ? totalDaysSinceCreation / customers.length
        : 0;
      res.status(200).json({
        totalCustomers,
        newCustomersThisMonth,
        averageDaysSinceCreation: averageDaysSinceCreation.toFixed(2), // Rounded to 2 decimal places
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  },

  // Controller function to search customers by name and user ID
  async searchCustomersByName(req, res) {
    try {
      const name = req.query.name;
      const userId = req.user._id;

      if (!name) {
        return res.status(400).json({ message: 'Name is required in the Parameter.' });
      }
      // Search customers by name and user ID, case insensitive, returning a maximum of 4 results
      const customers = await Customer.find({
        name: { $regex: name, $options: 'i' },
        user: userId // Filter by the user's ID
      }).limit(4);

      res.status(200).json(customers);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  }




  // Update purchase history
  // async updatePurchaseHistory(req, res) {
  //   try {
  //     const { order, total } = req.body;
  //     const customer = await Customer.findById(req.params.id);
  //     if (!customer) {
  //       return res.status(404).json({ error: 'Customer not found' });
  //     }

  //     customer.purchaseHistory.push({
  //       order,
  //       total,
  //       date: new Date()
  //     });

  //     customer.updatedAt = new Date();
  //     await customer.save();

  //     res.json(customer);
  //   } catch (error) {
  //     res.status(400).json({ error: error.message });
  //   }
  // }
};

module.exports = customerController;
