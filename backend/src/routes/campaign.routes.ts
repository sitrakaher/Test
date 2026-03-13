import express from "express";
import rateLimit from "express-rate-limit";
import CampaignsControllers from "../controllers/campaigns.controllers";

const router = express.Router();

//Limite stricte pour serve-ad
const serverAdLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max:30,
    message:{ error:"Trop d'impressions, réessayez dans 1 minute"}
})

router.get('/campaigns', CampaignsControllers.getCampaigns);
router.post('/campaigns', CampaignsControllers.createCampaigns);
router.post('/serve-ad', serverAdLimiter, CampaignsControllers.findCampaignServe);
router.get('/stats', CampaignsControllers.getStatistique)

export default router;