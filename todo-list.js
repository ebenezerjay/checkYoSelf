class ToDoList {
    constructor(id,title,tasks,urgent) {
        this.id = id;
        this.title = title;
        this.tasks = tasks;
        this.urgent = urgent;
    }

    saveToStorage() {
			var array = [this.id, this.title, this.tasks, this.urgent];
			localStorage.setItem(this.id, JSON.stringify(array));
		}
		
		loadFromStorage(id) {
			var idStorage = JSON.parse(localStorage.getItem(id));
			this.id = idStorage[0];
			this.title = idStorage[1];
			this.tasks = idStorage[2];
			this.urgent = idStorage[3];
		}

    deleteFromStorage() {

    }

    updateToDo() {

    }

    updateTask() {

    }

}