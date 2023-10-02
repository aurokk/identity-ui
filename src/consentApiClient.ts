import { Configuration, ConsentApi, FetchParams, ResponseContext } from "@yaiam/denji-public-client";
import { Consent } from "./domain";

function corsPreMiddleware(context: ResponseContext): Promise<FetchParams | void> {
  return Promise.resolve({
    url: context.url,
    init: {
      ...context.init,
      mode: "cors",
      credentials: "include",
    },
  })
}

export class ConsentApiClient {
  private readonly _client: ConsentApi;

  constructor() {
    const configuration = new Configuration({ basePath: `${process.env.NEXT_PUBLIC_DENJI_PUBLIC_BASE_URL}` })
    this._client = new ConsentApi(configuration).withPreMiddleware(corsPreMiddleware)
  }

  public fetchConsent = async (consentRequestId: string): Promise<Consent> => {
    const req = { consentRequestId }
    const res = await this._client.apiPublicConsentGetRaw(req, {})
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

  public acceptConsent = async (consentRequestId: string): Promise<string> => {
    const req = { apiApiPublicConsentAcceptRequest: { consentRequestId } }
    const res = await this._client.apiPublicConsentAcceptPostRaw(req, {})
    const value = await res.value()
    if (!res.raw.ok) throw Error()
    return value.consentResponseId ?? ''
  }

  public rejectConsent = async (consentRequestId: string): Promise<string> => {
    const req = { apiApiPublicConsentRejectRequest: { consentRequestId } }
    const res = await this._client.apiPublicConsentRejectPostRaw(req, {})
    const value = await res.value()
    if (!res.raw.ok) throw Error()
    return value.consentResponseId ?? ''
  }
}
