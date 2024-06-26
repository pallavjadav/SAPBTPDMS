/*
-----------------------------------------------------
CREATED BY:         PALLAVKUMAR JADAV 
PROJECT:            AIM - Vendor Invoice Management
SUPERVISED UNDER:   SAGAR KANDALGAONKAR
FILENAME:           handleDMSRequest.js
USE:                This is used to handle rest queries
                    from DMS system
------------------------------------------------------
*/

const axios = require("axios");
const xsenv = require("@sap/xsenv");

//get folder details from DMS using folderName
async function getFolderDetails(folderName) {
    xsenv.loadEnv();
    let services = {};
    try {
        services = xsenv.getServices({
            sdm: { tag: "sdm" },
        });
    } catch (error) {
        console.error(
            "[dms-service] - Please maintain the sdm service in the VCAP_SERVICES"
        );
    }
    const destination = {
        name: "sdm",
        type: "HTTP",
        url: services.sdm.endpoints.ecmservice.url,
        authentication: "OAuth2ClientCredentials",
        clientId: services.sdm.uaa.clientid,
        clientSecret: services.sdm.uaa.clientsecret,
        tokenServiceUrl: services.sdm.uaa.url + "/oauth/token",
    };
    if (services.sdm) {
        var dUrl = services.sdm.endpoints.ecmservice.url + "browser/f46f2045-6f70-425c-95ed-5e7df8f06fc8/root/" + folderName; 
        var headers = {
            headers: {
                Authorization:
                    "Bearer " + await getToken(services)
                    
            },
        };
        var result = await axios
                        .get(dUrl,headers)
                        .catch((error) => {
                           console.error(
                            "[dms-service] - Error recieved while getting the folder details"
                           );
                        });
        return result;
    }

}



async function getDocument(objectId){
    xsenv.loadEnv();
    let services = {};
    try {
        services = xsenv.getServices({
            sdm: { tag: "sdm" },
        });
    } catch (error) {
        console.error(
            "[dms-service] - Please maintain the sdm service in the VCAP_SERVICES"
        );
    }
    const destination = {
        name: "sdm",
        type: "HTTP",
        url: services.sdm.endpoints.ecmservice.url,
        authentication: "OAuth2ClientCredentials",
        clientId: services.sdm.uaa.clientid,
        clientSecret: services.sdm.uaa.clientsecret,
        tokenServiceUrl: services.sdm.uaa.url + "/oauth/token",
    };

    if (services.sdm) {

        var dUrl = services.sdm.endpoints.ecmservice.url + "browser/f46f2045-6f70-425c-95ed-5e7df8f06fc8/root?objectId=" + objectId; 
        var headers = {
            headers: {
                Authorization:
                    "Bearer " + await getToken(services),
                    
                
                    
            },responseType: 'arraybuffer',
            reponseEncoding: 'binary'
        };
        var result = await axios
                        .get(dUrl,headers)
                        .catch((error) => {
                           console.error(
                            "[dms-service] - Error recieved while getting the document"
                           );
                        });
        return  (result)?result.data:"";
    }

}

const _fetchJwtToken = async function (oauthUrl, oauthClient, oauthSecret) {
    // This is to get the oauth token , which is used to create the folder ID
    return new Promise((resolve, reject) => {
        const tokenUrl =
            oauthUrl +
            "/oauth/token?grant_type=client_credentials&response_type=token";
        const config = {
            headers: {
                Authorization:
                    "Basic " +
                    Buffer.from(oauthClient + ":" + oauthSecret).toString("base64"),
            },
        };
        axios
            .get(tokenUrl, config)
            .then((response) => {
                resolve(response.data.access_token);
            })
            .catch((error) => {
                reject(error);
            });
    });
};
const getToken = async function (services) {
    const destination = {
        name: "sdm",
        type: "HTTP",
        url: services.sdm.endpoints.ecmservice.url,
        authentication: "OAuth2ClientCredentials",
        clientId: services.sdm.uaa.clientid,
        clientSecret: services.sdm.uaa.clientsecret,
        tokenServiceUrl: services.sdm.uaa.url + "/oauth/token",
    };
    return _fetchJwtToken(
        services.sdm.uaa.url,
        destination.clientId,
        destination.clientSecret
    );
};

module.exports = {
    getFolderDetails,
    getDocument
}