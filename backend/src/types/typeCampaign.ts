export interface CreateCampaignData {
    name: string;
    advertiser: string;
    startDate:string;
    endDate:string;
    budget:number;
    targetCountries:string[];
}

export interface CampaignFilters {
    status?:string;
    advertiser?:string;
    country?:string;
}