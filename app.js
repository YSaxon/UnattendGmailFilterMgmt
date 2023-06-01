var CLIENT_ID = 'your-client-id';
var API_KEY = 'your-api-key';
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest"];
var SCOPES = 'https://www.googleapis.com/auth/gmail.settings.basic';

var authorizeButton = document.getElementById('authorize_button');

function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}

function initClient() {
    gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
    }).then(function () {
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        authorizeButton.onclick = handleAuthClick;
    });
}

function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        authorizeButton.style.display = 'none';
        createFilter();
    } else {
        authorizeButton.style.display = 'block';
    }
}

function handleAuthClick(event) {
    gapi.auth2.getAuthInstance().signIn();
}

function createFilter() {
    var request = gapi.client.gmail.users.settings.filters.create({
        'userId': 'me',
        'resource': {
            'criteria': {
                'from': 'example@example.com'
            },
            'action': {
                'removeLabelIds': ['INBOX']
            }
        }
    });

    request.execute(function(resp) {
        console.log('Filter created.');
    });
}

handleClientLoad();
