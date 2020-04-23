const POLL_INTERVAL_IN_SECONDS = 15;
const NOTIFICATION_TIMEOUT_IN_SECONDS = 4;
const ON_CLICK_STATUSES = ['triggered', 'acknowledged'];
const POLL_PARAMS = {
  statuses: ['triggered', 'acknowledged'],
  urgencies: ['high', 'low'],
  teamIds
}

const crossplatform = new CrossBrowserApi();

const pdapi = new PagerDutyAPI(pagerDutyApiKey);
const pdClient = new PagerDutyClient(pdapi);
const incidentBadge = new IncidentBadge(crossplatform);
const incidentNotification = new IncidentNotification(crossplatform);

var state = {
  userId,
  account
};
var knownIncidentIdsState = new Set();

const openPagerDutyWebsite = ({ account, statuses }) => () => {
  statusesParams = '?status=' + statuses.join(',');
  const url = 'https://' + account + '.pagerduty.com/incidents' + statusesParams;
  crossplatform.tabs.create({ url });
}

const categorizeIncidentIds = (knownIncidentIds) => (incidents) => ({
  incidents,
  newIncidents: new Set([...incidents].filter(incident => !knownIncidentIds.has(incident.id))),
  knownIncidentIds: new Set(incidents.map(incident => incident.id))
})

const pollIncidentsAndShowThem = (pollParams) => async () =>
  pdClient.pollNewIncidents(pollParams)
    .then(tap(incidentBadge.updateBadge))
    .then(categorizeIncidentIds(knownIncidentIdsState))
    .then(tap(updateKnownIncidents))
    .then(tap(updateState))
    .then(tap(incidentNotification.showNotificationsForNewIncidents))

const updateKnownIncidents = ({ knownIncidentIds }) => {
  knownIncidentIdsState = knownIncidentIds;
}

const updateState = ({ incidents }) => {
  state = { ...state, incidents }
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

setInterval(pollIncidentsAndShowThem(POLL_PARAMS), POLL_INTERVAL_IN_SECONDS * 1000);
setTimeout(pollIncidentsAndShowThem(POLL_PARAMS), 400);
