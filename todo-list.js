class ToDoList {
    constructor(id,title,tasks,activeTasks,urgent) {
        this.id = id;			// number holding the id of the todo list
        this.title = title;			// sting holding the title of todo list
				this.tasks = tasks; 		// array of strings
				this.activeTasks = activeTasks; 		// array of zeros and 1's that mathes the length of this.tasks, 1 = active,0 = non active
        this.urgent = urgent; 
    }

    saveToStorage() {
			var array = [this.id, this.title, this.tasks, this.activeTasks, this.urgent];
			localStorage.setItem(this.id, JSON.stringify(array));
		}
		
		loadFromStorage(id) {
			var idStorage = JSON.parse(localStorage.getItem(id));
			this.id = idStorage[0];
			this.title = idStorage[1];
			this.tasks = idStorage[2];
			this.activeTasks = idStorage[3];
			this.urgent = idStorage[4];
		}

    deleteFromStorage(id) {
		var listArray = this.loadFromStorage();
    // listArray.splice(id, 1);
    this.saveToStorage(listArray);
    }

    updateToDo() {
		}
		
    updateTask(tasks,taskItem) {
			ToDoList.tasks = taskItem;
			this.saveToStorage(tasks);			
    }

}