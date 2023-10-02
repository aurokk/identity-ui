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

type LoginResponseError = {
  errorCode: "lockedOut" | "notAllowed" | "requiresTwoFactor" | "failed"
}

type LoginResponse = {
  isSuccess: boolean
  loginResponseId: string
  errors: LoginResponseError[]
}

async function login(username: string, password: string, loginRequestId: string, isPersistent: boolean): Promise<LoginResponse> {
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
      loginRequestId: loginRequestId,
      isPersistent: isPersistent,
    })
  })

  switch (res.status) {
    case 200:
    case 400:
      {
        const response = await res.json()
        return {
          isSuccess: res.status == 200,
          loginResponseId: response.loginResponseId,
          errors: response.errors.map((x: any) => ({
            errorCode: x.errorCode,
          })),
        }
      }

    default:
      {
        throw new Error()
      }
  }
}

export default function Form() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isPersistent, setIsPersistent] = useState(false)
  const [errors, setErrors] = useState<LoginResponseError[]>([])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const loginRequestId = searchParams.get('loginRequestId') ?? ''
    const response = await login(username, password, loginRequestId, isPersistent)
    if (!response.isSuccess) {
      setErrors(response.errors)
      return
    }

    router.replace(`${process.env.NEXT_PUBLIC_DENJI_PUBLIC_BASE_URL}/connect/authorize/callback?loginResponseId=${response.loginResponseId}`)
    return
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

  const errorCodeToText = (errorCode: string) => {
    switch (errorCode) {
      case "lockedout":
        return "Account is blocked"
      case "notallowed":
        return "Account is blocked"
      case "requirestwofactor":
        return "You have to pass 2FA"
      case "failed":
      default:
        return "Invalid credentials, try again"
    }
  }

  // errors from google
  // useEffect(() => {
  //   const url = new URL(window.document.URL)
  //   if (!url.searchParams.has('errors')) {
  //     return
  //   }
  //   url.searchParams.delete('errors')
  //   window.history.pushState({}, '', url)
  // }, [])

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
            {errors.length > 0 &&
              <div className="bg-red-500 p-3 text-white ">
                {errors.map(e => <div key={e.errorCode}>{errorCodeToText(e.errorCode)}</div>)}
              </div>
            }
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
                onChange={(e) => { setUsername(e.target.value), setErrors([]) }}
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
                onChange={(e) => { setPassword(e.target.value), setErrors([]) }}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                required />
            </div>
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="remember"
                  type="checkbox"
                  value=""
                  onChange={(e) => setIsPersistent(e.target.checked)}
                  className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300" />
              </div>
              <label
                htmlFor="remember"
                className="ml-2 text-sm font-medium text-gray-900">Remember me</label>
            </div>
            <div className="space-y-2">
              <button
                type="submit"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center">Submit</button>
              <a
                onClick={onClickGoogle}
                href="#"
                className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center">Login with Google</a>
            </div>
            <p className="text-sm font-light text-gray-900">Don’t have an account yet? <a href="#" onClick={onClickRegister} className="font-medium text-primary-900 hover:underline">Register</a></p>
          </form>
        </div>
      </div>
    </div>
  )
}