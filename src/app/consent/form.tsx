"use client"

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

// type MeResponse = {
//   isSignedIn: boolean;
// }

async function fetchConsent(consentRequestId: string): Promise<void> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_DENJI_PUBLIC_BASE_URL}/api/public/consent?consentRequestId=${consentRequestId}`, {
    mode: 'cors',
    credentials: 'include',
  })
  if (!res.ok) throw Error()
}

async function acceptConsent(consentRequestId: string): Promise<string> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_DENJI_PUBLIC_BASE_URL}/api/public/consent/accept`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    mode: 'cors',
    credentials: 'include',
    body: JSON.stringify({
      consentRequestId: consentRequestId,
    })
  })
  if (!res.ok) throw Error()
  const response = await res.json();
  return response.consentResponseId
}

async function rejectConsent(consentRequestId: string): Promise<string> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_DENJI_PUBLIC_BASE_URL}/api/public/consent/reject`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    mode: 'cors',
    credentials: 'include',
    body: JSON.stringify({
      consentRequestId: consentRequestId,
    })
  })
  if (!res.ok) throw Error()
  const response = await res.json();
  return response.consentResponseId
}

// async function login(username: string, password: string, loginRequestId: string): Promise<string> {
//   const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/account/login`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     mode: 'cors',
//     credentials: 'include',
//     body: JSON.stringify({
//       username: username,
//       password: password,
//       loginRequestId: loginRequestId
//     })
//   })
//   if (!res.ok) throw Error()
//   const response = await res.json();
//   return response.loginResponseId
// }

export default function Form() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const onClickAccept = async (e: React.MouseEvent) => {
    e.preventDefault()
    const consentRequestId = searchParams.get('consentRequestId') ?? ''
    const consentResponseId = await acceptConsent(consentRequestId)
    router.replace(`${process.env.NEXT_PUBLIC_DENJI_PUBLIC_BASE_URL}/connect/authorize/callback?consentResponseId=${consentResponseId}`)
  }

  const onClickReject = async (e: React.MouseEvent) => {
    e.preventDefault()
    const consentRequestId = searchParams.get('consentRequestId') ?? ''
    const consentResponseId = await rejectConsent(consentRequestId)
    router.replace(`${process.env.NEXT_PUBLIC_DENJI_PUBLIC_BASE_URL}/connect/authorize/callback?consentResponseId=${consentResponseId}`)
  }

  // const [username, setUsername] = useState('')
  // const [password, setPassword] = useState('')
  // const onSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault()
  //   const loginRequestId = searchParams.get('loginRequestId') ?? ''
  //   const loginResponseId = await login(username, password, loginRequestId)
  //   const returnUrl = decodeURI(searchParams.get('ReturnUrl') ?? '/')
  //   router.replace(returnUrl + `&loginResponseId=${loginResponseId}`)
  // }
  // const onClickGoogle = async (e: React.MouseEvent) => {
  //   e.preventDefault()
  //   const loginRequestId = searchParams.get('loginRequestId') ?? ''
  //   const returnUrl = encodeURIComponent(decodeURI(searchParams.get('ReturnUrl') ?? '/'))
  //   router.push(`${process.env.NEXT_PUBLIC_API_BASE_URL}/account/login/google?returnUrl=${returnUrl}&loginRequestId=${loginRequestId}`)
  // }
  // const onClickRegister = async (e: React.MouseEvent) => {
  //   e.preventDefault()
  //   const loginRequestId = searchParams.get('loginRequestId') ?? ''
  //   const returnUrl = encodeURIComponent(decodeURI(searchParams.get('ReturnUrl') ?? '/'))
  //   router.push(`/register?ReturnUrl=${returnUrl}&loginRequestId=${loginRequestId}`)
  // }

  useEffect(() => {
    const consentRequestId = searchParams.get('consentRequestId') ?? ''
    fetchConsent(consentRequestId)
  }, [])

  return (
    <div>
      <div>Consent</div>
      {/* 
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
      </div>*/}
      <div>
        <a href="#" onClick={onClickAccept}>Accept</a>
      </div>
      <div>
        <a href="#" onClick={onClickReject}>Reject</a>
      </div>
    </div>
  )
}