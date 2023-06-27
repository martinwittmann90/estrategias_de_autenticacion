/* -------IMPORTS-------*/
import MongoStore from 'connect-mongo';
import express from 'express'
import exphbs from "express-handlebars";
import session from 'express-session';
import morgan from "morgan";
import { Server as SocketServer } from "socket.io";
import http from "http";
import viewsRouter from "./routes/view.routes.js";
import productsRouter from "./routes/products.routes.js";
import cartsRouter from "./routes/carts.routes.js";
import chatRouter from "./routes/chat.routes.js"
import sessionsRouter from "./routes/sessions.routes.js";
import websockets from "./websockets/websockets.js";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { connectMongo } from "./config/configMongoDB.js";

import passport from "passport";
import initPassport from "./config/passport.config.js";
import "./config/passport.config.js";
import cookieParser from "cookie-parser";

/*-------VARIABLES-------*/
const app = express();
const PORT = 8080;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
console.log(__dirname);

/*-------SETTING MIDDLEWARES-------*/
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

/*-------SETTING HANDLEBARS-------*/
app.engine ('handlebars', exphbs.engine());
app.set('views',__dirname + "/views");
app.set("view engine", "handlebars");

/*-------SERVIDORES-------*/
const httpServer = http.createServer(app);
const io = new SocketServer(httpServer);
websockets(io);
connectMongo();

const server = httpServer.listen(PORT, () =>
  console.log(
    `Server started on port ${PORT}. at ${new Date().toLocaleString()}`
  )
);
server.on("error", (err) => console.log(err));

/*-------SESSION-------------*/
app.use(
  session({
    store: MongoStore.create({  
       mongoUrl: 'mongodb+srv://martinwittmann90:iC00uo5o@projectmartinwittmann.l8a7l5b.mongodb.net/ecommerce?retryWrites=true&w=majority', 
       ttl: 7200 
      }),
    secret: 'secretCoder',
    resave: true,
    saveUninitialized:true
})
);

initPassport();
app.use(passport.initialize());
app.use(passport.session());

/*-------SETTING ROUTES-------*/
app.use('/', viewsRouter); 
app.use('/realtimeproducts', viewsRouter); 
app.use('/products', viewsRouter);
app.use("/chat", chatRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use("/api/sessions", sessionsRouter);
app.get('/*', async (req, res) => {
  res.render("notfound");
})