import type { CreateTenantData, CreateUserData, credentials, UpdateUserData } from "../types";
import api from "./client";

export const login = (credentials: credentials) => api.post('/auth/login', credentials)
export const self = async () => await api.get('/auth/self')
export const logout = () => api.post('/auth/logout')
export const getAllUsers = (queryString: string) => api.get(`/users?${queryString}`)

export const getAllTenants = (queryString: string) => api.get(`/tenants?${queryString}`)
export const getAllTenantsWithoutPagination = () => api.get(`/tenants/all`)

export const createUser = (createUserData: CreateUserData) => api.post('/users', createUserData)
export const updateUser = (updateUserData: UpdateUserData) => api.patch(`/users/${updateUserData.id}`, updateUserData)

export const createTenant = (data: CreateTenantData) => api.post('/tenants', data)
export const updateTenant = (data: CreateTenantData, id: number) => api.patch(`/tenants/${id}`, data)