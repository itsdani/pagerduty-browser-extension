var backgroundWindow = {};


async function renderIncidentLists() {
  backgroundWindow = await browser.runtime.getBackgroundPage();
  const localState = backgroundWindow.state;
  renderIncidentList(localState);
  renderHighIncidentList(localState);
  renderLowIncidentList(localState);
}

function renderIncidentList(state) {
  const incidentContainer = document.querySelector("#incidents-container");

  const newContainer = incidentContainer.cloneNode(false);
  state.incidents.forEach(incident => {
    newContainer.appendChild(createCard(incident));
  });
  incidentContainer.replaceWith(newContainer);
}

function renderHighIncidentList(state) {
  const incidentContainer = document.querySelector("#incidents-container-high");
  const newContainer = incidentContainer.cloneNode(false);
  
  state.incidents.filter(incident => incident.urgency == 'high').forEach(incident => {
    newContainer.appendChild(createCard(incident));
  });
  incidentContainer.replaceWith(newContainer);
}

function renderLowIncidentList(state) {
  const incidentContainer = document.querySelector("#incidents-container-low");
  const newContainer = incidentContainer.cloneNode(false);
  
  state.incidents.filter(incident => incident.urgency == 'low').forEach(incident => {
    newContainer.appendChild(createCard(incident));
  });
  incidentContainer.replaceWith(newContainer);
}

function createCard(incident) {
  const incidentCard = document.createElement("div");
  incidentCard.classList.add("incident-card", "mdl-card", "mdl-shadow--2dp");
  
  if (incident.status == "acknowledged") {
    incidentCard.classList.add("incident-acknowledged");
  } else if (incident.status == "resolved") {
    incidentCard.classList.add("incident-resolved");
  } else {
    incidentCard.classList.add("incident-triggered");
  }
  incidentCard.appendChild(incidentTitle(incident));
  incidentCard.appendChild(incidentDescription(incident));
  incidentCard.appendChild(incidentButtons(incident));
  return incidentCard;
}

function incidentTitle(incident) {
  const incidentTitle = document.createElement("div");
  incidentTitle.classList.add("mdl-card__title");
  incidentTitle.innerText = incident.title;
  return incidentTitle;
}

function incidentDescription(incident) {
  const incidentDescription = document.createElement("div");
  incidentDescription.classList.add("mdl-card__supporting-text");
  text = "";
  if (!!incident.assignments[0]) {
    text += incident.assignments[0].assignee.summary;
  }
  incidentDescription.innerText = incident.assignments[0].assignee.summary;
  return incidentDescription;
}

function incidentButtons(incident) {
  const buttonsContainer = document.createElement("div");
  buttonsContainer.classList.add("mdl-card__actions", "mdl-card--border");
  buttonsContainer.appendChild(acknowledgeButton(incident));
  buttonsContainer.appendChild(resolveButton(incident));

  return buttonsContainer;
}

function acknowledgeButton(incident) {
  const ackButton = document.createElement("Button");
  ackButton.classList.add("mdl-button", "mdl-button--colored", "mdl-js-button", "mdl-js-ripple-effect");
  ackButton.addEventListener("click", (event) =>
    backgroundWindow.acknowledgeIncident(incident).then(renderIncidentLists())
  );
  ackButton.innerText = "Acknowledge";
  return ackButton;
}

function resolveButton(incident) {
  const resolveButton = document.createElement("div");
  resolveButton.classList.add("mdl-button", "mdl-js-button", "mdl-button--raised", "mdl-js-ripple-effect", "mdl-button--primary");
  resolveButton.addEventListener("click", (event) =>
    backgroundWindow.resolveIncident(incident).then(renderIncidentLists())
  );
  resolveButton.innerText = "Resolve";
  return resolveButton;
}

renderIncidentLists();