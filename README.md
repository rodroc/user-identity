# User Identity Profile Viewer

A simple application that allows viewing and updating user identity profiles.

## Backend (.NET Core)

### Prerequisites
- .NET 7.0 SDK or later
- Visual Studio 2022 or Visual Studio Code

### Setup
1. Navigate to the backend directory:
   ```powershell
   cd UserIdentityApi
   ```

2. Restore dependencies:
   ```powershell
   dotnet restore
   ```

3. Run the application in development mode:
   ```powershell
   dotnet run --launch-profile http
   ```

The API will be available at `http://localhost:5250`. You can access the Swagger documentation at `http://localhost:5250/swagger`.

### Stopping the Backend
To stop the backend service, you can either:
1. Press `Ctrl+C` in the terminal where it's running
2. Or use the following command in PowerShell:
   ```powershell
   taskkill /F /IM UserIdentityApi.exe
   ```

## Frontend (Angular)

### Prerequisites
- Node.js 18.19 or later
- npm 9.0 or later

### Setup
1. Navigate to the frontend directory:
   ```powershell
   cd user-identity-ui
   ```

2. Install dependencies:
   ```powershell
   npm install
   ```

3. Install Tailwind CSS:
   ```powershell
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init
   ```

4. Configure environment variables:
   - The application uses environment-specific configurations
   - Development environment is configured in `src/environments/environment.ts`
   - Production environment is configured in `src/environments/environment.prod.ts`
   - Update the `apiUrl` in these files according to your environment

5. Run the development server:
   ```powershell
   ng serve
   ```

The application will be available at `http://localhost:4200`.

### Environment Configuration
The application uses Angular's environment system for configuration:

1. Development Environment (`src/environments/environment.ts`):
   ```typescript
   export const environment = {
     production: false,
     apiUrl: 'http://localhost:5250'
   };
   ```

2. Production Environment (`src/environments/environment.prod.ts`):
   ```typescript
   export const environment = {
     production: true,
     apiUrl: 'http://localhost:5250' // Change this to your production API URL
   };
   ```

To build for production:
```powershell
ng build --configuration production
```

### Stopping the Frontend
To stop the frontend service, you can either:
1. Press `Ctrl+C` in the terminal where it's running
2. Or use the following command in PowerShell:
   ```powershell
   taskkill /F /IM node.exe
   ```

### PowerShell Execution Policy
If you're using PowerShell and encounter a security error when running `ng serve`, you may need to adjust the execution policy. Run PowerShell as Administrator and execute:
```powershell
Set-ExecutionPolicy RemoteSigned
```

## API Endpoints

### GET /api/identities/{id}
Retrieves a user identity profile by ID.

### PATCH /api/identities/{id}
Updates specific fields of a user identity profile.

Request body:
```json
{
  "email": "string",
  "fullName": "string",
  "sourceSystem": "string",
  "isActive": boolean
}
```

## Development

### Backend
The backend uses Entity Framework Core with an in-memory database for simplicity. The database is seeded with a sample user identity with ID 1. The database is automatically initialized when the application starts.

### Frontend
The frontend is built with Angular and uses Tailwind CSS for styling. The application includes:
- User identity profile display
- Form for updating profile fields
- Success/error message handling
- Responsive design
- Environment-based configuration

### Running Both Applications
1. Start the backend first:
   ```powershell
   cd UserIdentityApi; dotnet run --launch-profile http
   ```

2. In a new terminal, start the frontend:
   ```powershell
   cd user-identity-ui; ng serve
   ```

3. Access the application at `http://localhost:4200`

### Stopping Both Applications
To stop both applications at once, you can use:
```powershell
taskkill /F /IM UserIdentityApi.exe; taskkill /F /IM node.exe
```

### Troubleshooting
- If you see "Failed to load user identity" error, ensure:
  1. The backend is running on port 5250
  2. You can access the Swagger UI at http://localhost:5250/swagger
  3. The database has been properly initialized (check backend console for "Saved 1 entities to in-memory store" message)
  4. The API URL in the environment configuration matches your backend URL
- If you see PowerShell execution policy errors, follow the PowerShell Execution Policy setup steps above
- If you see "The token '&&' is not a valid statement separator" error, use semicolons (;) instead of && in PowerShell commands
- If you see "File cannot be loaded because it is not digitally signed" error, follow the PowerShell Execution Policy setup steps above 