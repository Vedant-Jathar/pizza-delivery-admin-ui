import mongoose from "mongoose"

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

export interface PriceConfiguration{
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

export interface Attribute {
    name: string,
    value: string
}

export type priceConfiguration = {
    [key: string]: {
        priceType: string,
        availableOptions: Record<string, number>
    }
}

export interface Product {
    _id?: mongoose.Types.ObjectId,
    name: string,
    description: string,
    priceConfiguration: priceConfiguration,
    attributes: [Attribute],
    tenantId: string,
    categoryId: string,
    isPublished: boolean,
    image?: string
    _doc?: Record<string, string>
    category: Category
}

export interface QueryParams {
    page?: number,
    limit?: number,
    categoryId?: string,
    tenantId?: string,
    q?: string,
    isPublished?: boolean
}

export const AttributeSchema = new mongoose.Schema<Attribute>({
    name: {
        type: String,
        required: true
    },
    widgetType: {
        type: String,
        required: true,
        enum: ["switch", "radio"],
    },
    availableOptions: {
        type: [String],
        required: true
    },
    defaultValue: {
        type: String,
        required: true
    },
})

export const PriceConfigurationSchema = new mongoose.Schema<PriceConfiguration>({
    priceType: {
        type: String,
        required: true,
        enum: ["base", "additional"]
    },
    availableOptions: {
        type: [String],
        required: true
    }
})

export type ImageType = {
    file: File
}

export interface CreateProductData {
    _id: string,
    name: string,
    description: string,
    image: ImageType,
    categoryId: string,
    tenantId: number,
    priceConfiguration: typeof PriceConfigurationSchema,
    attributes: typeof AttributeSchema,
}