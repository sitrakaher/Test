import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import campaignRoutes from './routes/campaign.routes'
dotenv.config();

const PORT = process.env.PORT;
const allowedOrigin = process.env.FRONTEND_URL;


const app = express();

//Limite globale - 100 requêtes par 15 minutes par IP
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {error: "Trop de requêtes, réessayez dans 15 minutes"}
});

app.use(express.json());
app.use(cors({
    origin:allowedOrigin,
    credentials:true,
}));

app.use(limiter);

//on initialise juste à vide en remplira après
app.use('/', campaignRoutes);

app.listen(PORT, ()=>{
    console.log("Backend running on port", PORT)
})

