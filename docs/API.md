# API Documentation

## Routes

### Auth

- **`POST /api/v1/auth/register`**

    request body:
    ```json
    {
        "username": "Hasan",
        "email": "hasan@mail.com",
        "password": "12345678"
    }
    ```

    response:
    ```json
    {
        "success": true,
        "message": "Registration successful",
        "statusCode": 201,
        "data": {
            "user": {
                "id": "acc950d1-32d4-4764-adaf-5a311f022acd",
                "username": "Hasan",
                "email": "hasan@mail.com",
                "createdAt": "2026-09-04T10:27:16.446Z",
                "updatedAt": "2026-09-04T10:27:16.446Z"
            }
        }
    }
    ```

- **`POST /api/v1/auth/login`**

    request body:
    ```json
    {
        "email": "hasan@mail.com",
        "password": "12345678"
    }
    ```

    response:
    ```json
    {
        "success": true,
        "message": "login successful",
        "statusCode": 200,
        "data": {
            "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFjYzk1MGQxLTMyZDQtNDc2NC1hZGFmLTVhMzExZjAyMmFjZCIsImVtYWlsIjoiaGFzYW5AbWFpbC5jb20iLCJpYXQiOjE3ODg1MTc3MzUsImV4cCI6MTc4ODYwNDEzNX0.fcNUMp2Nt20zhcZPJjrWETJYAuIWrDrIQhjJE_u-38s"
        }
    }
    ```

- **`POST /api/v1/auth/refresh-token`**

    request body:
    ```json
    {
        "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFjYzk1MGQxLTMyZDQtNDc2NC1hZGFmLTVhMzExZjAyMmFjZCIsImVtYWlsIjoiaGFzYW5AbWFpbC5jb20iLCJpYXQiOjE3ODg1MjAwNTcsImV4cCI6MTc4OTEyNDg1N30.UcYiIvX3TFSnpZtx0DYF96qoHp7vZnS8KWau6QHubfc"
    }
    ```

    response:
    ```json
    {
        "success": true,
        "message": "token refreshed sucessfully",
        "statusCode": 200,
        "data": {
            "newAccessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFjYzk1MGQxLTMyZDQtNDc2NC1hZGFmLTVhMzExZjAyMmFjZCIsImVtYWlsIjoiaGFzYW5AbWFpbC5jb20iLCJpYXQiOjE3ODg1MjA2NTMsImV4cCI6MTc4ODYwNzA1M30.YtufFLoW4E4vBxyr_K6db3YggNj47C41jOjgKIBGMbs"
        }
    }
    ```

### Organization

- **`POST /api/v1/organizations`**
    - auth: true

    request body:
    ```json
    {
        "name": "my org"
    }
    ```

    response:
    ```json
    {
        "success": true,
        "message": "Organization created successfully",
        "statusCode": 201,
        "data": {
            "organization": {
                "id": "d586b89c-3b04-4995-b185-06d5a007f1d0",
                "name": "my org",
                "createdAt": "2026-09-05T05:03:00.520Z",
                "updatedAt": "2026-09-05T05:03:00.520Z"
            }
        }
    }
    ```

- **`GET /api/v1/organizations`**
    - auth: true

    request body:
    ```json
    {
        
    }
    ```

    response:
    ```json
    {
        "success": true,
        "message": "get user's organizations successfully",
        "statusCode": 200,
        "data": {
            "organizations": [
                {
                    "id": "d586b89c-3b04-4995-b185-06d5a007f1d0",
                    "name": "my org",
                    "createdAt": "2026-09-05T05:03:00.520Z",
                    "updatedAt": "2026-09-05T05:03:00.520Z"
                }
            ]
        }
    }
    ```

- **`POST /api/v1/organizations/:organizationId/members`**
    - auth: true

    request body:
    ```json
    {
        "userId": "749f5298-4e7d-4529-92e7-e6e7ded335d3"
    }
    ```

    response:
    ```json
    {
        "success": true,
        "message": "Member added successfully",
        "statusCode": 201,
        "data": {
            "member": {
                "id": "a04da2dd-ea35-4bac-930c-1ac76072a55f",
                "organizationId": "d586b89c-3b04-4995-b185-06d5a007f1d0",
                "userId": "749f5298-4e7d-4529-92e7-e6e7ded335d3",
                "role": "MEMBER",
                "createdAt": "2026-09-05T05:06:33.345Z",
                "updatedAt": "2026-09-05T05:06:33.345Z"
            }
        }
    }
    ```