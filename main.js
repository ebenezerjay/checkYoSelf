var searchInput = document.querySelector('#header-search-input');
var titleInput = document.querySelector('#form-title-input');
var itemInput = document.querySelector('#form-item-input');
var makeButton = document.querySelector('#form-make-button');
var clearButton = document.querySelector('#form-clear-button');
var filterButton = document.querySelector('#form-filter-button');
var urgentIcon = document.querySelector('#article-urgent-svg');
var deleteIcon = document.querySelector('#article-delete-svg');
var addItemIcon = document.querySelector('#form-plus-icon');

var itemAddSection = document.querySelector('#form-item-section');
var cardSection = document.querySelector('#append-card-section');

var listArray = [];
var pendingTaskArray = [];
var listIds = [];

titleInput.addEventListener('input', disableBtn);
makeButton.addEventListener('click', onSaveClick);
// clearButton.addEventListener('click', clearFields);
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
	// enterKeyPress(e);
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
		} else {
			makeButton.disabled = true;
			clearButton.disabled = true;
		}
	}
	
function saveToDoList() {
	console.log(titleInput.value)
	console.log(listArray)
	var newList = new ToDoList(Date.now(), titleInput.value,pendingTaskArray);
	addListToDom(newList.id, newList.title, newList.tasks);
	listIds.push(newList.id);
	localStorage.setItem('masterList', JSON.stringify(listIds));
	listArray.push(newList);
	newList.saveToStorage();
	clearFields();
	// e.preventDefault();
}

function clearFields() {
	titleInput.value = "";
	itemInput.value = "";
	itemAddSection.innerHTML = "";
}

function pendingTasks() {
	pendingTaskArray.push(itemInput.value);
}

function addTaskToList(e) {
	pendingTasks();
	itemAddSection.innerHTML = 
	`	<ul class="article-list flex" id="article-list">
			<li class="article-list-item" id="list-item" data-id="${itemInput.value}">
				<img src="images/checkbox.svg" class="li-checkbox-image" alt=""> ${itemInput.value}
			</li>
		</ul>
	` + itemAddSection.innerHTML;
	itemInput.value = "";
	console.log(pendingTaskArray)
}


function addListToDom(id,title,tasks) {
	var listItem = "";
	for (var i = 0; i < tasks.length; i++) {
		listItem += `<li class="article-list-item" id="list-item">
		<img src="images/checkbox.svg" class="li-checkbox-image" alt=""> ${tasks[i]}
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
}

function loadLists() {
	for (var i = 0; i < listArray.length; i++) {
		addListToDom(listArray[i].id, listArray[i].title, listArray[i].tasks);
	}
}

// function enterKeyPress(e){
//   if(e.key === 'Enter'){
//   e.target.blur();
//   }
// }

// function filterUrgency(e) {

// }