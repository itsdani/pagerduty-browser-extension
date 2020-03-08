const POLL_INTERVAL_IN_SECONDS = 15;
const NOTIFICATION_TIMEOUT_IN_SECONDS = 4;
const ON_CLICK_STATUSES = ['triggered', 'acknowledged'];
const POLL_PARAMS = {
  statuses: ['triggered', 'acknowledged'],
  urgencies: ['high', 'low'],
  teamIds
}

const pdapi = new PagerDutyAPI(pagerDutyApiKey);
const pdClient = new PagerDutyClient(pdapi);
const incidentBadge = new IncidentBadge();
const incidentNotification = new IncidentNotification();


var knownIncidentIdsState = new Set();

const openPagerDutyWebsite = ({ account, statuses }) => () => {
  statusesParams = '?status=' + statuses.join(',');
  const url = 'https://' + account + '.pagerduty.com/incidents' + statusesParams;
  browser.tabs.create({ url });
}

const categorizeIncidentIds = (knownIncidentIds) => (incidents) => ({
  incidents,
  newIncidents: new Set([...incidents].filter(incident => !knownIncidentIds.has(incident.id))),
  knownIncidentIds: new Set(incidents.map(incident => incident.id))
})

const pollIncidentsAndShowThem = (pollParams) => () =>
  pdClient.pollNewIncidents(pollParams)
    .then(tap(incidentBadge.updateBadge))
    .then(categorizeIncidentIds(knownIncidentIdsState))
    .then(tap(updateKnownIncidents))
    .then(tap(incidentNotification.showNotificationsForNewIncidents))

const updateKnownIncidents = ({ knownIncidentIds }) => {
  knownIncidentIdsState = knownIncidentIds;
}

const tap = (fn) => (data) => {
  fn(data);
  return data;
}

function logJson(data) {
  console.log(JSON.stringify(data));
}

setInterval(pollIncidentsAndShowThem(POLL_PARAMS), POLL_INTERVAL_IN_SECONDS * 1000);
setTimeout(pollIncidentsAndShowThem(POLL_PARAMS), 100);
browser.browserAction.onClicked.addListener(openPagerDutyWebsite({ account, statuses: ON_CLICK_STATUSES }));
