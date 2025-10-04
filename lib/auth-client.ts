import { createAuthClient } from "better-auth/react"
import { adminClient } from "better-auth/client/plugins"
import { APP_ROLES, ac } from "./permissions"

export const authClient = createAuthClient({
    baseURL: process.env.BETTER_AUTH_URL,
    plugins: [
        adminClient({
            ac,
            roles: APP_ROLES
        })
    ]
})