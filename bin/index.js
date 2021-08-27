#! /usr/bin/env node
import * as path from "path";
import spinnies from "spinnies";
import {createTmpDir, getConfig, moveToTmpDir} from "./fileUtils.js";
import {startDeploy} from "./shellUtils.js";

const TEMP_DIR = "./tmp";
const config = getConfig();
const cliArguments = process.argv.slice(2).join(' ');
const spinners = new spinnies();

console.log(`Found ${config.services.length} services`);

await Promise.all(config.services.map(async (service) => {
    // Prepare temp deployment directories
    spinners.add(service.name, { text: `Preparing  ${service.name} files` });
	createTmpDir(TEMP_DIR + "/" + service.name);
	moveToTmpDir(service.root, service.variable_dirs, TEMP_DIR + '/' + service.name);

	// Deploy to Google Cloud Functions
	spinners.update(service.name, { text: `Deploying function ${service.name} (may take a while - up to 2 minutes)`, color: 'blue' });
	await startDeploy(service.name, cliArguments);
	spinnies.succeed(service.name, { text: `Function ${service.name} successfully deployed`, successColor: 'greenBright' });
}));

console.log(`${config.services.length} services deployed`);
