import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import LoginPage from "./login"

// "findBy".. async
// "getBy" throws error

describe("LoginPage", () => {
    it("should contain the following elements", () => {
        render(<LoginPage />)
        expect(screen.getByText('Sign in')).toBeInTheDocument()
        expect(screen.getByPlaceholderText('Username')).toBeInTheDocument()
        expect(screen.getByPlaceholderText('Password')).toBeInTheDocument()
        expect(screen.getByRole("button", { name: 'Log in' })).toBeInTheDocument()
        expect(screen.getByRole('checkbox', { name: "Remember me" })).toBeInTheDocument()
        expect(screen.getByText('Forgot password')).toBeInTheDocument()
    })
})