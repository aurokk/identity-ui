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
      username: username, // todo: email
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
    <div className="sm:flex sm:min-h-screen sm:justify-center sm:items-center">
      <div className="sm:w-96">
        <div className="sm:border border-gray-300 p-8">
          <form className="space-y-6" onSubmit={onSubmit}>
            <div>
              <label
                htmlFor="username"
                className="block mb-2 text-sm font-medium text-gray-900">Username</label>
              <input
                type="text"
                id="username"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-900">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                required />
            </div>
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="remember"
                  type="checkbox"
                  value=""
                  className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300" />
              </div>
              <label
                htmlFor="remember"
                className="ml-2 text-sm font-medium text-gray-900">Remember me</label>
            </div>
            <button
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center">Submit</button>
            <p className="text-sm font-light text-gray-900">Don’t have an account yet? <a href="#" onClick={onClickRegister} className="font-medium text-primary-900 hover:underline">Register</a></p>
            <div className="space-y-2">
              <a
                onClick={onClickGoogle}
                href="#"
                className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center">Login with Google</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}