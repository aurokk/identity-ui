"use client"

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

type MeResponse = {
  isSignedIn: boolean;
}

async function fetchMe(): Promise<MeResponse> {
  const res = await fetch('https://localhost:20010/account/me', {
    mode: 'cors',
    credentials: 'include',
  })
  if (!res.ok) throw Error()

  // todo
  // – add type checking
  return res.json()
}

export default function Form() {
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

  useEffect(() => {
    async function check() {
      const me = await fetchMe()
      if (!me.isSignedIn) {
        router.replace('/login')
      }
    }

    check()
  })

  return (
    <div>
      <div>Authorized</div>
      <div>
        <a href="#" onClick={onClickLogout}>Logout</a>
      </div>
    </div>
  )
}
