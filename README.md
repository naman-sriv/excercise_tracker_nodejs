# Exercise Tracker API

This is a simple Exercise Tracker API built with Node.js, Express, and a basic in-memory data store. It allows users to create accounts, add exercises to their logs, and retrieve their exercise history.

## Functionality

The API provides the following endpoints:

* **`POST /api/users`**: Create a new user.
    * **Request Body**:
        ```json
        {
          "username": "your_desired_username"
        }
        ```
    * **Response**:
        ```json
        {
          "username": "your_desired_username",
          "_id": "some_unique_id"
        }
        ```
    * Returns a JSON object containing the new username and a unique `_id` for the user.

* **`GET /api/users`**: Get a list of all users.
    * **Response**:
        ```json
        [
          {
            "username": "user1",
            "_id": "id1"
          },
          {
            "username": "user2",
            "_id": "id2"
          },
          ...
        ]
        ```
    * Returns a JSON array of all users with their usernames and `_id`s.

* **`POST /api/users/:_id/exercises`**: Add a new exercise to a user's log.
    * **Path Parameter**:
        * `:_id`: The `_id` of the user to add the exercise for.
    * **Request Body**:
        ```json
        {
          "description": "description of the exercise",
          "duration": 30, // in minutes
          "date": "YYYY-MM-DD" // optional, current date will be used if not provided
        }
        ```
    * **Response**:
        ```json
        {
          "username": "users_username",
          "description": "description of the exercise",
          "duration": 30,
          "date": "Mon May 04 2025", // formatted date
          "_id": "users_unique_id"
        }
        ```
    * Requires `description` (string) and `duration` (number in minutes) in the request body. The `date` is optional; if not provided, the current date will be used. Returns the exercise details along with the user's information.

* **`GET /api/users/:_id/logs?[from][&to][&limit]`**: Retrieve a user's exercise log.
    * **Path Parameter**:
        * `:_id`: The `_id` of the user whose log to retrieve.
    * **Query Parameters** (optional):
        * `from`: A date in `YYYY-MM-DD` format to filter the log (start date).
        * `to`: A date in `YYYY-MM-DD` format to filter the log (end date).
        * `limit`: An integer to limit the number of returned log entries.
    * **Response**:
        ```json
        {
          "username": "users_username",
          "count": 2, // total number of exercises in the filtered log
          "_id": "users_unique_id",
          "log": [
            {
              "description": "exercise description 1",
              "duration": 30,
              "date": "Mon May 04 2025"
            },
            {
              "description": "exercise description 2",
              "duration": 45,
              "date": "Tue May 05 2025"
            }
            // ... more log entries
          ]
        }
        ```
    * Returns a JSON object containing the user's username, the total count of exercises in the log (after applying any filters), the user's `_id`, and an array of exercise log entries.

## How to Use

1.  **Clone the repository** (if you have the code locally).
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Set up environment variables**:
    * Create a `.env` file in the root directory.
    * You can optionally define a `PORT` variable (e.g., `PORT=3000`). If not defined, the server will listen on port 3000.
4.  **Run the application**:
    ```bash
    npm start
    ```
5.  **Interact with the API** using tools like `curl`, Postman, or a web application.
