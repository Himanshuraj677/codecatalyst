import { createAuthClient } from "better-auth/react"
import { adminClient } from "better-auth/client/plugins"
import { APP_ROLES, ac } from "./permissions"

export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_AUTH_URL as string,
    plugins: [
        adminClient({
            ac,
            roles: APP_ROLES
        })
    ]
})