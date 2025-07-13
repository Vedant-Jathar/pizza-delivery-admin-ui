import type { CreateTenantData, CreateUserData, credentials, QueryParams, UpdateUserData } from "../types";
import api from "./client";

export const AUTH_SERVICE = "/api/auth"
export const CATALOG_SERVICE = "/api/catalog"

// Auth service:

export const login = (credentials: credentials) => api.post(`${AUTH_SERVICE}/auth/login`, credentials)
export const self = async () => await api.get(`${AUTH_SERVICE}/auth/self`)
export const logout = () => api.post(`${AUTH_SERVICE}/auth/logout`)
export const getAllUsers = (queryString: string) => api.get(`${AUTH_SERVICE}/users?${queryString}`)

export const getAllTenants = (queryString: string) => api.get(`${AUTH_SERVICE}/tenants?${queryString}`)
export const getAllTenantsWithoutPagination = () => api.get(`${AUTH_SERVICE}/tenants/all`)

export const createUser = (createUserData: CreateUserData) => api.post(`${AUTH_SERVICE}/users`, createUserData)
export const updateUser = (updateUserData: UpdateUserData) => api.patch(`${AUTH_SERVICE}/users/${updateUserData.id}`, updateUserData)

export const createTenant = (data: CreateTenantData) => api.post(`${AUTH_SERVICE}/tenants`, data)
export const updateTenant = (data: CreateTenantData, id: number) => api.patch(`${AUTH_SERVICE}/tenants/${id}`, data)

// Catalog Service:

export const getCategories = async () => await api.get(`${CATALOG_SERVICE}/category`)
export const getProductsList = async (queryString: string) => await api.get(`${CATALOG_SERVICE}/products?${queryString}`)