import mockData from '../data/mockCategoryData.mjs';

export const resolveCategoryById = (req, res, next) => {
    const { categoryId } = req.params;
    const index = mockData.findIndex(cat => cat.id === categoryId);
    
    if (index === -1) {
        return res.status(404).json({ message: 'Category not found' });
    }
    
    req.index = index; 
    next();
};

export default resolveCategoryById;