import { Router } from 'express';
import { Recipe } from '../models/Recipe.js';

const router = Router();

// Get all recipes
router.get('/', async (req, res) => {
    try {
        const recipes = await Recipe.find();
        res.json(recipes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get a single recipe by ID
router.get('/:id', async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) return res.status(404).json({ error: 'Recipe not found' });
        res.json(recipe);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create a new recipe
router.post('/', async (req, res) => {
    try {
        const recipe = new Recipe(req.body);
        await recipe.save();
        res.status(201).json(recipe);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Update a recipe by ID
router.put('/:id', async (req, res) => {
    try {
        const recipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!recipe) return res.status(404).json({ error: 'Recipe not found' });
        res.json(recipe);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete a recipe by ID
router.delete('/:id', async (req, res) => {
    try {
        const recipe = await Recipe.findByIdAndDelete(req.params.id);
        if (!recipe) return res.status(404).json({ error: 'Recipe not found' });
        res.json({ message: 'Recipe deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;