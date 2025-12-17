document.addEventListener('DOMContentLoaded', () => {
    const todoInput = document.getElementById('todo-input');
    const addBtn = document.getElementById('add-btn');
    const todoList = document.getElementById('todo-list');
    const emptyState = document.getElementById('empty-state');

    // Load tasks from local storage
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    
    // Initialize UI
    renderTasks();

    // Event Listeners
    addBtn.addEventListener('click', addTask);
    todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });

    function addTask() {
        const taskText = todoInput.value.trim();
        if (taskText === '') return;

        const newTask = {
            id: Date.now(),
            text: taskText,
            completed: false
        };

        tasks.push(newTask);
        saveTasks();
        renderTask(newTask);
        todoInput.value = '';
        checkEmptyState();
    }

    function renderTasks() {
        todoList.innerHTML = '';
        tasks.forEach(task => renderTask(task));
        checkEmptyState();
    }

    function renderTask(task) {
        const li = document.createElement('li');
        li.className = `todo-item ${task.completed ? 'completed' : ''}`;
        li.setAttribute('data-id', task.id);

        li.innerHTML = `
            <div class="todo-content">
                <div class="checkbox"></div>
                <span class="text">${escapeHtml(task.text)}</span>
            </div>
            <button class="delete-btn" aria-label="Delete task">
                <span class="material-icons-round">delete</span>
            </button>
        `;

        // Event listeners for individual task
        const contentDiv = li.querySelector('.todo-content');
        const deleteBtn = li.querySelector('.delete-btn');

        contentDiv.addEventListener('click', () => toggleTask(task.id, li));
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            deleteTask(task.id, li);
        });

        // Add to list (if it's new, it will animate in via CSS)
        // If we render all at start, CSS animation runs for all which looks nice
        todoList.insertBefore(li, todoList.firstChild);
    }

    function toggleTask(id, li) {
        const task = tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            li.classList.toggle('completed');
            saveTasks();
        }
    }

    function deleteTask(id, li) {
        // Add removing class for animation
        li.classList.add('removing');

        // Wait for animation to finish before removing from DOM
        li.addEventListener('transitionend', () => {
            tasks = tasks.filter(t => t.id !== id);
            saveTasks();
            if (li.parentNode) {
                li.parentNode.removeChild(li);
            }
            checkEmptyState();
        });
    }

    function checkEmptyState() {
        if (tasks.length === 0) {
            emptyState.style.display = 'flex';
        } else {
            emptyState.style.display = 'none';
        }
    }

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
});
