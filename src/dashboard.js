/* global chrome, window, document */
var browser = browser || chrome;

let tabLinks = document.querySelectorAll('.tabs li a');
let tabParent = document.querySelector('.tab-content');
for (let i = 0; i < tabLinks.length; i++) {
	let id = tabLinks[i].href;
	id = id.substring(id.indexOf('#') + 1);
	let tab = document.querySelector(`#${id}`);
	tabLinks[i].addEventListener('click', () => {
		for (let j = 0; j < tabLinks.length; j++) {
			tabLinks[j].parentNode.className = '';
		}
		tabLinks[i].parentNode.className = 'active';
		for (let j = 0; j < tabParent.children.length; j++) {
			tabParent.children[j].className = 'tab';
		}
		tab.className = 'tab active';
	});
}
