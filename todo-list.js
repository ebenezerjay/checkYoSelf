class ToDoList {
    constructor(id,title,tasks,urgent) {
        this.id = id;			// number holding the id of the todo list
        this.title = title;			// sting holding the title of todo list
				this.tasks = tasks; 		// array of strings
				this.urgent = urgent; 
    }

		// saves list object to storage
    saveToStorage() {
			var array = [this.id, this.title, this.tasks, this.urgent];
			localStorage.setItem(this.id, JSON.stringify(array));
		}
		
		// unpacks object data that is brought back into storage each time there is a new inst
		loadFromStorage(id) {
			var idStorage = JSON.parse(localStorage.getItem(id));
			this.id = idStorage[0];
			this.title = idStorage[1];
			this.tasks = idStorage[2];
			this.urgent = idStorage[4];
		}

    deleteFromStorage(index) {
		  listArray.splice(index, 1);
    	// this.saveToStorage(listArray);
			localStorage.setItem(this.id, JSON.stringify(listArray));
    }

    updateToDo() {
		}
		
    updateTask(tasks,taskItem) {
			console.log(taskItem)
			ToDoList.tasks = taskItem;
			this.saveToStorage(tasks);			
    }

}