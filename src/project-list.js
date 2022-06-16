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

  /**
   * Returns the Project object that matches the given name from the array of projects in
   * ProjectList.
   * @param {String} projectName name of the Project to get
   * @returns Returns the Project that matches the given name
   */
  getProject(projectName) {
    //returns the project found in the array
    return (findFirst(this.projects, (p) => p.getName() === projectName))[0];
  }

  setProject(projectName, newProject) {
    //find where(index) the project is located in the projects array
    const index = this.projects.findIndex(p => p.getName() === projectName);
    this.projects[index] = newProject;
  }

  getProjects() {
    return this.projects;
  }

  setProjects(projects) {
    this.projects = projects;
  }

  getProjectIndex(projectName) {
    const index = this.projects.findIndex(p => p.getName() === projectName);
    return index;
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