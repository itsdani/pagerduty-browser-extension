const crossplatform = new CrossBrowserApi();
class OptionsPage {
  backgroundWindow;
  state;

  getBackgroundWindow() {
    return new Promise(resolve => crossplatform.runtime.getBackgroundPage(resolve));
  }

  reloadState() {
    this.state = this.backgroundWindow.state;
  }

  loadSettings() {
    this.backgroundWindow.loadSettingsIntoState();
  }

  updateSettingsInputs() {
    this.backgroundWindow.loadSettingsIntoState().then(state => {
      document.querySelector(".mdl-textfield#mdl-account-name-input")
        .MaterialTextfield.change(state.settings.accountName);
      document.querySelector(".mdl-textfield#mdl-user-id-input")
        .MaterialTextfield.change(state.settings.userId);
      document.querySelector(".mdl-textfield#mdl-team-ids-input")
        .MaterialTextfield.change(state.settings.teamIds);
      document.querySelector(".mdl-textfield#mdl-pd-api-key-input")
        .MaterialTextfield.change(state.settings.pdApiKey);
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

    this.backgroundWindow.setSettings(settings)
      .then(() => this.loadSettings())
      .then(() => this.reloadState());
  }


  addSaveSettingsButtonEventHandler() {
    const saveButton = document.querySelector("#save-settings-button");
    saveButton.addEventListener("click", () => this.saveSettings());
  }
}

const optionsPage = new OptionsPage();
optionsPage.getBackgroundWindow()
  .then(backgroundWindow => optionsPage.backgroundWindow = backgroundWindow)
  .then(() => optionsPage.loadSettings())
  .then(() => optionsPage.reloadState())
  .then(() => optionsPage.updateSettingsInputs())
  .then(() => optionsPage.addSaveSettingsButtonEventHandler());