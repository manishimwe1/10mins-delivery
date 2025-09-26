// Authentication utility functions

export interface User {
  email: string
  userType: "customer" | "rider" | "admin"
  name: string
}

export const authUtils = {
  // Get current user from localStorage
  getCurrentUser: (): User | null => {
    if (typeof window === "undefined") return null

    try {
      const userData = localStorage.getItem("user")
      return userData ? JSON.parse(userData) : null
    } catch {
      return null
    }
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return authUtils.getCurrentUser() !== null
  },

  // Check if user has specific role
  hasRole: (role: "customer" | "rider" | "admin"): boolean => {
    const user = authUtils.getCurrentUser()
    return user?.userType === role
  },

  // Logout user
  logout: (): void => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("user")
      window.location.href = "/"
    }
  },

  // Login user (mock implementation)
  login: async (email: string, password: string, userType: string): Promise<User> => {
    // Mock authentication logic
    const mockUsers = {
      "customer@example.com": { email: "customer@example.com", userType: "customer" as const, name: "Customer User" },
      "rider@example.com": { email: "rider@example.com", userType: "rider" as const, name: "John Rider" },
      "admin@example.com": { email: "admin@example.com", userType: "admin" as const, name: "Admin User" },
    }

    const user = mockUsers[email as keyof typeof mockUsers]

    if (!user || password !== "password" || user.userType !== userType) {
      throw new Error("Invalid credentials")
    }

    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(user))
    }

    return user
  },

  // Register user (mock implementation)
  register: async (userData: {
    fullName: string
    email: string
    phone: string
    password: string
    userType: string
  }): Promise<User> => {
    // Mock registration logic
    const user: User = {
      email: userData.email,
      userType: userData.userType as "customer" | "rider" | "admin",
      name: userData.fullName,
    }

    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(user))
    }

    return user
  },
}
