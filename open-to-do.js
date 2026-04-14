#!/usr/bin/env node
import { fileURLToPath } from "url";
import { exec } from "child_process";
import os from "os";
import fs from "fs/promises";
import { exit } from "process";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import path from "path";

const cli = yargs(hideBin(process.argv))
  .scriptName('opentodo')
  .usage('Usage: $0 [command]')

  // Default command: open the saved path from path.txt
  .command(
    '$0',
    'Open the file/image path saved in path.txt using your default app',
  )

  // Command: update the saved path in path.txt
  .command('change <filepath>', 'Set a new file/image path to open', (yargs) => {
    yargs.positional('filepath', {
      describe: 'The full path to the file/photo you want to open',
      type: 'string',
      demandOption: true,
    });
  })

  // Add examples to the help menu
  .example('$0', 'Opens the file/image currently saved in path.txt')
  .example('$0 change C:/Users/you/Pictures/todo.jpg', 'Saves a new file/image path')
  
  // Customize the help command
  .help('h')
  .alias('h', 'help')
  .strictCommands()
  .epilog('Made with ❤️ by pxtitan')

  const argv = cli.parse(); // Parses the arguments and returns them



const pathurl = fileURLToPath(new URL("./path.txt", import.meta.url));

function ensurePathFileExists() {
  return fs
    .access(pathurl)
    .catch(() => {
      // If the file doesn't exist, create it with an empty string
      return fs.writeFile(pathurl, "", "utf-8");
    });
}


async function filePath() {
  try {

    const data = await fs
      .readFile(pathurl, "utf-8")
      .then((data) => data.trim());

    if (!data) {
      console.error(` 😲 you haven't set a file yet. `);
      cli.showHelp();
      exit(1); // Exit with an error code
    }
    return data;
  } catch (err) {
    console.error("Error reading file path:", err);
    return null;
  }
}

async function setfilePath(newPath) {
  try {
    await fs.writeFile(pathurl, newPath, "utf-8");
    console.log(`✅ file path updated to: ${newPath}`);
  } catch (err) {
    console.error("Error writing file path:", err);
  }
}

// Check if the user wants to change the file path
if (argv._[0] === "change") {
  const newPath = argv.filepath;
  if (!newPath) {
    console.error("Please provide a new file path.");
    console.error(
      'Usage: "opentodo change <path-to-file>" to set the file you want to open when you run "opentodo"',
    );
    exit(1); // Exit with an error code
  }
  setfilePath(newPath);
} 

async function openfile() {
  filePath().then((path) => {
    if (path) {
      // Determine the correct command based on the OS
      let command;
      switch (os.platform()) {
        case "darwin": // macOS
          command = `open "${path}"`;
          break;

        case "win32": // Windows
          command = `start "" "${path}"`;
          break;
        default: // Linux and others
          command = `xdg-open "${path}"`;
          break;
      }

      // Execute the command
      exec(command, (error) => {
        if (error) {
          console.error(`❌ Error opening file: ${error.message}`);
          return;
        }
        console.log(`✅ Opening ${path}...`);
      });
    }
  });
}

ensurePathFileExists().then(() => { openfile(); });