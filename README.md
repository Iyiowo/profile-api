# PROFILE API

A REST API that generates user profiles using name-based predictions from external APIs.
[Live URL](profile-api-production-c932.up.railway.app)

## Tech Stack
- [Node.js](https://www.npmjs.com/package/docx)
- [Express](https://expressjs.com/)
- [Axios](https://axios-http.com/docs/intro)
- [UUID v7](https://www.uuidgenerator.net/version7)
- [Railway](https://railway.com/)

  ## External APIs
  - [Genderize.io](https://genderize.io/) - predicts gender
  - [Agify.io](https://agify.io/) - predicts age
  - [Nationalize.io](https://nationalize.io/) - predicts nationality
    

  ### Create Profile
  
  **`POST /api/profiles`**

  **Request body:**
  ```json
  { "name": "John" }
  ```
  
  **Response (**` 201 Created `**):
  ```json
  {
    "status": "success",
    "data": {
        "id": "019da0c6-bb71-76b8-a2df-3dd5e1f7da05",
        "name": "John",
        "gender": "male",
        "gender_probability": 1,
        "sample_size": 2692560,
        "age": 75,
        "age_group": "senior",
        "country_id": "NG",
        "country_probability": 0.07613817567167579,
        "created_at": "2026-04-18T13:27:51.922Z"
    }
}
```
> If the same name is submitted again, the existing profile is returned:
```json
{
    "status": "success",
    "message": "Profile already exists",
    "data": {
        "id": "019da0c6-bb71-76b8-a2df-3dd5e1f7da05",
        "name": "John",
        "gender": "male",
        "gender_probability": 1,
        "sample_size": 2692560,
        "age": 75,
        "age_group": "senior",
        "country_id": "NG",
        "country_probability": 0.07613817567167579,
        "created_at": "2026-04-18T13:27:51.922Z"
    }
}
```

### Get Single Profile

**`GET /api/profiles/{id}`**

Response (**` 200 OK `**):
{
    "status": "success",
    "data": {
        "id": "019da0c6-bb71-76b8-a2df-3dd5e1f7da05",
        "name": "John",
        "gender": "male",
        "gender_probability": 1,
        "sample_size": 2692560,
        "age": 75,
        "age_group": "senior",
        "country_id": "NG",
        "country_probability": 0.07613817567167579,
        "created_at": "2026-04-18T13:27:51.922Z"
    }
}

### Get All Profiles
**`GET /api/profiles`**
Optional query parameter (case-insensitive): **`gender`**, **`country_id`**, **`age_group`**

Example: **`/api/profiles?gender=male&country_id=NG`**

Response (**` 200 OK `**):

{
    "status": "success",
    "count": 1,
    "data": [
        {
            "id": "019da0c6-bb71-76b8-a2df-3dd5e1f7da05",
            "name": "John",
            "gender": "male",
            "gender_probability": 1,
            "sample_size": 2692560,
            "age": 75,
            "age_group": "senior",
            "country_id": "NG",
            "country_probability": 0.07613817567167579,
            "created_at": "2026-04-18T13:27:51.922Z"
        }
    ]
}

### Delete Profile
**`DELETE /api/profiles/{id}`**

Returns **`204 No Content`** on success.


# Classification Rules
- Gender and probability: from Genderize API. **`count`** is renamed to **`sample_size`**
- Age group frpm Ageify API: 0-12 child, 13-19 teenager, 20-59 adult, 60+ senior
- Nationality: highest-probability country from Nationalize API
- IDs: UUID v7 (time sortable)
- Timestamps: UTC ISO 8601
