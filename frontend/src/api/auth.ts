const API_BASE_URL = "http://localhost:3000/api";

export interface LoginRequest {
  identifier: string; // email or phone number
  password: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: UserResponse;
}

export interface UserResponse {
  id: string;
  firstname: string;
  lastname: string;
  fullName: string;
  address: {
    street: string;
    building?: string;
    apartment?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  fullAddress: string;
  phoneNumber: string;
  email?: string;
  healthConditions: string[];
  allergies: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserRequest {
  firstname: string;
  lastname: string;
  password: string;
  address: {
    street: string;
    building?: string;
    apartment?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  phoneNumber: string;
  email?: string;
  healthConditions?: string[];
  allergies?: string[];
}

class AuthAPI {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Login failed");
    }

    return response.json();
  }

  async register(userData: CreateUserRequest): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Registration failed");
    }

    return response.json();
  }

  async getProfile(): Promise<UserResponse> {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      method: "GET",
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to get profile");
    }

    const data = await response.json();
    return data.user;
  }

  async updateProfile(
    userData: Partial<CreateUserRequest>
  ): Promise<UserResponse> {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      method: "PUT",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to update profile");
    }

    const data = await response.json();
    return data.user;
  }

  logout(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem("token");
  }

  getToken(): string | null {
    return localStorage.getItem("token");
  }

  getUser(): UserResponse | null {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  }
}

export const authAPI = new AuthAPI();
