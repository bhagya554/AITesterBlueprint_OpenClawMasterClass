// Agent Orchestrator - Handles real deployments
const fs = require('fs');
const path = require('path');

const STATE_FILE = path.join(__dirname, 'dashboard-state.json');
const TRIGGER_FILE = path.join(__dirname, 'deploy-trigger.json');

function readState() {
    try {
        return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
    } catch (e) {
        return null;
    }
}

function writeState(state) {
    fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

function readTrigger() {
    try {
        return JSON.parse(fs.readFileSync(TRIGGER_FILE, 'utf8'));
    } catch (e) {
        return { agent: '', status: 'idle' };
    }
}

function clearTrigger() {
    fs.writeFileSync(TRIGGER_FILE, JSON.stringify({ agent: '', projectUrl: '', timestamp: 0, status: 'idle' }, null, 2));
}

function updateAgentStatus(agentId, status, task, metrics = {}) {
    const state = readState();
    if (!state || !state.agents[agentId]) return;
    
    state.agents[agentId].status = status;
    state.agents[agentId].task = task;
    
    Object.keys(metrics).forEach(key => {
        state.agents[agentId][key] = metrics[key];
    });
    
    state.lastUpdated = new Date().toISOString();
    writeState(state);
}

function addActivity(agent, icon, message, type = '') {
    const state = readState();
    if (!state) return;
    
    const now = new Date();
    const time = now.toTimeString().split(' ')[0];
    
    state.activityFeed.unshift({
        agent,
        icon,
        message,
        time,
        timestamp: Date.now(),
        type
    });
    
    // Keep only last 50 activities
    if (state.activityFeed.length > 50) {
        state.activityFeed = state.activityFeed.slice(0, 50);
    }
    
    state.lastUpdated = now.toISOString();
    writeState(state);
}

function addCommunication(sender, message, type = '') {
    const state = readState();
    if (!state) return;
    
    const now = new Date();
    const time = now.toTimeString().split(' ')[0];
    
    state.communicationLog.push({
        sender,
        message,
        time,
        type
    });
    
    // Keep only last 100 messages
    if (state.communicationLog.length > 100) {
        state.communicationLog = state.communicationLog.slice(-100);
    }
    
    state.lastUpdated = now.toISOString();
    writeState(state);
}

function addCrossAgentAlert(from, to, message, type = '') {
    const state = readState();
    if (!state) return;
    
    const now = new Date();
    const time = now.toTimeString().split(' ')[0];
    
    state.crossAgentAlerts.push({
        from,
        to,
        message,
        time,
        type
    });
    
    // Keep only last 20 alerts
    if (state.crossAgentAlerts.length > 20) {
        state.crossAgentAlerts = state.crossAgentAlerts.slice(-20);
    }
    
    state.lastUpdated = now.toISOString();
    writeState(state);
}

function appendAgentLog(agentId, log) {
    const state = readState();
    if (!state || !state.agents[agentId]) return;
    
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
    state.agents[agentId].logs.push(`[${timestamp}] ${log}`);
    
    // Keep only last 100 logs
    if (state.agents[agentId].logs.length > 100) {
        state.agents[agentId].logs = state.agents[agentId].logs.slice(-100);
    }
    
    state.lastUpdated = new Date().toISOString();
    writeState(state);
}

// Export for use by subagents or main session
module.exports = {
    readState,
    writeState,
    readTrigger,
    clearTrigger,
    updateAgentStatus,
    addActivity,
    addCommunication,
    addCrossAgentAlert,
    appendAgentLog
};

// If run directly, show status
if (require.main === module) {
    const state = readState();
    console.log('Dashboard State Manager');
    console.log('Last updated:', state ? state.lastUpdated : 'No state file');
    console.log('Agents:', state ? Object.keys(state.agents).join(', ') : 'None');
}
