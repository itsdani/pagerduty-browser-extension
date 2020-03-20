function IncidentBadge(browser) {
  const self = this;
  const LOW = 'low';
  const HIGH = 'high';
  const HIGH_URGENCY_BACKGROUND = '#ff0202';
  const LOW_URGENCY_BACKGROUND = '#808080';
  const TEXT_COLOR = '#FFFFFF';

  self.browser = browser;

  this.updateBadge = (incidents) => {
    const lowCount = incidents.filter(incident => incident.urgency == LOW).length;
    const highCount = incidents.filter(incident => incident.urgency == HIGH).length;

    self.browser.browserAction.setBadgeText({ text: self.badgeText(lowCount, highCount) });
    self.browser.browserAction.setBadgeBackgroundColor({ color: self.badgeBackgroundColor(highCount) });
    self.browser.browserAction.setBadgeTextColor({ color: TEXT_COLOR });
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