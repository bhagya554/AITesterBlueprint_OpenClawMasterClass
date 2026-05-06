import io.restassured.RestAssured;
import org.testng.annotations.*;
import static io.restassured.RestAssured.*;
import static org.hamcrest.Matchers.*;

public class ReportAPITest {
    @BeforeClass
    public void setup() {
        RestAssured.baseURI = System.getenv().getOrDefault("VWO_BASE_URL", "https://app.vwo.com/api/v3");
    }

    @Test(description = "REPT-001: Campaign report returns data")
    public void testCampaignReport() {
        // Using a known seeded campaign ID
        String seededCampaignId = System.getenv("SEED_CAMPAIGN_ID");

        given()
            .header("Authorization", "Bearer " + AuthAPITest.getAccessToken())
            .queryParam("startDate", "2026-01-01")
            .queryParam("endDate", "2026-05-06")
        .when()
            .get("/campaigns/" + seededCampaignId + "/reports")
        .then()
            .statusCode(200)
            .body("campaignId", equalTo(seededCampaignId))
            .body("visitors", greaterThanOrEqualTo(0))
            .body("conversions", greaterThanOrEqualTo(0))
            .body("conversionRate", isA(Float.class))
            .body("variants", isA(java.util.List.class));
    }

    @Test(description = "REPT-002: Report with invalid date range = 400")
    public void testInvalidDateRange() {
        String seededCampaignId = System.getenv("SEED_CAMPAIGN_ID");

        given()
            .header("Authorization", "Bearer " + AuthAPITest.getAccessToken())
            .queryParam("startDate", "2026-05-06")
            .queryParam("endDate", "2026-01-01")
        .when()
            .get("/campaigns/" + seededCampaignId + "/reports")
        .then()
            .statusCode(400)
            .body("error", containsString("Invalid date range"));
    }

    @Test(description = "REPT-003: Export CSV returns file")
    public void testExportCSV() {
        String seededCampaignId = System.getenv("SEED_CAMPAIGN_ID");

        given()
            .header("Authorization", "Bearer " + AuthAPITest.getAccessToken())
            .accept("text/csv")
        .when()
            .get("/campaigns/" + seededCampaignId + "/reports/export?format=csv")
        .then()
            .statusCode(200)
            .contentType("text/csv")
            .header("Content-Disposition", containsString("attachment"));
    }
}