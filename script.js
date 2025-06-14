let habits = [];

function addHabit() {
    let habitName = document.getElementById("habitInput").value.trim();
    if (!habitName) return alert("Введите название привычки!");

    habits.push({
        name: habitName,
        progress: [false, false, false, false, false, false, false]
    })

    document.getElementById("habitInput").value = "";
    saveHabits();
    renderHabits();
}

function toggleDay(habitIndex, dayIndex) {
    habits[habitIndex].progress[dayIndex] = !habits[habitIndex].progress[dayIndex];
    saveHabits();
    renderHabits();
}

function deleteHabit(index) {
    habits.splice(index, 1);
    saveHabits();
    renderHabits();
}

function saveHabits() {
    localStorage.setItem("habits", JSON.stringify(habits));
    updateChart();
}

function loadHabits() {
    let saved = localStorage.getItem("habits");
    if (saved){
        habits = JSON.parse(saved);
        renderHabits();
        updateChart();
    }
}

function renderHabits() {
    let table = document.getElementById("habitTable");
    table.innerHTML = "";

    habits.forEach((habit, habitIndex) => {
        let row = table.insertRow();
        let nameCell = row.insertCell(0);
        nameCell.textContent = habit.name;

        for (let i = 0; i < 7; i++) {
            let cell = row.insertCell(i + 1);
            cell.textContent = habit.progress[i] ? "✔" : "";
            cell.classList.toggle("completed", habit.progress[i]);
            cell.onclick = () => toggleDay(habitIndex, i);
        }

        let deleteCell = row.insertCell(8);
        deleteCell.innerHTML = `<button onclick = "deleteHabit(${habitIndex})">🗑</button>`
    })
}

let progressChart;

function updateChart(){
    let ctx = document.getElementById("progressChart").getContext("2d");
    let data = habits.map(h => h.progress.filter(p => p).length);

    if(progressChart) {
        progressChart.destroy();
    }

    progressChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: habits.map(h => h.name),
            datasets: [{
                label: "Прогресс (дней)",
                data: data,
                backgroundColor: "blue"
            }]
        }
    })
}

window.onload = loadHabits;


function toggleTheme() {
    document.body.classList.toggle("dark-mode");

    //сохраняем тему в LocalStorage
    if (document.body.classList.contains("dark-mode")) {
        localStorage.setItem("theme", "dark");
    } else {
        localStorage.setItem("theme", "light");
    }
}

//При загрузке страницы проверяем, была ли включена темная тема
window.onload = function() {
    loadHabits(); //загружаем привычки

    if (localStorage.getItem("theme") === "dark"){
        document.body.classList.add("dark-mode");
    }
}

//автоматически подстраивается под темную или светлую тему
if (!localStorage.getItem("theme")) {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches){
        document.body.classList.add("dark-mode");
    }
}