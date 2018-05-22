
// var regexMsdn = /^http[s]?(:\/\/msdn.microsoft.com\/(\w\w-\w\w)\/)/i,
// 	regexMsdnReplace = /:\/\/msdn.microsoft.com\/\w\w-\w\w\//i,
// 	enUsLocale = 'en-us',
// 	enMsdnSite = '://msdn.microsoft.com/en-us/';

// https://msdn.microsoft.com/pl-pl/library/system.threading.thread(v=vs.110).aspx
// https://azure.microsoft.com/pl-pl/services/
// https://docs.microsoft.com/pl-pl/dotnet/csharp/programming-guide/concepts/threading/
// https://docs.microsoft.com/pl-pl/aspnet/core/fundamentals/static-files?view=aspnetcore-2.0&tabs=aspnetcore2x

var hosts = [
	'msdn.microsoft.com',
	'azure.microsoft.com',
	'docs.microsoft.com'
]

hosts.forEach( function ( el ) { addHostListener ( el ); } );

function addHostListener ( host ) {

	var regexMsdn = new RegExp('^http[s]?(:\\/\\/' + host + '\\/(\\w\\w-\\w\\w)\\/)', 'i'),
		regexMsdnReplace = new RegExp(':\\/\\/' + host + '\\/\\w\\w-\\w\\w\\/'),
		enUsLocale = 'en-us',
		enMsdnSite = '://' + host + '/en-us/';

	console.debug( `Host redirection for site ${host} registered.` );

	chrome.webNavigation.onBeforeNavigate.addListener( function enmsdn_be4nav( details ) {

		var match = regexMsdn.exec ( details.url );
		
		if ( match && 3 === match.length && enUsLocale !== match[ 2 ].toLowerCase() ) {
	
			var newUrl = details.url.replace( regexMsdnReplace, enMsdnSite );
	
			chrome.tabs.update( details.tabId, { url: newUrl } );
		}
	},
	{ url: [ { hostEquals: host } ] }
	);
}
