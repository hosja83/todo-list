// project-list.js

import { filter } from "lodash";
import { removeFirst, findFirst } from "./array-util";

/**
 * Constructs a class that adds, deletes, and retrieves Projects from an array of Projects.
 */
export default class ProjectList {

  constructor() {
    this.projects = [];
  }

  getProject(projectName) {
    return findFirst(this.projects, (p) => p.getName() === projectName.getName());
  }

  getProjects() {
    return this.projects;
  }

  setProjects(projects) {
    this.projects = projects;
  }

  addProject(project) {
    // Check if given project is instance of Project
    // if (!(project instanceof Project || project instanceof projectFactory)) {
    //   return "Invalid input, must be of type project";
    // }

    // Check if given project is duplicate, using Lodash filter method
    const filtered = filter(this.projects, p => p.getName() === project.getName());
    //Standard library filter method
    const filteredProjects = this.projects.filter(p => p.getName() === project.getName());

    if (!(filtered.length === 0 && filteredProjects.length === 0)) {
      alert("Duplicate project error, please try again.");
      return "Duplicate";
    }

    this.projects.push(project);
    return project;
  }

  removeProject(projectName) { 
    // if (!(typeof(project) === Project || typeof(project) === projectFactory)) {
    //   return "Invalid input, must be of type project";
    // }

    return removeFirst(this.projects, (p) => p.getName() === projectName); 
  }
}