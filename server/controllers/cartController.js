import Cart from "../models/Cart.js";

const populateAndCleanCart = async (cart) => {
  await cart.populate("items.product");
  const validItems = cart.items.filter((item) => item.product);
  if (validItems.length !== cart.items.length) {
    cart.items = validItems;
    await cart.save();
  }
  return cart;
};

// @route GET /api/cart (protected) — get the logged-in user's cart
export const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });
    await populateAndCleanCart(cart);
    res.json(cart);
  } catch (error) {
    next(error);
  }
};

// @route POST /api/cart (protected) — add item or increase its quantity
export const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) cart = new Cart({ user: req.user._id, items: [] });

    const existingItem = cart.items.find((item) => item.product.toString() === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }
    await cart.save();
    await populateAndCleanCart(cart);
    res.json(cart);
  } catch (error) {
    next(error);
  }
};

// @route PUT /api/cart/:productId (protected) — set exact quantity
export const updateCartItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      res.status(404);
      throw new Error("Cart not found");
    }
    const item = cart.items.find((i) => i.product.toString() === req.params.productId);
    if (!item) {
      res.status(404);
      throw new Error("Item not in cart");
    }
    item.quantity = quantity;
    await cart.save();
    await populateAndCleanCart(cart);
    res.json(cart);
  } catch (error) {
    next(error);
  }
};

// @route DELETE /api/cart/:productId (protected)
export const removeFromCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      res.status(404);
      throw new Error("Cart not found");
    }
    cart.items = cart.items.filter((i) => i.product.toString() !== req.params.productId);
    await cart.save();
    await populateAndCleanCart(cart);
    res.json(cart);
  } catch (error) {
    next(error);
  }
};
