var kubernetesAPIRequest = require('request-promise');
const alexaservice_token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJrdWJlcm5ldGVzL3NlcnZpY2VhY2NvdW50Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9uYW1lc3BhY2UiOiJrdWJlLXN5c3RlbSIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VjcmV0Lm5hbWUiOiJhbGV4YXNlcnZpY2UtdG9rZW4taHQ3MjgiLCJrdWJlcm5ldGVzLmlvL3NlcnZpY2VhY2NvdW50L3NlcnZpY2UtYWNjb3VudC5uYW1lIjoiYWxleGFzZXJ2aWNlIiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9zZXJ2aWNlLWFjY291bnQudWlkIjoiZDg3NmJhNWItNzkzOC0xMWU4LTk3MjAtMDIwMDE3MDI5ZTEyIiwic3ViIjoic3lzdGVtOnNlcnZpY2VhY2NvdW50Omt1YmUtc3lzdGVtOmFsZXhhc2VydmljZSJ9.BR64DhwTzSXIKitSFZZr4G68rUcDOWbgapWqi426ewX0JP3GwprtD0GU4VrDFug50GPP0jbw0mdChJKRK412tPWDcbhFlEdTmH_277Z8blDkAKZvi90MbW6M-8RmxVYmutVhYLQLogATFYwnH7XQOt6dqgoxo3JJHx1IRfu4YigaaEppQ8USL3mDRDONIG-cRdanJ0cXAYmmf0fwYZs83T97NGBe6uMvDWH7W3KLn_RnPGYsDpTRAAgpGDAK56N7NyekvMO-g0boh_2uvnNhqMqAl0AdwlqXQ-Kal0el1J1eZcMKUuSZzYkIiopyu_igM_uG4kyJ7HsoT4VwlL2a-g";
// const namespace_controller_token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJrdWJlcm5ldGVzL3NlcnZpY2VhY2NvdW50Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9uYW1lc3BhY2UiOiJrdWJlLXN5c3RlbSIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VjcmV0Lm5hbWUiOiJuYW1lc3BhY2UtY29udHJvbGxlci10b2tlbi03Y2JmciIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VydmljZS1hY2NvdW50Lm5hbWUiOiJuYW1lc3BhY2UtY29udHJvbGxlciIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VydmljZS1hY2NvdW50LnVpZCI6ImZhNDc1MDNjLTVkODctMTFlOC05NzIwLTAyMDAxNzAyOWUxMiIsInN1YiI6InN5c3RlbTpzZXJ2aWNlYWNjb3VudDprdWJlLXN5c3RlbTpuYW1lc3BhY2UtY29udHJvbGxlciJ9.Wn43Qp8MVRm7pCFVjMchziKdPDE4au9QOMwTpXglg8ptH5vCWeHd52nJvyzMfZM4DNaZA9yCL0P2AchcjWMP3WubRS7b98JFacBQ_0NzDVBBWxF7GEvIgsMrgr-Abcuv3wpmJD1Jvqceu_rsVJqzqtM8qUlucsAMpzYAfrNO1qH_4VdSrv4PjUiiD6-uIM-PvyLLYrNDZkO1U6wAmaib-jIAYL0LFr5baO9CIMTaBLxyZ5I81QGATEIEqNebcGQ4rU38Uq83dY5aPPBtwBHa1aO2RGrwWDiNNdVy6ReQ8a5ubeSvS6zy_4DIbJTUuNTbo_Cl305msnvaugjo70qAgQ";
const master_api = 'https://129.213.99.195:443/';
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
