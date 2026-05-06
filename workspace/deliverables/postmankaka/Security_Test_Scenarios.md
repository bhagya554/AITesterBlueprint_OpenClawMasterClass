# Security Test Scenarios — app.vwo.com API & Web

**Agent:** PostmanKaka 📮  
**Scope:** OWASP Top 10, auth, input validation, data leakage

---

## 1. Authentication & Authorization

| ID | Scenario | Test | Expected |
|---|---|---|---|
| SEC-AUTH-01 | Brute force login | 100 rapid login attempts | Rate limit triggers (429) / account lockout |
| SEC-AUTH-02 | Credential stuffing | Common password list | Blocked by rate limit / CAPTCHA |
| SEC-AUTH-03 | JWT weak signing | Algorithm confusion attack | `alg: none` rejected |
| SEC-AUTH-04 | Token replay | Reuse token after logout | Token blacklisted / 401 |
| SEC-AUTH-05 | Session fixation | Login without new session ID | New session issued post-auth |

---

## 2. Input Validation

| ID | Scenario | Payload | Expected |
|---|---|---|---|
| SEC-INP-01 | SQL Injection | `q=' UNION SELECT * FROM users --` | Sanitized / 400. No data leak. |
| SEC-INP-02 | NoSQL Injection | `{"$ne": null}` in filter | Rejected / 400 |
| SEC-INP-03 | Command Injection | `url=https://ex.com;cat /etc/passwd` | Rejected / 400 |
| SEC-INP-04 | Path Traversal | `../etc/passwd` in file param | Rejected / 400 |
| SEC-INP-05 | XSS Stored | `<script>alert(1)</script>` in campaign name | Escaped / stripped. No execution. |
| SEC-INP-06 | HTML Injection | `<img src=x onerror=alert(1)>` | Sanitized |
| SEC-INP-07 | SSRF | `url=file:///etc/passwd` | Blocked. Only http/https allowed. |

---

## 3. Data Exposure

| ID | Scenario | Test | Expected |
|---|---|---|---|
| SEC-DAT-01 | IDOR | Access `/campaigns/OTHER_USER_ID` | 403 / 404 |
| SEC-DAT-02 | Mass assignment | `PUT /users/me {role: "admin"}` | 400 / field ignored |
| SEC-DAT-03 | Verbose errors | Trigger 500 with bad input | Generic message. No stack trace. |
| SEC-DAT-04 | API over-fetching | `GET /users` returns passwords | Password hash never returned |
| SEC-DAT-05 | Log leakage | Check server logs for PII | Email masked, tokens redacted |

---

## 4. Transport & Headers

| ID | Scenario | Test | Expected |
|---|---|---|---|
| SEC-TRN-01 | HTTP access | `curl http://app.vwo.com` | 301 redirect to HTTPS |
| SEC-TRN-02 | HSTS | Check `Strict-Transport-Security` | Present, max-age ≥1 year |
| SEC-TRN-03 | TLS version | SSL Labs scan | TLS 1.2+ only |
| SEC-TRN-04 | CORS misconfig | `Origin: https://evil.com` | Not reflected. No `*`. |
| SEC-TRN-05 | Security headers | SecurityHeaders.io scan | X-Frame-Options, CSP, X-Content-Type-Options |

---

## 5. File Upload (if applicable)

| ID | Scenario | Test | Expected |
|---|---|---|---|
| SEC-FIL-01 | Malicious file | Upload `.php` as `.jpg` | MIME type validated. Blocked. |
| SEC-FIL-02 | Oversized file | Upload 100MB image | 413 Payload Too Large |
| SEC-FIL-03 | SVG with script | Upload SVG with XSS | Sanitized / blocked |

---

## 6. Tools

- **Burp Suite:** Manual + automated scanning
- **OWASP ZAP:** CI-integrated baseline scan
- **Postman:** Security collection (see `SecurityAPITest.java`)
- **SSL Labs:** TLS configuration
- **SecurityHeaders.io:** Header audit

---

## 7. Sign-Off Checklist

- [ ] All P0 auth scenarios pass
- [ ] Rate limiting confirmed on login
- [ ] No SQL injection vectors found
- [ ] XSS payloads sanitized
- [ ] IDOR prevented
- [ ] HTTPS enforced
- [ ] Security headers present
- [ ] OWASP ZAP baseline: 0 High / 0 Medium

📮 *PostmanKaka: "Trust but verify. Then verify again."*
