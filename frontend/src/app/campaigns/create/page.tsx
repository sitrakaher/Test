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
    <div className='h-screen w-full flex items-center justify-center flex-col gap-6'>
        <h1 className='text-2xl font-bold text-cyan-300'>Créer une campagne</h1>
        <form onSubmit={handelSubmit} className='p-6 border border-cyan-400 w-fit flex flex-col item-center justify-center shadow-2xl shadow-gray-500 rounded'>
            <div className='flex items-center justify-center  flex-col'>
                <label htmlFor="nom">Nom</label>
                <input type="text" name="name" id="nom" value={formData.name} onChange={handleChange} placeholder='ex: Summer Campaign' className='border border-gray-200 p-2 rounded focus:outline-none w-full'/>
            </div>
            <div className='flex items-center justify-center  flex-col'>
                <label htmlFor="annonceur">Annonceur</label>
                <input type="text" name="advertiser" id="annonceur" value={formData.advertiser} onChange={handleChange} placeholder='ex: Nike' className='border border-gray-200 p-2 rounded focus:outline-none w-full'/>
            </div>
            <div className='flex items-center justify-center  flex-col'>
                <label htmlFor="startDate">Date de début</label>
                <input type="date" name="startDate" id="startDate" value={formData.startDate} onChange={handleChange} className='border border-gray-200 p-2 rounded focus:outline-none w-full'/>
            </div>
            <div className='flex items-center justify-center  flex-col'>
                <label htmlFor="endDate">Date de fin</label>
                <input type="date" name="endDate" id="endDate" value={formData.endDate} onChange={handleChange} className='border border-gray-200 p-2 rounded focus:outline-none w-full'/>
            </div>
            <div className='flex items-center justify-center  flex-col'>
                <label htmlFor="budget">Budget (€)</label>
                <input type="number" name="budget" id="budget" value={formData.budget} onChange={handleChange} placeholder='ex: 1000' className='border border-gray-200 p-2 rounded focus:outline-none w-full'/>
            </div>
            <div className='flex items-center justify-center flex-col'>
                <label htmlFor="targetCountries">Pays cibles (séparés par des virgules)</label>
                <input type="text" name="targetCountries" id="targetCountries" value={formData.targetCountries} onChange={handleChange} placeholder='ex: FR, ES, DE' className='border border-gray-200 p-2 rounded focus:outline-none w-full'/>
            </div>

            <button type="submit" className='p-2 bg-cyan-400 text-white font-semibold my-2 rounded hover:bg-cyan-300 w-full flex items-center justify-center'>Créer la campagne</button>
        </form>
    </div>
  )
}

export default FormulareCampaigns