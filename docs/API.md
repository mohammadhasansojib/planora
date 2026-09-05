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

### Team

- **`POST /api/v1/teams`**
    - auth: true

    request body:
    ```json
    {
        "name": "My Second Team",
        "organizationId": "d586b89c-3b04-4995-b185-06d5a007f1d0"
    }
    ```

    response:
    ```json
    {
        "success": true,
        "message": "Team created successfully",
        "statusCode": 201,
        "data": {
            "team": {
                "id": "e21ab1b8-e440-4b0d-8b36-38da9ec4621f",
                "name": "My Second Team",
                "organizationId": "d586b89c-3b04-4995-b185-06d5a007f1d0",
                "createdAt": "2026-09-05T09:32:02.137Z",
                "updatedAt": "2026-09-05T09:32:02.137Z"
            }
        }
    }
    ```


- **`POST /api/v1/teams/:teamId/members`**
    - auth: true

    request body:
    ```json
    {
        "userId": "749f5298-4e7d-4529-92e7-e6e7ded335d3",
        "role": "MEMBER"
    }
    ```

    response:
    ```json
    {
        "success": true,
        "message": "Member added to team successfully",
        "statusCode": 201,
        "data": {
            "member": {
                "id": "8b2581c2-95e6-4b54-8ce9-cdf523a22552",
                "teamId": "1ae39862-c31f-4356-b010-f1bf76c9e08e",
                "userId": "749f5298-4e7d-4529-92e7-e6e7ded335d3",
                "role": "MEMBER",
                "createdAt": "2026-09-05T09:59:40.064Z",
                "updatedAt": "2026-09-05T09:59:40.064Z"
            }
        }
    }
    ```


### Project

- **`POST /api/v1/projects`**
    - auth: true

    request body:
    ```json
    {
        "name": "My Second Project",
        "teamId": "1ae39862-c31f-4356-b010-f1bf76c9e08e"
    }
    ```

    response:
    ```json
    {
        "success": true,
        "message": "Project created successfully",
        "statusCode": 201,
        "data": {
            "project": {
                "id": "3f637321-b016-40e6-a14c-a9b5dd8e1339",
                "name": "My Second Project",
                "teamId": "1ae39862-c31f-4356-b010-f1bf76c9e08e",
                "createdAt": "2026-09-05T10:27:04.447Z",
                "updatedAt": "2026-09-05T10:27:04.447Z"
            }
        }
    }
    ```


- **`POST /api/v1/projects/:projectId/members`**
    - auth: true

    request body:
    ```json
    {
        "userId": "749f5298-4e7d-4529-92e7-e6e7ded335d3",
        "role": "MEMBER"
    }
    ```

    response:
    ```json
    {
        "success": true,
        "message": "Member added to project successfully",
        "statusCode": 201,
        "data": {
            "member": {
                "id": "b57a06d1-d7e3-4be9-804e-43161886045b",
                "projectId": "3f637321-b016-40e6-a14c-a9b5dd8e1339",
                "userId": "749f5298-4e7d-4529-92e7-e6e7ded335d3",
                "role": "MEMBER",
                "createdAt": "2026-09-05T10:31:52.840Z",
                "updatedAt": "2026-09-05T10:31:52.840Z"
            }
        }
    }
    ```


### Sprint

- **`POST /api/v1/sprints`**
    - auth: true

    request body:
    ```json
    {
        "name": "My first sprint",
        "projectId": "3f637321-b016-40e6-a14c-a9b5dd8e1339",
        "startTime": "2026-09-05T11:46:07.779Z",
        "endTime": "2026-09-08T11:46:07.779Z"
    }
    ```

    response:
    ```json
    {
        "success": true,
        "message": "Sprint created successfully",
        "statusCode": 201,
        "data": {
            "sprint": {
                "id": "c98aaf86-2f77-4cf5-ac49-236b27d95ac0",
                "name": "My first sprint",
                "projectId": "3f637321-b016-40e6-a14c-a9b5dd8e1339",
                "startTime": "2026-09-05T11:46:07.779Z",
                "endTime": "2026-09-08T11:46:07.779Z",
                "createdAt": "2026-09-05T12:05:23.873Z",
                "updatedAt": "2026-09-05T12:05:23.873Z"
            }
        }
    }
    ```

### Task

- **`POST /api/v1/tasks`**
    - auth: true

    request body:
    ```json
    {
        "title": "My First Task",
        "description": "This is very important",
        "projectId": "8c6af6af-8dba-472e-853f-81365c014f67"
    }
    ```

    response:
    ```json
    {
        "success": true,
        "message": "Task created successfully",
        "statusCode": 201,
        "data": {
            "task": {
                "id": "bd4471de-4b70-4ed7-9ae8-371676c9620b",
                "projectId": "8c6af6af-8dba-472e-853f-81365c014f67",
                "sprintId": null,
                "title": "My First Task",
                "description": "This is very important",
                "createdAt": "2026-09-05T13:56:13.569Z",
                "updatedAt": "2026-09-05T13:56:13.569Z"
            }
        }
    }
    ```


- **`POST /api/v1/tasks/:taskId/assign`**
    - auth: true

    request body:
    ```json
    {
        "sprintId": "c98aaf86-2f77-4cf5-ac49-236b27d95ac0"
    }
    ```

    response:
    ```json
    {
        "success": true,
        "message": "Task assigned successfully",
        "statusCode": 201,
        "data": {
            "task": {
                "id": "bd4471de-4b70-4ed7-9ae8-371676c9620b",
                "projectId": "8c6af6af-8dba-472e-853f-81365c014f67",
                "sprintId": "c98aaf86-2f77-4cf5-ac49-236b27d95ac0",
                "title": "My First Task",
                "description": "This is very important",
                "createdAt": "2026-09-05T13:56:13.569Z",
                "updatedAt": "2026-09-05T14:05:17.739Z"
            }
        }
    }
    ```

- **`POST /api/v1/tasks/:taskId/subtasks`**
    - auth: true

    request body:
    ```json
    {
        "title": "First Subtask",
        "description": "This the description of the subtask"
    }
    ```

    response:
    ```json
    {
        "success": true,
        "message": "Subtask created successfully",
        "statusCode": 201,
        "data": {
            "subtask": {
                "id": "44bdef07-f736-4e67-acc0-f28844f7e81a",
                "title": "First Subtask",
                "description": "This the description of the subtask",
                "taskId": "bd4471de-4b70-4ed7-9ae8-371676c9620b",
                "createdAt": "2026-09-05T15:10:38.493Z",
                "updatedAt": "2026-09-05T15:10:38.493Z"
            }
        }
    }
    ```


### Comment

- **`POST /api/v1/comments`**
    - auth: true

    request body:
    ```json
    {
        "content": "This is comment content",
        "taskId": "bd4471de-4b70-4ed7-9ae8-371676c9620b"
    }
    ```

    response:
    ```json
    {
        "success": true,
        "message": "Comment created successfully",
        "statusCode": 201,
        "data": {
            "comment": {
                "id": "78e930dc-f6e9-4c4e-b73d-dfa321fe3fac",
                "content": "This is comment content",
                "userId": "acc950d1-32d4-4764-adaf-5a311f022acd",
                "taskId": "bd4471de-4b70-4ed7-9ae8-371676c9620b",
                "createdAt": "2026-09-05T16:19:18.431Z",
                "updatedAt": "2026-09-05T16:19:18.431Z"
            }
        }
    }
    ```
