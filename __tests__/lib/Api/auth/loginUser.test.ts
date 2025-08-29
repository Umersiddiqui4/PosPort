import { loginUser } from '@/lib/Api/auth/loginUser'
import api from '@/utils/axios'

// Mock axios
jest.mock('@/utils/axios')
const mockApi = api as jest.Mocked<typeof api>

describe('loginUser', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should call login API successfully', async () => {
    const mockResponse = {
      data: {
        user: {
          id: '1',
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
          role: 'COMPANY_OWNER',
          isEmailVerified: true,
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01'
        },
        tokens: {
          access: {
            token: 'access-token',
            expires: '15m'
          },
          refresh: {
            token: 'refresh-token',
            expires: '7d'
          }
        }
      },
      message: 'Login successful',
      status: 200
    }

    mockApi.post.mockResolvedValue({ data: mockResponse })

    const loginData = {
      email: 'test@example.com',
      password: 'password123'
    }

    const result = await loginUser(loginData)

    expect(mockApi.post).toHaveBeenCalledWith(
      '/auth/email/login',
      JSON.stringify(loginData),
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
    expect(result).toEqual(mockResponse)
  })

  it('should handle API errors', async () => {
    const mockError = new Error('Invalid credentials')
    mockApi.post.mockRejectedValue(mockError)

    const loginData = {
      email: 'test@example.com',
      password: 'wrongpassword'
    }

    await expect(loginUser(loginData)).rejects.toThrow('Invalid credentials')
  })
})

