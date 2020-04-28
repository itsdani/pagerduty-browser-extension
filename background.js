var state = {
  settings: { }
};

const POLL_INTERVAL_IN_SECONDS = 15;
const NOTIFICATION_TIMEOUT_IN_SECONDS = 4;
const ON_CLICK_STATUSES = ['triggered', 'acknowledged'];
const POLL_PARAMS = () => {
  return {
    statuses: ['triggered', 'acknowledged'],
    urgencies: ['high', 'low'],
    teamIds: state.settings.teamIds
  }
}

const crossplatform = new CrossBrowserApi();

const pdapi = new PagerDutyAPI(state.settings.pdApiKey);
const pdClient = new PagerDutyClient(pdapi);
const incidentBadge = new IncidentBadge(crossplatform);
const incidentNotification = new IncidentNotification(crossplatform);

var knownIncidentIdsState = new Set();

const categorizeIncidentIds = (knownIncidentIds) => (incidents) => ({
  incidents,
  newIncidents: new Set([...incidents].filter(incident => !knownIncidentIds.has(incident.id))),
  knownIncidentIds: new Set(incidents.map(incident => incident.id))
})

const pollIncidentsAndShowThem = (pollParams) =>
  pdClient.pollNewIncidents(pollParams)
    .then(tap(incidentBadge.updateBadge))
    .then(categorizeIncidentIds(knownIncidentIdsState))
    .then(tap(updateKnownIncidents))
    .then(tap(updateIncidentsInState))
    .then(tap(incidentNotification.showNotificationsForNewIncidents))

const updateKnownIncidents = ({ knownIncidentIds }) => {
  knownIncidentIdsState = knownIncidentIds;
}

const updateIncidentsInState = ({ incidents }) => {
  state = { ...state, incidents };
}

const updateSettingsInState = ({ accountName, userId, teamIds, pdApiKey }) => {
  state = { ...state, settings: { ...state.settings, accountName, userId, teamIds: teamIds.split(','), pdApiKey } }
  return state;
}

function loadSettingsIntoState() {
  return crossplatform.storage.local.get(["accountName", "userId", "teamIds", "pdApiKey"])
    .then(updateSettingsInState);
}

function updateApiKeyInPdClient() {
  return pdapi.setApiKey(state.settings.pdApiKey)
}

function setSettings({ accountName, userId, teamIds, pdApiKey }) {
  return crossplatform.storage.local.set({ accountName, userId, teamIds, pdApiKey });
}

function acknowledgeIncident(incident) {
  return pdClient.acknowledgeIncident(incident).then(
    state.incidents.forEach(stateIncident => {
      if (stateIncident.id == incident.id) {
        stateIncident.status = "acknowledged";
      }
    })
  )
}

function resolveIncident(incident) {
  return pdClient.resolveIncident(incident).then(
    state.incidents.forEach(stateIncident => {
      if (stateIncident.id == incident.id) {
        stateIncident.status = "resolved";
      }
    })
  )
}

loadSettingsIntoState().then(() => updateApiKeyInPdClient());
setInterval(async () => pollIncidentsAndShowThem(POLL_PARAMS()), POLL_INTERVAL_IN_SECONDS * 1000);
setTimeout(async () => pollIncidentsAndShowThem(POLL_PARAMS()), 400);
