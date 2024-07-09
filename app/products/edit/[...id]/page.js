'use client';
import Layout from "@/app/components/layout"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react";
import axios from "axios";
import PForm from "@/app/components/ProductForm";
const Page = () => {
  const [pInfo,setPInfo]=useState(null)
    const params =useParams();
    const id=params.id
    // console.log(id)
    useEffect(()=>{
      if (!id){
        return;
      }
      axios.get('/api/products?id='+id).then(response=>{
        setPInfo(response.data)
      })
    },[id])
  return (
   <Layout>
    {pInfo && (
      <PForm {...pInfo} form={"Current Product Details"}/>
    )}
   </Layout>
  )
}

export default Page