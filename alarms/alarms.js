let currentTime = document.getElementById("time");
let dateInput = document.getElementById("alarmDate");
let timeInput = document.getElementById("alarmTime");
let setAlarmButton = document.getElementById("setAlarm");
let alarmsDisplayDiv = document.getElementById("alarms");
let errorMessage = document.getElementById("errorMessage");
let volumeSlider = document.getElementById("volumeRange");
let volumeIcon = document.getElementById("volumeIcon");
let maxValue = 10; // check if need max value
let count = 0;
const alarmsObj = {};
const audio = new Audio('../audio/alarm-clock-loud.mp3');
audio.volume = 0.5; // 0 to 1

function initDateAndTime() {
	const curr = new Date();
	dateInput.min = new Date().toLocaleDateString('fr-ca');
	dateInput.value = new Date().toLocaleDateString('fr-ca');
	timeInput.value = `${String(curr.getHours()).padStart(2, "0")}:${String(curr.getMinutes() + 5).padStart(2, "0")}`; // Default time is +5 minutes after current
}

function adjustVolume() {
	const volumeValue = parseInt(volumeSlider.value);
	// Set icon accordingly
	if (volumeValue === 0) {
		volumeIcon.src = "../icons/volume-mute.svg";
	} else if (volumeValue > 0 && volumeValue <= 50) {
		volumeIcon.src = "../icons/volume-down.svg";
	} else {
		volumeIcon.src = "../icons/volume-up.svg"
	}
	// Set volume
	audio.volume = volumeValue / 100;
}

function timeChangeFunction() {
	const curr = new Date();
	let min = String(curr.getMinutes()).padStart(2, "0");
	let sec = String(curr.getSeconds()).padStart(2, "0");
	let hrs = curr.getHours();
	let period = "AM";
	if (hrs >= 12) {
		period = "PM";
		if (hrs > 12) {
			hrs -= 12;
		}
	}
	hrs = String(hrs).padStart(2, "0");
	currentTime.textContent = `${hrs}:${min}:${sec} ${period}`;
	
	// Checking alarms here
	let selectedDateString = curr.toLocaleString();
	if (selectedDateString in alarmsObj) {
		playAlert()
		cleanUpAlarm(selectedDateString);
	}
}

function playAlert() {
  audio.play();
	// alert("Time to wake up laaaaaaaaaa!");
}

function cleanUpAlarm(selectedDateString) {
	let currAlarm = document.getElementById(selectedDateString);
	currAlarm.remove();
	count--;
	delete alarmsObj[selectedDateString];
}

function alarmSetFunction() {
	let now = new Date();
	let selectedDate = new Date(dateInput.value + "T" + timeInput.value);
	let selectedDateString = selectedDate.toLocaleString();
	// Validations
	if (selectedDate <= now) {
		errorMessage.textContent = `Invalid time. Please select a future date and time.`;
		return;
	} else if (selectedDateString in alarmsObj) {
		errorMessage.textContent = `You cannot set multiple alarms for the same time.`;
		return;
	} else if (count >= maxValue) {
		errorMessage.textContent = `You have reached the limit of ${maxValue} alarms`;
		return;
	} else {
		errorMessage.textContent = ``
	}

	// Create HTML element
	let alarmDiv = document.createElement("div");
	alarmDiv.classList.add("alarm");
	alarmDiv.id = selectedDateString;
	alarmDiv.innerHTML = `
		<span class="alarm-time">${selectedDateString}</span>
		<input class="alarm-note" placeholder="Type a note for this alarm"></input>
		<button class="alarm-delete">Delete</button>
	`;
	// Set delete button
	alarmDiv
		.querySelector(".alarm-delete")
		.addEventListener("click", () => {
			cleanUpAlarm(selectedDateString);
		});
	alarmsDisplayDiv.appendChild(alarmDiv);
	alarmsObj[selectedDateString] = {
		value: selectedDateString
	}
	count++;
}

setAlarmButton.addEventListener("click", alarmSetFunction);
volumeSlider.addEventListener("change", adjustVolume)
setInterval(timeChangeFunction, 1000);
timeChangeFunction();
initDateAndTime();