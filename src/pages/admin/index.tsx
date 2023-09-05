import { useRouter } from 'next/router';
import React, { useEffect } from 'react'
import Login from '../auth/login';
import WithAuth from "../../auth/withAuth";
import USER_TYPE from "../../auth/constans";

const Index = () => {
  const router = useRouter();

  useEffect(() => {
    const adminAuth = localStorage.getItem("isAdmin");
    adminAuth ? null : router.push("/auth/login");
  }, [])

  return (
    <div>
      {/* {/ <Login/> /} */}
    </div>
  )
}

export default WithAuth(Index, USER_TYPE.Admin);