# What does this do?
This is a CLI for deploying multiple variants of a service to different Google Cloud Function endpoints.

Deployment of multiple endpoints is made fast and simple by concurrently deploying all of the Cloud Function endpoints set up inside the chameleon.json file.

This can provide a simple way of managing function code is that mostly the same, but with a small difference for each endpoint (e.g: endpoints for model inference with different model versions), without having to create multiple repositories.

# Installation
```
npm install . -g
```

# Requirements
* This project uses ES2020 modules, therefore Node V12+ must be used. It has been tested on a Node v14.17.3 environment
* In order to deploy the gcloud CLI (gcloud) must be available and the CLI should be authorized to access your project, e.g: by using `gcloud auth login` 


# CLI usage
## Configuration: chameleon.json
A chameleon.json file needs to be created inside the current directory. The JSON should contain an array of services, with each service specifying the details of the function variant to be deployed:
- name: the name of the function variant
- root: the location of the main code of the function to deploy (relative to "chameleon.json")
- variable_dirs (array)
	- dir_name: the location of the directory that contains varying code (relative to "chamelon.json")
	- source: the location of the code to use for this function (this will overwrite any existing code in the "dir_name" in the deployed codebase)

For example, if there are two functions to deploy, and the varying code is under the "src/pretrained" directory, the "chameleon.json" could be specified as follows:

```json
{
  "services": [
    {
      "name": "recognize-zh",
      "root": ".",
      "variable_dirs": [{
        "dir_name": "./src/pretrained",
        "source": "pretrained_model_zh"
      }]
    },
    {
      "name": "recognize-en",
      "root": ".",
      "variable_dirs": [{
        "dir_name": "./src/pretrained",
        "source": "pretrained_model_en"
      }]
    }
  ]
}
```

Note that for the "recognize-zh" function, the "/src/pretrained/pretrained_model_zh" directory is used for the "/src/pretrained" directory, while for the "recognize-en" function "/src/pretrained/pretrained_model_en" is used.

## Deploy: gfcham [gcloud-functions-flags]
The `gfcham` CLI accepts the same parameters as the flags passed to `gcloud functions deploy`. In most cases, the corresponding `gcloud functions deploy` command can be used, but ommitting the first positional parameter (the name of the function to be deployed) as the name of the functions to be deployed are contained inside chameleon.json.

e.g:
```
gfcham --entry-point main --runtime python37 --trigger-http --allow-unauthenticated --memory 1024MB
```
