export type credentials = {
    email: string,
    password: string
}

export interface Tenant{
    id:number
    name:string
    address:string
}

export interface User {
    firstName: string
    id: number
    lastName: string
    email: string
    createdAt: number
    tenant?:Tenant
}