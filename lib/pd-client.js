function PagerDutyClient(pdapi) {
  const self = this;
  self.BASE_URI = "https://api.pagerduty.com/";
  self.pdapi = pdapi;

  this.urlArrayParam = (name, values) =>
    values.map(value => name + "[]=" + value)

  this.pollUrlParameters = ({ statuses, teamIds, urgencies }) => [
    ...self.urlArrayParam("statuses", statuses),
    ...self.urlArrayParam("team_ids", teamIds),
    ...self.urlArrayParam("urgencies", urgencies)
  ]

  this.pollNewIncidents = (pollParameters) => {
    const url = self.BASE_URI + "incidents?" + self.pollUrlParameters(pollParameters).join("&");
    return self.pdapi.GET(url).then((data) => data.incidents);
  }

  this.acknowledgeIncident = (incident) => {
    return self.updateIncidentStatus(incident, "acknowledged");
  }
  
  this.resolveIncident = (incident) => {
    return self.updateIncidentStatus(incident, "resolved");
  }

  this.updateIncidentStatus = (incident, newStatus) => {
    const payload = self.payloadForIncidentUpdate(incident, newStatus);
    const url = self.BASE_URI + "incidents";
    return self.pdapi.PUT(url, payload);
  }

  this.payloadForIncidentUpdate = (incident, newStatus) => {
    return {
      incidents: [{
        id: incident.id,
        type: "incident_reference",
        status: newStatus
      }]
    }
  }

}