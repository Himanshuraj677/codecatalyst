import { NextRequest } from "next/server";
import { auth } from "./auth";

interface CheckAccessOption {
  permissions?: Record<string, string[]>;
  req: NextRequest;
}

export default async function checkRoleBasedAccess({
  permissions,
  req,
}: CheckAccessOption) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session || !session.user) {
    return { hasAccess: false, user: null, message: "You are not logged in" };
  }

  if (permissions) {
    const hasPermission = await auth.api.userHasPermission({
      body: {
        userId: session.user.id,
        permissions,
      },
    });
    if (!hasPermission) {
      return { hasAccess: false, user: session.user, message: "You have not enough permission" };
    }
  }

  return { hasAccess: true, user: session.user, message: "You have enough permission" };
}
