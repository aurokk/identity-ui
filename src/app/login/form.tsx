"use client"

import { AccountApiClient, LoginResponseError } from '@/accountApiClient'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

export default function Form() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isPersistent, setIsPersistent] = useState(false)
  const [errors, setErrors] = useState<LoginResponseError[]>([])
  const [client, _] = useState<AccountApiClient>(new AccountApiClient())

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const loginRequestId = searchParams.get('loginRequestId') ?? ''
    const response = await client.login(email, password, isPersistent, loginRequestId)
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
    router.push(`${process.env.NEXT_PUBLIC_POWER_PUBLIC_BASE_URL}/account/login/google?loginRequestId=${loginRequestId}`)
  }

  const onClickRegister = async (e: React.MouseEvent) => {
    e.preventDefault()
    const loginRequestId = searchParams.get('loginRequestId') ?? ''
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
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-900">Email</label>
              <input
                type="text"
                id="email"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="Email"
                value={email}
                onChange={(e) => { setEmail(e.target.value), setErrors([]) }}
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