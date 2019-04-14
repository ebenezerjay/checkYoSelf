class ToDoList {
    constructor(id,title,tasks,urgent) {
        this.id = id;
        this.title = title;
        this.tasks = [];
        this.urgent = urgent;
    }

    saveToStorage(taskArray) {
      localStorage.setItem('task-card', JSON.stringify(taskArray));
    }

    deleteFromStorage() {

    }

    updateToDo() {

    }

    updateTask() {

    }

}