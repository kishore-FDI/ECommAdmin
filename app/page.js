'use client';
import { useSession } from "next-auth/react";
import Layout from "./components/layout";
import { useData } from "./components/DataContext";
import { useEffect } from "react";
export default function Home() {
  const {data:session}=useSession();
  const {username,setUsername}=useData();
  useEffect(()=>{
    if(session){
      setUsername((prevData)=>({
        ...prevData,
        username:session?.user?.name
      }))
    }
  },[])
  // if(!session) return;
return(
  <Layout >
    <div className="flex justify-between">
    <h2>
     Hello , {session?.user?.name}
    </h2>
    <img src={session?.user?.image} alt="logo" className="rounded-full size-14"/>
    </div>
  </Layout>
)
  
}

