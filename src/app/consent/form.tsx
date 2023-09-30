"use client"

import { ConsentApiClient } from '@/consentApiClient'
import { Consent } from '@/domain'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

function ConsentContent({ client, consent }: { client: ConsentApiClient, consent: Consent }) {
  const searchParams = useSearchParams()
  const router = useRouter()

  const onClickAccept = async (e: React.MouseEvent) => {
    e.preventDefault()
    const consentRequestId = searchParams.get('consentRequestId') ?? ''
    const consentResponseId = await client.acceptConsent(consentRequestId)
    router.replace(`${process.env.NEXT_PUBLIC_DENJI_PUBLIC_BASE_URL}/connect/authorize/callback?consentResponseId=${consentResponseId}`)
  }

  const onClickReject = async (e: React.MouseEvent) => {
    e.preventDefault()
    const consentRequestId = searchParams.get('consentRequestId') ?? ''
    const consentResponseId = await client.rejectConsent(consentRequestId)
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
  const client = new ConsentApiClient()

  useEffect(() => {
    const execute = async () => {
      const consentRequestId = searchParams.get('consentRequestId') ?? ''
      const consent = await client.fetchConsent(consentRequestId)
      setConsent(consent)
    }
    execute()
  }, [])

  return (
    <div className="sm:flex sm:min-h-screen sm:justify-center sm:items-center">
      <div className="sm:w-96">
        <div className="sm:border border-gray-300 p-8">
          {consent ? <ConsentContent client={client} consent={consent} /> : <LoadingContent />}
        </div>
      </div>
    </div>
  )
}