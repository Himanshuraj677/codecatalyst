import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements, adminAc, userAc } from "better-auth/plugins/admin/access";

const statement = { 
    problem: ["create", "update", "delete"],
    teacher: ["create", "list", "set-role", "ban", "impersonate", "delete", "set-password", "get", "update"],
    assignment: ["create", "update", "delete"],
    ...defaultStatements

} as const; 

export const ac = createAccessControl(statement); 

const admin = ac.newRole({
    ...adminAc.statements,
    problem: ["create", "update", "delete"]
});

const moderator = ac.newRole({
    problem: ['create', 'delete'],
    user: ['ban', "delete", "update"],
    teacher: ['ban', "delete", "update"],
})

const teacher = ac.newRole({
    problem: ["create", "update", "delete"],
    assignment: ["create", "update", "delete"]
})

export const APP_ROLES = {
    admin,
    teacher,
    moderator
}