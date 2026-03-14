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
        <div className="h-screen items-start flex flex-col p-10">
            <h1 className="text-2xl font-bold text-cyan-400">Dashboard Statistiques</h1>
            <div className="p-2">
                {errors && <p className="text-red-500">{errors}</p>}
            <table>
                <thead>
                    <tr className="border-b border-amber-200 p-2">
                        <th className="border-l border-amber-200 p-2">Total Campagnes</th>
                        <th className="border-l border-amber-200 p-2">Campagnes Actives</th>
                        <th className="border-l border-amber-200 p-2">Impressions Totales</th>
                        <th className="border-l border-amber-200 border-r p-2">Top Advertiser</th>
                    </tr>
                </thead>
                <tbody>
                    {loading?
                    (
                        <tr >
                            <td colSpan={4}  className="text-center p-2">Chargement des statistiques...</td>
                        </tr>
                    ): !listesStatistque ?(
                        <tr>
                            <td colSpan={4} className="text-center p-2">Aucune statistiques trouvée</td>
                        </tr>
                    ):
                    (
                        <tr className="border-b border-amber-200 p-2">
                            <td>{listesStatistque.totalCampaigns}</td>
                            <td>{listesStatistque.activeCampaigns}</td>
                            <td>{listesStatistque.totalImpressions}</td>
                            <td>{listesStatistque.topAdvertiserData ??'Auccun'}</td>
                        </tr>
                    )}
                </tbody>
            </table>
            </div>
        </div>
    )
}

export default DashBoardStats;