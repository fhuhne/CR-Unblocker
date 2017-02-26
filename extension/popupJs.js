/* global chrome */

const button = document.getElementById('openCrButton');
const radios = document.getElementsByName('url');
const showAgain = document.getElementsByName('dontShowAgain');
const debugDiv = document.getElementById('debug');

button.addEventListener('click', () => {
	chrome.runtime.sendMessage({});
});

console.log(showAgain);

console.log('JS loaded');
