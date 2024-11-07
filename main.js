const terminalOutput = document.getElementById("terminal-output");
const inputField = document.getElementById("input");

// Initialize localStorage data if it's not present
if (!localStorage.getItem('files')) {
    localStorage.setItem('files', JSON.stringify({ "/": ["index.html", "styles.css", "script.js"], "/home": [] }));
}
if (!localStorage.getItem('currentDirectory')) {
    localStorage.setItem('currentDirectory', "/");
}

let files = JSON.parse(localStorage.getItem('files'));
let currentDirectory = localStorage.getItem('currentDirectory');

// Command handling function
function processCommand(command) {
    let output = "";

    switch (command.trim()) {
        case "help":
            output = "Supported commands:\n" +
                " - help: List commands\n" +
                " - clear: Clear terminal\n" +
                " - date: Show current date and time\n" +
                " - pwd: Show current directory\n" +
                " - ls: List files in the current directory\n" +
                " - mkdir [directory]: Create a directory\n" +
                " - touch [file]: Create a new file\n" +
                " - cat [file]: Display contents of a file\n" +
                " - install [package]: Simulate package installation\n" +
                " - echo [text]: Print text\n" +
                " - exit: Exit the terminal\n" +
                " - cd [directory]: Change directory\n" +
                " - rmdir [directory]: Remove a directory\n" +
                " - rm [file]: Remove a file\n" +
                " - cp [source] [destination]: Copy file\n" +
                " - mv [source] [destination]: Move file";
            break;
        case "clear":
            terminalOutput.innerHTML = ""; // Clear terminal output
            return;
        case "date":
            output = new Date().toString();
            break;
        case "pwd":
            output = currentDirectory;
            break;
        case "ls":
            output = files[currentDirectory] ? files[currentDirectory].join("\n") : "No files found.";
            break;
        case "exit":
            localStorage.removeItem('files'); // Clear all data
            localStorage.removeItem('currentDirectory');
            output = "Exiting terminal...";
            break;
        default:
            // Commands with arguments
            if (command.startsWith("mkdir ")) {
                const dirName = command.split(" ")[1];
                if (!files[`${currentDirectory}/${dirName}`]) {
                    files[`${currentDirectory}/${dirName}`] = [];
                    output = `Directory '${dirName}' created`;
                } else {
                    output = `Directory '${dirName}' already exists`;
                }
                updateLocalStorage();
            } else if (command.startsWith("touch ")) {
                const fileName = command.split(" ")[1];
                // Check if the file already exists
                if (!files[currentDirectory].includes(fileName)) {
                    files[currentDirectory].push(fileName);
                    output = `File '${fileName}' created`;
                    updateLocalStorage();
                } else {
                    output = `File '${fileName}' already exists`;
                }
            } else if (command.startsWith("cat ")) {
                const fileName = command.split(" ")[1];
                output = files[currentDirectory].includes(fileName) ? `Contents of '${fileName}' (simulated)` : `File not found: ${fileName}`;
            } else if (command.startsWith("echo ")) {
                output = command.slice(5);
            } else if (command.startsWith("install ")) {
                const pkg = command.split(" ")[1];
                output = `Installing ${pkg}...\n${pkg} installed successfully (simulated)`;
            } else if (command.startsWith("cd ")) {
                const dirName = command.split(" ")[1];
                if (files[`${currentDirectory}/${dirName}`] && typeof files[`${currentDirectory}/${dirName}`] === 'object') {
                    currentDirectory = `${currentDirectory}/${dirName}`;
                    output = `Changed directory to ${currentDirectory}`;
                    updateLocalStorage();
                } else {
                    output = `Directory '${dirName}' not found`;
                }
            } else if (command.startsWith("rmdir ")) {
                const dirName = command.split(" ")[1];
                if (files[`${currentDirectory}/${dirName}`] && files[`${currentDirectory}/${dirName}`].length === 0) {
                    delete files[`${currentDirectory}/${dirName}`];
                    output = `Directory '${dirName}' removed`;
                    updateLocalStorage();
                } else {
                    output = `Directory '${dirName}' not empty or does not exist`;
                }
            } else if (command.startsWith("rm ")) {
                const fileName = command.split(" ")[1];
                const index = files[currentDirectory].indexOf(fileName);
                if (index > -1) {
                    files[currentDirectory].splice(index, 1);
                    output = `File '${fileName}' removed`;
                    updateLocalStorage();
                } else {
                    output = `File '${fileName}' not found`;
                }
            } else if (command.startsWith("cp ")) {
                const [source, destination] = command.split(" ").slice(1);
                if (files[currentDirectory].includes(source)) {
                    files[currentDirectory].push(destination);
                    output = `File '${source}' copied to '${destination}'`;
                    updateLocalStorage();
                } else {
                    output = `File '${source}' not found`;
                }
            } else if (command.startsWith("mv ")) {
                const [source, destination] = command.split(" ").slice(1);
                const index = files[currentDirectory].indexOf(source);
                if (index > -1) {
                    files[currentDirectory][index] = destination;
                    output = `File '${source}' moved to '${destination}'`;
                    updateLocalStorage();
                } else {
                    output = `File '${source}' not found`;
                }
            } else if (command.startsWith("git clone ")) {
                output = `Cloning repository ${command.split(" ")[2]} (simulated)`;
            } else if (command.startsWith("curl ")) {
                output = `Fetching URL ${command.split(" ")[1]} (simulated)`;
            } else if (command.startsWith("nano ") || command.startsWith("vi ")) {
                output = `Opening ${command.split(" ")[0]} editor (simulated)`;
            } else {
                output = `Command not found: ${command}`;
            }
    }

    displayOutput(`$~ ${command}`, output);
}

// Update localStorage whenever files or directory change
function updateLocalStorage() {
    console.log("Updating files:", files); // Debugging line
    localStorage.setItem('files', JSON.stringify(files));
    localStorage.setItem('currentDirectory', currentDirectory);
}

// Display command and response in the terminal
function displayOutput(command, output) {
    terminalOutput.innerHTML += `<div>${command}</div><div>${output}</div><br/>`;
    terminalOutput.scrollTop = terminalOutput.scrollHeight; // Auto-scroll to bottom
}

// Event listener for input field
inputField.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        const command = inputField.value;
        processCommand(command);
        inputField.value = ""; // Clear input field
    }
});

// Initialize the terminal with a welcome message
displayOutput("", "Welcome to the Web Terminal Emulator!\n Write 'help' for commands");