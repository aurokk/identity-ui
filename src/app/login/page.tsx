import { cookies } from 'next/headers'
import { redirect, useRouter } from 'next/navigation'
import { FormEvent, FormEventHandler, useState } from 'react'

// todo
// – review undici
import { Agent, setGlobalDispatcher } from 'undici'
import Form from './form'

const agent = new Agent({
  connect: {
    rejectUnauthorized: false
  }
})

setGlobalDispatcher(agent)

type MeResponse = {
  isSignedIn: boolean;
}

async function fetchMe(): Promise<MeResponse> {
  const res = await fetch('https://localhost:20010/account/me', {
    headers: { Cookie: cookies().toString() },
  })
  if (!res.ok) throw Error()

  // todo
  // – add type checking
  return res.json()
}

export default async function Login() {
  const me = await fetchMe()
  if (me.isSignedIn) {
    redirect('/')
  }
  return <Form />
}