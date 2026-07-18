import express from 'express';

import mockData from '../data/mockProductData.mjs'; 
import resolveCategoryById from '../middlewares/category.mjs';
import { validationResult, checkSchema, matchedData } from 'express-validator';

const categoryRouter = express.Router();

let categories = mockData;

categoryRouter.get('/categories/:categoryId', resolveCategoryById, (req, res) => {
    const category = categories[req.index];
    res.json(category);
});

const categoryValidationSchema = {
    name: {
        notEmpty: { errorMessage: 'Category name is required' },
        isLength: { options: { min: 2, max: 100 } }
    },
    description: {
        optional: true,
        isLength: { options: { max: 200 } }
    }
};

categoryRouter.post('/categories', checkSchema(categoryValidationSchema), (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    const validatedData = matchedData(req);
    
    const newCategory = {
        id: `cat_${Date.now()}`,
        name: validatedData.name,
        slug: validatedData.name.toLowerCase().replace(/ /g, '-'),
        description: validatedData.description || '',
        isActive: true
    };
    
    categories.push(newCategory);
    res.status(201).json(newCategory);
});

categoryRouter.put('/categories/:categoryId', resolveCategoryById, checkSchema({ 'name': { isLength: { options: { min: 2, max: 100 } } } }), (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    const updatedFields = matchedData(req);
    
    if (updatedFields.name) {
        updatedFields.slug = updatedFields.name.toLowerCase().replace(/ /g, '-');
    }
    
    categories[req.index] = { ...categories[req.index], ...updatedFields };
    res.json(categories[req.index]);
});

categoryRouter.delete('/categories/:categoryId', resolveCategoryById, (req, res) => {
    categories.splice(req.index, 1);
    res.status(204).send();
});

export default categoryRouter;