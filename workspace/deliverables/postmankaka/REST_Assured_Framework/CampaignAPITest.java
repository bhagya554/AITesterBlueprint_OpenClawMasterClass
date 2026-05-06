import io.restassured.RestAssured;
import io.restassured.response.Response;
import org.testng.annotations.*;
import static io.restassured.RestAssured.*;
import static org.hamcrest.Matchers.*;

public class CampaignAPITest {
    private String campaignId;

    @BeforeClass
    public void setup() {
        RestAssured.baseURI = System.getenv().getOrDefault("VWO_BASE_URL", "https://app.vwo.com/api/v3");
    }

    @Test(priority = 1, description = "CAMP-001: Create campaign")
    public void testCreateCampaign() {
        Response res = given()
            .header("Authorization", "Bearer " + AuthAPITest.getAccessToken())
            .contentType("application/json")
            .body("{\"name\":\"REST Test Campaign\",\"type\":\"ab\",\"url\":\"https://rest.example.com\"}")
        .when()
            .post("/campaigns")
        .then()
            .statusCode(201)
            .body("id", notNullValue())
            .body("name", equalTo("REST Test Campaign"))
            .body("status", equalTo("draft"))
            .body("createdAt", notNullValue())
            .extract().response();

        campaignId = res.jsonPath().getString("id");
    }

    @Test(priority = 2, description = "CAMP-002: List campaigns with pagination")
    public void testListCampaigns() {
        given()
            .header("Authorization", "Bearer " + AuthAPITest.getAccessToken())
        .when()
            .get("/campaigns?page=1&limit=10")
        .then()
            .statusCode(200)
            .body("data", isA(java.util.List.class))
            .body("meta.total", greaterThanOrEqualTo(0))
            .body("meta.page", equalTo(1))
            .body("meta.limit", equalTo(10));
    }

    @Test(priority = 3, description = "CAMP-003: Update campaign")
    public void testUpdateCampaign() {
        given()
            .header("Authorization", "Bearer " + AuthAPITest.getAccessToken())
            .contentType("application/json")
            .body("{\"name\":\"Updated Campaign Name\",\"status\":\"paused\"}")
        .when()
            .put("/campaigns/" + campaignId)
        .then()
            .statusCode(200)
            .body("name", equalTo("Updated Campaign Name"))
            .body("status", equalTo("paused"));
    }

    @Test(priority = 4, description = "CAMP-004: Get campaign by ID")
    public void testGetCampaign() {
        given()
            .header("Authorization", "Bearer " + AuthAPITest.getAccessToken())
        .when()
            .get("/campaigns/" + campaignId)
        .then()
            .statusCode(200)
            .body("id", equalTo(campaignId))
            .body("name", equalTo("Updated Campaign Name"));
    }

    @Test(priority = 5, description = "CAMP-005: Delete campaign")
    public void testDeleteCampaign() {
        given()
            .header("Authorization", "Bearer " + AuthAPITest.getAccessToken())
        .when()
            .delete("/campaigns/" + campaignId)
        .then()
            .statusCode(204);
    }

    @Test(priority = 6, description = "CAMP-006: Verify deleted campaign returns 404")
    public void testVerifyDeleted() {
        given()
            .header("Authorization", "Bearer " + AuthAPITest.getAccessToken())
        .when()
            .get("/campaigns/" + campaignId)
        .then()
            .statusCode(404)
            .body("error", containsString("not found"));
    }

    @Test(description = "VAL-001: Invalid payload returns 400")
    public void testInvalidPayload() {
        given()
            .header("Authorization", "Bearer " + AuthAPITest.getAccessToken())
            .contentType("application/json")
            .body("{\"name\":\"\",\"type\":\"invalid_type\"}")
        .when()
            .post("/campaigns")
        .then()
            .statusCode(400)
            .body("errors", isA(java.util.List.class));
    }
}