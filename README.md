#Fitness Tracker — Microservices

A Spring Boot–based fitness tracking backend built with a microservices architecture. It handles user registration/auth via Keycloak, activity logging, and AI-generated workout recommendations powered by Google Gemini — all wired together through service discovery, a centralized config server, and event-driven communication with Kafka.

✨ Features
OAuth2/PKCE authentication via Keycloak, enforced at the API Gateway
Auto user-sync — new Keycloak users are transparently registered into the User Service on their first authenticated request
Activity logging (running, cycling, swimming, yoga, HIIT, and more) with support for custom metrics
AI-powered recommendations — every logged activity is analyzed by Gemini to generate personalized feedback and suggestions
Event-driven pipeline — activities are published to Kafka and consumed asynchronously by the Recommendation Service, keeping activity logging fast and decoupled from AI processing
Service discovery with Netflix Eureka
Centralized configuration via Spring Cloud Config Server
Secured inter-service identity propagation — the Gateway resolves the caller's identity from the JWT and forwards it downstream via the X-UserKeycloak-ID header, so internal services never trust a client-supplied user ID

## 🏗️ Architecture

```text
Client
  │
  ▼
API Gateway (8080) ──── Keycloak
  │                     (JWT validation + OAuth2/PKCE)
  │
  ├──▶ User Service (8081) ──▶ PostgreSQL
  │
  ├──▶ Activity Service (8082) ──▶ MongoDB
  │        │
  │        └──▶ Kafka (activity-events)
  │                  │
  │                  ▼
  └──▶ Recommendation Service (8083) ──▶ MongoDB
                     │
                     └──▶ Gemini API

Config Server (8888) ──▶ Centralized configuration
Eureka Server (8761)  ──▶ Service discovery
```

## 🧩 Services

| Service                    |   Port | Responsibility                                                 |
| -------------------------- | -----: | -------------------------------------------------------------- |
| **Eureka Server**          | `8761` | Service discovery and registration                             |
| **Config Server**          | `8888` | Centralized configuration for services                         |
| **API Gateway**            | `8080` | Entry point, authentication, routing, and identity propagation |
| **User Service**           | `8081` | User registration, lookup, and validation                      |
| **Activity Service**       | `8082` | Activity management and Kafka event publishing                 |
| **Recommendation Service** | `8083` | Processes activity events and generates AI recommendations     |

## 🛠️ Tech Stack

* **Language:** Java
* **Framework:** Spring Boot, Spring Cloud
* **API Gateway:** Spring Cloud Gateway
* **Service Discovery:** Netflix Eureka
* **Configuration:** Spring Cloud Config Server
* **Authentication:** Keycloak, OAuth2, PKCE, JWT
* **Messaging:** Apache Kafka
* **Databases:** MongoDB, PostgreSQL
* **AI:** Google Gemini API
* **Build Tool:** Maven

## 🔄 How It Works

1. The client authenticates through **Keycloak** and sends requests through the **API Gateway**.
2. The **API Gateway** validates the JWT and forwards the authenticated user's identity to downstream services using the `X-UserKeycloak-ID` header.
3. The **Activity Service** validates the user, stores the activity in MongoDB, and publishes an activity event to Kafka.
4. The **Recommendation Service** consumes the activity event and uses the **Gemini API** to generate a recommendation.
5. The generated recommendation is stored in MongoDB.
6. Clients can retrieve recommendations through the API Gateway.

## 🚀 Getting Started

### Prerequisites

* Java 17+
* Maven
* MongoDB Atlas or local MongoDB
* PostgreSQL
* Apache Kafka
* Keycloak
* Google Gemini API key

### Running via Docker

Kafka and Keycloak are expected to be available on the following ports:

| Service      |   Port | Used By                                  |
| ------------ | -----: | ---------------------------------------- |
| **Kafka**    | `9092` | Activity Service, Recommendation Service |
| **Keycloak** | `8181` | API Gateway                              |

Make sure these services are running and accessible before starting the Spring Boot services.

### Run Order

Start the services in the following order:

1. **Config Server** (`configserver`) — `8888`
2. **Eureka Server** (`eureka`) — `8761`
3. **User Service** (`userservice`) — `8081`
4. **Activity Service** (`activityservice`) — `8082`
5. **Recommendation Service** (`recommendationservice`) — `8083`
6. **API Gateway** (`gateway`) — `8080`

Each service can be started using:

```bash
cd <service-directory>
./mvnw spring-boot:run
```

### Configuration

Service configuration is maintained centrally in:

```text
configserver/src/main/resources/config/
```

Sensitive values should be provided through environment variables rather than committed to the repository.

| Environment Variable | Used In                                  | Description               |
| -------------------- | ---------------------------------------- | ------------------------- |
| `DB_URL`             | User Service                             | PostgreSQL connection URL |
| `DB_USER`            | User Service                             | PostgreSQL username       |
| `DB_PSWD`            | User Service                             | PostgreSQL password       |
| `Mongo_DB`           | Activity Service, Recommendation Service | MongoDB connection URI    |
| `Gemini_URL`         | Recommendation Service                   | Gemini API endpoint       |
| `Gemini_Key`         | Recommendation Service                   | Gemini API key            |

These variables can be configured through the shell, IDE run configuration, or a git-ignored `.env` file.

## 📡 API Endpoints

All endpoints are accessed through the API Gateway.

| Method | Endpoint                                     | Description                        |
| ------ | -------------------------------------------- | ---------------------------------- |
| `POST` | `/api/users/register`                        | Register a new user                |
| `GET`  | `/api/users/{userId}`                        | Get a user by ID                   |
| `GET`  | `/api/users/{userId}/validate`               | Validate whether a user exists     |
| `POST` | `/api/activities/add`                        | Log a new activity                 |
| `GET`  | `/api/recommendations/user/{userId}`         | Get recommendations for a user     |
| `GET`  | `/api/recommendations/activity/{activityId}` | Get recommendation for an activity |
