import * as DOMUtil from '../util/dom-util';

export default function displayFooter() {
  const footer = document.querySelector('footer');
  displayCopyrightMessageIcon(footer);
  displayCurrentYear(footer);
  displayGithubUsernameLink(footer);
  displayGithubLogo(footer);
}

function displayCopyrightMessageIcon(footer) {
  const copyrightMessageIcon = document.createElement('span');
  copyrightMessageIcon.textContent = 'Copyright \u00A9';
  footer.appendChild(copyrightMessageIcon);
}

function displayCurrentYear(footer) {
  const year = document.createElement('span');
  year.textContent = `${new Date().getFullYear()}`;
  footer.appendChild(year);
}

function displayGithubUsernameLink(footer) {
  const usernameLink = document.createElement('a');
  DOMUtil.setAttributes(usernameLink, {
    "href": "https://github.com/hosja83",
    "target": "_blank",
    "rel": "noopener noreferrer",
  });
  usernameLink.textContent = 'Alhosainy Altaher';
  footer.appendChild(usernameLink);
}

function displayGithubLogo(footer) {
  const githubLink = document.createElement('a');
  DOMUtil.setAttributes(githubLink, {
    "href": "https://github.com/hosja83/todo-list",
    "target": "_blank",
    "rel": "noopener noreferrer",
  });
  const githubLogo = document.createElement('i');
  githubLogo.setAttribute('class', 'fa-brands fa-github');
  githubLogo.classList.add('github-logo');
  footer.appendChild(githubLink).appendChild(githubLogo);
}