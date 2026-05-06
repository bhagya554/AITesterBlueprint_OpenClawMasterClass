# JMeter Test Plans

**Agent:** Munna ⚡  
**Tool:** Apache JMeter 5.6+  
**Use Case:** Complex business flows, legacy integration, non-HTTP protocols

---

## Structure

```
JMeter_Test_Plans/
├── VWO_Smoke_Test.jmx         # Thread group: 1 user, basic flow
├── VWO_Load_Test.jmx          # Thread group: 500 users, ramp 60s
├── VWO_Stress_Test.jmx        # Thread group: 2000 users, ramp 300s
├── VWO_Endurance_Test.jmx     # Thread group: 200 users, 4 hours
├── data/
│   ├── users.csv              # Test user credentials
│   └── campaigns.csv          # Campaign IDs for dynamic testing
└── README.md                  # This file
```

---

## Setup

```bash
# Download JMeter
wget https://dlcdn.apache.org//jmeter/binaries/apache-jmeter-5.6.3.tgz
tar -xzf apache-jmeter-5.6.3.tgz
cd apache-jmeter-5.6.3/bin

# Run GUI (for editing)
./jmeter.sh

# Run headless (for CI)
./jmeter.sh -n -t ../test-plans/VWO_Load_Test.jmx -l results.jtl -e -o report/
```

## Test Plan Structure (VWO_Load_Test.jmx)

```xml
<!-- Excerpt: Thread Group Configuration -->
<math.maxThreads>500</math.maxThreads>
<math.rampTime>60</math.rampTime>
<math.duration>600</math.duration>

<!-- HTTP Request Defaults -->
<HTTPSamplerProxy guiclass="HttpTestSampleGui" testname="Health Check">
  <elementProp name="HTTPsampler.Arguments" elementType="Arguments">
    <collectionProp name="Arguments.arguments"/>
  </elementProp>
  <stringProp name="HTTPSampler.domain">app.vwo.com</stringProp>
  <stringProp name="HTTPSampler.port">443</stringProp>
  <stringProp name="HTTPSampler.protocol">https</stringProp>
  <stringProp name="HTTPSampler.path">/api/v3/health</stringProp>
  <stringProp name="HTTPSampler.method">GET</stringProp>
</HTTPSamplerProxy>

<!-- CSV Data Set Config for dynamic users -->
<CSVDataSet guiclass="TestBeanGUI" testname="User Credentials">
  <stringProp name="filename">data/users.csv</stringProp>
  <stringProp name="variableNames">email,password</stringProp>
  <stringProp name="delimiter">,</stringProp>
  <stringProp name="recycle">true</stringProp>
</CSVDataSet>

<!-- Assertions -->
<ResponseAssertion guiclass="AssertionGui" testname="Status 200">
  <collectionProp name="Asserion.test_strings">
    <stringProp>200</stringProp>
  </collectionProp>
  <stringProp name="Assertion.test_field">Assertion.response_code</stringProp>
</ResponseAssertion>
```

## Run in CI

```bash
# GitHub Actions / Jenkins
jmeter -n -t VWO_Load_Test.jmx \
  -JVWO_BASE_URL=https://staging-app.vwo.com \
  -JVWO_USERS=500 \
  -JVWO_RAMP=60 \
  -l results.jtl \
  -e -o report/
```

## When to Use JMeter vs K6

| Scenario | Tool | Reason |
|---|---|---|
| Simple HTTP load | K6 | Faster, code-as-config, modern |
| Complex business flow with conditionals | JMeter | GUI-based logic, timers, controllers |
| Non-HTTP (JDBC, JMS, FTP) | JMeter | Native protocol support |
| Browser Core Web Vitals | K6 | Native browser module |
| Team prefers GUI | JMeter | Visual test building |

---

## Data Files

### data/users.csv
```
email,password
api-test1@vwo.internal,TestPass1!
api-test2@vwo.internal,TestPass2!
api-test3@vwo.internal,TestPass3!
```

---

⚡ *Munna: "JMeter for the complex stuff. k6 for the daily runs."*
