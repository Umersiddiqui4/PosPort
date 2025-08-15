import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to login page before each test
    await page.goto('/login');
  });

  test('should display login form', async ({ page }) => {
    // Check if login form elements are present
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();
  });

  test('should show validation errors for invalid input', async ({ page }) => {
    // Try to submit empty form
    await page.getByRole('button', { name: 'Sign In' }).click();

    // Check for validation errors
    await expect(page.getByText('Email is required')).toBeVisible();
    await expect(page.getByText('Password is required')).toBeVisible();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    // Fill in invalid credentials
    await page.getByLabel('Email').fill('invalid@example.com');
    await page.getByLabel('Password').fill('wrongpassword');

    // Submit form
    await page.getByRole('button', { name: 'Sign In' }).click();

    // Check for error message
    await expect(page.getByText(/Invalid credentials/i)).toBeVisible();
  });

  test('should navigate to signup page', async ({ page }) => {
    // Click on signup link
    await page.getByRole('link', { name: /sign up/i }).click();

    // Check if we're on signup page
    await expect(page).toHaveURL(/.*signup/);
    await expect(page.getByRole('heading', { name: /create account/i })).toBeVisible();
  });

  test('should have Google OAuth button', async ({ page }) => {
    // Check if Google OAuth button is present
    await expect(page.getByRole('button', { name: /continue with google/i })).toBeVisible();
  });

  test('should redirect to dashboard after successful login', async ({ page }) => {
    // Mock successful login response
    await page.route('**/api/v1/auth/login', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: {
            user: {
              id: '1',
              email: 'test@example.com',
              firstName: 'Test',
              lastName: 'User',
              role: 'COMPANY_OWNER',
              isEmailVerified: true,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            tokens: {
              access: {
                token: 'mock-access-token',
                expiresIn: '1h',
              },
              refresh: {
                token: 'mock-refresh-token',
                expiresIn: '7d',
              },
            },
          },
          message: 'Login successful',
          status: 200,
        }),
      });
    });

    // Fill in valid credentials
    await page.getByLabel('Email').fill('test@example.com');
    await page.getByLabel('Password').fill('password123');

    // Submit form
    await page.getByRole('button', { name: 'Sign In' }).click();

    // Check if redirected to dashboard
    await expect(page).toHaveURL('/');
    await expect(page.getByText(/dashboard/i)).toBeVisible();
  });
});

test.describe('Protected Routes', () => {
  test('should redirect to login when accessing protected route without auth', async ({ page }) => {
    // Try to access dashboard without authentication
    await page.goto('/');

    // Should be redirected to login
    await expect(page).toHaveURL(/.*login/);
  });

  test('should allow access to public routes without auth', async ({ page }) => {
    // Access public routes
    await page.goto('/helloScreen');
    await expect(page.getByText(/welcome/i)).toBeVisible();

    await page.goto('/signup');
    await expect(page.getByRole('heading', { name: /create account/i })).toBeVisible();
  });
});

test.describe('Logout', () => {
  test('should logout successfully', async ({ page }) => {
    // Mock authenticated state
    await page.addInitScript(() => {
      localStorage.setItem('token', 'mock-token');
      localStorage.setItem('user-data-storage', JSON.stringify({
        state: {
          isLoggedIn: true,
          user: {
            id: '1',
            email: 'test@example.com',
            firstName: 'Test',
            lastName: 'User',
            role: 'COMPANY_OWNER',
          },
          tokens: {
            access: { token: 'mock-token', expiresIn: '1h' },
            refresh: { token: 'mock-refresh-token', expiresIn: '7d' },
          },
        },
      }));
    });

    // Navigate to dashboard
    await page.goto('/');

    // Mock logout API call
    await page.route('**/api/v1/auth/logout', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          message: 'Logout successful',
          status: 200,
        }),
      });
    });

    // Find and click logout button (adjust selector based on your UI)
    await page.getByRole('button', { name: /logout/i }).click();

    // Should be redirected to login
    await expect(page).toHaveURL(/.*login/);
  });
});
