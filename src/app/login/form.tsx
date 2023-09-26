"use client"

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

type MeResponse = {
  isSignedIn: boolean;
}

async function fetchMe(): Promise<MeResponse> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_POWER_PUBLIC_BASE_URL}/account/me`, {
    mode: 'cors',
    credentials: 'include',
  })
  if (!res.ok) throw Error()
  return res.json()
}

async function login(username: string, password: string, loginRequestId: string): Promise<string> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_POWER_PUBLIC_BASE_URL}/account/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    mode: 'cors',
    credentials: 'include',
    body: JSON.stringify({
      username: username,
      password: password,
      loginRequestId: loginRequestId
    })
  })
  if (!res.ok) throw Error()
  const response = await res.json();
  return response.loginResponseId
}

export default function Form() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const loginRequestId = searchParams.get('loginRequestId') ?? ''
    const loginResponseId = await login(username, password, loginRequestId)
    // const returnUrl = decodeURI(searchParams.get('ReturnUrl') ?? '/')
    router.replace(`${process.env.NEXT_PUBLIC_DENJI_PUBLIC_BASE_URL}/connect/authorize/callback?loginResponseId=${loginResponseId}`)
  }
  const onClickGoogle = async (e: React.MouseEvent) => {
    e.preventDefault()
    const loginRequestId = searchParams.get('loginRequestId') ?? ''
    // const returnUrl = encodeURIComponent(decodeURI(searchParams.get('ReturnUrl') ?? '/'))
    router.push(`${process.env.NEXT_PUBLIC_POWER_PUBLIC_BASE_URL}/account/login/google?loginRequestId=${loginRequestId}`)
  }
  const onClickRegister = async (e: React.MouseEvent) => {
    e.preventDefault()
    const loginRequestId = searchParams.get('loginRequestId') ?? ''
    // const returnUrl = encodeURIComponent(decodeURI(searchParams.get('ReturnUrl') ?? '/'))
    router.push(`/register?loginRequestId=${loginRequestId}`)
  }
  // useEffect(() => {
  //   async function check() {
  //     const me = await fetchMe()
  //     if (me.isSignedIn) {
  //       router.replace('/')
  //     }
  //   }
  //   check()
  // }, [])
  return (
    <div>
      <div>Login</div>
      <div>
        <form onSubmit={onSubmit}>
          <div>
            <input placeholder="username" value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div>
            <input placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div>
            <button type="submit">Submit</button>
          </div>
        </form>
      </div>
      <div>
        <a href="#" onClick={onClickRegister}>Register</a>
      </div>
      <div>
        <a href="#" onClick={onClickGoogle}>Google</a>
      </div>
    </div>
  )
}