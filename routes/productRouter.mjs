import express from 'express';

import mockProductData from '../data/mockProductData.mjs';
import resolveIndexByUserId from '../middlewares/product.mjs';
import { validationResult, checkSchema, matchedData } from 'express-validator';

const productRouter = express.Router();

let products = mockProductData;

productRouter.get('/products/:productId', resolveIndexByUserId, (req, res) => {
    const product = products[req.index];
    res.json(product);
});


const productValidationSchema = {
    name: {
        notEmpty: { errorMessage: 'Product name is required' },
        isLength: { options: { min: 2, max: 100 } }
    },
    price: {
        isNumeric: { errorMessage: 'Price must be a number' }
    },
    categoryId: {
        notEmpty: { errorMessage: 'Category ID is required' }
    }
};

productRouter.post('/products', checkSchema(productValidationSchema), (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    const validatedData = matchedData(req);
    
    const newProduct = {
        id: `prod_${Date.now()}`, 
        ...validatedData
    };
    
    products.push(newProduct);
    res.status(201).json(newProduct);
});

productRouter.put('/products/:productId', resolveIndexByUserId, checkSchema({ 'name': { isLength: { options: { min: 2, max: 100 } } } }), (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    const updatedFields = matchedData(req);
    
    products[req.index] = { ...products[req.index], ...updatedFields };
    res.json(products[req.index]);
});

productRouter.delete('/products/:productId', resolveIndexByUserId, (req, res) => {
    products.splice(req.index, 1);
    res.status(204).send(); 
});

export default productRouter;