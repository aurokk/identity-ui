import { Configuration, AccountApi, FetchParams, ResponseContext } from "@yaiam/power-public-client"

export type LoginResponseError = {
  errorCode: "lockedOut" | "notAllowed" | "requiresTwoFactor" | "failed"
}

export type LoginResponse = {
  isSuccess: boolean
  loginResponseId: string
  errors: LoginResponseError[]
}

export type RegisterResponseError = {
  errorCode:
  "unknownError"
  | "confirmationDoesNotMatchToPassword"
  | "invalidUserName"
  | "invalidEmail"
  | "duplicateUserName"
  | "duplicateEmail"
  | "userAlreadyHasPassword"
  | "passwordTooShort"
  | "passwordRequiresUniqueChars"
  | "passwordRequiresNonAlphanumeric"
  | "passwordRequiresDigit"
  | "passwordRequiresLower"
  | "passwordRequiresUpper"
}

export type RegisterResponse = {
  isSuccess: boolean
  loginResponseId: string
  errors: RegisterResponseError[]
}

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

export class AccountApiClient {
  private readonly _client: AccountApi;

  constructor() {
    const configuration = new Configuration({ basePath: `${process.env.NEXT_PUBLIC_POWER_PUBLIC_BASE_URL}` })
    this._client = new AccountApi(configuration).withPreMiddleware(corsPreMiddleware)
  }

  public login = async (email: string, password: string, isPersistent: boolean, loginRequestId: string): Promise<LoginResponse> => {
    const req = {
      apiApiPublicAccountLoginRequest: {
        email: email,
        password: password,
        isPersistent: isPersistent,
        loginRequestId: loginRequestId,
      },
    }
    const res = await this._client.apiPublicAccountLoginPostRaw(req, {})
    const value = await res.value()
    if (!res.raw.ok) throw Error()
    return {
      isSuccess: value.isSuccess || false,
      loginResponseId: value.loginResponseId || '',
      errors: [],
    }
  }

  public register = async (email: string, password: string, passwordConfirmation: string, isPersistent: boolean, loginRequestId: string): Promise<RegisterResponse> => {
    const req = {
      apiApiPublicAccountRegisterRequest: {
        email: email,
        password: password,
        passwordConfirmation: passwordConfirmation,
        isPersistent: isPersistent,
        loginRequestId: loginRequestId,
      },
    }
    const res = await this._client.apiPublicAccountRegisterPostRaw(req, {})
    const value = await res.value()
    if (!res.raw.ok) throw Error()
    return {
      isSuccess: value.isSuccess || false,
      loginResponseId: value.loginResponseId || '',
      errors: [],
    }
  }

  public logout = async (): Promise<void> => {
    const res = await this._client.apiPublicAccountLogoutPostRaw()
    if (!res.raw.ok) throw Error()
  }
}
