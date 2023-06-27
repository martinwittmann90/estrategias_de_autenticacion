//----------------MONGO------------------------------
import { connect, model, Schema, mongoose } from 'mongoose';

export async function connectMongo() {
  try {
    await connect(
      "mongodb+srv://martinwittmann90:iC00uo5o@projectmartinwittmann.l8a7l5b.mongodb.net/ecommerce?retryWrites=true&w=majority"
    );
    console.log("Connected succesfuly to MongoDB");
  } catch (e) {
    console.log(e);
    throw "Can not connect to mongo";
  }
}