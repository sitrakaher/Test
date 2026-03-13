export type Campaign = {
    id:string;
    name:string;
    advertiser:string;
    startDate: string;
    endDate: string;
    budget:number;
    impressionsServed: number;
    targetCountries: string[];
    status: string;
}

export type StatsCampaigns = {
    totalCampaigns: number;
    activeCampaigns:number;
    totalImpressions:number;
    topAdvertiserData: number;
}

export type CreateCampaignData = {
    name:string;
    advertiser:string;
    startDate: string;
    endDate: string;
    budget:number;
    targetCountries: string[];
}

export type CampaignFilters = {
    status?: string;
    advertiser?:string;
    country?:string;
}