function PagerDutyAPI(apiKey) {
  var self = this;
  self.apiKey = apiKey;

  this.GET = (url) => {
    return fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        "Accept": "application/vnd.pagerduty+json;version=2",
        "Authorization": "Token token=" + self.apiKey
      }
    }).then((response) => {
      return response.json();
    });
  }
}