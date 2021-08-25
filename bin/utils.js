const fs = require("fs")
const path = require("path")

function createDirIfNotExists(path) {
	if (!fs.existsSync(path)) {
		fs.mkdirSync(path);
	}
}

function moveDir(dirToMove, arrayOfFiles, variableDirs, tmpDir, outputPath) {
	console.log('movedir')
	files = fs.readdirSync(dirToMove)
	arrayOfFiles = arrayOfFiles || []
	files.forEach(file => {
	    if (fs.statSync(dirToMove + "/" + file).isDirectory()) {  // Create subdirectories under temp directory
	    	let outputPath = outputPath || path.resolve(tmpDir + "/" + dirToMove + "/" + file)
	    	if (path.resolve(dirToMove + "/" + file) == path.resolve(tmpDir)) {
	    		
	    	}
	    	else if (variableDirs.map(dir=>dir.dir_name).includes(dirToMove + "/" + file)) {
	    		// Create the new directory
	    		// const newPath = path.resolve(tmpDir + "/" + dirToMove + "/" + file)
	    		createDirIfNotExists(outputPath)
	    		// Move only the selected child directory
	    		const childDir = variableDirs.filter(dir=>dir.dir_name==dirToMove + "/" + file)[0]
	    		const sourceDir = dirToMove + "/" + file + "/" + childDir.source

	  			
	    		arrayOfFiles = moveDir(sourceDir, arrayOfFiles, variableDirs, tmpDir, path.resolve(tmpDir + "/" + dirToMove + "/" + file))
	    	}
	    	else {
	    		// const newPath = path.resolve(tmpDir + "/" + dirToMove + "/" + file)
	    		createDirIfNotExists(outputPath)
	    		arrayOfFiles = moveDir(dirToMove + "/" + file, arrayOfFiles, variableDirs, tmpDir, path.resolve(tmpDir + "/" + dirToMove + "/" + file))
	    	}
	    	
	    }
	    else { // Copy files to temp directory
	    	fs.copyFileSync(path.resolve(dirToMove + "/" + file), outputPath);
	    
	    }
	})
	return arrayOfFiles
}

module.exports = { moveDir: moveDir, createDirIfNotExists: createDirIfNotExists };