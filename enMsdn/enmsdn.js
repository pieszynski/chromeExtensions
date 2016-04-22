
var regexMsdn = /^http[s]?(:\/\/msdn.microsoft.com\/(\w\w-\w\w)\/)/i,
	regexMsdnReplace = /:\/\/msdn.microsoft.com\/\w\w-\w\w\//i,
	enUsLocale = 'en-us',
	enMsdnSite = '://msdn.microsoft.com/en-us/';

chrome.webNavigation.onBeforeNavigate.addListener( function enmsdn_be4nav( details ) {

	var match = regexMsdn.exec ( details.url );
	
	if ( match && 3 === match.length && enUsLocale !== match[ 2 ].toLowerCase() ) {

		var newUrl = details.url.replace( regexMsdnReplace, enMsdnSite );

		chrome.tabs.update( details.tabId, { url: newUrl } );
	}
},
{ url: [ { hostEquals: 'msdn.microsoft.com' } ] }
);