const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/coffee_shop';
const PORT = process.env.PORT || 3000;

mongoose.connect(MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

const coffeeSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    image: String,
    category: String,
    roasted: String,
    ingredients: String,
    special_ingredient: String,
    average_rating: Number,
    ratings_count: String,
    favourite: Boolean,
    type: String,
    index: Number
});

const beanSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    image: String,
    roasted: String,
    ingredients: String,
    special_ingredient: String,
    average_rating: Number,
    ratings_count: String,
    favourite: Boolean,
    type: String,
    index: Number
});

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: String,
    phone: String,
    createdAt: { type: Date, default: Date.now }
});

const cartSchema = new mongoose.Schema({
    userEmail: { type: String, required: true },
    items: [{
        productId: String,
        productType: String,
        name: String,
        subtitle: String,
        roasted: String,
        image: String,
        sizes: [{
            size: String,
            price: Number,
            quantity: Number
        }]
    }],
    updatedAt: { type: Date, default: Date.now }
});

const favoriteSchema = new mongoose.Schema({
    userEmail: { type: String, required: true },
    productId: { type: String, required: true },
    productType: String,
    name: String,
    subtitle: String,
    description: String,
    image: String,
    rating: Number,
    ratingCount: String,
    roasted: String,
    tags: [String],
    createdAt: { type: Date, default: Date.now }
});

const Coffee = mongoose.model('Coffee', coffeeSchema);
const Bean = mongoose.model('Bean', beanSchema);
const User = mongoose.model('User', userSchema);
const Cart = mongoose.model('Cart', cartSchema);
const Favorite = mongoose.model('Favorite', favoriteSchema);

app.get('/', (req, res) => {
    res.json({ message: 'Coffee Shop API Server' });
});

app.get('/api/coffees', async (req, res) => {
    try {
        const coffees = await Coffee.find();
        res.json(coffees);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/coffees/:id', async (req, res) => {
    try {
        const coffee = await Coffee.findById(req.params.id);
        if (!coffee) return res.status(404).json({ error: 'Coffee not found' });
        res.json(coffee);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/coffees', async (req, res) => {
    try {
        const coffee = new Coffee(req.body);
        await coffee.save();
        res.status(201).json(coffee);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.get('/api/beans', async (req, res) => {
    try {
        const beans = await Bean.find();
        res.json(beans);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/beans/:id', async (req, res) => {
    try {
        const bean = await Bean.findById(req.params.id);
        if (!bean) return res.status(404).json({ error: 'Bean not found' });
        res.json(bean);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/beans', async (req, res) => {
    try {
        const bean = new Bean(req.body);
        await bean.save();
        res.status(201).json(bean);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.post('/api/register', async (req, res) => {
    try {
        const { email, password, name, phone } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already exists' });
        }
        const user = new User({ email, password, name, phone });
        await user.save();
        res.status(201).json({ message: 'User registered successfully', user: { email, name, phone } });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email, password });
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        res.json({ message: 'Login successful', user: { email: user.email, name: user.name, phone: user.phone } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/cart/:userEmail', async (req, res) => {
    try {
        const cart = await Cart.findOne({ userEmail: req.params.userEmail });
        res.json(cart || { items: [] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/cart', async (req, res) => {
    try {
        const { userEmail, items } = req.body;
        let cart = await Cart.findOne({ userEmail });
        if (cart) {
            cart.items = items;
            cart.updatedAt = Date.now();
        } else {
            cart = new Cart({ userEmail, items });
        }
        await cart.save();
        res.json(cart);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.post('/api/cart/add', async (req, res) => {
    try {
        const { userEmail, item } = req.body;
        let cart = await Cart.findOne({ userEmail });
        if (!cart) {
            cart = new Cart({ userEmail, items: [item] });
        } else {
            const existingItem = cart.items.find(i => i.productId === item.productId);
            if (existingItem) {
                item.sizes.forEach(newSize => {
                    const existingSize = existingItem.sizes.find(s => s.size === newSize.size);
                    if (existingSize) {
                        existingSize.quantity += newSize.quantity;
                    } else {
                        existingItem.sizes.push(newSize);
                    }
                });
            } else {
                cart.items.push(item);
            }
            cart.updatedAt = Date.now();
        }
        await cart.save();
        res.json(cart);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.delete('/api/cart/:userEmail', async (req, res) => {
    try {
        await Cart.deleteOne({ userEmail: req.params.userEmail });
        res.json({ message: 'Cart cleared' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/favorites/:userEmail', async (req, res) => {
    try {
        const favorites = await Favorite.find({ userEmail: req.params.userEmail });
        res.json(favorites);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/favorites', async (req, res) => {
    try {
        const { userEmail, productId, productType, name, subtitle, description, image, rating, ratingCount, roasted, tags } = req.body;
        const existing = await Favorite.findOne({ userEmail, productId });
        if (existing) {
            return res.status(400).json({ error: 'Already in favorites' });
        }
        const favorite = new Favorite({ userEmail, productId, productType, name, subtitle, description, image, rating, ratingCount, roasted, tags });
        await favorite.save();
        res.status(201).json(favorite);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.delete('/api/favorites/:userEmail/:productId', async (req, res) => {
    try {
        await Favorite.deleteOne({ userEmail: req.params.userEmail, productId: req.params.productId });
        res.json({ message: 'Removed from favorites' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
