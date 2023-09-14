"use client"

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

type MeResponse = {
  isSignedIn: boolean;
}

async function fetchMe(): Promise<MeResponse> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_POWER_PUBLIC_BASE_URL}/account/me`, {
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
    await fetch(`${process.env.NEXT_PUBLIC_POWER_PUBLIC_BASE_URL}/account/logout`, {
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
  }, [])

  return (
    <div>
      <div>Authorized</div>
      <div>
        <a href="#" onClick={onClickLogout}>Logout</a>
      </div>
    </div>
  )
}
