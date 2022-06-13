class DOMHelper {
  static moveElement(elementId, newDestinationSelector) {
    const element = document.getElementById(elementId);
    const destinationElement = document.querySelector(newDestinationSelector);
    destinationElement.append(element);
  }
}



class Tooltip { }

class ProjectItem {
  constructor(id, updateProjectListsFunct) {
    this.id = id;
    this.updateProjectListsHandler = updateProjectListsFunct;
    this.connctMoreInfoBtn();
    this.connectSwitchBtn();
  }

  connctMoreInfoBtn() {
    
  }

  connectSwitchBtn() {
    const projectItemElement = document.getElementById(this.id);
    const switchBtn = projectItemElement.querySelector('button:last-of-type');

    switchBtn.addEventListener('click', this.updateProjectListsHandler.bind(null, this.id));
  }
}


class ProjectList {
  projects = [];

  constructor(type) {
    this.type = type;
    const prjItems = document.querySelectorAll(`#${type}-projects li`);
    for (const prjItem of prjItems) {
      this.projects.push(new ProjectItem(prjItem.id, this.switchProject.bind(this)));
    }
  }

  setSwitchHandlerFunct(switchHandlerFunct) {
    this.switchHandler = switchHandlerFunct;
  }

  addProject(project) {
    this.projects.push(project);
    DOMHelper.moveElement(project.id, `#${this.type}-projects ul`);
  }


  switchProject(projectId) {
    this.switchHandler(this.projects.find(p => p.id === projectId));
    this.projects = this.projects.filter(p => p.id !== projectId);
  }
}



class App {
  static init() {
    const activeProjectsList = new ProjectList('active');
    const finishedProjectsList = new ProjectList('finished');

    activeProjectsList.setSwitchHandlerFunct(finishedProjectsList.addProject.bind(finishedProjectsList));

    finishedProjectsList.setSwitchHandlerFunct(factiveProjectsList.addProject.bind(activeProjectsList));
  }
}

App.init();