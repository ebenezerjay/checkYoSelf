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

var taskArray = JSON.parse(localStorage.getItem('task-card')) || [];

titleInput.addEventListener('input', disableBtn);
makeButton.addEventListener('click', onSaveClick);
clearButton.addEventListener('click', clearInputs);
filterButton.addEventListener('click', filterUrgency);
addItemIcon.addEventListener('click', addTaskToList);
window.addEventListener('load', onPageLoad);


function onPageLoad(e) {
	retrieveMethods(taskArray);
	// enterKeyPress(e);
}

function onSaveClick(e) {
	addToDoList(e);
	e.preventDefault();
}

function retrieveMethods(storedLists) {
  taskArray = [];
  for (i = 0; i < storedLists.length; i++) {
    var newList = new ToDoList(storedLists[i].id, storedLists[i].title, storedLists[i].tasks, storedLists[i].urgent);
    taskArray.push(newList);
  }
}

function disableBtn(e) {
	if (titleInput.value != '') {
			makeButton.disabled = false;
		} else {
			makeButton.disabled = true;
		}
	}
	
function addToDoList(e) {
	var newList = new ToDoList(Date.now(), titleInput.value);
	addListToDom(newList);
	taskArray.push(newList);
  newList.saveToStorage(taskArray);
	e.preventDefault();
}

function addTaskToList(e) {
	itemAddSection.innerHTML = 
	`	<ul class="article-list flex" id="article-list">
			<li class="article-list-item" id="list-item" data-id="${itemInput.value}">
				<img src="images/checkbox.svg" class="li-checkbox-image" alt=""> ${itemInput.value}
			</li>
		</ul>
	` + itemAddSection.innerHTML;
}

function addListToDom(id,title,tasks) {
	cardSection.innerHTML = 
	`<article class="append-card" data-id="${id}">
		<h2>${title}</h2>
		<ul class="article-list flex" id="article-list">
			<li class="article-list-item" id="list-item">
				<img src="images/checkbox.svg" class="li-checkbox-image" alt=""> ${tasks}
			</li>
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


// function enterKeyPress(e){
//   if(e.key === 'Enter'){
//   e.target.blur();
//   }
// }

function clearInputs(e) {
	
}

function filterUrgency(e) {

}