# REST Assured Framework

**Agent:** PostmanKaka 📮  
**Framework:** REST Assured + TestNG + Allure  
**Language:** Java 17  

---

## Structure

```
REST_Assured_Framework/
├── pom.xml                    # Maven dependencies
├── BaseAPITest.java           # Suite setup, Allure listeners
├── AuthAPITest.java           # Login, refresh, token validation
├── CampaignAPITest.java       # Campaign CRUD + validation
├── ReportAPITest.java         # Report data + export
├── SecurityAPITest.java       # SQLi, XSS, rate limit, CORS, tenant isolation
└── README.md                  # This file
```

---

## Dependencies (pom.xml)

```xml
<dependencies>
    <dependency>
        <groupId>io.rest-assured</groupId>
        <artifactId>rest-assured</artifactId>
        <version>5.4.0</version>
    </dependency>
    <dependency>
        <groupId>org.testng</groupId>
        <artifactId>testng</artifactId>
        <version>7.9.0</version>
    </dependency>
    <dependency>
        <groupId>io.qameta.allure</groupId>
        <artifactId>allure-testng</artifactId>
        <version>2.25.0</version>
    </dependency>
</dependencies>
```

## Run

```bash
mvn clean test

# With env
VWO_BASE_URL=https://staging-app.vwo.com/api/v3 \
VWO_EMAIL=test@vwo.internal \
VWO_PASSWORD=TestPass123! \
mvn clean test

# Allure report
mvn allure:serve
```

## CI Integration

```yaml
# .github/workflows/api-tests.yml (excerpt)
- name: Run API Tests
  run: mvn clean test
  env:
    VWO_BASE_URL: ${{ secrets.VWO_STAGING_URL }}
    VWO_EMAIL: ${{ secrets.VWO_TEST_EMAIL }}
    VWO_PASSWORD: ${{ secrets.VWO_TEST_PASSWORD }}
```

---

## Coverage

| Test Class | Cases | Focus |
|---|---|---|
| AuthAPITest | 6 | Token lifecycle, auth enforcement |
| CampaignAPITest | 6 | CRUD, pagination, validation |
| ReportAPITest | 3 | Data accuracy, export, date ranges |
| SecurityAPITest | 5 | SQLi, XSS, rate limit, CORS, tenant isolation |
| **Total** | **20** | |

📮 *PostmanKaka: "Auth first. Always."*
