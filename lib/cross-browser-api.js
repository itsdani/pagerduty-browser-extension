function CrossBrowserApi() {
  var self = this;

  self.crossplatform = window.browser || window.chrome;

  const FIREFOX = 'firefox';
  const CHROME = 'chrome';
  const UNKNOWN = 'unknown';
  const browserType = window.browser ? FIREFOX : (window.chrome ? CHROME : UNKNOWN);

  this.browserAction = {
    setBadgeText: (param) => {
      switch (browserType) {
        case FIREFOX:
        case CHROME:
          return self.crossplatform.browserAction.setBadgeText(param);
        default:
          return;
      }
    },

    setBadgeBackgroundColor: (param) => {
      switch (browserType) {
        case FIREFOX:
        case CHROME:
          return self.crossplatform.browserAction.setBadgeBackgroundColor(param)
        default:
          return;
      }
    },

    setBadgeTextColor: (param) => {
      switch (browserType) {
        case FIREFOX:
          return self.crossplatform.browserAction.setBadgeTextColor(param)
        case CHROME:
        default:
          return;
      }
    }
  };

  this.notifications = {
    create: (title, params) => {
      switch (browserType) {
        case FIREFOX:
        case CHROME:
          return self.crossplatform.notifications.create(title, params);
        default:
          return;
      }
    }
  };

  this.runtime = {
    getBackgroundPage: (callback) => {
      switch (browserType) {
        case FIREFOX:
        case CHROME:
          return self.crossplatform.runtime.getBackgroundPage(callback);
        default:
          return;
      }
    }
  }

  this.tabs = {
    create: (param) => {
      switch (browserType) {
        case FIREFOX:
        case CHROME:
          return self.crossplatform.tabs.create(param);
        default:
          return;
      }
    }
  }
}
