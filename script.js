const input = document.getElementById("command");
const terminal = document.getElementById("terminal");
const date = new Date();
let hour = date.getHours();
let curentDate= date.getDay+ "/" + date.getMonth+ "/";


function updateClock() {
    const date = new Date();
    let h = date.getHours();
    let m = date.getMinutes();
    let s = date.getSeconds();
    
    const ampm = h >= 12 ? 'PM' : 'AM';

    h = h % 12;
    h = h ? h : 12; 
    m = m < 10 ? '0' + m : m;
    s = s < 10 ? '0' + s : s;

    const currentTime = h + ":" + m + ":" + s + " " + ampm;

    document.getElementById("clock").innerText = currentTime;
}

updateClock();

setInterval(updateClock, 1000);



const appLinks = document.querySelectorAll('.app-link');

appLinks.forEach(link => {
    link.addEventListener('click', () => {
        const targetId = link.getAttribute('data-target');
        const targetWindow = document.getElementById(targetId);
        
        if (targetWindow) {
            targetWindow.classList.remove('hidden');
            
            if (targetId === 'terminal-window') {
                document.getElementById('command').focus();
            }
        }
    });
});
const closeBtns = document.querySelectorAll('.close-btn');

closeBtns.forEach(btn => {
    btn.addEventListener('click', (event) => {
        const parentWindow = event.target.closest('.window');
        
        if (parentWindow) {
            parentWindow.classList.add('hidden');
        }
    });
});





input.addEventListener("keydown", function(event) {
    if (event.key !== "Enter") {
        return;
    }

    const command = input.value;
    const line = document.createElement("div");
    line.textContent = "user@CONS-OS:~$ " + command;
    terminal.insertBefore(line, input.parentElement);
    if (command === "HELP") {
        print("Available commands:");
        print("help");
        print("about");
        print("clear");
    }
    else if (command === "ABOUT") {
        print("This is my website.");
    }
    else if (command === "EXIT") {
          while (terminal.firstChild !== input.parentElement) {
            terminal.removeChild(terminal.firstChild);
        }
        document.getElementById('terminal-window').classList.add('hidden');
    }
    else if (command === "CLEAR" || command === "RESET") {
        while (terminal.firstChild !== input.parentElement) {
            terminal.removeChild(terminal.firstChild);
        }
    }
    else if (command === "LS") {
         print("");
    }
    else if (command !== "") {
        print("Command not found: " + command);
    }
    input.value = "";
});


function print(text) {
    const line = document.createElement("div");
    line.textContent = text;
    terminal.insertBefore(line, input.parentElement);
}
const menuBtn = document.getElementById('start-button');
const dropdownMenu = document.getElementById('dropdown-menu');

menuBtn.addEventListener('click', (event) => {
    event.stopPropagation(); 
    dropdownMenu.classList.toggle('hidden');
});

document.addEventListener('click', (event) => {
    
    if (!menuBtn.contains(event.target)) {
        dropdownMenu.classList.add('hidden');
    }
});

dropdownMenu.addEventListener('click', (event) => {
    event.stopPropagation();    
    dropdownMenu.classList.add('hidden');
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        dropdownMenu.classList.add('hidden');
    }
});





