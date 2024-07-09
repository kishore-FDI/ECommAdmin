'use client';
import { signIn, signOut } from 'next-auth/react';
import { useSession } from '@/app/components/useSession';
import Navbar from './Navbar';
import { useData } from './DataContext';
import { useState } from 'react';
import Link from 'next/link';

export default function Layout({ children }) {
  const { data: session, status } = useSession();
  const {name,setName}=useData();
  const [showNav,setShowNav]=useState(false)
  if (status === "loading") {
    return <p>Loading...</p>;
  }
  if (!session) {
    return (
      <main className="bg-blue-900 w-screen h-screen flex items-center justify-center text-black">
        <div className="text-center sm:h-[20%] bg-white px-4 sm: flex flex-col sm:justify-between rounded-xl items-center py-4 ">
          <p className='text-xl text-wrap hidden sm:block '>A quick login before we<br/> get started</p>
          <div><button onClick={() => signIn('google')} className="border-2 p-2 px-4 rounded-xl my-2 ">Login with google</button></div>
        </div>
      </main>
    );
  }
  return (
    <main className="bg-purple-400 min-h-screen">
      <div className="block md:hidden flex items-center justify-between p-2">      
      <button onClick={()=>setShowNav(!showNav)}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
      </svg>
      </button>
      <Link href='/' className='flex gap-1 p-1 pl-0 text-white'>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />
        </svg>
        <span >
            ECommerceAdmin
        </span>
      </Link>
      <div></div>
      </div>
    <div className="bg-purple-400 min-h-screen flex text-black ">
      <Navbar show={showNav} />
      <div className='bg-white flex-grow my-2 mr-2 rounded-lg p-4 flex flex-col justify-between'>
        <div>{children}</div>
        <h1 className="items-end">{name}</h1>
      </div>
    </div>
    </main>

  );
}
