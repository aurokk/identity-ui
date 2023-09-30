"use client"

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Configuration, ConsentApi, FetchParams, ResponseContext, } from '@yaiam/denji-public-client'

function preMiddleware(context: ResponseContext): Promise<FetchParams | void> {
  return Promise.resolve({
    url: context.url,
    init: {
      ...context.init,
      mode: "cors"
    },
  })
}

type Client = {
  description: string | null
  name: string
}

type Scope = {
  description: string | null
  name: string
  value: string
}

type Consent = {
  client: Client
  scopes: Scope[]
}

async function fetchConsent(consentRequestId: string): Promise<Consent> {
  const conf = new Configuration({ basePath: `${process.env.NEXT_PUBLIC_DENJI_PUBLIC_BASE_URL}` })
  const client = new ConsentApi(conf).withPreMiddleware(preMiddleware)
  const req = { consentRequestId }
  const res = await client.apiPublicConsentGetRaw(req, {})
  const value = await res.value()
  if (!res.raw.ok) throw Error()
  return {
    client: {
      description: value.client?.description ?? null,
      name: value.client?.name ?? 'name'
    },
    scopes: (value.scopes ?? []).map((s) => ({
      description: null,
      name: s.name || 'name',
      value: s.value || 'value',
    })),
  }
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
  const response = await res.json()
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
  const response = await res.json()
  return response.consentResponseId
}

function ConsentContent({ consent }: { consent: Consent }) {
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

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div><span className="font-semibold">{consent.client.name}</span> requests access to:</div>
        <div className="space-y-2">
          {consent.scopes.map(s => <div><div className="font-semibold">{s.value}</div><div>{s.name}</div></div>)}
        </div>
      </div>
      <div className="space-y-2">
        <button
          type="submit"
          onClick={onClickReject}
          className="text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center">Reject</button>
        <button
          type="submit"
          onClick={onClickAccept}
          className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center">Accept</button>
      </div>
    </div>
  )
}

function LoadingContent() {
  return <div>Loading...</div>
}

export default function Form() {
  const searchParams = useSearchParams()

  const [consent, setConsent] = useState<Consent | null>(null)

  useEffect(() => {
    const execute = async () => {
      const consentRequestId = searchParams.get('consentRequestId') ?? ''
      const consent = await fetchConsent(consentRequestId)
      setConsent(consent)
    }
    execute()
  }, [])

  return (
    <div className="sm:flex sm:min-h-screen sm:justify-center sm:items-center">
      <div className="sm:w-96">
        <div className="sm:border border-gray-300 p-8">
          {consent ? <ConsentContent consent={consent} /> : <LoadingContent />}
        </div>
      </div>
    </div>
  )
}