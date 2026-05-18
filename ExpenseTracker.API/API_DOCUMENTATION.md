# Expense Tracker API Documentation

This document explains the architecture and available endpoints of the .NET Expense Tracker API, including how authentication and file uploads are handled.

## Security & Authentication

The API uses **Google Identity Services (OAuth 2.0)** and **JSON Web Tokens (JWT)** for security. 
All endpoints (except `/api/auth/google`) require an `Authorization` header containing a valid Bearer token.

```http
Authorization: Bearer <your_jwt_token>
```

When an authenticated request hits the API, the `[Authorize]` middleware automatically decrypts the JWT to verify the signature and extracts the database `UserId` (Guid) from the `NameIdentifier` claim. All database queries are strictly scoped to the authenticated user using this Guid.

---

## Endpoints

### 1. Authentication

#### `POST /api/auth/google`
Authenticates a user via a Google ID token.

- **Content-Type**: `application/json`
- **Body**: 
  ```json
  { "idToken": "eyJhbGciOiJSUzI1..." }
  ```
- **Process**:
  1. Validates the Google token using Google's public keys.
  2. Finds the user by `GoogleId` or creates a new database record.
  3. Updates the user's `LastLoginAt` and syncs their profile picture/name.
  4. Generates a 7-day JWT containing their database `UserId`.
- **Returns**: 200 OK with the generated JWT and user profile data.

---

### 2. Expenses

All expense endpoints are protected by `[Authorize]` and automatically extract the `UserId` from the token.

#### `GET /api/expenses`
Retrieves all expenses belonging to the authenticated user.
- **Returns**: 200 OK with a JSON array of `ExpenseResponse` objects.

#### `GET /api/expenses/{id}`
Retrieves a specific expense.
- **Returns**: 200 OK if found, 404 Not Found if it doesn't exist or doesn't belong to the user.

#### `POST /api/expenses`
Creates a new expense. Integrates directly with Cloudflare R2 for receipt storage.

- **Content-Type**: `multipart/form-data`
- **Fields**:
  - `Amount` (decimal, required)
  - `Description` (string, optional)
  - `ExpenseDate` (datetime, optional)
  - `ReceiptPhoto` (file, optional): The physical image binary.
- **Process**:
  1. If a `ReceiptPhoto` is provided, it is uploaded directly to Cloudflare R2 using the `AWSSDK.S3` client.
  2. R2 returns a public URL for the image.
  3. The expense data and the new R2 URL are saved to the PostgreSQL database.
- **Returns**: 201 Created with the created `ExpenseResponse`.

#### `PUT /api/expenses/{id}`
Updates an existing expense and handles photo replacement.

- **Content-Type**: `multipart/form-data`
- **Fields**: Same as POST.
- **Process**:
  1. If a new `ReceiptPhoto` is provided, it uploads the new image to Cloudflare R2.
  2. If the user had an old photo, it actively deletes the old photo from R2 to prevent storage bloat.
  3. Saves the updated fields to the database.
- **Returns**: 204 No Content if successful, 404 Not Found if unauthorized.

#### `DELETE /api/expenses/{id}`
Deletes an expense and cleans up cloud resources.

- **Process**:
  1. Finds the expense in the database.
  2. If the expense has a `PhotoUrl`, it extracts the filename and sends a Delete request to Cloudflare R2.
  3. Deletes the database record.
- **Returns**: 204 No Content.

---

## Infrastructure

### Cloudflare R2 Storage Service
The `R2StorageService` acts as the orchestrator for image uploads. It prevents local disk caching by streaming the `IFormFile` memory directly into the R2 bucket.
- Files are renamed using a unique `Guid` to guarantee no accidental overwrites (e.g., `e8a3d-491f-11ab.png`).
- Configuration variables (`AccessKey`, `SecretKey`, `BucketName`, `PublicDomain`) are safely isolated in `appsettings.json` and injected into the service via Dependency Injection.
