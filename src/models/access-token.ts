import { User } from "./user"

export interface AccessTokenResponse {
  token: string
  user: User
}

export interface AccessTokenRequest {
  email: string
  password: string
}
  