# alexa-kubernetes
Manage Kubernetes using Alexa

Edit KubernetesAPIRequest.js:
  > Add a valid Kubernetes User Token
  > Add a valid Master/API Server IP or Hostname

To Run:
  > You need to create openssl based certs. Refer to Alexa Documentation.
  > These certificates need to be placed in ../alexacert/ folder
  > You need NodeJS
  > Run Command: node kubernetes-explorer.js

Few words of caution:
  > Not recommended for production use in its current state.
  > You need to ensure that the Alexa user has only the minimum permissions necessary to perform the tasks.
