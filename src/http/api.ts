import type { credentials } from "../types";
import api from "./client";

export const login = (credentials: credentials) => api.post('/auth/login', credentials)
export const self = () => api.get('/auth/self')
