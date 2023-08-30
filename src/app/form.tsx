"use client";

import { useRouter } from 'next/navigation'

export default async function Form() {

  const router = useRouter()
  
  const onClickLogout = async (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    await fetch('https://localhost:20010/account/logout', {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
    })
    router.replace('/login')
  }

  return (
    <div>
      <div>Authorized</div>
      <div>
        <a href="#" onClick={onClickLogout}>Logout</a>
      </div>
    </div>
  )
}
