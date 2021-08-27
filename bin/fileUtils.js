import {copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, statSync} from "fs";
import * as path from "path";

function createDirIfNotExists(path) {
	if (path && !existsSync(path)) {
		mkdirSync(path);
	}
}

export function createTmpDir(tmpDir) {
	const tmpBase = path.basename(path.dirname(tmpDir));
	createDirIfNotExists(path.resolve(process.cwd(), tmpBase));
	createDirIfNotExists(path.resolve(process.cwd(), tmpDir));
}

export function getConfig() {
	const configPath = path.resolve(process.cwd(), "chameleon.json");
	const data = readFileSync(configPath, 'utf-8');
	return JSON.parse(data);
}

export function moveToTmpDir(dirToMove, variableDirs, tmpDir, dest) {
	const files = readdirSync(dirToMove);
	const tmpBase = path.basename(path.dirname(tmpDir));
	const tmpPath = path.resolve(process.cwd(), tmpDir);

	files.forEach(file => {
		const outputPath = dest || tmpPath + "/" + dirToMove + "/" + file;

		// This block determines
	    if (statSync(dirToMove + "/" + file).isDirectory()) {  // Create new directory in the tmp directory
	    	if (path.resolve(dirToMove + "/" + file) == path.resolve(process.cwd(), tmpBase)) {
	    		
	    	}
	    	else if (variableDirs.map(dir=>dir.dir_name).includes(dirToMove + "/" + file)) {
	    		// Create the new directory
	    		createDirIfNotExists(dest ? (dest + "/" + file) : outputPath)
	    		// Move only the selected child directory
	    		const childDir = variableDirs.filter(dir=>dir.dir_name==dirToMove + "/" + file)[0]
	    		const sourceDir = dirToMove + "/" + file + "/" + childDir.source
	  		
	    		moveToTmpDir(sourceDir, variableDirs, tmpDir, tmpPath + "/" + dirToMove + "/" + file)
	    	}
	    	else {
	    		createDirIfNotExists(dest ? (dest + "/" + file) : outputPath)
	    		moveToTmpDir(dirToMove + "/" + file, variableDirs, tmpDir, dest ? path.resolve(outputPath + "/" + file) : tmpPath + "/" + dirToMove + "/" + file)
	    	}
	    	
	    }
	    else { // Copy file to temp directory
	    	copyFileSync(path.resolve(dirToMove + "/" + file), dest ? (dest + "/" + file) : outputPath);	    
	    }
	})
}