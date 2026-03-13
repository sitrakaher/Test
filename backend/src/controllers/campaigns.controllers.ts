import { Request, Response } from "express";
import CampaignServices from "../services/campaigns.services";

const CampaignsControllers = {
    async createCampaigns(req: Request, res:Response) {
        try {
            const campaign = await CampaignServices.createCampaign(req.body);
            res.status(201).json(campaign);
        } catch (error: any) {
            res.status(500).json({error: error.message});
        }
    },

    async getCampaigns(req: Request, res:Response){
        try {
            const campaigns = await CampaignServices.getCampaigns(req.query);
            res.json(campaigns);
        } catch (error:any) {
            res.status(500).json({ error: error.message});
        }
    },
    async findCampaignServe(req: Request, res:Response) {
        try {
            const { country } = req.body;

            if (!country) {
                return res.status(400).json({error: "Le pays est obligatoire"})
            }

            const campaign = await CampaignServices.findCampaignServe(country);
            
            if (!campaign) {
                return res.status(404).json({ error:"Aucune campagne active trouvée"})
            }
            
            res.json(campaign);

        } catch (error:any) {
            res.status(500).json({error: error.message});
        }
    },
    async getStatistique(req: Request, res: Response){
        try {
            const stats = await CampaignServices.getStatistique();
            res.json(stats);
        } catch (error:any) {
            res.status(500).json({error:error.message})
        }
    }
}

export default CampaignsControllers;