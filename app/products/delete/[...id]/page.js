'use client';
import { useParams, useRouter } from 'next/navigation';
import Layout from "@/app/components/layout";
import { useEffect } from 'react';
import { useState } from 'react';
import axios from 'axios';
export default function Delete() {
    const router = useRouter();
    const params =useParams();
    const id=params.id
    const [pInfo,setPInfo]=useState('');
    useEffect(()=>{
        if(!id){
            return;
        }
        else{
            axios.get('/api/products?id='+id).then(reponse=>{
                setPInfo(reponse.data);
            })
        }
    },[id])
    function goBack() {
        router.push('/products');
    }
    async function deleteProduct(){
        await axios.delete('/api/products?id='+id)
        goBack()
    }
    return (
        <Layout>
            <div className='inline-block'>
            <h2 className='text-center'>&nbsp;Do you really want to delete &ldquo;{pInfo.title}&ldquo;&nbsp;? </h2>
            <div className='flex w-[95%] flex-row-reverse gap-5 mt-2'>
            <button onClick={goBack} className='btn default '>
                Cancel
            </button>
            <button className='btn red' onClick={deleteProduct}>
                Delete
            </button>
            </div>
            </div>
        </Layout>
    );
}
