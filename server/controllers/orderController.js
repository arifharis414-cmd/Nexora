import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import { validateCheckoutForm } from "../utils/checkoutValidation.js";

// @route POST /api/orders (protected) — create order from the user's current cart
export const createOrder = async (req, res, next) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;
    const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      res.status(400);
      throw new Error("Cart is empty");
    }

    const validation = validateCheckoutForm({
      country: shippingAddress?.country,
      address: shippingAddress?.address,
      phoneNumber: shippingAddress?.phoneNumber,
    });

    if (!validation.isValid) {
      return res.status(400).json({
        message: "Checkout validation failed",
        errors: validation.errors,
      });
    }

    // Make sure every item still has enough stock before we commit to the order
    for (const i of cart.items) {
      if (!i.product || i.product.stock < i.quantity) {
        res.status(400);
        throw new Error(`Not enough stock for "${i.product?.name || "a product"}"`);
      }
    }

    const items = cart.items.map((i) => ({
      product: i.product._id,
      name: i.product.name,
      image: i.product.images?.[0] || "",
      price: i.product.finalPrice ?? i.product.price,
      quantity: i.quantity,
    }));

    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const shippingFee = subtotal > 100 ? 0 : 10; // free shipping over $100
    const tax = +(subtotal * 0.05).toFixed(2); // flat 5% tax
    const total = +(subtotal + shippingFee + tax).toFixed(2);

    const order = await Order.create({
      user: req.user._id,
      items,
      shippingAddress: validation.sanitizedValues,
      paymentMethod,
      subtotal,
      shippingFee,
      tax,
      total,
    });

    // Reduce stock for each purchased product
    for (const item of items) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
    }

    // Empty the cart after checkout
    cart.items = [];
    await cart.save();

    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

// @route GET /api/orders/my (protected)
export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// @route GET /api/orders/:id (protected)
export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name email");
    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }
    // Only the order's owner or an admin can view it
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      res.status(403);
      throw new Error("Not authorized to view this order");
    }
    res.json(order);
  } catch (error) {
    next(error);
  }
};

// @route GET /api/orders (admin) — all orders
export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().populate("user", "name email").sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// @route PUT /api/orders/:id/status (admin)
export const updateOrderStatus = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }
    order.status = req.body.status || order.status;
    if (req.body.status === "delivered") {
      order.isPaid = true;
      order.paidAt = new Date();
    }
    await order.save();
    res.json(order);
  } catch (error) {
    next(error);
  }
};
