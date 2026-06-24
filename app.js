document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');

    // Function to add a new task
    function addTask() {
        const taskText = taskInput.value.trim();

        if (taskText === '') {
            return; // Don't add empty tasks
        }

        // Create new list item
        const li = document.createElement('li');

        // Create task text span
        const taskSpan = document.createElement('span');
        taskSpan.className = 'task-text';
        taskSpan.textContent = taskText;

        // Create delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = 'Delete';

        // Append elements
        li.appendChild(taskSpan);
        li.appendChild(deleteBtn);
        taskList.appendChild(li);

        // Clear input field
        taskInput.value = '';
    }

    // Function to handle clicks on the task list (for deleting tasks)
    function handleTaskListClick(event) {
        if (event.target.classList.contains('delete-btn')) {
            const li = event.target.parentElement;
            taskList.removeChild(li);
        }
    }

    // Event Listeners
    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            addTask();
        }
    });
    taskList.addEventListener('click', handleTaskListClick);
});
