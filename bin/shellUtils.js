import { promisify } from "util";
import { exec } from "child_process";
const execPromise = promisify(exec);

export async function startDeploy(serviceName, cliArguments) {
  try {
  	const result = await execPromise(`gcloud functions deploy ${serviceName} --source tmp/${serviceName} ${cliArguments}`);
  }
  catch (e) {
  	throw Error(e);
  }
}