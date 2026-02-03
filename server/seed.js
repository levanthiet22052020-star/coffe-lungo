const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/coffee_shop';

const coffeeData = [
    {
        name: "Americano",
        description: "A smooth, rich espresso-based coffee diluted with hot water, offering a bold flavor and aromatic experience.",
        price: 3.50,
        image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500",
        category: "Americano",
        roasted: "Medium Roasted",
        ingredients: "Milk",
        special_ingredient: "With Steamed Milk",
        average_rating: 4.5,
        ratings_count: "6,879",
        favourite: false,
        type: "Coffee",
        index: 0
    },
    {
        name: "Black Coffee",
        description: "Pure coffee brewed with hot water, featuring intense flavors and caffeine content.",
        price: 2.50,
        image: "https://images.unsplash.com/photo-1494314671902-399b18174975?w=500",
        category: "Black Coffee",
        roasted: "Dark Roasted",
        ingredients: "Milk",
        special_ingredient: "With Steamed Milk",
        average_rating: 4.2,
        ratings_count: "5,123",
        favourite: false,
        type: "Coffee",
        index: 1
    },
    {
        name: "Cappuccino",
        description: "Classic Italian coffee with equal parts espresso, steamed milk, and milk foam.",
        price: 4.00,
        image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=500",
        category: "Cappuccino",
        roasted: "Medium Roasted",
        ingredients: "Milk",
        special_ingredient: "With Foam",
        average_rating: 4.7,
        ratings_count: "8,432",
        favourite: true,
        type: "Coffee",
        index: 2
    },
    {
        name: "Espresso",
        description: "Concentrated coffee brewed by forcing hot water through finely-ground coffee beans.",
        price: 2.00,
        image: "https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=500",
        category: "Espresso",
        roasted: "Dark Roasted",
        ingredients: "Milk",
        special_ingredient: "With Steamed Milk",
        average_rating: 4.3,
        ratings_count: "4,567",
        favourite: false,
        type: "Coffee",
        index: 3
    },
    {
        name: "Latte",
        description: "Espresso coffee with steamed milk and a light layer of foam.",
        price: 4.50,
        image: "https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=500",
        category: "Latte",
        roasted: "Light Roasted",
        ingredients: "Milk",
        special_ingredient: "With Oat Milk",
        average_rating: 4.6,
        ratings_count: "7,890",
        favourite: true,
        type: "Coffee",
        index: 4
    },
    {
        name: "Macchiato",
        description: "Espresso with a small amount of foamed milk on top.",
        price: 3.00,
        image: "https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=500",
        category: "Macchiato",
        roasted: "Medium Roasted",
        ingredients: "Milk",
        special_ingredient: "With Steamed Milk",
        average_rating: 4.4,
        ratings_count: "3,456",
        favourite: false,
        type: "Coffee",
        index: 5
    }
];

const beanData = [
    {
        name: "Robusta Beans",
        description: "Strong and bold coffee beans with high caffeine content, perfect for espresso.",
        price: 12.00,
        image: "https://images.unsplash.com/photo-1559525839-d82dad4ea159?w=500",
        roasted: "Medium Roasted",
        ingredients: "Robusta",
        special_ingredient: "From Africa",
        average_rating: 4.2,
        ratings_count: "2,345",
        favourite: false,
        type: "Bean",
        index: 0
    },
    {
        name: "Arabica Beans",
        description: "Smooth and aromatic coffee beans with sweet flavor notes.",
        price: 15.00,
        image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500",
        roasted: "Light Roasted",
        ingredients: "Arabica",
        special_ingredient: "From Colombia",
        average_rating: 4.8,
        ratings_count: "5,678",
        favourite: true,
        type: "Bean",
        index: 1
    },
    {
        name: "Liberica Beans",
        description: "Unique and rare coffee beans with bold, smoky flavor.",
        price: 18.00,
        image: "https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=500",
        roasted: "Dark Roasted",
        ingredients: "Liberica",
        special_ingredient: "From Philippines",
        average_rating: 4.1,
        ratings_count: "1,234",
        favourite: false,
        type: "Bean",
        index: 2
    },
    {
        name: "Excelsa Beans",
        description: "Tart and fruity coffee beans, often used in blends.",
        price: 14.00,
        image: "https://images.unsplash.com/photo-1442550528053-c431ecb55509?w=500",
        roasted: "Medium Roasted",
        ingredients: "Excelsa",
        special_ingredient: "From Southeast Asia",
        average_rating: 4.0,
        ratings_count: "987",
        favourite: false,
        type: "Bean",
        index: 3
    }
];

async function seedDatabase() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        await mongoose.connection.db.collection('coffees').deleteMany({});
        await mongoose.connection.db.collection('beans').deleteMany({});
        console.log('Cleared existing data');

        await mongoose.connection.db.collection('coffees').insertMany(coffeeData);
        console.log('Inserted coffee data');

        await mongoose.connection.db.collection('beans').insertMany(beanData);
        console.log('Inserted bean data');

        console.log('Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

seedDatabase();
