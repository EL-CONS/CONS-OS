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

        if (targetWindow) {
            targetWindow.classList.remove('hidden');
            
            if (targetId === 'color-settings-window') {
                document.getElementById('osColors').focus();
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
    switch (command) {
        case "HELP":
            print("--Available commands:--");
            print("HELP");
            print("LS");
            print("CD");
            print("ABOUT");
            print("CLEAR");
            print("RESET");
            print("EXIT");
            print("----------------------");
            break;
            
        case "ABOUT":
            print("WELCOME TO EL-CONS WEBSITE.");
            break;
            
        case "EXIT":
            while (terminal.firstChild !== input.parentElement) {
                terminal.removeChild(terminal.firstChild);
            }
            document.getElementById('terminal-window').classList.add('hidden');
            break;
            
        case "CLEAR":
            print("");
            while (terminal.firstChild !== input.parentElement) {
                terminal.removeChild(terminal.firstChild);
            }
            break;
        case "RESET":
            
            while (terminal.firstChild !== input.parentElement) {
                terminal.removeChild(terminal.firstChild);
            }
            print("Type 'help' for available commands.");
            break;
        case "REBOOT":         
        case "SHUTDOWN":
        case "RELOAD":
            location.reload();
            break
        case "LS":
            print("ABOUT_ME/");
            print("GITHUB/");
            print("ITCHIO/");
            break;
        case "CD ABOUT_ME":
                print("HI, IM EL-CONS. I'M A COMPUTER SCIENCE STUDENT");
                break;
        case "CD GITHUB":
                printLink("VISIt MY GITHUB PROFILE" ,"https://github.com/EL-CONS");
                break;
        case "CD ITCHIO":
                printLink("VISIT MY ITCHIO PROFILE C:", "https://el-cons.itch.io/");
                break;
        case "CONSFETCH":
            print("⣿⣿⣿⣿⣿⣿⣿⣿⠫⠂⡠⠁⠈⡄⡛⢻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿");
            print("⣿⣿⣿⣿⣿⣿⣿⣿⠁⣳⠁⡾⠠⢸⠇⠘⠛⠿⠛⠿⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿");
            print("⣿⣿⣿⣿⣿⣿⣿⣿⠂⢷⡀⣁⡠⠋⢠⣾⣡⣿⣿⣶⣦⣈⠛⢿⣿⣿⣿⣿⣿⣿");
            print("⣿⣿⣿⣿⣿⣿⣿⣿⣷⣄⡩⢻⡀⠀⣼⣿⠿⢿⣿⣿⣿⣿⣷⣄⠙⠫⡳⢂⠙⣿");
            print("⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⡄⠙⠸⠿⠿⠎⢷⣬⠅⣹⣿⣿⡏⠄⡜⡔⢁⠕⣿");
            print("⣿⣿⣿⣿⣿⣿⣿⣿⡟⠁⢐⣒⡛⠛⠛⠛⢛⠶⣥⣘⠻⣿⡟⠀⢸⡈⠲⢋⡼⡣");
            print("⣿⣿⣿⣿⠛⢄⣑⡙⢇⠸⣍⡇⡆⡕⢺⣽⡷⢆⡐⠙⢷⣌⠀⠇⢘⠷⣶⣋⢪⣶");
            print("⣿⡋⡻⠻⣦⡈⡛⠾⣍⣑⠐⢡⡳⣥⡨⠼⠇⠇⠈⢰⡄⡝⢧⣶⣷⣦⣤⣤⣶⣿");
            print("⠃⣤⡀⣦⣿⣿⣶⣶⣤⣉⢛⢓⣶⡌⠻⠰⣾⠶⠦⠛⠡⠿⢀⢴⣿⣿⣿⣿⣿⣿");
            print("⡞⠿⣧⣊⡛⠉⢻⠿⠟⢋⣄⢾⣿⣿⣮⣳⢆⣐⣦⣎⢗⢿⣶⣿⣿⣿⣿⣿⣿⣿");
            print("⣦⣥⣤⠉⠙⠀⠀⠁⠀⠉⠛⣿⣿⣿⣿⡟⢟⢇⣌⣹⠛⡮⢼⣉⣉⠉⢿⣿⣿⣿");
            print("⣿⣿⣿⡀⠀⠀⠀⠀⠀⠀⠀⠈⠛⢿⣿⣿⡿⢠⣿⣿⣿⣶⣧⣊⠟⠁⣸⣿⣿⣿");
            print("⣿⣿⣿⣿⣾⣴⣠⠀⠀⠀⠀⠀⠀⠀⠙⠿⠃⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿");
            print("⣿⣿⣿⣿⣿⣿⣿⣷⣧⡠⠀⠀⠀⠀⠀⠀⠘⠙⢿⣿⣿⠿⡿⣿⣿⣿⣿⣿⣿⣿");
            print("⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣄⢀⠀⠀⠀⡀⠳⣦⣉⣄⡂⠑⢹⣿⣿⣿⣿⣿⣿");
            print("⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣧⣆⣮⣾⣇⡼⠛⡟⢁⣵⣿⣿⣿⣿⣿⣿⣿");
            break;
            
        case "":
            
            break;
            
        default:
            print("Command not found: " + command);
            break;
    }

    input.value = "";
});

function printLink(text,url){
    const line =document.createElement("div");
    const link= document.createElement("a");

    link.href  =url;
    link.textContent=text;
    link.target="_blank";
    link.style.color = "var(--background-color-bright-green)"; 
    line.appendChild(link);

    terminal.insertBefore(line, input.parentElement);
}


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


const menu = document.getElementById('color-settings-window');

menu.addEventListener('change', (event) => {

  document.documentElement.setAttribute('data-theme', event.target.value);
});






