import 'dotenv/config'
import { app } from "./app.js";
import connectDB from './db/connectDB.js';


connectDB()
  .then(() => {
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server is running at port : ${process.env.PORT}`);
    })
  })
  .catch(err => {
    console.log("MONGO DB connection failed!!!", err);
  })