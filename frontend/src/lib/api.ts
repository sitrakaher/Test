import { CampaignFilters, CreateCampaignData } from "@/types/typeCampaigns";
import axios from "axios";
const Api = axios.create({
    baseURL:'http://localhost:3000',
});

export const getCampaigns = (filters?:CampaignFilters) =>{
    return Api.get("/campaigns", {params:filters});
};

export const createCampaign = (data:CreateCampaignData) =>{
    return Api.post('/campaigns', data);
};

export const serveAd = (country: string)=> {
    return Api.post('serve-ad', { country });
}

export const getStats = () =>{
    return Api.get('/stats');
};