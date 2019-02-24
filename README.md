# alexa-kubernetes
Manage Kubernetes using Alexa

Edit KubernetesAPIRequest.js:
1. Add a valid Kubernetes User Token
2. Add a valid Master/API Server IP or Hostname
  
Create a Alexa Developer Account:
1. Create a "Custom" Skill
2. Paste the Alexa-Interaction-Model.json in the JSON Editor Section

To Run:
1. Prepare a Cloud Virtual Machine instance with NodeJS and Express installed
2. Create a temporary domain name from NO-IP Services and associate the domain with the public IP of the instance
3. Provide the temporary domain name as the endpoint in Alexa Developer Console
4. You need to create openssl based certs. You need to use the temporary domain name when creating the cert. Refer to Alexa Documentation.
5. These certificates need to be placed in ../alexacert/ folder. Ensure you refer to kubernetes-explorer.js for the correct location and filenames to be used.
6. To start the service, run Command: node kubernetes-explorer.js

Few words of caution:
1. Not recommended for production use in its current state.
2. You need to ensure that the Alexa user has only the minimum permissions necessary to perform the tasks.
