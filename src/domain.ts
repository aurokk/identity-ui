export type Client = {
  description: string | null
  name: string
}

export type Scope = {
  description: string | null
  name: string
  value: string
}

export type Consent = {
  client: Client
  scopes: Scope[]
}
