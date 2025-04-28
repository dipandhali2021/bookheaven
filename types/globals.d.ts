export {}

export type Roles = 'admin' | 'moderator'

declare global {
  interface CustomJwtSessionClaims {
    publicMetadata: {
      role?: Roles
    }
  }
}
