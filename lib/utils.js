module.exports.printConsole = ({ type, message, stack }) => {
  const errorType = type || "Error";

  console.log({
    type: errorType,
    message: `${errorType}: ${message}`,
    stack: stack,
  });
};

module.exports.generateCommandScript = ({ type, region, env, profile }) => {
  const script = `sls ${type || "deploy"} --region ${region || ""} --stage ${
    env || "dev"
  } --aws-profile ${profile || "default"}`;

  return script;
};
