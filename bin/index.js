#! /usr/bin/env node
const path = require("path")
const utils = require("./utils.js")
const yargs = require("yargs")
const usage = "\nUsage: gfcham <gcloud args>"
const options = yargs  
      				.usage(usage)  
      				.option("allow-unauthenticated", {describe: "List all supported languages.", type: "boolean", demandOption: false }) 
      				.option("entry-point", {describe: "The entry point of the ", type: "string", demandOption: false }) 
      				.option("memory", {describe: "Runtime to use for function", type: "string", demandOption: false })   
      				.option("runtime", {describe: "Runtime to use for function", type: "string", demandOption: false })   
      				.option("trigger-http", {describe: "Use HTTP to trigger function execution.", type: "boolean", demandOption: false }) 	                                                                                                     
      			.help(true)  
      			.argv;

const config = require(path.resolve(process.cwd(), "chameleon.json"));
const tmp_dir = path.resolve(process.cwd(), "./tmp")

console.log("Deploying " +  config.services.length + " service");
config.services.forEach(service => {
	console.log("Preparing: " + service.name)
	console.log(service.variable_dirs)
	utils.createDirIfNotExists(tmp_dir)
	utils.moveDir(service.root, null, service.variable_dirs, tmp_dir)
})