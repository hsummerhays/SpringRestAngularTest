# Spring Boot 4 REST Project

This project is initialized with:
- **Spring Boot 4.0.5**
- **Java 17**
- **Gradle 9.1.0**

## Project Structure
- `src/main/java/com/example/rest/RestApplication.java`: Main entry point.
- `src/main/java/com/example/rest/controller/HelloController.java`: A basic REST controller with a `/hello` endpoint.
- `build.gradle`: Project dependencies and configuration.

## How to Run
Since Gradle was not found in the environment, you should initialize the Gradle wrapper first:
1. Install Gradle 9.1 (if not already installed).
2. Run the following command in the project root:
   ```bash
   gradle wrapper --gradle-version 9.1
   ```
3. Once initialized, you can run the application with:
   ```bash
   ./gradlew bootRun
   ```

## Endpoint
- `GET http://localhost:8080/hello`
