
var urlFilter = {
    urls: [ '<all_urls>' ]
};
var opts = [ 'blocking' ];

var rex = [];

restoreOptions();
chrome.runtime.onMessage.addListener ( messageReceived );
chrome.webRequest.onBeforeRequest.addListener( blockAction, urlFilter, opts );

function blockAction ( details ) {

    var cancel = rex.some ( function ( el ) { return el.test( details.url ); } );
    return { 
        cancel: cancel
    };
}

function restoreOptions ( ) {

    chrome.storage.sync.get ( {
        ciach: [ ]
    }, function ( state ) {

        rex = state.ciach.map ( function ( el ) { return new RegExp ( el, 'i' ); } );
    });
}

function messageReceived ( message, sender, response ) {

    if ( message && message.update )
        restoreOptions();
}