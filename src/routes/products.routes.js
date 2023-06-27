import express from 'express';
import MongoDBProducts from "../services/dbproducts.service.js";

export const productsRouter = express.Router();

const dbProducts = new MongoDBProducts();

productsRouter.get('/', async (req, res) => {
    try {
        const { limit, page, sort, query } = req.query;
        const products = await dbProducts.getAllProducts(limit, page, sort, query);
        return res.status(200).json({
            status: 'success',
            msg: 'Products retrieved',
            payload: products,
        });
    } catch (error) {
        console.error(error);
        return res.status(400).json({
        status: 'error',
        msg: error.message,
        });
    }
});

productsRouter.get('/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await dbProducts.getProductById(productId);
        if (!product) {
            return res.status(404).json({
            status: 'error',
            msg: 'Product not found',
        })}
        return res.status(200).json({
            status: 'success',
            msg: 'Product retrieved',
            payload: product,
        });
    } catch (error) {
        console.error(error);
        return res.status(400).json({
            status: 'error',
            msg: error.message,
        });
    }
});

productsRouter.post('/', async (req, res) => {
    try {
        const productData = req.body;
        const createdProduct = await dbProducts.createProduct(productData);
        return res.status(201).json({
            status: 'success',
            msg: 'Product created',
            payload: createdProduct,
        });
    } catch (error) {
        console.error(error);
        return res.status(400).json({
            status: 'error',
            msg: error.message,
        });
    }
});

productsRouter.put('/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        const productData = req.body;
        const updatedProduct = await dbProducts.updateProduct(productId, productData);
        if (!updatedProduct) {
            return res.status(404).json({
                status: 'error',
                msg: 'Product not found',
            });
        }
        return res.status(200).json({
            status: 'success',
            msg: 'Product updated',
            payload: updatedProduct,
        });
    } catch (error) {
        console.error(error);
        return res.status(400).json({
        status: 'error',
        msg: error.message,
        });
    }
});

productsRouter.delete('/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        const deletedProduct = await dbProducts.deleteProduct(productId);
        if (!deletedProduct) {
            return res.status(404).json({
                status: 'error',
                msg: 'Product not found',
            });
        }
        return res.status(200).json({
            status: 'success',
            msg: 'Product deleted',
            payload: deletedProduct,
        });
    } catch (error) {
        console.error(error);
        return res.status(400).json({
        status: 'error',
        msg: error.message,
        });
    }
});

export default productsRouter;