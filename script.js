document.addEventListener('DOMContentLoaded', function() {
    loadTasks();
});

document.getElementById('taskForm').addEventListener('submit', addTask);

function addTask(e) {
    e.preventDefault();

    const taskName = document.getElementById('taskName').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const responsible = document.getElementById('responsible').value;

    if (new Date(endDate) < new Date(startDate)) {
        alert("La fecha de fin no puede ser menor a la fecha de inicio.");
        return;
    }

    const task = {
        id: Date.now(),
        taskName,
        startDate,
        endDate,
        responsible,
        completed: false
    };

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));

    document.getElementById('taskForm').reset();
    loadTasks();
}

function loadTasks() {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.dataset.id = task.id;
        li.innerHTML = `
            <span>${task.taskName}</span>
            <span> (Inicio: ${task.startDate}, Fin: ${task.endDate}, Responsable: ${task.responsible})</span>
            <button class="btn btn-danger btn-sm float-right ml-2 delete-task">Eliminar</button>
        `;

        const endDate = new Date(task.endDate);
        const now = new Date();

        if (task.completed) {
            li.classList.add('completed');
            li.innerHTML += `
                <button class="btn btn-warning btn-sm float-right ml-2 unmark-completed">Desmarcar</button>
            `;
        } else if (endDate < now) {
            li.classList.add('expired');
        } else {
            li.classList.add('pending');
            li.innerHTML += `
                <button class="btn btn-success btn-sm float-right ml-2 mark-completed">Marcar como resuelta</button>
            `;
        }

        taskList.appendChild(li);
    });
}

document.getElementById('taskList').addEventListener('click', function (e) {
    if (e.target.classList.contains('delete-task')) {
        deleteTask(e.target.parentElement.dataset.id);
    } else if (e.target.classList.contains('mark-completed')) {
        markTaskCompleted(e.target.parentElement.dataset.id);
    } else if (e.target.classList.contains('unmark-completed')) {
        unmarkTaskCompleted(e.target.parentElement.dataset.id);
    }
});

function deleteTask(id) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.filter(task => task.id != id);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    loadTasks();
}

function markTaskCompleted(id) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.map(task => {
        if (task.id == id && new Date(task.endDate) >= new Date()) {
            task.completed = true;
        }
        return task;
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
    loadTasks();
}

function unmarkTaskCompleted(id) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.map(task => {
        if (task.id == id) {
            task.completed = false;
        }
        return task;
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
    loadTasks();
}

// Función para buscar tareas por nombre
function searchTasks(query) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const filteredTasks = tasks.filter(task => task.taskName.toLowerCase().includes(query.toLowerCase()));
    displayTasks(filteredTasks);
}

// Función para mostrar tareas en la lista
function displayTasks(tasks) {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.dataset.id = task.id;
        li.innerHTML = `
            <span>${task.taskName}</span>
            <span> (Inicio: ${task.startDate}, Fin: ${task.endDate}, Responsable: ${task.responsible})</span>
            <button class="btn btn-danger btn-sm float-right ml-2 delete-task">Eliminar</button>
        `;

        const endDate = new Date(task.endDate);
        const now = new Date();

        if (task.completed) {
            li.classList.add('completed');
            li.innerHTML += `
                <button class="btn btn-warning btn-sm float-right ml-2 unmark-completed">Desmarcar</button>
            `;
        } else if (endDate < now) {
            li.classList.add('expired');
        } else {
            li.classList.add('pending');
            li.innerHTML += `
                <button class="btn btn-success btn-sm float-right ml-2 mark-completed">Marcar como resuelta</button>
            `;
        }

        taskList.appendChild(li);
    });
}

// Evento de búsqueda de tareas
document.getElementById('search').addEventListener('input', function() {
    const query = this.value.trim();
    searchTasks(query);
});

// Cargar tareas al cargar la página
loadTasks();
