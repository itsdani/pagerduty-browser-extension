function IncidentNotification() {
  const self = this;

  this.showNotificationsForNewIncidents = ({ newIncidents }) => {
    const incidentsToReport = [...newIncidents]
    if (incidentsToReport.length > 0) {
      const incident = incidentsToReport.pop();
      self.showIncidentNotification(incident);
      setTimeout(() => self.showNotificationsForNewIncidents({ newIncidents: incidentsToReport }), NOTIFICATION_TIMEOUT_IN_SECONDS * 1000);
    }
  }

  this.showIncidentNotification = (incident) => {
    browser.notifications.create(incident.id,
      {
        type: "basic",
        title: incident.title,
        message: incident.urgency + ' urgency - assigned to ' + incident.assignments[0].assignee.summary,
        iconUrl: 'icons/border-48.png'
      });
  }
}