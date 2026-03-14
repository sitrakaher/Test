"use client";
import { createCampaign } from '@/lib/api';
import { useRouter } from 'next/navigation';
import React, { FormEvent, useState } from 'react'
import { toast } from 'react-toastify';

const FormulareCampaigns = () => {
    const router = useRouter();

    const [formData, setFormData] = useState({
        name:"",
        advertiser:"",
        startDate:"",
        endDate:"",
        targetCountries: "",
        budget: "",
    });

    const handleChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
        setFormData({...formData, [e.target.name]: e.target.value});
    }

    const handelSubmit = async (e:React.FormEvent)=>{
        e.preventDefault();

        if (!formData.name || !formData.advertiser || !formData.startDate || !formData.endDate || !formData.budget || !formData.targetCountries){
            toast.error('Veuillez remplir tous les champs');
            return;
        }

        if (new Date(formData.endDate) <= new Date(formData.startDate)) {
            toast.error('La date de fin doit être après la date de début');
            return;
        }

        if (Number(formData.budget) <=0) {
            toast.error('Le budget doit être supérieur à 0');
            return;
        }

        try {
            await createCampaign({
                ...formData,
                budget:Number(formData.budget),
                targetCountries: formData.targetCountries.split(',').map(c=>c.trim().toUpperCase())
            })
            toast.success('Campagne crée avec succès !');
            router.push('/campaigns/listeCampaigns');
        } catch (error) {
            toast.error("Erreur lors de la création");
            console.error(error);
        }
    }
  return (
    <div>
        <h1>Créer une campagne</h1>
        <form onSubmit={handelSubmit} className='p-6 flex item-center justify-center'>
            <div>
                <label htmlFor="nom">Nom</label>
                <input type="text" name="name" id="nom" value={formData.name} onChange={handleChange} placeholder='ex: Summer Campaign'/>
            </div>
            <div>
                <label htmlFor="annonceur">Annonceur</label>
                <input type="text" name="advertiser" id="annonceur" value={formData.advertiser} onChange={handleChange} placeholder='ex: Nike'/>
            </div>
            <div>
                <label htmlFor="startDate">Date de début</label>
                <input type="date" name="startDate" id="startDate" value={formData.startDate} onChange={handleChange}/>
            </div>
            <div>
                <label htmlFor="endDate">Date de fin</label>
                <input type="date" name="endDate" id="endDate" value={formData.endDate} onChange={handleChange}/>
            </div>
            <div>
                <label htmlFor="budget">Budget (€)</label>
                <input type="number" name="budget" id="budget" value={formData.budget} onChange={handleChange} placeholder='ex: 1000'/>
            </div>
            <div>
                <label htmlFor="targetCountries">Pays cibles (séparés par des virgules)</label>
                <input type="text" name="targetCountries" id="targetCountries" value={formData.targetCountries} onChange={handleChange} placeholder='ex: FR, ES, DE'/>
            </div>

            <button type="submit">Créer la campagne</button>
        </form>
    </div>
  )
}

export default FormulareCampaigns