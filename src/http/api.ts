import type { credentials } from "../types";
import api from "./client";

export const login = (credentials: credentials) => api.post('/auth/login', credentials)
export const self = async () => await api.get('/auth/self')
export const logout = () => api.post('/auth/logout')
export const getAllUsers = () => api.get('/users')

export const getAllTenants = () => api.get('/tenants')