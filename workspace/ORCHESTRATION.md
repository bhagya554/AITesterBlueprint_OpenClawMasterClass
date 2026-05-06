# Testing Family - Orchestration Guide

## Family Members
1. **RamuKaka** (🤖) - Manager/Orchestrator
2. **GanguBhai** (🕸️) - Web Tester
3. **Chotu** (📱) - Mobile Tester
4. **Munna** (⚡) - Performance Tester
5. **PostmanKaka** (📮) - API Tester

## How Task Distribution Works

### Step 1: Receive Project
When Bhagya gives a project URL (e.g., `app.vwo.com`):
1. RamuKaka identifies the project
2. Analyzes what needs testing
3. Creates tasks for each family member

### Step 2: Task Assignment
```
RamuKaka → "Family, we have a new project: app.vwo.com"

GanguBhai → Creates Web Test Plan
  - UI/UX testing
  - Form validation
  - Navigation flows
  - Cross-browser testing
  - Responsive design

Chotu → Creates Mobile Test Plan
  - Mobile responsiveness
  - Touch interactions
  - Device compatibility
  - Mobile-specific features

Munna → Creates Performance Test Plan
  - Load testing scenarios
  - Response time benchmarks
  - Stress testing limits
  - Resource utilization

PostmanKaka → Creates API Test Plan
  - Endpoint discovery
  - Request/response validation
  - Authentication testing
  - Rate limiting checks
```

### Step 3: Execution & Feedback
- Each agent works independently on their test plan
- Agents communicate status updates via the activity feed
- Cross-agent feedback when issues are found
- RamuKaka monitors overall progress

### Step 4: Reporting
- Individual test reports from each agent
- Consolidated summary by RamuKaka
- Action items and recommendations

## Communication Protocol

### Agent-to-Agent Messages
Agents can send messages to each other:
- GanguBhai finds an API issue → Alerts PostmanKaka
- Munna finds slow page → Alerts GanguBhai to investigate
- Chotu finds mobile bug → Alerts team about responsive issue

### Status Updates
Each agent updates their status:
- `active` - Ready for work
- `busy` - Working on task
- `offline` - Not available

### Activity Feed
All actions are logged to the Live Activity Feed:
- Agent deployments
- Test execution status
- Bug discoveries
- Inter-agent communications

## Using the Dashboard

### View Dashboard
The dashboard is available as a hosted embed in OpenClaw webchat.

### Start a Test Project
Call the coordination function with project URL:
```javascript
coordinateTest("https://app.vwo.com")
```

### Deploy Individual Agents
Click "Deploy" on any agent card to activate them.

### View Logs
Click "Logs" to see detailed activity for each agent.

## Agent Identity Files
Each agent has their own profile in the `agents/` directory:
- `agents/GanguBhai.md` - Web tester identity
- `agents/Chotu.md` - Mobile tester identity
- `agents/Munna.md` - Performance tester identity
- `agents/PostmanKaka.md` - API tester identity

## Memory Management
- Each agent maintains their own memory
- Daily logs in `memory/YYYY-MM-DD.md`
- Test results and findings stored per agent
- Cross-agent learnings shared via communication channel

---
_Built with love for Bhagya's 24x7 testing needs._
