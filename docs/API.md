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

- **`POST /api/v1/auth/google`**

    request body:
    ```json
    {
        "idToken": "id_token_from_google_here"
    }
    ```

    response:
    ```json
    {
        "statusCode": 200,
        "success": true,
        "message": "New tokens generated successfully",
        "data": {
            "accessToken": "access_token_here",
            "refreshToken": "refresh_token_here"
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

- **`GET /api/v1/organizations/:organizationId/members`**
    - auth: true
    - Only a member of the requested organization may view its members.

    response:
    ```json
    {
        "success": true,
        "message": "Organization members retrieved successfully",
        "statusCode": 200,
        "data": {
            "members": [
                {
                    "id": "a04da2dd-ea35-4bac-930c-1ac76072a55f",
                    "organizationId": "d586b89c-3b04-4995-b185-06d5a007f1d0",
                    "userId": "749f5298-4e7d-4529-92e7-e6e7ded335d3",
                    "role": "MEMBER",
                    "createdAt": "2026-09-05T05:06:33.345Z",
                    "updatedAt": "2026-09-05T05:06:33.345Z",
                    "user": {
                        "username": "Hasan",
                        "email": "member@example.com"
                    }
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
        "email": "member@example.com"
    }
    ```
    Provide exactly one of `email` or `userId`. Email must belong to an
    existing user. `userId` remains supported for existing clients.

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
    - The signed-in user must belong to the organization.

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
    - The signed-in user and the new team member must belong to the team's organization.

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

- **`GET /api/v1/teams`**
    - auth: true
    
    queries:

    | query | meaning |
    |----------|----------|
    | page    | page number (default: 1) |
    | limit    | teams per page (default: 10, maximum: 100) |
    | organizationId | optional organization filter; the signed-in user must belong to it |

    response:
    ```json
    {
        "success": true,
        "message": "Retrieved all teams successfully",
        "statusCode": 200,
        "data": {
            "teams": [
                {
                    "id": "e21ab1b8-e440-4b0d-8b36-38da9ec4621f",
                    "name": "My Second Team",
                    "organizationId": "d586b89c-3b04-4995-b185-06d5a007f1d0",
                    "createdAt": "2026-09-05T09:32:02.137Z",
                    "updatedAt": "2026-09-05T09:32:02.137Z"
                }
            ],
            "pagination": {
                "page": 1,
                "limit": 10,
                "total": 1,
                "totalPages": 1
            }
        }
    }
    ```
## Get Team Members

**GET**

```text
/api/v1/teams/:teamId/members
```

- auth: true
- The signed-in user must belong to the team's organization.

response:

```json
{
    "success": true,
    "message": "Team members retrieved successfully",
    "statusCode": 200,
    "data": {
        "members": [
            {
                "id": "team-member-id",
                "teamId": "team-id",
                "userId": "user-id",
                "role": "MEMBER",
                "createdAt": "2026-09-05T09:59:40.064Z",
                "updatedAt": "2026-09-05T09:59:40.064Z",
                "user": {
                    "username": "member-name",
                    "email": "member@example.com"
                }
            }
        ]
    }
}
```

### Project

- **`POST /api/v1/projects`**
    - auth: true
    - The signed-in user must belong to the organization that owns the selected team.

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
    - The signed-in user and target user must belong to the project's organization.

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

- **`GET /api/v1/projects/:projectId/members`**
    - auth: true
    - The signed-in user must belong to the project's organization.

    response:
    ```json
    {
        "success": true,
        "message": "Project members retrieved successfully",
        "statusCode": 200,
        "data": {
            "members": [
                {
                    "id": "project-member-id",
                    "projectId": "project-id",
                    "userId": "user-id",
                    "role": "MEMBER",
                    "createdAt": "2026-09-05T10:31:52.840Z",
                    "updatedAt": "2026-09-05T10:31:52.840Z",
                    "user": {
                        "username": "member-name",
                        "email": "member@example.com"
                    }
                }
            ]
        }
    }
    ```

- **`GET /api/v1/projects`**
    - auth: true
    
    queries:

    | query | meaning |
    |----------|----------|
    | page    | page number (default: 1) |
    | limit    | projects per page (default: 10, maximum: 100) |
    | organizationId | optional organization filter; the signed-in user must belong to it |

    response:
    ```json
    {
        "success": true,
        "message": "Retrieved all projects successfully",
        "statusCode": 200,
        "data": {
            "projects": [
                {
                    "id": "3f637321-b016-40e6-a14c-a9b5dd8e1339",
                    "name": "My Second Project",
                    "teamId": "1ae39862-c31f-4356-b010-f1bf76c9e08e",
                    "createdAt": "2026-09-05T10:27:04.447Z",
                    "updatedAt": "2026-09-05T10:27:04.447Z",
                    "team": {
                        "id": "1ae39862-c31f-4356-b010-f1bf76c9e08e",
                        "name": "Design",
                        "organizationId": "d586b89c-3b04-4995-b185-06d5a007f1d0"
                    },
                    "sprints": [
                        {
                            "id": "c98aaf86-2f77-4cf5-ac49-236b27d95ac0",
                            "name": "My first sprint",
                            "projectId": "3f637321-b016-40e6-a14c-a9b5dd8e1339",
                            "startTime": "2026-09-05T11:46:07.779Z",
                            "endTime": "2026-09-08T11:46:07.779Z",
                            "createdAt": "2026-09-05T12:05:23.873Z",
                            "updatedAt": "2026-09-05T12:05:23.873Z"
                        }
                    ]
                },
                {
                    "id": "8c6af6af-8dba-472e-853f-81365c014f67",
                    "name": "My First Project",
                    "teamId": "1ae39862-c31f-4356-b010-f1bf76c9e08e",
                    "createdAt": "2026-09-05T10:26:35.330Z",
                    "updatedAt": "2026-09-05T10:26:35.330Z",
                    "team": {
                        "id": "1ae39862-c31f-4356-b010-f1bf76c9e08e",
                        "name": "Design",
                        "organizationId": "d586b89c-3b04-4995-b185-06d5a007f1d0"
                    },
                    "sprints": []
                }
            ],
            "pagination": {
                "page": 1,
                "limit": 10,
                "total": 2,
                "totalPages": 1
            }
        }
    }
    ```


### Sprint

- **`POST /api/v1/sprints`**
    - auth: true
    - The signed-in user must belong to the organization that owns the project.
    - Sprint start time must be before its end time.

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
    - The signed-in user must belong to the organization that owns the project.
    - An optional sprint must belong to the selected project.

    request body:
    ```json
    {
        "title": "My First Task",
        "description": "This is very important",
        "projectId": "8c6af6af-8dba-472e-853f-81365c014f67",
        "sprintId": "c98aaf86-2f77-4cf5-ac49-236b27d95ac0"
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
                "updatedAt": "2026-09-05T13:56:13.569Z",
                "project": {
                    "id": "8c6af6af-8dba-472e-853f-81365c014f67",
                    "name": "My Project"
                },
                "sprint": {
                    "id": "c98aaf86-2f77-4cf5-ac49-236b27d95ac0",
                    "name": "Sprint 1",
                    "startTime": "2026-09-05T11:46:07.779Z",
                    "endTime": "2026-09-08T11:46:07.779Z"
                },
                "subtasks": []
            }
        }
    }
    ```


- **`POST /api/v1/tasks/:taskId/assign`**
    - auth: true
    - The signed-in user must belong to the organization that owns the task.
    - The sprint must belong to the task's project.

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
        "statusCode": 200,
        "data": {
            "task": {
                "id": "bd4471de-4b70-4ed7-9ae8-371676c9620b",
                "projectId": "8c6af6af-8dba-472e-853f-81365c014f67",
                "sprintId": "c98aaf86-2f77-4cf5-ac49-236b27d95ac0",
                "title": "My First Task",
                "description": "This is very important",
                "createdAt": "2026-09-05T13:56:13.569Z",
                "updatedAt": "2026-09-05T14:05:17.739Z",
                "project": {
                    "id": "8c6af6af-8dba-472e-853f-81365c014f67",
                    "name": "My Project"
                },
                "sprint": {
                    "id": "c98aaf86-2f77-4cf5-ac49-236b27d95ac0",
                    "name": "Sprint 1",
                    "startTime": "2026-09-05T11:46:07.779Z",
                    "endTime": "2026-09-08T11:46:07.779Z"
                },
                "subtasks": []
            }
        }
    }
    ```


- **`GET /api/v1/tasks`**
    - auth: true
    - The user must belong to the requested organization.
    
    queries:

    | query | meaning |
    |----------|----------|
    | organizationId | required organization UUID |
    | page    | page number, defaults to 1 |
    | limit    | tasks per page, defaults to 10 (maximum 100) |
    | sortBy    | `createdAt`, `updatedAt`, or `title`; defaults to `createdAt` |
    | order    | `asc` or `desc`; defaults to `desc` |
    | term    | optional search term for title and description |

    response:
    ```json
    {
        "success": true,
        "message": "Retrieved all tasks successfully",
        "statusCode": 200,
        "data": {
            "pagination": {
                "page": 1,
                "limit": 10,
                "total": 3,
                "totalPages": 1
            },
            "tasks": [
                {
                    "id": "bd4471de-4b70-4ed7-9ae8-371676c9620b",
                    "projectId": "8c6af6af-8dba-472e-853f-81365c014f67",
                    "sprintId": "c98aaf86-2f77-4cf5-ac49-236b27d95ac0",
                    "title": "My First Task",
                    "description": "This is very important",
                    "createdAt": "2026-09-05T13:56:13.569Z",
                    "updatedAt": "2026-09-05T14:05:17.739Z",
                    "project": {
                        "id": "8c6af6af-8dba-472e-853f-81365c014f67",
                        "name": "My Project"
                    },
                    "sprint": {
                        "id": "c98aaf86-2f77-4cf5-ac49-236b27d95ac0",
                        "name": "Sprint 1",
                        "startTime": "2026-09-05T11:46:07.779Z",
                        "endTime": "2026-09-08T11:46:07.779Z"
                    },
                    "subtasks": [
                        {
                            "id": "44bdef07-f736-4e67-acc0-f28844f7e81a",
                            "title": "First Subtask",
                            "description": "Break the task into a smaller step",
                            "taskId": "bd4471de-4b70-4ed7-9ae8-371676c9620b",
                            "createdAt": "2026-09-05T15:10:38.493Z",
                            "updatedAt": "2026-09-05T15:10:38.493Z"
                        }
                    ]
                },
                {
                    "id": "277e84c4-9f7c-4af9-a7e5-61599ac1741a",
                    "projectId": "3f637321-b016-40e6-a14c-a9b5dd8e1339",
                    "sprintId": null,
                    "title": "My Second Task",
                    "description": "This is very important",
                    "createdAt": "2026-09-15T13:27:47.712Z",
                    "updatedAt": "2026-09-15T13:27:47.712Z",
                    "project": {
                        "id": "3f637321-b016-40e6-a14c-a9b5dd8e1339",
                        "name": "Another Project"
                    },
                    "sprint": null,
                    "subtasks": []
                },
                {
                    "id": "b574afa4-a781-47fb-ac9f-f0e4d83bcd63",
                    "projectId": "3f637321-b016-40e6-a14c-a9b5dd8e1339",
                    "sprintId": null,
                    "title": "My Third Task",
                    "description": "This is very important",
                    "createdAt": "2026-09-15T13:27:53.529Z",
                    "updatedAt": "2026-09-15T13:27:53.529Z",
                    "project": {
                        "id": "3f637321-b016-40e6-a14c-a9b5dd8e1339",
                        "name": "Another Project"
                    },
                    "sprint": null,
                    "subtasks": []
                }
            ]
        }
    }
    ```



- **`POST /api/v1/tasks/:taskId/subtasks`**
    - auth: true
    - The signed-in user must belong to the organization that owns the task.
    - Subtask titles are trimmed and required (maximum 200 characters).
    - Subtask descriptions are optional (maximum 2000 characters).

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

`GET /api/v1/tasks` includes each task's subtasks, ordered by creation time.

- **`POST /api/v1/tasks/:taskId/attachment`**
    - auth: true

    request body:
    ```json
    {
        "attachment": `file here`
    }
    ```

    response:
    ```json
    {
        "success": true,
        "message": "attachment added successfully",
        "statusCode": 200,
        "data": {
            "attachment": {
                "id": "d41ca769-cb2a-4116-af99-32ab3cfb3987",
                "taskId": "bd4471de-4b70-4ed7-9ae8-371676c9620b",
                "userId": "acc950d1-32d4-4764-adaf-5a311f022acd",
                "fileURL": "https://res.cloudinary.com/awmp85xk/image/upload/v1789138256/uploads/y5rcmwxrp48f4bfijgff.png",
                "createdAt": "2026-09-11T14:47:43.383Z",
                "updatedAt": "2026-09-11T14:47:43.383Z"
            }
        }
    }
    ```



### Comment

- **`POST /api/v1/comments`**
    - auth: true
    - The signed-in user must belong to the organization that owns the task.
    - Comment content is trimmed, required, and limited to 5000 characters.

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
                "updatedAt": "2026-09-05T16:19:18.431Z",
                "user": {
                    "username": "Hasan"
                }
            }
        }
    }
    ```

- **`GET /api/v1/comments?taskId=<task-id>`**
    - auth: true
    - The signed-in user must belong to the organization that owns the task.

    response:
    ```json
    {
        "success": true,
        "message": "Retrieved task comments successfully",
        "statusCode": 200,
        "data": {
            "comments": [
                {
                    "id": "78e930dc-f6e9-4c4e-b73d-dfa321fe3fac",
                    "content": "This is comment content",
                    "userId": "acc950d1-32d4-4764-adaf-5a311f022acd",
                    "taskId": "bd4471de-4b70-4ed7-9ae8-371676c9620b",
                    "createdAt": "2026-09-05T16:19:18.431Z",
                    "updatedAt": "2026-09-05T16:19:18.431Z",
                    "user": {
                        "username": "Hasan"
                    }
                }
            ]
        }
    }
    ```

### Payment

- **`POST /api/v1/payments/create-payment`**
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
        "message": "Payment Created Successfully",
        "statusCode": 200,
        "data": {
            "paymentID": "TR0011MTOcN3f1789208179219",
            "bkashURL": "https://sandbox.payment.bkash.com/?paymentId=TR0011MTOcN3f1789208179219&hash=AQ(mqat97pArZ3!foZC-cItLK!Zn(f8dvKJ_i7j9VfqHP7cwMpbuJGaaMT9A5FL_m_cosqODU0DGieRYo3(1r_kRnjJpDgxAoh1l1789208179219&mode=0011&apiVersion=v1.2.0-beta/",
            "callbackURL": "http://localhost:5000/api/v1/payments/callback?userId=acc950d1-32d4-4764-adaf-5a311f022acd",
            "successCallbackURL": "http://localhost:5000/api/v1/payments/callback?userId=acc950d1-32d4-4764-adaf-5a311f022acd&paymentID=TR0011MTOcN3f1789208179219&status=success&signature=pz5SW0cE4e",
            "failureCallbackURL": "http://localhost:5000/api/v1/payments/callback?userId=acc950d1-32d4-4764-adaf-5a311f022acd&paymentID=TR0011MTOcN3f1789208179219&status=failure&signature=pz5SW0cE4e",
            "cancelledCallbackURL": "http://localhost:5000/api/v1/payments/callback?userId=acc950d1-32d4-4764-adaf-5a311f022acd&paymentID=TR0011MTOcN3f1789208179219&status=cancel&signature=pz5SW0cE4e",
            "amount": "600",
            "intent": "sale",
            "currency": "BDT",
            "paymentCreateTime": "2026-09-12T16:16:19:219 GMT+0600",
            "transactionStatus": "Initiated",
            "merchantInvoiceNumber": "Inv04324",
            "statusCode": "0000",
            "statusMessage": "Successful",
            "userId": "acc950d1-32d4-4764-adaf-5a311f022acd"
        }
    }
    ```

- **`POST /api/v1/payments/callback`**
    - auth: (for now false, but with frontend it will be auth route)

    request body:
    ```json

    ```

    response: Redicet to payment success page(frontend)
    ```json

    ```
