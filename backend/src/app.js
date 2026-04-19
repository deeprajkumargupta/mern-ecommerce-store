import express from 'express'
import cors from 'cors'
import cookieParser from "cookie-parser";

const app = express()
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}))

app.use(express.json())
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

import productRouter from './routes/product.routes.js'

app.use("/api/v1/products", productRouter)


import cartRouter from './routes/cart.routes.js'

app.use("/api/v1/cart", cartRouter)


import authRouter from './routes/auth.routes.js'

app.use("/api/v1/auth", authRouter)


export { app }
