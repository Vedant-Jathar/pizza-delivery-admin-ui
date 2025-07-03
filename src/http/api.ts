import type { CreateUserData, credentials } from "../types";
import api from "./client";

export const login = (credentials: credentials) => api.post('/auth/login', credentials)
export const self = async () => await api.get('/auth/self')
export const logout = () => api.post('/auth/logout')
export const getAllUsers = (queryString: string) => api.get(`/users?${queryString}`)

export const getAllTenants = () => api.get('/tenants')

export const createUser = (createUserData: CreateUserData) => api.post('/users', createUserData)