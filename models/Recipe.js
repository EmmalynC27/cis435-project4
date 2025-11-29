// Recipe Schema
const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    ingredients: {
        type: [String],
        default: []
    },
    instructions: {
        type: [String],
        default: []
    },
    prepTime: {
        type: Number,
        default: 0
    },
    cookTime: {
        type: Number,
        default: 0
    },
    servings: {
        type: Number,
        default: 1
    },
    category: {
        type: String,
        default: 'Other'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Recipe', recipeSchema);
