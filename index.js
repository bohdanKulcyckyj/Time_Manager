//Define vars to hold time values
let seconds = 0;
let minutes = 0;
let hours = 0;
//Define vars to hold "display" value
let displaySeconds = 0;
let displayMinutes = 0;
let displayHours = 0;
//Define var to hold setInterval() function
let interval = null;
//Define var to hold stopwatch status
let status = "stopped";
//Defines where we are in app
var currentContentOnloaded = "main";
//Which activity is currently stopping
var stoppingActivity = null;
//DOM
const input = document.querySelector("#input-activity");
const addBtn = document.querySelector("#add-button");
const deleteBtns = document.querySelectorAll(".deleteBtn");
const statsButton = document.querySelector("#stats-button");
const inputContainer = document.querySelector("#add-activity");
const activityContainer = document.querySelector("#activity-container");
const removeAllDataButton = document.querySelector("#remove-all-data");
const toMainBtn = document.querySelector("#to-main");
const container = document.querySelector(".container");
//Data
let activities = JSON.parse(localStorage.getItem("activity_list")) || [];
let trackActivities = JSON.parse(localStorage.getItem("track_list")) || [];
let testArray = [];
//Page onload functions
//onlyToday();
displayUpdatedActivities();
sortingAlgorithm();
//Stopwatch function (logic to determine when to increment next value, etc.)
function stopWatch() {
    seconds++;
    //Logic to determine when to increment next value
    if (seconds / 60 === 1) {
        seconds = 0;
        minutes++;

        if (minutes / 60 === 1) {
            minutes = 0;
            hours++;
        }
    }
    //If seconds/minutes/hours are only one digit, add a leading 0 to the value
    if (seconds < 10) {
        displaySeconds = "0" + seconds.toString();
    }
    else {
        displaySeconds = seconds;
    }

    if (minutes < 10) {
        displayMinutes = "0" + minutes.toString();
    }
    else {
        displayMinutes = minutes;
    }

    if (hours < 10) {
        displayHours = "0" + hours.toString();
    }
    else {
        displayHours = hours;
    }
    //Display updated time values to user
    document.getElementById("display").innerHTML = displayHours + ":" + displayMinutes + ":" + displaySeconds;

    for(let i = 0; i < activities.length; i++) {
        if(activities[i].name === stoppingActivity) {
            activities[i].time.h = hours;
            activities[i].time.m = minutes;
            activities[i].time.s = seconds;
        }
    }
    localStorage.setItem("activity_list", JSON.stringify(activities));
}

function startStop() {
    if (status === "stopped") {
        //Start the stopwatch (by calling the setInterval() function)
        interval = window.setInterval(stopWatch, 1000);
        document.getElementById("startStop").innerHTML = "Stop";
        status = "started";
    }
    else {
        window.clearInterval(interval);
        document.getElementById("startStop").innerHTML = "Start";
        status = "stopped";
    }
    document.getElementById("startStop").classList.toggle("default");
}

//Function to reset the stopwatch
function reset() {
    window.clearInterval(interval);
    seconds = 0;
    minutes = 0;
    hours = 0;
    document.getElementById("display").innerHTML = "00:00:00";
    document.getElementById("startStop").innerHTML = "Start";
}

function saveIt() {
    for(let i = 0; i < activities.length; i++) {
        if(activities[i].name === stoppingActivity) {
            trackActivities.push({name: stoppingActivity, time : {date : new Date().getDate(), month : new Date().getMonth(), year : "2021"}, h: activities[i].time.h, m :  activities[i].time.m, s: activities[i].time.s});
            localStorage.setItem("track_list", JSON.stringify(trackActivities));
        }
    }
    window.clearInterval(interval);
    seconds = 0;
    minutes = 0;
    hours = 0;
    removeAll();
    onloadData();
    toMainBtn.classList.add("hide");
    removeAllDataButton.classList.remove("hide");
}

function removeAll() {
    while(container.hasChildNodes()) {
        container.removeChild(container.firstChild);
    }
}

function addActivity() {
    if (input.value === "") {
        alert("Please add Activity");
    } else {
    activities.push({name : input.value, time : {h : 0, m : 0, s : 0}});
    localStorage.setItem("activity_list", JSON.stringify(activities));
    let currentActivity = `<div class="activity" onclick="startTracking(this)" id="${input.value}"><span>${input.value}</span><i class="fas fa-trash" onclick="event.stopPropagation(); deleteActivity(this)"></i></div>`;
    activityContainer.innerHTML += currentActivity;
    input.value = "";
    }
}

function deleteActivity(element) {
    let parent = element.parentNode;
    parent.parentNode.removeChild(parent);
    activities = activities.filter(item => item.name !== parent.getAttribute("id"));
    trackActivities = trackActivities.filter(item => item.name !== parent.getAttribute("id"));
    localStorage.setItem("activity_list", JSON.stringify(activities));
    localStorage.setItem("track_list", JSON.stringify(trackActivities));
}

function startTracking(element) {
    inputContainer.classList.add("hide");
    activityContainer.classList.add("hide");
    statsButton.classList.add("hide");
    toMainBtn.classList.remove("hide");
    removeAllDataButton.classList.add("hide");
    stoppingActivity = element.getAttribute("id");
    let activityEl = `    <div id="current-activity">${element.getAttribute("id")}</div>
    
                          <div id="display">
                                00:00:00
                          </div>

                          <div class="buttons">
                            <button class="btns default" id="startStop" onclick="startStop()">
                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>
                                Start
                            </button>
                            <button class="btns" id="reset" onclick="reset()">
                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>
                                Reset
                            </button>
                            <button class="btns" id="save" onclick="saveIt()">
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                            Save
                        </button>
                          </div>`;
    container.innerHTML += activityEl;
}

function onloadData() {
    container.appendChild(inputContainer);
    container.appendChild(activityContainer);
    inputContainer.classList.remove("hide");
    activityContainer.classList.remove("hide");
    statsButton.classList.remove("hide");
}

function showStats() {
    let table = document.createElement("table");
    let closeTags = document.querySelectorAll(".close");
    let headRow = `<tr class="head-row">
    <th class="head-unit">Activity</th>
    <th class="head-unit">Date</th>
    <th class="head-unit">Time</th>
    </tr>`;
    let statRow;
    removeAll();
    dayStatAnchor();
    //setSleepingTime();
    if(trackActivities.length < 1) {
        headRow = `<tr class="head-row hide">
        <th class="head-unit">Activity</th>
        <th class="head-unit">Date</th>
        <th class="head-unit">Time</th>
        </tr>`;
    }
    container.appendChild(table);
    table.classList.add("stat-table");
    table.innerHTML = headRow;
    for(let i = 0; i < trackActivities.length; i++) {
    let curr = trackActivities[i];
    statRow = `<tr class="stat-row">
                    <td class="stat-unit">${curr.name}</td>
                    <td class="stat-unit">${curr.time.date < 10 ? "0" + curr.time.date : curr.time.date}.${(curr.time.month + 1) < 10 ? "0" + (curr.time.month + 1) : (curr.time.month + 1)}.${curr.time.year}</td>
                    <td class="stat-unit">${curr.h < 10 ? "0" + curr.h : curr.h}:${curr.m < 10 ? "0" + curr.m : curr.m}:${curr.s < 10 ? "0" + curr.s : curr.s}</td>
                    <td class="stat-unit close hide" id="${curr.name}"><i class="fas fa-times" id="${curr.name}-btn"></i></td>
               </tr>`;
    table.innerHTML += statRow;
    }
    toMainBtn.classList.remove("hide");
    removeAllDataButton.classList.add("hide");
    statsButton.classList.add("hide");
}

function removeAllData() {
    activities = [];
    trackActivities = [];
    localStorage.setItem("activity_list", JSON.stringify(activities));
    localStorage.setItem("track_list", JSON.stringify(trackActivities));
    removeAll();
    onloadData();
    toMainBtn.classList.add("hide");
    displayUpdatedActivities();
    location.reload();
}

function displayUpdatedActivities() {
    for(let i = 0; i < activities.length; i++) {
        activityContainer.innerHTML += `<div class="activity" onclick="startTracking(this)" id="${activities[i].name}"><span>${activities[i].name}</span><i class="fas fa-trash" onclick="event.stopPropagation(); deleteActivity(this)"></i></div>`;
    }
}

function onlyToday() {
    if(trackActivities = []) {
        return;
    }
    else if(trackActivities[trackActivities.length - 1].time.date !== new Date().getDate()) {
        activities = [];
        trackActivities = [];
        localStorage.setItem("activity_list", JSON.stringify(activities));
        localStorage.setItem("track_list", JSON.stringify(trackActivities));
    }
}

function setSleepingTime() {
    let sleepingContainer = `<div class="sleeptime-container">
    <input type="time" class="sleeptime" value="07:00" id="" />
    <input type="time" class="sleeptime" value="23:00" id="" />
    </div>`;
    container.innerHTML += sleepingContainer;
}

function dayStatAnchor() {
    let daysContainer = document.createElement("div");
    container.appendChild(daysContainer);
    daysContainer.classList.add("days-container");
    let eachDayAnc;
    //return console.log("Days stats anchors onloaded");
    for(let i = 0; i < testArray.length; i++) {
        let curr = testArray[i]
        eachDayAnc = `<div class="day-stats" onclick="showDayStat()">${curr.date < 10 ? "0" + curr.date : curr.date}.${(curr.month + 1) < 10 ? "0" + (curr.month + 1) : (curr.month + 1)}</div>`;
        daysContainer.innerHTML += eachDayAnc;
    }
}

function sortingAlgorithm() {
    let filteredArr;
    for(let i = 0; i <= 31; i++) {
        filteredArr = trackActivities.filter(item => item.time.date === i);
        if(filteredArr.length !== 0) {
            let pushObject = {date : filteredArr[0].time.date, month : (filteredArr[0].time.month + 1), year : 2021, activity : [...filteredArr]};
            testArray.push(pushObject);
            //console.log(filteredArr);
        }
    }
    //console.log(testArray);
}

//Event listeners
addBtn.addEventListener("click", addActivity);

removeAllDataButton.addEventListener("click", removeAllData);

statsButton.addEventListener("click", showStats);

toMainBtn.addEventListener("click", () => {
    removeAll();
    onloadData();
    toMainBtn.classList.add("hide");
    removeAllDataButton.classList.remove("hide");
});

input.addEventListener('keydown', (e) => {
    if(e.which == 13){
        addActivity();
    }
});