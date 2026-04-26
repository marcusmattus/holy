# Holy API Routes Documentation

## Overview

RESTful API endpoints for managing projects, store entries, and reviews in the Holy platform. All routes follow Next.js App Router conventions and return JSON responses.

---

## 🔐 Authentication

**Status:** Not yet implemented
- Add authentication middleware to protect routes
- Extract `userId` from session instead of query parameters
- Implement ownership checks for update/delete operations

**TODO Comments** in code indicate where auth should be added.

---

## 📁 Project Routes

### `GET /api/projects`
List all projects for the current user.

**Query Parameters:**
- `userId` (string, required*) - User ID to fetch projects for
  - *Will come from auth session in production

**Response:** `200 OK`
```json
{
  "projects": [
    {
      "id": "cmnvzti7q...",
      "name": "Holy Commerce",
      "slug": "holy-commerce",
      "description": "E-commerce platform built with vibecoding",
      "thumbnail": "/projects/commerce-thumb.jpg",
      "published": true,
      "storePrice": 49.99,
      "category": "E-commerce",
      "techStack": "Next.js, Stripe, Tailwind",
      "deployUrl": "https://holy-commerce.holy.app",
      "holyosProjectId": "prj_commerce_001",
      "userId": "cmnvzti79...",
      "createdAt": "2026-04-12T16:43:38.486Z",
      "updatedAt": "2026-04-12T16:43:38.486Z",
      "_count": {
        "versions": 2
      },
      "storeEntry": {
        "status": "PUBLISHED",
        "installs": 127,
        "avgRating": 4.8
      }
    }
  ]
}
```

**Error Responses:**
- `400 Bad Request` - Missing userId
- `500 Internal Server Error` - Database error

---

### `POST /api/projects`
Create a new project.

**Request Body:**
```json
{
  "name": "My Awesome App",
  "slug": "my-awesome-app",
  "description": "A great app built with Holy",
  "category": "SaaS",
  "userId": "user_id_here",
  "holyosProjectId": "holyos_project_id" // optional
}
```

**Response:** `201 Created`
```json
{
  "project": {
    "id": "new_project_id",
    "name": "My Awesome App",
    "slug": "my-awesome-app",
    // ... other fields
    "user": {
      "id": "user_id",
      "name": "Alice Johnson",
      "email": "alice@holysticlabs.com",
      "avatarUrl": "https://..."
    }
  }
}
```

**Error Responses:**
- `400 Bad Request` - Missing required fields
- `409 Conflict` - Slug already exists
- `500 Internal Server Error` - Database error

---

### `GET /api/projects/[id]`
Get a single project with full details.

**Path Parameters:**
- `id` (string, required) - Project ID

**Response:** `200 OK`
```json
{
  "project": {
    "id": "project_id",
    "name": "Holy Commerce",
    // ... basic fields
    "user": {
      "id": "user_id",
      "name": "Alice Johnson",
      "email": "alice@holysticlabs.com",
      "avatarUrl": "https://..."
    },
    "versions": [
      {
        "id": "version_id",
        "projectId": "project_id",
        "snapshot": "{...}", // JSON string
        "label": "v1.1",
        "createdAt": "2026-04-12T16:43:38.489Z"
      }
    ],
    "storeEntry": {
      "id": "entry_id",
      "status": "PUBLISHED",
      "screenshots": "[...]", // JSON string array
      "longDescription": "...",
      "demoUrl": "https://...",
      "installs": 127,
      "avgRating": 4.8,
      "reviewCount": 23,
      "reviews": [
        {
          "id": "review_id",
          "rating": 5,
          "comment": "Amazing!",
          "createdAt": "...",
          "user": {
            "id": "user_id",
            "name": "Bob Smith",
            "avatarUrl": "https://..."
          }
        }
      ]
    }
  }
}
```

**Error Responses:**
- `404 Not Found` - Project doesn't exist
- `500 Internal Server Error` - Database error

---

### `PATCH /api/projects/[id]`
Update a project.

**Path Parameters:**
- `id` (string, required) - Project ID

**Request Body:** (all fields optional)
```json
{
  "name": "Updated Name",
  "description": "Updated description",
  "published": true,
  "storePrice": 29.99,
  "deployUrl": "https://new-url.app"
}
```

**Response:** `200 OK`
```json
{
  "project": {
    // Updated project object
  }
}
```

**Error Responses:**
- `404 Not Found` - Project doesn't exist
- `403 Forbidden` - User doesn't own project (when auth is added)
- `500 Internal Server Error` - Database error

---

### `DELETE /api/projects/[id]`
Delete a project (cascades to versions and store entry).

**Path Parameters:**
- `id` (string, required) - Project ID

**Response:** `200 OK`
```json
{
  "message": "Project deleted successfully"
}
```

**Error Responses:**
- `404 Not Found` - Project doesn't exist
- `403 Forbidden` - User doesn't own project (when auth is added)
- `500 Internal Server Error` - Database error

---

## 📦 Version Routes

### `GET /api/projects/[id]/versions`
List all versions for a project.

**Path Parameters:**
- `id` (string, required) - Project ID

**Response:** `200 OK`
```json
{
  "versions": [
    {
      "id": "version_id",
      "projectId": "project_id",
      "snapshot": "{\"version\":\"1.1\",\"components\":[...]}",
      "label": "Added checkout flow",
      "createdAt": "2026-04-12T16:43:38.489Z"
    }
  ]
}
```

---

### `POST /api/projects/[id]/versions`
Create a new version snapshot.

**Path Parameters:**
- `id` (string, required) - Project ID

**Request Body:**
```json
{
  "snapshot": {
    "version": "1.2",
    "components": [],
    "styles": {}
  },
  "label": "Before redesign" // optional
}
```

**Response:** `201 Created`
```json
{
  "version": {
    "id": "new_version_id",
    "projectId": "project_id",
    "snapshot": "{...}",
    "label": "Before redesign",
    "createdAt": "2026-04-12T17:00:00.000Z"
  }
}
```

**Error Responses:**
- `400 Bad Request` - Missing snapshot
- `404 Not Found` - Project doesn't exist
- `500 Internal Server Error` - Database error

---

## 🏪 Store Routes

### `GET /api/store`
List all published store entries.

**Query Parameters:**
- `category` (string, optional) - Filter by category
- `search` (string, optional) - Search in name and description
- `sort` (string, optional) - Sort order: `installs` (default), `rating`, `price`, `recent`

**Response:** `200 OK`
```json
{
  "entries": [
    {
      "id": "entry_id",
      "projectId": "project_id",
      "status": "PUBLISHED",
      "screenshots": "[...]",
      "longDescription": "...",
      "demoUrl": "https://...",
      "installs": 127,
      "avgRating": 4.8,
      "reviewCount": 23,
      "submittedAt": "...",
      "publishedAt": "...",
      "project": {
        "id": "project_id",
        "name": "Holy Commerce",
        "slug": "holy-commerce",
        "description": "...",
        "thumbnail": "/projects/...",
        "published": true,
        "storePrice": 49.99,
        "category": "E-commerce",
        "user": {
          "id": "user_id",
          "name": "Alice Johnson",
          "avatarUrl": "https://..."
        }
      }
    }
  ]
}
```

---

### `POST /api/store`
Submit a project to the store.

**Request Body:**
```json
{
  "projectId": "project_id",
  "screenshots": [
    "/store/screenshot1.jpg",
    "/store/screenshot2.jpg"
  ],
  "longDescription": "Detailed description of the project...",
  "demoUrl": "https://demo.app"
}
```

**Response:** `201 Created`
```json
{
  "entry": {
    "id": "new_entry_id",
    "projectId": "project_id",
    "status": "IN_REVIEW",
    "submittedAt": "2026-04-12T17:00:00.000Z",
    // ... other fields
    "project": {
      // Full project details
    }
  }
}
```

**Error Responses:**
- `400 Bad Request` - Missing projectId
- `404 Not Found` - Project doesn't exist
- `409 Conflict` - Project already submitted
- `500 Internal Server Error` - Database error

---

## ⭐ Review Routes

### `POST /api/store/[id]/reviews`
Add a review to a store entry.

**Path Parameters:**
- `id` (string, required) - Store entry ID

**Request Body:**
```json
{
  "userId": "user_id",
  "rating": 5,
  "comment": "Amazing template! Saved me weeks." // optional
}
```

**Response:** `201 Created`
```json
{
  "review": {
    "id": "review_id",
    "storeEntryId": "entry_id",
    "userId": "user_id",
    "rating": 5,
    "comment": "Amazing template!...",
    "createdAt": "2026-04-12T17:00:00.000Z",
    "user": {
      "id": "user_id",
      "name": "Bob Smith",
      "avatarUrl": "https://..."
    }
  }
}
```

**Behavior:**
- Automatically updates store entry's `avgRating` and `reviewCount`
- Recalculates average from all reviews

**Error Responses:**
- `400 Bad Request` - Missing userId/rating or invalid rating (must be 1-5)
- `404 Not Found` - Store entry doesn't exist
- `500 Internal Server Error` - Database error

---

## 🧪 Testing the API

### Using cURL

```bash
# Get projects for a user
curl "http://localhost:3000/api/projects?userId=USER_ID"

# Create a new project
curl -X POST "http://localhost:3000/api/projects" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Project",
    "slug": "test-project",
    "userId": "USER_ID"
  }'

# Get a specific project
curl "http://localhost:3000/api/projects/PROJECT_ID"

# Update a project
curl -X PATCH "http://localhost:3000/api/projects/PROJECT_ID" \
  -H "Content-Type: application/json" \
  -d '{"published": true, "storePrice": 29.99}'

# List store entries
curl "http://localhost:3000/api/store?sort=rating&category=E-commerce"

# Add a review
curl -X POST "http://localhost:3000/api/store/ENTRY_ID/reviews" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "USER_ID",
    "rating": 5,
    "comment": "Great app!"
  }'
```

### Using the Browser Console

```javascript
// Fetch projects
const response = await fetch('/api/projects?userId=USER_ID')
const data = await response.json()
console.log(data.projects)

// Create project
const newProject = await fetch('/api/projects', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Browser Test',
    slug: 'browser-test',
    userId: 'USER_ID'
  })
})
const project = await newProject.json()
console.log(project)
```

---

## 🔄 Next Steps

### 1. Add Authentication
- [ ] Integrate NextAuth.js or similar
- [ ] Add middleware to extract userId from session
- [ ] Implement ownership checks
- [ ] Add role-based permissions (e.g., admin for store approval)

### 2. Add Validation
- [ ] Use Zod or similar for request validation
- [ ] Add field-level constraints
- [ ] Sanitize user input

### 3. Add Pagination
- [ ] Implement cursor-based pagination for projects list
- [ ] Add limit/offset parameters
- [ ] Return pagination metadata

### 4. Add Rate Limiting
- [ ] Implement rate limiting per user
- [ ] Add abuse prevention

### 5. Connect to HolyOS
- [ ] Call HolyOS API when creating projects
- [ ] Sync analytics data
- [ ] Handle deployment triggers

---

## 📚 Related Files

- **Schema:** `/apps/holy/prisma/schema.prisma`
- **Types:** `/apps/holy/types/*.ts`
- **Database Client:** `/apps/holy/lib/db.ts`
- **HolyOS Integration:** `/apps/holy/lib/holyos/*.ts`

---

## ✅ Completion Checklist

- [x] Projects CRUD endpoints
- [x] Project versions endpoints
- [x] Store listing endpoints
- [x] Review endpoints
- [x] Error handling
- [x] TypeScript types
- [x] Database queries with relations
- [x] Auto-update store stats on review
- [ ] Authentication integration
- [ ] Input validation
- [ ] Pagination
- [ ] Rate limiting
- [ ] HolyOS integration
