import org.testng.ITestResult;
import org.testng.annotations.*;
import io.qameta.allure.*;

@Listeners({ io.qameta.allure.testng.AllureTestNg.class })
public class BaseAPITest {
    
    @BeforeSuite
    public void globalSetup() {
        System.out.println("📮 PostmanKaka REST Assured Framework initialized");
        System.out.println("Base URL: " + System.getenv().getOrDefault("VWO_BASE_URL", "https://app.vwo.com/api/v3"));
    }

    @AfterMethod
    public void logResult(ITestResult result) {
        if (result.getStatus() == ITestResult.FAILURE) {
            System.err.println("❌ FAILED: " + result.getName() + " - " + result.getThrowable().getMessage());
        } else if (result.getStatus() == ITestResult.SUCCESS) {
            System.out.println("✅ PASSED: " + result.getName());
        }
    }
}