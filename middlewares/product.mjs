import mockProductData from '../data/mockProductData.mjs';

const resolveProductIndex = (req, res, next) => {
    const { productId } = req.params;
    const index = mockProductData.findIndex(p => p.id === productId);
    
    if (index === -1) {
        return res.status(404).json({ message: 'Product not found' });
    }
    
    req.index = index;
    next();
};

export default resolveProductIndex;