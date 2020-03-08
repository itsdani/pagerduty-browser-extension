function PagerDutyClient(pdapi) {
  const self = this;
  self.pdapi = pdapi;

  this.urlArrayParam = (name, values) =>
    values.map(value => name + '[]=' + value)

  this.pollUrlParameters = ({ statuses, teamIds, urgencies }) => [
    ...self.urlArrayParam('statuses', statuses),
    ...self.urlArrayParam('team_ids', teamIds),
    ...self.urlArrayParam('urgencies', urgencies)
  ]

  this.pollNewIncidents = (pollParameters) => {
    var url = 'https://api.pagerduty.com/incidents?' + self.pollUrlParameters(pollParameters).join('&');
    return self.pdapi.GET(url).then((data) => data.incidents);
  }
}