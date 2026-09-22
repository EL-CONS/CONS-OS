const input = document.getElementById("command");
const terminal = document.getElementById("terminal");
const journal = document.getElementById("journal");
const notesWindow = document.getElementById("notes-window");

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
        if (journalInput) {
            journalInput.focus();
            const len = journalInput.value.length;
            journalInput.setSelectionRange(len, len);
        }
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
            print("CAT <FILE>");
            print("OPEN <FILE>")
            print("ABOUT");
            print("CLEAR");
            print("RESET");
            print("REBOOT")
            print("SHUTDOWN")
            print("EXIT");
            print("----------------------");
            break;
        case "ABOUT":
            while (terminal.firstChild !== input.parentElement) {
                terminal.removeChild(terminal.firstChild);
            }
            print("TYPE 'HELP' FOR AVAILABLE COMMAND");
            print("⣿⣿⠿⠛⠛⠻⠿⣿⣿ [OS:------CONS-OS]");
            print("⣿⠇⣤⣤⡀⠀⠀⡈⣿ [BRANCH------MAIN]");
            print("⣿⠇⢟⣛⣿⠪⣭⡇⢿ [RELEASE:--STABLE]");
            print("⣿⡎⡰⠀⠀⡂⢐⠚⣼ [PKG'S:-------(5)]");
            print("⣿⣷⡙⢫⣈⡘⠟⣸⣿");
            print("⣿⣿⣿⣶⢠⡄⣾⣿⣿");
            print("⡟⣩⣶⣦⣛⣓⣴⣦⡝");
            print("⢸⣿⢻⣿⣿⣿⣿⡟⣿");
            print("_");
            print("_");
            printLink("VISIT MY GITHUB PROFILE" ,"https://github.com/EL-CONS");
            break;
            
        case "EXIT":
            while (terminal.firstChild !== input.parentElement) {
                terminal.removeChild(terminal.firstChild);
            }
            closeWindow(document.getElementById('terminal-window'));
            print("TYPE 'HELP' FOR AVAILABLE COMMANDS");
            print("⣿⣿⠿⠛⠛⠻⠿⣿⣿ [OS:------CONS-OS]");
            print("⣿⠇⣤⣤⡀⠀⠀⡈⣿ [BRANCH------MAIN]");
            print("⣿⠇⢟⣛⣿⠪⣭⡇⢿ [RELEASE:--STABLE]");
            print("⣿⡎⡰⠀⠀⡂⢐⠚⣼ [PKG'S:-------(5)]");
            print("⣿⣷⡙⢫⣈⡘⠟⣸⣿");
            print("⣿⣿⣿⣶⢠⡄⣾⣿⣿");
            print("⡟⣩⣶⣦⣛⣓⣴⣦⡝");
            print("⢸⣿⢻⣿⣿⣿⣿⡟⣿");
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
            print("ABOUT_CONS-OS.TXT");
            print("ABOUT_ME.TXT");
            print("NOTES.TXT");
            print("GITHUB");
            print("ITCHIO");
            print("FONT");
            break;
        case "CAT ABOUT_ME.TXT":
        case "CAT ABOUT_ME":
                print("HI, IM EL-CONS. I'M A COMPUTER SCIENCE STUDENT");
                break;
        case "CAT NOTES.TXT":
        case "CAT NOTES":
                print("CONS-OS JOURNAL NOTES:");
                print("- SYSTEM OPERATIONAL");
                print("- JOURNAL APP CONNECTED TO FILES");
                print("- READY TO WRITE");
                break;
        case "OPEN ABOUT_CONS-OS.TXT":
        case "OPEN ABOUT_CONS-OS":
        case "JOURNAL ABOUT_CONS-OS.TXT":
                openTextFile('NOTES.TXT', FILES_DATA['ABOUT_CONS-OS.TXT']);
                break;
        case "OPEN ABOUT_ME.TXT":
        case "OPEN ABOUT_ME":
        case "JOURNAL ABOUT_ME.TXT":
                openTextFile('ABOUT_ME.TXT', FILES_DATA['ABOUT_ME.TXT']);
                break;
        case "OPEN NOTES.TXT":
        case "OPEN NOTES":
        case "JOURNAL NOTES.TXT":
                openTextFile('NOTES.TXT', FILES_DATA['NOTES.TXT']);
                break;
        case "OPEN GITHUB":
        case "CAT GITHUB":
                printLink("VISIT MY GITHUB PROFILE" ,"https://github.com/EL-CONS");
                break;
        case "OPEN ITCHIO":
        case "CAT ITCHIO":
                printLink("VISIT MY ITCHIO PROFILE C:", "https://el-cons.itch.io/");
                break;
        case "OPEN FONT":
        case "CAT FONT":
                printLink("USED FONT IN THIS PROYECT","https://github.com/balt-dev/bytesized-gf");
                break;
        case "CONSFETCH":

            print("⣿⣿⠿⠛⠛⠻⠿⣿⣿ [OS:------CONS-OS]");
            print("⣿⠇⣤⣤⡀⠀⠀⡈⣿ [BRANCH------MAIN]");
            print("⣿⠇⢟⣛⣿⠪⣭⡇⢿ [RELEASE:--STABLE]");
            print("⣿⡎⡰⠀⠀⡂⢐⠚⣼ [PKG'S:-------(5)]");
            print("⣿⣷⡙⢫⣈⡘⠟⣸⣿");
            print("⣿⣿⣿⣶⢠⡄⣾⣿⣿");
            print("⡟⣩⣶⣦⣛⣓⣴⣦⡝");
            print("⢸⣿⢻⣿⣿⣿⣿⡟⣿");
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




const FILES_DATA = {
    'ABOUT_CONS-OS.TXT': "'IN SOFTWARE, AS IN LIFE, LESS CAN BE MORE.'(Eric S. Raymond).\n\n This proyect started as a brief tought. when starting the operative system 2026-2 unviersity class i wondered what would a programmer in the early stages of computer user interfaces develompent would feel when coding an operative system. Im not that good of a programer yet, but i know how to fulfill that itch",
    'ABOUT_ME.TXT': "HI, IM EL-CONS.\nI'M A COMPUTER SCIENCE STUDENT.\nWELCOME TO CONS-OS!",
    'NOTES.TXT': "CONS-OS JOURNAL NOTES:\n\n- SYSTEM OPERATIONAL\n- JOURNAL APP CONNECTED TO FILES\n- READY TO WRITE\n- HOPE YOU LIKE IT :b"

};

function openTextFile(fileName, content) {
    const journalElem = journal || document.getElementById('journal');
    if (!journalElem) return;


    journalElem.value = "";
    journalElem.value = content;
    setActiveWindow('notes-window');

    journalElem.focus();
    const len = journalElem.value.length;
    journalElem.setSelectionRange(len, len);
    journalElem.scrollTop = 0;
    journalElem.dispatchEvent(new Event('input', { bubbles: true }));
}

document.addEventListener('click', (e) => {
    const item = e.target.closest('.link-item, .file-item, .folder-item');
    if (!item) return;

    const url = item.dataset.url;
    const file = item.dataset.file;
    const content = item.dataset.content;

    if (url) {
        window.open(url, "_blank", "noopener,noreferrer");
    } else if (file || content !== undefined) {
        const raw = content !== undefined ? content : (FILES_DATA[file] || "");
        const text = raw.replace(/\\n/g, "\n");
        openTextFile(file, text);
    }
});

const digitalKeyboard = document.querySelector('.keyboard');
const LOREM_TEXT = "LOREM IPSUM DOLOR SIT AMET, CONSECTETUR ADIPISCING ELIT, SED DO EIUSMOD TEMPOR INCIDIDUNT UT LABORE ET DOLORE MAGNA ALIQUA. UT ENIM AD MINIM VENIAM, QUIS NOSTRUD EXERCITATION ULLAMCO LABORIS NISI UT ALIQUIP EX EA COMMODO CONSEQUAT. DUIS AUTE IRURE DOLOR IN REPREHENDERIT IN VOLUPTATE VELIT ESSE CILLUM DOLORE EU FUGIAT NULLA PARIATUR. EXCEPTEUR SINT OCCAECAT CUPIDATAT NON PROIDENT, SUNT IN CULPA QUI OFFICIA DESERUNT MOLLIT ANIM ID EST LABORUM. ";
let loremIndex = 0;

function typeDigitalKeyboardChar() {
    if (screenArea && screenArea.classList.contains('screen-off')) {
        return;
    }
    const notesWindowElem = notesWindow || document.getElementById('notes-window');
    if (notesWindowElem) {
        if (notesWindowElem.classList.contains('hidden') || activeWindowId !== 'notes-window') {
            setActiveWindow('notes-window');
        }
    }

    const journalInput = journal || document.getElementById('journal');
    if (journalInput) {
        if (document.activeElement !== journalInput) {
            journalInput.focus();
        }

        const char = LOREM_TEXT[loremIndex % LOREM_TEXT.length];
        loremIndex++;

        const start = journalInput.selectionStart;
        const end = journalInput.selectionEnd;
        const val = journalInput.value;

        if (typeof start === 'number' && typeof end === 'number') {
            journalInput.value = val.substring(0, start) + char + val.substring(end);
            journalInput.selectionStart = journalInput.selectionEnd = start + 1;
        } else {
            journalInput.value += char;
        }

        journalInput.dispatchEvent(new Event('input', { bubbles: true }));

        if (start >= val.length) {
            journalInput.scrollTop = journalInput.scrollHeight;
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
playBootAnimation(40);


//****************************** */ 
// JOURNAL APP
//****************************** */

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


