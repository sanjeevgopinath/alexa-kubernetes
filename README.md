# alexa-kubernetes
Manage Kubernetes using Alexa

Edit KubernetesAPIRequest.js:
  > Add a valid Kubernetes User Token
  > Add a valid Master/API Server IP or Hostname
  
Create a Alexa Developer Account:
  > Create a "Custom" Skill
  > Paste the Alexa-Interaction-Model.json in the JSON Editor Section

To Run:
  > Prepare a Cloud Virtual Machine instance with NodeJS and Express installed
  > Create a temporary domain name from NO-IP Services and associate the domain with the public IP of the instance
  > Provide the temporary domain name as the endpoint in Alexa Developer Console
  > You need to create openssl based certs. You need to use the temporary domain name when creating the cert. Refer to Alexa Documentation.
  > These certificates need to be placed in ../alexacert/ folder. Ensure you refer to kubernetes-explorer.js for the correct location and filenames to be used.
  > To start the service, run Command: node kubernetes-explorer.js

Few words of caution:
  > Not recommended for production use in its current state.
  > You need to ensure that the Alexa user has only the minimum permissions necessary to perform the tasks.
