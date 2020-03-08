const onClickStatuses = ['triggered', 'acknowledged'];
const pollParams = {
  statuses: ['triggered', 'acknowledged'],
  urgencies: ['high', 'low'],
  teamIds
}

const pollIntervalInSeconds = 15;
const notificationTimeoutInSeconds = 4;
const pdapi = new PagerDutyAPI(pagerDutyApiKey);

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
  pollNewIncidents(pollParams)
    .then(tap(updateBadge))
    .then(categorizeIncidentIds(knownIncidentIdsState))
    .then(tap(updateKnownIncidents))
    .then(tap(showNotificationsForNewIncidents))


const urlArrayParam = (name, values) =>
  values.map(value => name + '[]=' + value)

const pollUrlParameters = ({ statuses, teamIds, urgencies }) => [
  ...urlArrayParam('statuses', statuses),
  ...urlArrayParam('team_ids', teamIds),
  ...urlArrayParam('urgencies', urgencies)
]


function pollNewIncidents(pollParameters) {
  var url = 'https://api.pagerduty.com/incidents?' + pollUrlParameters(pollParameters).join('&');
  return pdapi.GET(url).then((data) => data.incidents);
}

function updateBadge(incidents) {
  const lowCount = incidents.filter(incident => incident.urgency == 'low').length;
  const highCount = incidents.filter(incident => incident.urgency == 'high').length;

  browser.browserAction.setBadgeText({ text: badgeText(lowCount, highCount) });
  browser.browserAction.setBadgeBackgroundColor({ color: badgeBackgroundColor(highCount) });
  browser.browserAction.setBadgeTextColor({ color: 'white' });
}

function badgeText(lowCount, highCount) {
  if (highCount > 0) return highCount.toString();
  return lowCount.toString();
}

function badgeBackgroundColor(highCount) {
  if (highCount > 0) return 'red';
  return 'grey';
}

function showIncidentNotification(incident) {
  browser.notifications.create(incident.id,
    {
      type: "basic",
      title: incident.title,
      message: incident.urgency + ' urgency - assigned to ' + incident.assignments[0].assignee.summary,
      iconUrl: 'icons/border-48.png'
    });
}

const updateKnownIncidents = ({ knownIncidentIds }) => {
  knownIncidentIdsState = knownIncidentIds;
}

const showNotificationsForNewIncidents = ({ newIncidents }) => {
  const incidentsToReport = [...newIncidents]
  if (incidentsToReport.length > 0) {
    const incident = incidentsToReport.pop();
    showIncidentNotification(incident);
    setTimeout(() => showNotificationsForNewIncidents({ newIncidents: incidentsToReport }), notificationTimeoutInSeconds * 1000);
  }
}

const tap = (fn) => (data) => {
  fn(data);
  return data;
}


function logJson(data) {
  console.log(JSON.stringify(data));
}

setInterval(pollIncidentsAndShowThem(pollParams), pollIntervalInSeconds * 1000);
setTimeout(pollIncidentsAndShowThem(pollParams), 100);
browser.browserAction.onClicked.addListener(openPagerDutyWebsite({ account, statuses: onClickStatuses }));
