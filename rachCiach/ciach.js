
/*
DOC
linia w konfiguracji może wyglądać tak:

    jakis_tam|regex|[123]
    {"rex":"jakis_tam|regex|[123]", "path":"regex_url|paska[adresu]"}

*/

var urlFilter = {
    urls: [ '<all_urls>' ]
};
var opts = [ 'blocking' ];

var rex = [];
var tabInf = [];

restoreOptions();
chrome.runtime.onMessage.addListener ( messageReceived );
chrome.webRequest.onBeforeRequest.addListener( blockAction, urlFilter, opts );
// tabs
chrome.tabs.query({}, getInitialTabs);
chrome.tabs.onCreated.addListener(onTabCreated);
chrome.tabs.onUpdated.addListener(onTabUpdated);
chrome.tabs.onRemoved.addListener(onTabRemoved);

function blockAction ( details ) {

    var cancel = rex.some ( function ( el ) {
        var tab = tabInf [ details.tabId ];
        if ( el.path && tab ){
            return el.path.test ( tab.url ) && el.rex.test( details.url );
        }
        return el.rex.test( details.url ); 
    });
    return { 
        cancel: cancel
    };
}

function restoreOptions ( ) {

    chrome.storage.sync.get ( {
        ciach: [ ]
    }, function ( state ) {

        rex = state.ciach
        .filter( function ( el ) { return !( 0 === el.indexOf ( '#' ) ); } )
        .map ( function ( el ) {
            var obj = {
                rex: el,
                path: null
            }
            
            if (0 === el.indexOf('{')) {
                try {
                    var jobj = JSON.parse(el);
                    obj = jobj;
                } catch (ex) {
                    console.error('Config line starting with "{" means JSON in line', ex);
                }
            }
            return {
                rex: new RegExp ( obj.rex, 'i' ),
                path: obj.path && new RegExp ( obj.path, 'i' )
            };
        });
    });
}

function messageReceived ( message, sender, response ) {

    if ( message && message.update )
        restoreOptions();
}

function getInitialTabs(tabs) {
    for(t of tabs) {
        tabInf[t.id] = {
            url: t.url
        };
    }
}

function onTabCreated(tab) {
    tabInf[tab.id] = {
        url: tab.url
    };
}

function onTabUpdated(tabId, changeInfo,  tab) {
    tabInf[tab.id].url = tab.url;
}

function onTabRemoved(tabId) {
    tabInf.splice(tabId, 1);
}