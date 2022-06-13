class Tooltip {}

class ProjectItem {
  constructor(id) {
    this.id = id;
    this.connctMoreInfoBtn();
    this.connectSwitchBtn();
  }

  connctMoreInfoBtn() {
    
  }

  connectSwitchBtn() {
    const projectItemElement = document.getElementById(this.id);
    const switchBtn = projectItemElement.querySelector('button:last-of-type');

    switchBtn.addEventListener('click', () => {

    })
  }
}

class ProjectList {
  projects = [];

  constructor(type) {
    this.type = type;
    const prjItems = document.querySelectorAll(`#${type}-projects li`);
    for (const prjItem of prjItems) {
      this.projects.push(new ProjectItem(prjItem.id));
    }
  }

  setSwitchHandlerFunct(switchHandlerFunct) {
    this.switchHandler = switchHandlerFunct;
  }

  addProject() {
    
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
  }
}

App.init();