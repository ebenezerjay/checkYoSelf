var searchInput = document.querySelector('#header-search-input');
var titleInput = document.querySelector('#form-title-input');
var itemInput = document.querySelector('#form-item-input');
var makeButton = document.querySelector('#form-make-button');
var clearButton = document.querySelector('#form-clear-button');
var filterButton = document.querySelector('#form-filter-button');
var addItemIcon = document.querySelector('#form-plus-icon');

var bodyHeight = document.querySelector('body');
var itemAddSection = document.querySelector('#form-item-ul');
var cardSection = document.querySelector('#append-card-section');

var listArray = []; 		// array of all list objects
var pendingTaskArray = []; 		// array of task items before they get added to list
var listIds = [];			// array id's for each object in listArray

titleInput.addEventListener('input', disableBtn);
makeButton.addEventListener('click', saveToDoList);
clearButton.addEventListener('click', clearFields);
// filterButton.addEventListener('click', filterUrgency);
addItemIcon.addEventListener('click', addTaskToList);
window.addEventListener('load', onPageLoad);


function onPageLoad(e) {
	listIds = JSON.parse(localStorage.getItem('masterList')) || [];
	for (var i = 0; i < listIds.length; i++) {
		var obj1 = new ToDoList(listIds[i]);
		obj1.loadFromStorage(listIds[i]);
		listArray.push(obj1);
	}
	loadLists();
}

function disableBtn(e) {
	if (titleInput.value || itemInput.value != '') {
		makeButton.disabled = false;
		clearButton.disabled = false;
		addItemIcon.disabled = false;
	} else {
		makeButton.disabled = true;
		clearButton.disabled = true;
		addItemIcon.disabled = true;
	}
}	

function saveToDoList(e) {
	var activeTaskArray = [];
	for (var i = 0; i < pendingTaskArray.length; i++) {
		activeTaskArray.push(false);
	}
	var newList = new ToDoList(Date.now(), titleInput.value,pendingTaskArray,activeTaskArray);
	addListToDom(newList.id, newList.title, newList.activeTasks, newList.tasks, newList.urgent);
	listIds.push(newList.id);
	localStorage.setItem('masterList', JSON.stringify(listIds));
	listArray.push(newList);
	newList.saveToStorage();
	clearFields();
	e.preventDefault();
}

function clearFields(e) {
	titleInput.value = "";
	itemInput.value = "";
	itemAddSection.innerHTML = "";
	e.preventDefault();
}

function pendingTasks() {
	pendingTaskArray.push(itemInput.value);
}

function addTaskToList(e) {
	pendingTasks();
	itemAddSection.innerHTML = 
		`<li class="article-list-item" id="list-item" data-id="${itemInput.value}">
				<img src="images/delete.svg" class="li-delete-image" id="li-delete-icon"alt=""> ${itemInput.value}
			</li>` + itemAddSection.innerHTML;
	var removeIconArray = document.querySelectorAll(".li-delete-image");
	for (var i = 0; i < removeIconArray.length; i ++) {
		removeIconArray[i].addEventListener('click', removeListCard);
	}
	itemInput.value = "";
	e.preventDefault();
}

function addListToDom(id,title,tasks,urgent) {
	var listItem = "";
	for (var i = 0; i < tasks.length; i++) {
		listItem += `<li class="article-list-item" id="list-item" data-id="${id}" data-task="${tasks[i]}">
		<img src="images/checkbox.svg" class="li-checkbox-image" alt="check box icon" id="li-checkbox-svg"> ${tasks[i]}
	</li>`;
	}
	cardSection.innerHTML = 
	`<article class="append-card" data-id="${id}">
		<h2>${title}</h2>
		<ul class="article-list flex" id="article-list">
			${listItem}
		</ul>
		<section class="article-bottom-section flex">
		<div class="article-card-icons flex">
			<img class="article-urgent-svg" id="article-urgent-svg" src="images/urgent.svg" data-id="${urgent}" alt="urgent icon">
			<img class="article-delete-svg" id="article-delete-svg" src="images/delete.svg" alt="delete icon">
		</div>
		<div class="article-card-icon-labels flex">
			<label class="article-urgent-label" name="urgent" for="article-urgent-svg">Urgent</label>
			<label class="article-delete-label" name="delete" for="article-delete-svg">Delete</label>
		</div>
		</section>
	</article>
	` + cardSection.innerHTML;
	var urgentIcon = document.querySelectorAll('#article-urgent-svg');
	var checkBoxIcon = document.querySelectorAll('#li-checkbox-svg');
	var deleteIcon = document.querySelectorAll('#article-delete-svg');
	for (var i = 0; i < checkBoxIcon.length; i ++) {
		checkBoxIcon[i].addEventListener('click', findListClickedOn);
	}
	for (var i = 0; i < deleteIcon.length; i ++) {
		deleteIcon[i].addEventListener('click', removeListCard);
	}
	for (var i = 0; i < urgentIcon.length; i ++) {
		urgentIcon[i].addEventListener('click', urgentToggle);
	}
}

// brings back all object data
function loadLists() {
	for (var i = 0; i < listArray.length; i++) {
		addListToDom(listArray[i].id, listArray[i].title, listArray[i].tasks, listArray[i].urgent);
	}
}

// removes list item from pending tasks
function removeItem(e) {
	event.target.parentElement.remove();
}

// removes list card from dom
function removeListCard(e) {
	var newList = new ToDoList();
	if (e.target.classList.contains('article-delete-svg')) {
	var listId = e.target.parentElement.parentElement.parentElement.dataset.id
	newList.deleteFromStorage(parseInt(listId));
	e.target.parentElement.parentElement.parentElement.remove();
	event.preventDefault();
	}
}

// finds which object in list array was clicked on
function findListClickedOn(e) {
	var dataId = e.target.parentElement.dataset.id;
	var parsedDataId = parseInt(dataId);
	for (var i = 0; i < listArray.length; i++) {
		if (parsedDataId === listArray[i].id) {
			findRightCheckBox(e,i);
		}
	}
}

//  find which toDo list item in task array was just checked
function findRightCheckBox(e,i) {
	var pointer = listArray[i];
	for (var x = 0; x < pointer.tasks.length; x++) {
		toggleCheckBox(e,i,x);
	}
}

//  save to storage and call change src function
function toggleCheckBox(e,i,x) {
	var pointer = listArray[i];
	var taskItem = e.target.parentElement.dataset.task;
	var taskUpdate = new ToDoList();
	if (taskItem === pointer.tasks[x]) {			
		changeSrc(e,x);
		taskUpdate.saveToStorage();
		taskUpdate.updateTask(pointer, taskItem);
	}
}
		
// toggle between active states
function changeSrc(e,i,x) {
	var pointer = listArray[i];
	var isItChecked = pointer.activeTasks[x];
	if (isItChecked === false) {
		pointer.activeTasks[x] = true;
		e.target.setAttribute('src', 'images/checkbox-active.svg');
		listItem.style.color = '#3c6577';
	} else {
		pointer.activeTasks[x] = false;
		e.target.setAttribute('src', 'images/checkbox.svg');
	}
}

function urgentToggle(e) {
	var urgentIcon = document.querySelector('#article-urgent-svg');
	var urgentId = e.target.parentElement.parentElement.parentElement.dataset.id;
	var parsedUrgentId = parseInt(urgentId);
	for (var i = 0; i < listArray.length; i++) {
		if (parsedUrgentId === listArray[i].id) {
			urgentIcon.setAttribute('src', 'images/urgent-active.svg');
		} else {
			urgentIcon.setAttribute('src', 'images/urgent.svg');
		}
	}
}