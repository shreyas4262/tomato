import fs from 'fs';
import foodModel from '../models/foodModel.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Fix for __dirname in ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Add Food Item
const addFood = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Image is required' });
        }

        const image_filename = req.file.filename;

        const food = new foodModel({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,
            image: image_filename
        });

        await food.save();
        res.json({ success: true, message: 'Food Added' });

    } catch (error) {
        console.error("Error adding food:", error);
        res.status(500).json({ success: false, message: 'Error adding food' });
    }
};

// ✅ List All Food Items
const listFood = async (req, res) => {
    try {
        const foods = await foodModel.find({});
        res.json({ success: true, data: foods });

    } catch (error) {
        console.error("Error fetching food list:", error);
        res.status(500).json({ success: false, message: 'Error fetching food list' });
    }
};

// ✅ Remove Food Item
const removeFood = async (req, res) => {
    try {
        console.log("Received ID for deletion:", req.body.id);

        const food = await foodModel.findById(req.body.id);
        if (!food) {
            return res.status(404).json({ success: false, message: 'Food item not found' });
        }

        // ✅ Check & Delete Image if Exists
        if (food.image) {
            const imagePath = path.join(__dirname, '../uploads/', food.image);
            if (fs.existsSync(imagePath)) {
                fs.unlink(imagePath, (err) => {
                    if (err) console.error('Error deleting image:', err);
                });
            }
        }

        // ✅ Delete Food from Database
        await foodModel.findByIdAndDelete(req.body.id);

        res.json({ success: true, message: 'Food Removed' });

    } catch (error) {
        console.error("Error removing food:", error);
        res.status(500).json({ success: false, message: 'Error removing food' });
    }
};

export { addFood, listFood, removeFood };
