const Path = require('path');
const fs = require('fs');
const stdReadLine = require('readline');
const chalk = require('chalk');

function findFiles(dirs = [], rootPath = '') {
    let files = [];
    for(const dir of dirs) {
        console.log("---------------------------------------------------------------------------------------------------------");
        console.log(chalk.bgWhite.black(`Currently Working:=> ${chalk.bold(dir)}`));
        // Get the direct listing
        if(isDirectory(Path.resolve(rootPath, dir))) {
            // Directory
            console.log(chalk.cyan(`${chalk.bold(dir)} is a Directory.`));
            console.log("=================================================================");
            const absolutePath = Path.resolve(rootPath, dir);
            let newFolderName = dir.replace(/\(|\)|_/g, "").replace(/\s/g, "-");
            if(newFolderName !== dir) {
                console.log(chalk.redBright("=============================RENAMING FOLDER===================================="));
                fs.renameSync(absolutePath, rootPath + "/" + newFolderName);
                console.log(chalk.blueBright("Old Name:=> " + dir, "New Name => " + newFolderName));
            }
            files = [...files, ...findFiles(fs.readdirSync(Path.resolve(rootPath, newFolderName)), Path.resolve(rootPath, newFolderName))];
        } else {
            // File
            console.log(chalk.green(`${chalk.bold(dir)} is a File.`));
            console.log("=========================================");
            console.log(chalk.bgGreen.white("Performing Action"));
            console.log("=========================================");
            // Here perform the actial action of rename
            const absolutePath = Path.resolve(rootPath, dir);
            let newFolderName = dir.replace(/\(|\)|_/g, "").replace(/\s/g, "-");
            if(newFolderName !== dir) {
                console.log(chalk.cyanBright("=============================RENAMING FILE===================================="));
                fs.renameSync(absolutePath, rootPath + "/" + newFolderName);
                console.log(chalk.blueBright("Old Name:=> " + dir, "New Name => " + newFolderName));
            } 
            files.push(Path.resolve(rootPath, dir));
        }
    }
    return files;
}

const getStats = (fileOrFolderPath) => {
    return fs.statSync(fileOrFolderPath);
}

const isDirectory = (fileOrFolderPath) => {
    return getStats(fileOrFolderPath).isDirectory();
}

const isFile = (fileOrFolderPath) => {
    return getStats(fileOrFolderPath).isFile();
}

const readline = stdReadLine.createInterface({
    input: process.stdin,
    output: process.stdout
});

readline.question("Enter the directory path: ", dirPath => {
    console.log(`DIR: => ${dirPath}`);
    try {
        const dirs = fs.readdirSync(dirPath);
        console.log("Directory listing");
        console.log(dirs);
        console.log("------------------------INITIATING--------------------------");
        const files = findFiles(dirs, dirPath);
        // console.log(chalk.green("FILES"), files);
        console.log("------------------------END--------------------------");
    }catch(e) {
        console.error(e);
    }
    readline.close();
});