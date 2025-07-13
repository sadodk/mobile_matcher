# Profile Matcher API Integration

This document explains how to use the Profile Matcher API in your React Native application.

## Overview

The Profile Matcher API provides CRUD operations for user profiles with the following features:
- Create, read, update, delete user profiles
- User skills management
- JWT authentication
- Health monitoring

## API Base URL

```
https://c0su3lk7ae.execute-api.eu-central-1.amazonaws.com/dev
```

## Files Created

### 1. `app/api/api_profile_matcher.ts`
Main API client with all CRUD operations. Similar structure to your existing `api_imdb.ts`.

### 2. `app/utils/auth.ts`
Authentication utilities for JWT token management using AsyncStorage.

### 3. `interfaces/interfaces.d.ts` (updated)
Added new TypeScript interfaces for profiles and API responses.

### 4. `components/ProfileMatcherExample.tsx`
Example component showing how to use all API functions.

## Usage Examples

### 1. Basic Setup

```typescript
import { 
    fetchProfiles, 
    createProfile, 
    updateProfile, 
    deleteProfile, 
    checkHealth 
} from '@/app/api/api_profile_matcher';
```

### 2. Check API Health

```typescript
const healthStatus = await checkHealth();
console.log(healthStatus.status); // "healthy"
```

### 3. Fetch All Profiles

```typescript
const profiles = await fetchProfiles();
console.log(profiles); // Array of Profile objects
```

### 4. Create a New Profile

```typescript
const newProfile = {
    user_id: "user123",
    name: "John Doe",
    email: "john@example.com",
    bio: "Software developer",
    skills: [
        { name: "React Native", level: 8 },
        { name: "TypeScript", level: 7 }
    ]
};

const result = await createProfile(newProfile);
console.log(result.success); // true
```

### 5. Update a Profile

```typescript
const updatedData = {
    user_id: "user123",
    name: "John Smith", // Updated name
    email: "john@example.com",
    bio: "Senior Software Developer", // Updated bio
    skills: [
        { name: "React Native", level: 9 }, // Updated level
        { name: "TypeScript", level: 8 },
        { name: "AWS", level: 6 } // New skill
    ]
};

const result = await updateProfile("user123", updatedData);
```

### 6. Delete a Profile

```typescript
const result = await deleteProfile("user123");
console.log(result.message); // "Profile deleted successfully"
```

## Authentication

The API requires JWT authentication. You have two options:

### Option 1: Use Stored Token (Recommended)
The API functions will automatically use stored tokens from AsyncStorage:

```typescript
// Store token after login
import { storeAuthToken } from '@/app/utils/auth';
await storeAuthToken(jwtToken, 3600); // Token and expiry in seconds

// API calls will automatically use stored token
const profiles = await fetchProfiles();
```

### Option 2: Pass Token Directly
Pass the token as a parameter to any API function:

```typescript
const profiles = await fetchProfiles(yourJwtToken);
```

## Error Handling

All API functions throw errors that you should catch:

```typescript
try {
    const profiles = await fetchProfiles();
    // Handle success
} catch (error) {
    console.error('API Error:', error.message);
    // Handle error (show user message, etc.)
}
```

## Common Error Messages

- `"Authentication token is missing. Please login first."` - No valid token found
- `"Failed to fetch profiles: Unauthorized"` - Token expired or invalid
- `"Health check failed: ..."` - API is down or unreachable

## Data Structures

### Profile Interface

```typescript
interface Profile {
    user_id: string;
    name: string;
    email: string;
    bio?: string;
    skills: Skill[];
    created_at?: string;
    updated_at?: string;
}
```

### Skill Interface

```typescript
interface Skill {
    name: string;
    level: number; // 1-10 scale
}
```

## Dependencies

Make sure you have installed:

```bash
npm install @react-native-async-storage/async-storage
```

## Testing the Integration

Use the `ProfileMatcherExample` component to test all API functions:

```typescript
import ProfileMatcherExample from '@/components/ProfileMatcherExample';

// Use in your app
<ProfileMatcherExample />
```

## Notes

1. **Authentication**: You'll need to implement your specific authentication flow (AWS Cognito, etc.) in the `authenticateUser` function in `auth.ts`.

2. **Token Refresh**: The current implementation checks token expiry but you may want to add automatic refresh logic.

3. **Error Handling**: Consider implementing retry logic for network failures.

4. **Environment Variables**: For production, consider using environment variables for the API base URL.

5. **Security**: Ensure tokens are stored securely and cleared on logout.

## Next Steps

1. Implement your authentication flow in `app/utils/auth.ts`
2. Add the authentication screens to collect user credentials
3. Integrate the Profile Matcher API calls into your existing app flow
4. Add proper error handling and loading states
5. Consider implementing offline support with local storage
