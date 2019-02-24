var kubernetesAPIRequest = require('request-promise');
// Enter the Alexa Server User Token Here:
const alexaservice_token = "";
// Enter the Kubernetes Master API Server IP/Hostname Here:
const master_api = '';

module.exports = {
    query: function (path, callback) {
        // Build Request
        var options = {
        uri: master_api + path,
        method: 'GET',
        json: true,
        rejectUnauthorized: false,
        headers: {
            // Authorization: 'Bearer ' + alexaservice_token,
            'Content-Type': 'application/json'
            }
        }

        kubernetesAPIRequest(options)
        .then(function (kubernetesJSONResponse) {
            console.log("Received a response for " + path);
            callback(null, kubernetesJSONResponse);
        })
        .catch(function (err) {
            console.log("Received an error for " + path + ". Here are more details: " + err);
            callback(err, null);
        })
    },

    scaleJSONConstructor: function (_namespace, _deploymentName, _replicaCount) {
        var scaleJSON = {
                            kind: "Scale",
                            apiVersion: "autoscaling/v1",
                            metadata: {
                                            name: "",
                                            namespace: "default",
                                            selfLink: "/apis/apps/v1/namespaces/default/deployments/account-statement/scale",
                                            uid: "24166921-7884-11e8-9720-020017029e12",
                                            resourceVersion: "3846029",
                                            creationTimestamp: "2018-06-25T14:29:17Z"
                            },
                            spec: {
                                            replicas: 0
                            },
                            /* status: {
                                            replicas: 13,
                                            selector: "run="
                            } */
                        };
        scaleJSON.metadata.name = _deploymentName;
        scaleJSON.metadata.namespace = _namespace;
        scaleJSON.metadata.selfLink = "/apis/apps/v1/namespaces/" + _namespace + "/deployments/" + _deploymentName + "/scale";
        scaleJSON.spec.replicas = _replicaCount;
        // scaleJSON.status.selector += _deploymentName;
        return scaleJSON;
    },

    queryScale: function(path, putJSON) {

        var options = {
        uri: master_api + path,
        method: 'PUT',
        body: putJSON,
        json: true,
        rejectUnauthorized: false,
        headers: {
            // Authorization: 'Bearer ' + alexaservice_token,
            'Content-Type': 'application/json'
            }
        }

        kubernetesAPIRequest(options)
        .then(
                function() { console.log("PUT SUCCEEDED"); }
             )
        .catch(
                function(err) { console.log("PUT FAILED" + err); }
              );
    }
};
