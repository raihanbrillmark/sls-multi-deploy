const path = require("path");
const { exec } = require("child_process");
const { readFileSync } = require("fs");
const { parse } = require("yaml");
const { generateCommandScript, printConsole } = require("./utils.js");
const config = require("../configs/config.js");

console.log(__dirname, "src..path");

// load the user configs .yaml file
const loadUserConfigs = async () => {
  const fileName = config.userConfigFileName;
  try {
    const fileContents = await readFileSync(
      path.join(__dirname, fileName),
      "utf8"
    );
    const data = await parse(fileContents);

    return data;
  } catch (e) {
    printConsole({
      type: "Error",
      message: `Failed to read config file`,
      stack: e,
    });
    return undefined;
  }
};

// Run command by node js
const execute = (command, callback) => {
  exec(command, function (error, stdout, stderr) {
    callback(error, stdout);
  });
};

const executeCommand = async (script, region) => {
  return new Promise((resolve, rejects) => {
    execute(script, function (error, result) {
      if (error) {
        printConsole({
          type: "Error",
          message: `Failed to read config file`,
          stack: { error, result },
        });
        resolve({ result: error, region });
      }
      resolve({ result, region });
    });
  });
};

// Helper function for showing console message during deployment
let loader = null;
const messageInConsoleController = ({
  isLoading,
  env,
  regionsGroups,
  cmdType,
}) => {
  const P = ["\\", "|", "/", "-"];
  let x = 0;

  if (!isLoading && loader) {
    clearInterval(loader);
    console.log(`Done!`);
    return;
  }

  console.log(
    `${
      cmdType === "remove" ? "Removing" : "Deploying"
    } start in ${env} stage to following regions: ${regionsGroups
      .map((_) => _.region)
      .join(", ")}`
  );
  let time = 0;

  loader = setInterval(() => {
    process.stdout.write(
      `\r${P[x++]} ${
        cmdType === "remove" ? "Removing" : "Deploying"
      }... (${time}s)`
    );
    x %= P.length;
    time++;
  }, 1000);
};

// Main entry point
const __init = async ({ type, env, stage, profile }) => {
  if (!configFilePath) return;
  regionsStagesFileName = configFilePath;

  // get deployment config from yaml
  const configData = await loadUserConfigs();
  if (!configData) return;

  const promises = [];
  messageInConsoleController({
    isLoading: true,
    env,
    cmdType: type,
    regionsGroups: configData,
  });

  configData.regions[stage].forEach((_) => {
    const script = generateCommandScript({ type, env, stage, profile });

    promises.push(executeCommand(script, _.region));
  });

  await Promise.all(promises).then(async (outputs) => {
    messageInConsoleController({ isLoading: false });
    printConsole({
      type: "Success",
      message: "Deployed successful! have a fun (:",
      stack: outputs,
    });
  });
};

export default __init;
