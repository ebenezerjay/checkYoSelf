var searchInput = document.querySelector('#header-search-input');
var titleInput = document.querySelector('#form-title-input');
var itemInput = document.querySelector('#form-item-input');
var makeButton = document.querySelector('#form-make-button');
var clearButton = document.querySelector('#form-clear-button');
var filterButton = document.querySelector('#form-filter-button');
var addItemIcon = document.querySelector('#form-plus-icon');
// var pendingListItems = document.querySelector('.article-list-item');

var bodyHeight = document.querySelector('body');
var itemAddSection = document.querySelector('#form-item-ul');
var cardSection = document.querySelector('#append-card-section');
var noListMessage = document.querySelector('.main-no-list-display');

var listArray = []; 		// array of all list objects
var listIds = [];			// array id's for each object in listArray

titleInput.addEventListener('input', disableBtn);
itemInput.addEventListener('input', disableBtn);
makeButton.addEventListener('click', onMakeClick);
clearButton.addEventListener('click', clearFields);
// filterButton.addEventListener('click', filterUrgency);
addItemIcon.addEventListener('click', addTaskToList);
cardSection.addEventListener('click', removeListCard);
window.addEventListener('load', onPageLoad);

function onMakeClick() {
	disableBtn();
	saveToDoList();
}

// calls functions on page load, and returns the data from the toDoClass
function onPageLoad(e) {
	disableBtn();
	listIds = JSON.parse(localStorage.getItem('masterList')) || [];
	for (var i = 0; i < listIds.length; i++) {
		var obj1 = new ToDoList(listIds[i]);
		obj1.loadFromStorage(listIds[i]);
		listArray.push(obj1);
	}
	loadLists();
	e.preventDefault();
}

// disables buttons
function disableBtn() {
	if (titleInput.value === '' || itemInput.value === '') {
		makeButton.disabled = true;
	} else {
		makeButton.disabled = false;
	}

	if (itemInput.value === '') {
		addItemIcon.disabled = true;
	} else {
		addItemIcon.disabled = false;
	}

	if (titleInput.value === '' && itemInput.value === '') {
		clearButton.disabled === true;
	} else {
		clearButton.disabled = false;
	}
}	

// saves new list objects into storage
function saveToDoList() {
	var pendingTaskArray = Array.prototype.slice.call(document.querySelectorAll('#form-list-item'));
	var taskArray = pendingTaskArray.map(el => el = {taskId: el.dataset.id,taskText: el.innerText, checked: false});
	var newList = new ToDoList(Date.now(), titleInput.value,taskArray);
	addListToDom(newList.id, newList.title, newList.tasks, newList.urgent);
	listIds.push(newList.id);
	localStorage.setItem('masterList', JSON.stringify(listIds));
	newList.saveToStorage();
	clearFields();
}

function clearFields() {
	titleInput.value = "";
	itemInput.value = "";
	itemAddSection.innerHTML = "";
}

// adds the inner html to the form section
function addTaskToList(e) {
	// var pendingTaskArray = Array.prototype.slice.call(document.querySelectorAll('#list-item'));
	// var taskArray = pendingTaskArray.map(el => el = {taskId: el.dataset.id,taskText: el.innerText, checked: false});
	disableBtn();
	itemAddSection.innerHTML = 
	`
	<li class="form-list-item" id="form-list-item" data-id=${Date.now()}>
		<img src="Images/delete.svg" class="li-delete-image" id="li-delete-icon" alt=""> ${itemInput.value}
	</li>
	` + itemAddSection.innerHTML;
	var removeIconArray = document.querySelectorAll(".li-delete-image");
	for (var i = 0; i < removeIconArray.length; i ++) {
		removeIconArray[i].addEventListener('click', removeItem);
	}
	itemInput.value = "";
	e.preventDefault();
}

// adds the pending tasks array into the list object and appends to dom
function addListToDom(id,title,tasks,urgent) {
	// inserts inner html for each value in tasks array
	var pendingTaskArray = Array.prototype.slice.call(document.querySelectorAll('#list-item'));
	var taskArray = pendingTaskArray.map(el => el = {taskId: el.dataset.id,taskText: el.innerText, checked: false});
	
	// itererate through each task object, find id and assign innerHtml to variable
	var listItem = "";
	tasks.forEach(task => {
		listItem += `<li class="article-list-item" id="list-item" data-id=${task.taskId}>
		 	<img src="Images/checkbox.svg" class="li-checkbox-image" alt="check box icon" id="li-checkbox-svg"> ${task.taskText}
		 </li>`
	});
	cardSection.innerHTML = 
	`<article class="append-card" data-id="${id}">
		<h2>${title}</h2>
		<ul class="article-list flex" id="article-list">
			${listItem}
		</ul>
		<section class="article-bottom-section flex">
		<div class="article-card-icons flex">
			<img class="article-urgent-svg" id="article-urgent-svg" src="Images/urgent.svg" data-urgent="${urgent}" alt="urgent icon">
			<img class="article-delete-svg" id="article-delete-svg" src="Images/delete.svg" alt="delete icon">
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
	e.target.parentElement.parentElement.remove();
}

// removes list card from dom
function removeListCard(e) {
	if (e.target.matches('.article-delete-svg')) {
	var cardId = e.target.parentNode.parentNode.parentNode.dataset.id;
	var parsedId = parseInt(cardId);
  var targetList = listArray.find(function(list) {
    return list.id === parsedId;
	});
		e.target.parentElement.parentElement.parentElement.remove();
	var listIndex = listArray.indexOf(targetList);
	targetList.deleteFromStorage(listIndex);
	}
}

// finds which object in list array was clicked on
function findListClickedOn(e) {
	var pendingTaskArray = Array.prototype.slice.call(document.querySelectorAll('#list-item'));
	var taskArray = pendingTaskArray.map(el => el = {taskId: el.dataset.id,taskText: el.innerText, checked: false});
	var dataId = e.target.parentElement.dataset.id;
	var parsedDataId = parseInt(dataId);
	console.log(parsedDataId)
	for (var obj = 0; obj < listArray.length; obj++) {
		if (parsedDataId === listArray[obj].id) {
			findRightCheckBox(e,obj);
		}
	}
}

//  find which toDo list item in task array was just checked
function findRightCheckBox(e,obj) {
	console.log("yo")
	var pointer = listArray[obj];
	for (var item = 0; item < pointer.tasks.length; item++) {
		toggleCheckBox(e,obj,item);
	}
}

//  save to storage and call change src function
function toggleCheckBox(e,obj,item) {
	var pointer = listArray[obj];
	var taskItem = e.target.parentElement.dataset.task;
	if (taskItem === pointer.tasks[item]) {	
		changeSrc(e,obj,item);
		pointer.updateTask(pointer, taskItem);
	}
}
		
// toggle between active states
function changeSrc(e,obj,item) {
	var pointer = listArray[obj];
	var isItChecked = pointer.tasks[item];
	console.log(isItChecked)
	if (isItChecked === 0) {
		pointer.tasks[item] = 1;
		e.target.parentElement.style.color = "#3c6577";		
		e.target.setAttribute('src', 'Images/checkbox-active.svg');
	} else {
		pointer.activeTasks[item] = 0;
		e.target.setAttribute('src', 'Images/checkbox.svg');
	}
}

// toggle between urgent active and inactive
function urgentToggle(e) {
	var urgentIcon = document.querySelector('#article-urgent-svg');
	var urgentId = e.target.parentElement.parentElement.parentElement.dataset.id;
	var parsedUrgentId = parseInt(urgentId);
	for (var i = 0; i < listArray.length; i++) {
		console.log(listArray[i].id)
		if (parsedUrgentId === listArray[i].id) {
			urgentIcon.setAttribute('src', 'Images/urgent-active.svg');
		} else {
			urgentIcon.setAttribute('src', 'Images/urgent.svg');
		}
	}
}
