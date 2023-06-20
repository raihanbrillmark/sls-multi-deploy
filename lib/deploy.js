import { exec } from "child_process";
import { readFileSync } from "fs";
import { parse } from "yaml";

const processConfig = process.argv;

console.log(processConfig, "processConfig....");

let regionsStagesFileName = "./serverless-deploy-regions.yml";

const commandType = process.argv[2] || "deploy";
let env =
  processConfig.find((_) => _.includes("--env"))?.split("=")[1] || "dev";
let deploymentStage =
  processConfig.find((_) => _.includes("--stage"))?.split("=")[1] ||
  "stage-pjs";

let regionsGroups = [];

// load and parge yaml config file
const getConfigFormYAML = async () => {
  try {
    const fileContents = await readFileSync(regionsStagesFileName, "utf8");
    const data = await parse(fileContents);

    return data;
  } catch (e) {
    console.log(`Error: failed to get config`, e);
  }
};

// Run command by node js
const execute = (command, callback) => {
  exec(command, function (error, stdout, stderr) {
    callback(error, stdout);
  });
};

const executeSlsDeployCommand = async function (region) {
  return new Promise((resolve, rejects) => {
    execute(
      `sls ${commandType} --region ${region} --stage ${env} --aws-profile live`,
      function (error, result) {
        if (error) {
          console.log("Error in exec:", error);
          resolve({ result: error, region });
        }
        resolve({ result, region });
      }
    );
  });
};

/**
 * Helper function for showing console message during deployment
 *
 * @param {boolean} isLoading
 * @returns
 */
let loader = null;
const messageInConsoleController = (isLoading) => {
  const P = ["\\", "|", "/", "-"];
  let x = 0;

  if (!isLoading && loader) {
    clearInterval(loader);
    console.log(`Done!`);
    return;
  }

  console.log(
    `${
      commandType === "remove" ? "Removing" : "Deploying"
    } start in ${env} stage to following regions: ${regionsGroups[
      deploymentStage
    ]
      .map((_) => _.region)
      .join(", ")}`
  );
  let time = 0;

  loader = setInterval(() => {
    process.stdout.write(
      `\r${P[x++]} ${
        commandType === "remove" ? "Removing" : "Deploying"
      }... (${time}s)`
    );
    x %= P.length;
    time++;
  }, 1000);
};

// Main entry point
const init = async ({ configFilePath }) => {
  if (!configFilePath) return;
  regionsStagesFileName = configFilePath;

  // get deployment config from yaml
  const data = await getConfigFormYAML();
  regionsGroups = data.regions;

  const promises = [];
  messageInConsoleController(true);

  regionsGroups[deploymentStage].forEach((_) => {
    promises.push(executeSlsDeployCommand(_.region));
  });

  await Promise.all(promises).then(async (outputs) => {
    messageInConsoleController(false);
    console.log(`Outputs:`);
    console.log(outputs);
  });
};

export default init;
