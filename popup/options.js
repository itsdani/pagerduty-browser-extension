const crossplatform = new CrossBrowserApi();
class OptionsPage {
  backgroundWindow;
  state;

  getBackgroundWindow() {
    return new Promise(resolve => crossplatform.runtime.getBackgroundPage(resolve));
  }

  loadSettings() {
    this.backgroundWindow.getSettings().then( settings => {
      const accountNameInput = document.querySelector("#mdl-account-name-input");
      accountNameInput.MaterialTextfield.change(settings.accountName);
      
      const userIdInput = document.querySelector("#mdl-user-id-input");
      userIdInput.MaterialTextfield.change(settings.userId);
      
      const teamIdsInput = document.querySelector("#mdl-team-ids-input");
      teamIdsInput.MaterialTextfield.change(settings.teamIds);
      
      const pdApiKeyInput = document.querySelector("#mdl-pd-api-key-input");
      pdApiKeyInput.MaterialTextfield.change(settings.pdApiKey);
    })

  }

  saveSettings() {
    const accountNameInput = document.querySelector("#account-name-input");
    const userIdInput = document.querySelector("#user-id-input");
    const teamIdsInput = document.querySelector("#team-ids-input");
    const pdApiKeyInput = document.querySelector("#pd-api-key-input");
    
    const settings = {
      accountName: accountNameInput.value,
      userId: userIdInput.value,
      teamIds: teamIdsInput.value,
      pdApiKey: pdApiKeyInput.value
    }
    
    this.backgroundWindow.setSettings(settings);
  }


  addSaveSettingsButtonEventHandler() {
    const saveButton = document.querySelector("#save-settings-button");
    saveButton.addEventListener("click", () => this.saveSettings());
  }
}

const optionsPage = new OptionsPage();
optionsPage.getBackgroundWindow()
  .then(backgroundWindow => optionsPage.backgroundWindow = backgroundWindow)
  .then(() => optionsPage.state = optionsPage.backgroundWindow.state)
  .then(() => optionsPage.addSaveSettingsButtonEventHandler())
  .then(() => optionsPage.loadSettings());