import { create } from "zustand"
import { devtools } from "zustand/middleware"

export interface Tenant {
    id?: number,
    name: string
    address: string
}

export interface User {
    id: number
    firstName: string
    lastName: string
    email: string
    role: string
    tenant?: Tenant
}

export interface Auth {
    user: User | null,
    setUser: (user: User) => void
    logout: () => void
}

export const useAuthStore = create<Auth>()(devtools((set) => ({
    user: null,
    setUser: (user: User) => set({ user }),
    logout: () => set({ user: null })
})))






