"use client";

import { getStats } from "@/lib/api";
import { StatsCampaigns } from "@/types/typeCampaigns";
import { useEffect, useState } from "react";


const DashBoardStats = () =>{
    const [listesStatistque, setListesStatistique] = useState<StatsCampaigns | null>(null);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState('');

    const loadStats = async () =>{
        setLoading(true);
        try {
            const res = await getStats();
            setListesStatistique(res.data);
        } catch (error) {
            setErrors('Erreur lors du chargement des statistiques');
            console.error(error);
        }
        finally {
            setLoading(false);
        }
    }

    useEffect(()=>{
        loadStats();
    }, [])

    return(
        <div>
            <h1>Dashboard Statistiques</h1>
            {errors && <p>{errors}</p>}
            <table>
                <thead>
                    <tr>
                        <th>Total Campagnes</th>
                        <th>Campagnes Actives</th>
                        <th>Impressions Totales</th>
                        <th>Top Advertiser</th>
                    </tr>
                </thead>
                <tbody>
                    {loading?
                    (
                        <tr>
                            <td colSpan={4}>Chargement des statistiques...</td>
                        </tr>
                    ): !listesStatistque ?(
                        <tr>
                            <td colSpan={4}>Aucune statistiques trouvée</td>
                        </tr>
                    ):
                    (
                        <tr>
                            <td>{listesStatistque.totalCampaigns}</td>
                            <td>{listesStatistque.activeCampaigns}</td>
                            <td>{listesStatistque.totalImpressions}</td>
                            <td>{listesStatistque.topAdvertiserData ??'Auccun'}</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}

export default DashBoardStats;