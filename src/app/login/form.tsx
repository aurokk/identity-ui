"use client";

import { redirect, useRouter, useSearchParams } from 'next/navigation'
import { FormEvent, FormEventHandler, useState } from 'react'

async function login(username: string, password: string, loginRequestId: string): Promise<string> {

  const res = await fetch('https://localhost:20010/account/login', {
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
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const loginRequestId = searchParams.get('loginRequestId') ?? ''
    const loginResponseId = await login(username, password, loginRequestId)
    const returnUrl = decodeURI(searchParams.get('ReturnUrl') ?? '/')
    router.replace(returnUrl + `&loginResponseId=${loginResponseId}`)
  }
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
    </div>
  )
}