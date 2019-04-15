var searchInput = document.querySelector('#header-search-input');
var titleInput = document.querySelector('#form-title-input');
var itemInput = document.querySelector('#form-item-input');
var makeButton = document.querySelector('#form-make-button');
var clearButton = document.querySelector('#form-clear-button');
var filterButton = document.querySelector('#form-filter-button');
// var urgentIcon = document.querySelector('#article-urgent-svg');

var addItemIcon = document.querySelector('#form-plus-icon');

var itemAddSection = document.querySelector('#form-item-ul');
var cardSection = document.querySelector('#append-card-section');

var listArray = []; 		// array of all list objects
var pendingTaskArray = []; 		// array of task items before they get added to list
var listIds = [];			// array id's for each object in listArray

titleInput.addEventListener('input', disableBtn);
makeButton.addEventListener('click', onSaveClick);
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
	console.log(listArray)
}

function onSaveClick(e) {
	console.log(listArray)
	saveToDoList(e);
	e.preventDefault();
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
	
function saveToDoList() {
	console.log(titleInput.value)
	console.log(listArray)
	var activeTaskArray = [];
	for (var i = 0; i < pendingTaskArray.length; i++) {
		activeTaskArray.push(0);
	}
	var newList = new ToDoList(Date.now(), titleInput.value,pendingTaskArray,activeTaskArray);
	addListToDom(newList.id, newList.title, newList.tasks);
	listIds.push(newList.id);
	localStorage.setItem('masterList', JSON.stringify(listIds));
	listArray.push(newList);
	newList.saveToStorage();
	clearFields();
	// e.preventDefault();
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
		`
			<li class="article-list-item" id="list-item" data-id="${itemInput.value}">
				<img src="images/delete.svg" class="li-delete-image" id="li-delete-icon"alt=""> ${itemInput.value}
			</li>
		` + itemAddSection.innerHTML;
	var removeIconArray = document.querySelectorAll(".li-delete-image");
	for (var i = 0; i < removeIconArray.length; i ++) {
		removeIconArray[i].addEventListener('click', removeItem);
	}
	itemInput.value = "";
	e.preventDefault();
}

function addListToDom(id,title,tasks) {
	var listItem = "";
	for (var i = 0; i < tasks.length; i++) {
		listItem += `<li class="article-list-item" id="list-item" data-id="${id}" data-task="${tasks[i]}">
		<img src="images/checkbox.svg" class="li-checkbox-image" alt="" id="li-checkbox-svg"> ${tasks[i]}
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
			<img class="article-urgent-svg" id="article-urgent-svg" src="images/urgent.svg" alt="urgent icon">
			<img class="article-delete-svg" id="article-delete-svg" src="images/delete.svg" alt="delete icon">
		</div>
		<div class="article-card-icon-labels flex">
			<label class="article-urgent-label" name="urgent" for="article-urgent-svg">Urgent</label>
			<label class="article-delete-label" name="delete" for="article-delete-svg">Delete</label>
		</div>
		</section>
	</article>
	` + cardSection.innerHTML;
	var checkBoxIcon = document.querySelectorAll('#li-checkbox-svg');
	for (var i = 0; i < checkBoxIcon.length; i ++) {
		checkBoxIcon[i].addEventListener('click', toggleCheckBox);
	}
}

function loadLists() {
	for (var i = 0; i < listArray.length; i++) {
		addListToDom(listArray[i].id, listArray[i].title, listArray[i].tasks);
	}
}

function removeItem(e) {
	event.target.parentElement.remove();
}

function toggleCheckBox(e) {
	var dataId = e.target.parentElement.dataset.id;
	var taskItem = e.target.parentElement.dataset.task;
	var parsedDataId = parseInt(dataId);
	//  find which toDo list object in listArray was just checked
	for (var i = 0; i < listArray.length; i++) {
		if (parsedDataId === listArray[i].id) {
			var pointer = listArray[i];

			//  find which index of the task array matches the task that was clicked on
			for (var x = 0; x < pointer.tasks.length; x++) {
				if (taskItem === pointer.tasks[x]) {
					
					var isItChecked = pointer.activeTasks[x];
					if (isItChecked === 0) {
						pointer.activeTasks[x] = 1;
						e.target.setAttribute('src', 'images/checkbox-active.svg');
					} else {
						pointer.activeTasks[x] = 0;
						e.target.setAttribute('src', 'images/checkbox.svg');
					}
					pointer.saveToStorage();
					pointer.updateTask(pointer, taskItem);
				}
			}
		}
	}
	//  set attribute to active if index value in activeTask array is 0, and vice versa
}

// function filterUrgency(e) {

// }