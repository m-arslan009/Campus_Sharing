# Campus Sharing - Data Schema

This file defines the data model (not UI/app structure) for later implementation.

## 1) User

Purpose: account holder (driver, rider, or both).

| Field           | Type          | Required | Example              | Notes                          |
| --------------- | ------------- | -------- | -------------------- | ------------------------------ |
| id              | string (uuid) | yes      | usr_01               | Primary key                    |
| fullName        | string        | yes      | Muhammad Arslan      | Display name                   |
| email           | string        | yes      | arslan@campus.edu    | Unique                         |
| passwordHash    | string        | yes      | $2b$...              | Store hash, not plain password |
| phone           | string        | no       | +923001234567        | Contact number                 |
| university      | string        | yes      | NUST                 | Campus name                    |
| role            | enum          | yes      | both                 | `driver`, `rider`, `both`      |
| gender          | enum          | no       | male                 | Optional filter                |
| profileImageUrl | string        | no       | https://...          | Avatar link                    |
| isVerified      | boolean       | yes      | false                | Email/phone verification       |
| ratingAvg       | number        | no       | 4.7                  | Derived/aggregated             |
| ratingCount     | number        | no       | 23                   | Derived/aggregated             |
| createdAt       | datetime      | yes      | 2026-03-10T10:00:00Z | Audit field                    |
| updatedAt       | datetime      | yes      | 2026-03-10T10:00:00Z | Audit field                    |

## 2) Ride

Purpose: trip created by a driver.

| Field             | Type             | Required | Example              | Notes                                               |
| ----------------- | ---------------- | -------- | -------------------- | --------------------------------------------------- |
| id                | string (uuid)    | yes      | ride_01              | Primary key                                         |
| driverId          | string (User.id) | yes      | usr_01               | FK -> User                                          |
| fromLocation      | string           | yes      | G-13 Hostel          | Pickup area                                         |
| toLocation        | string           | yes      | FAST Islamabad       | Drop area                                           |
| departureDateTime | datetime         | yes      | 2026-03-11T08:30:00Z | Start time                                          |
| seatsTotal        | number           | yes      | 4                    | Total seats                                         |
| seatsAvailable    | number           | yes      | 2                    | Updated after booking                               |
| farePerSeat       | number           | yes      | 350                  | Currency: PKR                                       |
| rideStatus        | enum             | yes      | open                 | `open`, `full`, `started`, `completed`, `cancelled` |
| vehicleType       | string           | no       | Sedan                | Optional                                            |
| vehicleNumber     | string           | no       | ABC-123              | Optional                                            |
| notes             | string           | no       | No smoking           | Driver notes                                        |
| createdAt         | datetime         | yes      | 2026-03-10T10:00:00Z | Audit field                                         |
| updatedAt         | datetime         | yes      | 2026-03-10T10:00:00Z | Audit field                                         |

## 3) RideRequest

Purpose: rider requests seat(s) in a ride.

| Field          | Type             | Required | Example              | Notes                                          |
| -------------- | ---------------- | -------- | -------------------- | ---------------------------------------------- |
| id             | string (uuid)    | yes      | req_01               | Primary key                                    |
| rideId         | string (Ride.id) | yes      | ride_01              | FK -> Ride                                     |
| riderId        | string (User.id) | yes      | usr_22               | FK -> User                                     |
| seatsRequested | number           | yes      | 1                    | Must be >= 1                                   |
| message        | string           | no       | I will be at gate 2  | Optional note                                  |
| requestStatus  | enum             | yes      | pending              | `pending`, `accepted`, `rejected`, `cancelled` |
| createdAt      | datetime         | yes      | 2026-03-10T10:00:00Z | Audit field                                    |
| updatedAt      | datetime         | yes      | 2026-03-10T10:00:00Z | Audit field                                    |

## 4) Booking

Purpose: confirmed seat reservation after request acceptance.

| Field         | Type                    | Required | Example              | Notes                                 |
| ------------- | ----------------------- | -------- | -------------------- | ------------------------------------- |
| id            | string (uuid)           | yes      | book_01              | Primary key                           |
| rideId        | string (Ride.id)        | yes      | ride_01              | FK -> Ride                            |
| riderId       | string (User.id)        | yes      | usr_22               | FK -> User                            |
| requestId     | string (RideRequest.id) | no       | req_01               | Optional traceability                 |
| seatsBooked   | number                  | yes      | 1                    | Confirmed seats                       |
| totalFare     | number                  | yes      | 350                  | seatsBooked \* farePerSeat            |
| bookingStatus | enum                    | yes      | confirmed            | `confirmed`, `cancelled`, `completed` |
| createdAt     | datetime                | yes      | 2026-03-10T10:00:00Z | Audit field                           |
| updatedAt     | datetime                | yes      | 2026-03-10T10:00:00Z | Audit field                           |

## 5) Optional: Review

Purpose: rating and feedback after trip completion.

| Field      | Type             | Required | Example              | Notes       |
| ---------- | ---------------- | -------- | -------------------- | ----------- |
| id         | string (uuid)    | yes      | rev_01               | Primary key |
| rideId     | string (Ride.id) | yes      | ride_01              | FK -> Ride  |
| reviewerId | string (User.id) | yes      | usr_22               | FK -> User  |
| revieweeId | string (User.id) | yes      | usr_01               | FK -> User  |
| rating     | number           | yes      | 5                    | 1 to 5      |
| comment    | string           | no       | Very punctual        | Optional    |
| createdAt  | datetime         | yes      | 2026-03-10T10:00:00Z | Audit field |

## Entity Relationships

1. One User (driver) creates many Rides.
2. One Ride has many RideRequests.
3. One RideRequest may become one Booking.
4. One Ride has many Bookings.
5. One User (rider) can have many Requests and Bookings.

## Minimal Redux State Shape (frontend)

```js
{
  auth: {
    currentUser: null,
    token: null,
    isAuthenticated: false
  },
  users: [],
  rides: [],
  requests: [],
  bookings: [],
  ui: {
    loading: false,
    error: null
  }
}
```

## Example Seed JSON

```json
{
  "users": [
    {
      "id": "usr_01",
      "fullName": "Muhammad Arslan",
      "email": "arslan@campus.edu",
      "role": "both",
      "isVerified": true
    }
  ],
  "rides": [
    {
      "id": "ride_01",
      "driverId": "usr_01",
      "fromLocation": "G-13 Hostel",
      "toLocation": "FAST Islamabad",
      "departureDateTime": "2026-03-11T08:30:00Z",
      "seatsTotal": 4,
      "seatsAvailable": 3,
      "farePerSeat": 350,
      "rideStatus": "open"
    }
  ]
}
```

## Data Rules (important)

1. `User.email` must be unique.
2. `Ride.seatsAvailable` cannot be negative.
3. `Booking.seatsBooked` must be <= available seats at confirmation time.
4. A rider should not create duplicate active requests for the same ride.
5. Only `completed` rides should allow reviews.
