
function save_options ( ) {

    var val = ( $data.value || '' )
              .split ( '\n' )
              .filter ( function ( el ) { return !! el.trim ( ); } )
              .map ( function ( el ) { return el.trim ( ); } ) || [ ];

    chrome.storage.sync.set ( {
        ciach: val
    }, function ( ) {

        chrome.runtime.sendMessage ( null, { update: true } );
    } );
}

function restore_options ( ) {

    chrome.storage.sync.get ( {
        ciach: []
    }, function ( state ) {

        $data.value = state.ciach.join ( '\r\n' );
    } );
}

var $data = document.getElementById ( 'ciach' );

document.addEventListener ( 'DOMContentLoaded', restore_options );
document.getElementById ( 'zapisz' )
        .addEventListener ( 'click', save_options );