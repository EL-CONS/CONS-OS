const input = document.getElementById("command");
const terminal = document.getElementById("terminal");

if (input) {
    Object.defineProperty(input, 'value', {
        get() {
            return (this.textContent || '').replace(/[\r\n]+/g, '');
        },
        set(val) {
            this.textContent = val;
            if (document.activeElement === this) {
                const range = document.createRange();
                range.selectNodeContents(this);
                range.collapse(false);
                const sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
            }
            if (terminal) {
                terminal.scrollTop = terminal.scrollHeight;
            }
        },
        configurable: true
    });

    input.addEventListener("input", () => {
        if (terminal) {
            terminal.scrollTop = terminal.scrollHeight;
        }
    });
}

if (terminal) {
    terminal.addEventListener("click", (e) => {
        if (e.target && e.target.tagName && e.target.tagName.toLowerCase() === 'a') return;
        if (input) input.focus();
    });
}

const date = new Date();
let hour = date.getHours();
let curentDate= date.getDay+ "/" + date.getMonth+ "/";
document.getElementById('theme1').checked =true;


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



const taskbarAppsContainer = document.getElementById('taskbar-apps');
let activeWindowId = null;

const APP_SHORT_NAMES = {
    'terminal-window': 'TERM.',
    'color-settings-window': 'COLOR.S.',
    'files-window': 'FILES',
    'empty-window': 'LIGHTS',
    'notes-window': 'JOURN.'
};

function getAppShortName(id, fullTitle) {
    if (APP_SHORT_NAMES[id]) {
        return APP_SHORT_NAMES[id];
    }
    const clean = fullTitle.trim().toUpperCase();
    if (clean.length <= 6) {
        return clean;
    }
    return clean.substring(0, 5) + '.';
}


if (taskbarAppsContainer) {
    
    taskbarAppsContainer.addEventListener('wheel', (e) => {
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
            e.preventDefault();
            taskbarAppsContainer.scrollLeft += e.deltaY;
        }
    }, { passive: false });

    
    let isMouseDown = false;
    let startPageX = 0;
    let scrollStart = 0;
    let hasMoved = false;

    taskbarAppsContainer.addEventListener('mousedown', (e) => {
        if (e.button !== 0) return; 
        isMouseDown = true;
        hasMoved = false;
        startPageX = e.pageX;
        scrollStart = taskbarAppsContainer.scrollLeft;
    });

    window.addEventListener('mousemove', (e) => {
        if (!isMouseDown) return;
        const diff = e.pageX - startPageX;
        if (Math.abs(diff) > 4) {
            hasMoved = true;
            taskbarAppsContainer.classList.add('is-dragging');
        }
        taskbarAppsContainer.scrollLeft = scrollStart - diff;
    });

    window.addEventListener('mouseup', () => {
        if (isMouseDown) {
            isMouseDown = false;
            taskbarAppsContainer.classList.remove('is-dragging');
    
            setTimeout(() => {
                hasMoved = false;
            }, 50);
        }
    });

    
    taskbarAppsContainer.addEventListener('click', (e) => {
        if (hasMoved) {
            e.stopPropagation();
            e.preventDefault();
        }
    }, true);
}

function updateTaskbar() {
    if (!taskbarAppsContainer) return;
    taskbarAppsContainer.innerHTML = '';

    const openWindows = document.querySelectorAll('.window:not(.hidden)');

    openWindows.forEach(win => {
        const id = win.id;
        const titleSpan = win.querySelector('.window-header span');
        const title = titleSpan ? titleSpan.textContent.trim() : id;
        const shortTitle = getAppShortName(id, title);

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'taskbar-app-btn' + (id === activeWindowId ? ' active' : '');
        btn.textContent = shortTitle;
        btn.title = title; 
        btn.dataset.target = id;

        if (id === activeWindowId) {
            setTimeout(() => {
                btn.scrollIntoView({ behavior: 'smooth', inline: 'nearest', block: 'nearest' });
            }, 10);
        }

        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (activeWindowId === id) {
                
                win.classList.add('hidden');
                win.classList.remove('active-window');
                activeWindowId = null;
                const remaining = document.querySelectorAll('.window:not(.hidden)');
                if (remaining.length > 0) {
                    setActiveWindow(remaining[remaining.length - 1].id);
                } else {
                    updateTaskbar();
                }
            } else {
                setActiveWindow(id);
            }
        });

        taskbarAppsContainer.appendChild(btn);
    });
}

function setActiveWindow(targetId) {
    const allWindows = document.querySelectorAll('.window');
    allWindows.forEach(win => {
        if (win.id === targetId) {
            win.classList.remove('hidden');
            win.classList.add('active-window');
            win.style.zIndex = '20';
        } else if (!win.classList.contains('hidden')) {
            win.classList.remove('active-window');
            win.style.zIndex = '10';
        }
    });

    activeWindowId = targetId;

    if (targetId === 'terminal-window') {
        const cmdInput = document.getElementById('command');
        if (cmdInput) cmdInput.focus();
    } else if (targetId === 'color-settings-window') {
        const colorInput = document.getElementById('osColors');
        if (colorInput) colorInput.focus();
    } else if (targetId === 'notes-window') {
        const journalInput = document.getElementById('journal');
        if (journalInput) journalInput.focus();
    }

    updateTaskbar();
}

function closeWindow(win) {
    if (!win) return;
    win.classList.add('hidden');
    win.classList.remove('active-window');
    
    if (activeWindowId === win.id) {
        activeWindowId = null;
        const remaining = document.querySelectorAll('.window:not(.hidden)');
        if (remaining.length > 0) {
            setActiveWindow(remaining[remaining.length - 1].id);
            return;
        }
    }
    updateTaskbar();
}

const appLinks = document.querySelectorAll('.app-link');

appLinks.forEach(link => {
    link.addEventListener('click', () => {
        const targetId = link.getAttribute('data-target');
        if (targetId) {
            setActiveWindow(targetId);
        }
    });
});

const closeBtns = document.querySelectorAll('.close-btn');

closeBtns.forEach(btn => {
    btn.addEventListener('click', (event) => {
        const parentWindow = event.target.closest('.window');
        closeWindow(parentWindow);
    });
});

document.querySelectorAll('.window').forEach(win => {
    win.addEventListener('mousedown', () => {
        if (activeWindowId !== win.id) {
            setActiveWindow(win.id);
        }
    });
});





input.addEventListener("keydown", function(event) {
    if (event.key !== "Enter") {
        return;
    }
    event.preventDefault();

    const rawCommand = input.value;
    const command = rawCommand.trim().toUpperCase();
    const line = document.createElement("div");
    line.textContent = "USER@CONS-OS:~$ " + rawCommand;
    terminal.insertBefore(line, input.parentElement);
    switch (command) {
        case "HELP":
            print("--AVAILABLE COMMANDS:--");
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
            closeWindow(document.getElementById('terminal-window'));
            break;
            
        case "CLEAR":
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
        case "SHUTDOWN":
            print("SHUTTING DOWN SYSTEM...");
            setTimeout(() => {
                if (typeof toggleScreenPower === 'function') {
                    toggleScreenPower();
                } else if (screenArea) {
                    screenArea.classList.add('screen-off');
                    if (powerButton) powerButton.classList.add('is-off');
                }
            }, 600);
            break;
        case "REBOOT":
        case "RELOAD":
            rebootOS();
            break;
        case "LS":
            print("ABOUT_ME/");
            print("GITHUB/");
            print("ITCHIO/");
            break;
        case "CD ABOUT_ME":
                print("HI, IM EL-CONS. I'M A COMPUTER SCIENCE STUDENT");
                break;
        case "CD GITHUB":
                printLink("VISIT MY GITHUB PROFILE" ,"https://github.com/EL-CONS");
                break;
        case "CD ITCHIO":
                printLink("VISIT MY ITCHIO PROFILE C:", "https://el-cons.itch.io/");
                break;
        case "CONSFETCH":

            print("⣿⣿⠿⠛⠛⠻⠿⣿⣿⣿ [OS:------CONS-OS]");
            print("⣿⠇⣤⣤⡀⠀⠀⡈⣿⣿ [BRANCH------MAIN]");
            print("⣿⠇⢟⣛⣿⠪⣭⡇⢿⣿ [RELEASE:--STABLE]");
            print("⣿⡎⡰⠀⠀⡂⢐⠚⣼⣿ [PKG'S:---------4]");
            print("⣿⣷⡙⢫⣈⡘⠟⣸⣿⣿");
            print("⣿⣿⣿⣶⢠⡄⣾⣿⣿⣿");
            print("⡟⣩⣶⣦⣛⣓⣴⣦⡝⣿");
            print("⢸⣿⢻⣿⣿⣿⣿⡟⣿⢸");
            break;
            
        case "LOREM":
        case "LOREM IPSUM":
            print("DOLOR SIT AMET, CONSECTETUR ADIPISCING ELIT.");
            break;
            
        case "":
            
            break;
            
        default:
            print("COMMAND NOT FOUND: " + command);
            break;
    }

    input.value = "";
    if (terminal) {
        terminal.scrollTop = terminal.scrollHeight;
    }
});

function printLink(text,url){
    const line =document.createElement("div");
    const link= document.createElement("a");

    link.href  =url;
    link.textContent=text;
    link.target="_blank";
    link.style.color = "inherit";
    link.style.textDecoration = "underline";
    link.style.wordBreak = "break-all";
    line.appendChild(link);

    terminal.insertBefore(line, input.parentElement);
    if (terminal) {
        terminal.scrollTop = terminal.scrollHeight;
    }
}


function print(text) {
    const line = document.createElement("div");
    line.textContent = text;
    terminal.insertBefore(line, input.parentElement);
    if (terminal) {
        terminal.scrollTop = terminal.scrollHeight;
    }
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
const gameFrame = document.querySelector('#empty iframe');

function applyTheme(theme){
    document.documentElement.setAttribute('data-theme',theme);

    if(gameFrame && gameFrame.contentDocument){
        gameFrame.contentDocument.documentElement.setAttribute('data-theme',theme);
    }
}
menu.addEventListener('change', (event) => {
    applyTheme(event.target.value);
});

if(gameFrame){
    gameFrame.addEventListener('load',() => {
       const currentTheme = document.querySelector('input[name="theme"]:checked')?.value || 'retro';
       applyTheme(currentTheme);
    });
}




const folderButtons = document.querySelectorAll(".folder-item");
folderButtons.forEach((folder) => {
    folder.addEventListener("click", () => {
        const url = folder.dataset.url;

        window.open(url, "_blank", "noopener,noreferrer");
    });
});

const digitalKeyboard = document.querySelector('.keyboard');
const LOREM_TEXT = "LOREM IPSUM DOLOR SIT AMET, CONSECTETUR ADIPISCING ELIT, SED DO EIUSMOD TEMPOR INCIDIDUNT UT LABORE ET DOLORE MAGNA ALIQUA. UT ENIM AD MINIM VENIAM, QUIS NOSTRUD EXERCITATION ULLAMCO LABORIS NISI UT ALIQUIP EX EA COMMODO CONSEQUAT. DUIS AUTE IRURE DOLOR IN REPREHENDERIT IN VOLUPTATE VELIT ESSE CILLUM DOLORE EU FUGIAT NULLA PARIATUR. EXCEPTEUR SINT OCCAECAT CUPIDATAT NON PROIDENT, SUNT IN CULPA QUI OFFICIA DESERUNT MOLLIT ANIM ID EST LABORUM. ";
let loremIndex = 0;

function typeDigitalKeyboardChar() {
    if (screenArea && screenArea.classList.contains('screen-off')) {
        return;
    }
    const terminalWindow = document.getElementById('terminal-window');
    if (terminalWindow) {
        if (terminalWindow.classList.contains('hidden') || activeWindowId !== 'terminal-window') {
            setActiveWindow('terminal-window');
        }
    }

    if (input) {
        const char = LOREM_TEXT[loremIndex % LOREM_TEXT.length];
        loremIndex++;
        input.value += char;
        input.dispatchEvent(new Event('input', { bubbles: true }));

        if (terminal) {
            terminal.scrollTop = terminal.scrollHeight;
        }
    }
}

if (digitalKeyboard) {
    let keyRepeatTimeout = null;
    let keyRepeatInterval = null;

    const stopRepeat = () => {
        if (keyRepeatTimeout) {
            clearTimeout(keyRepeatTimeout);
            keyRepeatTimeout = null;
        }
        if (keyRepeatInterval) {
            clearInterval(keyRepeatInterval);
            keyRepeatInterval = null;
        }
    };

    digitalKeyboard.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        typeDigitalKeyboardChar();

        stopRepeat();
        keyRepeatTimeout = setTimeout(() => {
            keyRepeatInterval = setInterval(() => {
                typeDigitalKeyboardChar();
            }, 60);
        }, 350);
    });

    window.addEventListener('pointerup', stopRepeat);
    window.addEventListener('pointercancel', stopRepeat);
}


const powerButton = document.getElementById('monitor-power-button') || document.querySelector('.monitor-i-o-button');
const screenArea = document.querySelector('.monitor-screen-content-area');

function toggleScreenPower() {
    if (!screenArea) return;
    const isOff = screenArea.classList.toggle('screen-off');
    if (powerButton) {
        powerButton.classList.toggle('is-off', isOff);
    }

    if (dropdownMenu && !dropdownMenu.classList.contains('hidden')) {
        dropdownMenu.classList.add('hidden');
    }

    if (isOff) {
        if (input) input.blur();
        if (journal) journal.blur();
    }
}

if (powerButton) {
    powerButton.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleScreenPower();
    });
}

//****************************** */ 
// BOOT
//****************************** */
const bootScreen = document.getElementById("boot-screen");
let bootTimeout = null;
let bootFadeTimeout = null;

function playBootAnimation(duration = 4000) {
    if (!bootScreen) return;

    if (bootTimeout) clearTimeout(bootTimeout);
    if (bootFadeTimeout) clearTimeout(bootFadeTimeout);

    
    bootScreen.classList.remove("hidden");
    bootScreen.classList.remove("boot-hidden");

    
    const bootContent = bootScreen.querySelector(".boot-content");
    if (bootContent) {
        bootContent.style.animation = "none";
        void bootContent.offsetWidth;
        bootContent.style.animation = "";
    }

    
    bootTimeout = setTimeout(() => {
        bootScreen.classList.add("boot-hidden");
        bootFadeTimeout = setTimeout(() => {
            bootScreen.classList.add("hidden");
        }, 250);
    }, duration);
}

function rebootOS() {
    print("REBOOTING SYSTEM...");

    setTimeout(() => {
        location.reload();
    }, 300);
}


applyTheme(document.querySelector('input[name="theme"]:checked')?.value || 'gray-lcd');
playBootAnimation(4000);


//****************************** */ 
// JOURNAL APP
//****************************** */
const journal = document.getElementById("journal");
const notesWindow = document.getElementById("notes-window");

if (journal) {
    journal.addEventListener("keydown", (e) => {
        if (e.key === "Tab") {
            e.preventDefault();
            const start = journal.selectionStart;
            const end = journal.selectionEnd;
            const val = journal.value;
            journal.value = val.substring(0, start) + "    " + val.substring(end);
            journal.selectionStart = journal.selectionEnd = start + 4;
            journal.dispatchEvent(new Event("input", { bubbles: true }));
        }
    });
}

if (notesWindow && journal) {
    notesWindow.addEventListener("click", (e) => {
        if (e.target && e.target.classList.contains("close-btn")) return;
        journal.focus();
    });
}


