"use client";

import { getCampaigns } from "@/lib/api";
import { Campaign } from "@/types/typeCampaigns";
import Link from "next/link";
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
        <div>
            <div>
                <h1>Liste des campagnes</h1>
                <Link href="/campaigns/create">
                    <button>Créer une campagne</button>
                </Link>
            </div>

            {errors && <p>{errors}</p>}
            <table>
                <thead>
                    <tr>
                        <th>Nom</th>
                        <th>Annoncuer</th>
                        <th>Statut</th>
                        <th>Impressions</th>
                        <th>Budget</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan={5}>Chargement des campagnes...</td>
                        </tr>
                    ): listeCampaigns.length === 0 ?(
                        <tr>
                            <td colSpan={5}>Aucune campagnes trouvée</td>
                        </tr>
                    ):(
                        listeCampaigns.map((campaign) =>(
                            <tr key={campaign.id}>
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