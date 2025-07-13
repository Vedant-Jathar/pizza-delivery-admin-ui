export type credentials = {
    email: string,
    password: string
}

export interface Tenant {
    id: number
    name: string
    address: string
}

export interface User {
    firstName: string
    id: number
    lastName: string
    email: string
    createdAt: number
    tenant?: Tenant | null
}

export interface CreateUserData {
    id: number
    firstName: string
    lastName: string
    password: string
    email: string
    tenantId: number
}

export interface Tenant {
    id: number
    name: string
    address: string
}

export interface changedFields {
    name: string[],
    value: string
}

export interface mappedFields {
    q?: string,
    role?: string
}

export type UserFormProps = {
    isEditing: boolean
}

export interface UpdateUserData {
    id?: number,
    firstName?: string,
    lastName?: string,
    email?: string,
    role?: string,
    tenantId?: number
}

export interface CreateTenantData {
    name: string,
    address: string
}

export interface PriceConfiguration {
    [key: string]: {
        priceType: "base" | "additional",
        availableOptions: string[]
    }
}

export interface Attribute {
    name: string
    widgetType: "switch" | "radio"
    defaultValue: string
    availableOptions: string[]
}

export interface Category {
    _id?: string,
    name: string
    priceConfiguration: PriceConfiguration,
    attributes: Attribute[]
}