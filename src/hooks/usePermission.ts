import type { User } from "../store"

export const usePermission = () => {
    const allowedHeader = ['admin', 'manager']

    const _hasPermission = (user: User) => {
        return allowedHeader.includes(user.role)
    }

    return {
        isAllowed: _hasPermission
    }
}