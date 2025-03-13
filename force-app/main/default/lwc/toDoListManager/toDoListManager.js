import { LightningElement, track } from 'lwc';
 
export default class TodoList extends LightningElement {
    @track tasks = [];
    @track newTask = '';
    taskId = 1;
 
    // Handle input change and update the newTask property
    handleInputChange(event) {
        this.newTask = event.target.value;
    }
 
    // Add a new task
    addTask() {
        if (this.newTask) {
            this.tasks.push({
                id: this.taskId++,
                name: this.newTask,
                completed: false,
                cssClass: '' // Initially, no class
            });
            this.newTask = ''; // Clear the input field after adding
        }
    }
 
    // Mark a task as complete
    completeTask(event) {
        const taskId = event.currentTarget.dataset.id;
        this.tasks = this.tasks.map(task => {
            if (task.id === parseInt(taskId, 10)) {
                task.completed = !task.completed;
                task.cssClass = task.completed ? 'completed' : ''; // Assign 'completed' class dynamically
            }
            return task;
        });
    }
 
    // Delete a task
    deleteTask(event) {
        const taskId = event.currentTarget.dataset.id;
        this.tasks = this.tasks.filter(task => task.id !== parseInt(taskId, 10));
    }
 
    // Clear all tasks
    clearList() {
        this.tasks = [];
    }
}
