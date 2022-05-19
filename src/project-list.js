import { filter } from "lodash";
import { removeOnce } from "./array-util";
import Project, { projectFactory } from "./project";

export default class ProjectList {

  constructor() {
    this.projects = [];
  }

  getProjects() {
    return this.projects;
  }

  setProjects(newProjects) {
    this.projects = newProjects;
  }

  addProject(project) {
    //Check for duplicates, report error to user by alerting user of duplicate project
    //Lodash filter method
    if (!(typeof(project) === Project || typeof(project) === projectFactory)) {
      return "Invalid input, must be of type project";
    }

    const filtered = filter(this.projects, p => p.getName() === project.getName());

    //Standard library filter method
    const filteredProjects = this.projects.filter(p => p.getName() === project.getName());

    if (!(filtered.length === 0 && filteredProjects.length === 0)) {
      alert("Cannot Enter Duplicate Project");
      return;
    }

    this.projects.push(project);
  }

  removeProject(project) { 
    if (!(typeof(project) === Project || typeof(project) === projectFactory)) {
      return "Invalid input, must be of type project";
    }

    return removeOnce(this.projects, (p) => p.getName() === project.getName()); 
  }
}