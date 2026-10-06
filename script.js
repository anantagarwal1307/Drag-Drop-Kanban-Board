let tasksData = {};


const todo = document.querySelector('#todo');
const progress = document.querySelector('#progress');
const done = document.querySelector('#done');
const columns = [todo, progress, done];
let dragElement = null;


const tasks = document.querySelectorAll('.task');

function addTask(title, desc, column) {
    const div = document.createElement("div");

    div.classList.add("task");
    div.setAttribute("draggable", "true");
    
    div.innerHTML = `
        <h2>${title}</h2>
        <p>${desc}</p>
        <button>Delete</button>
    `

    column.appendChild(div)

    div.addEventListener("drag", (e) => {
        dragElement = div;
    })

    const deleteButton = div.querySelector("button");

    deleteButton.addEventListener("click", () => {
        div.remove();
        updateTaskCount();
    })

    return div;
    
}

function updateTaskCount(){
    columns.forEach(col => {
        const columnTasks = col.querySelectorAll(".task");
        const count = col.querySelector(".heading .right");

        tasksData[ col.id ] = Array.from(columnTasks).map(t => {
            return{
                title: t.querySelector("h2").innerText,
                desc: t.querySelector("p").innerText
            }
        })

        count.innerText = columnTasks.length;
    });
    
    localStorage.setItem("tasks", JSON.stringify(tasksData)); // outside the loop: save once, after all 3 columns are filled

}

if(localStorage.getItem("tasks")) {
    const data = JSON.parse(localStorage.getItem("tasks"));

    console.log("data from local stieage", data);
    
    for(const col in data){
        const column = document.querySelector(`#${col}`);
        data[col].forEach(task => {
            addTask(task.title, task.desc, column);
        })
    }

    updateTaskCount();
}



tasks.forEach(task => {
    task.addEventListener("drag", (e) => {
        // console.log("dragging", e);
        dragElement = task;
    })
})


function addDragEventsOnColumn(column){
    column.addEventListener("dragenter", (e) => {
        e.preventDefault();
        column.classList.add("hover-over");
    })
    column.addEventListener("dragleave", (e) => {
        e.preventDefault();
        column.classList.remove("hover-over");
    })

    column.addEventListener("dragover", (e) => {
        e.preventDefault();
    })

    column.addEventListener("drop", (e) => {
        e.preventDefault();


        column.appendChild(dragElement);
        column.classList.remove("hover-over");

        updateTaskCount();
      
    })
}

addDragEventsOnColumn(todo);
addDragEventsOnColumn(progress);
addDragEventsOnColumn(done);


// Modal related logic
const toggleModelButton = document.querySelector("#toggle-modal");
const modalBg = document.querySelector(".modal .bg")
const modal = document.querySelector(".modal");
const addTaskButton = document.querySelector("#add-new-task");


toggleModelButton.addEventListener("click", () => {
    modal.classList.toggle("active");
})

modalBg.addEventListener("click", () => {
    modal.classList.remove("active");
})

addTaskButton.addEventListener("click", () => {
    const taskTitle = document.querySelector("#task-title-input").value
    const taskDesc = document.querySelector("#task-desc-input").value

    addTask(taskTitle, taskDesc, todo);

    updateTaskCount();

    modal.classList.remove("active")

    document.querySelector("#task-title-input").value = "";
    document.querySelector("#task-desc-input").value = "";

})
