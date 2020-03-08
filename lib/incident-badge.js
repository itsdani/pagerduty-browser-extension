function IncidentBadge() {
  const self = this;
  const LOW = 'low';
  const HIGH = 'high';
  const HIGH_URGENCY_BACKGROUND = 'red';
  const LOW_URGENCY_BACKGROUND = 'grey';
  const TEXT_COLOR = 'white';

  this.updateBadge = (incidents) => {
    const lowCount = incidents.filter(incident => incident.urgency == LOW).length;
    const highCount = incidents.filter(incident => incident.urgency == HIGH).length;

    browser.browserAction.setBadgeText({ text: self.badgeText(lowCount, highCount) });
    browser.browserAction.setBadgeBackgroundColor({ color: self.badgeBackgroundColor(highCount) });
    browser.browserAction.setBadgeTextColor({ color: TEXT_COLOR });
  }

  this.badgeText = (lowCount, highCount) => {
    if (highCount > 0) return highCount.toString();
    return lowCount.toString();
  }

  this.badgeBackgroundColor = (highCount) => {
    if (highCount > 0) return HIGH_URGENCY_BACKGROUND;
    return LOW_URGENCY_BACKGROUND;
  }
}