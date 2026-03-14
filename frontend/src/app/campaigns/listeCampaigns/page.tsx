"use client";

import { getCampaigns } from "@/lib/api";
import { Campaign } from "@/types/typeCampaigns";
import { useEffect, useState } from "react";

const ListeCampaign = () =>{
    const [listeCampaigns, setListeCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState('');

    const loadCampaigns= async () =>{
        setLoading(true);
        try {
            const res = await getCampaigns();
            setListeCampaigns(res.data);
        } catch (error) {
            setErrors('Erreur lors du chargements des campagnes');
            console.error(error);
        }
        finally{
            setLoading(false)
        }
    }

    useEffect(()=>{
        loadCampaigns();
    }, []);

    return(
        <div className="h-screen items-start flex flex-col p-10">
           <h1 className="text-cyan-400 text-2xl font-bold">Liste des campagnes</h1>
            {errors && <p className="text-red-500">{errors}</p>}
            <table>
                <thead>
                    <tr className="border-b border-amber-200 p-2">
                        <th className="border-l border-amber-200 p-2">Nom</th>
                        <th className="border-l border-amber-200 p-2">Annoncuer</th>
                        <th className="border-l border-amber-200 p-2">Statut</th>
                        <th className="border-l border-amber-200 p-2">Impressions</th>
                        <th className="border-l border-r border-amber-200 p-2">Budget</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan={5} className="text-center p-2">Chargement des campagnes...</td>
                        </tr>
                    ): listeCampaigns.length === 0 ?(
                        <tr>
                            <td colSpan={5} className="text-center p-2">Aucune campagnes trouvée</td>
                        </tr>
                    ):(
                        listeCampaigns.map((campaign) =>(
                            <tr key={campaign.id} >
                                <td>{campaign.name}</td>
                                <td>{campaign.advertiser}</td>
                                <td>{campaign.status}</td>
                                <td>{campaign.impressionsServed}</td>
                                <td>{campaign.budget} €</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    )
}

export default ListeCampaign;