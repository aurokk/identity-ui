"use client";

import { redirect, useRouter } from 'next/navigation'
import { FormEvent, FormEventHandler, useState } from 'react'

async function login(username: string, password: string): Promise<void> {

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
    })
  })
  if (!res.ok) throw Error()

  // todo
  // – add type checking
  return
}

export default function Form() {

  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await login(username, password)
    router.replace('/')
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