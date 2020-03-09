async function renderIncidentList() {
  const backgroundWindow = await browser.runtime.getBackgroundPage();

  const localState = backgroundWindow.state;

  const incidentContainer = document.querySelector("#incidents-container");

  localState.incidents.forEach(incident => {
    incidentContainer.appendChild(createCard(incident));
  });
}
async function renderHighIncidentList() {
  const backgroundWindow = await browser.runtime.getBackgroundPage();

  const localState = backgroundWindow.state;

  const incidentContainer = document.querySelector("#incidents-container-high");

  localState.incidents.filter(incident => incident.urgency == 'high').forEach(incident => {
    incidentContainer.appendChild(createCard(incident));
  });
}
async function renderLowIncidentList() {
  const backgroundWindow = await browser.runtime.getBackgroundPage();

  const localState = backgroundWindow.state;

  const incidentContainer = document.querySelector("#incidents-container-low");

  localState.incidents.filter(incident => incident.urgency == 'low').forEach(incident => {
    incidentContainer.appendChild(createCard(incident));
  });
}

function createCard(incident) {
  const incidentCard = document.createElement("div");
  incidentCard.classList.add("incident-card", "mdl-card", "mdl-shadow--2dp");
  incidentCard.appendChild(incidentTitle(incident));
  incidentCard.appendChild(incidentButtons(incident));
  return incidentCard;
}

function incidentTitle(incident) {
  const incidentTitle = document.createElement("div");
  incidentTitle.classList.add("mdl-card__title");
  incidentTitle.innerText = incident.title;
  return incidentTitle;
}

function incidentButtons(incident) {
  const buttonsContainer = document.createElement("div");
  buttonsContainer.classList.add("mdl-card__actions","mdl-card--border");
  buttonsContainer.appendChild(acknowledgeButton(incident));
  buttonsContainer.appendChild(resolveButton(incident));

  return buttonsContainer;
}

function acknowledgeButton(incident) {
  const ackButton = document.createElement("Button");
  ackButton.classList.add("mdl-button", "mdl-button--colored", "mdl-js-button", "mdl-js-ripple-effect");
  ackButton.innerText = "Acknowledge";
  return ackButton;
}

function resolveButton(incident) {
  const resolveButton = document.createElement("div");
  resolveButton.classList.add("mdl-button", "mdl-js-button", "mdl-button--raised", "mdl-js-ripple-effect", "mdl-button--primary");
  resolveButton.innerText = "Resolve";
  return resolveButton;
}


renderIncidentList();
renderHighIncidentList();
renderLowIncidentList();