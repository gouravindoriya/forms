"use client"

import { useEffect } from "react";
import { useUser } from "~/hooks/api/auth"
import {useRouter} from "next/navigation"
export default function Home() {
  const {user}=useUser();
  const router = useRouter();

  useEffect(()=>{
     if(user){
        router.replace("/dashboard")
     }
  },[router,user])

  return (

    <main className="min-h-screen min-w-screen flex justify-center items-center">
      <div>
        <h1 className="text-3xl">Welcome, {user?.fullName || "Guest"}!</h1>
        {JSON.stringify(user)}
      </div>
    </main>
  );
}
