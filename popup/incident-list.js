const crossplatform = new CrossBrowserApi();
class IncidentListPage {
  backgroundWindow;
  state;

  getBackgroundWindow() {
    return new Promise(resolve => crossplatform.runtime.getBackgroundPage(resolve));
  }

  renderIncidentLists() {
    this.renderAllIncidentList(this.state);
    this.renderHighIncidentList(this.state);
    this.renderLowIncidentList(this.state);
  }

  renderAllIncidentList(state) {
    const incidentContainer = document.querySelector("#incidents-container");
    this._renderIncidentList(incidentContainer, state.incidents, () => true);
  }

  renderHighIncidentList(state) {
    const incidentContainer = document.querySelector("#incidents-container-high");
    this._renderIncidentList(incidentContainer, state.incidents, incident => incident.urgency == 'high');
  }

  renderLowIncidentList(state) {
    const incidentContainer = document.querySelector("#incidents-container-low");
    this._renderIncidentList(incidentContainer, state.incidents, incident => incident.urgency == 'low');
  }

  _renderIncidentList(container, incidents, filter) {
    const newContainer = container.cloneNode(false);

    incidents.filter(filter).sort(this._createdAtOrdering).forEach(incident => {
      newContainer.appendChild(this.createCard(incident));
    });
    container.replaceWith(newContainer);
  }

  _createdAtOrdering(incident1, incident2) {
    return new Date(incident2.created_at) - new Date(incident1.created_at)
  }

  createCard(incident) {
    const incidentCard = document.createElement("div");
    incidentCard.classList.add("incident-card", "mdl-card", "mdl-shadow--2dp");

    if (incident.status == "acknowledged") {
      incidentCard.classList.add("incident-acknowledged");
    } else if (incident.status == "resolved") {
      incidentCard.classList.add("incident-resolved");
    } else {
      incidentCard.classList.add("incident-triggered");
    }
    incidentCard.appendChild(this.incidentTitle(incident));
    incidentCard.appendChild(this.incidentDescription(incident));
    incidentCard.appendChild(this.incidentButtons(incident));
    return incidentCard;
  }

  incidentTitle(incident) {
    const linkWrapper = document.createElement("a");
    linkWrapper.classList.add("incident-link");
    linkWrapper.href = incident.html_url;
    
    
    const incidentTitle = document.createElement("div");
    incidentTitle.classList.add("mdl-card__title");
    
    const incidentIcon = this.incidentIcon(incident)
    const incidentTitleText = document.createElement("span");
    incidentTitleText.innerText = incident.title;

    incidentTitle.appendChild(incidentIcon);
    incidentTitle.appendChild(incidentTitleText);

    linkWrapper.appendChild(incidentTitle);
    return linkWrapper;
  }

  incidentIcon(incident) {
    const incidentIcon = document.createElement("div");
    incidentIcon.classList.add("icon", "material-icons", "incident-icon");
    switch (incident.urgency) {
      case "high":
        incidentIcon.classList.add("high-incident-icon");
        incidentIcon.innerText = "priority_high";
        break;
        default:
          incidentIcon.classList.add("low-incident-icon");
          incidentIcon.innerText = "low_priority";
        break;
    }

    return incidentIcon;
  }

  incidentDescription(incident) {
    const incidentDescription = document.createElement("div");
    incidentDescription.classList.add("mdl-card__supporting-text");
    let assignedTo = "";
    if (!!incident.assignments[0]) {
      assignedTo += incident.assignments[0].assignee.summary;
    }
    const createdAt = new Date(incident.created_at).toLocaleString();
    incidentDescription.innerHTML = [assignedTo, createdAt].join('<br>');
    return incidentDescription;
  }

  incidentButtons(incident) {
    const buttonsContainer = document.createElement("div");
    buttonsContainer.classList.add("mdl-card__actions", "mdl-card--border");
    buttonsContainer.appendChild(this.acknowledgeButton(incident));
    buttonsContainer.appendChild(this.resolveButton(incident));

    return buttonsContainer;
  }

  acknowledgeButton(incident) {
    const ackButton = document.createElement("Button");
    ackButton.classList.add("mdl-button", "mdl-button--colored", "mdl-js-button", "mdl-js-ripple-effect");
    ackButton.addEventListener("click", () => this.backgroundWindow.acknowledgeIncident(incident).then(this.renderIncidentLists()));
    ackButton.innerText = "Acknowledge";
    return ackButton;
  }

  resolveButton(incident) {
    const resolveButton = document.createElement("div");
    resolveButton.classList.add("mdl-button", "mdl-js-button", "mdl-button--raised", "mdl-js-ripple-effect", "mdl-button--primary");
    resolveButton.addEventListener("click", () => this.backgroundWindow.resolveIncident(incident).then(this.renderIncidentLists()));
    resolveButton.innerText = "Resolve";
    return resolveButton;
  }
}

const incidentListPage = new IncidentListPage();
incidentListPage.getBackgroundWindow()
  .then(backgroundWindow => incidentListPage.backgroundWindow = backgroundWindow)
  .then(() => incidentListPage.state = incidentListPage.backgroundWindow.state)
  .then(() => incidentListPage.renderIncidentLists());