import express from 'express';
import MongoDBProducts from "../services/dbproducts.service.js"
import ProductModel from '../DAO/models/product.model.js';
import MongoDBCarts from "../services/dbcarts.service.js";
import { isUser } from "../middleware/auth.js";

const dbCarts = new MongoDBCarts();
const newProductManager = new MongoDBProducts;
const viewsRouter = express.Router();

viewsRouter.get("/", async (req, res) => {
  const { register, login } = req.query;
  const session = req.session;
  if (register === 'true' && !session.user)
      return res.render("register");
  if (login === 'true' && !session.user)
      return res.render("login");
  const context = { session: session.user };
  res.render("home", context);
});

viewsRouter.get('/products', isUser, async (req, res)=> {
    try{
        const { page, limit, sort, query }= req.query;
        const queryResult = await newProductManager.getAllProducts(page, limit, sort, query);
        const {docs, ...paginationInfo} = queryResult;
        const productsVisualice = docs.map((product) => {
            return {
                _id: product._id.toString(),
                title: product.title,
                description: product.description,
                price: product.price,
                thumbnail: product.thumbnail,
                code: product.code,
                stock: product.stock,
                category: product.category,
                status: product.status              
            }
        });
        const response = {
            status: 'success',
            payload: productsVisualice,
            totalPages: paginationInfo.totalPages,
            prevPage: paginationInfo.prevPage,
            nextPage: paginationInfo.nextPage,
            page: parseInt(paginationInfo.page),
            hasPrevPage: paginationInfo.hasPrevPage,
            hasNextPage: paginationInfo.hasNextPage,
        };
        const prevPage = parseInt(page) - 1;
        response.hasPrevPage ? response.prevLink = `localhost:8080/products/?page=${prevPage}&limit=${limit}&sort=${sort}` : response.prevLink = null;
        const nextPage = parseInt(page) + 1;
        response.hasNextPage ? response.nextLink = `localhost:8080/products/?page=${nextPage}&limit=${limit}&sort=${sort}` : response.nextLink = null;
        if (parseInt(page) > paginationInfo.totalPages || parseInt(page) < 1) {
            throw new Error('La página solicitada no existe');
        }
        const nextPageUrl = `/?page=${nextPage}&limit=${limit}&sort=${sort}`;
        const productsContext = {
          session: req.session.user,
          productsVisualice: productsVisualice,
          paginationInfo: paginationInfo,
          nextPageUrl: nextPageUrl,
          sort: sort,
          query: query
      };
      res.render('products', productsContext);
      /* res.render('products', {productsVisualice, paginationInfo, nextPageUrl, sort, query}) */
    } catch(error) {
        console.error(error);
        return res.status(400).json({
        status: 'error',
        msg: error.message,
        });
    }
})

viewsRouter.get('/realtimeproducts', async (req, res)=> {
    try{
        const { page, limit, sort, query } = req.query;
        const queryResult = await newProductManager.getAllProducts(page, limit, sort, query);
        const {docs, ...paginationInfo} = queryResult;
        const productsVisualice = docs.map((product) => {
            return {
                _id: product._id.toString(),
                title: product.title,
                description: product.description,
                price: product.price,
                thumbnail: product.thumbnail,
                code: product.code,
                stock: product.stock,
                category: product.category                
            }
        });

        const nextPage = parseInt(page)+1;
        const nextPageUrl = `/realtimeproducts?page=${nextPage}&limit=${limit}&sort=${sort}`;
        res.render('realtimeproducts', {productsVisualice, paginationInfo, nextPageUrl, sort});
    } catch(error) {
        console.log(error)
    }
});

viewsRouter.get("/products/:pid", async (req, res, next) => {
    try {
      const { pid } = req.params;
      const product = await ProductModel.findById(pid);
      const productSimplificado = {
        _id: product._id.toString(),
        title: product.title,
        description: product.description,
        price: product.price,
        thumbnail: product.thumbnail,
        code: product.code,
        stock: product.stock,
        category: product.category,
      };
      res.render("product", { product: productSimplificado });
    } catch (error) {
      next(error);
    }
  });


viewsRouter.get("/carts/:cid", async (req, res, next) => {
    try {
      const { cid } = req.params;
      const cart = await dbCarts.get(cid);
  
      const simplifiedCart = cart.products.map((item) => {
        if (item.product) {
          return {
            title: item.product.title,
            price: item.product.price,
            quantity: item.quantity,
          };
        }
        return null; 
      });
      res.render("carts", { cart: simplifiedCart });
    } catch (error) {
      next(error);
    }
  });

export default viewsRouter;