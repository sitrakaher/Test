import { CampaignStatus } from "@prisma/client";
import prisma from "../prisma/prisma"
import { CampaignFilters, CreateCampaignData } from "../types/typeCampaign";

const CampaignServices = {
    async createCampaign(data:CreateCampaignData) {
        const { name, advertiser, startDate, endDate, budget, targetCountries } = data;

        if (!name || !advertiser || !startDate || !endDate || !budget || !targetCountries) {
            throw new Error("Tous les champs sont obligatoires");
        }

        if (new Date(endDate) <= new Date (startDate)) {
            throw new Error("La date de fin doit être après la date début");
        }

        if (budget <= 0) {
            throw new Error("Le budget doit être supérieur à 0");
        }

        const now = new Date();
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        let status: CampaignStatus;

        if (now <start) {
            status = CampaignStatus.paused; //pas encore commencé
        } else if (now >= start && now <= end){
            status = CampaignStatus.active; // en cours
        } else {
            status = CampaignStatus.ended; // date dépassée
        }

        const campaign = await prisma.campaigns.create({
            data:{
                name,
                advertiser,
                startDate: start,
                endDate: end,
                budget,
                targetCountries,
                status,
                impressionsServed: 0
            }
        })
        return campaign;
    },

    async getCampaigns(filters: CampaignFilters={}) {
        const { status, advertiser, country } = filters;
        const where: any ={};

        if (status) where.status = status;
        if (advertiser) where.advertiser = advertiser;
        if (country) where.targetCountries = { has: country};

        return await prisma.campaigns.findMany({
            where,
            orderBy:{advertiser:'desc'}
        });
    },

    async findCampaignServe(country: string) {
        const campaign = await prisma.campaigns.findFirst({
            where: {
                status: CampaignStatus.active,
                startDate:{ lte: new Date()},
                endDate: { gte: new Date()},
                targetCountries: { has: country},
                budget: { gt:0}
            },
            orderBy: { startDate:"desc"}
        });

        if (!campaign) return null;

        const updateCampaign = await prisma.campaigns.update({
            where: { id: campaign.id},
            data:{
                impressionsServed: { increment: 1},
                budget : { decrement: 0.01}
            }
        });

        if (updateCampaign.budget <=0) {
            await prisma.campaigns.update({
                where: {id: updateCampaign.id},
                data: {status:CampaignStatus.ended}
            });
        }

        return updateCampaign;
    },

    async getStatistique() {
        const totalCampaigns = await prisma.campaigns.count();

        const activeCampaigns = await prisma.campaigns.count({
            where : { status: CampaignStatus.active}
        });

        const totalImpressions = await prisma.campaigns.aggregate({
            _sum: { impressionsServed: true}
        });

        const topAdvertiserData = await prisma.campaigns.groupBy({
            by: ["advertiser"],
            _sum: { impressionsServed:true},
            orderBy:{ _sum: { impressionsServed: "desc"}},
            take:1,
        });

        return { 
            totalCampaigns,
            activeCampaigns,
            totalImpressions: totalImpressions._sum.impressionsServed || 0,
            topAdvertiserData: topAdvertiserData[0]?.advertiser || null,

        }
    }
}

export default CampaignServices;