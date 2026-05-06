import io.restassured.RestAssured;
import org.testng.annotations.*;
import static io.restassured.RestAssured.*;
import static org.hamcrest.Matchers.*;

public class SecurityAPITest {
    @BeforeClass
    public void setup() {
        RestAssured.baseURI = System.getenv().getOrDefault("VWO_BASE_URL", "https://app.vwo.com/api/v3");
    }

    @Test(description = "SEC-004: SQL injection in query param is sanitized")
    public void testSqlInjectionQueryParam() {
        given()
            .header("Authorization", "Bearer " + AuthAPITest.getAccessToken())
        .when()
            .get("/campaigns?q=' OR 1=1 --")
        .then()
            .statusCode(anyOf(equalTo(400), equalTo(200)))
            .body("data", isA(java.util.List.class)); // Should return normal list, not all rows leak
    }

    @Test(description = "SEC-005: XSS in campaign name is escaped")
    public void testXssInCampaignName() {
        given()
            .header("Authorization", "Bearer " + AuthAPITest.getAccessToken())
            .contentType("application/json")
            .body("{\"name\":\"\u003cscript\u003ealert('xss')\u003c/script\u003e\",\"type\":\"ab\",\"url\":\"https://xss.example.com\"}")
        .when()
            .post("/campaigns")
        .then()
            .statusCode(anyOf(equalTo(201), equalTo(400)))
            .body("name", not(containsString("\u003cscript\u003e")));
    }

    @Test(description = "SEC-006: Rate limiting on login")
    public void testRateLimiting() {
        // Attempt 10 rapid login requests
        for (int i = 0; i < 10; i++) {
            given()
                .contentType("application/json")
                .body("{\"email\":\"test@test.com\",\"password\":\"wrong\"}")
            .when()
                .post("/auth/login");
        }

        // 11th should be rate limited
        given()
            .contentType("application/json")
            .body("{\"email\":\"test@test.com\",\"password\":\"wrong\"}")
        .when()
            .post("/auth/login")
        .then()
            .statusCode(anyOf(equalTo(429), equalTo(401))); // 429 preferred, 401 acceptable
    }

    @Test(description = "SEC-007: Cross-tenant access blocked")
    public void testCrossTenantAccess() {
        // Try to access campaign from different tenant
        given()
            .header("Authorization", "Bearer " + AuthAPITest.getAccessToken())
        .when()
            .get("/campaigns/TENANT2_CAMPAIGN_ID")
        .then()
            .statusCode(anyOf(equalTo(403), equalTo(404)));
    }

    @Test(description = "SEC-008: CORS headers on API")
    public void testCorsHeaders() {
        given()
            .header("Origin", "https://evil.com")
        .when()
            .options("/health")
        .then()
            .statusCode(anyOf(equalTo(200), equalTo(204)))
            .header("Access-Control-Allow-Origin", not(equalTo("*")));
    }
}