# Single serverless project deploy to multi regions

### How to install

1.  Clone repo from github then you recieve a fresh serverless project with full configaration.

The `serverless-bm-compose.yml` hold the multi regions configuration like this format

```yaml
# file which will be create automatically after complete deploy with API enpoint, method and region name
outputFilePath: deployments-outputs.json

# region name where you want to deploy. Each deploy command will be deploy a stage of group regions which mention
# it's for deployment load-balancing. default run `stage-1`. Recommaned to follow this this format
regions:
  # regions group
  stage-1:
    - region: us-east-1
    - region: us-east-2
  stage-2:
    - region: us-west-1
    - region: us-west-2
```

##### Run to deploy:

```
$ yarn/npm run deploy --env=[env] --stage=[regions-stage] --output=[true | false]
```

Example:

```
$ yarn run deploy --env=prod --stage=stage-1 --output=true
```

##### Run to remove:

```
$ yarn/npm run remove --env=[env] --stage=[regions-stage] --output=[true | false]
```

Example:

```
$ yarn run remove --env=prod --stage=stage-1
```

##### CMD API

- --env= dev | prod -> default= dev
- --stage= regions-stage= regions stage would be= regions-> stage-1 (in yaml file)
- --output= true | false -> true (if false output file will not created in root inside `.outputs`)

Developed by: Raihan, Brillmark LLC
