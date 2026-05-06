import io.restassured.RestAssured;
import io.restassured.response.Response;
import org.testng.annotations.*;
import static io.restassured.RestAssured.*;
import static org.hamcrest.Matchers.*;

public class AuthAPITest {
    private static String accessToken;
    private static String refreshToken;

    @BeforeClass
    public void setup() {
        RestAssured.baseURI = System.getenv().getOrDefault("VWO_BASE_URL", "https://app.vwo.com/api/v3");
    }

    @Test(priority = 1, description = "AUTH-001: Valid login returns tokens")
    public void testValidLogin() {
        Response res = given()
            .contentType("application/json")
            .body("{\"email\":\"" + System.getenv("VWO_EMAIL") + "\",\"password\":\"" + System.getenv("VWO_PASSWORD") + "\"}")
        .when()
            .post("/auth/login")
        .then()
            .statusCode(200)
            .body("accessToken", notNullValue())
            .body("refreshToken", notNullValue())
            .body("expiresIn", greaterThan(0))
            .extract().response();

        accessToken = res.jsonPath().getString("accessToken");
        refreshToken = res.jsonPath().getString("refreshToken");
    }

    @Test(priority = 2, description = "AUTH-002: Invalid login returns 401")
    public void testInvalidLogin() {
        given()
            .contentType("application/json")
            .body("{\"email\":\"wrong@test.com\",\"password\":\"wrong\"}")
        .when()
            .post("/auth/login")
        .then()
            .statusCode(401)
            .body("error", containsString("Invalid"));
    }

    @Test(priority = 3, description = "AUTH-003: Refresh token gives new access token")
    public void testRefreshToken() {
        given()
            .contentType("application/json")
            .body("{\"refreshToken\":\"" + refreshToken + "\"}")
        .when()
            .post("/auth/refresh")
        .then()
            .statusCode(200)
            .body("accessToken", notNullValue());
    }

    @Test(priority = 4, description = "SEC-001: No auth on protected endpoint = 401")
    public void testNoAuth() {
        when()
            .get("/campaigns")
        .then()
            .statusCode(401)
            .body("error", containsString("Authentication required"));
    }

    @Test(priority = 5, description = "SEC-002: Invalid token = 401")
    public void testInvalidToken() {
        given()
            .header("Authorization", "Bearer invalid_token_12345")
        .when()
            .get("/campaigns")
        .then()
            .statusCode(401)
            .body("error", containsString("Invalid token"));
    }

    @Test(priority = 6, description = "SEC-003: Expired token = 401")
    public void testExpiredToken() {
        // Simulate with known expired token or manipulate JWT expiry
        given()
            .header("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.expired.signature")
        .when()
            .get("/campaigns")
        .then()
            .statusCode(401);
    }

    public static String getAccessToken() {
        return accessToken;
    }
}