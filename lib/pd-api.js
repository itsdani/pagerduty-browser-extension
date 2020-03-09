function PagerDutyAPI(apiKey) {
  var self = this;
  self.apiKey = apiKey;
  self.defaultHeaders = {
    "Content-Type": "application/json",
    "Accept": "application/vnd.pagerduty+json;version=2",
    "Authorization": "Token token=" + self.apiKey
  }

  this.GET = (url) => {
    return fetch(url, {
      method: 'GET',
      headers: self.defaultHeaders
    }).then((response) => {
      return response.json();
    });
  }

  this.PUT = (url, payload) => {
    return fetch(url, {
      method: 'PUT',
      headers: self.defaultHeaders,
      body: JSON.stringify(payload)
    }).then((response) => {
      return response.json();
    });
  }
}