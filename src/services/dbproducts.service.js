import ProductModel from "../DAO/models/product.model.js";

class MongoDBProducts {
    async getAllProducts(page, limit, sort, query) {
        try {
            const filter = query
            ? { title: { $regex: query.title, $options: "i" } }
            : {};
            const products = await ProductModel.paginate(filter, {
                limit: limit || 5,
                page: page || 1,
                sort: sort === "desc" ? "-price" : "price",
                lean: true,
              });
            return products;
        } catch (err) {
            throw err;
        }
    }

    async getProductById(productId) {
        try {
            const one = await ProductModel.findById(productId);
            return one;
        } catch (err) {
            throw new Error(err);
        }
    }

    async createProduct(productData) {
        try {
            const newProd = await ProductModel.create(productData);
            return newProd;
        } catch (err) {
            throw new Error(err);
        }
    }

    async updateProduct(productId, productData) {
        try {
            const productUpdate = await ProductModel.findByIdAndUpdate(
                productId,
                productData,
                { new: true }
            );
            return productUpdate;
        } catch (err) {
            throw err;
        }
    }

    async deleteProduct(productId) {
        try {
            const delProd = await ProductModel.findByIdAndDelete(productId);
            return delProd;
        } catch (err) {
            throw new Error(err);
        }
    }
};

export default MongoDBProducts;