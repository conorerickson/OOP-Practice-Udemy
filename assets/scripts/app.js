class DOMHelper {
  static clearEventListeners(element) {
    const clonedElement = element.cloneNode(true);
    element.replaceWith(clonedElement);
    return clonedElement;
  }

  static moveElement(elementId, newDestinationSelector) {
    const element = document.getElementById(elementId);
    const destinationElement = document.querySelector(newDestinationSelector);
    destinationElement.append(element);
  }
}

class Component {
  constructor(hostElementId, insertBefore = false) {
    if (hostElementId) {
      this.hostElement = document.getElementById(hostElementId);
    } else {
      this.hostElement = document.body;
    }
    this.insertBefore = insertBefore;
  }

  detach() {
    if (this.element) {
      this.element.remove();
    }
  }

  attach() {
    this.hostElement.insertAdjacentElement(this.insertBefore ? 'afterbegin' : 'beforeend', this.element);
  }
}

class Tooltip extends Component {
  constructor(closeNotifierFunct) {
    super();
    this.closeNotifier = closeNotifierFunct;
    this.render();
  }

  closeTooltip = () => {
    this.detach();
    this.closeNotifier();
  };

  render() {
    const toolTipElement = document.createElement("div");
    toolTipElement.className = "card";
    toolTipElement.textContent = "Placeholder";
    toolTipElement.addEventListener("click", this.closeTooltip);
    this.element = toolTipElement;
  }
}

class ProjectItem {
  hasActiveTooltip = false;

  constructor(id, updateProjectListsFunct, type) {
    this.id = id;
    this.updateProjectListsHandler = updateProjectListsFunct;
    this.connctMoreInfoBtn();
    this.connectSwitchBtn(type);
  }

  showMoreInfoHandler() {
    if (this.hasActiveTooltip) {
      return;
    }
    const toolTip = new Tooltip(() => {
      this.hasActiveTooltip = false;
    });
    toolTip.attach();
    this.hasActiveTooltip = true;
  }

  connctMoreInfoBtn() {
    const projectItemElement = document.getElementById(this.id);
    const moreInfoBtn = projectItemElement.querySelector(
      "button:first-of-type"
    );
    moreInfoBtn.addEventListener("click", this.showMoreInfoHandler);
  }

  connectSwitchBtn(type) {
    const projectItemElement = document.getElementById(this.id);
    let switchBtn = projectItemElement.querySelector("button:last-of-type");
    switchBtn = DOMHelper.clearEventListeners(switchBtn);
    switchBtn.textContent = type === "active" ? "Finish" : "Activate";

    switchBtn.addEventListener(
      "click",
      this.updateProjectListsHandler.bind(null, this.id)
    );
  }

  update(updateProjectListsFn, type) {
    this.updateProjectListsHandler = updateProjectListsFn;
    this.connectSwitchBtn(type);
  }
}

class ProjectList {
  projects = [];

  constructor(type) {
    this.type = type;
    const prjItems = document.querySelectorAll(`#${type}-projects li`);
    for (const prjItem of prjItems) {
      this.projects.push(
        new ProjectItem(prjItem.id, this.switchProject.bind(this), this.type)
      );
    }
  }

  setSwitchHandlerFunct(switchHandlerFunct) {
    this.switchHandler = switchHandlerFunct;
  }

  addProject(project) {
    this.projects.push(project);
    DOMHelper.moveElement(project.id, `#${this.type}-projects ul`);
    project.update(this.switchProject.bind(this), this.type);
  }

  switchProject(projectId) {
    this.switchHandler(this.projects.find((p) => p.id === projectId));
    this.projects = this.projects.filter((p) => p.id !== projectId);
  }
}

class App {
  static init() {
    const activeProjectsList = new ProjectList("active");
    const finishedProjectsList = new ProjectList("finished");

    activeProjectsList.setSwitchHandlerFunct(
      finishedProjectsList.addProject.bind(finishedProjectsList)
    );

    finishedProjectsList.setSwitchHandlerFunct(
      activeProjectsList.addProject.bind(activeProjectsList)
    );
  }
}

App.init();
