"use client"

import { authClient } from "@/lib/auth-client";
import {
  createContext,
  ReactNode,
  useEffect,
  useState,
} from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string | null | undefined;
}

export interface UserContextType {
  user: User | null;
  setuser: (user: User) => void;
  isLoading: boolean;
}
export const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setuser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      const { data } = await authClient.getSession();
      if (data) {
        setuser({
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          role: data.user.role,
        });
      }
      setIsLoading(false);
    };
    fetchUser();
  }, []);
  return <UserContext.Provider value={{user, setuser, isLoading}}>{children}</UserContext.Provider>

}
