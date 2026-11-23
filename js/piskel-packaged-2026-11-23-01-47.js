/*!
 * jQuery JavaScript Library v1.8.0
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright 2012 jQuery Foundation and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: Thu Aug 09 2012 16:24:48 GMT-0400 (Eastern Daylight Time)
 */
(function( window, undefined ) {
var
	// A central reference to the root jQuery(document)
	rootjQuery,

	// The deferred used on DOM ready
	readyList,

	// Use the correct document accordingly with window argument (sandbox)
	document = window.document,
	location = window.location,
	navigator = window.navigator,

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$,

	// Save a reference to some core methods
	core_push = Array.prototype.push,
	core_slice = Array.prototype.slice,
	core_indexOf = Array.prototype.indexOf,
	core_toString = Object.prototype.toString,
	core_hasOwn = Object.prototype.hasOwnProperty,
	core_trim = String.prototype.trim,

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {
		// The jQuery object is actually just the init constructor 'enhanced'
		return new jQuery.fn.init( selector, context, rootjQuery );
	},

	// Used for matching numbers
	core_pnum = /[\-+]?(?:\d*\.|)\d+(?:[eE][\-+]?\d+|)/.source,

	// Used for detecting and trimming whitespace
	core_rnotwhite = /\S/,
	core_rspace = /\s+/,

	// IE doesn't match non-breaking spaces with \s
	rtrim = core_rnotwhite.test("\xA0") ? (/^[\s\xA0]+|[\s\xA0]+$/g) : /^\s+|\s+$/g,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	rquickExpr = /^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,

	// Match a standalone tag
	rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,

	// JSON RegExp
	rvalidchars = /^[\],:{}\s]*$/,
	rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,
	rvalidescape = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,
	rvalidtokens = /"[^"\\\r\n]*"|true|false|null|-?(?:\d\d*\.|)\d+(?:[eE][\-+]?\d+|)/g,

	// Matches dashed string for camelizing
	rmsPrefix = /^-ms-/,
	rdashAlpha = /-([\da-z])/gi,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return ( letter + "" ).toUpperCase();
	},

	// The ready event handler and self cleanup method
	DOMContentLoaded = function() {
		if ( document.addEventListener ) {
			document.removeEventListener( "DOMContentLoaded", DOMContentLoaded, false );
			jQuery.ready();
		} else if ( document.readyState === "complete" ) {
			// we're here because readyState === "complete" in oldIE
			// which is good enough for us to call the dom ready!
			document.detachEvent( "onreadystatechange", DOMContentLoaded );
			jQuery.ready();
		}
	},

	// [[Class]] -> type pairs
	class2type = {};

jQuery.fn = jQuery.prototype = {
	constructor: jQuery,
	init: function( selector, context, rootjQuery ) {
		var match, elem, ret, doc;

		// Handle $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Handle $(DOMElement)
		if ( selector.nodeType ) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;
		}

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && (match[1] || !context) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[1] ) {
					context = context instanceof jQuery ? context[0] : context;
					doc = ( context && context.nodeType ? context.ownerDocument || context : document );

					// scripts is true for back-compat
					selector = jQuery.parseHTML( match[1], doc, true );
					if ( rsingleTag.test( match[1] ) && jQuery.isPlainObject( context ) ) {
						this.attr.call( selector, context, true );
					}

					return jQuery.merge( this, selector );

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[2] );

					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE and Opera return items
						// by name instead of ID
						if ( elem.id !== match[2] ) {
							return rootjQuery.find( selector );
						}

						// Otherwise, we inject the element directly into the jQuery object
						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || rootjQuery ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return rootjQuery.ready( selector );
		}

		if ( selector.selector !== undefined ) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	},

	// Start with an empty selector
	selector: "",

	// The current version of jQuery being used
	jquery: "1.8.0",

	// The default length of a jQuery object is 0
	length: 0,

	// The number of elements contained in the matched element set
	size: function() {
		return this.length;
	},

	toArray: function() {
		return core_slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num == null ?

			// Return a 'clean' array
			this.toArray() :

			// Return just the object
			( num < 0 ? this[ this.length + num ] : this[ num ] );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems, name, selector ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;

		ret.context = this.context;

		if ( name === "find" ) {
			ret.selector = this.selector + ( this.selector ? " " : "" ) + selector;
		} else if ( name ) {
			ret.selector = this.selector + "." + name + "(" + selector + ")";
		}

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},

	ready: function( fn ) {
		// Add the callback
		jQuery.ready.promise().done( fn );

		return this;
	},

	eq: function( i ) {
		i = +i;
		return i === -1 ?
			this.slice( i ) :
			this.slice( i, i + 1 );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	slice: function() {
		return this.pushStack( core_slice.apply( this, arguments ),
			"slice", core_slice.call(arguments).join(",") );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function( elem, i ) {
			return callback.call( elem, i, elem );
		}));
	},

	end: function() {
		return this.prevObject || this.constructor(null);
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: core_push,
	sort: [].sort,
	splice: [].splice
};

// Give the init function the jQuery prototype for later instantiation
jQuery.fn.init.prototype = jQuery.fn;

jQuery.extend = jQuery.fn.extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( length === i ) {
		target = this;
		--i;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray(src) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend({
	noConflict: function( deep ) {
		if ( window.$ === jQuery ) {
			window.$ = _$;
		}

		if ( deep && window.jQuery === jQuery ) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	},

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Hold (or release) the ready event
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
		if ( !document.body ) {
			return setTimeout( jQuery.ready, 1 );
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );

		// Trigger any bound ready events
		if ( jQuery.fn.trigger ) {
			jQuery( document ).trigger("ready").off("ready");
		}
	},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return jQuery.type(obj) === "function";
	},

	isArray: Array.isArray || function( obj ) {
		return jQuery.type(obj) === "array";
	},

	isWindow: function( obj ) {
		return obj != null && obj == obj.window;
	},

	isNumeric: function( obj ) {
		return !isNaN( parseFloat(obj) ) && isFinite( obj );
	},

	type: function( obj ) {
		return obj == null ?
			String( obj ) :
			class2type[ core_toString.call(obj) ] || "object";
	},

	isPlainObject: function( obj ) {
		// Must be an Object.
		// Because of IE, we also have to check the presence of the constructor property.
		// Make sure that DOM nodes and window objects don't pass through, as well
		if ( !obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		try {
			// Not own constructor property must be Object
			if ( obj.constructor &&
				!core_hasOwn.call(obj, "constructor") &&
				!core_hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
				return false;
			}
		} catch ( e ) {
			// IE8,9 Will throw exceptions on certain host objects #9897
			return false;
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.

		var key;
		for ( key in obj ) {}

		return key === undefined || core_hasOwn.call( obj, key );
	},

	isEmptyObject: function( obj ) {
		var name;
		for ( name in obj ) {
			return false;
		}
		return true;
	},

	error: function( msg ) {
		throw new Error( msg );
	},

	// data: string of html
	// context (optional): If specified, the fragment will be created in this context, defaults to document
	// scripts (optional): If true, will include scripts passed in the html string
	parseHTML: function( data, context, scripts ) {
		var parsed;
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		if ( typeof context === "boolean" ) {
			scripts = context;
			context = 0;
		}
		context = context || document;

		// Single tag
		if ( (parsed = rsingleTag.exec( data )) ) {
			return [ context.createElement( parsed[1] ) ];
		}

		parsed = jQuery.buildFragment( [ data ], context, scripts ? null : [] );
		return jQuery.merge( [],
			(parsed.cacheable ? jQuery.clone( parsed.fragment ) : parsed.fragment).childNodes );
	},

	parseJSON: function( data ) {
		if ( !data || typeof data !== "string") {
			return null;
		}

		// Make sure leading/trailing whitespace is removed (IE can't handle it)
		data = jQuery.trim( data );

		// Attempt to parse using the native JSON parser first
		if ( window.JSON && window.JSON.parse ) {
			return window.JSON.parse( data );
		}

		// Make sure the incoming data is actual JSON
		// Logic borrowed from http://json.org/json2.js
		if ( rvalidchars.test( data.replace( rvalidescape, "@" )
			.replace( rvalidtokens, "]" )
			.replace( rvalidbraces, "")) ) {

			return ( new Function( "return " + data ) )();

		}
		jQuery.error( "Invalid JSON: " + data );
	},

	// Cross-browser xml parsing
	parseXML: function( data ) {
		var xml, tmp;
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		try {
			if ( window.DOMParser ) { // Standard
				tmp = new DOMParser();
				xml = tmp.parseFromString( data , "text/xml" );
			} else { // IE
				xml = new ActiveXObject( "Microsoft.XMLDOM" );
				xml.async = "false";
				xml.loadXML( data );
			}
		} catch( e ) {
			xml = undefined;
		}
		if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
			jQuery.error( "Invalid XML: " + data );
		}
		return xml;
	},

	noop: function() {},

	// Evaluates a script in a global context
	// Workarounds based on findings by Jim Driscoll
	// http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
	globalEval: function( data ) {
		if ( data && core_rnotwhite.test( data ) ) {
			// We use execScript on Internet Explorer
			// We use an anonymous function so that context is window
			// rather than jQuery in Firefox
			( window.execScript || function( data ) {
				window[ "eval" ].call( window, data );
			} )( data );
		}
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toUpperCase() === name.toUpperCase();
	},

	// args is for internal usage only
	each: function( obj, callback, args ) {
		var name,
			i = 0,
			length = obj.length,
			isObj = length === undefined || jQuery.isFunction( obj );

		if ( args ) {
			if ( isObj ) {
				for ( name in obj ) {
					if ( callback.apply( obj[ name ], args ) === false ) {
						break;
					}
				}
			} else {
				for ( ; i < length; ) {
					if ( callback.apply( obj[ i++ ], args ) === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if ( isObj ) {
				for ( name in obj ) {
					if ( callback.call( obj[ name ], name, obj[ name ] ) === false ) {
						break;
					}
				}
			} else {
				for ( ; i < length; ) {
					if ( callback.call( obj[ i ], i, obj[ i++ ] ) === false ) {
						break;
					}
				}
			}
		}

		return obj;
	},

	// Use native String.trim function wherever possible
	trim: core_trim ?
		function( text ) {
			return text == null ?
				"" :
				core_trim.call( text );
		} :

		// Otherwise use our own trimming functionality
		function( text ) {
			return text == null ?
				"" :
				text.toString().replace( rtrim, "" );
		},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var type,
			ret = results || [];

		if ( arr != null ) {
			// The window, strings (and functions) also have 'length'
			// Tweaked logic slightly to handle Blackberry 4.7 RegExp issues #6930
			type = jQuery.type( arr );

			if ( arr.length == null || type === "string" || type === "function" || type === "regexp" || jQuery.isWindow( arr ) ) {
				core_push.call( ret, arr );
			} else {
				jQuery.merge( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		var len;

		if ( arr ) {
			if ( core_indexOf ) {
				return core_indexOf.call( arr, elem, i );
			}

			len = arr.length;
			i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;

			for ( ; i < len; i++ ) {
				// Skip accessing in sparse arrays
				if ( i in arr && arr[ i ] === elem ) {
					return i;
				}
			}
		}

		return -1;
	},

	merge: function( first, second ) {
		var l = second.length,
			i = first.length,
			j = 0;

		if ( typeof l === "number" ) {
			for ( ; j < l; j++ ) {
				first[ i++ ] = second[ j ];
			}

		} else {
			while ( second[j] !== undefined ) {
				first[ i++ ] = second[ j++ ];
			}
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, inv ) {
		var retVal,
			ret = [],
			i = 0,
			length = elems.length;
		inv = !!inv;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			retVal = !!callback( elems[ i ], i );
			if ( inv !== retVal ) {
				ret.push( elems[ i ] );
			}
		}

		return ret;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var value, key,
			ret = [],
			i = 0,
			length = elems.length,
			// jquery objects are treated as arrays
			isArray = elems instanceof jQuery || length !== undefined && typeof length === "number" && ( ( length > 0 && elems[ 0 ] && elems[ length -1 ] ) || length === 0 || jQuery.isArray( elems ) ) ;

		// Go through the array, translating each of the items to their
		if ( isArray ) {
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}

		// Go through every key on the object,
		} else {
			for ( key in elems ) {
				value = callback( elems[ key ], key, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}
		}

		// Flatten any nested arrays
		return ret.concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		var tmp, args, proxy;

		if ( typeof context === "string" ) {
			tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		args = core_slice.call( arguments, 2 );
		proxy = function() {
			return fn.apply( context, args.concat( core_slice.call( arguments ) ) );
		};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || proxy.guid || jQuery.guid++;

		return proxy;
	},

	// Multifunctional method to get and set values of a collection
	// The value/s can optionally be executed if it's a function
	access: function( elems, fn, key, value, chainable, emptyGet, pass ) {
		var exec,
			bulk = key == null,
			i = 0,
			length = elems.length;

		// Sets many values
		if ( key && typeof key === "object" ) {
			for ( i in key ) {
				jQuery.access( elems, fn, i, key[i], 1, emptyGet, value );
			}
			chainable = 1;

		// Sets one value
		} else if ( value !== undefined ) {
			// Optionally, function values get executed if exec is true
			exec = pass === undefined && jQuery.isFunction( value );

			if ( bulk ) {
				// Bulk operations only iterate when executing function values
				if ( exec ) {
					exec = fn;
					fn = function( elem, key, value ) {
						return exec.call( jQuery( elem ), value );
					};

				// Otherwise they run against the entire set
				} else {
					fn.call( elems, value );
					fn = null;
				}
			}

			if ( fn ) {
				for (; i < length; i++ ) {
					fn( elems[i], key, exec ? value.call( elems[i], i, fn( elems[i], key ) ) : value, pass );
				}
			}

			chainable = 1;
		}

		return chainable ?
			elems :

			// Gets
			bulk ?
				fn.call( elems ) :
				length ? fn( elems[0], key ) : emptyGet;
	},

	now: function() {
		return ( new Date() ).getTime();
	}
});

jQuery.ready.promise = function( obj ) {
	if ( !readyList ) {

		readyList = jQuery.Deferred();

		// Catch cases where $(document).ready() is called after the
		// browser event has already occurred.
		if ( document.readyState === "complete" || ( document.readyState !== "loading" && document.addEventListener ) ) {
			// Handle it asynchronously to allow scripts the opportunity to delay ready
			setTimeout( jQuery.ready, 1 );

		// Standards-based browsers support DOMContentLoaded
		} else if ( document.addEventListener ) {
			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", DOMContentLoaded, false );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", jQuery.ready, false );

		// If IE event model is used
		} else {
			// Ensure firing before onload, maybe late but safe also for iframes
			document.attachEvent( "onreadystatechange", DOMContentLoaded );

			// A fallback to window.onload, that will always work
			window.attachEvent( "onload", jQuery.ready );

			// If IE and not a frame
			// continually check to see if the document is ready
			var top = false;

			try {
				top = window.frameElement == null && document.documentElement;
			} catch(e) {}

			if ( top && top.doScroll ) {
				(function doScrollCheck() {
					if ( !jQuery.isReady ) {

						try {
							// Use the trick by Diego Perini
							// http://javascript.nwbox.com/IEContentLoaded/
							top.doScroll("left");
						} catch(e) {
							return setTimeout( doScrollCheck, 50 );
						}

						// and execute any waiting functions
						jQuery.ready();
					}
				})();
			}
		}
	}
	return readyList.promise( obj );
};

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object".split(" "), function(i, name) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

// All jQuery objects should point back to these
rootjQuery = jQuery(document);
// String to Object options format cache
var optionsCache = {};

// Convert String-formatted options into Object-formatted ones and store in cache
function createOptions( options ) {
	var object = optionsCache[ options ] = {};
	jQuery.each( options.split( core_rspace ), function( _, flag ) {
		object[ flag ] = true;
	});
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		( optionsCache[ options ] || createOptions( options ) ) :
		jQuery.extend( {}, options );

	var // Last fire value (for non-forgettable lists)
		memory,
		// Flag to know if list was already fired
		fired,
		// Flag to know if list is currently firing
		firing,
		// First callback to fire (used internally by add and fireWith)
		firingStart,
		// End of the loop when firing
		firingLength,
		// Index of currently firing callback (modified by remove if needed)
		firingIndex,
		// Actual callback list
		list = [],
		// Stack of fire calls for repeatable lists
		stack = !options.once && [],
		// Fire callbacks
		fire = function( data ) {
			memory = options.memory && data;
			fired = true;
			firingIndex = firingStart || 0;
			firingStart = 0;
			firingLength = list.length;
			firing = true;
			for ( ; list && firingIndex < firingLength; firingIndex++ ) {
				if ( list[ firingIndex ].apply( data[ 0 ], data[ 1 ] ) === false && options.stopOnFalse ) {
					memory = false; // To prevent further calls using add
					break;
				}
			}
			firing = false;
			if ( list ) {
				if ( stack ) {
					if ( stack.length ) {
						fire( stack.shift() );
					}
				} else if ( memory ) {
					list = [];
				} else {
					self.disable();
				}
			}
		},
		// Actual Callbacks object
		self = {
			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {
					// First, we save the current length
					var start = list.length;
					(function add( args ) {
						jQuery.each( args, function( _, arg ) {
							if ( jQuery.isFunction( arg ) && ( !options.unique || !self.has( arg ) ) ) {
								list.push( arg );
							} else if ( arg && arg.length ) {
								// Inspect recursively
								add( arg );
							}
						});
					})( arguments );
					// Do we need to add the callbacks to the
					// current firing batch?
					if ( firing ) {
						firingLength = list.length;
					// With memory, if we're not firing then
					// we should call right away
					} else if ( memory ) {
						firingStart = start;
						fire( memory );
					}
				}
				return this;
			},
			// Remove a callback from the list
			remove: function() {
				if ( list ) {
					jQuery.each( arguments, function( _, arg ) {
						var index;
						while( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
							list.splice( index, 1 );
							// Handle firing indexes
							if ( firing ) {
								if ( index <= firingLength ) {
									firingLength--;
								}
								if ( index <= firingIndex ) {
									firingIndex--;
								}
							}
						}
					});
				}
				return this;
			},
			// Control if a given callback is in the list
			has: function( fn ) {
				return jQuery.inArray( fn, list ) > -1;
			},
			// Remove all callbacks from the list
			empty: function() {
				list = [];
				return this;
			},
			// Have the list do nothing anymore
			disable: function() {
				list = stack = memory = undefined;
				return this;
			},
			// Is it disabled?
			disabled: function() {
				return !list;
			},
			// Lock the list in its current state
			lock: function() {
				stack = undefined;
				if ( !memory ) {
					self.disable();
				}
				return this;
			},
			// Is it locked?
			locked: function() {
				return !stack;
			},
			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				args = args || [];
				args = [ context, args.slice ? args.slice() : args ];
				if ( list && ( !fired || stack ) ) {
					if ( firing ) {
						stack.push( args );
					} else {
						fire( args );
					}
				}
				return this;
			},
			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},
			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};
jQuery.extend({

	Deferred: function( func ) {
		var tuples = [
				// action, add listener, listener list, final state
				[ "resolve", "done", jQuery.Callbacks("once memory"), "resolved" ],
				[ "reject", "fail", jQuery.Callbacks("once memory"), "rejected" ],
				[ "notify", "progress", jQuery.Callbacks("memory") ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				then: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;
					return jQuery.Deferred(function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {
							var action = tuple[ 0 ],
								fn = fns[ i ];
							// deferred[ done | fail | progress ] for forwarding actions to newDefer
							deferred[ tuple[1] ]( jQuery.isFunction( fn ) ?
								function() {
									var returned = fn.apply( this, arguments );
									if ( returned && jQuery.isFunction( returned.promise ) ) {
										returned.promise()
											.done( newDefer.resolve )
											.fail( newDefer.reject )
											.progress( newDefer.notify );
									} else {
										newDefer[ action + "With" ]( this === deferred ? newDefer : this, [ returned ] );
									}
								} :
								newDefer[ action ]
							);
						});
						fns = null;
					}).promise();
				},
				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return typeof obj === "object" ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Keep pipe for back-compat
		promise.pipe = promise.then;

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 3 ];

			// promise[ done | fail | progress ] = list.add
			promise[ tuple[1] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(function() {
					// state = [ resolved | rejected ]
					state = stateString;

				// [ reject_list | resolve_list ].disable; progress_list.lock
				}, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
			}

			// deferred[ resolve | reject | notify ] = list.fire
			deferred[ tuple[0] ] = list.fire;
			deferred[ tuple[0] + "With" ] = list.fireWith;
		});

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( subordinate /* , ..., subordinateN */ ) {
		var i = 0,
			resolveValues = core_slice.call( arguments ),
			length = resolveValues.length,

			// the count of uncompleted subordinates
			remaining = length !== 1 || ( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,

			// the master Deferred. If resolveValues consist of only a single Deferred, just use that.
			deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

			// Update function for both resolve and progress values
			updateFunc = function( i, contexts, values ) {
				return function( value ) {
					contexts[ i ] = this;
					values[ i ] = arguments.length > 1 ? core_slice.call( arguments ) : value;
					if( values === progressValues ) {
						deferred.notifyWith( contexts, values );
					} else if ( !( --remaining ) ) {
						deferred.resolveWith( contexts, values );
					}
				};
			},

			progressValues, progressContexts, resolveContexts;

		// add listeners to Deferred subordinates; treat others as resolved
		if ( length > 1 ) {
			progressValues = new Array( length );
			progressContexts = new Array( length );
			resolveContexts = new Array( length );
			for ( ; i < length; i++ ) {
				if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
					resolveValues[ i ].promise()
						.done( updateFunc( i, resolveContexts, resolveValues ) )
						.fail( deferred.reject )
						.progress( updateFunc( i, progressContexts, progressValues ) );
				} else {
					--remaining;
				}
			}
		}

		// if we're not waiting on anything, resolve the master
		if ( !remaining ) {
			deferred.resolveWith( resolveContexts, resolveValues );
		}

		return deferred.promise();
	}
});
jQuery.support = (function() {

	var support,
		all,
		a,
		select,
		opt,
		input,
		fragment,
		eventName,
		i,
		isSupported,
		clickFn,
		div = document.createElement("div");

	// Preliminary tests
	div.setAttribute( "className", "t" );
	div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";

	all = div.getElementsByTagName("*");
	a = div.getElementsByTagName("a")[ 0 ];
	a.style.cssText = "top:1px;float:left;opacity:.5";

	// Can't get basic test support
	if ( !all || !all.length || !a ) {
		return {};
	}

	// First batch of supports tests
	select = document.createElement("select");
	opt = select.appendChild( document.createElement("option") );
	input = div.getElementsByTagName("input")[ 0 ];

	support = {
		// IE strips leading whitespace when .innerHTML is used
		leadingWhitespace: ( div.firstChild.nodeType === 3 ),

		// Make sure that tbody elements aren't automatically inserted
		// IE will insert them into empty tables
		tbody: !div.getElementsByTagName("tbody").length,

		// Make sure that link elements get serialized correctly by innerHTML
		// This requires a wrapper element in IE
		htmlSerialize: !!div.getElementsByTagName("link").length,

		// Get the style information from getAttribute
		// (IE uses .cssText instead)
		style: /top/.test( a.getAttribute("style") ),

		// Make sure that URLs aren't manipulated
		// (IE normalizes it by default)
		hrefNormalized: ( a.getAttribute("href") === "/a" ),

		// Make sure that element opacity exists
		// (IE uses filter instead)
		// Use a regex to work around a WebKit issue. See #5145
		opacity: /^0.5/.test( a.style.opacity ),

		// Verify style float existence
		// (IE uses styleFloat instead of cssFloat)
		cssFloat: !!a.style.cssFloat,

		// Make sure that if no value is specified for a checkbox
		// that it defaults to "on".
		// (WebKit defaults to "" instead)
		checkOn: ( input.value === "on" ),

		// Make sure that a selected-by-default option has a working selected property.
		// (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
		optSelected: opt.selected,

		// Test setAttribute on camelCase class. If it works, we need attrFixes when doing get/setAttribute (ie6/7)
		getSetAttribute: div.className !== "t",

		// Tests for enctype support on a form(#6743)
		enctype: !!document.createElement("form").enctype,

		// Makes sure cloning an html5 element does not cause problems
		// Where outerHTML is undefined, this still works
		html5Clone: document.createElement("nav").cloneNode( true ).outerHTML !== "<:nav></:nav>",

		// jQuery.support.boxModel DEPRECATED in 1.8 since we don't support Quirks Mode
		boxModel: ( document.compatMode === "CSS1Compat" ),

		// Will be defined later
		submitBubbles: true,
		changeBubbles: true,
		focusinBubbles: false,
		deleteExpando: true,
		noCloneEvent: true,
		inlineBlockNeedsLayout: false,
		shrinkWrapBlocks: false,
		reliableMarginRight: true,
		boxSizingReliable: true,
		pixelPosition: false
	};

	// Make sure checked status is properly cloned
	input.checked = true;
	support.noCloneChecked = input.cloneNode( true ).checked;

	// Make sure that the options inside disabled selects aren't marked as disabled
	// (WebKit marks them as disabled)
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Test to see if it's possible to delete an expando from an element
	// Fails in Internet Explorer
	try {
		delete div.test;
	} catch( e ) {
		support.deleteExpando = false;
	}

	if ( !div.addEventListener && div.attachEvent && div.fireEvent ) {
		div.attachEvent( "onclick", clickFn = function() {
			// Cloning a node shouldn't copy over any
			// bound event handlers (IE does this)
			support.noCloneEvent = false;
		});
		div.cloneNode( true ).fireEvent("onclick");
		div.detachEvent( "onclick", clickFn );
	}

	// Check if a radio maintains its value
	// after being appended to the DOM
	input = document.createElement("input");
	input.value = "t";
	input.setAttribute( "type", "radio" );
	support.radioValue = input.value === "t";

	input.setAttribute( "checked", "checked" );

	// #11217 - WebKit loses check when the name is after the checked attribute
	input.setAttribute( "name", "t" );

	div.appendChild( input );
	fragment = document.createDocumentFragment();
	fragment.appendChild( div.lastChild );

	// WebKit doesn't clone checked state correctly in fragments
	support.checkClone = fragment.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Check if a disconnected checkbox will retain its checked
	// value of true after appended to the DOM (IE6/7)
	support.appendChecked = input.checked;

	fragment.removeChild( input );
	fragment.appendChild( div );

	// Technique from Juriy Zaytsev
	// http://perfectionkills.com/detecting-event-support-without-browser-sniffing/
	// We only care about the case where non-standard event systems
	// are used, namely in IE. Short-circuiting here helps us to
	// avoid an eval call (in setAttribute) which can cause CSP
	// to go haywire. See: https://developer.mozilla.org/en/Security/CSP
	if ( div.attachEvent ) {
		for ( i in {
			submit: true,
			change: true,
			focusin: true
		}) {
			eventName = "on" + i;
			isSupported = ( eventName in div );
			if ( !isSupported ) {
				div.setAttribute( eventName, "return;" );
				isSupported = ( typeof div[ eventName ] === "function" );
			}
			support[ i + "Bubbles" ] = isSupported;
		}
	}

	// Run tests that need a body at doc ready
	jQuery(function() {
		var container, div, tds, marginDiv,
			divReset = "padding:0;margin:0;border:0;display:block;overflow:hidden;",
			body = document.getElementsByTagName("body")[0];

		if ( !body ) {
			// Return for frameset docs that don't have a body
			return;
		}

		container = document.createElement("div");
		container.style.cssText = "visibility:hidden;border:0;width:0;height:0;position:static;top:0;margin-top:1px";
		body.insertBefore( container, body.firstChild );

		// Construct the test element
		div = document.createElement("div");
		container.appendChild( div );

		// Check if table cells still have offsetWidth/Height when they are set
		// to display:none and there are still other visible table cells in a
		// table row; if so, offsetWidth/Height are not reliable for use when
		// determining if an element has been hidden directly using
		// display:none (it is still safe to use offsets if a parent element is
		// hidden; don safety goggles and see bug #4512 for more information).
		// (only IE 8 fails this test)
		div.innerHTML = "<table><tr><td></td><td>t</td></tr></table>";
		tds = div.getElementsByTagName("td");
		tds[ 0 ].style.cssText = "padding:0;margin:0;border:0;display:none";
		isSupported = ( tds[ 0 ].offsetHeight === 0 );

		tds[ 0 ].style.display = "";
		tds[ 1 ].style.display = "none";

		// Check if empty table cells still have offsetWidth/Height
		// (IE <= 8 fail this test)
		support.reliableHiddenOffsets = isSupported && ( tds[ 0 ].offsetHeight === 0 );

		// Check box-sizing and margin behavior
		div.innerHTML = "";
		div.style.cssText = "box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;";
		support.boxSizing = ( div.offsetWidth === 4 );
		support.doesNotIncludeMarginInBodyOffset = ( body.offsetTop !== 1 );

		// NOTE: To any future maintainer, window.getComputedStyle was used here
		// instead of getComputedStyle because it gave a better gzip size.
		// The difference between window.getComputedStyle and getComputedStyle is
		// 7 bytes
		if ( window.getComputedStyle ) {
			support.pixelPosition = ( window.getComputedStyle( div, null ) || {} ).top !== "1%";
			support.boxSizingReliable = ( window.getComputedStyle( div, null ) || { width: "4px" } ).width === "4px";

			// Check if div with explicit width and no margin-right incorrectly
			// gets computed margin-right based on width of container. For more
			// info see bug #3333
			// Fails in WebKit before Feb 2011 nightlies
			// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
			marginDiv = document.createElement("div");
			marginDiv.style.cssText = div.style.cssText = divReset;
			marginDiv.style.marginRight = marginDiv.style.width = "0";
			div.style.width = "1px";
			div.appendChild( marginDiv );
			support.reliableMarginRight =
				!parseFloat( ( window.getComputedStyle( marginDiv, null ) || {} ).marginRight );
		}

		if ( typeof div.style.zoom !== "undefined" ) {
			// Check if natively block-level elements act like inline-block
			// elements when setting their display to 'inline' and giving
			// them layout
			// (IE < 8 does this)
			div.innerHTML = "";
			div.style.cssText = divReset + "width:1px;padding:1px;display:inline;zoom:1";
			support.inlineBlockNeedsLayout = ( div.offsetWidth === 3 );

			// Check if elements with layout shrink-wrap their children
			// (IE 6 does this)
			div.style.display = "block";
			div.style.overflow = "visible";
			div.innerHTML = "<div></div>";
			div.firstChild.style.width = "5px";
			support.shrinkWrapBlocks = ( div.offsetWidth !== 3 );

			container.style.zoom = 1;
		}

		// Null elements to avoid leaks in IE
		body.removeChild( container );
		container = div = tds = marginDiv = null;
	});

	// Null elements to avoid leaks in IE
	fragment.removeChild( div );
	all = a = select = opt = input = fragment = div = null;

	return support;
})();
var rbrace = /^(?:\{.*\}|\[.*\])$/,
	rmultiDash = /([A-Z])/g;

jQuery.extend({
	cache: {},

	deletedIds: [],

	// Please use with caution
	uuid: 0,

	// Unique for each copy of jQuery on the page
	// Non-digits removed to match rinlinejQuery
	expando: "jQuery" + ( jQuery.fn.jquery + Math.random() ).replace( /\D/g, "" ),

	// The following elements throw uncatchable exceptions if you
	// attempt to add expando properties to them.
	noData: {
		"embed": true,
		// Ban all objects except for Flash (which handle expandos)
		"object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
		"applet": true
	},

	hasData: function( elem ) {
		elem = elem.nodeType ? jQuery.cache[ elem[jQuery.expando] ] : elem[ jQuery.expando ];
		return !!elem && !isEmptyDataObject( elem );
	},

	data: function( elem, name, data, pvt /* Internal Use Only */ ) {
		if ( !jQuery.acceptData( elem ) ) {
			return;
		}

		var thisCache, ret,
			internalKey = jQuery.expando,
			getByName = typeof name === "string",

			// We have to handle DOM nodes and JS objects differently because IE6-7
			// can't GC object references properly across the DOM-JS boundary
			isNode = elem.nodeType,

			// Only DOM nodes need the global jQuery cache; JS object data is
			// attached directly to the object so GC can occur automatically
			cache = isNode ? jQuery.cache : elem,

			// Only defining an ID for JS objects if its cache already exists allows
			// the code to shortcut on the same path as a DOM node with no cache
			id = isNode ? elem[ internalKey ] : elem[ internalKey ] && internalKey;

		// Avoid doing any more work than we need to when trying to get data on an
		// object that has no data at all
		if ( (!id || !cache[id] || (!pvt && !cache[id].data)) && getByName && data === undefined ) {
			return;
		}

		if ( !id ) {
			// Only DOM nodes need a new unique ID for each element since their data
			// ends up in the global cache
			if ( isNode ) {
				elem[ internalKey ] = id = jQuery.deletedIds.pop() || ++jQuery.uuid;
			} else {
				id = internalKey;
			}
		}

		if ( !cache[ id ] ) {
			cache[ id ] = {};

			// Avoids exposing jQuery metadata on plain JS objects when the object
			// is serialized using JSON.stringify
			if ( !isNode ) {
				cache[ id ].toJSON = jQuery.noop;
			}
		}

		// An object can be passed to jQuery.data instead of a key/value pair; this gets
		// shallow copied over onto the existing cache
		if ( typeof name === "object" || typeof name === "function" ) {
			if ( pvt ) {
				cache[ id ] = jQuery.extend( cache[ id ], name );
			} else {
				cache[ id ].data = jQuery.extend( cache[ id ].data, name );
			}
		}

		thisCache = cache[ id ];

		// jQuery data() is stored in a separate object inside the object's internal data
		// cache in order to avoid key collisions between internal data and user-defined
		// data.
		if ( !pvt ) {
			if ( !thisCache.data ) {
				thisCache.data = {};
			}

			thisCache = thisCache.data;
		}

		if ( data !== undefined ) {
			thisCache[ jQuery.camelCase( name ) ] = data;
		}

		// Check for both converted-to-camel and non-converted data property names
		// If a data property was specified
		if ( getByName ) {

			// First Try to find as-is property data
			ret = thisCache[ name ];

			// Test for null|undefined property data
			if ( ret == null ) {

				// Try to find the camelCased property
				ret = thisCache[ jQuery.camelCase( name ) ];
			}
		} else {
			ret = thisCache;
		}

		return ret;
	},

	removeData: function( elem, name, pvt /* Internal Use Only */ ) {
		if ( !jQuery.acceptData( elem ) ) {
			return;
		}

		var thisCache, i, l,

			isNode = elem.nodeType,

			// See jQuery.data for more information
			cache = isNode ? jQuery.cache : elem,
			id = isNode ? elem[ jQuery.expando ] : jQuery.expando;

		// If there is already no cache entry for this object, there is no
		// purpose in continuing
		if ( !cache[ id ] ) {
			return;
		}

		if ( name ) {

			thisCache = pvt ? cache[ id ] : cache[ id ].data;

			if ( thisCache ) {

				// Support array or space separated string names for data keys
				if ( !jQuery.isArray( name ) ) {

					// try the string as a key before any manipulation
					if ( name in thisCache ) {
						name = [ name ];
					} else {

						// split the camel cased version by spaces unless a key with the spaces exists
						name = jQuery.camelCase( name );
						if ( name in thisCache ) {
							name = [ name ];
						} else {
							name = name.split(" ");
						}
					}
				}

				for ( i = 0, l = name.length; i < l; i++ ) {
					delete thisCache[ name[i] ];
				}

				// If there is no data left in the cache, we want to continue
				// and let the cache object itself get destroyed
				if ( !( pvt ? isEmptyDataObject : jQuery.isEmptyObject )( thisCache ) ) {
					return;
				}
			}
		}

		// See jQuery.data for more information
		if ( !pvt ) {
			delete cache[ id ].data;

			// Don't destroy the parent cache unless the internal data object
			// had been the only thing left in it
			if ( !isEmptyDataObject( cache[ id ] ) ) {
				return;
			}
		}

		// Destroy the cache
		if ( isNode ) {
			jQuery.cleanData( [ elem ], true );

		// Use delete when supported for expandos or `cache` is not a window per isWindow (#10080)
		} else if ( jQuery.support.deleteExpando || cache != cache.window ) {
			delete cache[ id ];

		// When all else fails, null
		} else {
			cache[ id ] = null;
		}
	},

	// For internal use only.
	_data: function( elem, name, data ) {
		return jQuery.data( elem, name, data, true );
	},

	// A method for determining if a DOM node can handle the data expando
	acceptData: function( elem ) {
		var noData = elem.nodeName && jQuery.noData[ elem.nodeName.toLowerCase() ];

		// nodes accept data unless otherwise specified; rejection can be conditional
		return !noData || noData !== true && elem.getAttribute("classid") === noData;
	}
});

jQuery.fn.extend({
	data: function( key, value ) {
		var parts, part, attr, name, l,
			elem = this[0],
			i = 0,
			data = null;

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = jQuery.data( elem );

				if ( elem.nodeType === 1 && !jQuery._data( elem, "parsedAttrs" ) ) {
					attr = elem.attributes;
					for ( l = attr.length; i < l; i++ ) {
						name = attr[i].name;

						if ( name.indexOf( "data-" ) === 0 ) {
							name = jQuery.camelCase( name.substring(5) );

							dataAttr( elem, name, data[ name ] );
						}
					}
					jQuery._data( elem, "parsedAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each(function() {
				jQuery.data( this, key );
			});
		}

		parts = key.split( ".", 2 );
		parts[1] = parts[1] ? "." + parts[1] : "";
		part = parts[1] + "!";

		return jQuery.access( this, function( value ) {

			if ( value === undefined ) {
				data = this.triggerHandler( "getData" + part, [ parts[0] ] );

				// Try to fetch any internally stored data first
				if ( data === undefined && elem ) {
					data = jQuery.data( elem, key );
					data = dataAttr( elem, key, data );
				}

				return data === undefined && parts[1] ?
					this.data( parts[0] ) :
					data;
			}

			parts[1] = value;
			this.each(function() {
				var self = jQuery( this );

				self.triggerHandler( "setData" + part, parts );
				jQuery.data( this, key, value );
				self.triggerHandler( "changeData" + part, parts );
			});
		}, null, value, arguments.length > 1, null, false );
	},

	removeData: function( key ) {
		return this.each(function() {
			jQuery.removeData( this, key );
		});
	}
});

function dataAttr( elem, key, data ) {
	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {

		var name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();

		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
				data === "false" ? false :
				data === "null" ? null :
				// Only convert to a number if it doesn't change the string
				+data + "" === data ? +data :
				rbrace.test( data ) ? jQuery.parseJSON( data ) :
					data;
			} catch( e ) {}

			// Make sure we set the data so it isn't changed later
			jQuery.data( elem, key, data );

		} else {
			data = undefined;
		}
	}

	return data;
}

// checks a cache object for emptiness
function isEmptyDataObject( obj ) {
	var name;
	for ( name in obj ) {

		// if the public data object is empty, the private is still empty
		if ( name === "data" && jQuery.isEmptyObject( obj[name] ) ) {
			continue;
		}
		if ( name !== "toJSON" ) {
			return false;
		}
	}

	return true;
}
jQuery.extend({
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = jQuery._data( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || jQuery.isArray(data) ) {
					queue = jQuery._data( elem, type, jQuery.makeArray(data) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
		}

		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}
		if ( !queue.length && hooks ) {
			hooks.empty.fire();
		}
	},

	// not intended for public consumption - generates a queueHooks object, or returns the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return jQuery._data( elem, key ) || jQuery._data( elem, key, {
			empty: jQuery.Callbacks("once memory").add(function() {
				jQuery.removeData( elem, type + "queue", true );
				jQuery.removeData( elem, key, true );
			})
		});
	}
});

jQuery.fn.extend({
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[0], type );
		}

		return data === undefined ?
			this :
			this.each(function() {
				var queue = jQuery.queue( this, type, data );

				// ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[0] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			});
	},
	dequeue: function( type ) {
		return this.each(function() {
			jQuery.dequeue( this, type );
		});
	},
	// Based off of the plugin by Clint Helfers, with permission.
	// http://blindsignals.com/index.php/2009/07/jquery-delay/
	delay: function( time, type ) {
		time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
		type = type || "fx";

		return this.queue( type, function( next, hooks ) {
			var timeout = setTimeout( next, time );
			hooks.stop = function() {
				clearTimeout( timeout );
			};
		});
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},
	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while( i-- ) {
			if ( (tmp = jQuery._data( elements[ i ], type + "queueHooks" )) && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
});
var nodeHook, boolHook, fixSpecified,
	rclass = /[\t\r\n]/g,
	rreturn = /\r/g,
	rtype = /^(?:button|input)$/i,
	rfocusable = /^(?:button|input|object|select|textarea)$/i,
	rclickable = /^a(?:rea|)$/i,
	rboolean = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,
	getSetAttribute = jQuery.support.getSetAttribute;

jQuery.fn.extend({
	attr: function( name, value ) {
		return jQuery.access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each(function() {
			jQuery.removeAttr( this, name );
		});
	},

	prop: function( name, value ) {
		return jQuery.access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		name = jQuery.propFix[ name ] || name;
		return this.each(function() {
			// try/catch handles cases where IE balks (such as removing a property on window)
			try {
				this[ name ] = undefined;
				delete this[ name ];
			} catch( e ) {}
		});
	},

	addClass: function( value ) {
		var classNames, i, l, elem,
			setClass, c, cl;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).addClass( value.call(this, j, this.className) );
			});
		}

		if ( value && typeof value === "string" ) {
			classNames = value.split( core_rspace );

			for ( i = 0, l = this.length; i < l; i++ ) {
				elem = this[ i ];

				if ( elem.nodeType === 1 ) {
					if ( !elem.className && classNames.length === 1 ) {
						elem.className = value;

					} else {
						setClass = " " + elem.className + " ";

						for ( c = 0, cl = classNames.length; c < cl; c++ ) {
							if ( !~setClass.indexOf( " " + classNames[ c ] + " " ) ) {
								setClass += classNames[ c ] + " ";
							}
						}
						elem.className = jQuery.trim( setClass );
					}
				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var removes, className, elem, c, cl, i, l;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).removeClass( value.call(this, j, this.className) );
			});
		}
		if ( (value && typeof value === "string") || value === undefined ) {
			removes = ( value || "" ).split( core_rspace );

			for ( i = 0, l = this.length; i < l; i++ ) {
				elem = this[ i ];
				if ( elem.nodeType === 1 && elem.className ) {

					className = (" " + elem.className + " ").replace( rclass, " " );

					// loop over each item in the removal list
					for ( c = 0, cl = removes.length; c < cl; c++ ) {
						// Remove until there is nothing to remove,
						while ( className.indexOf(" " + removes[ c ] + " ") > -1 ) {
							className = className.replace( " " + removes[ c ] + " " , " " );
						}
					}
					elem.className = value ? jQuery.trim( className ) : "";
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value,
			isBool = typeof stateVal === "boolean";

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( i ) {
				jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
			});
		}

		return this.each(function() {
			if ( type === "string" ) {
				// toggle individual class names
				var className,
					i = 0,
					self = jQuery( this ),
					state = stateVal,
					classNames = value.split( core_rspace );

				while ( (className = classNames[ i++ ]) ) {
					// check each className given, space separated list
					state = isBool ? state : !self.hasClass( className );
					self[ state ? "addClass" : "removeClass" ]( className );
				}

			} else if ( type === "undefined" || type === "boolean" ) {
				if ( this.className ) {
					// store className if set
					jQuery._data( this, "__className__", this.className );
				}

				// toggle whole className
				this.className = this.className || value === false ? "" : jQuery._data( this, "__className__" ) || "";
			}
		});
	},

	hasClass: function( selector ) {
		var className = " " + selector + " ",
			i = 0,
			l = this.length;
		for ( ; i < l; i++ ) {
			if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) > -1 ) {
				return true;
			}
		}

		return false;
	},

	val: function( value ) {
		var hooks, ret, isFunction,
			elem = this[0];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] || jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
					return ret;
				}

				ret = elem.value;

				return typeof ret === "string" ?
					// handle most common string cases
					ret.replace(rreturn, "") :
					// handle cases where value is null/undef or number
					ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each(function( i ) {
			var val,
				self = jQuery(this);

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, self.val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";
			} else if ( typeof val === "number" ) {
				val += "";
			} else if ( jQuery.isArray( val ) ) {
				val = jQuery.map(val, function ( value ) {
					return value == null ? "" : value + "";
				});
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		});
	}
});

jQuery.extend({
	valHooks: {
		option: {
			get: function( elem ) {
				// attributes.value is undefined in Blackberry 4.7 but
				// uses .value. See #6932
				var val = elem.attributes.value;
				return !val || val.specified ? elem.value : elem.text;
			}
		},
		select: {
			get: function( elem ) {
				var value, i, max, option,
					index = elem.selectedIndex,
					values = [],
					options = elem.options,
					one = elem.type === "select-one";

				// Nothing was selected
				if ( index < 0 ) {
					return null;
				}

				// Loop through all the selected options
				i = one ? index : 0;
				max = one ? index + 1 : options.length;
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// Don't return options that are disabled or in a disabled optgroup
					if ( option.selected && (jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null) &&
							(!option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" )) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				// Fixes Bug #2551 -- select.val() broken in IE after form.reset()
				if ( one && !values.length && options.length ) {
					return jQuery( options[ index ] ).val();
				}

				return values;
			},

			set: function( elem, value ) {
				var values = jQuery.makeArray( value );

				jQuery(elem).find("option").each(function() {
					this.selected = jQuery.inArray( jQuery(this).val(), values ) >= 0;
				});

				if ( !values.length ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	},

	// Unused in 1.8, left in so attrFn-stabbers won't die; remove in 1.9
	attrFn: {},

	attr: function( elem, name, value, pass ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// don't get/set attributes on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		if ( pass && jQuery.isFunction( jQuery.fn[ name ] ) ) {
			return jQuery( elem )[ name ]( value );
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === "undefined" ) {
			return jQuery.prop( elem, name, value );
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		// All attributes are lowercase
		// Grab necessary hook if one is defined
		if ( notxml ) {
			name = name.toLowerCase();
			hooks = jQuery.attrHooks[ name ] || ( rboolean.test( name ) ? boolHook : nodeHook );
		}

		if ( value !== undefined ) {

			if ( value === null ) {
				jQuery.removeAttr( elem, name );
				return;

			} else if ( hooks && "set" in hooks && notxml && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				elem.setAttribute( name, "" + value );
				return value;
			}

		} else if ( hooks && "get" in hooks && notxml && (ret = hooks.get( elem, name )) !== null ) {
			return ret;

		} else {

			ret = elem.getAttribute( name );

			// Non-existent attributes return null, we normalize to undefined
			return ret === null ?
				undefined :
				ret;
		}
	},

	removeAttr: function( elem, value ) {
		var propName, attrNames, name, isBool,
			i = 0;

		if ( value && elem.nodeType === 1 ) {

			attrNames = value.split( core_rspace );

			for ( ; i < attrNames.length; i++ ) {
				name = attrNames[ i ];

				if ( name ) {
					propName = jQuery.propFix[ name ] || name;
					isBool = rboolean.test( name );

					// See #9699 for explanation of this approach (setting first, then removal)
					// Do not do this for boolean attributes (see #10870)
					if ( !isBool ) {
						jQuery.attr( elem, name, "" );
					}
					elem.removeAttribute( getSetAttribute ? name : propName );

					// Set corresponding property to false for boolean attributes
					if ( isBool && propName in elem ) {
						elem[ propName ] = false;
					}
				}
			}
		}
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				// We can't allow the type property to be changed (since it causes problems in IE)
				if ( rtype.test( elem.nodeName ) && elem.parentNode ) {
					jQuery.error( "type property can't be changed" );
				} else if ( !jQuery.support.radioValue && value === "radio" && jQuery.nodeName(elem, "input") ) {
					// Setting the type on a radio button after the value resets the value in IE6-9
					// Reset value to it's default in case type is set after value
					// This is for element creation
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		},
		// Use the value property for back compat
		// Use the nodeHook for button elements in IE6/7 (#1954)
		value: {
			get: function( elem, name ) {
				if ( nodeHook && jQuery.nodeName( elem, "button" ) ) {
					return nodeHook.get( elem, name );
				}
				return name in elem ?
					elem.value :
					null;
			},
			set: function( elem, value, name ) {
				if ( nodeHook && jQuery.nodeName( elem, "button" ) ) {
					return nodeHook.set( elem, value, name );
				}
				// Does not return so that setAttribute is also used
				elem.value = value;
			}
		}
	},

	propFix: {
		tabindex: "tabIndex",
		readonly: "readOnly",
		"for": "htmlFor",
		"class": "className",
		maxlength: "maxLength",
		cellspacing: "cellSpacing",
		cellpadding: "cellPadding",
		rowspan: "rowSpan",
		colspan: "colSpan",
		usemap: "useMap",
		frameborder: "frameBorder",
		contenteditable: "contentEditable"
	},

	prop: function( elem, name, value ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// don't get/set properties on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		if ( notxml ) {
			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				return ( elem[ name ] = value );
			}

		} else {
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
				return ret;

			} else {
				return elem[ name ];
			}
		}
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {
				// elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
				// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				var attributeNode = elem.getAttributeNode("tabindex");

				return attributeNode && attributeNode.specified ?
					parseInt( attributeNode.value, 10 ) :
					rfocusable.test( elem.nodeName ) || rclickable.test( elem.nodeName ) && elem.href ?
						0 :
						undefined;
			}
		}
	}
});

// Hook for boolean attributes
boolHook = {
	get: function( elem, name ) {
		// Align boolean attributes with corresponding properties
		// Fall back to attribute presence where some booleans are not supported
		var attrNode,
			property = jQuery.prop( elem, name );
		return property === true || typeof property !== "boolean" && ( attrNode = elem.getAttributeNode(name) ) && attrNode.nodeValue !== false ?
			name.toLowerCase() :
			undefined;
	},
	set: function( elem, value, name ) {
		var propName;
		if ( value === false ) {
			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else {
			// value is true since we know at this point it's type boolean and not false
			// Set boolean attributes to the same name and set the DOM property
			propName = jQuery.propFix[ name ] || name;
			if ( propName in elem ) {
				// Only set the IDL specifically if it already exists on the element
				elem[ propName ] = true;
			}

			elem.setAttribute( name, name.toLowerCase() );
		}
		return name;
	}
};

// IE6/7 do not support getting/setting some attributes with get/setAttribute
if ( !getSetAttribute ) {

	fixSpecified = {
		name: true,
		id: true,
		coords: true
	};

	// Use this for any attribute in IE6/7
	// This fixes almost every IE6/7 issue
	nodeHook = jQuery.valHooks.button = {
		get: function( elem, name ) {
			var ret;
			ret = elem.getAttributeNode( name );
			return ret && ( fixSpecified[ name ] ? ret.value !== "" : ret.specified ) ?
				ret.value :
				undefined;
		},
		set: function( elem, value, name ) {
			// Set the existing or create a new attribute node
			var ret = elem.getAttributeNode( name );
			if ( !ret ) {
				ret = document.createAttribute( name );
				elem.setAttributeNode( ret );
			}
			return ( ret.value = value + "" );
		}
	};

	// Set width and height to auto instead of 0 on empty string( Bug #8150 )
	// This is for removals
	jQuery.each([ "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
			set: function( elem, value ) {
				if ( value === "" ) {
					elem.setAttribute( name, "auto" );
					return value;
				}
			}
		});
	});

	// Set contenteditable to false on removals(#10429)
	// Setting to empty string throws an error as an invalid value
	jQuery.attrHooks.contenteditable = {
		get: nodeHook.get,
		set: function( elem, value, name ) {
			if ( value === "" ) {
				value = "false";
			}
			nodeHook.set( elem, value, name );
		}
	};
}


// Some attributes require a special call on IE
if ( !jQuery.support.hrefNormalized ) {
	jQuery.each([ "href", "src", "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
			get: function( elem ) {
				var ret = elem.getAttribute( name, 2 );
				return ret === null ? undefined : ret;
			}
		});
	});
}

if ( !jQuery.support.style ) {
	jQuery.attrHooks.style = {
		get: function( elem ) {
			// Return undefined in the case of empty string
			// Normalize to lowercase since IE uppercases css property names
			return elem.style.cssText.toLowerCase() || undefined;
		},
		set: function( elem, value ) {
			return ( elem.style.cssText = "" + value );
		}
	};
}

// Safari mis-reports the default selected property of an option
// Accessing the parent's selectedIndex property fixes it
if ( !jQuery.support.optSelected ) {
	jQuery.propHooks.selected = jQuery.extend( jQuery.propHooks.selected, {
		get: function( elem ) {
			var parent = elem.parentNode;

			if ( parent ) {
				parent.selectedIndex;

				// Make sure that it also works with optgroups, see #5701
				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
			return null;
		}
	});
}

// IE6/7 call enctype encoding
if ( !jQuery.support.enctype ) {
	jQuery.propFix.enctype = "encoding";
}

// Radios and checkboxes getter/setter
if ( !jQuery.support.checkOn ) {
	jQuery.each([ "radio", "checkbox" ], function() {
		jQuery.valHooks[ this ] = {
			get: function( elem ) {
				// Handle the case where in Webkit "" is returned instead of "on" if a value isn't specified
				return elem.getAttribute("value") === null ? "on" : elem.value;
			}
		};
	});
}
jQuery.each([ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = jQuery.extend( jQuery.valHooks[ this ], {
		set: function( elem, value ) {
			if ( jQuery.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0 );
			}
		}
	});
});
var rformElems = /^(?:textarea|input|select)$/i,
	rtypenamespace = /^([^\.]*|)(?:\.(.+)|)$/,
	rhoverHack = /(?:^|\s)hover(\.\S+|)\b/,
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|contextmenu)|click/,
	rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	hoverHack = function( events ) {
		return jQuery.event.special.hover ? events : events.replace( rhoverHack, "mouseenter$1 mouseleave$1" );
	};

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	add: function( elem, types, handler, data, selector ) {

		var elemData, eventHandle, events,
			t, tns, type, namespaces, handleObj,
			handleObjIn, handlers, special;

		// Don't attach events to noData or text/comment nodes (allow plain objects tho)
		if ( elem.nodeType === 3 || elem.nodeType === 8 || !types || !handler || !(elemData = jQuery._data( elem )) ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		events = elemData.events;
		if ( !events ) {
			elemData.events = events = {};
		}
		eventHandle = elemData.handle;
		if ( !eventHandle ) {
			elemData.handle = eventHandle = function( e ) {
				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== "undefined" && (!e || jQuery.event.triggered !== e.type) ?
					jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
					undefined;
			};
			// Add elem as a property of the handle fn to prevent a memory leak with IE non-native events
			eventHandle.elem = elem;
		}

		// Handle multiple events separated by a space
		// jQuery(...).bind("mouseover mouseout", fn);
		types = jQuery.trim( hoverHack(types) ).split( " " );
		for ( t = 0; t < types.length; t++ ) {

			tns = rtypenamespace.exec( types[t] ) || [];
			type = tns[1];
			namespaces = ( tns[2] || "" ).split( "." ).sort();

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend({
				type: type,
				origType: tns[1],
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				namespace: namespaces.join(".")
			}, handleObjIn );

			// Init the event handler queue if we're the first
			handlers = events[ type ];
			if ( !handlers ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener/attachEvent if the special events handler returns false
				if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
					// Bind the global event handler to the element
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );

					} else if ( elem.attachEvent ) {
						elem.attachEvent( "on" + type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

		// Nullify elem to prevent memory leaks in IE
		elem = null;
	},

	global: {},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {

		var t, tns, type, origType, namespaces, origCount,
			j, events, special, eventType, handleObj,
			elemData = jQuery.hasData( elem ) && jQuery._data( elem );

		if ( !elemData || !(events = elemData.events) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = jQuery.trim( hoverHack( types || "" ) ).split(" ");
		for ( t = 0; t < types.length; t++ ) {
			tns = rtypenamespace.exec( types[t] ) || [];
			type = origType = tns[1];
			namespaces = tns[2];

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector? special.delegateType : special.bindType ) || type;
			eventType = events[ type ] || [];
			origCount = eventType.length;
			namespaces = namespaces ? new RegExp("(^|\\.)" + namespaces.split(".").sort().join("\\.(?:.*\\.|)") + "(\\.|$)") : null;

			// Remove matching events
			for ( j = 0; j < eventType.length; j++ ) {
				handleObj = eventType[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					 ( !handler || handler.guid === handleObj.guid ) &&
					 ( !namespaces || namespaces.test( handleObj.namespace ) ) &&
					 ( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) ) {
					eventType.splice( j--, 1 );

					if ( handleObj.selector ) {
						eventType.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( eventType.length === 0 && origCount !== eventType.length ) {
				if ( !special.teardown || special.teardown.call( elem, namespaces, elemData.handle ) === false ) {
					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			delete elemData.handle;

			// removeData also checks for emptiness and clears the expando if empty
			// so use it instead of delete
			jQuery.removeData( elem, "events", true );
		}
	},

	// Events that are safe to short-circuit if no handlers are attached.
	// Native DOM events should not be added, they may have inline handlers.
	customEvent: {
		"getData": true,
		"setData": true,
		"changeData": true
	},

	trigger: function( event, data, elem, onlyHandlers ) {
		// Don't do events on text and comment nodes
		if ( elem && (elem.nodeType === 3 || elem.nodeType === 8) ) {
			return;
		}

		// Event object or event type
		var cache, exclusive, i, cur, old, ontype, special, handle, eventPath, bubbleType,
			type = event.type || event,
			namespaces = [];

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf( "!" ) >= 0 ) {
			// Exclusive events trigger only for the exact event (no namespaces)
			type = type.slice(0, -1);
			exclusive = true;
		}

		if ( type.indexOf( "." ) >= 0 ) {
			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split(".");
			type = namespaces.shift();
			namespaces.sort();
		}

		if ( (!elem || jQuery.event.customEvent[ type ]) && !jQuery.event.global[ type ] ) {
			// No jQuery handlers for this event type, and it can't have inline handlers
			return;
		}

		// Caller can pass in an Event, Object, or just an event type string
		event = typeof event === "object" ?
			// jQuery.Event object
			event[ jQuery.expando ] ? event :
			// Object literal
			new jQuery.Event( type, event ) :
			// Just the event type (string)
			new jQuery.Event( type );

		event.type = type;
		event.isTrigger = true;
		event.exclusive = exclusive;
		event.namespace = namespaces.join( "." );
		event.namespace_re = event.namespace? new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)") : null;
		ontype = type.indexOf( ":" ) < 0 ? "on" + type : "";

		// Handle a global trigger
		if ( !elem ) {

			// TODO: Stop taunting the data cache; remove global events and always attach to document
			cache = jQuery.cache;
			for ( i in cache ) {
				if ( cache[ i ].events && cache[ i ].events[ type ] ) {
					jQuery.event.trigger( event, data, cache[ i ].handle.elem, true );
				}
			}
			return;
		}

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data != null ? jQuery.makeArray( data ) : [];
		data.unshift( event );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		eventPath = [[ elem, special.bindType || type ]];
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			cur = rfocusMorph.test( bubbleType + type ) ? elem : elem.parentNode;
			for ( old = elem; cur; cur = cur.parentNode ) {
				eventPath.push([ cur, bubbleType ]);
				old = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( old === (elem.ownerDocument || document) ) {
				eventPath.push([ old.defaultView || old.parentWindow || window, bubbleType ]);
			}
		}

		// Fire handlers on the event path
		for ( i = 0; i < eventPath.length && !event.isPropagationStopped(); i++ ) {

			cur = eventPath[i][0];
			event.type = eventPath[i][1];

			handle = ( jQuery._data( cur, "events" ) || {} )[ event.type ] && jQuery._data( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}
			// Note that this is a bare JS function and not a jQuery handler
			handle = ontype && cur[ ontype ];
			if ( handle && jQuery.acceptData( cur ) && handle.apply( cur, data ) === false ) {
				event.preventDefault();
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( (!special._default || special._default.apply( elem.ownerDocument, data ) === false) &&
				!(type === "click" && jQuery.nodeName( elem, "a" )) && jQuery.acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name name as the event.
				// Can't use an .isFunction() check here because IE6/7 fails that test.
				// Don't do default actions on window, that's where global variables be (#6170)
				// IE<9 dies on focus/blur to hidden element (#1486)
				if ( ontype && elem[ type ] && ((type !== "focus" && type !== "blur") || event.target.offsetWidth !== 0) && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					old = elem[ ontype ];

					if ( old ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					elem[ type ]();
					jQuery.event.triggered = undefined;

					if ( old ) {
						elem[ ontype ] = old;
					}
				}
			}
		}

		return event.result;
	},

	dispatch: function( event ) {

		// Make a writable jQuery.Event from the native event object
		event = jQuery.event.fix( event || window.event );

		var i, j, cur, jqcur, ret, selMatch, matched, matches, handleObj, sel, related,
			handlers = ( (jQuery._data( this, "events" ) || {} )[ event.type ] || []),
			delegateCount = handlers.delegateCount,
			args = [].slice.call( arguments ),
			run_all = !event.exclusive && !event.namespace,
			special = jQuery.event.special[ event.type ] || {},
			handlerQueue = [];

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[0] = event;
		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers that should run if there are delegated events
		// Avoid non-left-click bubbling in Firefox (#3861)
		if ( delegateCount && !(event.button && event.type === "click") ) {

			// Pregenerate a single jQuery object for reuse with .is()
			jqcur = jQuery(this);
			jqcur.context = this;

			for ( cur = event.target; cur != this; cur = cur.parentNode || this ) {

				// Don't process clicks (ONLY) on disabled elements (#6911, #8165, #xxxx)
				if ( cur.disabled !== true || event.type !== "click" ) {
					selMatch = {};
					matches = [];
					jqcur[0] = cur;
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];
						sel = handleObj.selector;

						if ( selMatch[ sel ] === undefined ) {
							selMatch[ sel ] = jqcur.is( sel );
						}
						if ( selMatch[ sel ] ) {
							matches.push( handleObj );
						}
					}
					if ( matches.length ) {
						handlerQueue.push({ elem: cur, matches: matches });
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		if ( handlers.length > delegateCount ) {
			handlerQueue.push({ elem: this, matches: handlers.slice( delegateCount ) });
		}

		// Run delegates first; they may want to stop propagation beneath us
		for ( i = 0; i < handlerQueue.length && !event.isPropagationStopped(); i++ ) {
			matched = handlerQueue[ i ];
			event.currentTarget = matched.elem;

			for ( j = 0; j < matched.matches.length && !event.isImmediatePropagationStopped(); j++ ) {
				handleObj = matched.matches[ j ];

				// Triggered event must either 1) be non-exclusive and have no namespace, or
				// 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
				if ( run_all || (!event.namespace && !handleObj.namespace) || event.namespace_re && event.namespace_re.test( handleObj.namespace ) ) {

					event.data = handleObj.data;
					event.handleObj = handleObj;

					ret = ( (jQuery.event.special[ handleObj.origType ] || {}).handle || handleObj.handler )
							.apply( matched.elem, args );

					if ( ret !== undefined ) {
						event.result = ret;
						if ( ret === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	// Includes some event props shared by KeyEvent and MouseEvent
	// *** attrChange attrName relatedNode srcElement  are not normalized, non-W3C, deprecated, will be removed in 1.8 ***
	props: "attrChange attrName relatedNode srcElement altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

	fixHooks: {},

	keyHooks: {
		props: "char charCode key keyCode".split(" "),
		filter: function( event, original ) {

			// Add which for key events
			if ( event.which == null ) {
				event.which = original.charCode != null ? original.charCode : original.keyCode;
			}

			return event;
		}
	},

	mouseHooks: {
		props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
		filter: function( event, original ) {
			var eventDoc, doc, body,
				button = original.button,
				fromElement = original.fromElement;

			// Calculate pageX/Y if missing and clientX/Y available
			if ( event.pageX == null && original.clientX != null ) {
				eventDoc = event.target.ownerDocument || document;
				doc = eventDoc.documentElement;
				body = eventDoc.body;

				event.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
				event.pageY = original.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
			}

			// Add relatedTarget, if necessary
			if ( !event.relatedTarget && fromElement ) {
				event.relatedTarget = fromElement === event.target ? original.toElement : fromElement;
			}

			// Add which for click: 1 === left; 2 === middle; 3 === right
			// Note: button is not normalized, so don't use it
			if ( !event.which && button !== undefined ) {
				event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
			}

			return event;
		}
	},

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// Create a writable copy of the event object and normalize some properties
		var i, prop,
			originalEvent = event,
			fixHook = jQuery.event.fixHooks[ event.type ] || {},
			copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

		event = jQuery.Event( originalEvent );

		for ( i = copy.length; i; ) {
			prop = copy[ --i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Fix target property, if necessary (#1925, IE 6/7/8 & Safari2)
		if ( !event.target ) {
			event.target = originalEvent.srcElement || document;
		}

		// Target should not be a text node (#504, Safari)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		// For mouse/key events, metaKey==false if it's undefined (#3368, #11328; IE6/7/8)
		event.metaKey = !!event.metaKey;

		return fixHook.filter? fixHook.filter( event, originalEvent ) : event;
	},

	special: {
		ready: {
			// Make sure the ready event is setup
			setup: jQuery.bindReady
		},

		load: {
			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},

		focus: {
			delegateType: "focusin"
		},
		blur: {
			delegateType: "focusout"
		},

		beforeunload: {
			setup: function( data, namespaces, eventHandle ) {
				// We only want to do this special case on windows
				if ( jQuery.isWindow( this ) ) {
					this.onbeforeunload = eventHandle;
				}
			},

			teardown: function( namespaces, eventHandle ) {
				if ( this.onbeforeunload === eventHandle ) {
					this.onbeforeunload = null;
				}
			}
		}
	},

	simulate: function( type, elem, event, bubble ) {
		// Piggyback on a donor event to simulate a different one.
		// Fake originalEvent to avoid donor's stopPropagation, but if the
		// simulated event prevents default then we do the same on the donor.
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{ type: type,
				isSimulated: true,
				originalEvent: {}
			}
		);
		if ( bubble ) {
			jQuery.event.trigger( e, null, elem );
		} else {
			jQuery.event.dispatch.call( elem, e );
		}
		if ( e.isDefaultPrevented() ) {
			event.preventDefault();
		}
	}
};

// Some plugins are using, but it's undocumented/deprecated and will be removed.
// The 1.7 special event interface should provide all the hooks needed now.
jQuery.event.handle = jQuery.event.dispatch;

jQuery.removeEvent = document.removeEventListener ?
	function( elem, type, handle ) {
		if ( elem.removeEventListener ) {
			elem.removeEventListener( type, handle, false );
		}
	} :
	function( elem, type, handle ) {
		var name = "on" + type;

		if ( elem.detachEvent ) {

			// #8545, #7054, preventing memory leaks for custom events in IE6-8 â€“
			// detachEvent needed property on element, by name of that event, to properly expose it to GC
			if ( typeof elem[ name ] === "undefined" ) {
				elem[ name ] = null;
			}

			elem.detachEvent( name, handle );
		}
	};

jQuery.Event = function( src, props ) {
	// Allow instantiation without the 'new' keyword
	if ( !(this instanceof jQuery.Event) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = ( src.defaultPrevented || src.returnValue === false ||
			src.getPreventDefault && src.getPreventDefault() ) ? returnTrue : returnFalse;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

function returnFalse() {
	return false;
}
function returnTrue() {
	return true;
}

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	preventDefault: function() {
		this.isDefaultPrevented = returnTrue;

		var e = this.originalEvent;
		if ( !e ) {
			return;
		}

		// if preventDefault exists run it on the original event
		if ( e.preventDefault ) {
			e.preventDefault();

		// otherwise set the returnValue property of the original event to false (IE)
		} else {
			e.returnValue = false;
		}
	},
	stopPropagation: function() {
		this.isPropagationStopped = returnTrue;

		var e = this.originalEvent;
		if ( !e ) {
			return;
		}
		// if stopPropagation exists run it on the original event
		if ( e.stopPropagation ) {
			e.stopPropagation();
		}
		// otherwise set the cancelBubble property of the original event to true (IE)
		e.cancelBubble = true;
	},
	stopImmediatePropagation: function() {
		this.isImmediatePropagationStopped = returnTrue;
		this.stopPropagation();
	},
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse
};

// Create mouseenter/leave events using mouseover/out and event-time checks
jQuery.each({
	mouseenter: "mouseover",
	mouseleave: "mouseout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj,
				selector = handleObj.selector;

			// For mousenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || (related !== target && !jQuery.contains( target, related )) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
});

// IE submit delegation
if ( !jQuery.support.submitBubbles ) {

	jQuery.event.special.submit = {
		setup: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Lazy-add a submit handler when a descendant form may potentially be submitted
			jQuery.event.add( this, "click._submit keypress._submit", function( e ) {
				// Node name check avoids a VML-related crash in IE (#9807)
				var elem = e.target,
					form = jQuery.nodeName( elem, "input" ) || jQuery.nodeName( elem, "button" ) ? elem.form : undefined;
				if ( form && !jQuery._data( form, "_submit_attached" ) ) {
					jQuery.event.add( form, "submit._submit", function( event ) {
						event._submit_bubble = true;
					});
					jQuery._data( form, "_submit_attached", true );
				}
			});
			// return undefined since we don't need an event listener
		},

		postDispatch: function( event ) {
			// If form was submitted by the user, bubble the event up the tree
			if ( event._submit_bubble ) {
				delete event._submit_bubble;
				if ( this.parentNode && !event.isTrigger ) {
					jQuery.event.simulate( "submit", this.parentNode, event, true );
				}
			}
		},

		teardown: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Remove delegated handlers; cleanData eventually reaps submit handlers attached above
			jQuery.event.remove( this, "._submit" );
		}
	};
}

// IE change delegation and checkbox/radio fix
if ( !jQuery.support.changeBubbles ) {

	jQuery.event.special.change = {

		setup: function() {

			if ( rformElems.test( this.nodeName ) ) {
				// IE doesn't fire change on a check/radio until blur; trigger it on click
				// after a propertychange. Eat the blur-change in special.change.handle.
				// This still fires onchange a second time for check/radio after blur.
				if ( this.type === "checkbox" || this.type === "radio" ) {
					jQuery.event.add( this, "propertychange._change", function( event ) {
						if ( event.originalEvent.propertyName === "checked" ) {
							this._just_changed = true;
						}
					});
					jQuery.event.add( this, "click._change", function( event ) {
						if ( this._just_changed && !event.isTrigger ) {
							this._just_changed = false;
						}
						// Allow triggered, simulated change events (#11500)
						jQuery.event.simulate( "change", this, event, true );
					});
				}
				return false;
			}
			// Delegated event; lazy-add a change handler on descendant inputs
			jQuery.event.add( this, "beforeactivate._change", function( e ) {
				var elem = e.target;

				if ( rformElems.test( elem.nodeName ) && !jQuery._data( elem, "_change_attached" ) ) {
					jQuery.event.add( elem, "change._change", function( event ) {
						if ( this.parentNode && !event.isSimulated && !event.isTrigger ) {
							jQuery.event.simulate( "change", this.parentNode, event, true );
						}
					});
					jQuery._data( elem, "_change_attached", true );
				}
			});
		},

		handle: function( event ) {
			var elem = event.target;

			// Swallow native change events from checkbox/radio, we already triggered them above
			if ( this !== elem || event.isSimulated || event.isTrigger || (elem.type !== "radio" && elem.type !== "checkbox") ) {
				return event.handleObj.handler.apply( this, arguments );
			}
		},

		teardown: function() {
			jQuery.event.remove( this, "._change" );

			return rformElems.test( this.nodeName );
		}
	};
}

// Create "bubbling" focus and blur events
if ( !jQuery.support.focusinBubbles ) {
	jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler while someone wants focusin/focusout
		var attaches = 0,
			handler = function( event ) {
				jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
			};

		jQuery.event.special[ fix ] = {
			setup: function() {
				if ( attaches++ === 0 ) {
					document.addEventListener( orig, handler, true );
				}
			},
			teardown: function() {
				if ( --attaches === 0 ) {
					document.removeEventListener( orig, handler, true );
				}
			}
		};
	});
}

jQuery.fn.extend({

	on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
		var origFn, type;

		// Types can be a map of types/handlers
		if ( typeof types === "object" ) {
			// ( types-Object, selector, data )
			if ( typeof selector !== "string" ) { // && selector != null
				// ( types-Object, data )
				data = data || selector;
				selector = undefined;
			}
			for ( type in types ) {
				this.on( type, selector, data, types[ type ], one );
			}
			return this;
		}

		if ( data == null && fn == null ) {
			// ( types, fn )
			fn = selector;
			data = selector = undefined;
		} else if ( fn == null ) {
			if ( typeof selector === "string" ) {
				// ( types, selector, fn )
				fn = data;
				data = undefined;
			} else {
				// ( types, data, fn )
				fn = data;
				data = selector;
				selector = undefined;
			}
		}
		if ( fn === false ) {
			fn = returnFalse;
		} else if ( !fn ) {
			return this;
		}

		if ( one === 1 ) {
			origFn = fn;
			fn = function( event ) {
				// Can use an empty set, since event contains the info
				jQuery().off( event );
				return origFn.apply( this, arguments );
			};
			// Use same guid so caller can remove using origFn
			fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
		}
		return this.each( function() {
			jQuery.event.add( this, types, fn, data, selector );
		});
	},
	one: function( types, selector, data, fn ) {
		return this.on( types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {
			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {
			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {
			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each(function() {
			jQuery.event.remove( this, types, fn, selector );
		});
	},

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	live: function( types, data, fn ) {
		jQuery( this.context ).on( types, this.selector, data, fn );
		return this;
	},
	die: function( types, fn ) {
		jQuery( this.context ).off( types, this.selector || "**", fn );
		return this;
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {
		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length == 1? this.off( selector, "**" ) : this.off( types, selector || "**", fn );
	},

	trigger: function( type, data ) {
		return this.each(function() {
			jQuery.event.trigger( type, data, this );
		});
	},
	triggerHandler: function( type, data ) {
		if ( this[0] ) {
			return jQuery.event.trigger( type, data, this[0], true );
		}
	},

	toggle: function( fn ) {
		// Save reference to arguments for access in closure
		var args = arguments,
			guid = fn.guid || jQuery.guid++,
			i = 0,
			toggler = function( event ) {
				// Figure out which function to execute
				var lastToggle = ( jQuery._data( this, "lastToggle" + fn.guid ) || 0 ) % i;
				jQuery._data( this, "lastToggle" + fn.guid, lastToggle + 1 );

				// Make sure that clicks stop
				event.preventDefault();

				// and execute the function
				return args[ lastToggle ].apply( this, arguments ) || false;
			};

		// link all the functions, so any of them can unbind this click handler
		toggler.guid = guid;
		while ( i < args.length ) {
			args[ i++ ].guid = guid;
		}

		return this.click( toggler );
	},

	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	}
});

jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error contextmenu").split(" "), function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		if ( fn == null ) {
			fn = data;
			data = null;
		}

		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};

	if ( rkeyEvent.test( name ) ) {
		jQuery.event.fixHooks[ name ] = jQuery.event.keyHooks;
	}

	if ( rmouseEvent.test( name ) ) {
		jQuery.event.fixHooks[ name ] = jQuery.event.mouseHooks;
	}
});
/*!
 * Sizzle CSS Selector Engine
 *  Copyright 2012 jQuery Foundation and other contributors
 *  Released under the MIT license
 *  http://sizzlejs.com/
 */
(function( window, undefined ) {

var cachedruns,
	dirruns,
	sortOrder,
	siblingCheck,
	assertGetIdNotName,

	document = window.document,
	docElem = document.documentElement,

	strundefined = "undefined",
	hasDuplicate = false,
	baseHasDuplicate = true,
	done = 0,
	slice = [].slice,
	push = [].push,

	expando = ( "sizcache" + Math.random() ).replace( ".", "" ),

	// Regex

	// Whitespace characters http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",
	// http://www.w3.org/TR/css3-syntax/#characters
	characterEncoding = "(?:\\\\.|[-\\w]|[^\\x00-\\xa0])+",

	// Loosely modeled on CSS identifier characters
	// An unquoted value should be a CSS identifier (http://www.w3.org/TR/css3-selectors/#attribute-selectors)
	// Proper syntax: http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = characterEncoding.replace( "w", "w#" ),

	// Acceptable operators http://www.w3.org/TR/selectors/#attribute-selectors
	operators = "([*^$|!~]?=)",
	attributes = "\\[" + whitespace + "*(" + characterEncoding + ")" + whitespace +
		"*(?:" + operators + whitespace + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + identifier + ")|)|)" + whitespace + "*\\]",
	pseudos = ":(" + characterEncoding + ")(?:\\((?:(['\"])((?:\\\\.|[^\\\\])*?)\\2|((?:[^,]|\\\\,|(?:,(?=[^\\[]*\\]))|(?:,(?=[^\\(]*\\))))*))\\)|)",
	pos = ":(nth|eq|gt|lt|first|last|even|odd)(?:\\((\\d*)\\)|)(?=[^-]|$)",
	combinators = whitespace + "*([\\x20\\t\\r\\n\\f>+~])" + whitespace + "*",
	groups = "(?=[^\\x20\\t\\r\\n\\f])(?:\\\\.|" + attributes + "|" + pseudos.replace( 2, 7 ) + "|[^\\\\(),])+",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

	rcombinators = new RegExp( "^" + combinators ),

	// All simple (non-comma) selectors, excluding insignifant trailing whitespace
	rgroups = new RegExp( groups + "?(?=" + whitespace + "*,|$)", "g" ),

	// A selector, or everything after leading whitespace
	// Optionally followed in either case by a ")" for terminating sub-selectors
	rselector = new RegExp( "^(?:(?!,)(?:(?:^|,)" + whitespace + "*" + groups + ")*?|" + whitespace + "*(.*?))(\\)|$)" ),

	// All combinators and selector components (attribute test, tag, pseudo, etc.), the latter appearing together when consecutive
	rtokens = new RegExp( groups.slice( 19, -6 ) + "\\x20\\t\\r\\n\\f>+~])+|" + combinators, "g" ),

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w\-]+)|(\w+)|\.([\w\-]+))$/,

	rsibling = /[\x20\t\r\n\f]*[+~]/,
	rendsWithNot = /:not\($/,

	rheader = /h\d/i,
	rinputs = /input|select|textarea|button/i,

	rbackslash = /\\(?!\\)/g,

	matchExpr = {
		"ID": new RegExp( "^#(" + characterEncoding + ")" ),
		"CLASS": new RegExp( "^\\.(" + characterEncoding + ")" ),
		"NAME": new RegExp( "^\\[name=['\"]?(" + characterEncoding + ")['\"]?\\]" ),
		"TAG": new RegExp( "^(" + characterEncoding.replace( "[-", "[-\\*" ) + ")" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|nth|last|first)-child(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		"POS": new RegExp( pos, "ig" ),
		// For use in libraries implementing .is()
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|" + pos, "i" )
	},

	classCache = {},
	cachedClasses = [],
	compilerCache = {},
	cachedSelectors = [],

	// Mark a function for use in filtering
	markFunction = function( fn ) {
		fn.sizzleFilter = true;
		return fn;
	},

	// Returns a function to use in pseudos for input types
	createInputFunction = function( type ) {
		return function( elem ) {
			// Check the input's nodeName and type
			return elem.nodeName.toLowerCase() === "input" && elem.type === type;
		};
	},

	// Returns a function to use in pseudos for buttons
	createButtonFunction = function( type ) {
		return function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return (name === "input" || name === "button") && elem.type === type;
		};
	},

	// Used for testing something on an element
	assert = function( fn ) {
		var pass = false,
			div = document.createElement("div");
		try {
			pass = fn( div );
		} catch (e) {}
		// release memory in IE
		div = null;
		return pass;
	},

	// Check if attributes should be retrieved by attribute nodes
	assertAttributes = assert(function( div ) {
		div.innerHTML = "<select></select>";
		var type = typeof div.lastChild.getAttribute("multiple");
		// IE8 returns a string for some attributes even when not present
		return type !== "boolean" && type !== "string";
	}),

	// Check if getElementById returns elements by name
	// Check if getElementsByName privileges form controls or returns elements by ID
	assertUsableName = assert(function( div ) {
		// Inject content
		div.id = expando + 0;
		div.innerHTML = "<a name='" + expando + "'></a><div name='" + expando + "'></div>";
		docElem.insertBefore( div, docElem.firstChild );

		// Test
		var pass = document.getElementsByName &&
			// buggy browsers will return fewer than the correct 2
			document.getElementsByName( expando ).length ===
			// buggy browsers will return more than the correct 0
			2 + document.getElementsByName( expando + 0 ).length;
		assertGetIdNotName = !document.getElementById( expando );

		// Cleanup
		docElem.removeChild( div );

		return pass;
	}),

	// Check if the browser returns only elements
	// when doing getElementsByTagName("*")
	assertTagNameNoComments = assert(function( div ) {
		div.appendChild( document.createComment("") );
		return div.getElementsByTagName("*").length === 0;
	}),

	// Check if getAttribute returns normalized href attributes
	assertHrefNotNormalized = assert(function( div ) {
		div.innerHTML = "<a href='#'></a>";
		return div.firstChild && typeof div.firstChild.getAttribute !== strundefined &&
			div.firstChild.getAttribute("href") === "#";
	}),

	// Check if getElementsByClassName can be trusted
	assertUsableClassName = assert(function( div ) {
		// Opera can't find a second classname (in 9.6)
		div.innerHTML = "<div class='hidden e'></div><div class='hidden'></div>";
		if ( !div.getElementsByClassName || div.getElementsByClassName("e").length === 0 ) {
			return false;
		}

		// Safari caches class attributes, doesn't catch changes (in 3.2)
		div.lastChild.className = "e";
		return div.getElementsByClassName("e").length !== 1;
	});

var Sizzle = function( selector, context, results, seed ) {
	results = results || [];
	context = context || document;
	var match, elem, xml, m,
		nodeType = context.nodeType;

	if ( nodeType !== 1 && nodeType !== 9 ) {
		return [];
	}

	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	xml = isXML( context );

	if ( !xml && !seed ) {
		if ( (match = rquickExpr.exec( selector )) ) {
			// Speed-up: Sizzle("#ID")
			if ( (m = match[1]) ) {
				if ( nodeType === 9 ) {
					elem = context.getElementById( m );
					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE, Opera, and Webkit return items
						// by name instead of ID
						if ( elem.id === m ) {
							results.push( elem );
							return results;
						}
					} else {
						return results;
					}
				} else {
					// Context is not a document
					if ( context.ownerDocument && (elem = context.ownerDocument.getElementById( m )) &&
						contains( context, elem ) && elem.id === m ) {
						results.push( elem );
						return results;
					}
				}

			// Speed-up: Sizzle("TAG")
			} else if ( match[2] ) {
				push.apply( results, slice.call(context.getElementsByTagName( selector ), 0) );
				return results;

			// Speed-up: Sizzle(".CLASS")
			} else if ( (m = match[3]) && assertUsableClassName && context.getElementsByClassName ) {
				push.apply( results, slice.call(context.getElementsByClassName( m ), 0) );
				return results;
			}
		}
	}

	// All others
	return select( selector, context, results, seed, xml );
};

var Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	match: matchExpr,

	order: [ "ID", "TAG" ],

	attrHandle: {},

	createPseudo: markFunction,

	find: {
		"ID": assertGetIdNotName ?
			function( id, context, xml ) {
				if ( typeof context.getElementById !== strundefined && !xml ) {
					var m = context.getElementById( id );
					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					return m && m.parentNode ? [m] : [];
				}
			} :
			function( id, context, xml ) {
				if ( typeof context.getElementById !== strundefined && !xml ) {
					var m = context.getElementById( id );

					return m ?
						m.id === id || typeof m.getAttributeNode !== strundefined && m.getAttributeNode("id").value === id ?
							[m] :
							undefined :
						[];
				}
			},

		"TAG": assertTagNameNoComments ?
			function( tag, context ) {
				if ( typeof context.getElementsByTagName !== strundefined ) {
					return context.getElementsByTagName( tag );
				}
			} :
			function( tag, context ) {
				var results = context.getElementsByTagName( tag );

				// Filter out possible comments
				if ( tag === "*" ) {
					var elem,
						tmp = [],
						i = 0;

					for ( ; (elem = results[i]); i++ ) {
						if ( elem.nodeType === 1 ) {
							tmp.push( elem );
						}
					}

					return tmp;
				}
				return results;
			}
	},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[1] = match[1].replace( rbackslash, "" );

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[4] || match[5] || "" ).replace( rbackslash, "" );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {
			/* matches from matchExpr.CHILD
				1 type (only|nth|...)
				2 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				3 xn-component of xn+y argument ([+-]?\d*n|)
				4 sign of xn-component
				5 x of xn-component
				6 sign of y-component
				7 y of y-component
			*/
			match[1] = match[1].toLowerCase();

			if ( match[1] === "nth" ) {
				// nth-child requires argument
				if ( !match[2] ) {
					Sizzle.error( match[0] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[3] = +( match[3] ? match[4] + (match[5] || 1) : 2 * ( match[2] === "even" || match[2] === "odd" ) );
				match[4] = +( ( match[6] + match[7] ) || match[2] === "odd" );

			// other types prohibit arguments
			} else if ( match[2] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var argument,
				unquoted = match[4];

			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			// Relinquish our claim on characters in `unquoted` from a closing parenthesis on
			if ( unquoted && (argument = rselector.exec( unquoted )) && argument.pop() ) {

				match[0] = match[0].slice( 0, argument[0].length - unquoted.length - 1 );
				unquoted = argument[0].slice( 0, -1 );
			}

			// Quoted or unquoted, we have the full argument
			// Return only captures needed by the pseudo filter method (type and argument)
			match.splice( 2, 3, unquoted || match[3] );
			return match;
		}
	},

	filter: {
		"ID": assertGetIdNotName ?
			function( id ) {
				id = id.replace( rbackslash, "" );
				return function( elem ) {
					return elem.getAttribute("id") === id;
				};
			} :
			function( id ) {
				id = id.replace( rbackslash, "" );
				return function( elem ) {
					var node = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode("id");
					return node && node.value === id;
				};
			},

		"TAG": function( nodeName ) {
			if ( nodeName === "*" ) {
				return function() { return true; };
			}
			nodeName = nodeName.replace( rbackslash, "" ).toLowerCase();

			return function( elem ) {
				return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
			};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className ];
			if ( !pattern ) {
				pattern = classCache[ className ] = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" );
				cachedClasses.push( className );
				// Avoid too large of a cache
				if ( cachedClasses.length > Expr.cacheLength ) {
					delete classCache[ cachedClasses.shift() ];
				}
			}
			return function( elem ) {
				return pattern.test( elem.className || (typeof elem.getAttribute !== strundefined && elem.getAttribute("class")) || "" );
			};
		},

		"ATTR": function( name, operator, check ) {
			if ( !operator ) {
				return function( elem ) {
					return Sizzle.attr( elem, name ) != null;
				};
			}

			return function( elem ) {
				var result = Sizzle.attr( elem, name ),
					value = result + "";

				if ( result == null ) {
					return operator === "!=";
				}

				switch ( operator ) {
					case "=":
						return value === check;
					case "!=":
						return value !== check;
					case "^=":
						return check && value.indexOf( check ) === 0;
					case "*=":
						return check && value.indexOf( check ) > -1;
					case "$=":
						return check && value.substr( value.length - check.length ) === check;
					case "~=":
						return ( " " + value + " " ).indexOf( check ) > -1;
					case "|=":
						return value === check || value.substr( 0, check.length + 1 ) === check + "-";
				}
			};
		},

		"CHILD": function( type, argument, first, last ) {

			if ( type === "nth" ) {
				var doneName = done++;

				return function( elem ) {
					var parent, diff,
						count = 0,
						node = elem;

					if ( first === 1 && last === 0 ) {
						return true;
					}

					parent = elem.parentNode;

					if ( parent && (parent[ expando ] !== doneName || !elem.sizset) ) {
						for ( node = parent.firstChild; node; node = node.nextSibling ) {
							if ( node.nodeType === 1 ) {
								node.sizset = ++count;
								if ( node === elem ) {
									break;
								}
							}
						}

						parent[ expando ] = doneName;
					}

					diff = elem.sizset - last;

					if ( first === 0 ) {
						return diff === 0;

					} else {
						return ( diff % first === 0 && diff / first >= 0 );
					}
				};
			}

			return function( elem ) {
				var node = elem;

				switch ( type ) {
					case "only":
					case "first":
						while ( (node = node.previousSibling) ) {
							if ( node.nodeType === 1 ) {
								return false;
							}
						}

						if ( type === "first" ) {
							return true;
						}

						node = elem;

						/* falls through */
					case "last":
						while ( (node = node.nextSibling) ) {
							if ( node.nodeType === 1 ) {
								return false;
							}
						}

						return true;
				}
			};
		},

		"PSEUDO": function( pseudo, argument, context, xml ) {
			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			var fn = Expr.pseudos[ pseudo ] || Expr.pseudos[ pseudo.toLowerCase() ];

			if ( !fn ) {
				Sizzle.error( "unsupported pseudo: " + pseudo );
			}

			// The user may set fn.sizzleFilter to indicate
			// that arguments are needed to create the filter function
			// just as Sizzle does
			if ( !fn.sizzleFilter ) {
				return fn;
			}

			return fn( argument, context, xml );
		}
	},

	pseudos: {
		"not": markFunction(function( selector, context, xml ) {
			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var matcher = compile( selector.replace( rtrim, "$1" ), context, xml );
			return function( elem ) {
				return !matcher( elem );
			};
		}),

		"enabled": function( elem ) {
			return elem.disabled === false;
		},

		"disabled": function( elem ) {
			return elem.disabled === true;
		},

		"checked": function( elem ) {
			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},

		"selected": function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},

		"empty": function( elem ) {
			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is only affected by element nodes and content nodes(including text(3), cdata(4)),
			//   not comment, processing instructions, or others
			// Thanks to Diego Perini for the nodeName shortcut
			//   Greater than "@" means alpha characters (specifically not starting with "#" or "?")
			var nodeType;
			elem = elem.firstChild;
			while ( elem ) {
				if ( elem.nodeName > "@" || (nodeType = elem.nodeType) === 3 || nodeType === 4 ) {
					return false;
				}
				elem = elem.nextSibling;
			}
			return true;
		},

		"contains": markFunction(function( text ) {
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"text": function( elem ) {
			var type, attr;
			// IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc)
			// use getAttribute instead to test this case
			return elem.nodeName.toLowerCase() === "input" &&
				(type = elem.type) === "text" &&
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === type );
		},

		// Input types
		"radio": createInputFunction("radio"),
		"checkbox": createInputFunction("checkbox"),
		"file": createInputFunction("file"),
		"password": createInputFunction("password"),
		"image": createInputFunction("image"),

		"submit": createButtonFunction("submit"),
		"reset": createButtonFunction("reset"),

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"focus": function( elem ) {
			var doc = elem.ownerDocument;
			return elem === doc.activeElement && (!doc.hasFocus || doc.hasFocus()) && !!(elem.type || elem.href);
		},

		"active": function( elem ) {
			return elem === elem.ownerDocument.activeElement;
		}
	},

	setFilters: {
		"first": function( elements, argument, not ) {
			return not ? elements.slice( 1 ) : [ elements[0] ];
		},

		"last": function( elements, argument, not ) {
			var elem = elements.pop();
			return not ? elements : [ elem ];
		},

		"even": function( elements, argument, not ) {
			var results = [],
				i = not ? 1 : 0,
				len = elements.length;
			for ( ; i < len; i = i + 2 ) {
				results.push( elements[i] );
			}
			return results;
		},

		"odd": function( elements, argument, not ) {
			var results = [],
				i = not ? 0 : 1,
				len = elements.length;
			for ( ; i < len; i = i + 2 ) {
				results.push( elements[i] );
			}
			return results;
		},

		"lt": function( elements, argument, not ) {
			return not ? elements.slice( +argument ) : elements.slice( 0, +argument );
		},

		"gt": function( elements, argument, not ) {
			return not ? elements.slice( 0, +argument + 1 ) : elements.slice( +argument + 1 );
		},

		"eq": function( elements, argument, not ) {
			var elem = elements.splice( +argument, 1 );
			return not ? elements : elem;
		}
	}
};

// Deprecated
Expr.setFilters["nth"] = Expr.setFilters["eq"];

// Back-compat
Expr.filters = Expr.pseudos;

// IE6/7 return a modified href
if ( !assertHrefNotNormalized ) {
	Expr.attrHandle = {
		"href": function( elem ) {
			return elem.getAttribute( "href", 2 );
		},
		"type": function( elem ) {
			return elem.getAttribute("type");
		}
	};
}

// Add getElementsByName if usable
if ( assertUsableName ) {
	Expr.order.push("NAME");
	Expr.find["NAME"] = function( name, context ) {
		if ( typeof context.getElementsByName !== strundefined ) {
			return context.getElementsByName( name );
		}
	};
}

// Add getElementsByClassName if usable
if ( assertUsableClassName ) {
	Expr.order.splice( 1, 0, "CLASS" );
	Expr.find["CLASS"] = function( className, context, xml ) {
		if ( typeof context.getElementsByClassName !== strundefined && !xml ) {
			return context.getElementsByClassName( className );
		}
	};
}

// If slice is not available, provide a backup
try {
	slice.call( docElem.childNodes, 0 )[0].nodeType;
} catch ( e ) {
	slice = function( i ) {
		var elem, results = [];
		for ( ; (elem = this[i]); i++ ) {
			results.push( elem );
		}
		return results;
	};
}

var isXML = Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

// Element contains another
var contains = Sizzle.contains = docElem.compareDocumentPosition ?
	function( a, b ) {
		return !!( a.compareDocumentPosition( b ) & 16 );
	} :
	docElem.contains ?
	function( a, b ) {
		var adown = a.nodeType === 9 ? a.documentElement : a,
			bup = b.parentNode;
		return a === bup || !!( bup && bup.nodeType === 1 && adown.contains && adown.contains(bup) );
	} :
	function( a, b ) {
		while ( (b = b.parentNode) ) {
			if ( b === a ) {
				return true;
			}
		}
		return false;
	};

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
var getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( nodeType ) {
		if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
			// Use textContent for elements
			// innerText usage removed for consistency of new lines (see #11153)
			if ( typeof elem.textContent === "string" ) {
				return elem.textContent;
			} else {
				// Traverse its children
				for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
					ret += getText( elem );
				}
			}
		} else if ( nodeType === 3 || nodeType === 4 ) {
			return elem.nodeValue;
		}
		// Do not include comment or processing instruction nodes
	} else {

		// If no nodeType, this is expected to be an array
		for ( ; (node = elem[i]); i++ ) {
			// Do not traverse comment nodes
			ret += getText( node );
		}
	}
	return ret;
};

Sizzle.attr = function( elem, name ) {
	var attr,
		xml = isXML( elem );

	if ( !xml ) {
		name = name.toLowerCase();
	}
	if ( Expr.attrHandle[ name ] ) {
		return Expr.attrHandle[ name ]( elem );
	}
	if ( assertAttributes || xml ) {
		return elem.getAttribute( name );
	}
	attr = elem.getAttributeNode( name );
	return attr ?
		typeof elem[ name ] === "boolean" ?
			elem[ name ] ? name : null :
			attr.specified ? attr.value : null :
		null;
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

// Check if the JavaScript engine is using some sort of
// optimization where it does not always call our comparision
// function. If that is the case, discard the hasDuplicate value.
//   Thus far that includes Google Chrome.
[0, 0].sort(function() {
	return (baseHasDuplicate = 0);
});


if ( docElem.compareDocumentPosition ) {
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		return ( !a.compareDocumentPosition || !b.compareDocumentPosition ?
			a.compareDocumentPosition :
			a.compareDocumentPosition(b) & 4
		) ? -1 : 1;
	};

} else {
	sortOrder = function( a, b ) {
		// The nodes are identical, we can exit early
		if ( a === b ) {
			hasDuplicate = true;
			return 0;

		// Fallback to using sourceIndex (in IE) if it's available on both nodes
		} else if ( a.sourceIndex && b.sourceIndex ) {
			return a.sourceIndex - b.sourceIndex;
		}

		var al, bl,
			ap = [],
			bp = [],
			aup = a.parentNode,
			bup = b.parentNode,
			cur = aup;

		// If the nodes are siblings (or identical) we can do a quick check
		if ( aup === bup ) {
			return siblingCheck( a, b );

		// If no parents were found then the nodes are disconnected
		} else if ( !aup ) {
			return -1;

		} else if ( !bup ) {
			return 1;
		}

		// Otherwise they're somewhere else in the tree so we need
		// to build up a full list of the parentNodes for comparison
		while ( cur ) {
			ap.unshift( cur );
			cur = cur.parentNode;
		}

		cur = bup;

		while ( cur ) {
			bp.unshift( cur );
			cur = cur.parentNode;
		}

		al = ap.length;
		bl = bp.length;

		// Start walking down the tree looking for a discrepancy
		for ( var i = 0; i < al && i < bl; i++ ) {
			if ( ap[i] !== bp[i] ) {
				return siblingCheck( ap[i], bp[i] );
			}
		}

		// We ended someplace up the tree so do a sibling check
		return i === al ?
			siblingCheck( a, bp[i], -1 ) :
			siblingCheck( ap[i], b, 1 );
	};

	siblingCheck = function( a, b, ret ) {
		if ( a === b ) {
			return ret;
		}

		var cur = a.nextSibling;

		while ( cur ) {
			if ( cur === b ) {
				return -1;
			}

			cur = cur.nextSibling;
		}

		return 1;
	};
}

// Document sorting and removing duplicates
Sizzle.uniqueSort = function( results ) {
	var elem,
		i = 1;

	if ( sortOrder ) {
		hasDuplicate = baseHasDuplicate;
		results.sort( sortOrder );

		if ( hasDuplicate ) {
			for ( ; (elem = results[i]); i++ ) {
				if ( elem === results[ i - 1 ] ) {
					results.splice( i--, 1 );
				}
			}
		}
	}

	return results;
};

function multipleContexts( selector, contexts, results, seed ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results, seed );
	}
}

function handlePOSGroup( selector, posfilter, argument, contexts, seed, not ) {
	var results,
		fn = Expr.setFilters[ posfilter.toLowerCase() ];

	if ( !fn ) {
		Sizzle.error( posfilter );
	}

	if ( selector || !(results = seed) ) {
		multipleContexts( selector || "*", contexts, (results = []), seed );
	}

	return results.length > 0 ? fn( results, argument, not ) : [];
}

function handlePOS( selector, context, results, seed, groups ) {
	var match, not, anchor, ret, elements, currentContexts, part, lastIndex,
		i = 0,
		len = groups.length,
		rpos = matchExpr["POS"],
		// This is generated here in case matchExpr["POS"] is extended
		rposgroups = new RegExp( "^" + rpos.source + "(?!" + whitespace + ")", "i" ),
		// This is for making sure non-participating
		// matching groups are represented cross-browser (IE6-8)
		setUndefined = function() {
			var i = 1,
				len = arguments.length - 2;
			for ( ; i < len; i++ ) {
				if ( arguments[i] === undefined ) {
					match[i] = undefined;
				}
			}
		};

	for ( ; i < len; i++ ) {
		// Reset regex index to 0
		rpos.exec("");
		selector = groups[i];
		ret = [];
		anchor = 0;
		elements = seed;
		while ( (match = rpos.exec( selector )) ) {
			lastIndex = rpos.lastIndex = match.index + match[0].length;
			if ( lastIndex > anchor ) {
				part = selector.slice( anchor, match.index );
				anchor = lastIndex;
				currentContexts = [ context ];

				if ( rcombinators.test(part) ) {
					if ( elements ) {
						currentContexts = elements;
					}
					elements = seed;
				}

				if ( (not = rendsWithNot.test( part )) ) {
					part = part.slice( 0, -5 ).replace( rcombinators, "$&*" );
				}

				if ( match.length > 1 ) {
					match[0].replace( rposgroups, setUndefined );
				}
				elements = handlePOSGroup( part, match[1], match[2], currentContexts, elements, not );
			}
		}

		if ( elements ) {
			ret = ret.concat( elements );

			if ( (part = selector.slice( anchor )) && part !== ")" ) {
				if ( rcombinators.test(part) ) {
					multipleContexts( part, ret, results, seed );
				} else {
					Sizzle( part, context, results, seed ? seed.concat(elements) : elements );
				}
			} else {
				push.apply( results, ret );
			}
		} else {
			Sizzle( selector, context, results, seed );
		}
	}

	// Do not sort if this is a single filter
	return len === 1 ? results : Sizzle.uniqueSort( results );
}

function tokenize( selector, context, xml ) {
	var tokens, soFar, type,
		groups = [],
		i = 0,

		// Catch obvious selector issues: terminal ")"; nonempty fallback match
		// rselector never fails to match *something*
		match = rselector.exec( selector ),
		matched = !match.pop() && !match.pop(),
		selectorGroups = matched && selector.match( rgroups ) || [""],

		preFilters = Expr.preFilter,
		filters = Expr.filter,
		checkContext = !xml && context !== document;

	for ( ; (soFar = selectorGroups[i]) != null && matched; i++ ) {
		groups.push( tokens = [] );

		// Need to make sure we're within a narrower context if necessary
		// Adding a descendant combinator will generate what is needed
		if ( checkContext ) {
			soFar = " " + soFar;
		}

		while ( soFar ) {
			matched = false;

			// Combinators
			if ( (match = rcombinators.exec( soFar )) ) {
				soFar = soFar.slice( match[0].length );

				// Cast descendant combinators to space
				matched = tokens.push({ part: match.pop().replace( rtrim, " " ), captures: match });
			}

			// Filters
			for ( type in filters ) {
				if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
					(match = preFilters[ type ]( match, context, xml )) ) ) {

					soFar = soFar.slice( match.shift().length );
					matched = tokens.push({ part: type, captures: match });
				}
			}

			if ( !matched ) {
				break;
			}
		}
	}

	if ( !matched ) {
		Sizzle.error( selector );
	}

	return groups;
}

function addCombinator( matcher, combinator, context ) {
	var dir = combinator.dir,
		doneName = done++;

	if ( !matcher ) {
		// If there is no matcher to check, check against the context
		matcher = function( elem ) {
			return elem === context;
		};
	}
	return combinator.first ?
		function( elem, context ) {
			while ( (elem = elem[ dir ]) ) {
				if ( elem.nodeType === 1 ) {
					return matcher( elem, context ) && elem;
				}
			}
		} :
		function( elem, context ) {
			var cache,
				dirkey = doneName + "." + dirruns,
				cachedkey = dirkey + "." + cachedruns;
			while ( (elem = elem[ dir ]) ) {
				if ( elem.nodeType === 1 ) {
					if ( (cache = elem[ expando ]) === cachedkey ) {
						return elem.sizset;
					} else if ( typeof cache === "string" && cache.indexOf(dirkey) === 0 ) {
						if ( elem.sizset ) {
							return elem;
						}
					} else {
						elem[ expando ] = cachedkey;
						if ( matcher( elem, context ) ) {
							elem.sizset = true;
							return elem;
						}
						elem.sizset = false;
					}
				}
			}
		};
}

function addMatcher( higher, deeper ) {
	return higher ?
		function( elem, context ) {
			var result = deeper( elem, context );
			return result && higher( result === true ? elem : result, context );
		} :
		deeper;
}

// ["TAG", ">", "ID", " ", "CLASS"]
function matcherFromTokens( tokens, context, xml ) {
	var token, matcher,
		i = 0;

	for ( ; (token = tokens[i]); i++ ) {
		if ( Expr.relative[ token.part ] ) {
			matcher = addCombinator( matcher, Expr.relative[ token.part ], context );
		} else {
			token.captures.push( context, xml );
			matcher = addMatcher( matcher, Expr.filter[ token.part ].apply( null, token.captures ) );
		}
	}

	return matcher;
}

function matcherFromGroupMatchers( matchers ) {
	return function( elem, context ) {
		var matcher,
			j = 0;
		for ( ; (matcher = matchers[j]); j++ ) {
			if ( matcher(elem, context) ) {
				return true;
			}
		}
		return false;
	};
}

var compile = Sizzle.compile = function( selector, context, xml ) {
	var tokens, group, i,
		cached = compilerCache[ selector ];

	// Return a cached group function if already generated (context dependent)
	if ( cached && cached.context === context ) {
		return cached;
	}

	// Generate a function of recursive functions that can be used to check each element
	group = tokenize( selector, context, xml );
	for ( i = 0; (tokens = group[i]); i++ ) {
		group[i] = matcherFromTokens( tokens, context, xml );
	}

	// Cache the compiled function
	cached = compilerCache[ selector ] = matcherFromGroupMatchers( group );
	cached.context = context;
	cached.runs = cached.dirruns = 0;
	cachedSelectors.push( selector );
	// Ensure only the most recent are cached
	if ( cachedSelectors.length > Expr.cacheLength ) {
		delete compilerCache[ cachedSelectors.shift() ];
	}
	return cached;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	return Sizzle( expr, null, null, [ elem ] ).length > 0;
};

var select = function( selector, context, results, seed, xml ) {
	// Remove excessive whitespace
	selector = selector.replace( rtrim, "$1" );
	var elements, matcher, i, len, elem, token,
		type, findContext, notTokens,
		match = selector.match( rgroups ),
		tokens = selector.match( rtokens ),
		contextNodeType = context.nodeType;

	// POS handling
	if ( matchExpr["POS"].test(selector) ) {
		return handlePOS( selector, context, results, seed, match );
	}

	if ( seed ) {
		elements = slice.call( seed, 0 );

	// To maintain document order, only narrow the
	// set if there is one group
	} else if ( match && match.length === 1 ) {

		// Take a shortcut and set the context if the root selector is an ID
		if ( tokens.length > 1 && contextNodeType === 9 && !xml &&
				(match = matchExpr["ID"].exec( tokens[0] )) ) {

			context = Expr.find["ID"]( match[1], context, xml )[0];
			if ( !context ) {
				return results;
			}

			selector = selector.slice( tokens.shift().length );
		}

		findContext = ( (match = rsibling.exec( tokens[0] )) && !match.index && context.parentNode ) || context;

		// Get the last token, excluding :not
		notTokens = tokens.pop();
		token = notTokens.split(":not")[0];

		for ( i = 0, len = Expr.order.length; i < len; i++ ) {
			type = Expr.order[i];

			if ( (match = matchExpr[ type ].exec( token )) ) {
				elements = Expr.find[ type ]( (match[1] || "").replace( rbackslash, "" ), findContext, xml );

				if ( elements == null ) {
					continue;
				}

				if ( token === notTokens ) {
					selector = selector.slice( 0, selector.length - notTokens.length ) +
						token.replace( matchExpr[ type ], "" );

					if ( !selector ) {
						push.apply( results, slice.call(elements, 0) );
					}
				}
				break;
			}
		}
	}

	// Only loop over the given elements once
	// If selector is empty, we're already done
	if ( selector ) {
		matcher = compile( selector, context, xml );
		dirruns = matcher.dirruns++;

		if ( elements == null ) {
			elements = Expr.find["TAG"]( "*", (rsibling.test( selector ) && context.parentNode) || context );
		}
		for ( i = 0; (elem = elements[i]); i++ ) {
			cachedruns = matcher.runs++;
			if ( matcher(elem, context) ) {
				results.push( elem );
			}
		}
	}

	return results;
};

if ( document.querySelectorAll ) {
	(function() {
		var disconnectedMatch,
			oldSelect = select,
			rescape = /'|\\/g,
			rattributeQuotes = /\=[\x20\t\r\n\f]*([^'"\]]*)[\x20\t\r\n\f]*\]/g,
			rbuggyQSA = [],
			// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
			// A support test would require too much code (would include document ready)
			// just skip matchesSelector for :active
			rbuggyMatches = [":active"],
			matches = docElem.matchesSelector ||
				docElem.mozMatchesSelector ||
				docElem.webkitMatchesSelector ||
				docElem.oMatchesSelector ||
				docElem.msMatchesSelector;

		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( div ) {
			div.innerHTML = "<select><option selected></option></select>";

			// IE8 - Some boolean attributes are not treated correctly
			if ( !div.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:checked|disabled|ismap|multiple|readonly|selected|value)" );
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here (do not put tests after this one)
			if ( !div.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}
		});

		assert(function( div ) {

			// Opera 10-12/IE9 - ^= $= *= and empty values
			// Should not select anything
			div.innerHTML = "<p test=''></p>";
			if ( div.querySelectorAll("[test^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:\"\"|'')" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here (do not put tests after this one)
			div.innerHTML = "<input type='hidden'>";
			if ( !div.querySelectorAll(":enabled").length ) {
				rbuggyQSA.push(":enabled", ":disabled");
			}
		});

		rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );

		select = function( selector, context, results, seed, xml ) {
			// Only use querySelectorAll when not filtering,
			// when this is not xml,
			// and when no QSA bugs apply
			if ( !seed && !xml && (!rbuggyQSA || !rbuggyQSA.test( selector )) ) {
				if ( context.nodeType === 9 ) {
					try {
						push.apply( results, slice.call(context.querySelectorAll( selector ), 0) );
						return results;
					} catch(qsaError) {}
				// qSA works strangely on Element-rooted queries
				// We can work around this by specifying an extra ID on the root
				// and working up from there (Thanks to Andrew Dupont for the technique)
				// IE 8 doesn't work on object elements
				} else if ( context.nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
					var old = context.getAttribute("id"),
						nid = old || expando,
						newContext = rsibling.test( selector ) && context.parentNode || context;

					if ( old ) {
						nid = nid.replace( rescape, "\\$&" );
					} else {
						context.setAttribute( "id", nid );
					}

					try {
						push.apply( results, slice.call( newContext.querySelectorAll(
							selector.replace( rgroups, "[id='" + nid + "'] $&" )
						), 0 ) );
						return results;
					} catch(qsaError) {
					} finally {
						if ( !old ) {
							context.removeAttribute("id");
						}
					}
				}
			}

			return oldSelect( selector, context, results, seed, xml );
		};

		if ( matches ) {
			assert(function( div ) {
				// Check to see if it's possible to do matchesSelector
				// on a disconnected node (IE 9)
				disconnectedMatch = matches.call( div, "div" );

				// This should fail with an exception
				// Gecko does not error, returns false instead
				try {
					matches.call( div, "[test!='']:sizzle" );
					rbuggyMatches.push( Expr.match.PSEUDO );
				} catch ( e ) {}
			});

			// rbuggyMatches always contains :active, so no need for a length check
			rbuggyMatches = /* rbuggyMatches.length && */ new RegExp( rbuggyMatches.join("|") );

			Sizzle.matchesSelector = function( elem, expr ) {
				// Make sure that attribute selectors are quoted
				expr = expr.replace( rattributeQuotes, "='$1']" );

				// rbuggyMatches always contains :active, so no need for an existence check
				if ( !isXML( elem ) && !rbuggyMatches.test( expr ) && (!rbuggyQSA || !rbuggyQSA.test( expr )) ) {
					try {
						var ret = matches.call( elem, expr );

						// IE 9's matchesSelector returns false on disconnected nodes
						if ( ret || disconnectedMatch ||
								// As well, disconnected nodes are said to be in a document
								// fragment in IE 9
								elem.document && elem.document.nodeType !== 11 ) {
							return ret;
						}
					} catch(e) {}
				}

				return Sizzle( expr, null, null, [ elem ] ).length > 0;
			};
		}
	})();
}

// Override sizzle attribute retrieval
Sizzle.attr = jQuery.attr;
jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.pseudos;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;


})( window );
var runtil = /Until$/,
	rparentsprev = /^(?:parents|prev(?:Until|All))/,
	isSimple = /^.[^:#\[\.,]*$/,
	rneedsContext = jQuery.expr.match.needsContext,
	// methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend({
	find: function( selector ) {
		var i, l, length, n, r, ret,
			self = this;

		if ( typeof selector !== "string" ) {
			return jQuery( selector ).filter(function() {
				for ( i = 0, l = self.length; i < l; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			});
		}

		ret = this.pushStack( "", "find", selector );

		for ( i = 0, l = this.length; i < l; i++ ) {
			length = ret.length;
			jQuery.find( selector, this[i], ret );

			if ( i > 0 ) {
				// Make sure that the results are unique
				for ( n = length; n < ret.length; n++ ) {
					for ( r = 0; r < length; r++ ) {
						if ( ret[r] === ret[n] ) {
							ret.splice(n--, 1);
							break;
						}
					}
				}
			}
		}

		return ret;
	},

	has: function( target ) {
		var i,
			targets = jQuery( target, this ),
			len = targets.length;

		return this.filter(function() {
			for ( i = 0; i < len; i++ ) {
				if ( jQuery.contains( this, targets[i] ) ) {
					return true;
				}
			}
		});
	},

	not: function( selector ) {
		return this.pushStack( winnow(this, selector, false), "not", selector);
	},

	filter: function( selector ) {
		return this.pushStack( winnow(this, selector, true), "filter", selector );
	},

	is: function( selector ) {
		return !!selector && (
			typeof selector === "string" ?
				// If this is a positional/relative selector, check membership in the returned set
				// so $("p:first").is("p:last") won't return true for a doc with two "p".
				rneedsContext.test( selector ) ?
					jQuery( selector, this.context ).index( this[0] ) >= 0 :
					jQuery.filter( selector, this ).length > 0 :
				this.filter( selector ).length > 0 );
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			ret = [],
			pos = rneedsContext.test( selectors ) || typeof selectors !== "string" ?
				jQuery( selectors, context || this.context ) :
				0;

		for ( ; i < l; i++ ) {
			cur = this[i];

			while ( cur && cur.ownerDocument && cur !== context && cur.nodeType !== 11 ) {
				if ( pos ? pos.index(cur) > -1 : jQuery.find.matchesSelector(cur, selectors) ) {
					ret.push( cur );
					break;
				}
				cur = cur.parentNode;
			}
		}

		ret = ret.length > 1 ? jQuery.unique( ret ) : ret;

		return this.pushStack( ret, "closest", selectors );
	},

	// Determine the position of an element within
	// the matched set of elements
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[0] && this[0].parentNode ) ? this.prevAll().length : -1;
		}

		// index in selector
		if ( typeof elem === "string" ) {
			return jQuery.inArray( this[0], jQuery( elem ) );
		}

		// Locate the position of the desired element
		return jQuery.inArray(
			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[0] : elem, this );
	},

	add: function( selector, context ) {
		var set = typeof selector === "string" ?
				jQuery( selector, context ) :
				jQuery.makeArray( selector && selector.nodeType ? [ selector ] : selector ),
			all = jQuery.merge( this.get(), set );

		return this.pushStack( isDisconnected( set[0] ) || isDisconnected( all[0] ) ?
			all :
			jQuery.unique( all ) );
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter(selector)
		);
	}
});

jQuery.fn.andSelf = jQuery.fn.addBack;

// A painfully simple check to see if an element is disconnected
// from a document (should be improved, where feasible).
function isDisconnected( node ) {
	return !node || !node.parentNode || node.parentNode.nodeType === 11;
}

function sibling( cur, dir ) {
	do {
		cur = cur[ dir ];
	} while ( cur && cur.nodeType !== 1 );

	return cur;
}

jQuery.each({
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return jQuery.dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return jQuery.dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return jQuery.dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return jQuery.sibling( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return jQuery.sibling( elem.firstChild );
	},
	contents: function( elem ) {
		return jQuery.nodeName( elem, "iframe" ) ?
			elem.contentDocument || elem.contentWindow.document :
			jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var ret = jQuery.map( this, fn, until );

		if ( !runtil.test( name ) ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			ret = jQuery.filter( selector, ret );
		}

		ret = this.length > 1 && !guaranteedUnique[ name ] ? jQuery.unique( ret ) : ret;

		if ( this.length > 1 && rparentsprev.test( name ) ) {
			ret = ret.reverse();
		}

		return this.pushStack( ret, name, core_slice.call( arguments ).join(",") );
	};
});

jQuery.extend({
	filter: function( expr, elems, not ) {
		if ( not ) {
			expr = ":not(" + expr + ")";
		}

		return elems.length === 1 ?
			jQuery.find.matchesSelector(elems[0], expr) ? [ elems[0] ] : [] :
			jQuery.find.matches(expr, elems);
	},

	dir: function( elem, dir, until ) {
		var matched = [],
			cur = elem[ dir ];

		while ( cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery( cur ).is( until )) ) {
			if ( cur.nodeType === 1 ) {
				matched.push( cur );
			}
			cur = cur[dir];
		}
		return matched;
	},

	sibling: function( n, elem ) {
		var r = [];

		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				r.push( n );
			}
		}

		return r;
	}
});

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, keep ) {

	// Can't pass null or undefined to indexOf in Firefox 4
	// Set to 0 to skip string check
	qualifier = qualifier || 0;

	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep(elements, function( elem, i ) {
			var retVal = !!qualifier.call( elem, i, elem );
			return retVal === keep;
		});

	} else if ( qualifier.nodeType ) {
		return jQuery.grep(elements, function( elem, i ) {
			return ( elem === qualifier ) === keep;
		});

	} else if ( typeof qualifier === "string" ) {
		var filtered = jQuery.grep(elements, function( elem ) {
			return elem.nodeType === 1;
		});

		if ( isSimple.test( qualifier ) ) {
			return jQuery.filter(qualifier, filtered, !keep);
		} else {
			qualifier = jQuery.filter( qualifier, filtered );
		}
	}

	return jQuery.grep(elements, function( elem, i ) {
		return ( jQuery.inArray( elem, qualifier ) >= 0 ) === keep;
	});
}
function createSafeFragment( document ) {
	var list = nodeNames.split( "|" ),
	safeFrag = document.createDocumentFragment();

	if ( safeFrag.createElement ) {
		while ( list.length ) {
			safeFrag.createElement(
				list.pop()
			);
		}
	}
	return safeFrag;
}

var nodeNames = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|" +
		"header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
	rinlinejQuery = / jQuery\d+="(?:null|\d+)"/g,
	rleadingWhitespace = /^\s+/,
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
	rtagName = /<([\w:]+)/,
	rtbody = /<tbody/i,
	rhtml = /<|&#?\w+;/,
	rnoInnerhtml = /<(?:script|style|link)/i,
	rnocache = /<(?:script|object|embed|option|style)/i,
	rnoshimcache = new RegExp("<(?:" + nodeNames + ")[\\s/>]", "i"),
	rcheckableType = /^(?:checkbox|radio)$/,
	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptType = /\/(java|ecma)script/i,
	rcleanScript = /^\s*<!(?:\[CDATA\[|\-\-)|[\]\-]{2}>\s*$/g,
	wrapMap = {
		option: [ 1, "<select multiple='multiple'>", "</select>" ],
		legend: [ 1, "<fieldset>", "</fieldset>" ],
		thead: [ 1, "<table>", "</table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],
		col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
		area: [ 1, "<map>", "</map>" ],
		_default: [ 0, "", "" ]
	},
	safeFragment = createSafeFragment( document ),
	fragmentDiv = safeFragment.appendChild( document.createElement("div") );

wrapMap.optgroup = wrapMap.option;
wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

// IE6-8 can't serialize link, script, style, or any html5 (NoScope) tags,
// unless wrapped in a div with non-breaking characters in front of it.
if ( !jQuery.support.htmlSerialize ) {
	wrapMap._default = [ 1, "X<div>", "</div>" ];
}

jQuery.fn.extend({
	text: function( value ) {
		return jQuery.access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().append( ( this[0] && this[0].ownerDocument || document ).createTextNode( value ) );
		}, null, value, arguments.length );
	},

	wrapAll: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapAll( html.call(this, i) );
			});
		}

		if ( this[0] ) {
			// The elements to wrap the target around
			var wrap = jQuery( html, this[0].ownerDocument ).eq(0).clone(true);

			if ( this[0].parentNode ) {
				wrap.insertBefore( this[0] );
			}

			wrap.map(function() {
				var elem = this;

				while ( elem.firstChild && elem.firstChild.nodeType === 1 ) {
					elem = elem.firstChild;
				}

				return elem;
			}).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapInner( html.call(this, i) );
			});
		}

		return this.each(function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		});
	},

	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each(function(i) {
			jQuery( this ).wrapAll( isFunction ? html.call(this, i) : html );
		});
	},

	unwrap: function() {
		return this.parent().each(function() {
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		}).end();
	},

	append: function() {
		return this.domManip(arguments, true, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 ) {
				this.appendChild( elem );
			}
		});
	},

	prepend: function() {
		return this.domManip(arguments, true, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 ) {
				this.insertBefore( elem, this.firstChild );
			}
		});
	},

	before: function() {
		if ( !isDisconnected( this[0] ) ) {
			return this.domManip(arguments, false, function( elem ) {
				this.parentNode.insertBefore( elem, this );
			});
		}

		if ( arguments.length ) {
			var set = jQuery.clean( arguments );
			return this.pushStack( jQuery.merge( set, this ), "before", this.selector );
		}
	},

	after: function() {
		if ( !isDisconnected( this[0] ) ) {
			return this.domManip(arguments, false, function( elem ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			});
		}

		if ( arguments.length ) {
			var set = jQuery.clean( arguments );
			return this.pushStack( jQuery.merge( this, set ), "after", this.selector );
		}
	},

	// keepData is for internal use only--do not document
	remove: function( selector, keepData ) {
		var elem,
			i = 0;

		for ( ; (elem = this[i]) != null; i++ ) {
			if ( !selector || jQuery.filter( selector, [ elem ] ).length ) {
				if ( !keepData && elem.nodeType === 1 ) {
					jQuery.cleanData( elem.getElementsByTagName("*") );
					jQuery.cleanData( [ elem ] );
				}

				if ( elem.parentNode ) {
					elem.parentNode.removeChild( elem );
				}
			}
		}

		return this;
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; (elem = this[i]) != null; i++ ) {
			// Remove element nodes and prevent memory leaks
			if ( elem.nodeType === 1 ) {
				jQuery.cleanData( elem.getElementsByTagName("*") );
			}

			// Remove any remaining nodes
			while ( elem.firstChild ) {
				elem.removeChild( elem.firstChild );
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function () {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		});
	},

	html: function( value ) {
		return jQuery.access( this, function( value ) {
			var elem = this[0] || {},
				i = 0,
				l = this.length;

			if ( value === undefined ) {
				return elem.nodeType === 1 ?
					elem.innerHTML.replace( rinlinejQuery, "" ) :
					undefined;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				( jQuery.support.htmlSerialize || !rnoshimcache.test( value )  ) &&
				( jQuery.support.leadingWhitespace || !rleadingWhitespace.test( value ) ) &&
				!wrapMap[ ( rtagName.exec( value ) || ["", ""] )[1].toLowerCase() ] ) {

				value = value.replace( rxhtmlTag, "<$1></$2>" );

				try {
					for (; i < l; i++ ) {
						// Remove element nodes and prevent memory leaks
						elem = this[i] || {};
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( elem.getElementsByTagName( "*" ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch(e) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function( value ) {
		if ( !isDisconnected( this[0] ) ) {
			// Make sure that the elements are removed from the DOM before they are inserted
			// this can help fix replacing a parent with child elements
			if ( jQuery.isFunction( value ) ) {
				return this.each(function(i) {
					var self = jQuery(this), old = self.html();
					self.replaceWith( value.call( this, i, old ) );
				});
			}

			if ( typeof value !== "string" ) {
				value = jQuery( value ).detach();
			}

			return this.each(function() {
				var next = this.nextSibling,
					parent = this.parentNode;

				jQuery( this ).remove();

				if ( next ) {
					jQuery(next).before( value );
				} else {
					jQuery(parent).append( value );
				}
			});
		}

		return this.length ?
			this.pushStack( jQuery(jQuery.isFunction(value) ? value() : value), "replaceWith", value ) :
			this;
	},

	detach: function( selector ) {
		return this.remove( selector, true );
	},

	domManip: function( args, table, callback ) {

		// Flatten any nested arrays
		args = [].concat.apply( [], args );

		var results, first, fragment, iNoClone,
			i = 0,
			value = args[0],
			scripts = [],
			l = this.length;

		// We can't cloneNode fragments that contain checked, in WebKit
		if ( !jQuery.support.checkClone && l > 1 && typeof value === "string" && rchecked.test( value ) ) {
			return this.each(function() {
				jQuery(this).domManip( args, table, callback );
			});
		}

		if ( jQuery.isFunction(value) ) {
			return this.each(function(i) {
				var self = jQuery(this);
				args[0] = value.call( this, i, table ? self.html() : undefined );
				self.domManip( args, table, callback );
			});
		}

		if ( this[0] ) {
			results = jQuery.buildFragment( args, this, scripts );
			fragment = results.fragment;
			first = fragment.firstChild;

			if ( fragment.childNodes.length === 1 ) {
				fragment = first;
			}

			if ( first ) {
				table = table && jQuery.nodeName( first, "tr" );

				// Use the original fragment for the last item instead of the first because it can end up
				// being emptied incorrectly in certain situations (#8070).
				// Fragments from the fragment cache must always be cloned and never used in place.
				for ( iNoClone = results.cacheable || l - 1; i < l; i++ ) {
					callback.call(
						table && jQuery.nodeName( this[i], "table" ) ?
							findOrAppend( this[i], "tbody" ) :
							this[i],
						i === iNoClone ?
							fragment :
							jQuery.clone( fragment, true, true )
					);
				}
			}

			// Fix #11809: Avoid leaking memory
			fragment = first = null;

			if ( scripts.length ) {
				jQuery.each( scripts, function( i, elem ) {
					if ( elem.src ) {
						if ( jQuery.ajax ) {
							jQuery.ajax({
								url: elem.src,
								type: "GET",
								dataType: "script",
								async: false,
								global: false,
								"throws": true
							});
						} else {
							jQuery.error("no ajax");
						}
					} else {
						jQuery.globalEval( ( elem.text || elem.textContent || elem.innerHTML || "" ).replace( rcleanScript, "" ) );
					}

					if ( elem.parentNode ) {
						elem.parentNode.removeChild( elem );
					}
				});
			}
		}

		return this;
	}
});

function findOrAppend( elem, tag ) {
	return elem.getElementsByTagName( tag )[0] || elem.appendChild( elem.ownerDocument.createElement( tag ) );
}

function cloneCopyEvent( src, dest ) {

	if ( dest.nodeType !== 1 || !jQuery.hasData( src ) ) {
		return;
	}

	var type, i, l,
		oldData = jQuery._data( src ),
		curData = jQuery._data( dest, oldData ),
		events = oldData.events;

	if ( events ) {
		delete curData.handle;
		curData.events = {};

		for ( type in events ) {
			for ( i = 0, l = events[ type ].length; i < l; i++ ) {
				jQuery.event.add( dest, type, events[ type ][ i ] );
			}
		}
	}

	// make the cloned public data object a copy from the original
	if ( curData.data ) {
		curData.data = jQuery.extend( {}, curData.data );
	}
}

function cloneFixAttributes( src, dest ) {
	var nodeName;

	// We do not need to do anything for non-Elements
	if ( dest.nodeType !== 1 ) {
		return;
	}

	// clearAttributes removes the attributes, which we don't want,
	// but also removes the attachEvent events, which we *do* want
	if ( dest.clearAttributes ) {
		dest.clearAttributes();
	}

	// mergeAttributes, in contrast, only merges back on the
	// original attributes, not the events
	if ( dest.mergeAttributes ) {
		dest.mergeAttributes( src );
	}

	nodeName = dest.nodeName.toLowerCase();

	if ( nodeName === "object" ) {
		// IE6-10 improperly clones children of object elements using classid.
		// IE10 throws NoModificationAllowedError if parent is null, #12132.
		if ( dest.parentNode ) {
			dest.outerHTML = src.outerHTML;
		}

		// This path appears unavoidable for IE9. When cloning an object
		// element in IE9, the outerHTML strategy above is not sufficient.
		// If the src has innerHTML and the destination does not,
		// copy the src.innerHTML into the dest.innerHTML. #10324
		if ( jQuery.support.html5Clone && (src.innerHTML && !jQuery.trim(dest.innerHTML)) ) {
			dest.innerHTML = src.innerHTML;
		}

	} else if ( nodeName === "input" && rcheckableType.test( src.type ) ) {
		// IE6-8 fails to persist the checked state of a cloned checkbox
		// or radio button. Worse, IE6-7 fail to give the cloned element
		// a checked appearance if the defaultChecked value isn't also set

		dest.defaultChecked = dest.checked = src.checked;

		// IE6-7 get confused and end up setting the value of a cloned
		// checkbox/radio button to an empty string instead of "on"
		if ( dest.value !== src.value ) {
			dest.value = src.value;
		}

	// IE6-8 fails to return the selected option to the default selected
	// state when cloning options
	} else if ( nodeName === "option" ) {
		dest.selected = src.defaultSelected;

	// IE6-8 fails to set the defaultValue to the correct value when
	// cloning other types of input fields
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;

	// IE blanks contents when cloning scripts
	} else if ( nodeName === "script" && dest.text !== src.text ) {
		dest.text = src.text;
	}

	// Event data gets referenced instead of copied if the expando
	// gets copied too
	dest.removeAttribute( jQuery.expando );
}

jQuery.buildFragment = function( args, context, scripts ) {
	var fragment, cacheable, cachehit,
		first = args[ 0 ];

	// Set context from what may come in as undefined or a jQuery collection or a node
	context = context || document;
	context = (context[0] || context).ownerDocument || context[0] || context;

	// Ensure that an attr object doesn't incorrectly stand in as a document object
	// Chrome and Firefox seem to allow this to occur and will throw exception
	// Fixes #8950
	if ( typeof context.createDocumentFragment === "undefined" ) {
		context = document;
	}

	// Only cache "small" (1/2 KB) HTML strings that are associated with the main document
	// Cloning options loses the selected state, so don't cache them
	// IE 6 doesn't like it when you put <object> or <embed> elements in a fragment
	// Also, WebKit does not clone 'checked' attributes on cloneNode, so don't cache
	// Lastly, IE6,7,8 will not correctly reuse cached fragments that were created from unknown elems #10501
	if ( args.length === 1 && typeof first === "string" && first.length < 512 && context === document &&
		first.charAt(0) === "<" && !rnocache.test( first ) &&
		(jQuery.support.checkClone || !rchecked.test( first )) &&
		(jQuery.support.html5Clone || !rnoshimcache.test( first )) ) {

		// Mark cacheable and look for a hit
		cacheable = true;
		fragment = jQuery.fragments[ first ];
		cachehit = fragment !== undefined;
	}

	if ( !fragment ) {
		fragment = context.createDocumentFragment();
		jQuery.clean( args, context, fragment, scripts );

		// Update the cache, but only store false
		// unless this is a second parsing of the same content
		if ( cacheable ) {
			jQuery.fragments[ first ] = cachehit && fragment;
		}
	}

	return { fragment: fragment, cacheable: cacheable };
};

jQuery.fragments = {};

jQuery.each({
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			i = 0,
			ret = [],
			insert = jQuery( selector ),
			l = insert.length,
			parent = this.length === 1 && this[0].parentNode;

		if ( (parent == null || parent && parent.nodeType === 11 && parent.childNodes.length === 1) && l === 1 ) {
			insert[ original ]( this[0] );
			return this;
		} else {
			for ( ; i < l; i++ ) {
				elems = ( i > 0 ? this.clone(true) : this ).get();
				jQuery( insert[i] )[ original ]( elems );
				ret = ret.concat( elems );
			}

			return this.pushStack( ret, name, insert.selector );
		}
	};
});

function getAll( elem ) {
	if ( typeof elem.getElementsByTagName !== "undefined" ) {
		return elem.getElementsByTagName( "*" );

	} else if ( typeof elem.querySelectorAll !== "undefined" ) {
		return elem.querySelectorAll( "*" );

	} else {
		return [];
	}
}

// Used in clean, fixes the defaultChecked property
function fixDefaultChecked( elem ) {
	if ( rcheckableType.test( elem.type ) ) {
		elem.defaultChecked = elem.checked;
	}
}

jQuery.extend({
	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var srcElements,
			destElements,
			i,
			clone;

		if ( jQuery.support.html5Clone || jQuery.isXMLDoc(elem) || !rnoshimcache.test( "<" + elem.nodeName + ">" ) ) {
			clone = elem.cloneNode( true );

		// IE<=8 does not properly clone detached, unknown element nodes
		} else {
			fragmentDiv.innerHTML = elem.outerHTML;
			fragmentDiv.removeChild( clone = fragmentDiv.firstChild );
		}

		if ( (!jQuery.support.noCloneEvent || !jQuery.support.noCloneChecked) &&
				(elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem) ) {
			// IE copies events bound via attachEvent when using cloneNode.
			// Calling detachEvent on the clone will also remove the events
			// from the original. In order to get around this, we use some
			// proprietary methods to clear the events. Thanks to MooTools
			// guys for this hotness.

			cloneFixAttributes( elem, clone );

			// Using Sizzle here is crazy slow, so we use getElementsByTagName instead
			srcElements = getAll( elem );
			destElements = getAll( clone );

			// Weird iteration because IE will replace the length property
			// with an element if you are cloning the body and one of the
			// elements on the page has a name or id of "length"
			for ( i = 0; srcElements[i]; ++i ) {
				// Ensure that the destination node is not null; Fixes #9587
				if ( destElements[i] ) {
					cloneFixAttributes( srcElements[i], destElements[i] );
				}
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			cloneCopyEvent( elem, clone );

			if ( deepDataAndEvents ) {
				srcElements = getAll( elem );
				destElements = getAll( clone );

				for ( i = 0; srcElements[i]; ++i ) {
					cloneCopyEvent( srcElements[i], destElements[i] );
				}
			}
		}

		srcElements = destElements = null;

		// Return the cloned set
		return clone;
	},

	clean: function( elems, context, fragment, scripts ) {
		var j, safe, elem, tag, wrap, depth, div, hasBody, tbody, len, handleScript, jsTags,
			i = 0,
			ret = [];

		// Ensure that context is a document
		if ( !context || typeof context.createDocumentFragment === "undefined" ) {
			context = document;
		}

		// Use the already-created safe fragment if context permits
		for ( safe = context === document && safeFragment; (elem = elems[i]) != null; i++ ) {
			if ( typeof elem === "number" ) {
				elem += "";
			}

			if ( !elem ) {
				continue;
			}

			// Convert html string into DOM nodes
			if ( typeof elem === "string" ) {
				if ( !rhtml.test( elem ) ) {
					elem = context.createTextNode( elem );
				} else {
					// Ensure a safe container in which to render the html
					safe = safe || createSafeFragment( context );
					div = div || safe.appendChild( context.createElement("div") );

					// Fix "XHTML"-style tags in all browsers
					elem = elem.replace(rxhtmlTag, "<$1></$2>");

					// Go to html and back, then peel off extra wrappers
					tag = ( rtagName.exec( elem ) || ["", ""] )[1].toLowerCase();
					wrap = wrapMap[ tag ] || wrapMap._default;
					depth = wrap[0];
					div.innerHTML = wrap[1] + elem + wrap[2];

					// Move to the right depth
					while ( depth-- ) {
						div = div.lastChild;
					}

					// Remove IE's autoinserted <tbody> from table fragments
					if ( !jQuery.support.tbody ) {

						// String was a <table>, *may* have spurious <tbody>
						hasBody = rtbody.test(elem);
							tbody = tag === "table" && !hasBody ?
								div.firstChild && div.firstChild.childNodes :

								// String was a bare <thead> or <tfoot>
								wrap[1] === "<table>" && !hasBody ?
									div.childNodes :
									[];

						for ( j = tbody.length - 1; j >= 0 ; --j ) {
							if ( jQuery.nodeName( tbody[ j ], "tbody" ) && !tbody[ j ].childNodes.length ) {
								tbody[ j ].parentNode.removeChild( tbody[ j ] );
							}
						}
					}

					// IE completely kills leading whitespace when innerHTML is used
					if ( !jQuery.support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
						div.insertBefore( context.createTextNode( rleadingWhitespace.exec(elem)[0] ), div.firstChild );
					}

					elem = div.childNodes;

					// Remember the top-level container for proper cleanup
					div = safe.lastChild;
				}
			}

			if ( elem.nodeType ) {
				ret.push( elem );
			} else {
				ret = jQuery.merge( ret, elem );
			}
		}

		// Fix #11356: Clear elements from safeFragment
		if ( div ) {
			safe.removeChild( div );
			elem = div = safe = null;
		}

		// Reset defaultChecked for any radios and checkboxes
		// about to be appended to the DOM in IE 6/7 (#8060)
		if ( !jQuery.support.appendChecked ) {
			for ( i = 0; (elem = ret[i]) != null; i++ ) {
				if ( jQuery.nodeName( elem, "input" ) ) {
					fixDefaultChecked( elem );
				} else if ( typeof elem.getElementsByTagName !== "undefined" ) {
					jQuery.grep( elem.getElementsByTagName("input"), fixDefaultChecked );
				}
			}
		}

		// Append elements to a provided document fragment
		if ( fragment ) {
			// Special handling of each script element
			handleScript = function( elem ) {
				// Check if we consider it executable
				if ( !elem.type || rscriptType.test( elem.type ) ) {
					// Detach the script and store it in the scripts array (if provided) or the fragment
					// Return truthy to indicate that it has been handled
					return scripts ?
						scripts.push( elem.parentNode ? elem.parentNode.removeChild( elem ) : elem ) :
						fragment.appendChild( elem );
				}
			};

			for ( i = 0; (elem = ret[i]) != null; i++ ) {
				// Check if we're done after handling an executable script
				if ( !( jQuery.nodeName( elem, "script" ) && handleScript( elem ) ) ) {
					// Append to fragment and handle embedded scripts
					fragment.appendChild( elem );
					if ( typeof elem.getElementsByTagName !== "undefined" ) {
						// handleScript alters the DOM, so use jQuery.merge to ensure snapshot iteration
						jsTags = jQuery.grep( jQuery.merge( [], elem.getElementsByTagName("script") ), handleScript );

						// Splice the scripts into ret after their former ancestor and advance our index beyond them
						ret.splice.apply( ret, [i + 1, 0].concat( jsTags ) );
						i += jsTags.length;
					}
				}
			}
		}

		return ret;
	},

	cleanData: function( elems, /* internal */ acceptData ) {
		var data, id, elem, type,
			i = 0,
			internalKey = jQuery.expando,
			cache = jQuery.cache,
			deleteExpando = jQuery.support.deleteExpando,
			special = jQuery.event.special;

		for ( ; (elem = elems[i]) != null; i++ ) {

			if ( acceptData || jQuery.acceptData( elem ) ) {

				id = elem[ internalKey ];
				data = id && cache[ id ];

				if ( data ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}

					// Remove cache only if it was not already removed by jQuery.event.remove
					if ( cache[ id ] ) {

						delete cache[ id ];

						// IE does not allow us to delete expando properties from nodes,
						// nor does it have a removeAttribute function on Document nodes;
						// we must handle all of these cases
						if ( deleteExpando ) {
							delete elem[ internalKey ];

						} else if ( elem.removeAttribute ) {
							elem.removeAttribute( internalKey );

						} else {
							elem[ internalKey ] = null;
						}

						jQuery.deletedIds.push( id );
					}
				}
			}
		}
	}
});
// Limit scope pollution from any deprecated API
(function() {

var matched, browser;

// Use of jQuery.browser is frowned upon.
// More details: http://api.jquery.com/jQuery.browser
// jQuery.uaMatch maintained for back-compat
jQuery.uaMatch = function( ua ) {
	ua = ua.toLowerCase();

	var match = /(chrome)[ \/]([\w.]+)/.exec( ua ) ||
		/(webkit)[ \/]([\w.]+)/.exec( ua ) ||
		/(opera)(?:.*version|)[ \/]([\w.]+)/.exec( ua ) ||
		/(msie) ([\w.]+)/.exec( ua ) ||
		ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec( ua ) ||
		[];

	return {
		browser: match[ 1 ] || "",
		version: match[ 2 ] || "0"
	};
};

matched = jQuery.uaMatch( navigator.userAgent );
browser = {};

if ( matched.browser ) {
	browser[ matched.browser ] = true;
	browser.version = matched.version;
}

// Deprecated, use jQuery.browser.webkit instead
// Maintained for back-compat only
if ( browser.webkit ) {
	browser.safari = true;
}

jQuery.browser = browser;

jQuery.sub = function() {
	function jQuerySub( selector, context ) {
		return new jQuerySub.fn.init( selector, context );
	}
	jQuery.extend( true, jQuerySub, this );
	jQuerySub.superclass = this;
	jQuerySub.fn = jQuerySub.prototype = this();
	jQuerySub.fn.constructor = jQuerySub;
	jQuerySub.sub = this.sub;
	jQuerySub.fn.init = function init( selector, context ) {
		if ( context && context instanceof jQuery && !(context instanceof jQuerySub) ) {
			context = jQuerySub( context );
		}

		return jQuery.fn.init.call( this, selector, context, rootjQuerySub );
	};
	jQuerySub.fn.init.prototype = jQuerySub.fn;
	var rootjQuerySub = jQuerySub(document);
	return jQuerySub;
};
	
})();
var curCSS, iframe, iframeDoc,
	ralpha = /alpha\([^)]*\)/i,
	ropacity = /opacity=([^)]*)/,
	rposition = /^(top|right|bottom|left)$/,
	rmargin = /^margin/,
	rnumsplit = new RegExp( "^(" + core_pnum + ")(.*)$", "i" ),
	rnumnonpx = new RegExp( "^(" + core_pnum + ")(?!px)[a-z%]+$", "i" ),
	rrelNum = new RegExp( "^([-+])=(" + core_pnum + ")", "i" ),
	elemdisplay = {},

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: 0,
		fontWeight: 400,
		lineHeight: 1
	},

	cssExpand = [ "Top", "Right", "Bottom", "Left" ],
	cssPrefixes = [ "Webkit", "O", "Moz", "ms" ],

	eventsToggle = jQuery.fn.toggle;

// return a css property mapped to a potentially vendor prefixed property
function vendorPropName( style, name ) {

	// shortcut for names that are not vendor prefixed
	if ( name in style ) {
		return name;
	}

	// check for vendor prefixed names
	var capName = name.charAt(0).toUpperCase() + name.slice(1),
		origName = name,
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in style ) {
			return name;
		}
	}

	return origName;
}

function isHidden( elem, el ) {
	elem = el || elem;
	return jQuery.css( elem, "display" ) === "none" || !jQuery.contains( elem.ownerDocument, elem );
}

function showHide( elements, show ) {
	var elem, display,
		values = [],
		index = 0,
		length = elements.length;

	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}
		values[ index ] = jQuery._data( elem, "olddisplay" );
		if ( show ) {
			// Reset the inline display of this element to learn if it is
			// being hidden by cascaded rules or not
			if ( !values[ index ] && elem.style.display === "none" ) {
				elem.style.display = "";
			}

			// Set elements which have been overridden with display: none
			// in a stylesheet to whatever the default browser style is
			// for such an element
			if ( elem.style.display === "" && isHidden( elem ) ) {
				values[ index ] = jQuery._data( elem, "olddisplay", css_defaultDisplay(elem.nodeName) );
			}
		} else {
			display = curCSS( elem, "display" );

			if ( !values[ index ] && display !== "none" ) {
				jQuery._data( elem, "olddisplay", display );
			}
		}
	}

	// Set the display of most of the elements in a second loop
	// to avoid the constant reflow
	for ( index = 0; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}
		if ( !show || elem.style.display === "none" || elem.style.display === "" ) {
			elem.style.display = show ? values[ index ] || "" : "none";
		}
	}

	return elements;
}

jQuery.fn.extend({
	css: function( name, value ) {
		return jQuery.access( this, function( elem, name, value ) {
			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	},
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state, fn2 ) {
		var bool = typeof state === "boolean";

		if ( jQuery.isFunction( state ) && jQuery.isFunction( fn2 ) ) {
			return eventsToggle.apply( this, arguments );
		}

		return this.each(function() {
			if ( bool ? state : isHidden( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		});
	}
});

jQuery.extend({
	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {
					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;

				}
			}
		}
	},

	// Exclude the following css properties to add px
	cssNumber: {
		"fillOpacity": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		// normalize float css property
		"float": jQuery.support.cssFloat ? "cssFloat" : "styleFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {
		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = jQuery.camelCase( name ),
			style = elem.style;

		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// convert relative number strings (+= or -=) to relative numbers. #7345
			if ( type === "string" && (ret = rrelNum.exec( value )) ) {
				value = ( ret[1] + 1 ) * ret[2] + parseFloat( jQuery.css( elem, name ) );
				// Fixes bug #9237
				type = "number";
			}

			// Make sure that NaN and null values aren't set. See: #7116
			if ( value == null || type === "number" && isNaN( value ) ) {
				return;
			}

			// If a number was passed in, add 'px' to the (except for certain CSS properties)
			if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
				value += "px";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value, extra )) !== undefined ) {
				// Wrapped to prevent IE from throwing errors when 'invalid' values are provided
				// Fixes bug #5509
				try {
					style[ name ] = value;
				} catch(e) {}
			}

		} else {
			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, numeric, extra ) {
		var val, num, hooks,
			origName = jQuery.camelCase( name );

		// Make sure that we're working with the right name
		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( elem.style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name );
		}

		//convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Return, converting to number if forced or a qualifier was provided and val looks numeric
		if ( numeric || extra !== undefined ) {
			num = parseFloat( val );
			return numeric || jQuery.isNumeric( num ) ? num || 0 : val;
		}
		return val;
	},

	// A method for quickly swapping in/out CSS properties to get correct calculations
	swap: function( elem, options, callback ) {
		var ret, name,
			old = {};

		// Remember the old values, and insert the new ones
		for ( name in options ) {
			old[ name ] = elem.style[ name ];
			elem.style[ name ] = options[ name ];
		}

		ret = callback.call( elem );

		// Revert the old values
		for ( name in options ) {
			elem.style[ name ] = old[ name ];
		}

		return ret;
	}
});

// NOTE: To any future maintainer, we've used both window.getComputedStyle
// and getComputedStyle here to produce a better gzip size
if ( window.getComputedStyle ) {
	curCSS = function( elem, name ) {
		var ret, width, minWidth, maxWidth,
			computed = getComputedStyle( elem, null ),
			style = elem.style;

		if ( computed ) {

			ret = computed[ name ];
			if ( ret === "" && !jQuery.contains( elem.ownerDocument.documentElement, elem ) ) {
				ret = jQuery.style( elem, name );
			}

			// A tribute to the "awesome hack by Dean Edwards"
			// Chrome < 17 and Safari 5.0 uses "computed value" instead of "used value" for margin-right
			// Safari 5.1.7 (at least) returns percentage for a larger set of values, but width seems to be reliably pixels
			// this is against the CSSOM draft spec: http://dev.w3.org/csswg/cssom/#resolved-values
			if ( rnumnonpx.test( ret ) && rmargin.test( name ) ) {
				width = style.width;
				minWidth = style.minWidth;
				maxWidth = style.maxWidth;

				style.minWidth = style.maxWidth = style.width = ret;
				ret = computed.width;

				style.width = width;
				style.minWidth = minWidth;
				style.maxWidth = maxWidth;
			}
		}

		return ret;
	};
} else if ( document.documentElement.currentStyle ) {
	curCSS = function( elem, name ) {
		var left, rsLeft,
			ret = elem.currentStyle && elem.currentStyle[ name ],
			style = elem.style;

		// Avoid setting ret to empty string here
		// so we don't default to auto
		if ( ret == null && style && style[ name ] ) {
			ret = style[ name ];
		}

		// From the awesome hack by Dean Edwards
		// http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

		// If we're not dealing with a regular pixel number
		// but a number that has a weird ending, we need to convert it to pixels
		// but not position css attributes, as those are proportional to the parent element instead
		// and we can't measure the parent instead because it might trigger a "stacking dolls" problem
		if ( rnumnonpx.test( ret ) && !rposition.test( name ) ) {

			// Remember the original values
			left = style.left;
			rsLeft = elem.runtimeStyle && elem.runtimeStyle.left;

			// Put in the new values to get a computed value out
			if ( rsLeft ) {
				elem.runtimeStyle.left = elem.currentStyle.left;
			}
			style.left = name === "fontSize" ? "1em" : ret;
			ret = style.pixelLeft + "px";

			// Revert the changed values
			style.left = left;
			if ( rsLeft ) {
				elem.runtimeStyle.left = rsLeft;
			}
		}

		return ret === "" ? "auto" : ret;
	};
}

function setPositiveNumber( elem, value, subtract ) {
	var matches = rnumsplit.exec( value );
	return matches ?
			Math.max( 0, matches[ 1 ] - ( subtract || 0 ) ) + ( matches[ 2 ] || "px" ) :
			value;
}

function augmentWidthOrHeight( elem, name, extra, isBorderBox ) {
	var i = extra === ( isBorderBox ? "border" : "content" ) ?
		// If we already have the right measurement, avoid augmentation
		4 :
		// Otherwise initialize for horizontal or vertical properties
		name === "width" ? 1 : 0,

		val = 0;

	for ( ; i < 4; i += 2 ) {
		// both box models exclude margin, so add it if we want it
		if ( extra === "margin" ) {
			// we use jQuery.css instead of curCSS here
			// because of the reliableMarginRight CSS hook!
			val += jQuery.css( elem, extra + cssExpand[ i ], true );
		}

		// From this point on we use curCSS for maximum performance (relevant in animations)
		if ( isBorderBox ) {
			// border-box includes padding, so remove it if we want content
			if ( extra === "content" ) {
				val -= parseFloat( curCSS( elem, "padding" + cssExpand[ i ] ) ) || 0;
			}

			// at this point, extra isn't border nor margin, so remove border
			if ( extra !== "margin" ) {
				val -= parseFloat( curCSS( elem, "border" + cssExpand[ i ] + "Width" ) ) || 0;
			}
		} else {
			// at this point, extra isn't content, so add padding
			val += parseFloat( curCSS( elem, "padding" + cssExpand[ i ] ) ) || 0;

			// at this point, extra isn't content nor padding, so add border
			if ( extra !== "padding" ) {
				val += parseFloat( curCSS( elem, "border" + cssExpand[ i ] + "Width" ) ) || 0;
			}
		}
	}

	return val;
}

function getWidthOrHeight( elem, name, extra ) {

	// Start with offset property, which is equivalent to the border-box value
	var val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
		valueIsBorderBox = true,
		isBorderBox = jQuery.support.boxSizing && jQuery.css( elem, "boxSizing" ) === "border-box";

	if ( val <= 0 ) {
		// Fall back to computed then uncomputed css if necessary
		val = curCSS( elem, name );
		if ( val < 0 || val == null ) {
			val = elem.style[ name ];
		}

		// Computed unit is not pixels. Stop here and return.
		if ( rnumnonpx.test(val) ) {
			return val;
		}

		// we need the check for style in case a browser which returns unreliable values
		// for getComputedStyle silently falls back to the reliable elem.style
		valueIsBorderBox = isBorderBox && ( jQuery.support.boxSizingReliable || val === elem.style[ name ] );

		// Normalize "", auto, and prepare for extra
		val = parseFloat( val ) || 0;
	}

	// use the active box-sizing model to add/subtract irrelevant styles
	return ( val +
		augmentWidthOrHeight(
			elem,
			name,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox
		)
	) + "px";
}


// Try to determine the default display value of an element
function css_defaultDisplay( nodeName ) {
	if ( elemdisplay[ nodeName ] ) {
		return elemdisplay[ nodeName ];
	}

	var elem = jQuery( "<" + nodeName + ">" ).appendTo( document.body ),
		display = elem.css("display");
	elem.remove();

	// If the simple way fails,
	// get element's real default display by attaching it to a temp iframe
	if ( display === "none" || display === "" ) {
		// Use the already-created iframe if possible
		iframe = document.body.appendChild(
			iframe || jQuery.extend( document.createElement("iframe"), {
				frameBorder: 0,
				width: 0,
				height: 0
			})
		);

		// Create a cacheable copy of the iframe document on first call.
		// IE and Opera will allow us to reuse the iframeDoc without re-writing the fake HTML
		// document to it; WebKit & Firefox won't allow reusing the iframe document.
		if ( !iframeDoc || !iframe.createElement ) {
			iframeDoc = ( iframe.contentWindow || iframe.contentDocument ).document;
			iframeDoc.write("<!doctype html><html><body>");
			iframeDoc.close();
		}

		elem = iframeDoc.body.appendChild( iframeDoc.createElement(nodeName) );

		display = curCSS( elem, "display" );
		document.body.removeChild( iframe );
	}

	// Store the correct default display
	elemdisplay[ nodeName ] = display;

	return display;
}

jQuery.each([ "height", "width" ], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {
				if ( elem.offsetWidth !== 0 || curCSS( elem, "display" ) !== "none" ) {
					return getWidthOrHeight( elem, name, extra );
				} else {
					return jQuery.swap( elem, cssShow, function() {
						return getWidthOrHeight( elem, name, extra );
					});
				}
			}
		},

		set: function( elem, value, extra ) {
			return setPositiveNumber( elem, value, extra ?
				augmentWidthOrHeight(
					elem,
					name,
					extra,
					jQuery.support.boxSizing && jQuery.css( elem, "boxSizing" ) === "border-box"
				) : 0
			);
		}
	};
});

if ( !jQuery.support.opacity ) {
	jQuery.cssHooks.opacity = {
		get: function( elem, computed ) {
			// IE uses filters for opacity
			return ropacity.test( (computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "" ) ?
				( 0.01 * parseFloat( RegExp.$1 ) ) + "" :
				computed ? "1" : "";
		},

		set: function( elem, value ) {
			var style = elem.style,
				currentStyle = elem.currentStyle,
				opacity = jQuery.isNumeric( value ) ? "alpha(opacity=" + value * 100 + ")" : "",
				filter = currentStyle && currentStyle.filter || style.filter || "";

			// IE has trouble with opacity if it does not have layout
			// Force it by setting the zoom level
			style.zoom = 1;

			// if setting opacity to 1, and no other filters exist - attempt to remove filter attribute #6652
			if ( value >= 1 && jQuery.trim( filter.replace( ralpha, "" ) ) === "" &&
				style.removeAttribute ) {

				// Setting style.filter to null, "" & " " still leave "filter:" in the cssText
				// if "filter:" is present at all, clearType is disabled, we want to avoid this
				// style.removeAttribute is IE Only, but so apparently is this code path...
				style.removeAttribute( "filter" );

				// if there there is no filter style applied in a css rule, we are done
				if ( currentStyle && !currentStyle.filter ) {
					return;
				}
			}

			// otherwise, set new filter values
			style.filter = ralpha.test( filter ) ?
				filter.replace( ralpha, opacity ) :
				filter + " " + opacity;
		}
	};
}

// These hooks cannot be added until DOM ready because the support test
// for it is not run until after DOM ready
jQuery(function() {
	if ( !jQuery.support.reliableMarginRight ) {
		jQuery.cssHooks.marginRight = {
			get: function( elem, computed ) {
				// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
				// Work around by temporarily setting element display to inline-block
				return jQuery.swap( elem, { "display": "inline-block" }, function() {
					if ( computed ) {
						return curCSS( elem, "marginRight" );
					}
				});
			}
		};
	}

	// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
	// getComputedStyle returns percent when specified for top/left/bottom/right
	// rather than make the css module depend on the offset module, we just check for it here
	if ( !jQuery.support.pixelPosition && jQuery.fn.position ) {
		jQuery.each( [ "top", "left" ], function( i, prop ) {
			jQuery.cssHooks[ prop ] = {
				get: function( elem, computed ) {
					if ( computed ) {
						var ret = curCSS( elem, prop );
						// if curCSS returns percentage, fallback to offset
						return rnumnonpx.test( ret ) ? jQuery( elem ).position()[ prop ] + "px" : ret;
					}
				}
			};
		});
	}

});

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.hidden = function( elem ) {
		return ( elem.offsetWidth === 0 && elem.offsetHeight === 0 ) || (!jQuery.support.reliableHiddenOffsets && ((elem.style && elem.style.display) || curCSS( elem, "display" )) === "none");
	};

	jQuery.expr.filters.visible = function( elem ) {
		return !jQuery.expr.filters.hidden( elem );
	};
}

// These hooks are used by animate to expand properties
jQuery.each({
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i,

				// assumes a single number if not a string
				parts = typeof value === "string" ? value.split(" ") : [ value ],
				expanded = {};

			for ( i = 0; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( !rmargin.test( prefix ) ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
});
var r20 = /%20/g,
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rinput = /^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,
	rselectTextarea = /^(?:select|textarea)/i;

jQuery.fn.extend({
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map(function(){
			return this.elements ? jQuery.makeArray( this.elements ) : this;
		})
		.filter(function(){
			return this.name && !this.disabled &&
				( this.checked || rselectTextarea.test( this.nodeName ) ||
					rinput.test( this.type ) );
		})
		.map(function( i, elem ){
			var val = jQuery( this ).val();

			return val == null ?
				null :
				jQuery.isArray( val ) ?
					jQuery.map( val, function( val, i ){
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					}) :
					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		}).get();
	}
});

//Serialize an array of form elements or a set of
//key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, value ) {
			// If value is a function, invoke it and return its value
			value = jQuery.isFunction( value ) ? value() : ( value == null ? "" : value );
			s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
		};

	// Set traditional to true for jQuery <= 1.3.2 behavior.
	if ( traditional === undefined ) {
		traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
	}

	// If an array was passed in, assume that it is an array of form elements.
	if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		});

	} else {
		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" ).replace( r20, "+" );
};

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( jQuery.isArray( obj ) ) {
		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {
				// Treat each array item as a scalar.
				add( prefix, v );

			} else {
				// If array item is non-scalar (array or object), encode its
				// numeric index to resolve deserialization ambiguity issues.
				// Note that rack (as of 1.0.0) can't currently deserialize
				// nested arrays properly, and attempting to do so may cause
				// a server error. Possible fixes are to modify rack's
				// deserialization algorithm or to provide an option or flag
				// to force array serialization to be shallow.
				buildParams( prefix + "[" + ( typeof v === "object" ? i : "" ) + "]", v, traditional, add );
			}
		});

	} else if ( !traditional && jQuery.type( obj ) === "object" ) {
		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {
		// Serialize scalar item.
		add( prefix, obj );
	}
}
var // Document location
	ajaxLocation,
	// Document location segments
	ajaxLocParts,

	rhash = /#.*$/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, // IE leaves an \r character at EOL
	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,
	rquery = /\?/,
	rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
	rts = /([?&])_=[^&]*/,
	rurl = /^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,

	// Keep a copy of the old load method
	_load = jQuery.fn.load,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = ["*/"] + ["*"];

// #8138, IE may throw an exception when accessing
// a field from window.location if document.domain has been set
try {
	ajaxLocation = location.href;
} catch( e ) {
	// Use the href attribute of an A element
	// since IE will modify it given document.location
	ajaxLocation = document.createElement( "a" );
	ajaxLocation.href = "";
	ajaxLocation = ajaxLocation.href;
}

// Segment location into parts
ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType, list, placeBefore,
			dataTypes = dataTypeExpression.toLowerCase().split( core_rspace ),
			i = 0,
			length = dataTypes.length;

		if ( jQuery.isFunction( func ) ) {
			// For each dataType in the dataTypeExpression
			for ( ; i < length; i++ ) {
				dataType = dataTypes[ i ];
				// We control if we're asked to add before
				// any existing element
				placeBefore = /^\+/.test( dataType );
				if ( placeBefore ) {
					dataType = dataType.substr( 1 ) || "*";
				}
				list = structure[ dataType ] = structure[ dataType ] || [];
				// then we add to the structure accordingly
				list[ placeBefore ? "unshift" : "push" ]( func );
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR,
		dataType /* internal */, inspected /* internal */ ) {

	dataType = dataType || options.dataTypes[ 0 ];
	inspected = inspected || {};

	inspected[ dataType ] = true;

	var selection,
		list = structure[ dataType ],
		i = 0,
		length = list ? list.length : 0,
		executeOnly = ( structure === prefilters );

	for ( ; i < length && ( executeOnly || !selection ); i++ ) {
		selection = list[ i ]( options, originalOptions, jqXHR );
		// If we got redirected to another dataType
		// we try there if executing only and not done already
		if ( typeof selection === "string" ) {
			if ( !executeOnly || inspected[ selection ] ) {
				selection = undefined;
			} else {
				options.dataTypes.unshift( selection );
				selection = inspectPrefiltersOrTransports(
						structure, options, originalOptions, jqXHR, selection, inspected );
			}
		}
	}
	// If we're only executing or nothing was selected
	// we try the catchall dataType if not done already
	if ( ( executeOnly || !selection ) && !inspected[ "*" ] ) {
		selection = inspectPrefiltersOrTransports(
				structure, options, originalOptions, jqXHR, "*", inspected );
	}
	// unnecessary when only executing (prefilters)
	// but it'll be ignored by the caller in that case
	return selection;
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var key, deep,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};
	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || ( deep = {} ) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}
}

jQuery.fn.load = function( url, params, callback ) {
	if ( typeof url !== "string" && _load ) {
		return _load.apply( this, arguments );
	}

	// Don't do a request if no elements are being requested
	if ( !this.length ) {
		return this;
	}

	var selector, type, response,
		self = this,
		off = url.indexOf(" ");

	if ( off >= 0 ) {
		selector = url.slice( off, url.length );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( jQuery.isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( typeof params === "object" ) {
		type = "POST";
	}

	// Request the remote document
	jQuery.ajax({
		url: url,

		// if "type" variable is undefined, then "GET" method will be used
		type: type,
		dataType: "html",
		data: params,
		complete: function( jqXHR, status ) {
			if ( callback ) {
				self.each( callback, response || [ jqXHR.responseText, status, jqXHR ] );
			}
		}
	}).done(function( responseText ) {

		// Save response for use in complete callback
		response = arguments;

		// See if a selector was specified
		self.html( selector ?

			// Create a dummy div to hold the results
			jQuery("<div>")

				// inject the contents of the document in, removing the scripts
				// to avoid any 'Permission Denied' errors in IE
				.append( responseText.replace( rscript, "" ) )

				// Locate the specified elements
				.find( selector ) :

			// If not, just inject the full result
			responseText );

	});

	return this;
};

// Attach a bunch of functions for handling common AJAX events
jQuery.each( "ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split( " " ), function( i, o ){
	jQuery.fn[ o ] = function( f ){
		return this.on( o, f );
	};
});

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {
		// shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		return jQuery.ajax({
			type: method,
			url: url,
			data: data,
			success: callback,
			dataType: type
		});
	};
});

jQuery.extend({

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		if ( settings ) {
			// Building a settings object
			ajaxExtend( target, jQuery.ajaxSettings );
		} else {
			// Extending ajaxSettings
			settings = target;
			target = jQuery.ajaxSettings;
		}
		ajaxExtend( target, settings );
		return target;
	},

	ajaxSettings: {
		url: ajaxLocation,
		isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
		global: true,
		type: "GET",
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		processData: true,
		async: true,
		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			xml: "application/xml, text/xml",
			html: "text/html",
			text: "text/plain",
			json: "application/json, text/javascript",
			"*": allTypes
		},

		contents: {
			xml: /xml/,
			html: /html/,
			json: /json/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText"
		},

		// List of data converters
		// 1) key format is "source_type destination_type" (a single space in-between)
		// 2) the catchall symbol "*" can be used for source_type
		converters: {

			// Convert anything to text
			"* text": window.String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": jQuery.parseJSON,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			context: true,
			url: true
		}
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var // ifModified key
			ifModifiedKey,
			// Response headers
			responseHeadersString,
			responseHeaders,
			// transport
			transport,
			// timeout handle
			timeoutTimer,
			// Cross-domain detection vars
			parts,
			// To know if global events are to be dispatched
			fireGlobals,
			// Loop variable
			i,
			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),
			// Callbacks context
			callbackContext = s.context || s,
			// Context for global events
			// It's the callbackContext if one was provided in the options
			// and if it's a DOM node or a jQuery collection
			globalEventContext = callbackContext !== s &&
				( callbackContext.nodeType || callbackContext instanceof jQuery ) ?
						jQuery( callbackContext ) : jQuery.event,
			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks( "once memory" ),
			// Status-dependent callbacks
			statusCode = s.statusCode || {},
			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},
			// The jqXHR state
			state = 0,
			// Default abort message
			strAbort = "canceled",
			// Fake xhr
			jqXHR = {

				readyState: 0,

				// Caches the header
				setRequestHeader: function( name, value ) {
					if ( !state ) {
						var lname = name.toLowerCase();
						name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return state === 2 ? responseHeadersString : null;
				},

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( state === 2 ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while( ( match = rheaders.exec( responseHeadersString ) ) ) {
								responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match === undefined ? null : match;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( !state ) {
						s.mimeType = type;
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					statusText = statusText || strAbort;
					if ( transport ) {
						transport.abort( statusText );
					}
					done( 0, statusText );
					return this;
				}
			};

		// Callback for when everything is done
		// It is defined here because jslint complains if it is declared
		// at the end of the function (which would be more logical and readable)
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Called once
			if ( state === 2 ) {
				return;
			}

			// State is "done" now
			state = 2;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// If successful, handle type chaining
			if ( status >= 200 && status < 300 || status === 304 ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {

					modified = jqXHR.getResponseHeader("Last-Modified");
					if ( modified ) {
						jQuery.lastModified[ ifModifiedKey ] = modified;
					}
					modified = jqXHR.getResponseHeader("Etag");
					if ( modified ) {
						jQuery.etag[ ifModifiedKey ] = modified;
					}
				}

				// If not modified
				if ( status === 304 ) {

					statusText = "notmodified";
					isSuccess = true;

				// If we have data
				} else {

					isSuccess = ajaxConvert( s, response );
					statusText = isSuccess.state;
					success = isSuccess.data;
					error = isSuccess.error;
					isSuccess = !error;
				}
			} else {
				// We extract error from statusText
				// then normalize statusText and status for non-aborts
				error = statusText;
				if ( !statusText || status ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = "" + ( nativeStatusText || statusText );

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajax" + ( isSuccess ? "Success" : "Error" ),
						[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger( "ajaxStop" );
				}
			}
		}

		// Attach deferreds
		deferred.promise( jqXHR );
		jqXHR.success = jqXHR.done;
		jqXHR.error = jqXHR.fail;
		jqXHR.complete = completeDeferred.add;

		// Status-dependent callbacks
		jqXHR.statusCode = function( map ) {
			if ( map ) {
				var tmp;
				if ( state < 2 ) {
					for ( tmp in map ) {
						statusCode[ tmp ] = [ statusCode[tmp], map[tmp] ];
					}
				} else {
					tmp = map[ jqXHR.status ];
					jqXHR.always( tmp );
				}
			}
			return this;
		};

		// Remove hash character (#7531: and string promotion)
		// Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
		// We also use the url parameter if available
		s.url = ( ( url || s.url ) + "" ).replace( rhash, "" ).replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

		// Extract dataTypes list
		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().split( core_rspace );

		// Determine if a cross-domain request is in order
		if ( s.crossDomain == null ) {
			parts = rurl.exec( s.url.toLowerCase() );
			s.crossDomain = !!( parts &&
				( parts[ 1 ] != ajaxLocParts[ 1 ] || parts[ 2 ] != ajaxLocParts[ 2 ] ||
					( parts[ 3 ] || ( parts[ 1 ] === "http:" ? 80 : 443 ) ) !=
						( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? 80 : 443 ) ) )
			);
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( state === 2 ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		fireGlobals = s.global;

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger( "ajaxStart" );
		}

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// If data is available, append data to url
			if ( s.data ) {
				s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.data;
				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Get ifModifiedKey before adding the anti-cache parameter
			ifModifiedKey = s.url;

			// Add anti-cache in url if needed
			if ( s.cache === false ) {

				var ts = jQuery.now(),
					// try replacing _= if it is there
					ret = s.url.replace( rts, "$1_=" + ts );

				// if nothing was replaced, add timestamp to the end
				s.url = ret + ( ( ret === s.url ) ? ( rquery.test( s.url ) ? "&" : "?" ) + "_=" + ts : "" );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			ifModifiedKey = ifModifiedKey || s.url;
			if ( jQuery.lastModified[ ifModifiedKey ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ ifModifiedKey ] );
			}
			if ( jQuery.etag[ ifModifiedKey ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ ifModifiedKey ] );
			}
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
				s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
				// Abort if not done already and return
				return jqXHR.abort();

		}

		// aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		for ( i in { success: 1, error: 1, complete: 1 } ) {
			jqXHR[ i ]( s[ i ] );
		}

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;
			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}
			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = setTimeout( function(){
					jqXHR.abort( "timeout" );
				}, s.timeout );
			}

			try {
				state = 1;
				transport.send( requestHeaders, done );
			} catch (e) {
				// Propagate exception as error if not done
				if ( state < 2 ) {
					done( -1, e );
				// Simply rethrow otherwise
				} else {
					throw e;
				}
			}
		}

		return jqXHR;
	},

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {}

});

/* Handles responses to an ajax request:
 * - sets all responseXXX fields accordingly
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {

	var ct, type, finalDataType, firstDataType,
		contents = s.contents,
		dataTypes = s.dataTypes,
		responseFields = s.responseFields;

	// Fill responseXXX fields
	for ( type in responseFields ) {
		if ( type in responses ) {
			jqXHR[ responseFields[type] ] = responses[ type ];
		}
	}

	// Remove auto dataType and get content-type in the process
	while( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader( "content-type" );
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {
		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}
		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

// Chain conversions given the request and the original response
function ajaxConvert( s, response ) {

	var conv, conv2, current, tmp,
		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice(),
		prev = dataTypes[ 0 ],
		converters = {},
		i = 0;

	// Apply the dataFilter if provided
	if ( s.dataFilter ) {
		response = s.dataFilter( response, s.dataType );
	}

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	// Convert to each sequential dataType, tolerating list modification
	for ( ; (current = dataTypes[++i]); ) {

		// There's only work to do if current dataType is non-auto
		if ( current !== "*" ) {

			// Convert response if prev dataType is non-auto and differs from current
			if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split(" ");
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {
								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.splice( i--, 0, current );
								}

								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s["throws"] ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return { state: "parsererror", error: conv ? e : "No conversion from " + prev + " to " + current };
						}
					}
				}
			}

			// Update prev for next iteration
			prev = current;
		}
	}

	return { state: "success", data: response };
}
var oldCallbacks = [],
	rquestion = /\?/,
	rjsonp = /(=)\?(?=&|$)|\?\?/,
	nonce = jQuery.now();

// Default jsonp settings
jQuery.ajaxSetup({
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( nonce++ ) );
		this[ callback ] = true;
		return callback;
	}
});

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		data = s.data,
		url = s.url,
		hasCallback = s.jsonp !== false,
		replaceInUrl = hasCallback && rjsonp.test( url ),
		replaceInData = hasCallback && !replaceInUrl && typeof data === "string" &&
			!( s.contentType || "" ).indexOf("application/x-www-form-urlencoded") &&
			rjsonp.test( data );

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( s.dataTypes[ 0 ] === "jsonp" || replaceInUrl || replaceInData ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;
		overwritten = window[ callbackName ];

		// Insert callback into url or form data
		if ( replaceInUrl ) {
			s.url = url.replace( rjsonp, "$1" + callbackName );
		} else if ( replaceInData ) {
			s.data = data.replace( rjsonp, "$1" + callbackName );
		} else if ( hasCallback ) {
			s.url += ( rquestion.test( url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters["script json"] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always(function() {
			// Restore preexisting value
			window[ callbackName ] = overwritten;

			// Save back as free
			if ( s[ callbackName ] ) {
				// make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		});

		// Delegate to script
		return "script";
	}
});
// Install script dataType
jQuery.ajaxSetup({
	accepts: {
		script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /javascript|ecmascript/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
});

// Handle cache's special case and global
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
		s.global = false;
	}
});

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function(s) {

	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {

		var script,
			head = document.head || document.getElementsByTagName( "head" )[0] || document.documentElement;

		return {

			send: function( _, callback ) {

				script = document.createElement( "script" );

				script.async = "async";

				if ( s.scriptCharset ) {
					script.charset = s.scriptCharset;
				}

				script.src = s.url;

				// Attach handlers for all browsers
				script.onload = script.onreadystatechange = function( _, isAbort ) {

					if ( isAbort || !script.readyState || /loaded|complete/.test( script.readyState ) ) {

						// Handle memory leak in IE
						script.onload = script.onreadystatechange = null;

						// Remove the script
						if ( head && script.parentNode ) {
							head.removeChild( script );
						}

						// Dereference the script
						script = undefined;

						// Callback if not abort
						if ( !isAbort ) {
							callback( 200, "success" );
						}
					}
				};
				// Use insertBefore instead of appendChild  to circumvent an IE6 bug.
				// This arises when a base node is used (#2709 and #4378).
				head.insertBefore( script, head.firstChild );
			},

			abort: function() {
				if ( script ) {
					script.onload( 0, 1 );
				}
			}
		};
	}
});
var xhrCallbacks,
	// #5280: Internet Explorer will keep connections alive if we don't abort on unload
	xhrOnUnloadAbort = window.ActiveXObject ? function() {
		// Abort all pending requests
		for ( var key in xhrCallbacks ) {
			xhrCallbacks[ key ]( 0, 1 );
		}
	} : false,
	xhrId = 0;

// Functions to create xhrs
function createStandardXHR() {
	try {
		return new window.XMLHttpRequest();
	} catch( e ) {}
}

function createActiveXHR() {
	try {
		return new window.ActiveXObject( "Microsoft.XMLHTTP" );
	} catch( e ) {}
}

// Create the request object
// (This is still attached to ajaxSettings for backward compatibility)
jQuery.ajaxSettings.xhr = window.ActiveXObject ?
	/* Microsoft failed to properly
	 * implement the XMLHttpRequest in IE7 (can't request local files),
	 * so we use the ActiveXObject when it is available
	 * Additionally XMLHttpRequest can be disabled in IE7/IE8 so
	 * we need a fallback.
	 */
	function() {
		return !this.isLocal && createStandardXHR() || createActiveXHR();
	} :
	// For all other browsers, use the standard XMLHttpRequest object
	createStandardXHR;

// Determine support properties
(function( xhr ) {
	jQuery.extend( jQuery.support, {
		ajax: !!xhr,
		cors: !!xhr && ( "withCredentials" in xhr )
	});
})( jQuery.ajaxSettings.xhr() );

// Create transport if the browser can provide an xhr
if ( jQuery.support.ajax ) {

	jQuery.ajaxTransport(function( s ) {
		// Cross domain only allowed if supported through XMLHttpRequest
		if ( !s.crossDomain || jQuery.support.cors ) {

			var callback;

			return {
				send: function( headers, complete ) {

					// Get a new xhr
					var handle, i,
						xhr = s.xhr();

					// Open the socket
					// Passing null username, generates a login popup on Opera (#2865)
					if ( s.username ) {
						xhr.open( s.type, s.url, s.async, s.username, s.password );
					} else {
						xhr.open( s.type, s.url, s.async );
					}

					// Apply custom fields if provided
					if ( s.xhrFields ) {
						for ( i in s.xhrFields ) {
							xhr[ i ] = s.xhrFields[ i ];
						}
					}

					// Override mime type if needed
					if ( s.mimeType && xhr.overrideMimeType ) {
						xhr.overrideMimeType( s.mimeType );
					}

					// X-Requested-With header
					// For cross-domain requests, seeing as conditions for a preflight are
					// akin to a jigsaw puzzle, we simply never set it to be sure.
					// (it can always be set on a per-request basis or even using ajaxSetup)
					// For same-domain requests, won't change header if already provided.
					if ( !s.crossDomain && !headers["X-Requested-With"] ) {
						headers[ "X-Requested-With" ] = "XMLHttpRequest";
					}

					// Need an extra try/catch for cross domain requests in Firefox 3
					try {
						for ( i in headers ) {
							xhr.setRequestHeader( i, headers[ i ] );
						}
					} catch( _ ) {}

					// Do send the request
					// This may raise an exception which is actually
					// handled in jQuery.ajax (so no try/catch here)
					xhr.send( ( s.hasContent && s.data ) || null );

					// Listener
					callback = function( _, isAbort ) {

						var status,
							statusText,
							responseHeaders,
							responses,
							xml;

						// Firefox throws exceptions when accessing properties
						// of an xhr when a network error occurred
						// http://helpful.knobs-dials.com/index.php/Component_returned_failure_code:_0x80040111_(NS_ERROR_NOT_AVAILABLE)
						try {

							// Was never called and is aborted or complete
							if ( callback && ( isAbort || xhr.readyState === 4 ) ) {

								// Only called once
								callback = undefined;

								// Do not keep as active anymore
								if ( handle ) {
									xhr.onreadystatechange = jQuery.noop;
									if ( xhrOnUnloadAbort ) {
										delete xhrCallbacks[ handle ];
									}
								}

								// If it's an abort
								if ( isAbort ) {
									// Abort it manually if needed
									if ( xhr.readyState !== 4 ) {
										xhr.abort();
									}
								} else {
									status = xhr.status;
									responseHeaders = xhr.getAllResponseHeaders();
									responses = {};
									xml = xhr.responseXML;

									// Construct response list
									if ( xml && xml.documentElement /* #4958 */ ) {
										responses.xml = xml;
									}

									// When requesting binary data, IE6-9 will throw an exception
									// on any attempt to access responseText (#11426)
									try {
										responses.text = xhr.responseText;
									} catch( _ ) {
									}

									// Firefox throws an exception when accessing
									// statusText for faulty cross-domain requests
									try {
										statusText = xhr.statusText;
									} catch( e ) {
										// We normalize with Webkit giving an empty statusText
										statusText = "";
									}

									// Filter status for non standard behaviors

									// If the request is local and we have data: assume a success
									// (success with no data won't get notified, that's the best we
									// can do given current implementations)
									if ( !status && s.isLocal && !s.crossDomain ) {
										status = responses.text ? 200 : 404;
									// IE - #1450: sometimes returns 1223 when it should be 204
									} else if ( status === 1223 ) {
										status = 204;
									}
								}
							}
						} catch( firefoxAccessException ) {
							if ( !isAbort ) {
								complete( -1, firefoxAccessException );
							}
						}

						// Call complete if needed
						if ( responses ) {
							complete( status, statusText, responses, responseHeaders );
						}
					};

					if ( !s.async ) {
						// if we're in sync mode we fire the callback
						callback();
					} else if ( xhr.readyState === 4 ) {
						// (IE6 & IE7) if it's in cache and has been
						// retrieved directly we need to fire the callback
						setTimeout( callback, 0 );
					} else {
						handle = ++xhrId;
						if ( xhrOnUnloadAbort ) {
							// Create the active xhrs callbacks list if needed
							// and attach the unload handler
							if ( !xhrCallbacks ) {
								xhrCallbacks = {};
								jQuery( window ).unload( xhrOnUnloadAbort );
							}
							// Add to list of active xhrs callbacks
							xhrCallbacks[ handle ] = callback;
						}
						xhr.onreadystatechange = callback;
					}
				},

				abort: function() {
					if ( callback ) {
						callback(0,1);
					}
				}
			};
		}
	});
}
var fxNow, timerId,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rfxnum = new RegExp( "^(?:([-+])=|)(" + core_pnum + ")([a-z%]*)$", "i" ),
	rrun = /queueHooks$/,
	animationPrefilters = [ defaultPrefilter ],
	tweeners = {
		"*": [function( prop, value ) {
			var end, unit, prevScale,
				tween = this.createTween( prop, value ),
				parts = rfxnum.exec( value ),
				target = tween.cur(),
				start = +target || 0,
				scale = 1;

			if ( parts ) {
				end = +parts[2];
				unit = parts[3] || ( jQuery.cssNumber[ prop ] ? "" : "px" );

				// We need to compute starting value
				if ( unit !== "px" && start ) {
					// Iteratively approximate from a nonzero starting point
					// Prefer the current property, because this process will be trivial if it uses the same units
					// Fallback to end or a simple constant
					start = jQuery.css( tween.elem, prop, true ) || end || 1;

					do {
						// If previous iteration zeroed out, double until we get *something*
						// Use a string for doubling factor so we don't accidentally see scale as unchanged below
						prevScale = scale = scale || ".5";

						// Adjust and apply
						start = start / scale;
						jQuery.style( tween.elem, prop, start + unit );

						// Update scale, tolerating zeroes from tween.cur()
						scale = tween.cur() / target;

					// Stop looping if we've hit the mark or scale is unchanged
					} while ( scale !== 1 && scale !== prevScale );
				}

				tween.unit = unit;
				tween.start = start;
				// If a +=/-= token was provided, we're doing a relative animation
				tween.end = parts[1] ? start + ( parts[1] + 1 ) * end : end;
			}
			return tween;
		}]
	};

// Animations created synchronously will run synchronously
function createFxNow() {
	setTimeout(function() {
		fxNow = undefined;
	}, 0 );
	return ( fxNow = jQuery.now() );
}

function createTweens( animation, props ) {
	jQuery.each( props, function( prop, value ) {
		var collection = ( tweeners[ prop ] || [] ).concat( tweeners[ "*" ] ),
			index = 0,
			length = collection.length;
		for ( ; index < length; index++ ) {
			if ( collection[ index ].call( animation, prop, value ) ) {

				// we're done with this property
				return;
			}
		}
	});
}

function Animation( elem, properties, options ) {
	var result,
		index = 0,
		tweenerIndex = 0,
		length = animationPrefilters.length,
		deferred = jQuery.Deferred().always( function() {
			// don't match elem in the :animated selector
			delete tick.elem;
		}),
		tick = function() {
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),
				percent = 1 - ( remaining / animation.duration || 0 ),
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length ; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ]);

			if ( percent < 1 && length ) {
				return remaining;
			} else {
				deferred.resolveWith( elem, [ animation ] );
				return false;
			}
		},
		animation = deferred.promise({
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, { specialEasing: {} }, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end, easing ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,
					// if we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;

				for ( ; index < length ; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// resolve when we played the last frame
				// otherwise, reject
				if ( gotoEnd ) {
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		}),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length ; index++ ) {
		result = animationPrefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			return result;
		}
	}

	createTweens( animation, props );

	if ( jQuery.isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	jQuery.fx.timer(
		jQuery.extend( tick, {
			anim: animation,
			queue: animation.opts.queue,
			elem: elem
		})
	);

	// attach callbacks from options
	return animation.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );
}

function propFilter( props, specialEasing ) {
	var index, name, easing, value, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = jQuery.camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( jQuery.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// not quite $.extend, this wont overwrite keys already present.
			// also - reusing 'index' from above because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

jQuery.Animation = jQuery.extend( Animation, {

	tweener: function( props, callback ) {
		if ( jQuery.isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.split(" ");
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length ; index++ ) {
			prop = props[ index ];
			tweeners[ prop ] = tweeners[ prop ] || [];
			tweeners[ prop ].unshift( callback );
		}
	},

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			animationPrefilters.unshift( callback );
		} else {
			animationPrefilters.push( callback );
		}
	}
});

function defaultPrefilter( elem, props, opts ) {
	var index, prop, value, length, dataShow, tween, hooks, oldfire,
		anim = this,
		style = elem.style,
		orig = {},
		handled = [],
		hidden = elem.nodeType && isHidden( elem );

	// handle queue: false promises
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always(function() {
			// doing this makes sure that the complete handler will be called
			// before this completes
			anim.always(function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			});
		});
	}

	// height/width overflow pass
	if ( elem.nodeType === 1 && ( "height" in props || "width" in props ) ) {
		// Make sure that nothing sneaks out
		// Record all 3 overflow attributes because IE does not
		// change the overflow attribute when overflowX and
		// overflowY are set to the same value
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Set display property to inline-block for height/width
		// animations on inline elements that are having width/height animated
		if ( jQuery.css( elem, "display" ) === "inline" &&
				jQuery.css( elem, "float" ) === "none" ) {

			// inline-level elements accept inline-block;
			// block-level elements need to be inline with layout
			if ( !jQuery.support.inlineBlockNeedsLayout || css_defaultDisplay( elem.nodeName ) === "inline" ) {
				style.display = "inline-block";

			} else {
				style.zoom = 1;
			}
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		if ( !jQuery.support.shrinkWrapBlocks ) {
			anim.done(function() {
				style.overflow = opts.overflow[ 0 ];
				style.overflowX = opts.overflow[ 1 ];
				style.overflowY = opts.overflow[ 2 ];
			});
		}
	}


	// show/hide pass
	for ( index in props ) {
		value = props[ index ];
		if ( rfxtypes.exec( value ) ) {
			delete props[ index ];
			if ( value === ( hidden ? "hide" : "show" ) ) {
				continue;
			}
			handled.push( index );
		}
	}

	length = handled.length;
	if ( length ) {
		dataShow = jQuery._data( elem, "fxshow" ) || jQuery._data( elem, "fxshow", {} );
		if ( hidden ) {
			jQuery( elem ).show();
		} else {
			anim.done(function() {
				jQuery( elem ).hide();
			});
		}
		anim.done(function() {
			var prop;
			jQuery.removeData( elem, "fxshow", true );
			for ( prop in orig ) {
				jQuery.style( elem, prop, orig[ prop ] );
			}
		});
		for ( index = 0 ; index < length ; index++ ) {
			prop = handled[ index ];
			tween = anim.createTween( prop, hidden ? dataShow[ prop ] : 0 );
			orig[ prop ] = dataShow[ prop ] || jQuery.style( elem, prop );

			if ( !( prop in dataShow ) ) {
				dataShow[ prop ] = tween.start;
				if ( hidden ) {
					tween.end = tween.start;
					tween.start = prop === "width" || prop === "height" ? 1 : 0;
				}
			}
		}
	}
}

function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || "swing";
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		this.pos = eased = jQuery.easing[ this.easing ]( percent, this.options.duration * percent, 0, 1, this.options.duration );
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			if ( tween.elem[ tween.prop ] != null &&
				(!tween.elem.style || tween.elem.style[ tween.prop ] == null) ) {
				return tween.elem[ tween.prop ];
			}

			// passing any value as a 4th parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails
			// so, simple values such as "10px" are parsed to Float.
			// complex values such as "rotate(1rad)" are returned as is.
			result = jQuery.css( tween.elem, tween.prop, false, "" );
			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {
			// use step hook for back compat - use cssHook if its there - use .style if its
			// available and use plain properties where available
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.style && ( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null || jQuery.cssHooks[ tween.prop ] ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Remove in 2.0 - this supports IE8's panic based approach
// to setting things on disconnected nodes

Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.each([ "toggle", "show", "hide" ], function( i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ||
			// special check for .toggle( handler, handler, ... )
			( !i && jQuery.isFunction( speed ) && jQuery.isFunction( easing ) ) ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
});

jQuery.fn.extend({
	fadeTo: function( speed, to, easing, callback ) {

		// show any hidden elements after setting opacity to 0
		return this.filter( isHidden ).css( "opacity", 0 ).show()

			// animate to the value specified
			.end().animate({ opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {
				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

				// Empty animations resolve immediately
				if ( empty ) {
					anim.stop( true );
				}
			};

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each(function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = jQuery._data( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && (type == null || timers[ index ].queue === type) ) {
					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// start the next in the queue if the last step wasn't forced
			// timers currently will call their complete callbacks, which will dequeue
			// but only if they were gotoEnd
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		});
	}
});

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		attrs = { height: type },
		i = 0;

	// if we include width, step value is 1 to do all cssExpand values,
	// if we don't include width, step value is 2 to skip over Left and Right
	for( ; i < 4 ; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

// Generate shortcuts for custom animations
jQuery.each({
	slideDown: genFx("show"),
	slideUp: genFx("hide"),
	slideToggle: genFx("toggle"),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
});

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			jQuery.isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
	};

	opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
		opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

	// normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( jQuery.isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p*Math.PI ) / 2;
	}
};

jQuery.timers = [];
jQuery.fx = Tween.prototype.init;
jQuery.fx.tick = function() {
	var timer,
		timers = jQuery.timers,
		i = 0;

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];
		// Checks the timer has not already been removed
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
};

jQuery.fx.timer = function( timer ) {
	if ( timer() && jQuery.timers.push( timer ) && !timerId ) {
		timerId = setInterval( jQuery.fx.tick, jQuery.fx.interval );
	}
};

jQuery.fx.interval = 13;

jQuery.fx.stop = function() {
	clearInterval( timerId );
	timerId = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,
	// Default speed
	_default: 400
};

// Back Compat <1.8 extension point
jQuery.fx.step = {};

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.animated = function( elem ) {
		return jQuery.grep(jQuery.timers, function( fn ) {
			return elem === fn.elem;
		}).length;
	};
}
var rroot = /^(?:body|html)$/i;

jQuery.fn.offset = function( options ) {
	if ( arguments.length ) {
		return options === undefined ?
			this :
			this.each(function( i ) {
				jQuery.offset.setOffset( this, options, i );
			});
	}

	var box, docElem, body, win, clientTop, clientLeft, scrollTop, scrollLeft, top, left,
		elem = this[ 0 ],
		doc = elem && elem.ownerDocument;

	if ( !doc ) {
		return;
	}

	if ( (body = doc.body) === elem ) {
		return jQuery.offset.bodyOffset( elem );
	}

	docElem = doc.documentElement;

	// Make sure we're not dealing with a disconnected DOM node
	if ( !jQuery.contains( docElem, elem ) ) {
		return { top: 0, left: 0 };
	}

	box = elem.getBoundingClientRect();
	win = getWindow( doc );
	clientTop  = docElem.clientTop  || body.clientTop  || 0;
	clientLeft = docElem.clientLeft || body.clientLeft || 0;
	scrollTop  = win.pageYOffset || docElem.scrollTop;
	scrollLeft = win.pageXOffset || docElem.scrollLeft;
	top  = box.top  + scrollTop  - clientTop;
	left = box.left + scrollLeft - clientLeft;

	return { top: top, left: left };
};

jQuery.offset = {

	bodyOffset: function( body ) {
		var top = body.offsetTop,
			left = body.offsetLeft;

		if ( jQuery.support.doesNotIncludeMarginInBodyOffset ) {
			top  += parseFloat( jQuery.css(body, "marginTop") ) || 0;
			left += parseFloat( jQuery.css(body, "marginLeft") ) || 0;
		}

		return { top: top, left: left };
	},

	setOffset: function( elem, options, i ) {
		var position = jQuery.css( elem, "position" );

		// set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		var curElem = jQuery( elem ),
			curOffset = curElem.offset(),
			curCSSTop = jQuery.css( elem, "top" ),
			curCSSLeft = jQuery.css( elem, "left" ),
			calculatePosition = ( position === "absolute" || position === "fixed" ) && jQuery.inArray("auto", [curCSSTop, curCSSLeft]) > -1,
			props = {}, curPosition = {}, curTop, curLeft;

		// need to be able to calculate position if either top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;
		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {
			options = options.call( elem, i, curOffset );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );
		} else {
			curElem.css( props );
		}
	}
};


jQuery.fn.extend({

	position: function() {
		if ( !this[0] ) {
			return;
		}

		var elem = this[0],

		// Get *real* offsetParent
		offsetParent = this.offsetParent(),

		// Get correct offsets
		offset       = this.offset(),
		parentOffset = rroot.test(offsetParent[0].nodeName) ? { top: 0, left: 0 } : offsetParent.offset();

		// Subtract element margins
		// note: when an element has margin: auto the offsetLeft and marginLeft
		// are the same in Safari causing offset.left to incorrectly be 0
		offset.top  -= parseFloat( jQuery.css(elem, "marginTop") ) || 0;
		offset.left -= parseFloat( jQuery.css(elem, "marginLeft") ) || 0;

		// Add offsetParent borders
		parentOffset.top  += parseFloat( jQuery.css(offsetParent[0], "borderTopWidth") ) || 0;
		parentOffset.left += parseFloat( jQuery.css(offsetParent[0], "borderLeftWidth") ) || 0;

		// Subtract the two offsets
		return {
			top:  offset.top  - parentOffset.top,
			left: offset.left - parentOffset.left
		};
	},

	offsetParent: function() {
		return this.map(function() {
			var offsetParent = this.offsetParent || document.body;
			while ( offsetParent && (!rroot.test(offsetParent.nodeName) && jQuery.css(offsetParent, "position") === "static") ) {
				offsetParent = offsetParent.offsetParent;
			}
			return offsetParent || document.body;
		});
	}
});


// Create scrollLeft and scrollTop methods
jQuery.each( {scrollLeft: "pageXOffset", scrollTop: "pageYOffset"}, function( method, prop ) {
	var top = /Y/.test( prop );

	jQuery.fn[ method ] = function( val ) {
		return jQuery.access( this, function( elem, method, val ) {
			var win = getWindow( elem );

			if ( val === undefined ) {
				return win ? (prop in win) ? win[ prop ] :
					win.document.documentElement[ method ] :
					elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : jQuery( win ).scrollLeft(),
					 top ? val : jQuery( win ).scrollTop()
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length, null );
	};
});

function getWindow( elem ) {
	return jQuery.isWindow( elem ) ?
		elem :
		elem.nodeType === 9 ?
			elem.defaultView || elem.parentWindow :
			false;
}
// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name }, function( defaultExtra, funcName ) {
		// margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return jQuery.access( this, function( elem, type, value ) {
				var doc;

				if ( jQuery.isWindow( elem ) ) {
					// As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
					// isn't a whole lot we can do. See pull request at this URL for discussion:
					// https://github.com/jquery/jquery/pull/764
					return elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height], whichever is greatest
					// unfortunately, this causes bug #3838 in IE6/8 only, but there is currently no good, small way to fix it.
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?
					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, value, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable );
		};
	});
});
// Expose jQuery to the global object
window.jQuery = window.$ = jQuery;

// Expose jQuery as an AMD module, but only for AMD loaders that
// understand the issues with loading multiple versions of jQuery
// in a page that all might call define(). The loader will indicate
// they have special allowances for multiple jQuery versions by
// specifying define.amd.jQuery = true. Register as a named module,
// since jQuery can be concatenated with other files that may use define,
// but not use a proper concatenation script that understands anonymous
// AMD modules. A named AMD is safest and most robust way to register.
// Lowercase jquery is used because AMD module names are derived from
// file names, and jQuery is normally delivered in a lowercase file name.
// Do this after creating the global so that if an AMD module wants to call
// noConflict to hide this version of jQuery, it will work.
if ( typeof define === "function" && define.amd && define.amd.jQuery ) {
	define( "jquery", [], function () { return jQuery; } );
}

})( window );;/*! jQuery UI - v1.10.3 - 2013-06-12
* http://jqueryui.com
* Includes: jquery.ui.core.js, jquery.ui.widget.js, jquery.ui.mouse.js, jquery.ui.sortable.js
* Copyright 2013 jQuery Foundation and other contributors Licensed MIT */

(function( $, undefined ) {

var uuid = 0,
	runiqueId = /^ui-id-\d+$/;

// $.ui might exist from components with no dependencies, e.g., $.ui.position
$.ui = $.ui || {};

$.extend( $.ui, {
	version: "1.10.3",

	keyCode: {
		BACKSPACE: 8,
		COMMA: 188,
		DELETE: 46,
		DOWN: 40,
		END: 35,
		ENTER: 13,
		ESCAPE: 27,
		HOME: 36,
		LEFT: 37,
		NUMPAD_ADD: 107,
		NUMPAD_DECIMAL: 110,
		NUMPAD_DIVIDE: 111,
		NUMPAD_ENTER: 108,
		NUMPAD_MULTIPLY: 106,
		NUMPAD_SUBTRACT: 109,
		PAGE_DOWN: 34,
		PAGE_UP: 33,
		PERIOD: 190,
		RIGHT: 39,
		SPACE: 32,
		TAB: 9,
		UP: 38
	}
});

// plugins
$.fn.extend({
	focus: (function( orig ) {
		return function( delay, fn ) {
			return typeof delay === "number" ?
				this.each(function() {
					var elem = this;
					setTimeout(function() {
						$( elem ).focus();
						if ( fn ) {
							fn.call( elem );
						}
					}, delay );
				}) :
				orig.apply( this, arguments );
		};
	})( $.fn.focus ),

	scrollParent: function() {
		var scrollParent;
		if (($.ui.ie && (/(static|relative)/).test(this.css("position"))) || (/absolute/).test(this.css("position"))) {
			scrollParent = this.parents().filter(function() {
				return (/(relative|absolute|fixed)/).test($.css(this,"position")) && (/(auto|scroll)/).test($.css(this,"overflow")+$.css(this,"overflow-y")+$.css(this,"overflow-x"));
			}).eq(0);
		} else {
			scrollParent = this.parents().filter(function() {
				return (/(auto|scroll)/).test($.css(this,"overflow")+$.css(this,"overflow-y")+$.css(this,"overflow-x"));
			}).eq(0);
		}

		return (/fixed/).test(this.css("position")) || !scrollParent.length ? $(document) : scrollParent;
	},

	zIndex: function( zIndex ) {
		if ( zIndex !== undefined ) {
			return this.css( "zIndex", zIndex );
		}

		if ( this.length ) {
			var elem = $( this[ 0 ] ), position, value;
			while ( elem.length && elem[ 0 ] !== document ) {
				// Ignore z-index if position is set to a value where z-index is ignored by the browser
				// This makes behavior of this function consistent across browsers
				// WebKit always returns auto if the element is positioned
				position = elem.css( "position" );
				if ( position === "absolute" || position === "relative" || position === "fixed" ) {
					// IE returns 0 when zIndex is not specified
					// other browsers return a string
					// we ignore the case of nested elements with an explicit value of 0
					// <div style="z-index: -10;"><div style="z-index: 0;"></div></div>
					value = parseInt( elem.css( "zIndex" ), 10 );
					if ( !isNaN( value ) && value !== 0 ) {
						return value;
					}
				}
				elem = elem.parent();
			}
		}

		return 0;
	},

	uniqueId: function() {
		return this.each(function() {
			if ( !this.id ) {
				this.id = "ui-id-" + (++uuid);
			}
		});
	},

	removeUniqueId: function() {
		return this.each(function() {
			if ( runiqueId.test( this.id ) ) {
				$( this ).removeAttr( "id" );
			}
		});
	}
});

// selectors
function focusable( element, isTabIndexNotNaN ) {
	var map, mapName, img,
		nodeName = element.nodeName.toLowerCase();
	if ( "area" === nodeName ) {
		map = element.parentNode;
		mapName = map.name;
		if ( !element.href || !mapName || map.nodeName.toLowerCase() !== "map" ) {
			return false;
		}
		img = $( "img[usemap=#" + mapName + "]" )[0];
		return !!img && visible( img );
	}
	return ( /input|select|textarea|button|object/.test( nodeName ) ?
		!element.disabled :
		"a" === nodeName ?
			element.href || isTabIndexNotNaN :
			isTabIndexNotNaN) &&
		// the element and all of its ancestors must be visible
		visible( element );
}

function visible( element ) {
	return $.expr.filters.visible( element ) &&
		!$( element ).parents().addBack().filter(function() {
			return $.css( this, "visibility" ) === "hidden";
		}).length;
}

$.extend( $.expr[ ":" ], {
	data: $.expr.createPseudo ?
		$.expr.createPseudo(function( dataName ) {
			return function( elem ) {
				return !!$.data( elem, dataName );
			};
		}) :
		// support: jQuery <1.8
		function( elem, i, match ) {
			return !!$.data( elem, match[ 3 ] );
		},

	focusable: function( element ) {
		return focusable( element, !isNaN( $.attr( element, "tabindex" ) ) );
	},

	tabbable: function( element ) {
		var tabIndex = $.attr( element, "tabindex" ),
			isTabIndexNaN = isNaN( tabIndex );
		return ( isTabIndexNaN || tabIndex >= 0 ) && focusable( element, !isTabIndexNaN );
	}
});

// support: jQuery <1.8
if ( !$( "<a>" ).outerWidth( 1 ).jquery ) {
	$.each( [ "Width", "Height" ], function( i, name ) {
		var side = name === "Width" ? [ "Left", "Right" ] : [ "Top", "Bottom" ],
			type = name.toLowerCase(),
			orig = {
				innerWidth: $.fn.innerWidth,
				innerHeight: $.fn.innerHeight,
				outerWidth: $.fn.outerWidth,
				outerHeight: $.fn.outerHeight
			};

		function reduce( elem, size, border, margin ) {
			$.each( side, function() {
				size -= parseFloat( $.css( elem, "padding" + this ) ) || 0;
				if ( border ) {
					size -= parseFloat( $.css( elem, "border" + this + "Width" ) ) || 0;
				}
				if ( margin ) {
					size -= parseFloat( $.css( elem, "margin" + this ) ) || 0;
				}
			});
			return size;
		}

		$.fn[ "inner" + name ] = function( size ) {
			if ( size === undefined ) {
				return orig[ "inner" + name ].call( this );
			}

			return this.each(function() {
				$( this ).css( type, reduce( this, size ) + "px" );
			});
		};

		$.fn[ "outer" + name] = function( size, margin ) {
			if ( typeof size !== "number" ) {
				return orig[ "outer" + name ].call( this, size );
			}

			return this.each(function() {
				$( this).css( type, reduce( this, size, true, margin ) + "px" );
			});
		};
	});
}

// support: jQuery <1.8
if ( !$.fn.addBack ) {
	$.fn.addBack = function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter( selector )
		);
	};
}

// support: jQuery 1.6.1, 1.6.2 (http://bugs.jquery.com/ticket/9413)
if ( $( "<a>" ).data( "a-b", "a" ).removeData( "a-b" ).data( "a-b" ) ) {
	$.fn.removeData = (function( removeData ) {
		return function( key ) {
			if ( arguments.length ) {
				return removeData.call( this, $.camelCase( key ) );
			} else {
				return removeData.call( this );
			}
		};
	})( $.fn.removeData );
}





// deprecated
$.ui.ie = !!/msie [\w.]+/.exec( navigator.userAgent.toLowerCase() );

$.support.selectstart = "onselectstart" in document.createElement( "div" );
$.fn.extend({
	disableSelection: function() {
		return this.bind( ( $.support.selectstart ? "selectstart" : "mousedown" ) +
			".ui-disableSelection", function( event ) {
				event.preventDefault();
			});
	},

	enableSelection: function() {
		return this.unbind( ".ui-disableSelection" );
	}
});

$.extend( $.ui, {
	// $.ui.plugin is deprecated. Use $.widget() extensions instead.
	plugin: {
		add: function( module, option, set ) {
			var i,
				proto = $.ui[ module ].prototype;
			for ( i in set ) {
				proto.plugins[ i ] = proto.plugins[ i ] || [];
				proto.plugins[ i ].push( [ option, set[ i ] ] );
			}
		},
		call: function( instance, name, args ) {
			var i,
				set = instance.plugins[ name ];
			if ( !set || !instance.element[ 0 ].parentNode || instance.element[ 0 ].parentNode.nodeType === 11 ) {
				return;
			}

			for ( i = 0; i < set.length; i++ ) {
				if ( instance.options[ set[ i ][ 0 ] ] ) {
					set[ i ][ 1 ].apply( instance.element, args );
				}
			}
		}
	},

	// only used by resizable
	hasScroll: function( el, a ) {

		//If overflow is hidden, the element might have extra content, but the user wants to hide it
		if ( $( el ).css( "overflow" ) === "hidden") {
			return false;
		}

		var scroll = ( a && a === "left" ) ? "scrollLeft" : "scrollTop",
			has = false;

		if ( el[ scroll ] > 0 ) {
			return true;
		}

		// TODO: determine which cases actually cause this to happen
		// if the element doesn't have the scroll set, see if it's possible to
		// set the scroll
		el[ scroll ] = 1;
		has = ( el[ scroll ] > 0 );
		el[ scroll ] = 0;
		return has;
	}
});

})( jQuery );
(function( $, undefined ) {

var uuid = 0,
	slice = Array.prototype.slice,
	_cleanData = $.cleanData;
$.cleanData = function( elems ) {
	for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
		try {
			$( elem ).triggerHandler( "remove" );
		// http://bugs.jquery.com/ticket/8235
		} catch( e ) {}
	}
	_cleanData( elems );
};

$.widget = function( name, base, prototype ) {
	var fullName, existingConstructor, constructor, basePrototype,
		// proxiedPrototype allows the provided prototype to remain unmodified
		// so that it can be used as a mixin for multiple widgets (#8876)
		proxiedPrototype = {},
		namespace = name.split( "." )[ 0 ];

	name = name.split( "." )[ 1 ];
	fullName = namespace + "-" + name;

	if ( !prototype ) {
		prototype = base;
		base = $.Widget;
	}

	// create selector for plugin
	$.expr[ ":" ][ fullName.toLowerCase() ] = function( elem ) {
		return !!$.data( elem, fullName );
	};

	$[ namespace ] = $[ namespace ] || {};
	existingConstructor = $[ namespace ][ name ];
	constructor = $[ namespace ][ name ] = function( options, element ) {
		// allow instantiation without "new" keyword
		if ( !this._createWidget ) {
			return new constructor( options, element );
		}

		// allow instantiation without initializing for simple inheritance
		// must use "new" keyword (the code above always passes args)
		if ( arguments.length ) {
			this._createWidget( options, element );
		}
	};
	// extend with the existing constructor to carry over any static properties
	$.extend( constructor, existingConstructor, {
		version: prototype.version,
		// copy the object used to create the prototype in case we need to
		// redefine the widget later
		_proto: $.extend( {}, prototype ),
		// track widgets that inherit from this widget in case this widget is
		// redefined after a widget inherits from it
		_childConstructors: []
	});

	basePrototype = new base();
	// we need to make the options hash a property directly on the new instance
	// otherwise we'll modify the options hash on the prototype that we're
	// inheriting from
	basePrototype.options = $.widget.extend( {}, basePrototype.options );
	$.each( prototype, function( prop, value ) {
		if ( !$.isFunction( value ) ) {
			proxiedPrototype[ prop ] = value;
			return;
		}
		proxiedPrototype[ prop ] = (function() {
			var _super = function() {
					return base.prototype[ prop ].apply( this, arguments );
				},
				_superApply = function( args ) {
					return base.prototype[ prop ].apply( this, args );
				};
			return function() {
				var __super = this._super,
					__superApply = this._superApply,
					returnValue;

				this._super = _super;
				this._superApply = _superApply;

				returnValue = value.apply( this, arguments );

				this._super = __super;
				this._superApply = __superApply;

				return returnValue;
			};
		})();
	});
	constructor.prototype = $.widget.extend( basePrototype, {
		// TODO: remove support for widgetEventPrefix
		// always use the name + a colon as the prefix, e.g., draggable:start
		// don't prefix for widgets that aren't DOM-based
		widgetEventPrefix: existingConstructor ? basePrototype.widgetEventPrefix : name
	}, proxiedPrototype, {
		constructor: constructor,
		namespace: namespace,
		widgetName: name,
		widgetFullName: fullName
	});

	// If this widget is being redefined then we need to find all widgets that
	// are inheriting from it and redefine all of them so that they inherit from
	// the new version of this widget. We're essentially trying to replace one
	// level in the prototype chain.
	if ( existingConstructor ) {
		$.each( existingConstructor._childConstructors, function( i, child ) {
			var childPrototype = child.prototype;

			// redefine the child widget using the same prototype that was
			// originally used, but inherit from the new version of the base
			$.widget( childPrototype.namespace + "." + childPrototype.widgetName, constructor, child._proto );
		});
		// remove the list of existing child constructors from the old constructor
		// so the old child constructors can be garbage collected
		delete existingConstructor._childConstructors;
	} else {
		base._childConstructors.push( constructor );
	}

	$.widget.bridge( name, constructor );
};

$.widget.extend = function( target ) {
	var input = slice.call( arguments, 1 ),
		inputIndex = 0,
		inputLength = input.length,
		key,
		value;
	for ( ; inputIndex < inputLength; inputIndex++ ) {
		for ( key in input[ inputIndex ] ) {
			value = input[ inputIndex ][ key ];
			if ( input[ inputIndex ].hasOwnProperty( key ) && value !== undefined ) {
				// Clone objects
				if ( $.isPlainObject( value ) ) {
					target[ key ] = $.isPlainObject( target[ key ] ) ?
						$.widget.extend( {}, target[ key ], value ) :
						// Don't extend strings, arrays, etc. with objects
						$.widget.extend( {}, value );
				// Copy everything else by reference
				} else {
					target[ key ] = value;
				}
			}
		}
	}
	return target;
};

$.widget.bridge = function( name, object ) {
	var fullName = object.prototype.widgetFullName || name;
	$.fn[ name ] = function( options ) {
		var isMethodCall = typeof options === "string",
			args = slice.call( arguments, 1 ),
			returnValue = this;

		// allow multiple hashes to be passed on init
		options = !isMethodCall && args.length ?
			$.widget.extend.apply( null, [ options ].concat(args) ) :
			options;

		if ( isMethodCall ) {
			this.each(function() {
				var methodValue,
					instance = $.data( this, fullName );
				if ( !instance ) {
					return $.error( "cannot call methods on " + name + " prior to initialization; " +
						"attempted to call method '" + options + "'" );
				}
				if ( !$.isFunction( instance[options] ) || options.charAt( 0 ) === "_" ) {
					return $.error( "no such method '" + options + "' for " + name + " widget instance" );
				}
				methodValue = instance[ options ].apply( instance, args );
				if ( methodValue !== instance && methodValue !== undefined ) {
					returnValue = methodValue && methodValue.jquery ?
						returnValue.pushStack( methodValue.get() ) :
						methodValue;
					return false;
				}
			});
		} else {
			this.each(function() {
				var instance = $.data( this, fullName );
				if ( instance ) {
					instance.option( options || {} )._init();
				} else {
					$.data( this, fullName, new object( options, this ) );
				}
			});
		}

		return returnValue;
	};
};

$.Widget = function( /* options, element */ ) {};
$.Widget._childConstructors = [];

$.Widget.prototype = {
	widgetName: "widget",
	widgetEventPrefix: "",
	defaultElement: "<div>",
	options: {
		disabled: false,

		// callbacks
		create: null
	},
	_createWidget: function( options, element ) {
		element = $( element || this.defaultElement || this )[ 0 ];
		this.element = $( element );
		this.uuid = uuid++;
		this.eventNamespace = "." + this.widgetName + this.uuid;
		this.options = $.widget.extend( {},
			this.options,
			this._getCreateOptions(),
			options );

		this.bindings = $();
		this.hoverable = $();
		this.focusable = $();

		if ( element !== this ) {
			$.data( element, this.widgetFullName, this );
			this._on( true, this.element, {
				remove: function( event ) {
					if ( event.target === element ) {
						this.destroy();
					}
				}
			});
			this.document = $( element.style ?
				// element within the document
				element.ownerDocument :
				// element is window or document
				element.document || element );
			this.window = $( this.document[0].defaultView || this.document[0].parentWindow );
		}

		this._create();
		this._trigger( "create", null, this._getCreateEventData() );
		this._init();
	},
	_getCreateOptions: $.noop,
	_getCreateEventData: $.noop,
	_create: $.noop,
	_init: $.noop,

	destroy: function() {
		this._destroy();
		// we can probably remove the unbind calls in 2.0
		// all event bindings should go through this._on()
		this.element
			.unbind( this.eventNamespace )
			// 1.9 BC for #7810
			// TODO remove dual storage
			.removeData( this.widgetName )
			.removeData( this.widgetFullName )
			// support: jquery <1.6.3
			// http://bugs.jquery.com/ticket/9413
			.removeData( $.camelCase( this.widgetFullName ) );
		this.widget()
			.unbind( this.eventNamespace )
			.removeAttr( "aria-disabled" )
			.removeClass(
				this.widgetFullName + "-disabled " +
				"ui-state-disabled" );

		// clean up events and states
		this.bindings.unbind( this.eventNamespace );
		this.hoverable.removeClass( "ui-state-hover" );
		this.focusable.removeClass( "ui-state-focus" );
	},
	_destroy: $.noop,

	widget: function() {
		return this.element;
	},

	option: function( key, value ) {
		var options = key,
			parts,
			curOption,
			i;

		if ( arguments.length === 0 ) {
			// don't return a reference to the internal hash
			return $.widget.extend( {}, this.options );
		}

		if ( typeof key === "string" ) {
			// handle nested keys, e.g., "foo.bar" => { foo: { bar: ___ } }
			options = {};
			parts = key.split( "." );
			key = parts.shift();
			if ( parts.length ) {
				curOption = options[ key ] = $.widget.extend( {}, this.options[ key ] );
				for ( i = 0; i < parts.length - 1; i++ ) {
					curOption[ parts[ i ] ] = curOption[ parts[ i ] ] || {};
					curOption = curOption[ parts[ i ] ];
				}
				key = parts.pop();
				if ( value === undefined ) {
					return curOption[ key ] === undefined ? null : curOption[ key ];
				}
				curOption[ key ] = value;
			} else {
				if ( value === undefined ) {
					return this.options[ key ] === undefined ? null : this.options[ key ];
				}
				options[ key ] = value;
			}
		}

		this._setOptions( options );

		return this;
	},
	_setOptions: function( options ) {
		var key;

		for ( key in options ) {
			this._setOption( key, options[ key ] );
		}

		return this;
	},
	_setOption: function( key, value ) {
		this.options[ key ] = value;

		if ( key === "disabled" ) {
			this.widget()
				.toggleClass( this.widgetFullName + "-disabled ui-state-disabled", !!value )
				.attr( "aria-disabled", value );
			this.hoverable.removeClass( "ui-state-hover" );
			this.focusable.removeClass( "ui-state-focus" );
		}

		return this;
	},

	enable: function() {
		return this._setOption( "disabled", false );
	},
	disable: function() {
		return this._setOption( "disabled", true );
	},

	_on: function( suppressDisabledCheck, element, handlers ) {
		var delegateElement,
			instance = this;

		// no suppressDisabledCheck flag, shuffle arguments
		if ( typeof suppressDisabledCheck !== "boolean" ) {
			handlers = element;
			element = suppressDisabledCheck;
			suppressDisabledCheck = false;
		}

		// no element argument, shuffle and use this.element
		if ( !handlers ) {
			handlers = element;
			element = this.element;
			delegateElement = this.widget();
		} else {
			// accept selectors, DOM elements
			element = delegateElement = $( element );
			this.bindings = this.bindings.add( element );
		}

		$.each( handlers, function( event, handler ) {
			function handlerProxy() {
				// allow widgets to customize the disabled handling
				// - disabled as an array instead of boolean
				// - disabled class as method for disabling individual parts
				if ( !suppressDisabledCheck &&
						( instance.options.disabled === true ||
							$( this ).hasClass( "ui-state-disabled" ) ) ) {
					return;
				}
				return ( typeof handler === "string" ? instance[ handler ] : handler )
					.apply( instance, arguments );
			}

			// copy the guid so direct unbinding works
			if ( typeof handler !== "string" ) {
				handlerProxy.guid = handler.guid =
					handler.guid || handlerProxy.guid || $.guid++;
			}

			var match = event.match( /^(\w+)\s*(.*)$/ ),
				eventName = match[1] + instance.eventNamespace,
				selector = match[2];
			if ( selector ) {
				delegateElement.delegate( selector, eventName, handlerProxy );
			} else {
				element.bind( eventName, handlerProxy );
			}
		});
	},

	_off: function( element, eventName ) {
		eventName = (eventName || "").split( " " ).join( this.eventNamespace + " " ) + this.eventNamespace;
		element.unbind( eventName ).undelegate( eventName );
	},

	_delay: function( handler, delay ) {
		function handlerProxy() {
			return ( typeof handler === "string" ? instance[ handler ] : handler )
				.apply( instance, arguments );
		}
		var instance = this;
		return setTimeout( handlerProxy, delay || 0 );
	},

	_hoverable: function( element ) {
		this.hoverable = this.hoverable.add( element );
		this._on( element, {
			mouseenter: function( event ) {
				$( event.currentTarget ).addClass( "ui-state-hover" );
			},
			mouseleave: function( event ) {
				$( event.currentTarget ).removeClass( "ui-state-hover" );
			}
		});
	},

	_focusable: function( element ) {
		this.focusable = this.focusable.add( element );
		this._on( element, {
			focusin: function( event ) {
				$( event.currentTarget ).addClass( "ui-state-focus" );
			},
			focusout: function( event ) {
				$( event.currentTarget ).removeClass( "ui-state-focus" );
			}
		});
	},

	_trigger: function( type, event, data ) {
		var prop, orig,
			callback = this.options[ type ];

		data = data || {};
		event = $.Event( event );
		event.type = ( type === this.widgetEventPrefix ?
			type :
			this.widgetEventPrefix + type ).toLowerCase();
		// the original event may come from any element
		// so we need to reset the target on the new event
		event.target = this.element[ 0 ];

		// copy original event properties over to the new event
		orig = event.originalEvent;
		if ( orig ) {
			for ( prop in orig ) {
				if ( !( prop in event ) ) {
					event[ prop ] = orig[ prop ];
				}
			}
		}

		this.element.trigger( event, data );
		return !( $.isFunction( callback ) &&
			callback.apply( this.element[0], [ event ].concat( data ) ) === false ||
			event.isDefaultPrevented() );
	}
};

$.each( { show: "fadeIn", hide: "fadeOut" }, function( method, defaultEffect ) {
	$.Widget.prototype[ "_" + method ] = function( element, options, callback ) {
		if ( typeof options === "string" ) {
			options = { effect: options };
		}
		var hasOptions,
			effectName = !options ?
				method :
				options === true || typeof options === "number" ?
					defaultEffect :
					options.effect || defaultEffect;
		options = options || {};
		if ( typeof options === "number" ) {
			options = { duration: options };
		}
		hasOptions = !$.isEmptyObject( options );
		options.complete = callback;
		if ( options.delay ) {
			element.delay( options.delay );
		}
		if ( hasOptions && $.effects && $.effects.effect[ effectName ] ) {
			element[ method ]( options );
		} else if ( effectName !== method && element[ effectName ] ) {
			element[ effectName ]( options.duration, options.easing, callback );
		} else {
			element.queue(function( next ) {
				$( this )[ method ]();
				if ( callback ) {
					callback.call( element[ 0 ] );
				}
				next();
			});
		}
	};
});

})( jQuery );
(function( $, undefined ) {

var mouseHandled = false;
$( document ).mouseup( function() {
	mouseHandled = false;
});

$.widget("ui.mouse", {
	version: "1.10.3",
	options: {
		cancel: "input,textarea,button,select,option",
		distance: 1,
		delay: 0
	},
	_mouseInit: function() {
		var that = this;

		this.element
			.bind("mousedown."+this.widgetName, function(event) {
				return that._mouseDown(event);
			})
			.bind("click."+this.widgetName, function(event) {
				if (true === $.data(event.target, that.widgetName + ".preventClickEvent")) {
					$.removeData(event.target, that.widgetName + ".preventClickEvent");
					event.stopImmediatePropagation();
					return false;
				}
			});

		this.started = false;
	},

	// TODO: make sure destroying one instance of mouse doesn't mess with
	// other instances of mouse
	_mouseDestroy: function() {
		this.element.unbind("."+this.widgetName);
		if ( this._mouseMoveDelegate ) {
			$(document)
				.unbind("mousemove."+this.widgetName, this._mouseMoveDelegate)
				.unbind("mouseup."+this.widgetName, this._mouseUpDelegate);
		}
	},

	_mouseDown: function(event) {
		// don't let more than one widget handle mouseStart
		if( mouseHandled ) { return; }

		// we may have missed mouseup (out of window)
		(this._mouseStarted && this._mouseUp(event));

		this._mouseDownEvent = event;

		var that = this,
			btnIsLeft = (event.which === 1),
			// event.target.nodeName works around a bug in IE 8 with
			// disabled inputs (#7620)
			elIsCancel = (typeof this.options.cancel === "string" && event.target.nodeName ? $(event.target).closest(this.options.cancel).length : false);
		if (!btnIsLeft || elIsCancel || !this._mouseCapture(event)) {
			return true;
		}

		this.mouseDelayMet = !this.options.delay;
		if (!this.mouseDelayMet) {
			this._mouseDelayTimer = setTimeout(function() {
				that.mouseDelayMet = true;
			}, this.options.delay);
		}

		if (this._mouseDistanceMet(event) && this._mouseDelayMet(event)) {
			this._mouseStarted = (this._mouseStart(event) !== false);
			if (!this._mouseStarted) {
				event.preventDefault();
				return true;
			}
		}

		// Click event may never have fired (Gecko & Opera)
		if (true === $.data(event.target, this.widgetName + ".preventClickEvent")) {
			$.removeData(event.target, this.widgetName + ".preventClickEvent");
		}

		// these delegates are required to keep context
		this._mouseMoveDelegate = function(event) {
			return that._mouseMove(event);
		};
		this._mouseUpDelegate = function(event) {
			return that._mouseUp(event);
		};
		$(document)
			.bind("mousemove."+this.widgetName, this._mouseMoveDelegate)
			.bind("mouseup."+this.widgetName, this._mouseUpDelegate);

		event.preventDefault();

		mouseHandled = true;
		return true;
	},

	_mouseMove: function(event) {
		// IE mouseup check - mouseup happened when mouse was out of window
		if ($.ui.ie && ( !document.documentMode || document.documentMode < 9 ) && !event.button) {
			return this._mouseUp(event);
		}

		if (this._mouseStarted) {
			this._mouseDrag(event);
			return event.preventDefault();
		}

		if (this._mouseDistanceMet(event) && this._mouseDelayMet(event)) {
			this._mouseStarted =
				(this._mouseStart(this._mouseDownEvent, event) !== false);
			(this._mouseStarted ? this._mouseDrag(event) : this._mouseUp(event));
		}

		return !this._mouseStarted;
	},

	_mouseUp: function(event) {
		$(document)
			.unbind("mousemove."+this.widgetName, this._mouseMoveDelegate)
			.unbind("mouseup."+this.widgetName, this._mouseUpDelegate);

		if (this._mouseStarted) {
			this._mouseStarted = false;

			if (event.target === this._mouseDownEvent.target) {
				$.data(event.target, this.widgetName + ".preventClickEvent", true);
			}

			this._mouseStop(event);
		}

		return false;
	},

	_mouseDistanceMet: function(event) {
		return (Math.max(
				Math.abs(this._mouseDownEvent.pageX - event.pageX),
				Math.abs(this._mouseDownEvent.pageY - event.pageY)
			) >= this.options.distance
		);
	},

	_mouseDelayMet: function(/* event */) {
		return this.mouseDelayMet;
	},

	// These are placeholder methods, to be overriden by extending plugin
	_mouseStart: function(/* event */) {},
	_mouseDrag: function(/* event */) {},
	_mouseStop: function(/* event */) {},
	_mouseCapture: function(/* event */) { return true; }
});

})(jQuery);
(function( $, undefined ) {

/*jshint loopfunc: true */

function isOverAxis( x, reference, size ) {
	return ( x > reference ) && ( x < ( reference + size ) );
}

function isFloating(item) {
	return (/left|right/).test(item.css("float")) || (/inline|table-cell/).test(item.css("display"));
}

$.widget("ui.sortable", $.ui.mouse, {
	version: "1.10.3",
	widgetEventPrefix: "sort",
	ready: false,
	options: {
		appendTo: "parent",
		axis: false,
		connectWith: false,
		containment: false,
		cursor: "auto",
		cursorAt: false,
		dropOnEmpty: true,
		forcePlaceholderSize: false,
		forceHelperSize: false,
		grid: false,
		handle: false,
		helper: "original",
		items: "> *",
		opacity: false,
		placeholder: false,
		revert: false,
		scroll: true,
		scrollSensitivity: 20,
		scrollSpeed: 20,
		scope: "default",
		tolerance: "intersect",
		zIndex: 1000,

		// callbacks
		activate: null,
		beforeStop: null,
		change: null,
		deactivate: null,
		out: null,
		over: null,
		receive: null,
		remove: null,
		sort: null,
		start: null,
		stop: null,
		update: null
	},
	_create: function() {

		var o = this.options;
		this.containerCache = {};
		this.element.addClass("ui-sortable");

		//Get the items
		this.refresh();

		//Let's determine if the items are being displayed horizontally
		this.floating = this.items.length ? o.axis === "x" || isFloating(this.items[0].item) : false;

		//Let's determine the parent's offset
		this.offset = this.element.offset();

		//Initialize mouse events for interaction
		this._mouseInit();

		//We're ready to go
		this.ready = true;

	},

	_destroy: function() {
		this.element
			.removeClass("ui-sortable ui-sortable-disabled");
		this._mouseDestroy();

		for ( var i = this.items.length - 1; i >= 0; i-- ) {
			this.items[i].item.removeData(this.widgetName + "-item");
		}

		return this;
	},

	_setOption: function(key, value){
		if ( key === "disabled" ) {
			this.options[ key ] = value;

			this.widget().toggleClass( "ui-sortable-disabled", !!value );
		} else {
			// Don't call widget base _setOption for disable as it adds ui-state-disabled class
			$.Widget.prototype._setOption.apply(this, arguments);
		}
	},

	_mouseCapture: function(event, overrideHandle) {
		var currentItem = null,
			validHandle = false,
			that = this;

		if (this.reverting) {
			return false;
		}

		if(this.options.disabled || this.options.type === "static") {
			return false;
		}

		//We have to refresh the items data once first
		this._refreshItems(event);

		//Find out if the clicked node (or one of its parents) is a actual item in this.items
		$(event.target).parents().each(function() {
			if($.data(this, that.widgetName + "-item") === that) {
				currentItem = $(this);
				return false;
			}
		});
		if($.data(event.target, that.widgetName + "-item") === that) {
			currentItem = $(event.target);
		}

		if(!currentItem) {
			return false;
		}
		if(this.options.handle && !overrideHandle) {
			$(this.options.handle, currentItem).find("*").addBack().each(function() {
				if(this === event.target) {
					validHandle = true;
				}
			});
			if(!validHandle) {
				return false;
			}
		}

		this.currentItem = currentItem;
		this._removeCurrentsFromItems();
		return true;

	},

	_mouseStart: function(event, overrideHandle, noActivation) {

		var i, body,
			o = this.options;

		this.currentContainer = this;

		//We only need to call refreshPositions, because the refreshItems call has been moved to mouseCapture
		this.refreshPositions();

		//Create and append the visible helper
		this.helper = this._createHelper(event);

		//Cache the helper size
		this._cacheHelperProportions();

		/*
		 * - Position generation -
		 * This block generates everything position related - it's the core of draggables.
		 */

		//Cache the margins of the original element
		this._cacheMargins();

		//Get the next scrolling parent
		this.scrollParent = this.helper.scrollParent();

		//The element's absolute position on the page minus margins
		this.offset = this.currentItem.offset();
		this.offset = {
			top: this.offset.top - this.margins.top,
			left: this.offset.left - this.margins.left
		};

		$.extend(this.offset, {
			click: { //Where the click happened, relative to the element
				left: event.pageX - this.offset.left,
				top: event.pageY - this.offset.top
			},
			parent: this._getParentOffset(),
			relative: this._getRelativeOffset() //This is a relative to absolute position minus the actual position calculation - only used for relative positioned helper
		});

		// Only after we got the offset, we can change the helper's position to absolute
		// TODO: Still need to figure out a way to make relative sorting possible
		this.helper.css("position", "absolute");
		this.cssPosition = this.helper.css("position");

		//Generate the original position
		this.originalPosition = this._generatePosition(event);
		this.originalPageX = event.pageX;
		this.originalPageY = event.pageY;

		//Adjust the mouse offset relative to the helper if "cursorAt" is supplied
		(o.cursorAt && this._adjustOffsetFromHelper(o.cursorAt));

		//Cache the former DOM position
		this.domPosition = { prev: this.currentItem.prev()[0], parent: this.currentItem.parent()[0] };

		//If the helper is not the original, hide the original so it's not playing any role during the drag, won't cause anything bad this way
		if(this.helper[0] !== this.currentItem[0]) {
			this.currentItem.hide();
		}

		//Create the placeholder
		this._createPlaceholder();

		//Set a containment if given in the options
		if(o.containment) {
			this._setContainment();
		}

		if( o.cursor && o.cursor !== "auto" ) { // cursor option
			body = this.document.find( "body" );

			// support: IE
			this.storedCursor = body.css( "cursor" );
			body.css( "cursor", o.cursor );

			this.storedStylesheet = $( "<style>*{ cursor: "+o.cursor+" !important; }</style>" ).appendTo( body );
		}

		if(o.opacity) { // opacity option
			if (this.helper.css("opacity")) {
				this._storedOpacity = this.helper.css("opacity");
			}
			this.helper.css("opacity", o.opacity);
		}

		if(o.zIndex) { // zIndex option
			if (this.helper.css("zIndex")) {
				this._storedZIndex = this.helper.css("zIndex");
			}
			this.helper.css("zIndex", o.zIndex);
		}

		//Prepare scrolling
		if(this.scrollParent[0] !== document && this.scrollParent[0].tagName !== "HTML") {
			this.overflowOffset = this.scrollParent.offset();
		}

		//Call callbacks
		this._trigger("start", event, this._uiHash());

		//Recache the helper size
		if(!this._preserveHelperProportions) {
			this._cacheHelperProportions();
		}


		//Post "activate" events to possible containers
		if( !noActivation ) {
			for ( i = this.containers.length - 1; i >= 0; i-- ) {
				this.containers[ i ]._trigger( "activate", event, this._uiHash( this ) );
			}
		}

		//Prepare possible droppables
		if($.ui.ddmanager) {
			$.ui.ddmanager.current = this;
		}

		if ($.ui.ddmanager && !o.dropBehaviour) {
			$.ui.ddmanager.prepareOffsets(this, event);
		}

		this.dragging = true;

		this.helper.addClass("ui-sortable-helper");
		this._mouseDrag(event); //Execute the drag once - this causes the helper not to be visible before getting its correct position
		return true;

	},

	_mouseDrag: function(event) {
		var i, item, itemElement, intersection,
			o = this.options,
			scrolled = false;

		//Compute the helpers position
		this.position = this._generatePosition(event);
		this.positionAbs = this._convertPositionTo("absolute");

		if (!this.lastPositionAbs) {
			this.lastPositionAbs = this.positionAbs;
		}

		//Do scrolling
		if(this.options.scroll) {
			if(this.scrollParent[0] !== document && this.scrollParent[0].tagName !== "HTML") {

				if((this.overflowOffset.top + this.scrollParent[0].offsetHeight) - event.pageY < o.scrollSensitivity) {
					this.scrollParent[0].scrollTop = scrolled = this.scrollParent[0].scrollTop + o.scrollSpeed;
				} else if(event.pageY - this.overflowOffset.top < o.scrollSensitivity) {
					this.scrollParent[0].scrollTop = scrolled = this.scrollParent[0].scrollTop - o.scrollSpeed;
				}

				if((this.overflowOffset.left + this.scrollParent[0].offsetWidth) - event.pageX < o.scrollSensitivity) {
					this.scrollParent[0].scrollLeft = scrolled = this.scrollParent[0].scrollLeft + o.scrollSpeed;
				} else if(event.pageX - this.overflowOffset.left < o.scrollSensitivity) {
					this.scrollParent[0].scrollLeft = scrolled = this.scrollParent[0].scrollLeft - o.scrollSpeed;
				}

			} else {

				if(event.pageY - $(document).scrollTop() < o.scrollSensitivity) {
					scrolled = $(document).scrollTop($(document).scrollTop() - o.scrollSpeed);
				} else if($(window).height() - (event.pageY - $(document).scrollTop()) < o.scrollSensitivity) {
					scrolled = $(document).scrollTop($(document).scrollTop() + o.scrollSpeed);
				}

				if(event.pageX - $(document).scrollLeft() < o.scrollSensitivity) {
					scrolled = $(document).scrollLeft($(document).scrollLeft() - o.scrollSpeed);
				} else if($(window).width() - (event.pageX - $(document).scrollLeft()) < o.scrollSensitivity) {
					scrolled = $(document).scrollLeft($(document).scrollLeft() + o.scrollSpeed);
				}

			}

			if(scrolled !== false && $.ui.ddmanager && !o.dropBehaviour) {
				$.ui.ddmanager.prepareOffsets(this, event);
			}
		}

		//Regenerate the absolute position used for position checks
		this.positionAbs = this._convertPositionTo("absolute");

		//Set the helper position
		if(!this.options.axis || this.options.axis !== "y") {
			this.helper[0].style.left = this.position.left+"px";
		}
		if(!this.options.axis || this.options.axis !== "x") {
			this.helper[0].style.top = this.position.top+"px";
		}

		//Rearrange
		for (i = this.items.length - 1; i >= 0; i--) {

			//Cache variables and intersection, continue if no intersection
			item = this.items[i];
			itemElement = item.item[0];
			intersection = this._intersectsWithPointer(item);
			if (!intersection) {
				continue;
			}

			// Only put the placeholder inside the current Container, skip all
			// items form other containers. This works because when moving
			// an item from one container to another the
			// currentContainer is switched before the placeholder is moved.
			//
			// Without this moving items in "sub-sortables" can cause the placeholder to jitter
			// beetween the outer and inner container.
			if (item.instance !== this.currentContainer) {
				continue;
			}

			// cannot intersect with itself
			// no useless actions that have been done before
			// no action if the item moved is the parent of the item checked
			if (itemElement !== this.currentItem[0] &&
				this.placeholder[intersection === 1 ? "next" : "prev"]()[0] !== itemElement &&
				!$.contains(this.placeholder[0], itemElement) &&
				(this.options.type === "semi-dynamic" ? !$.contains(this.element[0], itemElement) : true)
			) {

				this.direction = intersection === 1 ? "down" : "up";

				if (this.options.tolerance === "pointer" || this._intersectsWithSides(item)) {
					this._rearrange(event, item);
				} else {
					break;
				}

				this._trigger("change", event, this._uiHash());
				break;
			}
		}

		//Post events to containers
		this._contactContainers(event);

		//Interconnect with droppables
		if($.ui.ddmanager) {
			$.ui.ddmanager.drag(this, event);
		}

		//Call callbacks
		this._trigger("sort", event, this._uiHash());

		this.lastPositionAbs = this.positionAbs;
		return false;

	},

	_mouseStop: function(event, noPropagation) {

		if(!event) {
			return;
		}

		//If we are using droppables, inform the manager about the drop
		if ($.ui.ddmanager && !this.options.dropBehaviour) {
			$.ui.ddmanager.drop(this, event);
		}

		if(this.options.revert) {
			var that = this,
				cur = this.placeholder.offset(),
				axis = this.options.axis,
				animation = {};

			if ( !axis || axis === "x" ) {
				animation.left = cur.left - this.offset.parent.left - this.margins.left + (this.offsetParent[0] === document.body ? 0 : this.offsetParent[0].scrollLeft);
			}
			if ( !axis || axis === "y" ) {
				animation.top = cur.top - this.offset.parent.top - this.margins.top + (this.offsetParent[0] === document.body ? 0 : this.offsetParent[0].scrollTop);
			}
			this.reverting = true;
			$(this.helper).animate( animation, parseInt(this.options.revert, 10) || 500, function() {
				that._clear(event);
			});
		} else {
			this._clear(event, noPropagation);
		}

		return false;

	},

	cancel: function() {

		if(this.dragging) {

			this._mouseUp({ target: null });

			if(this.options.helper === "original") {
				this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper");
			} else {
				this.currentItem.show();
			}

			//Post deactivating events to containers
			for (var i = this.containers.length - 1; i >= 0; i--){
				this.containers[i]._trigger("deactivate", null, this._uiHash(this));
				if(this.containers[i].containerCache.over) {
					this.containers[i]._trigger("out", null, this._uiHash(this));
					this.containers[i].containerCache.over = 0;
				}
			}

		}

		if (this.placeholder) {
			//$(this.placeholder[0]).remove(); would have been the jQuery way - unfortunately, it unbinds ALL events from the original node!
			if(this.placeholder[0].parentNode) {
				this.placeholder[0].parentNode.removeChild(this.placeholder[0]);
			}
			if(this.options.helper !== "original" && this.helper && this.helper[0].parentNode) {
				this.helper.remove();
			}

			$.extend(this, {
				helper: null,
				dragging: false,
				reverting: false,
				_noFinalSort: null
			});

			if(this.domPosition.prev) {
				$(this.domPosition.prev).after(this.currentItem);
			} else {
				$(this.domPosition.parent).prepend(this.currentItem);
			}
		}

		return this;

	},

	serialize: function(o) {

		var items = this._getItemsAsjQuery(o && o.connected),
			str = [];
		o = o || {};

		$(items).each(function() {
			var res = ($(o.item || this).attr(o.attribute || "id") || "").match(o.expression || (/(.+)[\-=_](.+)/));
			if (res) {
				str.push((o.key || res[1]+"[]")+"="+(o.key && o.expression ? res[1] : res[2]));
			}
		});

		if(!str.length && o.key) {
			str.push(o.key + "=");
		}

		return str.join("&");

	},

	toArray: function(o) {

		var items = this._getItemsAsjQuery(o && o.connected),
			ret = [];

		o = o || {};

		items.each(function() { ret.push($(o.item || this).attr(o.attribute || "id") || ""); });
		return ret;

	},

	/* Be careful with the following core functions */
	_intersectsWith: function(item) {

		var x1 = this.positionAbs.left,
			x2 = x1 + this.helperProportions.width,
			y1 = this.positionAbs.top,
			y2 = y1 + this.helperProportions.height,
			l = item.left,
			r = l + item.width,
			t = item.top,
			b = t + item.height,
			dyClick = this.offset.click.top,
			dxClick = this.offset.click.left,
			isOverElementHeight = ( this.options.axis === "x" ) || ( ( y1 + dyClick ) > t && ( y1 + dyClick ) < b ),
			isOverElementWidth = ( this.options.axis === "y" ) || ( ( x1 + dxClick ) > l && ( x1 + dxClick ) < r ),
			isOverElement = isOverElementHeight && isOverElementWidth;

		if ( this.options.tolerance === "pointer" ||
			this.options.forcePointerForContainers ||
			(this.options.tolerance !== "pointer" && this.helperProportions[this.floating ? "width" : "height"] > item[this.floating ? "width" : "height"])
		) {
			return isOverElement;
		} else {

			return (l < x1 + (this.helperProportions.width / 2) && // Right Half
				x2 - (this.helperProportions.width / 2) < r && // Left Half
				t < y1 + (this.helperProportions.height / 2) && // Bottom Half
				y2 - (this.helperProportions.height / 2) < b ); // Top Half

		}
	},

	_intersectsWithPointer: function(item) {

		var isOverElementHeight = (this.options.axis === "x") || isOverAxis(this.positionAbs.top + this.offset.click.top, item.top, item.height),
			isOverElementWidth = (this.options.axis === "y") || isOverAxis(this.positionAbs.left + this.offset.click.left, item.left, item.width),
			isOverElement = isOverElementHeight && isOverElementWidth,
			verticalDirection = this._getDragVerticalDirection(),
			horizontalDirection = this._getDragHorizontalDirection();

		if (!isOverElement) {
			return false;
		}

		return this.floating ?
			( ((horizontalDirection && horizontalDirection === "right") || verticalDirection === "down") ? 2 : 1 )
			: ( verticalDirection && (verticalDirection === "down" ? 2 : 1) );

	},

	_intersectsWithSides: function(item) {

		var isOverBottomHalf = isOverAxis(this.positionAbs.top + this.offset.click.top, item.top + (item.height/2), item.height),
			isOverRightHalf = isOverAxis(this.positionAbs.left + this.offset.click.left, item.left + (item.width/2), item.width),
			verticalDirection = this._getDragVerticalDirection(),
			horizontalDirection = this._getDragHorizontalDirection();

		if (this.floating && horizontalDirection) {
			return ((horizontalDirection === "right" && isOverRightHalf) || (horizontalDirection === "left" && !isOverRightHalf));
		} else {
			return verticalDirection && ((verticalDirection === "down" && isOverBottomHalf) || (verticalDirection === "up" && !isOverBottomHalf));
		}

	},

	_getDragVerticalDirection: function() {
		var delta = this.positionAbs.top - this.lastPositionAbs.top;
		return delta !== 0 && (delta > 0 ? "down" : "up");
	},

	_getDragHorizontalDirection: function() {
		var delta = this.positionAbs.left - this.lastPositionAbs.left;
		return delta !== 0 && (delta > 0 ? "right" : "left");
	},

	refresh: function(event) {
		this._refreshItems(event);
		this.refreshPositions();
		return this;
	},

	_connectWith: function() {
		var options = this.options;
		return options.connectWith.constructor === String ? [options.connectWith] : options.connectWith;
	},

	_getItemsAsjQuery: function(connected) {

		var i, j, cur, inst,
			items = [],
			queries = [],
			connectWith = this._connectWith();

		if(connectWith && connected) {
			for (i = connectWith.length - 1; i >= 0; i--){
				cur = $(connectWith[i]);
				for ( j = cur.length - 1; j >= 0; j--){
					inst = $.data(cur[j], this.widgetFullName);
					if(inst && inst !== this && !inst.options.disabled) {
						queries.push([$.isFunction(inst.options.items) ? inst.options.items.call(inst.element) : $(inst.options.items, inst.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"), inst]);
					}
				}
			}
		}

		queries.push([$.isFunction(this.options.items) ? this.options.items.call(this.element, null, { options: this.options, item: this.currentItem }) : $(this.options.items, this.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"), this]);

		for (i = queries.length - 1; i >= 0; i--){
			queries[i][0].each(function() {
				items.push(this);
			});
		}

		return $(items);

	},

	_removeCurrentsFromItems: function() {

		var list = this.currentItem.find(":data(" + this.widgetName + "-item)");

		this.items = $.grep(this.items, function (item) {
			for (var j=0; j < list.length; j++) {
				if(list[j] === item.item[0]) {
					return false;
				}
			}
			return true;
		});

	},

	_refreshItems: function(event) {

		this.items = [];
		this.containers = [this];

		var i, j, cur, inst, targetData, _queries, item, queriesLength,
			items = this.items,
			queries = [[$.isFunction(this.options.items) ? this.options.items.call(this.element[0], event, { item: this.currentItem }) : $(this.options.items, this.element), this]],
			connectWith = this._connectWith();

		if(connectWith && this.ready) { //Shouldn't be run the first time through due to massive slow-down
			for (i = connectWith.length - 1; i >= 0; i--){
				cur = $(connectWith[i]);
				for (j = cur.length - 1; j >= 0; j--){
					inst = $.data(cur[j], this.widgetFullName);
					if(inst && inst !== this && !inst.options.disabled) {
						queries.push([$.isFunction(inst.options.items) ? inst.options.items.call(inst.element[0], event, { item: this.currentItem }) : $(inst.options.items, inst.element), inst]);
						this.containers.push(inst);
					}
				}
			}
		}

		for (i = queries.length - 1; i >= 0; i--) {
			targetData = queries[i][1];
			_queries = queries[i][0];

			for (j=0, queriesLength = _queries.length; j < queriesLength; j++) {
				item = $(_queries[j]);

				item.data(this.widgetName + "-item", targetData); // Data for target checking (mouse manager)

				items.push({
					item: item,
					instance: targetData,
					width: 0, height: 0,
					left: 0, top: 0
				});
			}
		}

	},

	refreshPositions: function(fast) {

		//This has to be redone because due to the item being moved out/into the offsetParent, the offsetParent's position will change
		if(this.offsetParent && this.helper) {
			this.offset.parent = this._getParentOffset();
		}

		var i, item, t, p;

		for (i = this.items.length - 1; i >= 0; i--){
			item = this.items[i];

			//We ignore calculating positions of all connected containers when we're not over them
			if(item.instance !== this.currentContainer && this.currentContainer && item.item[0] !== this.currentItem[0]) {
				continue;
			}

			t = this.options.toleranceElement ? $(this.options.toleranceElement, item.item) : item.item;

			if (!fast) {
				item.width = t.outerWidth();
				item.height = t.outerHeight();
			}

			p = t.offset();
			item.left = p.left;
			item.top = p.top;
		}

		if(this.options.custom && this.options.custom.refreshContainers) {
			this.options.custom.refreshContainers.call(this);
		} else {
			for (i = this.containers.length - 1; i >= 0; i--){
				p = this.containers[i].element.offset();
				this.containers[i].containerCache.left = p.left;
				this.containers[i].containerCache.top = p.top;
				this.containers[i].containerCache.width	= this.containers[i].element.outerWidth();
				this.containers[i].containerCache.height = this.containers[i].element.outerHeight();
			}
		}

		return this;
	},

	_createPlaceholder: function(that) {
		that = that || this;
		var className,
			o = that.options;

		if(!o.placeholder || o.placeholder.constructor === String) {
			className = o.placeholder;
			o.placeholder = {
				element: function() {

					var nodeName = that.currentItem[0].nodeName.toLowerCase(),
						element = $( "<" + nodeName + ">", that.document[0] )
							.addClass(className || that.currentItem[0].className+" ui-sortable-placeholder")
							.removeClass("ui-sortable-helper");

					if ( nodeName === "tr" ) {
						that.currentItem.children().each(function() {
							$( "<td>&#160;</td>", that.document[0] )
								.attr( "colspan", $( this ).attr( "colspan" ) || 1 )
								.appendTo( element );
						});
					} else if ( nodeName === "img" ) {
						element.attr( "src", that.currentItem.attr( "src" ) );
					}

					if ( !className ) {
						element.css( "visibility", "hidden" );
					}

					return element;
				},
				update: function(container, p) {

					// 1. If a className is set as 'placeholder option, we don't force sizes - the class is responsible for that
					// 2. The option 'forcePlaceholderSize can be enabled to force it even if a class name is specified
					if(className && !o.forcePlaceholderSize) {
						return;
					}

					//If the element doesn't have a actual height by itself (without styles coming from a stylesheet), it receives the inline height from the dragged item
					if(!p.height()) { p.height(that.currentItem.innerHeight() - parseInt(that.currentItem.css("paddingTop")||0, 10) - parseInt(that.currentItem.css("paddingBottom")||0, 10)); }
					if(!p.width()) { p.width(that.currentItem.innerWidth() - parseInt(that.currentItem.css("paddingLeft")||0, 10) - parseInt(that.currentItem.css("paddingRight")||0, 10)); }
				}
			};
		}

		//Create the placeholder
		that.placeholder = $(o.placeholder.element.call(that.element, that.currentItem));

		//Append it after the actual current item
		that.currentItem.after(that.placeholder);

		//Update the size of the placeholder (TODO: Logic to fuzzy, see line 316/317)
		o.placeholder.update(that, that.placeholder);

	},

	_contactContainers: function(event) {
		var i, j, dist, itemWithLeastDistance, posProperty, sizeProperty, base, cur, nearBottom, floating,
			innermostContainer = null,
			innermostIndex = null;

		// get innermost container that intersects with item
		for (i = this.containers.length - 1; i >= 0; i--) {

			// never consider a container that's located within the item itself
			if($.contains(this.currentItem[0], this.containers[i].element[0])) {
				continue;
			}

			if(this._intersectsWith(this.containers[i].containerCache)) {

				// if we've already found a container and it's more "inner" than this, then continue
				if(innermostContainer && $.contains(this.containers[i].element[0], innermostContainer.element[0])) {
					continue;
				}

				innermostContainer = this.containers[i];
				innermostIndex = i;

			} else {
				// container doesn't intersect. trigger "out" event if necessary
				if(this.containers[i].containerCache.over) {
					this.containers[i]._trigger("out", event, this._uiHash(this));
					this.containers[i].containerCache.over = 0;
				}
			}

		}

		// if no intersecting containers found, return
		if(!innermostContainer) {
			return;
		}

		// move the item into the container if it's not there already
		if(this.containers.length === 1) {
			if (!this.containers[innermostIndex].containerCache.over) {
				this.containers[innermostIndex]._trigger("over", event, this._uiHash(this));
				this.containers[innermostIndex].containerCache.over = 1;
			}
		} else {

			//When entering a new container, we will find the item with the least distance and append our item near it
			dist = 10000;
			itemWithLeastDistance = null;
			floating = innermostContainer.floating || isFloating(this.currentItem);
			posProperty = floating ? "left" : "top";
			sizeProperty = floating ? "width" : "height";
			base = this.positionAbs[posProperty] + this.offset.click[posProperty];
			for (j = this.items.length - 1; j >= 0; j--) {
				if(!$.contains(this.containers[innermostIndex].element[0], this.items[j].item[0])) {
					continue;
				}
				if(this.items[j].item[0] === this.currentItem[0]) {
					continue;
				}
				if (floating && !isOverAxis(this.positionAbs.top + this.offset.click.top, this.items[j].top, this.items[j].height)) {
					continue;
				}
				cur = this.items[j].item.offset()[posProperty];
				nearBottom = false;
				if(Math.abs(cur - base) > Math.abs(cur + this.items[j][sizeProperty] - base)){
					nearBottom = true;
					cur += this.items[j][sizeProperty];
				}

				if(Math.abs(cur - base) < dist) {
					dist = Math.abs(cur - base); itemWithLeastDistance = this.items[j];
					this.direction = nearBottom ? "up": "down";
				}
			}

			//Check if dropOnEmpty is enabled
			if(!itemWithLeastDistance && !this.options.dropOnEmpty) {
				return;
			}

			if(this.currentContainer === this.containers[innermostIndex]) {
				return;
			}

			itemWithLeastDistance ? this._rearrange(event, itemWithLeastDistance, null, true) : this._rearrange(event, null, this.containers[innermostIndex].element, true);
			this._trigger("change", event, this._uiHash());
			this.containers[innermostIndex]._trigger("change", event, this._uiHash(this));
			this.currentContainer = this.containers[innermostIndex];

			//Update the placeholder
			this.options.placeholder.update(this.currentContainer, this.placeholder);

			this.containers[innermostIndex]._trigger("over", event, this._uiHash(this));
			this.containers[innermostIndex].containerCache.over = 1;
		}


	},

	_createHelper: function(event) {

		var o = this.options,
			helper = $.isFunction(o.helper) ? $(o.helper.apply(this.element[0], [event, this.currentItem])) : (o.helper === "clone" ? this.currentItem.clone() : this.currentItem);

		//Add the helper to the DOM if that didn't happen already
		if(!helper.parents("body").length) {
			$(o.appendTo !== "parent" ? o.appendTo : this.currentItem[0].parentNode)[0].appendChild(helper[0]);
		}

		if(helper[0] === this.currentItem[0]) {
			this._storedCSS = { width: this.currentItem[0].style.width, height: this.currentItem[0].style.height, position: this.currentItem.css("position"), top: this.currentItem.css("top"), left: this.currentItem.css("left") };
		}

		if(!helper[0].style.width || o.forceHelperSize) {
			helper.width(this.currentItem.width());
		}
		if(!helper[0].style.height || o.forceHelperSize) {
			helper.height(this.currentItem.height());
		}

		return helper;

	},

	_adjustOffsetFromHelper: function(obj) {
		if (typeof obj === "string") {
			obj = obj.split(" ");
		}
		if ($.isArray(obj)) {
			obj = {left: +obj[0], top: +obj[1] || 0};
		}
		if ("left" in obj) {
			this.offset.click.left = obj.left + this.margins.left;
		}
		if ("right" in obj) {
			this.offset.click.left = this.helperProportions.width - obj.right + this.margins.left;
		}
		if ("top" in obj) {
			this.offset.click.top = obj.top + this.margins.top;
		}
		if ("bottom" in obj) {
			this.offset.click.top = this.helperProportions.height - obj.bottom + this.margins.top;
		}
	},

	_getParentOffset: function() {


		//Get the offsetParent and cache its position
		this.offsetParent = this.helper.offsetParent();
		var po = this.offsetParent.offset();

		// This is a special case where we need to modify a offset calculated on start, since the following happened:
		// 1. The position of the helper is absolute, so it's position is calculated based on the next positioned parent
		// 2. The actual offset parent is a child of the scroll parent, and the scroll parent isn't the document, which means that
		//    the scroll is included in the initial calculation of the offset of the parent, and never recalculated upon drag
		if(this.cssPosition === "absolute" && this.scrollParent[0] !== document && $.contains(this.scrollParent[0], this.offsetParent[0])) {
			po.left += this.scrollParent.scrollLeft();
			po.top += this.scrollParent.scrollTop();
		}

		// This needs to be actually done for all browsers, since pageX/pageY includes this information
		// with an ugly IE fix
		if( this.offsetParent[0] === document.body || (this.offsetParent[0].tagName && this.offsetParent[0].tagName.toLowerCase() === "html" && $.ui.ie)) {
			po = { top: 0, left: 0 };
		}

		return {
			top: po.top + (parseInt(this.offsetParent.css("borderTopWidth"),10) || 0),
			left: po.left + (parseInt(this.offsetParent.css("borderLeftWidth"),10) || 0)
		};

	},

	_getRelativeOffset: function() {

		if(this.cssPosition === "relative") {
			var p = this.currentItem.position();
			return {
				top: p.top - (parseInt(this.helper.css("top"),10) || 0) + this.scrollParent.scrollTop(),
				left: p.left - (parseInt(this.helper.css("left"),10) || 0) + this.scrollParent.scrollLeft()
			};
		} else {
			return { top: 0, left: 0 };
		}

	},

	_cacheMargins: function() {
		this.margins = {
			left: (parseInt(this.currentItem.css("marginLeft"),10) || 0),
			top: (parseInt(this.currentItem.css("marginTop"),10) || 0)
		};
	},

	_cacheHelperProportions: function() {
		this.helperProportions = {
			width: this.helper.outerWidth(),
			height: this.helper.outerHeight()
		};
	},

	_setContainment: function() {

		var ce, co, over,
			o = this.options;
		if(o.containment === "parent") {
			o.containment = this.helper[0].parentNode;
		}
		if(o.containment === "document" || o.containment === "window") {
			this.containment = [
				0 - this.offset.relative.left - this.offset.parent.left,
				0 - this.offset.relative.top - this.offset.parent.top,
				$(o.containment === "document" ? document : window).width() - this.helperProportions.width - this.margins.left,
				($(o.containment === "document" ? document : window).height() || document.body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top
			];
		}

		if(!(/^(document|window|parent)$/).test(o.containment)) {
			ce = $(o.containment)[0];
			co = $(o.containment).offset();
			over = ($(ce).css("overflow") !== "hidden");

			this.containment = [
				co.left + (parseInt($(ce).css("borderLeftWidth"),10) || 0) + (parseInt($(ce).css("paddingLeft"),10) || 0) - this.margins.left,
				co.top + (parseInt($(ce).css("borderTopWidth"),10) || 0) + (parseInt($(ce).css("paddingTop"),10) || 0) - this.margins.top,
				co.left+(over ? Math.max(ce.scrollWidth,ce.offsetWidth) : ce.offsetWidth) - (parseInt($(ce).css("borderLeftWidth"),10) || 0) - (parseInt($(ce).css("paddingRight"),10) || 0) - this.helperProportions.width - this.margins.left,
				co.top+(over ? Math.max(ce.scrollHeight,ce.offsetHeight) : ce.offsetHeight) - (parseInt($(ce).css("borderTopWidth"),10) || 0) - (parseInt($(ce).css("paddingBottom"),10) || 0) - this.helperProportions.height - this.margins.top
			];
		}

	},

	_convertPositionTo: function(d, pos) {

		if(!pos) {
			pos = this.position;
		}
		var mod = d === "absolute" ? 1 : -1,
			scroll = this.cssPosition === "absolute" && !(this.scrollParent[0] !== document && $.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent,
			scrollIsRootNode = (/(html|body)/i).test(scroll[0].tagName);

		return {
			top: (
				pos.top	+																// The absolute mouse position
				this.offset.relative.top * mod +										// Only for relative positioned nodes: Relative offset from element to offset parent
				this.offset.parent.top * mod -											// The offsetParent's offset without borders (offset + border)
				( ( this.cssPosition === "fixed" ? -this.scrollParent.scrollTop() : ( scrollIsRootNode ? 0 : scroll.scrollTop() ) ) * mod)
			),
			left: (
				pos.left +																// The absolute mouse position
				this.offset.relative.left * mod +										// Only for relative positioned nodes: Relative offset from element to offset parent
				this.offset.parent.left * mod	-										// The offsetParent's offset without borders (offset + border)
				( ( this.cssPosition === "fixed" ? -this.scrollParent.scrollLeft() : scrollIsRootNode ? 0 : scroll.scrollLeft() ) * mod)
			)
		};

	},

	_generatePosition: function(event) {

		var top, left,
			o = this.options,
			pageX = event.pageX,
			pageY = event.pageY,
			scroll = this.cssPosition === "absolute" && !(this.scrollParent[0] !== document && $.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent, scrollIsRootNode = (/(html|body)/i).test(scroll[0].tagName);

		// This is another very weird special case that only happens for relative elements:
		// 1. If the css position is relative
		// 2. and the scroll parent is the document or similar to the offset parent
		// we have to refresh the relative offset during the scroll so there are no jumps
		if(this.cssPosition === "relative" && !(this.scrollParent[0] !== document && this.scrollParent[0] !== this.offsetParent[0])) {
			this.offset.relative = this._getRelativeOffset();
		}

		/*
		 * - Position constraining -
		 * Constrain the position to a mix of grid, containment.
		 */

		if(this.originalPosition) { //If we are not dragging yet, we won't check for options

			if(this.containment) {
				if(event.pageX - this.offset.click.left < this.containment[0]) {
					pageX = this.containment[0] + this.offset.click.left;
				}
				if(event.pageY - this.offset.click.top < this.containment[1]) {
					pageY = this.containment[1] + this.offset.click.top;
				}
				if(event.pageX - this.offset.click.left > this.containment[2]) {
					pageX = this.containment[2] + this.offset.click.left;
				}
				if(event.pageY - this.offset.click.top > this.containment[3]) {
					pageY = this.containment[3] + this.offset.click.top;
				}
			}

			if(o.grid) {
				top = this.originalPageY + Math.round((pageY - this.originalPageY) / o.grid[1]) * o.grid[1];
				pageY = this.containment ? ( (top - this.offset.click.top >= this.containment[1] && top - this.offset.click.top <= this.containment[3]) ? top : ((top - this.offset.click.top >= this.containment[1]) ? top - o.grid[1] : top + o.grid[1])) : top;

				left = this.originalPageX + Math.round((pageX - this.originalPageX) / o.grid[0]) * o.grid[0];
				pageX = this.containment ? ( (left - this.offset.click.left >= this.containment[0] && left - this.offset.click.left <= this.containment[2]) ? left : ((left - this.offset.click.left >= this.containment[0]) ? left - o.grid[0] : left + o.grid[0])) : left;
			}

		}

		return {
			top: (
				pageY -																// The absolute mouse position
				this.offset.click.top -													// Click offset (relative to the element)
				this.offset.relative.top	-											// Only for relative positioned nodes: Relative offset from element to offset parent
				this.offset.parent.top +												// The offsetParent's offset without borders (offset + border)
				( ( this.cssPosition === "fixed" ? -this.scrollParent.scrollTop() : ( scrollIsRootNode ? 0 : scroll.scrollTop() ) ))
			),
			left: (
				pageX -																// The absolute mouse position
				this.offset.click.left -												// Click offset (relative to the element)
				this.offset.relative.left	-											// Only for relative positioned nodes: Relative offset from element to offset parent
				this.offset.parent.left +												// The offsetParent's offset without borders (offset + border)
				( ( this.cssPosition === "fixed" ? -this.scrollParent.scrollLeft() : scrollIsRootNode ? 0 : scroll.scrollLeft() ))
			)
		};

	},

	_rearrange: function(event, i, a, hardRefresh) {

		a ? a[0].appendChild(this.placeholder[0]) : i.item[0].parentNode.insertBefore(this.placeholder[0], (this.direction === "down" ? i.item[0] : i.item[0].nextSibling));

		//Various things done here to improve the performance:
		// 1. we create a setTimeout, that calls refreshPositions
		// 2. on the instance, we have a counter variable, that get's higher after every append
		// 3. on the local scope, we copy the counter variable, and check in the timeout, if it's still the same
		// 4. this lets only the last addition to the timeout stack through
		this.counter = this.counter ? ++this.counter : 1;
		var counter = this.counter;

		this._delay(function() {
			if(counter === this.counter) {
				this.refreshPositions(!hardRefresh); //Precompute after each DOM insertion, NOT on mousemove
			}
		});

	},

	_clear: function(event, noPropagation) {

		this.reverting = false;
		// We delay all events that have to be triggered to after the point where the placeholder has been removed and
		// everything else normalized again
		var i,
			delayedTriggers = [];

		// We first have to update the dom position of the actual currentItem
		// Note: don't do it if the current item is already removed (by a user), or it gets reappended (see #4088)
		if(!this._noFinalSort && this.currentItem.parent().length) {
			this.placeholder.before(this.currentItem);
		}
		this._noFinalSort = null;

		if(this.helper[0] === this.currentItem[0]) {
			for(i in this._storedCSS) {
				if(this._storedCSS[i] === "auto" || this._storedCSS[i] === "static") {
					this._storedCSS[i] = "";
				}
			}
			this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper");
		} else {
			this.currentItem.show();
		}

		if(this.fromOutside && !noPropagation) {
			delayedTriggers.push(function(event) { this._trigger("receive", event, this._uiHash(this.fromOutside)); });
		}
		if((this.fromOutside || this.domPosition.prev !== this.currentItem.prev().not(".ui-sortable-helper")[0] || this.domPosition.parent !== this.currentItem.parent()[0]) && !noPropagation) {
			delayedTriggers.push(function(event) { this._trigger("update", event, this._uiHash()); }); //Trigger update callback if the DOM position has changed
		}

		// Check if the items Container has Changed and trigger appropriate
		// events.
		if (this !== this.currentContainer) {
			if(!noPropagation) {
				delayedTriggers.push(function(event) { this._trigger("remove", event, this._uiHash()); });
				delayedTriggers.push((function(c) { return function(event) { c._trigger("receive", event, this._uiHash(this)); };  }).call(this, this.currentContainer));
				delayedTriggers.push((function(c) { return function(event) { c._trigger("update", event, this._uiHash(this));  }; }).call(this, this.currentContainer));
			}
		}


		//Post events to containers
		for (i = this.containers.length - 1; i >= 0; i--){
			if(!noPropagation) {
				delayedTriggers.push((function(c) { return function(event) { c._trigger("deactivate", event, this._uiHash(this)); };  }).call(this, this.containers[i]));
			}
			if(this.containers[i].containerCache.over) {
				delayedTriggers.push((function(c) { return function(event) { c._trigger("out", event, this._uiHash(this)); };  }).call(this, this.containers[i]));
				this.containers[i].containerCache.over = 0;
			}
		}

		//Do what was originally in plugins
		if ( this.storedCursor ) {
			this.document.find( "body" ).css( "cursor", this.storedCursor );
			this.storedStylesheet.remove();
		}
		if(this._storedOpacity) {
			this.helper.css("opacity", this._storedOpacity);
		}
		if(this._storedZIndex) {
			this.helper.css("zIndex", this._storedZIndex === "auto" ? "" : this._storedZIndex);
		}

		this.dragging = false;
		if(this.cancelHelperRemoval) {
			if(!noPropagation) {
				this._trigger("beforeStop", event, this._uiHash());
				for (i=0; i < delayedTriggers.length; i++) {
					delayedTriggers[i].call(this, event);
				} //Trigger all delayed events
				this._trigger("stop", event, this._uiHash());
			}

			this.fromOutside = false;
			return false;
		}

		if(!noPropagation) {
			this._trigger("beforeStop", event, this._uiHash());
		}

		//$(this.placeholder[0]).remove(); would have been the jQuery way - unfortunately, it unbinds ALL events from the original node!
		this.placeholder[0].parentNode.removeChild(this.placeholder[0]);

		if(this.helper[0] !== this.currentItem[0]) {
			this.helper.remove();
		}
		this.helper = null;

		if(!noPropagation) {
			for (i=0; i < delayedTriggers.length; i++) {
				delayedTriggers[i].call(this, event);
			} //Trigger all delayed events
			this._trigger("stop", event, this._uiHash());
		}

		this.fromOutside = false;
		return true;

	},

	_trigger: function() {
		if ($.Widget.prototype._trigger.apply(this, arguments) === false) {
			this.cancel();
		}
	},

	_uiHash: function(_inst) {
		var inst = _inst || this;
		return {
			helper: inst.helper,
			placeholder: inst.placeholder || $([]),
			position: inst.position,
			originalPosition: inst.originalPosition,
			offset: inst.positionAbs,
			item: inst.currentItem,
			sender: _inst ? _inst.element : null
		};
	}

});

})(jQuery);
;/* jQuery Tiny Pub/Sub - v0.7 - 10/27/2011
 * http://benalman.com/
 * Copyright (c) 2011 "Cowboy" Ben Alman; Licensed MIT, GPL */

(function($) {

  var o = $({});

  $.subscribe = function() {
    //console.log("SUBSCRIBE: " + arguments[0]);
    o.on.apply(o, arguments);
  };

  $.unsubscribe = function() {
    o.off.apply(o, arguments);
  };

  $.publish = function() {
    //console.log("PUBLISH: " + arguments[0]);
    o.trigger.apply(o, arguments);
  };

}(jQuery));


;/* ===========================================================
 * bootstrap-tooltip.js v2.1.1
 * http://twitter.github.com/bootstrap/javascript.html#tooltips
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ===========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* TOOLTIP PUBLIC CLASS DEFINITION
  * =============================== */

  var Tooltip = function (element, options) {
    this.init('tooltip', element, options)
  }

  Tooltip.prototype = {

    constructor: Tooltip

  , init: function (type, element, options) {
      var eventIn
        , eventOut

      this.type = type
      this.$element = $(element)
      this.options = this.getOptions(options)
      this.enabled = true

      if (this.options.trigger == 'click') {
        this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
      } else if (this.options.trigger != 'manual') {
        eventIn = this.options.trigger == 'hover' ? 'mouseenter' : 'focus'
        eventOut = this.options.trigger == 'hover' ? 'mouseleave' : 'blur'
        this.$element.on(eventIn + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
        this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
      }

      this.options.selector ?
        (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
        this.fixTitle()
    }

  , getOptions: function (options) {
      options = $.extend({}, $.fn[this.type].defaults, options, this.$element.data())

      if (options.delay && typeof options.delay == 'number') {
        options.delay = {
          show: options.delay
        , hide: options.delay
        }
      }

      return options
    }

  , enter: function (e) {
      var self = $(e.currentTarget)[this.type](this._options).data(this.type)

      if (!self.options.delay || !self.options.delay.show) return self.show()

      clearTimeout(this.timeout)
      self.hoverState = 'in'
      this.timeout = setTimeout(function() {
        if (self.hoverState == 'in') self.show()
      }, self.options.delay.show)
    }

  , leave: function (e) {
      var self = $(e.currentTarget)[this.type](this._options).data(this.type)

      if (this.timeout) clearTimeout(this.timeout)
      if (!self.options.delay || !self.options.delay.hide) return self.hide()

      self.hoverState = 'out'
      this.timeout = setTimeout(function() {
        if (self.hoverState == 'out') self.hide()
      }, self.options.delay.hide)
    }

  , show: function () {
      var $tip
        , inside
        , pos
        , actualWidth
        , actualHeight
        , placement
        , tp

      if (this.hasContent() && this.enabled) {
        $tip = this.tip()
        this.setContent()

        if (this.options.animation) {
          $tip.addClass('fade')
        }

        placement = typeof this.options.placement == 'function' ?
          this.options.placement.call(this, $tip[0], this.$element[0]) :
          this.options.placement

        inside = /in/.test(placement)

        $tip
          .remove()
          .css({ top: 0, left: 0, display: 'block' })
          .appendTo(inside ? this.$element : document.body)

        pos = this.getPosition(inside)

        actualWidth = $tip[0].offsetWidth
        actualHeight = $tip[0].offsetHeight

        switch (inside ? placement.split(' ')[1] : placement) {
          case 'bottom':
            tp = {top: pos.top + pos.height, left: pos.left + pos.width / 2 - actualWidth / 2}
            break
          case 'top':
            tp = {top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2}
            break
          case 'left':
            tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth}
            break
          case 'right':
            tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width}
            break
        }

        $tip
          .css(tp)
          .addClass(placement)
          .addClass('in')
      }
    }

  , setContent: function () {
      var $tip = this.tip()
        , title = this.getTitle()

      $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
      $tip.removeClass('fade in top bottom left right')
    }

  , hide: function () {
      var that = this
        , $tip = this.tip()

      $tip.removeClass('in')

      function removeWithAnimation() {
        var timeout = setTimeout(function () {
          $tip.off($.support.transition.end).remove()
        }, 500)

        $tip.one($.support.transition.end, function () {
          clearTimeout(timeout)
          $tip.remove()
        })
      }

      $.support.transition && this.$tip.hasClass('fade') ?
        removeWithAnimation() :
        $tip.remove()

      return this
    }

  , fixTitle: function () {
      var $e = this.$element
      if ($e.attr('title') || typeof($e.attr('data-original-title')) != 'string') {
        $e.attr('data-original-title', $e.attr('title') || '').removeAttr('title')
      }
    }

  , hasContent: function () {
      return this.getTitle()
    }

  , getPosition: function (inside) {
      return $.extend({}, (inside ? {top: 0, left: 0} : this.$element.offset()), {
        width: this.$element[0].offsetWidth
      , height: this.$element[0].offsetHeight
      })
    }

  , getTitle: function () {
      var title
        , $e = this.$element
        , o = this.options

      title = $e.attr('data-original-title')
        || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

      return title
    }

  , tip: function () {
      return this.$tip = this.$tip || $(this.options.template)
    }

  , validate: function () {
      if (!this.$element[0].parentNode) {
        this.hide()
        this.$element = null
        this.options = null
      }
    }

  , enable: function () {
      this.enabled = true
    }

  , disable: function () {
      this.enabled = false
    }

  , toggleEnabled: function () {
      this.enabled = !this.enabled
    }

  , toggle: function () {
      this[this.tip().hasClass('in') ? 'hide' : 'show']()
    }

  , destroy: function () {
      this.hide().$element.off('.' + this.type).removeData(this.type)
    }

  }


 /* TOOLTIP PLUGIN DEFINITION
  * ========================= */

  $.fn.tooltip = function ( option ) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('tooltip')
        , options = typeof option == 'object' && option
      if (!data) $this.data('tooltip', (data = new Tooltip(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tooltip.Constructor = Tooltip

  $.fn.tooltip.defaults = {
    animation: true
  , placement: 'top'
  , selector: false
  , template: '<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
  , trigger: 'hover'
  , title: ''
  , delay: 0
  , html: true
  }

}(window.jQuery);
;(function () {
    try {
        var workerAsString = "(function (b) { function a(b, d) { if ({}.hasOwnProperty.call(a.cache, b)) return a.cache[b]; var e = a.resolve(b); if (!e) throw new Error('Failed to resolve module ' + b); var c = { id: b, require: a, filename: b, exports: {}, loaded: !1, parent: d, children: [] }; d && d.children.push(c); var f = b.slice(0, b.lastIndexOf('/') + 1); return a.cache[b] = c.exports, e.call(c.exports, c, c.exports, f, b), c.loaded = !0, a.cache[b] = c.exports } a.modules = {}, a.cache = {}, a.resolve = function (b) { return {}.hasOwnProperty.call(a.modules, b) ? a.modules[b] : void 0 }, a.define = function (b, c) { a.modules[b] = c }, a.define('/gif.worker.coffee', function (d, e, f, g) { var b, c; b = a('/GIFEncoder.js', d), c = function (a) { var c, e, d, f; return c = new b(a.width, a.height), a.index === 0 ? c.writeHeader() : c.firstFrame = !1, c.setTransparent(a.transparent), c.setRepeat(a.repeat), c.setDelay(a.delay), c.setQuality(a.quality), c.setPreserveColors(a.preserveColors), c.addFrame(a.data), a.last && c.finish(), d = c.stream(), a.data = d.pages, a.cursor = d.cursor, a.pageSize = d.constructor.pageSize, a.canTransfer ? (f = function (c) { for (var b = 0, d = a.data.length; b < d; ++b)e = a.data[b], c.push(e.buffer); return c }.call(this, []), self.postMessage(a, f)) : self.postMessage(a) }, self.onmessage = function (a) { return c(a.data) } }), a.define('/GIFEncoder.js', function (e, k, i, j) { function c() { this.page = -1, this.pages = [], this.newPage() } function b(a, b) { this.width = ~~a, this.height = ~~b, this.transparent = null, this.transIndex = 0, this.repeat = -1, this.delay = 0, this.image = null, this.pixels = null, this.indexedPixels = null, this.colorDepth = null, this.colorTab = null, this.usedEntry = new Array, this.palSize = 7, this.dispose = -1, this.firstFrame = !0, this.sample = 10, this.out = new c } var f = a('/TypedNeuQuant.js', e), g = a('/SimpleQuant.js', e), h = a('/LZWEncoder.js', e); c.pageSize = 4096, c.charMap = {}; for (var d = 0; d < 256; d++)c.charMap[d] = String.fromCharCode(d); c.prototype.newPage = function () { this.pages[++this.page] = new Uint8Array(c.pageSize), this.cursor = 0 }, c.prototype.getData = function () { var d = ''; for (var a = 0; a < this.pages.length; a++)for (var b = 0; b < c.pageSize; b++)d += c.charMap[this.pages[a][b]]; return d }, c.prototype.writeByte = function (a) { this.cursor >= c.pageSize && this.newPage(), this.pages[this.page][this.cursor++] = a }, c.prototype.writeUTFBytes = function (b) { for (var c = b.length, a = 0; a < c; a++)this.writeByte(b.charCodeAt(a)) }, c.prototype.writeBytes = function (b, d, e) { for (var c = e || b.length, a = d || 0; a < c; a++)this.writeByte(b[a]) }, b.prototype.setDelay = function (a) { this.delay = Math.round(a / 10) }, b.prototype.setFrameRate = function (a) { this.delay = Math.round(100 / a) }, b.prototype.setDispose = function (a) { a >= 0 && (this.dispose = a) }, b.prototype.setRepeat = function (a) { this.repeat = a }, b.prototype.setTransparent = function (a) { this.transparent = a }, b.prototype.setPreserveColors = function (a) { this.preserveColors = a }, b.prototype.addFrame = function (a) { this.image = a, this.getImagePixels(), this.analyzePixels(), this.firstFrame && (this.writeLSD(), this.writePalette(), this.repeat >= 0 && this.writeNetscapeExt()), this.writeGraphicCtrlExt(), this.writeImageDesc(), this.firstFrame || this.writePalette(), this.writePixels(), this.firstFrame = !1 }, b.prototype.finish = function () { this.out.writeByte(59) }, b.prototype.setQuality = function (a) { a < 1 && (a = 1), this.sample = a }, b.prototype.writeHeader = function () { this.out.writeUTFBytes('GIF89a') }, b.prototype.analyzePixels = function () { var h = this.pixels.length, d = h / 3; this.indexedPixels = new Uint8Array(d); var a; if (this.preserveColors) { var i = this.toRGBComponents(this.transparent); a = new g(this.pixels, this.sample, i) } else a = new f(this.pixels, this.sample); a.buildColormap(), this.colorTab = a.getColormap(); var b = 0; for (var c = 0; c < d; c++) { var e = a.lookupRGB(this.pixels[b++] & 255, this.pixels[b++] & 255, this.pixels[b++] & 255); this.usedEntry[e] = !0, this.indexedPixels[c] = e } this.pixels = null, this.colorDepth = 8, this.palSize = 7, this.transparent !== null && (this.transIndex = this.findClosest(this.transparent)) }, b.prototype.toRGBComponents = function (a) { var b = null; return a && (b = { r: (a & 16711680) >> 16, g: (a & 65280) >> 8, b: a & 255 }), b }, b.prototype.findClosest = function (e) { if (this.colorTab === null) return -1; var k = (e & 16711680) >> 16, l = (e & 65280) >> 8, m = e & 255, c = 0, d = 16777216, j = this.colorTab.length; for (var a = 0; a < j;) { var f = k - (this.colorTab[a++] & 255), g = l - (this.colorTab[a++] & 255), h = m - (this.colorTab[a] & 255), i = f * f + g * g + h * h, b = parseInt(a / 3); (this.preserveColors || this.usedEntry[b]) && i < d && (d = i, c = b), a++ } return c }, b.prototype.getImagePixels = function () { var a = this.width, g = this.height; this.pixels = new Uint8Array(a * g * 3); var b = this.image, c = 0; for (var d = 0; d < g; d++)for (var e = 0; e < a; e++) { var f = d * a * 4 + e * 4; this.pixels[c++] = b[f], this.pixels[c++] = b[f + 1], this.pixels[c++] = b[f + 2] } }, b.prototype.writeGraphicCtrlExt = function () { this.out.writeByte(33), this.out.writeByte(249), this.out.writeByte(4); var b, a; this.transparent === null ? (b = 0, a = 0) : (b = 1, a = 2), this.dispose >= 0 && (a = dispose & 7), a <<= 2, this.out.writeByte(0 | a | 0 | b), this.writeShort(this.delay), this.out.writeByte(this.transIndex), this.out.writeByte(0) }, b.prototype.writeImageDesc = function () { this.out.writeByte(44), this.writeShort(0), this.writeShort(0), this.writeShort(this.width), this.writeShort(this.height), this.firstFrame ? this.out.writeByte(0) : this.out.writeByte(128 | this.palSize) }, b.prototype.writeLSD = function () { this.writeShort(this.width), this.writeShort(this.height), this.out.writeByte(240 | this.palSize), this.out.writeByte(0), this.out.writeByte(0) }, b.prototype.writeNetscapeExt = function () { this.out.writeByte(33), this.out.writeByte(255), this.out.writeByte(11), this.out.writeUTFBytes('NETSCAPE2.0'), this.out.writeByte(3), this.out.writeByte(1), this.writeShort(this.repeat), this.out.writeByte(0) }, b.prototype.writePalette = function () { this.out.writeBytes(this.colorTab); var b = 768 - this.colorTab.length; for (var a = 0; a < b; a++)this.out.writeByte(0) }, b.prototype.writeShort = function (a) { this.out.writeByte(a & 255), this.out.writeByte(a >> 8 & 255) }, b.prototype.writePixels = function () { var a = new h(this.width, this.height, this.indexedPixels, this.colorDepth); a.encode(this.out) }, b.prototype.stream = function () { return this.out }, e.exports = b }), a.define('/LZWEncoder.js', function (e, g, h, i) { function f(y, D, C, B) { function w(a, b) { r[f++] = a, f >= 254 && t(b) } function x(b) { u(a), k = i + 2, j = !0, l(i, b) } function u(b) { for (var a = 0; a < b; ++a)h[a] = -1 } function A(z, r) { var g, t, d, e, y, w, s; for (q = z, j = !1, n_bits = q, m = p(n_bits), i = 1 << z - 1, o = i + 1, k = i + 2, f = 0, e = v(), s = 0, g = a; g < 65536; g *= 2)++s; s = 8 - s, w = a, u(w), l(i, r); a: while ((t = v()) != c) { if (g = (t << b) + e, d = t << s ^ e, h[d] === g) { e = n[d]; continue } if (h[d] >= 0) { y = w - d, d === 0 && (y = 1); do if ((d -= y) < 0 && (d += w), h[d] === g) { e = n[d]; continue a } while (h[d] >= 0) } l(e, r), e = t, k < 1 << b ? (n[d] = k++, h[d] = g) : x(r) } l(e, r), l(o, r) } function z(a) { a.writeByte(s), remaining = y * D, curPixel = 0, A(s + 1, a), a.writeByte(0) } function t(a) { f > 0 && (a.writeByte(f), a.writeBytes(r, 0, f), f = 0) } function p(a) { return (1 << a) - 1 } function v() { if (remaining === 0) return c; --remaining; var a = C[curPixel++]; return a & 255 } function l(a, c) { g &= d[e], e > 0 ? g |= a << e : g = a, e += n_bits; while (e >= 8) w(g & 255, c), g >>= 8, e -= 8; if ((k > m || j) && (j ? (m = p(n_bits = q), j = !1) : (++n_bits, n_bits == b ? m = 1 << b : m = p(n_bits))), a == o) { while (e > 0) w(g & 255, c), g >>= 8, e -= 8; t(c) } } var s = Math.max(2, B), r = new Uint8Array(256), h = new Int32Array(a), n = new Int32Array(a), g, e = 0, f, k = 0, m, j = !1, q, i, o; this.encode = z } var c = -1, b = 12, a = 5003, d = [0, 1, 3, 7, 15, 31, 63, 127, 255, 511, 1023, 2047, 4095, 8191, 16383, 32767, 65535]; e.exports = f }), a.define('/SimpleQuant.js', function (b, d, e, f) { function a(a, b, c) { return [a, b, c].join('.') } function c(c, d, b) { this.pixels = c, this.palette = [], this.paletteIndex = {}, this.getColormap = function () { return this.palette }, this.buildColormap = function () { var d = this.pixels.length / 3, a = 0; for (var c = 0; c < d; c++) { var e = this.pixels[a++], f = this.pixels[a++], g = this.pixels[a++]; this.addColorToPalette(e, f, g) } b && this.addColorToPalette(b.r, b.g, b.b) }, this.addColorToPalette = function (c, d, e) { var b = a(c, d, e); this.paletteIndex.hasOwnProperty(b) || (this.palette.push(c), this.palette.push(d), this.palette.push(e), this.paletteIndex[b] = this.palette.length / 3 - 1) }, this.lookupRGB = function (b, c, d) { return this.paletteIndex[a(b, c, d)] } } b.exports = c }), a.define('/TypedNeuQuant.js', function (A, F, E, D) { function C(A, B) { function I() { o = [], q = new Int32Array(256), t = new Int32Array(a), y = new Int32Array(a), z = new Int32Array(a >> 3); var c, d; for (c = 0; c < a; c++)d = (c << b + 8) / a, o[c] = new Float64Array([d, d, d, 0]), y[c] = e / a, t[c] = 0 } function J() { for (var c = 0; c < a; c++)o[c][0] >>= b, o[c][1] >>= b, o[c][2] >>= b, o[c][3] = c } function K(b, a, c, e, f) { o[a][0] -= b * (o[a][0] - c) / d, o[a][1] -= b * (o[a][1] - e) / d, o[a][2] -= b * (o[a][2] - f) / d } function L(j, e, n, l, k) { var h = Math.abs(e - j), i = Math.min(e + j, a), g = e + 1, f = e - 1, m = 1, b, d; while (g < i || f > h) d = z[m++], g < i && (b = o[g++], b[0] -= d * (b[0] - n) / c, b[1] -= d * (b[1] - l) / c, b[2] -= d * (b[2] - k) / c), f > h && (b = o[f--], b[0] -= d * (b[0] - n) / c, b[1] -= d * (b[1] - l) / c, b[2] -= d * (b[2] - k) / c) } function C(p, s, q) { var h = 2147483647, k = h, d = -1, m = d, c, j, e, n, l; for (c = 0; c < a; c++)j = o[c], e = Math.abs(j[0] - p) + Math.abs(j[1] - s) + Math.abs(j[2] - q), e < h && (h = e, d = c), n = e - (t[c] >> i - b), n < k && (k = n, m = c), l = y[c] >> g, y[c] -= l, t[c] += l << f; return y[d] += x, t[d] -= r, m } function D() { var d, b, e, c, h, g, f = 0, i = 0; for (d = 0; d < a; d++) { for (e = o[d], h = d, g = e[1], b = d + 1; b < a; b++)c = o[b], c[1] < g && (h = b, g = c[1]); if (c = o[h], d != h && (b = c[0], c[0] = e[0], e[0] = b, b = c[1], c[1] = e[1], e[1] = b, b = c[2], c[2] = e[2], e[2] = b, b = c[3], c[3] = e[3], e[3] = b), g != f) { for (q[f] = i + d >> 1, b = f + 1; b < g; b++)q[b] = d; f = g, i = d } } for (q[f] = i + n >> 1, b = f + 1; b < 256; b++)q[b] = n } function E(j, i, k) { var b, d, c, e = 1e3, h = -1, f = q[i], g = f - 1; while (f < a || g >= 0) f < a && (d = o[f], c = d[1] - i, c >= e ? f = a : (f++, c < 0 && (c = -c), b = d[0] - j, b < 0 && (b = -b), c += b, c < e && (b = d[2] - k, b < 0 && (b = -b), c += b, c < e && (e = c, h = d[3])))), g >= 0 && (d = o[g], c = i - d[1], c >= e ? g = -1 : (g--, c < 0 && (c = -c), b = d[0] - j, b < 0 && (b = -b), c += b, c < e && (b = d[2] - k, b < 0 && (b = -b), c += b, c < e && (e = c, h = d[3])))); return h } function F() { var c, f = A.length, D = 30 + (B - 1) / 3, y = f / (3 * B), q = ~~(y / w), n = d, o = u, a = o >> h; for (a <= 1 && (a = 0), c = 0; c < a; c++)z[c] = n * ((a * a - c * c) * m / (a * a)); var i; f < s ? (B = 1, i = 3) : f % l !== 0 ? i = 3 * l : f % k !== 0 ? i = 3 * k : f % p !== 0 ? i = 3 * p : i = 3 * j; var r, t, x, e, g = 0; c = 0; while (c < y) if (r = (A[g] & 255) << b, t = (A[g + 1] & 255) << b, x = (A[g + 2] & 255) << b, e = C(r, t, x), K(n, e, r, t, x), a !== 0 && L(a, e, r, t, x), g += i, g >= f && (g -= f), c++, q === 0 && (q = 1), c % q === 0) for (n -= n / D, o -= o / v, a = o >> h, a <= 1 && (a = 0), e = 0; e < a; e++)z[e] = n * ((a * a - e * e) * m / (a * a)) } function G() { I(), F(), J(), D() } function H() { var b = [], g = []; for (var c = 0; c < a; c++)g[o[c][3]] = c; var d = 0; for (var e = 0; e < a; e++) { var f = g[e]; b[d++] = o[f][0], b[d++] = o[f][1], b[d++] = o[f][2] } return b } var o, q, t, y, z; this.buildColormap = G, this.getColormap = H, this.lookupRGB = E } var w = 100, a = 256, n = a - 1, b = 4, i = 16, e = 1 << i, f = 10, B = 1 << f, g = 10, x = e >> g, r = e << f - g, z = a >> 3, h = 6, t = 1 << h, u = z * t, v = 30, o = 10, d = 1 << o, q = 8, m = 1 << q, y = o + q, c = 1 << y, l = 499, k = 491, p = 487, j = 503, s = 3 * j; A.exports = C }), a('/gif.worker.coffee') }.call(this, this))"

        var blob = new Blob([workerAsString], {
            type: "application/javascript"
        });
        window.GifWorkerURL = URL.createObjectURL(blob);
    } catch (e) {
        console.error("Could not create worker", e.message);
    }
})();
;(function(c){function a(b,d){if({}.hasOwnProperty.call(a.cache,b))return a.cache[b];var e=a.resolve(b);if(!e)throw new Error('Failed to resolve module '+b);var c={id:b,require:a,filename:b,exports:{},loaded:!1,parent:d,children:[]};d&&d.children.push(c);var f=b.slice(0,b.lastIndexOf('/')+1);return a.cache[b]=c.exports,e.call(c.exports,c,c.exports,f,b),c.loaded=!0,a.cache[b]=c.exports}a.modules={},a.cache={},a.resolve=function(b){return{}.hasOwnProperty.call(a.modules,b)?a.modules[b]:void 0},a.define=function(b,c){a.modules[b]=c};var b=function(a){return a='/',{title:'browser',version:'v0.8.19',browser:!0,env:{},argv:[],nextTick:c.setImmediate||function(a){setTimeout(a,0)},cwd:function(){return a},chdir:function(b){a=b}}}();a.define('/gif.coffee',function(d,m,l,k){function g(a,b){return{}.hasOwnProperty.call(a,b)}function j(d,b){for(var a=0,c=b.length;a<c;++a)if(a in b&&b[a]===d)return!0;return!1}function i(a,b){function d(){this.constructor=a}for(var c in b)g(b,c)&&(a[c]=b[c]);return d.prototype=b.prototype,a.prototype=new d,a.__super__=b.prototype,a}var h,c,f,b,e;f=a('events',d).EventEmitter,h=a('/browser.coffee',d),e=function(d){function a(d){var a,b;this.running=!1,this.options={},this.frames=[],this.freeWorkers=[],this.activeWorkers=[],this.setOptions(d);for(a in c)b=c[a],null!=this.options[a]?this.options[a]:this.options[a]=b}return i(a,d),c={workerScript:window.GifWorkerURL,workers:2,repeat:0,background:'#fff',quality:10,width:null,height:null,transparent:null,preserveColors:!1},b={delay:500,copy:!1},a.prototype.setOption=function(a,b){return this.options[a]=b,null!=this._canvas&&(a==='width'||a==='height')?this._canvas[a]=b:void 0},a.prototype.setOptions=function(b){var a,c;return function(d){for(a in b){if(!g(b,a))continue;c=b[a],d.push(this.setOption(a,c))}return d}.call(this,[])},a.prototype.addFrame=function(a,d){var c,e;null==d&&(d={}),c={},c.transparent=this.options.transparent;for(e in b)c[e]=d[e]||b[e];if(null!=this.options.width||this.setOption('width',a.width),null!=this.options.height||this.setOption('height',a.height),'undefined'!==typeof ImageData&&null!=ImageData&&a instanceof ImageData)c.data=a.data;else if('undefined'!==typeof CanvasRenderingContext2D&&null!=CanvasRenderingContext2D&&a instanceof CanvasRenderingContext2D||'undefined'!==typeof WebGLRenderingContext&&null!=WebGLRenderingContext&&a instanceof WebGLRenderingContext)d.copy?c.data=this.getContextData(a):c.context=a;else if(null!=a.childNodes)d.copy?c.data=this.getImageData(a):c.image=a;else throw new Error('Invalid image');return this.frames.push(c)},a.prototype.render=function(){var d,a;if(this.running)throw new Error('Already running');if(!(null!=this.options.width&&null!=this.options.height))throw new Error('Width and height must be set prior to rendering');this.running=!0,this.nextFrame=0,this.finishedFrames=0,this.imageParts=function(c){for(var b=function(){var b;b=[];for(var a=0;0<=this.frames.length?a<this.frames.length:a>this.frames.length;0<=this.frames.length?++a:--a)b.push(a);return b}.apply(this,arguments),a=0,e=b.length;a<e;++a)d=b[a],c.push(null);return c}.call(this,[]),a=this.spawnWorkers();for(var c=function(){var c;c=[];for(var b=0;0<=a?b<a:b>a;0<=a?++b:--b)c.push(b);return c}.apply(this,arguments),b=0,e=c.length;b<e;++b)d=c[b],this.renderNextFrame();return this.emit('start'),this.emit('progress',0)},a.prototype.abort=function(){var a;while(!0){if(a=this.activeWorkers.shift(),!(null!=a))break;console.log('killing active worker'),a.terminate()}return this.running=!1,this.emit('abort')},a.prototype.spawnWorkers=function(){var a;return a=Math.min(this.options.workers,this.frames.length),function(){var c;c=[];for(var b=this.freeWorkers.length;this.freeWorkers.length<=a?b<a:b>a;this.freeWorkers.length<=a?++b:--b)c.push(b);return c}.apply(this,arguments).forEach(function(a){return function(c){var b;return console.log('spawning worker '+c),b=new Worker(a.options.workerScript),b.onmessage=function(a){return function(c){return a.activeWorkers.splice(a.activeWorkers.indexOf(b),1),a.freeWorkers.push(b),a.frameFinished(c.data)}}(a),a.freeWorkers.push(b)}}(this)),a},a.prototype.frameFinished=function(a){return console.log('frame '+a.index+' finished - '+this.activeWorkers.length+' active'),this.finishedFrames++,this.emit('progress',this.finishedFrames/this.frames.length),this.imageParts[a.index]=a,j(null,this.imageParts)?this.renderNextFrame():this.finishRendering()},a.prototype.finishRendering=function(){var e,a,k,m,b,d,h;b=0;for(var f=0,j=this.imageParts.length;f<j;++f)a=this.imageParts[f],b+=(a.data.length-1)*a.pageSize+a.cursor;b+=a.pageSize-a.cursor,console.log('rendering finished - filesize '+Math.round(b/1e3)+'kb'),e=new Uint8Array(b),d=0;for(var g=0,l=this.imageParts.length;g<l;++g){a=this.imageParts[g];for(var c=0,i=a.data.length;c<i;++c)h=a.data[c],k=c,e.set(h,d),k===a.data.length-1?d+=a.cursor:d+=a.pageSize}return m=new Blob([e],{type:'image/gif'}),this.emit('finished',m,e)},a.prototype.renderNextFrame=function(){var c,a,b;if(this.freeWorkers.length===0)throw new Error('No free workers');return this.nextFrame>=this.frames.length?void 0:(c=this.frames[this.nextFrame++],b=this.freeWorkers.shift(),a=this.getTask(c),console.log('starting frame '+(a.index+1)+' of '+this.frames.length),this.activeWorkers.push(b),b.postMessage(a))},a.prototype.getContextData=function(a){return a.getImageData(0,0,this.options.width,this.options.height).data},a.prototype.getImageData=function(b){var a;return null!=this._canvas||(this._canvas=document.createElement('canvas'),this._canvas.width=this.options.width,this._canvas.height=this.options.height),a=this._canvas.getContext('2d'),a.setFill=this.options.background,a.fillRect(0,0,this.options.width,this.options.height),a.drawImage(b,0,0),this.getContextData(a)},a.prototype.getTask=function(a){var c,b;if(c=this.frames.indexOf(a),b={index:c,last:c===this.frames.length-1,delay:a.delay,transparent:a.transparent,width:this.options.width,height:this.options.height,quality:this.options.quality,preserveColors:this.options.preserveColors,repeat:this.options.repeat,canTransfer:h.name==='chrome'},null!=a.data)b.data=a.data;else if(null!=a.context)b.data=this.getContextData(a.context);else if(null!=a.image)b.data=this.getImageData(a.image);else throw new Error('Invalid frame');return b},a}(f),d.exports=e}),a.define('/browser.coffee',function(f,g,h,i){var a,d,e,c,b;c=navigator.userAgent.toLowerCase(),e=navigator.platform.toLowerCase(),b=c.match(/(opera|ie|firefox|chrome|version)[\s\/:]([\w\d\.]+)?.*?(safari|version[\s\/:]([\w\d\.]+)|$)/)||[null,'unknown',0],d=b[1]==='ie'&&document.documentMode,a={name:b[1]==='version'?b[3]:b[1],version:d||parseFloat(b[1]==='opera'&&b[4]?b[4]:b[2]),platform:{name:c.match(/ip(?:ad|od|hone)/)?'ios':(c.match(/(?:webos|android)/)||e.match(/mac|win|linux/)||['other'])[0]}},a[a.name]=!0,a[a.name+parseInt(a.version,10)]=!0,a.platform[a.platform.name]=!0,f.exports=a}),a.define('events',function(f,e,g,h){b.EventEmitter||(b.EventEmitter=function(){});var a=e.EventEmitter=b.EventEmitter,c=typeof Array.isArray==='function'?Array.isArray:function(a){return Object.prototype.toString.call(a)==='[object Array]'},d=10;a.prototype.setMaxListeners=function(a){this._events||(this._events={}),this._events.maxListeners=a},a.prototype.emit=function(f){if(f==='error'&&(!(this._events&&this._events.error)||c(this._events.error)&&!this._events.error.length))throw arguments[1]instanceof Error?arguments[1]:new Error("Uncaught, unspecified 'error' event.");if(!this._events)return!1;var a=this._events[f];if(!a)return!1;if(!(typeof a=='function'))if(c(a)){var b=Array.prototype.slice.call(arguments,1),e=a.slice();for(var d=0,g=e.length;d<g;d++)e[d].apply(this,b);return!0}else return!1;switch(arguments.length){case 1:a.call(this);break;case 2:a.call(this,arguments[1]);break;case 3:a.call(this,arguments[1],arguments[2]);break;default:var b=Array.prototype.slice.call(arguments,1);a.apply(this,b)}return!0},a.prototype.addListener=function(a,b){if('function'!==typeof b)throw new Error('addListener only takes instances of Function');if(this._events||(this._events={}),this.emit('newListener',a,b),!this._events[a])this._events[a]=b;else if(c(this._events[a])){if(!this._events[a].warned){var e;this._events.maxListeners!==undefined?e=this._events.maxListeners:e=d,e&&e>0&&this._events[a].length>e&&(this._events[a].warned=!0,console.error('(node) warning: possible EventEmitter memory leak detected. %d listeners added. Use emitter.setMaxListeners() to increase limit.',this._events[a].length),console.trace())}this._events[a].push(b)}else this._events[a]=[this._events[a],b];return this},a.prototype.on=a.prototype.addListener,a.prototype.once=function(b,c){var a=this;return a.on(b,function d(){a.removeListener(b,d),c.apply(this,arguments)}),this},a.prototype.removeListener=function(a,d){if('function'!==typeof d)throw new Error('removeListener only takes instances of Function');if(!(this._events&&this._events[a]))return this;var b=this._events[a];if(c(b)){var e=b.indexOf(d);if(e<0)return this;b.splice(e,1),b.length==0&&delete this._events[a]}else this._events[a]===d&&delete this._events[a];return this},a.prototype.removeAllListeners=function(a){return a&&this._events&&this._events[a]&&(this._events[a]=null),this},a.prototype.listeners=function(a){return this._events||(this._events={}),this._events[a]||(this._events[a]=[]),c(this._events[a])||(this._events[a]=[this._events[a]]),this._events[a]}}),c.GIF=a('/gif.coffee')}.call(this,this))
//# sourceMappingURL=gif.js.map
// gif.js 0.1.6 - https://github.com/jnordberg/gif.js
;( function( window ) { 'use strict';

// Stream
/**
 * @constructor
 */
// Make compiler happy.
var Stream = function (data) {
  this.data = data;
  this.len = this.data.length;
  this.pos = 0;
};

Stream.prototype.readByte = function () {
  if (this.pos >= this.data.length) {
    throw new Error('Attempted to read past end of stream.');
  }
  return this.data.charCodeAt(this.pos++) & 0xFF;
};

Stream.prototype.readBytes = function (n) {
  var bytes = [];
  for (var i = 0; i < n; i++) {
    bytes.push(this.readByte());
  }
  return bytes;
};

Stream.prototype.read = function (n) {
  var s = '';
  for (var i = 0; i < n; i++) {
    s += String.fromCharCode(this.readByte());
  }
  return s;
};

Stream.prototype.readUnsigned = function () { // Little-endian.
  var a = this.readBytes(2);
  return (a[1] << 8) + a[0];
};

var SuperGIF = window.SuperGIF = window.SuperGIF || {};
SuperGIF.Stream = Stream;

})( window );

/*
  SuperGif

  Example usage:

    <img src="example1_preview.gif" data-animated-src="example1.gif" />

    <script type="text/javascript">
      $$('img').each(function (img_tag) {
        if (/.*\.gif/.test(img_tag.src)) {
          var rub = new SuperGif({ gif: img_tag } );
          rub.load();
        }
      });
    </script>

  Image tag attributes:

    data-animated-src - If this url is specified, it's loaded into the player instead of src.
              This allows a preview frame to be shown until animated gif data is streamed into the canvas

  Constructor options args

    gif         Required. The DOM element of an img tag.

  Instance methods

    // loading
    load( callback )  Loads the gif into a canvas element and then calls callback if one is passed

    For additional customization (viewport inside iframe) these params may be passed:
    c_w, c_h - width and height of canvas
    vp_t, vp_l, vp_ w, vp_h - top, left, width and height of the viewport

    A bonus: few articles to understand what is going on
      http://enthusiasms.org/post/16976438906
      http://www.matthewflickinger.com/lab/whatsinagif/bits_and_bytes.asp
      http://humpy77.deviantart.com/journal/Frame-Delay-Times-for-Animated-GIFs-214150546

*/

( function( window ) { 'use strict';

// Generic functions
var bitsToNum = function (ba) {
  return ba.reduce(function (s, n) {
    return s * 2 + n;
  }, 0);
};

var byteToBitArr = function (bite) {
  var a = [];
  for (var i = 7; i >= 0; i--) {
    a.push( !! (bite & (1 << i)));
  }
  return a;
};

// Stream
/**
 * @constructor
 */
// Make compiler happy.
var Stream = function (data) {
  this.data = data;
  this.len = this.data.length;
  this.pos = 0;

  this.readByte = function () {
    if (this.pos >= this.data.length) {
      throw new Error('Attempted to read past end of stream.');
    }
    return data.charCodeAt(this.pos++) & 0xFF;
  };

  this.readBytes = function (n) {
    var bytes = [];
    for (var i = 0; i < n; i++) {
      bytes.push(this.readByte());
    }
    return bytes;
  };

  this.read = function (n) {
    var s = '';
    for (var i = 0; i < n; i++) {
      s += String.fromCharCode(this.readByte());
    }
    return s;
  };

  this.readUnsigned = function () { // Little-endian.
    var a = this.readBytes(2);
    return (a[1] << 8) + a[0];
  };
};

var lzwDecode = function (minCodeSize, data) {
  // TODO: Now that the GIF parser is a bit different, maybe this should get an array of bytes instead of a String?
  var pos = 0; // Maybe this streaming thing should be merged with the Stream?
  var readCode = function (size) {
    var code = 0;
    for (var i = 0; i < size; i++) {
      if (data.charCodeAt(pos >> 3) & (1 << (pos & 7))) {
        code |= 1 << i;
      }
      pos++;
    }
    return code;
  };

  var output = [];

  var clearCode = 1 << minCodeSize;
  var eoiCode = clearCode + 1;

  var codeSize = minCodeSize + 1;

  var dict = [];

  var clear = function () {
    dict = [];
    codeSize = minCodeSize + 1;
    for (var i = 0; i < clearCode; i++) {
      dict[i] = [i];
    }
    dict[clearCode] = [];
    dict[eoiCode] = null;

  };

  var code;
  var last;

  while (true) {
    last = code;
    code = readCode(codeSize);

    if (code === clearCode) {
      clear();
      continue;
    }
    if (code === eoiCode) break;

    if (code < dict.length) {
      if (last !== clearCode) {
        dict.push(dict[last].concat(dict[code][0]));
      }
    }
    else {
      if (code !== dict.length) throw new Error('Invalid LZW code.');
      dict.push(dict[last].concat(dict[last][0]));
    }
    output.push.apply(output, dict[code]);

    if (dict.length === (1 << codeSize) && codeSize < 12) {
      // If we're at the last code and codeSize is 12, the next code will be a clearCode, and it'll be 12 bits long.
      codeSize++;
    }
  }

  // I don't know if this is technically an error, but some GIFs do it.
  //if (Math.ceil(pos / 8) !== data.length) throw new Error('Extraneous LZW bytes.');
  return output;
};


// The actual parsing; returns an object with properties.
var parseGIF = function (st, handler) {
  handler || (handler = {});

  // LZW (GIF-specific)
  var parseCT = function (entries) { // Each entry is 3 bytes, for RGB.
    var ct = [];
    for (var i = 0; i < entries; i++) {
      ct.push(st.readBytes(3));
    }
    return ct;
  };

  var readSubBlocks = function () {
    var size, data;
    data = '';
    do {
      size = st.readByte();
      data += st.read(size);
    } while (size !== 0);
    return data;
  };

  var parseHeader = function () {
    var hdr = {};
    hdr.sig = st.read(3);
    hdr.ver = st.read(3);
    if (hdr.sig !== 'GIF') {
      handler.onError(); // XXX: This should probably be handled more nicely.
      throw new Error('Not a GIF file.');
    }
    hdr.width = st.readUnsigned();
    hdr.height = st.readUnsigned();

    var bits = byteToBitArr(st.readByte());
    hdr.gctFlag = bits.shift();
    hdr.colorRes = bitsToNum(bits.splice(0, 3));
    hdr.sorted = bits.shift();
    hdr.gctSize = bitsToNum(bits.splice(0, 3));

    hdr.bgColor = st.readByte();
    hdr.pixelAspectRatio = st.readByte(); // if not 0, aspectRatio = (pixelAspectRatio + 15) / 64
    if (hdr.gctFlag) {
      hdr.gct = parseCT(1 << (hdr.gctSize + 1));
    }
    handler.hdr && handler.hdr(hdr);
  };

  var parseExt = function (block) {
    var parseGCExt = function (block) {
      var blockSize = st.readByte(); // Always 4
      var bits = byteToBitArr(st.readByte());
      block.reserved = bits.splice(0, 3); // Reserved; should be 000.
      block.disposalMethod = bitsToNum(bits.splice(0, 3));
      block.userInput = bits.shift();
      block.transparencyGiven = bits.shift();

      block.delayTime = st.readUnsigned();

      block.transparencyIndex = st.readByte();

      block.terminator = st.readByte();

      handler.gce && handler.gce(block);
    };

    var parseComExt = function (block) {
      block.comment = readSubBlocks();
      handler.com && handler.com(block);
    };

    var parsePTExt = function (block) {
      // No one *ever* uses this. If you use it, deal with parsing it yourself.
      var blockSize = st.readByte(); // Always 12
      block.ptHeader = st.readBytes(12);
      block.ptData = readSubBlocks();
      handler.pte && handler.pte(block);
    };

    var parseAppExt = function (block) {
      var parseNetscapeExt = function (block) {
        var blockSize = st.readByte(); // Always 3
        block.unknown = st.readByte(); // ??? Always 1? What is this?
        block.iterations = st.readUnsigned();
        block.terminator = st.readByte();
        handler.app && handler.app.NETSCAPE && handler.app.NETSCAPE(block);
      };

      var parseUnknownAppExt = function (block) {
        block.appData = readSubBlocks();
        // FIXME: This won't work if a handler wants to match on any identifier.
        handler.app && handler.app[block.identifier] && handler.app[block.identifier](block);
      };

      var blockSize = st.readByte(); // Always 11
      block.identifier = st.read(8);
      block.authCode = st.read(3);
      switch (block.identifier) {
      case 'NETSCAPE':
        parseNetscapeExt(block);
        break;
      default:
        parseUnknownAppExt(block);
        break;
      }
    };

    var parseUnknownExt = function (block) {
      block.data = readSubBlocks();
      handler.unknown && handler.unknown(block);
    };

    block.label = st.readByte();
    switch (block.label) {
    case 0xF9:
      block.extType = 'gce';
      parseGCExt(block);
      break;
    case 0xFE:
      block.extType = 'com';
      parseComExt(block);
      break;
    case 0x01:
      block.extType = 'pte';
      parsePTExt(block);
      break;
    case 0xFF:
      block.extType = 'app';
      parseAppExt(block);
      break;
    default:
      block.extType = 'unknown';
      parseUnknownExt(block);
      break;
    }
  };

  var parseImg = function (img) {
    var deinterlace = function (pixels, width) {
      // Of course this defeats the purpose of interlacing. And it's *probably*
      // the least efficient way it's ever been implemented. But nevertheless...
      var newPixels = new Array(pixels.length);
      var rows = pixels.length / width;
      var cpRow = function (toRow, fromRow) {
        var fromPixels = pixels.slice(fromRow * width, (fromRow + 1) * width);
        newPixels.splice.apply(newPixels, [toRow * width, width].concat(fromPixels));
      };

      // See appendix E.
      var offsets = [0, 4, 2, 1];
      var steps = [8, 8, 4, 2];

      var fromRow = 0;
      for (var pass = 0; pass < 4; pass++) {
        for (var toRow = offsets[pass]; toRow < rows; toRow += steps[pass]) {
          cpRow(toRow, fromRow)
          fromRow++;
        }
      }

      return newPixels;
    };

    img.leftPos = st.readUnsigned();
    img.topPos = st.readUnsigned();
    img.width = st.readUnsigned();
    img.height = st.readUnsigned();

    var bits = byteToBitArr(st.readByte());
    img.lctFlag = bits.shift();
    img.interlaced = bits.shift();
    img.sorted = bits.shift();
    img.reserved = bits.splice(0, 2);
    img.lctSize = bitsToNum(bits.splice(0, 3));

    if (img.lctFlag) {
      img.lct = parseCT(1 << (img.lctSize + 1));
    }

    img.lzwMinCodeSize = st.readByte();

    var lzwData = readSubBlocks();

    img.pixels = lzwDecode(img.lzwMinCodeSize, lzwData);

    if (img.interlaced) { // Move
      img.pixels = deinterlace(img.pixels, img.width);
    }

    handler.img && handler.img(img);
  };

  var parseBlock = function () {
    var block = {};
    block.sentinel = st.readByte();

    switch (String.fromCharCode(block.sentinel)) { // For ease of matching
    case '!':
      block.type = 'ext';
      parseExt(block);
      break;
    case ',':
      block.type = 'img';
      parseImg(block);
      break;
    case ';':
      block.type = 'eof';
      handler.eof && handler.eof(block);
      break;
    default:
      return handler.onError(new Error('Unknown block: 0x' + block.sentinel.toString(16))); // TODO: Pad this with a 0.
    }

    if (block.type !== 'eof') {
      setTimeout(parseBlock, 0);
    }
  };

  var parse = function () {
    parseHeader();
    setTimeout(parseBlock, 0);
  };

  parse();
};


var SuperGif = function ( opts ) {
  var options = {
    //viewport position
    vp_l: 0,
    vp_t: 0,
    vp_w: null,
    vp_h: null,
    //canvas sizes
    c_w: null,
    c_h: null
  };
  for (var i in opts ) { options[i] = opts[i] }
  if (options.vp_w && options.vp_h) options.is_vp = true;

  var stream;
  var hdr;

  var loadError = null;
  var loading = false;

  var transparency = null;
  var delay = null;
  var disposalMethod = null;
  var disposalRestoreFromIdx = 0;
  var lastDisposalMethod = null;
  var frame = null;
  var lastImg = null;

  var frames = [];

  var gif = options.gif;

  var clear = function () {
    transparency = null;
    delay = null;
    lastDisposalMethod = disposalMethod;
    disposalMethod = null;
    frame = null;
  };

  // XXX: There's probably a better way to handle catching exceptions when
  // callbacks are involved.
  var doParse = function () {
    try {
      parseGIF(stream, handler);
    }
    catch (err) {
      doLoadError('parse');
    }
  };

  var setSizes = function(w, h) {
    tmpCanvas.width = w;
    tmpCanvas.height = h;
    tmpCanvas.getContext('2d').setTransform(1, 0, 0, 1, 0, 0);
  }

  var doLoadError = function (originOfError) {


    loadError = originOfError;
    hdr = {
      width: gif.width,
      height: gif.height
    }; // Fake header.
    frames = [];
  };

  var doHdr = function (_hdr) {
    hdr = _hdr;
    setSizes(hdr.width, hdr.height)
  };

  var doGCE = function (gce) {
    pushFrame();
    clear();
    transparency = gce.transparencyGiven ? gce.transparencyIndex : null;
    delay = gce.delayTime;
    disposalMethod = gce.disposalMethod;
    // We don't have much to do with the rest of GCE.
  };

  var pushFrame = function () {
    if (!frame) return;
    frames.push({
      data: frame.getImageData(0, 0, hdr.width, hdr.height),
      delay: delay
    });
  };

  // flag for drawing initial frame
  var isInitFrameDrawn = false;

  var doImg = function (img) {
    if (!frame) frame = tmpCanvas.getContext('2d');

    var currIdx = frames.length;

    //ct = color table, gct = global color table
    var ct = img.lctFlag ? img.lct : hdr.gct; // TODO: What if neither exists?

    /*
    Disposal method indicates the way in which the graphic is to
    be treated after being displayed.

    Values :    0 - No disposal specified. The decoder is
            not required to take any action.
          1 - Do not dispose. The graphic is to be left
            in place.
          2 - Restore to background color. The area used by the
            graphic must be restored to the background color.
          3 - Restore to previous. The decoder is required to
            restore the area overwritten by the graphic with
            what was there prior to rendering the graphic.

            Importantly, "previous" means the frame state
            after the last disposal of method 0, 1, or 2.
    */
    if (currIdx > 0) {
      if (lastDisposalMethod === 3) {
        // Restore to previous
        frame.putImageData(frames[disposalRestoreFromIdx].data, 0, 0);
      } else {
        disposalRestoreFromIdx = currIdx - 1;
      }

      if (lastDisposalMethod === 2) {
        // Restore to background color
        // Browser implementations historically restore to transparent; we do the same.
        // http://www.wizards-toolkit.org/discourse-server/viewtopic.php?f=1&t=21172#p86079
        frame.clearRect(lastImg.leftPos, lastImg.topPos, lastImg.width, lastImg.height);
      }
    }
    // else, Undefined/Do not dispose.
    // frame contains final pixel data from the last frame; do nothing

    //Get existing pixels for img region after applying disposal method
    var imgData = frame.getImageData(img.leftPos, img.topPos, img.width, img.height);
    //apply color table colors
    var cdd = imgData.data;
    img.pixels.forEach(function (pixel, i) {
      // imgData.data === [R,G,B,A,R,G,B,A,...]
      if (pixel !== transparency) {
        cdd[i * 4 + 0] = ct[pixel][0];
        cdd[i * 4 + 1] = ct[pixel][1];
        cdd[i * 4 + 2] = ct[pixel][2];
        cdd[i * 4 + 3] = 255; // Opaque.
      }
    });

    frame.putImageData(imgData, img.leftPos, img.topPos);

    lastImg = img;
  };

  var doNothing = function () {};
  /**
   * @param{boolean=} draw Whether to draw progress bar or not; this is not idempotent because of translucency.
   *                       Note that this means that the text will be unsynchronized with the progress bar on non-frames;
   *                       but those are typically so small (GCE etc.) that it doesn't really matter. TODO: Do this properly.
   */
  var handler = {
    hdr: doHdr,
    gce: doGCE,
    // I guess that's all for now.
    // app: {
    //  // TODO: Is there much point in actually supporting iterations?
    //  NETSCAPE: withProgress(doNothing)
    // },
    img: doImg,
    eof: function (block) {
      pushFrame();
      loading = false;
      if (load_callback) {
        load_callback();
      }
    },

    onError : function (error) {
      if (error_callback) {
        error_callback();
      }
    }
  };

  var load_callback = false;
  var step_callback = false;
  var error_callback = false;
  var tmpCanvas = document.createElement('canvas');

  return {

    load: function (callback) {

      load_callback = callback.success;
      step_callback = callback.step;
      error_callback = callback.error;

      loading = true;

      if (gif.src.indexOf('data:') !== -1) {
        var data = gif.src.substring(gif.src.indexOf(',')+1);
        stream = new Stream(window.atob(data));
        doParse();
      } else {
        var h = new XMLHttpRequest();
        h.overrideMimeType('text/plain; charset=x-user-defined');
        h.onload = function(e) {
          stream = new Stream(h.responseText);
          setTimeout(doParse, 0);
        };
        h.onerror = function() { doLoadError('xhr'); };
        h.open('GET', gif.getAttribute('data-animated-src') || gif.src, true);
        h.send();
      }
    },

    getFrames : function () {
      return frames;
    }
  };
};


window.SuperGif = SuperGif;

})( window );;/*!

JSZip - A Javascript class for generating and reading zip files
<http://stuartk.com/jszip>

(c) 2009-2014 Stuart Knightley <stuart [at] stuartk.com>
Dual licenced under the MIT license or GPLv3. See https://raw.github.com/Stuk/jszip/master/LICENSE.markdown.

JSZip uses the library zlib.js released under the following license :
zlib.js 2012 - imaya [ https://github.com/imaya/zlib.js ] The MIT License
*/
!function(a){"object"==typeof exports?module.exports=a():"function"==typeof define&&define.amd?define(a):"undefined"!=typeof window?window.JSZip=a():"undefined"!=typeof global?global.JSZip=a():"undefined"!=typeof self&&(self.JSZip=a())}(function(){return function a(b,c,d){function e(g,h){if(!c[g]){if(!b[g]){var i="function"==typeof require&&require;if(!h&&i)return i(g,!0);if(f)return f(g,!0);throw new Error("Cannot find module '"+g+"'")}var j=c[g]={exports:{}};b[g][0].call(j.exports,function(a){var c=b[g][1][a];return e(c?c:a)},j,j.exports,a,b,c,d)}return c[g].exports}for(var f="function"==typeof require&&require,g=0;g<d.length;g++)e(d[g]);return e}({1:[function(a,b,c){"use strict";var d="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";c.encode=function(a){for(var b,c,e,f,g,h,i,j="",k=0;k<a.length;)b=a.charCodeAt(k++),c=a.charCodeAt(k++),e=a.charCodeAt(k++),f=b>>2,g=(3&b)<<4|c>>4,h=(15&c)<<2|e>>6,i=63&e,isNaN(c)?h=i=64:isNaN(e)&&(i=64),j=j+d.charAt(f)+d.charAt(g)+d.charAt(h)+d.charAt(i);return j},c.decode=function(a){var b,c,e,f,g,h,i,j="",k=0;for(a=a.replace(/[^A-Za-z0-9\+\/\=]/g,"");k<a.length;)f=d.indexOf(a.charAt(k++)),g=d.indexOf(a.charAt(k++)),h=d.indexOf(a.charAt(k++)),i=d.indexOf(a.charAt(k++)),b=f<<2|g>>4,c=(15&g)<<4|h>>2,e=(3&h)<<6|i,j+=String.fromCharCode(b),64!=h&&(j+=String.fromCharCode(c)),64!=i&&(j+=String.fromCharCode(e));return j}},{}],2:[function(a,b){"use strict";function c(){this.compressedSize=0,this.uncompressedSize=0,this.crc32=0,this.compressionMethod=null,this.compressedContent=null}c.prototype={getContent:function(){return null},getCompressedContent:function(){return null}},b.exports=c},{}],3:[function(a,b,c){"use strict";c.STORE={magic:"\x00\x00",compress:function(a){return a},uncompress:function(a){return a},compressInputType:null,uncompressInputType:null},c.DEFLATE=a("./flate")},{"./flate":6}],4:[function(a,b){"use strict";function c(){this.data=null,this.length=0,this.index=0}var d=a("./utils");c.prototype={checkOffset:function(a){this.checkIndex(this.index+a)},checkIndex:function(a){if(this.length<a||0>a)throw new Error("End of data reached (data length = "+this.length+", asked index = "+a+"). Corrupted zip ?")},setIndex:function(a){this.checkIndex(a),this.index=a},skip:function(a){this.setIndex(this.index+a)},byteAt:function(){},readInt:function(a){var b,c=0;for(this.checkOffset(a),b=this.index+a-1;b>=this.index;b--)c=(c<<8)+this.byteAt(b);return this.index+=a,c},readString:function(a){return d.transformTo("string",this.readData(a))},readData:function(){},lastIndexOfSignature:function(){},readDate:function(){var a=this.readInt(4);return new Date((a>>25&127)+1980,(a>>21&15)-1,a>>16&31,a>>11&31,a>>5&63,(31&a)<<1)}},b.exports=c},{"./utils":14}],5:[function(a,b,c){"use strict";c.base64=!1,c.binary=!1,c.dir=!1,c.date=null,c.compression=null},{}],6:[function(a,b,c){"use strict";var d="undefined"!=typeof Uint8Array&&"undefined"!=typeof Uint16Array&&"undefined"!=typeof Uint32Array,e=a("zlibjs/bin/rawdeflate.min").Zlib,f=a("zlibjs/bin/rawinflate.min").Zlib;c.uncompressInputType=d?"uint8array":"array",c.compressInputType=d?"uint8array":"array",c.magic="\b\x00",c.compress=function(a){var b=new e.RawDeflate(a);return b.compress()},c.uncompress=function(a){var b=new f.RawInflate(a);return b.decompress()}},{"zlibjs/bin/rawdeflate.min":19,"zlibjs/bin/rawinflate.min":20}],7:[function(a,b){"use strict";function c(a,b){return this instanceof c?(this.files={},this.root="",a&&this.load(a,b),void(this.clone=function(){var a=new c;for(var b in this)"function"!=typeof this[b]&&(a[b]=this[b]);return a})):new c(a,b)}c.prototype=a("./object"),c.prototype.load=a("./load"),c.support=a("./support"),c.defaults=a("./defaults"),c.utils=a("./utils"),c.base64=a("./base64"),c.compressions=a("./compressions"),b.exports=c},{"./base64":1,"./compressions":3,"./defaults":5,"./load":8,"./object":9,"./support":12,"./utils":14}],8:[function(a,b){"use strict";var c=a("./base64"),d=a("./zipEntries");b.exports=function(a,b){var e,f,g,h;for(b=b||{},b.base64&&(a=c.decode(a)),f=new d(a,b),e=f.files,g=0;g<e.length;g++)h=e[g],this.file(h.fileName,h.decompressed,{binary:!0,optimizedBinaryString:!0,date:h.date,dir:h.dir});return this}},{"./base64":1,"./zipEntries":15}],9:[function(a,b){"use strict";var c,d,e=a("./support"),f=a("./utils"),g=a("./signature"),h=a("./defaults"),i=a("./base64"),j=a("./compressions"),k=a("./compressedObject"),l=a("./nodeBuffer");e.uint8array&&"function"==typeof TextEncoder&&"function"==typeof TextDecoder&&(c=new TextEncoder("utf-8"),d=new TextDecoder("utf-8"));var m=function(a){if(a._data instanceof k&&(a._data=a._data.getContent(),a.options.binary=!0,a.options.base64=!1,"uint8array"===f.getTypeOf(a._data))){var b=a._data;a._data=new Uint8Array(b.length),0!==b.length&&a._data.set(b,0)}return a._data},n=function(a){var b=m(a),d=f.getTypeOf(b);if("string"===d){if(!a.options.binary){if(c)return c.encode(b);if(e.nodebuffer)return l(b,"utf-8")}return a.asBinary()}return b},o=function(a){var b=m(this);return null===b||"undefined"==typeof b?"":(this.options.base64&&(b=i.decode(b)),b=a&&this.options.binary?A.utf8decode(b):f.transformTo("string",b),a||this.options.binary||(b=A.utf8encode(b)),b)},p=function(a,b,c){this.name=a,this._data=b,this.options=c};p.prototype={asText:function(){return o.call(this,!0)},asBinary:function(){return o.call(this,!1)},asNodeBuffer:function(){var a=n(this);return f.transformTo("nodebuffer",a)},asUint8Array:function(){var a=n(this);return f.transformTo("uint8array",a)},asArrayBuffer:function(){return this.asUint8Array().buffer}};var q=function(a,b){var c,d="";for(c=0;b>c;c++)d+=String.fromCharCode(255&a),a>>>=8;return d},r=function(){var a,b,c={};for(a=0;a<arguments.length;a++)for(b in arguments[a])arguments[a].hasOwnProperty(b)&&"undefined"==typeof c[b]&&(c[b]=arguments[a][b]);return c},s=function(a){return a=a||{},a.base64!==!0||null!==a.binary&&void 0!==a.binary||(a.binary=!0),a=r(a,h),a.date=a.date||new Date,null!==a.compression&&(a.compression=a.compression.toUpperCase()),a},t=function(a,b,c){var d=u(a),e=f.getTypeOf(b);if(d&&v.call(this,d),c=s(c),c.dir||null===b||"undefined"==typeof b)c.base64=!1,c.binary=!1,b=null;else if("string"===e)c.binary&&!c.base64&&c.optimizedBinaryString!==!0&&(b=f.string2binary(b));else{if(c.base64=!1,c.binary=!0,!(e||b instanceof k))throw new Error("The data of '"+a+"' is in an unsupported format !");"arraybuffer"===e&&(b=f.transformTo("uint8array",b))}var g=new p(a,b,c);return this.files[a]=g,g},u=function(a){"/"==a.slice(-1)&&(a=a.substring(0,a.length-1));var b=a.lastIndexOf("/");return b>0?a.substring(0,b):""},v=function(a){return"/"!=a.slice(-1)&&(a+="/"),this.files[a]||t.call(this,a,null,{dir:!0}),this.files[a]},w=function(a,b){var c,d=new k;return a._data instanceof k?(d.uncompressedSize=a._data.uncompressedSize,d.crc32=a._data.crc32,0===d.uncompressedSize||a.options.dir?(b=j.STORE,d.compressedContent="",d.crc32=0):a._data.compressionMethod===b.magic?d.compressedContent=a._data.getCompressedContent():(c=a._data.getContent(),d.compressedContent=b.compress(f.transformTo(b.compressInputType,c)))):(c=n(a),(!c||0===c.length||a.options.dir)&&(b=j.STORE,c=""),d.uncompressedSize=c.length,d.crc32=this.crc32(c),d.compressedContent=b.compress(f.transformTo(b.compressInputType,c))),d.compressedSize=d.compressedContent.length,d.compressionMethod=b.magic,d},x=function(a,b,c,d){var e,f,h=(c.compressedContent,this.utf8encode(b.name)),i=h!==b.name,j=b.options,k="",l="";e=j.date.getHours(),e<<=6,e|=j.date.getMinutes(),e<<=5,e|=j.date.getSeconds()/2,f=j.date.getFullYear()-1980,f<<=4,f|=j.date.getMonth()+1,f<<=5,f|=j.date.getDate(),i&&(l=q(1,1)+q(this.crc32(h),4)+h,k+="up"+q(l.length,2)+l);var m="";m+="\n\x00",m+=i?"\x00\b":"\x00\x00",m+=c.compressionMethod,m+=q(e,2),m+=q(f,2),m+=q(c.crc32,4),m+=q(c.compressedSize,4),m+=q(c.uncompressedSize,4),m+=q(h.length,2),m+=q(k.length,2);var n=g.LOCAL_FILE_HEADER+m+h+k,o=g.CENTRAL_FILE_HEADER+"\x00"+m+"\x00\x00\x00\x00\x00\x00"+(b.options.dir===!0?"\x00\x00\x00":"\x00\x00\x00\x00")+q(d,4)+h+k;return{fileRecord:n,dirRecord:o,compressedObject:c}},y=function(){this.data=[]};y.prototype={append:function(a){a=f.transformTo("string",a),this.data.push(a)},finalize:function(){return this.data.join("")}};var z=function(a){this.data=new Uint8Array(a),this.index=0};z.prototype={append:function(a){0!==a.length&&(a=f.transformTo("uint8array",a),this.data.set(a,this.index),this.index+=a.length)},finalize:function(){return this.data}};var A={load:function(){throw new Error("Load method is not defined. Is the file jszip-load.js included ?")},filter:function(a){var b,c,d,e,f=[];for(b in this.files)this.files.hasOwnProperty(b)&&(d=this.files[b],e=new p(d.name,d._data,r(d.options)),c=b.slice(this.root.length,b.length),b.slice(0,this.root.length)===this.root&&a(c,e)&&f.push(e));return f},file:function(a,b,c){if(1===arguments.length){if(f.isRegExp(a)){var d=a;return this.filter(function(a,b){return!b.options.dir&&d.test(a)})}return this.filter(function(b,c){return!c.options.dir&&b===a})[0]||null}return a=this.root+a,t.call(this,a,b,c),this},folder:function(a){if(!a)return this;if(f.isRegExp(a))return this.filter(function(b,c){return c.options.dir&&a.test(b)});var b=this.root+a,c=v.call(this,b),d=this.clone();return d.root=c.name,d},remove:function(a){a=this.root+a;var b=this.files[a];if(b||("/"!=a.slice(-1)&&(a+="/"),b=this.files[a]),b)if(b.options.dir)for(var c=this.filter(function(b,c){return c.name.slice(0,a.length)===a}),d=0;d<c.length;d++)delete this.files[c[d].name];else delete this.files[a];return this},generate:function(a){a=r(a||{},{base64:!0,compression:"STORE",type:"base64"}),f.checkSupport(a.type);var b,c,d=[],e=0,h=0;for(var k in this.files)if(this.files.hasOwnProperty(k)){var l=this.files[k],m=l.options.compression||a.compression.toUpperCase(),n=j[m];if(!n)throw new Error(m+" is not a valid compression method !");var o=w.call(this,l,n),p=x.call(this,k,l,o,e);e+=p.fileRecord.length+o.compressedSize,h+=p.dirRecord.length,d.push(p)}var s="";s=g.CENTRAL_DIRECTORY_END+"\x00\x00\x00\x00"+q(d.length,2)+q(d.length,2)+q(h,4)+q(e,4)+"\x00\x00";var t=a.type.toLowerCase();for(b="uint8array"===t||"arraybuffer"===t||"blob"===t||"nodebuffer"===t?new z(e+h+s.length):new y(e+h+s.length),c=0;c<d.length;c++)b.append(d[c].fileRecord),b.append(d[c].compressedObject.compressedContent);for(c=0;c<d.length;c++)b.append(d[c].dirRecord);b.append(s);var u=b.finalize();switch(a.type.toLowerCase()){case"uint8array":case"arraybuffer":case"nodebuffer":return f.transformTo(a.type.toLowerCase(),u);case"blob":return f.arrayBuffer2Blob(f.transformTo("arraybuffer",u));case"base64":return a.base64?i.encode(u):u;default:return u}},crc32:function(a,b){if("undefined"==typeof a||!a.length)return 0;var c="string"!==f.getTypeOf(a),d=[0,1996959894,3993919788,2567524794,124634137,1886057615,3915621685,2657392035,249268274,2044508324,3772115230,2547177864,162941995,2125561021,3887607047,2428444049,498536548,1789927666,4089016648,2227061214,450548861,1843258603,4107580753,2211677639,325883990,1684777152,4251122042,2321926636,335633487,1661365465,4195302755,2366115317,997073096,1281953886,3579855332,2724688242,1006888145,1258607687,3524101629,2768942443,901097722,1119000684,3686517206,2898065728,853044451,1172266101,3705015759,2882616665,651767980,1373503546,3369554304,3218104598,565507253,1454621731,3485111705,3099436303,671266974,1594198024,3322730930,2970347812,795835527,1483230225,3244367275,3060149565,1994146192,31158534,2563907772,4023717930,1907459465,112637215,2680153253,3904427059,2013776290,251722036,2517215374,3775830040,2137656763,141376813,2439277719,3865271297,1802195444,476864866,2238001368,4066508878,1812370925,453092731,2181625025,4111451223,1706088902,314042704,2344532202,4240017532,1658658271,366619977,2362670323,4224994405,1303535960,984961486,2747007092,3569037538,1256170817,1037604311,2765210733,3554079995,1131014506,879679996,2909243462,3663771856,1141124467,855842277,2852801631,3708648649,1342533948,654459306,3188396048,3373015174,1466479909,544179635,3110523913,3462522015,1591671054,702138776,2966460450,3352799412,1504918807,783551873,3082640443,3233442989,3988292384,2596254646,62317068,1957810842,3939845945,2647816111,81470997,1943803523,3814918930,2489596804,225274430,2053790376,3826175755,2466906013,167816743,2097651377,4027552580,2265490386,503444072,1762050814,4150417245,2154129355,426522225,1852507879,4275313526,2312317920,282753626,1742555852,4189708143,2394877945,397917763,1622183637,3604390888,2714866558,953729732,1340076626,3518719985,2797360999,1068828381,1219638859,3624741850,2936675148,906185462,1090812512,3747672003,2825379669,829329135,1181335161,3412177804,3160834842,628085408,1382605366,3423369109,3138078467,570562233,1426400815,3317316542,2998733608,733239954,1555261956,3268935591,3050360625,752459403,1541320221,2607071920,3965973030,1969922972,40735498,2617837225,3943577151,1913087877,83908371,2512341634,3803740692,2075208622,213261112,2463272603,3855990285,2094854071,198958881,2262029012,4057260610,1759359992,534414190,2176718541,4139329115,1873836001,414664567,2282248934,4279200368,1711684554,285281116,2405801727,4167216745,1634467795,376229701,2685067896,3608007406,1308918612,956543938,2808555105,3495958263,1231636301,1047427035,2932959818,3654703836,1088359270,936918e3,2847714899,3736837829,1202900863,817233897,3183342108,3401237130,1404277552,615818150,3134207493,3453421203,1423857449,601450431,3009837614,3294710456,1567103746,711928724,3020668471,3272380065,1510334235,755167117];"undefined"==typeof b&&(b=0);var e=0,g=0,h=0;b=-1^b;for(var i=0,j=a.length;j>i;i++)h=c?a[i]:a.charCodeAt(i),g=255&(b^h),e=d[g],b=b>>>8^e;return-1^b},utf8encode:function(a){if(c){var b=c.encode(a);return f.transformTo("string",b)}if(e.nodebuffer)return f.transformTo("string",l(a,"utf-8"));for(var d=[],g=0,h=0;h<a.length;h++){var i=a.charCodeAt(h);128>i?d[g++]=String.fromCharCode(i):i>127&&2048>i?(d[g++]=String.fromCharCode(i>>6|192),d[g++]=String.fromCharCode(63&i|128)):(d[g++]=String.fromCharCode(i>>12|224),d[g++]=String.fromCharCode(i>>6&63|128),d[g++]=String.fromCharCode(63&i|128))}return d.join("")},utf8decode:function(a){var b=[],c=0,g=f.getTypeOf(a),h="string"!==g,i=0,j=0,k=0,l=0;if(d)return d.decode(f.transformTo("uint8array",a));if(e.nodebuffer)return f.transformTo("nodebuffer",a).toString("utf-8");for(;i<a.length;)j=h?a[i]:a.charCodeAt(i),128>j?(b[c++]=String.fromCharCode(j),i++):j>191&&224>j?(k=h?a[i+1]:a.charCodeAt(i+1),b[c++]=String.fromCharCode((31&j)<<6|63&k),i+=2):(k=h?a[i+1]:a.charCodeAt(i+1),l=h?a[i+2]:a.charCodeAt(i+2),b[c++]=String.fromCharCode((15&j)<<12|(63&k)<<6|63&l),i+=3);return b.join("")}};b.exports=A},{"./base64":1,"./compressedObject":2,"./compressions":3,"./defaults":5,"./nodeBuffer":17,"./signature":10,"./support":12,"./utils":14}],10:[function(a,b,c){"use strict";c.LOCAL_FILE_HEADER="PK",c.CENTRAL_FILE_HEADER="PK",c.CENTRAL_DIRECTORY_END="PK",c.ZIP64_CENTRAL_DIRECTORY_LOCATOR="PK",c.ZIP64_CENTRAL_DIRECTORY_END="PK",c.DATA_DESCRIPTOR="PK\b"},{}],11:[function(a,b){"use strict";function c(a,b){this.data=a,b||(this.data=e.string2binary(this.data)),this.length=this.data.length,this.index=0}var d=a("./dataReader"),e=a("./utils");c.prototype=new d,c.prototype.byteAt=function(a){return this.data.charCodeAt(a)},c.prototype.lastIndexOfSignature=function(a){return this.data.lastIndexOf(a)},c.prototype.readData=function(a){this.checkOffset(a);var b=this.data.slice(this.index,this.index+a);return this.index+=a,b},b.exports=c},{"./dataReader":4,"./utils":14}],12:[function(a,b,c){var d=a("__browserify_process");if(c.base64=!0,c.array=!0,c.string=!0,c.arraybuffer="undefined"!=typeof ArrayBuffer&&"undefined"!=typeof Uint8Array,c.nodebuffer=!d.browser,c.uint8array="undefined"!=typeof Uint8Array,"undefined"==typeof ArrayBuffer)c.blob=!1;else{var e=new ArrayBuffer(0);try{c.blob=0===new Blob([e],{type:"application/zip"}).size}catch(f){try{var g=window.BlobBuilder||window.WebKitBlobBuilder||window.MozBlobBuilder||window.MSBlobBuilder,h=new g;h.append(e),c.blob=0===h.getBlob("application/zip").size}catch(f){c.blob=!1}}}},{__browserify_process:18}],13:[function(a,b){"use strict";function c(a){a&&(this.data=a,this.length=this.data.length,this.index=0)}var d=a("./dataReader");c.prototype=new d,c.prototype.byteAt=function(a){return this.data[a]},c.prototype.lastIndexOfSignature=function(a){for(var b=a.charCodeAt(0),c=a.charCodeAt(1),d=a.charCodeAt(2),e=a.charCodeAt(3),f=this.length-4;f>=0;--f)if(this.data[f]===b&&this.data[f+1]===c&&this.data[f+2]===d&&this.data[f+3]===e)return f;return-1},c.prototype.readData=function(a){this.checkOffset(a);var b=this.data.subarray(this.index,this.index+a);return this.index+=a,b},b.exports=c},{"./dataReader":4}],14:[function(a,b,c){"use strict";function d(a){return a}function e(a,b){for(var c=0;c<a.length;++c)b[c]=255&a.charCodeAt(c);return b}function f(a){var b=65536,d=[],e=a.length,f=c.getTypeOf(a),g=0,h=!0;try{switch(f){case"uint8array":String.fromCharCode.apply(null,new Uint8Array(0));break;case"nodebuffer":String.fromCharCode.apply(null,j(0))}}catch(i){h=!1}if(!h){for(var k="",l=0;l<a.length;l++)k+=String.fromCharCode(a[l]);return k}for(;e>g&&b>1;)try{d.push("array"===f||"nodebuffer"===f?String.fromCharCode.apply(null,a.slice(g,Math.min(g+b,e))):String.fromCharCode.apply(null,a.subarray(g,Math.min(g+b,e)))),g+=b}catch(i){b=Math.floor(b/2)}return d.join("")}function g(a,b){for(var c=0;c<a.length;c++)b[c]=a[c];return b}var h=a("./support"),i=a("./compressions"),j=a("./nodeBuffer");c.string2binary=function(a){for(var b="",c=0;c<a.length;c++)b+=String.fromCharCode(255&a.charCodeAt(c));return b},c.string2Uint8Array=function(a){return c.transformTo("uint8array",a)},c.uint8Array2String=function(a){return c.transformTo("string",a)},c.string2Blob=function(a){var b=c.transformTo("arraybuffer",a);return c.arrayBuffer2Blob(b)},c.arrayBuffer2Blob=function(a){c.checkSupport("blob");try{return new Blob([a],{type:"application/zip"})}catch(b){try{var d=window.BlobBuilder||window.WebKitBlobBuilder||window.MozBlobBuilder||window.MSBlobBuilder,e=new d;return e.append(a),e.getBlob("application/zip")}catch(b){throw new Error("Bug : can't construct the Blob.")}}};var k={};k.string={string:d,array:function(a){return e(a,new Array(a.length))},arraybuffer:function(a){return k.string.uint8array(a).buffer},uint8array:function(a){return e(a,new Uint8Array(a.length))},nodebuffer:function(a){return e(a,j(a.length))}},k.array={string:f,array:d,arraybuffer:function(a){return new Uint8Array(a).buffer},uint8array:function(a){return new Uint8Array(a)},nodebuffer:function(a){return j(a)}},k.arraybuffer={string:function(a){return f(new Uint8Array(a))},array:function(a){return g(new Uint8Array(a),new Array(a.byteLength))},arraybuffer:d,uint8array:function(a){return new Uint8Array(a)},nodebuffer:function(a){return j(new Uint8Array(a))}},k.uint8array={string:f,array:function(a){return g(a,new Array(a.length))},arraybuffer:function(a){return a.buffer},uint8array:d,nodebuffer:function(a){return j(a)}},k.nodebuffer={string:f,array:function(a){return g(a,new Array(a.length))},arraybuffer:function(a){return k.nodebuffer.uint8array(a).buffer},uint8array:function(a){return g(a,new Uint8Array(a.length))},nodebuffer:d},c.transformTo=function(a,b){if(b||(b=""),!a)return b;c.checkSupport(a);var d=c.getTypeOf(b),e=k[d][a](b);return e},c.getTypeOf=function(a){return"string"==typeof a?"string":"[object Array]"===Object.prototype.toString.call(a)?"array":h.nodebuffer&&j.test(a)?"nodebuffer":h.uint8array&&a instanceof Uint8Array?"uint8array":h.arraybuffer&&a instanceof ArrayBuffer?"arraybuffer":void 0},c.checkSupport=function(a){var b=h[a.toLowerCase()];if(!b)throw new Error(a+" is not supported by this browser")},c.MAX_VALUE_16BITS=65535,c.MAX_VALUE_32BITS=-1,c.pretty=function(a){var b,c,d="";for(c=0;c<(a||"").length;c++)b=a.charCodeAt(c),d+="\\x"+(16>b?"0":"")+b.toString(16).toUpperCase();return d},c.findCompression=function(a){for(var b in i)if(i.hasOwnProperty(b)&&i[b].magic===a)return i[b];return null},c.isRegExp=function(a){return"[object RegExp]"===Object.prototype.toString.call(a)}},{"./compressions":3,"./nodeBuffer":17,"./support":12}],15:[function(a,b){"use strict";function c(a,b){this.files=[],this.loadOptions=b,a&&this.load(a)}var d=a("./stringReader"),e=a("./nodeBufferReader"),f=a("./uint8ArrayReader"),g=a("./utils"),h=a("./signature"),i=a("./zipEntry"),j=a("./support");c.prototype={checkSignature:function(a){var b=this.reader.readString(4);if(b!==a)throw new Error("Corrupted zip or bug : unexpected signature ("+g.pretty(b)+", expected "+g.pretty(a)+")")},readBlockEndOfCentral:function(){this.diskNumber=this.reader.readInt(2),this.diskWithCentralDirStart=this.reader.readInt(2),this.centralDirRecordsOnThisDisk=this.reader.readInt(2),this.centralDirRecords=this.reader.readInt(2),this.centralDirSize=this.reader.readInt(4),this.centralDirOffset=this.reader.readInt(4),this.zipCommentLength=this.reader.readInt(2),this.zipComment=this.reader.readString(this.zipCommentLength)},readBlockZip64EndOfCentral:function(){this.zip64EndOfCentralSize=this.reader.readInt(8),this.versionMadeBy=this.reader.readString(2),this.versionNeeded=this.reader.readInt(2),this.diskNumber=this.reader.readInt(4),this.diskWithCentralDirStart=this.reader.readInt(4),this.centralDirRecordsOnThisDisk=this.reader.readInt(8),this.centralDirRecords=this.reader.readInt(8),this.centralDirSize=this.reader.readInt(8),this.centralDirOffset=this.reader.readInt(8),this.zip64ExtensibleData={};for(var a,b,c,d=this.zip64EndOfCentralSize-44,e=0;d>e;)a=this.reader.readInt(2),b=this.reader.readInt(4),c=this.reader.readString(b),this.zip64ExtensibleData[a]={id:a,length:b,value:c}},readBlockZip64EndOfCentralLocator:function(){if(this.diskWithZip64CentralDirStart=this.reader.readInt(4),this.relativeOffsetEndOfZip64CentralDir=this.reader.readInt(8),this.disksCount=this.reader.readInt(4),this.disksCount>1)throw new Error("Multi-volumes zip are not supported")},readLocalFiles:function(){var a,b;for(a=0;a<this.files.length;a++)b=this.files[a],this.reader.setIndex(b.localHeaderOffset),this.checkSignature(h.LOCAL_FILE_HEADER),b.readLocalPart(this.reader),b.handleUTF8()},readCentralDir:function(){var a;for(this.reader.setIndex(this.centralDirOffset);this.reader.readString(4)===h.CENTRAL_FILE_HEADER;)a=new i({zip64:this.zip64},this.loadOptions),a.readCentralPart(this.reader),this.files.push(a)},readEndOfCentral:function(){var a=this.reader.lastIndexOfSignature(h.CENTRAL_DIRECTORY_END);if(-1===a)throw new Error("Corrupted zip : can't find end of central directory");if(this.reader.setIndex(a),this.checkSignature(h.CENTRAL_DIRECTORY_END),this.readBlockEndOfCentral(),this.diskNumber===g.MAX_VALUE_16BITS||this.diskWithCentralDirStart===g.MAX_VALUE_16BITS||this.centralDirRecordsOnThisDisk===g.MAX_VALUE_16BITS||this.centralDirRecords===g.MAX_VALUE_16BITS||this.centralDirSize===g.MAX_VALUE_32BITS||this.centralDirOffset===g.MAX_VALUE_32BITS){if(this.zip64=!0,a=this.reader.lastIndexOfSignature(h.ZIP64_CENTRAL_DIRECTORY_LOCATOR),-1===a)throw new Error("Corrupted zip : can't find the ZIP64 end of central directory locator");this.reader.setIndex(a),this.checkSignature(h.ZIP64_CENTRAL_DIRECTORY_LOCATOR),this.readBlockZip64EndOfCentralLocator(),this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir),this.checkSignature(h.ZIP64_CENTRAL_DIRECTORY_END),this.readBlockZip64EndOfCentral()}},prepareReader:function(a){var b=g.getTypeOf(a);this.reader="string"!==b||j.uint8array?"nodebuffer"===b?new e(a):new f(g.transformTo("uint8array",a)):new d(a,this.loadOptions.optimizedBinaryString)},load:function(a){this.prepareReader(a),this.readEndOfCentral(),this.readCentralDir(),this.readLocalFiles()}},b.exports=c},{"./nodeBufferReader":17,"./signature":10,"./stringReader":11,"./support":12,"./uint8ArrayReader":13,"./utils":14,"./zipEntry":16}],16:[function(a,b){"use strict";function c(a,b){this.options=a,this.loadOptions=b}var d=a("./stringReader"),e=a("./utils"),f=a("./compressedObject"),g=a("./object");c.prototype={isEncrypted:function(){return 1===(1&this.bitFlag)},useUTF8:function(){return 2048===(2048&this.bitFlag)},prepareCompressedContent:function(a,b,c){return function(){var d=a.index;a.setIndex(b);var e=a.readData(c);return a.setIndex(d),e}},prepareContent:function(a,b,c,d,f){return function(){var a=e.transformTo(d.uncompressInputType,this.getCompressedContent()),b=d.uncompress(a);if(b.length!==f)throw new Error("Bug : uncompressed data size mismatch");return b}},readLocalPart:function(a){var b,c;if(a.skip(22),this.fileNameLength=a.readInt(2),c=a.readInt(2),this.fileName=a.readString(this.fileNameLength),a.skip(c),-1==this.compressedSize||-1==this.uncompressedSize)throw new Error("Bug or corrupted zip : didn't get enough informations from the central directory (compressedSize == -1 || uncompressedSize == -1)");if(b=e.findCompression(this.compressionMethod),null===b)throw new Error("Corrupted zip : compression "+e.pretty(this.compressionMethod)+" unknown (inner file : "+this.fileName+")");if(this.decompressed=new f,this.decompressed.compressedSize=this.compressedSize,this.decompressed.uncompressedSize=this.uncompressedSize,this.decompressed.crc32=this.crc32,this.decompressed.compressionMethod=this.compressionMethod,this.decompressed.getCompressedContent=this.prepareCompressedContent(a,a.index,this.compressedSize,b),this.decompressed.getContent=this.prepareContent(a,a.index,this.compressedSize,b,this.uncompressedSize),this.loadOptions.checkCRC32&&(this.decompressed=e.transformTo("string",this.decompressed.getContent()),g.crc32(this.decompressed)!==this.crc32))throw new Error("Corrupted zip : CRC32 mismatch")},readCentralPart:function(a){if(this.versionMadeBy=a.readString(2),this.versionNeeded=a.readInt(2),this.bitFlag=a.readInt(2),this.compressionMethod=a.readString(2),this.date=a.readDate(),this.crc32=a.readInt(4),this.compressedSize=a.readInt(4),this.uncompressedSize=a.readInt(4),this.fileNameLength=a.readInt(2),this.extraFieldsLength=a.readInt(2),this.fileCommentLength=a.readInt(2),this.diskNumberStart=a.readInt(2),this.internalFileAttributes=a.readInt(2),this.externalFileAttributes=a.readInt(4),this.localHeaderOffset=a.readInt(4),this.isEncrypted())throw new Error("Encrypted zip are not supported");this.fileName=a.readString(this.fileNameLength),this.readExtraFields(a),this.parseZIP64ExtraField(a),this.fileComment=a.readString(this.fileCommentLength),this.dir=16&this.externalFileAttributes?!0:!1},parseZIP64ExtraField:function(){if(this.extraFields[1]){var a=new d(this.extraFields[1].value);this.uncompressedSize===e.MAX_VALUE_32BITS&&(this.uncompressedSize=a.readInt(8)),this.compressedSize===e.MAX_VALUE_32BITS&&(this.compressedSize=a.readInt(8)),this.localHeaderOffset===e.MAX_VALUE_32BITS&&(this.localHeaderOffset=a.readInt(8)),this.diskNumberStart===e.MAX_VALUE_32BITS&&(this.diskNumberStart=a.readInt(4))}},readExtraFields:function(a){var b,c,d,e=a.index;for(this.extraFields=this.extraFields||{};a.index<e+this.extraFieldsLength;)b=a.readInt(2),c=a.readInt(2),d=a.readString(c),this.extraFields[b]={id:b,length:c,value:d}},handleUTF8:function(){if(this.useUTF8())this.fileName=g.utf8decode(this.fileName),this.fileComment=g.utf8decode(this.fileComment);else{var a=this.findExtraFieldUnicodePath();null!==a&&(this.fileName=a)}},findExtraFieldUnicodePath:function(){var a=this.extraFields[28789];if(a){var b=new d(a.value);return 1!==b.readInt(1)?null:g.crc32(this.fileName)!==b.readInt(4)?null:g.utf8decode(b.readString(a.length-5))}return null}},b.exports=c},{"./compressedObject":2,"./object":9,"./stringReader":11,"./utils":14}],17:[function(){},{}],18:[function(a,b){var c=b.exports={};c.nextTick=function(){var a="undefined"!=typeof window&&window.setImmediate,b="undefined"!=typeof window&&window.postMessage&&window.addEventListener;if(a)return function(a){return window.setImmediate(a)};if(b){var c=[];return window.addEventListener("message",function(a){var b=a.source;if((b===window||null===b)&&"process-tick"===a.data&&(a.stopPropagation(),c.length>0)){var d=c.shift();d()}},!0),function(a){c.push(a),window.postMessage("process-tick","*")}}return function(a){setTimeout(a,0)}}(),c.title="browser",c.browser=!0,c.env={},c.argv=[],c.binding=function(){throw new Error("process.binding is not supported")},c.cwd=function(){return"/"},c.chdir=function(){throw new Error("process.chdir is not supported")}},{}],19:[function(){/** @license zlib.js 2012 - imaya [ https://github.com/imaya/zlib.js ] The MIT License */
(function(){"use strict";function a(a,b){var c=a.split("."),d=n;!(c[0]in d)&&d.execScript&&d.execScript("var "+c[0]);for(var e;c.length&&(e=c.shift());)c.length||b===l?d=d[e]?d[e]:d[e]={}:d[e]=b}function b(a,b){if(this.index="number"==typeof b?b:0,this.d=0,this.buffer=a instanceof(o?Uint8Array:Array)?a:new(o?Uint8Array:Array)(32768),2*this.buffer.length<=this.index)throw Error("invalid index");this.buffer.length<=this.index&&c(this)}function c(a){var b,c=a.buffer,d=c.length,e=new(o?Uint8Array:Array)(d<<1);if(o)e.set(c);else for(b=0;d>b;++b)e[b]=c[b];return a.buffer=e}function d(a){this.buffer=new(o?Uint16Array:Array)(2*a),this.length=0}function e(a,b){this.e=w,this.f=0,this.input=o&&a instanceof Array?new Uint8Array(a):a,this.c=0,b&&(b.lazy&&(this.f=b.lazy),"number"==typeof b.compressionType&&(this.e=b.compressionType),b.outputBuffer&&(this.b=o&&b.outputBuffer instanceof Array?new Uint8Array(b.outputBuffer):b.outputBuffer),"number"==typeof b.outputIndex&&(this.c=b.outputIndex)),this.b||(this.b=new(o?Uint8Array:Array)(32768))}function f(a,b){this.length=a,this.g=b}function g(a,b){function c(a,b){var c,d=a.g,e=[],f=0;c=z[a.length],e[f++]=65535&c,e[f++]=c>>16&255,e[f++]=c>>24;var g;switch(m){case 1===d:g=[0,d-1,0];break;case 2===d:g=[1,d-2,0];break;case 3===d:g=[2,d-3,0];break;case 4===d:g=[3,d-4,0];break;case 6>=d:g=[4,d-5,1];break;case 8>=d:g=[5,d-7,1];break;case 12>=d:g=[6,d-9,2];break;case 16>=d:g=[7,d-13,2];break;case 24>=d:g=[8,d-17,3];break;case 32>=d:g=[9,d-25,3];break;case 48>=d:g=[10,d-33,4];break;case 64>=d:g=[11,d-49,4];break;case 96>=d:g=[12,d-65,5];break;case 128>=d:g=[13,d-97,5];break;case 192>=d:g=[14,d-129,6];break;case 256>=d:g=[15,d-193,6];break;case 384>=d:g=[16,d-257,7];break;case 512>=d:g=[17,d-385,7];break;case 768>=d:g=[18,d-513,8];break;case 1024>=d:g=[19,d-769,8];break;case 1536>=d:g=[20,d-1025,9];break;case 2048>=d:g=[21,d-1537,9];break;case 3072>=d:g=[22,d-2049,10];break;case 4096>=d:g=[23,d-3073,10];break;case 6144>=d:g=[24,d-4097,11];break;case 8192>=d:g=[25,d-6145,11];break;case 12288>=d:g=[26,d-8193,12];break;case 16384>=d:g=[27,d-12289,12];break;case 24576>=d:g=[28,d-16385,13];break;case 32768>=d:g=[29,d-24577,13];break;default:throw"invalid distance"}c=g,e[f++]=c[0],e[f++]=c[1],e[f++]=c[2];var h,i;for(h=0,i=e.length;i>h;++h)r[s++]=e[h];u[e[0]]++,v[e[3]]++,t=a.length+b-1,n=null}var d,e,f,g,i,j,k,n,p,q={},r=o?new Uint16Array(2*b.length):[],s=0,t=0,u=new(o?Uint32Array:Array)(286),v=new(o?Uint32Array:Array)(30),w=a.f;if(!o){for(f=0;285>=f;)u[f++]=0;for(f=0;29>=f;)v[f++]=0}for(u[256]=1,d=0,e=b.length;e>d;++d){for(f=i=0,g=3;g>f&&d+f!==e;++f)i=i<<8|b[d+f];if(q[i]===l&&(q[i]=[]),j=q[i],!(0<t--)){for(;0<j.length&&32768<d-j[0];)j.shift();if(d+3>=e){for(n&&c(n,-1),f=0,g=e-d;g>f;++f)p=b[d+f],r[s++]=p,++u[p];break}0<j.length?(k=h(b,d,j),n?n.length<k.length?(p=b[d-1],r[s++]=p,++u[p],c(k,0)):c(n,-1):k.length<w?n=k:c(k,0)):n?c(n,-1):(p=b[d],r[s++]=p,++u[p])}j.push(d)}return r[s++]=256,u[256]++,a.j=u,a.i=v,o?r.subarray(0,s):r}function h(a,b,c){var d,e,g,h,i,j,k=0,l=a.length;h=0,j=c.length;a:for(;j>h;h++){if(d=c[j-h-1],g=3,k>3){for(i=k;i>3;i--)if(a[d+i-1]!==a[b+i-1])continue a;g=k}for(;258>g&&l>b+g&&a[d+g]===a[b+g];)++g;if(g>k&&(e=d,k=g),258===g)break}return new f(k,b-e)}function i(a,b){var c,e,f,g,h,i=a.length,k=new d(572),l=new(o?Uint8Array:Array)(i);if(!o)for(g=0;i>g;g++)l[g]=0;for(g=0;i>g;++g)0<a[g]&&k.push(g,a[g]);if(c=Array(k.length/2),e=new(o?Uint32Array:Array)(k.length/2),1===c.length)return l[k.pop().index]=1,l;for(g=0,h=k.length/2;h>g;++g)c[g]=k.pop(),e[g]=c[g].value;for(f=j(e,e.length,b),g=0,h=c.length;h>g;++g)l[c[g].index]=f[g];return l}function j(a,b,c){function d(a){var c=n[a][p[a]];c===b?(d(a+1),d(a+1)):--l[c],++p[a]}var e,f,g,h,i,j=new(o?Uint16Array:Array)(c),k=new(o?Uint8Array:Array)(c),l=new(o?Uint8Array:Array)(b),m=Array(c),n=Array(c),p=Array(c),q=(1<<c)-b,r=1<<c-1;for(j[c-1]=b,f=0;c>f;++f)r>q?k[f]=0:(k[f]=1,q-=r),q<<=1,j[c-2-f]=(j[c-1-f]/2|0)+b;for(j[0]=k[0],m[0]=Array(j[0]),n[0]=Array(j[0]),f=1;c>f;++f)j[f]>2*j[f-1]+k[f]&&(j[f]=2*j[f-1]+k[f]),m[f]=Array(j[f]),n[f]=Array(j[f]);for(e=0;b>e;++e)l[e]=c;for(g=0;g<j[c-1];++g)m[c-1][g]=a[g],n[c-1][g]=g;for(e=0;c>e;++e)p[e]=0;for(1===k[c-1]&&(--l[0],++p[c-1]),f=c-2;f>=0;--f){for(h=e=0,i=p[f+1],g=0;g<j[f];g++)h=m[f+1][i]+m[f+1][i+1],h>a[e]?(m[f][g]=h,n[f][g]=b,i+=2):(m[f][g]=a[e],n[f][g]=e,++e);p[f]=0,1===k[f]&&d(f)}return l}function k(a){var b,c,d,e,f=new(o?Uint16Array:Array)(a.length),g=[],h=[],i=0;for(b=0,c=a.length;c>b;b++)g[a[b]]=(0|g[a[b]])+1;for(b=1,c=16;c>=b;b++)h[b]=i,i+=0|g[b],i<<=1;for(b=0,c=a.length;c>b;b++)for(i=h[a[b]],h[a[b]]+=1,d=f[b]=0,e=a[b];e>d;d++)f[b]=f[b]<<1|1&i,i>>>=1;return f}var l=void 0,m=!0,n=this,o="undefined"!=typeof Uint8Array&&"undefined"!=typeof Uint16Array&&"undefined"!=typeof Uint32Array&&"undefined"!=typeof DataView;b.prototype.a=function(a,b,d){var e,f=this.buffer,g=this.index,h=this.d,i=f[g];if(d&&b>1&&(a=b>8?(u[255&a]<<24|u[a>>>8&255]<<16|u[a>>>16&255]<<8|u[a>>>24&255])>>32-b:u[a]>>8-b),8>b+h)i=i<<b|a,h+=b;else for(e=0;b>e;++e)i=i<<1|a>>b-e-1&1,8===++h&&(h=0,f[g++]=u[i],i=0,g===f.length&&(f=c(this)));f[g]=i,this.buffer=f,this.d=h,this.index=g},b.prototype.finish=function(){var a,b=this.buffer,c=this.index;return 0<this.d&&(b[c]<<=8-this.d,b[c]=u[b[c]],c++),o?a=b.subarray(0,c):(b.length=c,a=b),a};var p,q=new(o?Uint8Array:Array)(256);for(p=0;256>p;++p){for(var r=p,s=r,t=7,r=r>>>1;r;r>>>=1)s<<=1,s|=1&r,--t;q[p]=(s<<t&255)>>>0}var u=q;d.prototype.getParent=function(a){return 2*((a-2)/4|0)},d.prototype.push=function(a,b){var c,d,e,f=this.buffer;for(c=this.length,f[this.length++]=b,f[this.length++]=a;c>0&&(d=this.getParent(c),f[c]>f[d]);)e=f[c],f[c]=f[d],f[d]=e,e=f[c+1],f[c+1]=f[d+1],f[d+1]=e,c=d;return this.length},d.prototype.pop=function(){var a,b,c,d,e,f=this.buffer;for(b=f[0],a=f[1],this.length-=2,f[0]=f[this.length],f[1]=f[this.length+1],e=0;(d=2*e+2,!(d>=this.length))&&(d+2<this.length&&f[d+2]>f[d]&&(d+=2),f[d]>f[e]);)c=f[e],f[e]=f[d],f[d]=c,c=f[e+1],f[e+1]=f[d+1],f[d+1]=c,e=d;return{index:a,value:b,length:this.length}};var v,w=2,x=[];for(v=0;288>v;v++)switch(m){case 143>=v:x.push([v+48,8]);break;case 255>=v:x.push([v-144+400,9]);break;case 279>=v:x.push([v-256+0,7]);break;case 287>=v:x.push([v-280+192,8]);break;default:throw"invalid literal: "+v}e.prototype.h=function(){var a,c,d,e,f=this.input;switch(this.e){case 0:for(d=0,e=f.length;e>d;){c=o?f.subarray(d,d+65535):f.slice(d,d+65535),d+=c.length;var h=c,j=d===e,n=l,p=l,q=l,r=l,s=l,t=this.b,u=this.c;if(o){for(t=new Uint8Array(this.b.buffer);t.length<=u+h.length+5;)t=new Uint8Array(t.length<<1);t.set(this.b)}if(n=j?1:0,t[u++]=0|n,p=h.length,q=~p+65536&65535,t[u++]=255&p,t[u++]=p>>>8&255,t[u++]=255&q,t[u++]=q>>>8&255,o)t.set(h,u),u+=h.length,t=t.subarray(0,u);else{for(r=0,s=h.length;s>r;++r)t[u++]=h[r];t.length=u}this.c=u,this.b=t}break;case 1:var v=new b(o?new Uint8Array(this.b.buffer):this.b,this.c);v.a(1,1,m),v.a(1,2,m);var y,z,A,B=g(this,f);for(y=0,z=B.length;z>y;y++)if(A=B[y],b.prototype.a.apply(v,x[A]),A>256)v.a(B[++y],B[++y],m),v.a(B[++y],5),v.a(B[++y],B[++y],m);else if(256===A)break;this.b=v.finish(),this.c=this.b.length;break;case w:var C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R=new b(o?new Uint8Array(this.b.buffer):this.b,this.c),S=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15],T=Array(19);for(C=w,R.a(1,1,m),R.a(C,2,m),D=g(this,f),H=i(this.j,15),I=k(H),J=i(this.i,7),K=k(J),E=286;E>257&&0===H[E-1];E--);for(F=30;F>1&&0===J[F-1];F--);var U,V,W,X,Y,Z,$=E,_=F,ab=new(o?Uint32Array:Array)($+_),bb=new(o?Uint32Array:Array)(316),cb=new(o?Uint8Array:Array)(19);for(U=V=0;$>U;U++)ab[V++]=H[U];for(U=0;_>U;U++)ab[V++]=J[U];if(!o)for(U=0,X=cb.length;X>U;++U)cb[U]=0;for(U=Y=0,X=ab.length;X>U;U+=V){for(V=1;X>U+V&&ab[U+V]===ab[U];++V);if(W=V,0===ab[U])if(3>W)for(;0<W--;)bb[Y++]=0,cb[0]++;else for(;W>0;)Z=138>W?W:138,Z>W-3&&W>Z&&(Z=W-3),10>=Z?(bb[Y++]=17,bb[Y++]=Z-3,cb[17]++):(bb[Y++]=18,bb[Y++]=Z-11,cb[18]++),W-=Z;else if(bb[Y++]=ab[U],cb[ab[U]]++,W--,3>W)for(;0<W--;)bb[Y++]=ab[U],cb[ab[U]]++;else for(;W>0;)Z=6>W?W:6,Z>W-3&&W>Z&&(Z=W-3),bb[Y++]=16,bb[Y++]=Z-3,cb[16]++,W-=Z}for(a=o?bb.subarray(0,Y):bb.slice(0,Y),L=i(cb,7),P=0;19>P;P++)T[P]=L[S[P]];for(G=19;G>4&&0===T[G-1];G--);for(M=k(L),R.a(E-257,5,m),R.a(F-1,5,m),R.a(G-4,4,m),P=0;G>P;P++)R.a(T[P],3,m);for(P=0,Q=a.length;Q>P;P++)if(N=a[P],R.a(M[N],L[N],m),N>=16){switch(P++,N){case 16:O=2;break;case 17:O=3;break;case 18:O=7;break;default:throw"invalid code: "+N}R.a(a[P],O,m)}var db,eb,fb,gb,hb,ib,jb,kb,lb=[I,H],mb=[K,J];for(hb=lb[0],ib=lb[1],jb=mb[0],kb=mb[1],db=0,eb=D.length;eb>db;++db)if(fb=D[db],R.a(hb[fb],ib[fb],m),fb>256)R.a(D[++db],D[++db],m),gb=D[++db],R.a(jb[gb],kb[gb],m),R.a(D[++db],D[++db],m);else if(256===fb)break;this.b=R.finish(),this.c=this.b.length;break;default:throw"invalid compression type"}return this.b};var y=function(){function a(a){switch(m){case 3===a:return[257,a-3,0];case 4===a:return[258,a-4,0];case 5===a:return[259,a-5,0];case 6===a:return[260,a-6,0];case 7===a:return[261,a-7,0];case 8===a:return[262,a-8,0];case 9===a:return[263,a-9,0];case 10===a:return[264,a-10,0];case 12>=a:return[265,a-11,1];case 14>=a:return[266,a-13,1];case 16>=a:return[267,a-15,1];case 18>=a:return[268,a-17,1];case 22>=a:return[269,a-19,2];case 26>=a:return[270,a-23,2];case 30>=a:return[271,a-27,2];case 34>=a:return[272,a-31,2];case 42>=a:return[273,a-35,3];case 50>=a:return[274,a-43,3];case 58>=a:return[275,a-51,3];case 66>=a:return[276,a-59,3];case 82>=a:return[277,a-67,4];case 98>=a:return[278,a-83,4];case 114>=a:return[279,a-99,4];case 130>=a:return[280,a-115,4];case 162>=a:return[281,a-131,5];case 194>=a:return[282,a-163,5];case 226>=a:return[283,a-195,5];case 257>=a:return[284,a-227,5];case 258===a:return[285,a-258,0];default:throw"invalid length: "+a}}var b,c,d=[];for(b=3;258>=b;b++)c=a(b),d[b]=c[2]<<24|c[1]<<16|c[0];return d}(),z=o?new Uint32Array(y):y;a("Zlib.RawDeflate",e),a("Zlib.RawDeflate.prototype.compress",e.prototype.h);var A,B,C,D,E={NONE:0,FIXED:1,DYNAMIC:w};if(Object.keys)A=Object.keys(E);else for(B in A=[],C=0,E)A[C++]=B;for(C=0,D=A.length;D>C;++C)B=A[C],a("Zlib.RawDeflate.CompressionType."+B,E[B])}).call(this)},{}],20:[function(){/** @license zlib.js 2012 - imaya [ https://github.com/imaya/zlib.js ] The MIT License */
(function(){"use strict";function a(a,b){var c=a.split("."),d=g;!(c[0]in d)&&d.execScript&&d.execScript("var "+c[0]);for(var e;c.length&&(e=c.shift());)c.length||void 0===b?d=d[e]?d[e]:d[e]={}:d[e]=b}function b(a){var b,c,d,e,f,g,i,j,k,l,m=a.length,n=0,o=Number.POSITIVE_INFINITY;for(j=0;m>j;++j)a[j]>n&&(n=a[j]),a[j]<o&&(o=a[j]);for(b=1<<n,c=new(h?Uint32Array:Array)(b),d=1,e=0,f=2;n>=d;){for(j=0;m>j;++j)if(a[j]===d){for(g=0,i=e,k=0;d>k;++k)g=g<<1|1&i,i>>=1;for(l=d<<16|j,k=g;b>k;k+=f)c[k]=l;++e}++d,e<<=1,f<<=1}return[c,n,o]}function c(a,b){switch(this.g=[],this.h=32768,this.c=this.f=this.d=this.k=0,this.input=h?new Uint8Array(a):a,this.l=!1,this.i=j,this.q=!1,(b||!(b={}))&&(b.index&&(this.d=b.index),b.bufferSize&&(this.h=b.bufferSize),b.bufferType&&(this.i=b.bufferType),b.resize&&(this.q=b.resize)),this.i){case i:this.a=32768,this.b=new(h?Uint8Array:Array)(32768+this.h+258);break;case j:this.a=0,this.b=new(h?Uint8Array:Array)(this.h),this.e=this.v,this.m=this.s,this.j=this.t;break;default:throw Error("invalid inflate mode")}}function d(a,b){for(var c,d=a.f,e=a.c,f=a.input,g=a.d,h=f.length;b>e;){if(g>=h)throw Error("input buffer is broken");d|=f[g++]<<e,e+=8}return c=d&(1<<b)-1,a.f=d>>>b,a.c=e-b,a.d=g,c}function e(a,b){for(var c,d,e=a.f,f=a.c,g=a.input,h=a.d,i=g.length,j=b[0],k=b[1];k>f&&!(h>=i);)e|=g[h++]<<f,f+=8;return c=j[e&(1<<k)-1],d=c>>>16,a.f=e>>d,a.c=f-d,a.d=h,65535&c}function f(a){function c(a,b,c){var f,g,h,i=this.p;for(h=0;a>h;)switch(f=e(this,b)){case 16:for(g=3+d(this,2);g--;)c[h++]=i;break;case 17:for(g=3+d(this,3);g--;)c[h++]=0;i=0;break;case 18:for(g=11+d(this,7);g--;)c[h++]=0;i=0;break;default:i=c[h++]=f}return this.p=i,c}var f,g,i,j,k=d(a,5)+257,l=d(a,5)+1,m=d(a,4)+4,o=new(h?Uint8Array:Array)(n.length);for(j=0;m>j;++j)o[n[j]]=d(a,3);if(!h)for(j=m,m=o.length;m>j;++j)o[n[j]]=0;f=b(o),g=new(h?Uint8Array:Array)(k),i=new(h?Uint8Array:Array)(l),a.p=0,a.j(b(c.call(a,k,f,g)),b(c.call(a,l,f,i)))}var g=this,h="undefined"!=typeof Uint8Array&&"undefined"!=typeof Uint16Array&&"undefined"!=typeof Uint32Array&&"undefined"!=typeof DataView,i=0,j=1;c.prototype.u=function(){for(;!this.l;){var a=d(this,3);switch(1&a&&(this.l=!0),a>>>=1){case 0:var b=this.input,c=this.d,e=this.b,g=this.a,k=b.length,l=void 0,m=void 0,n=e.length,o=void 0;if(this.c=this.f=0,c+1>=k)throw Error("invalid uncompressed block header: LEN");if(l=b[c++]|b[c++]<<8,c+1>=k)throw Error("invalid uncompressed block header: NLEN");if(m=b[c++]|b[c++]<<8,l===~m)throw Error("invalid uncompressed block header: length verify");if(c+l>b.length)throw Error("input buffer is broken");switch(this.i){case i:for(;g+l>e.length;){if(o=n-g,l-=o,h)e.set(b.subarray(c,c+o),g),g+=o,c+=o;else for(;o--;)e[g++]=b[c++];this.a=g,e=this.e(),g=this.a}break;case j:for(;g+l>e.length;)e=this.e({o:2});break;default:throw Error("invalid inflate mode")}if(h)e.set(b.subarray(c,c+l),g),g+=l,c+=l;else for(;l--;)e[g++]=b[c++];this.d=c,this.a=g,this.b=e;break;case 1:this.j(z,B);break;case 2:f(this);break;default:throw Error("unknown BTYPE: "+a)}}return this.m()};var k,l,m=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15],n=h?new Uint16Array(m):m,o=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258,258,258],p=h?new Uint16Array(o):o,q=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0],r=h?new Uint8Array(q):q,s=[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577],t=h?new Uint16Array(s):s,u=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13],v=h?new Uint8Array(u):u,w=new(h?Uint8Array:Array)(288);for(k=0,l=w.length;l>k;++k)w[k]=143>=k?8:255>=k?9:279>=k?7:8;var x,y,z=b(w),A=new(h?Uint8Array:Array)(30);for(x=0,y=A.length;y>x;++x)A[x]=5;var B=b(A);c.prototype.j=function(a,b){var c=this.b,f=this.a;this.n=a;for(var g,h,i,j,k=c.length-258;256!==(g=e(this,a));)if(256>g)f>=k&&(this.a=f,c=this.e(),f=this.a),c[f++]=g;else for(h=g-257,j=p[h],0<r[h]&&(j+=d(this,r[h])),g=e(this,b),i=t[g],0<v[g]&&(i+=d(this,v[g])),f>=k&&(this.a=f,c=this.e(),f=this.a);j--;)c[f]=c[f++-i];for(;8<=this.c;)this.c-=8,this.d--;this.a=f},c.prototype.t=function(a,b){var c=this.b,f=this.a;this.n=a;for(var g,h,i,j,k=c.length;256!==(g=e(this,a));)if(256>g)f>=k&&(c=this.e(),k=c.length),c[f++]=g;else for(h=g-257,j=p[h],0<r[h]&&(j+=d(this,r[h])),g=e(this,b),i=t[g],0<v[g]&&(i+=d(this,v[g])),f+j>k&&(c=this.e(),k=c.length);j--;)c[f]=c[f++-i];for(;8<=this.c;)this.c-=8,this.d--;this.a=f},c.prototype.e=function(){var a,b,c=new(h?Uint8Array:Array)(this.a-32768),d=this.a-32768,e=this.b;if(h)c.set(e.subarray(32768,c.length));else for(a=0,b=c.length;b>a;++a)c[a]=e[a+32768];if(this.g.push(c),this.k+=c.length,h)e.set(e.subarray(d,d+32768));else for(a=0;32768>a;++a)e[a]=e[d+a];return this.a=32768,e},c.prototype.v=function(a){var b,c,d,e,f=this.input.length/this.d+1|0,g=this.input,i=this.b;return a&&("number"==typeof a.o&&(f=a.o),"number"==typeof a.r&&(f+=a.r)),2>f?(c=(g.length-this.d)/this.n[2],e=258*(c/2)|0,d=e<i.length?i.length+e:i.length<<1):d=i.length*f,h?(b=new Uint8Array(d),b.set(i)):b=i,this.b=b},c.prototype.m=function(){var a,b,c,d,e,f=0,g=this.b,i=this.g,j=new(h?Uint8Array:Array)(this.k+(this.a-32768));if(0===i.length)return h?this.b.subarray(32768,this.a):this.b.slice(32768,this.a);for(b=0,c=i.length;c>b;++b)for(a=i[b],d=0,e=a.length;e>d;++d)j[f++]=a[d];for(b=32768,c=this.a;c>b;++b)j[f++]=g[b];return this.g=[],this.buffer=j},c.prototype.s=function(){var a,b=this.a;return h?this.q?(a=new Uint8Array(b),a.set(this.b.subarray(0,b))):a=this.b.subarray(0,b):(this.b.length>b&&(this.b.length=b),a=this.b),this.buffer=a},a("Zlib.RawInflate",c),a("Zlib.RawInflate.prototype.decompress",c.prototype.u);var C,D,E,F,G={ADAPTIVE:j,BLOCK:i};if(Object.keys)C=Object.keys(G);else for(D in C=[],E=0,G)C[E++]=D;for(E=0,F=C.length;F>E;++E)D=C[E],a("Zlib.RawInflate.BufferType."+D,G[D])}).call(this)},{}]},{},[7])(7)});;// Spectrum Colorpicker v1.1.2
// https://github.com/bgrins/spectrum
// Author: Brian Grinstead
// License: MIT

(function (window, $, undefined) {
    var defaultOpts = {

        // Callbacks
        beforeShow: noop,
        move: noop,
        change: noop,
        show: noop,
        hide: noop,

        // Options
        color: false,
        flat: false,
        showInput: false,
        showButtons: true,
        clickoutFiresChange: false,
        showInitial: false,
        showPalette: false,
        showPaletteOnly: false,
        showSelectionPalette: true,
        localStorageKey: false,
        appendTo: "body",
        maxSelectionSize: 7,
        cancelText: "cancel",
        chooseText: "choose",
        preferredFormat: false,
        className: "",
        showAlpha: false,
        theme: "sp-light",
        palette: ['fff', '000'],
        selectionPalette: [],
        disabled: false
    },
    spectrums = [],
    IE = !!/msie/i.exec( window.navigator.userAgent ),
    rgbaSupport = (function() {
        function contains( str, substr ) {
            return !!~('' + str).indexOf(substr);
        }

        var elem = document.createElement('div');
        var style = elem.style;
        style.cssText = 'background-color:rgba(0,0,0,.5)';
        return contains(style.backgroundColor, 'rgba') || contains(style.backgroundColor, 'hsla');
    })(),
    replaceInput = [
        "<div class='sp-replacer'>",
            "<div class='sp-preview'><div class='sp-preview-inner'></div></div>",
            "<div class='sp-dd'>&#9660;</div>",
        "</div>"
    ].join(''),
    markup = (function () {

        // IE does not support gradients with multiple stops, so we need to simulate
        //  that for the rainbow slider with 8 divs that each have a single gradient
        var gradientFix = "";
        if (IE) {
            for (var i = 1; i <= 6; i++) {
                gradientFix += "<div class='sp-" + i + "'></div>";
            }
        }

        return [
            "<div class='sp-container sp-hidden'>",
                "<div class='sp-palette-container'>",
                    "<div class='sp-palette sp-thumb sp-cf'></div>",
                "</div>",
                "<div class='sp-picker-container'>",
                    "<div class='sp-top sp-cf'>",
                        "<div class='sp-fill'></div>",
                        "<div class='sp-top-inner'>",
                            "<div class='sp-color'>",
                                "<div class='sp-sat'>",
                                    "<div class='sp-val'>",
                                        "<div class='sp-dragger'></div>",
                                    "</div>",
                                "</div>",
                            "</div>",
                            "<div class='sp-hue'>",
                                "<div class='sp-slider'></div>",
                                gradientFix,
                            "</div>",
                        "</div>",
                        "<div class='sp-alpha'><div class='sp-alpha-inner'><div class='sp-alpha-handle'></div></div></div>",
                    "</div>",
                    "<div class='sp-input-container sp-cf'>",
                        "<input class='sp-input' type='text' spellcheck='false'  />",
                    "</div>",
                    "<div class='sp-initial sp-thumb sp-cf'></div>",
                    "<div class='sp-button-container sp-cf'>",
                        "<a class='sp-cancel' href='#'></a>",
                        "<button class='sp-choose'></button>",
                    "</div>",
                "</div>",
            "</div>"
        ].join("");
    })();

    function paletteTemplate (p, color, className) {
        var html = [];
        for (var i = 0; i < p.length; i++) {
            var tiny = tinycolor(p[i]);
            var c = tiny.toHsl().l < 0.5 ? "sp-thumb-el sp-thumb-dark" : "sp-thumb-el sp-thumb-light";
            c += (tinycolor.equals(color, p[i])) ? " sp-thumb-active" : "";

            var swatchStyle = rgbaSupport ? ("background-color:" + tiny.toRgbString()) : "filter:" + tiny.toFilter();
            html.push('<span title="' + tiny.toRgbString() + '" data-color="' + tiny.toRgbString() + '" class="' + c + '"><span class="sp-thumb-inner" style="' + swatchStyle + ';" /></span>');
        }
        return "<div class='sp-cf " + className + "'>" + html.join('') + "</div>";
    }

    function hideAll() {
        for (var i = 0; i < spectrums.length; i++) {
            if (spectrums[i]) {
                spectrums[i].hide();
            }
        }
    }

    function instanceOptions(o, callbackContext) {
        var opts = $.extend({}, defaultOpts, o);
        opts.callbacks = {
            'move': bind(opts.move, callbackContext),
            'change': bind(opts.change, callbackContext),
            'show': bind(opts.show, callbackContext),
            'hide': bind(opts.hide, callbackContext),
            'beforeShow': bind(opts.beforeShow, callbackContext)
        };

        return opts;
    }

    function spectrum(element, o) {

        var opts = instanceOptions(o, element),
            flat = opts.flat,
            showSelectionPalette = opts.showSelectionPalette,
            localStorageKey = opts.localStorageKey,
            theme = opts.theme,
            callbacks = opts.callbacks,
            resize = throttle(reflow, 10),
            visible = false,
            dragWidth = 0,
            dragHeight = 0,
            dragHelperHeight = 0,
            slideHeight = 0,
            slideWidth = 0,
            alphaWidth = 0,
            alphaSlideHelperWidth = 0,
            slideHelperHeight = 0,
            currentHue = 0,
            currentSaturation = 0,
            currentValue = 0,
            currentAlpha = 1,
            palette = opts.palette.slice(0),
            paletteArray = $.isArray(palette[0]) ? palette : [palette],
            selectionPalette = opts.selectionPalette.slice(0),
            maxSelectionSize = opts.maxSelectionSize,
            draggingClass = "sp-dragging",
            shiftMovementDirection = null;

        var doc = element.ownerDocument,
            body = doc.body,
            boundElement = $(element),
            disabled = false,
            container = $(markup, doc).addClass(theme),
            dragger = container.find(".sp-color"),
            dragHelper = container.find(".sp-dragger"),
            slider = container.find(".sp-hue"),
            slideHelper = container.find(".sp-slider"),
            alphaSliderInner = container.find(".sp-alpha-inner"),
            alphaSlider = container.find(".sp-alpha"),
            alphaSlideHelper = container.find(".sp-alpha-handle"),
            textInput = container.find(".sp-input"),
            paletteContainer = container.find(".sp-palette"),
            initialColorContainer = container.find(".sp-initial"),
            cancelButton = container.find(".sp-cancel"),
            chooseButton = container.find(".sp-choose"),
            isInput = boundElement.is("input"),
            shouldReplace = isInput && !flat,
            replacer = (shouldReplace) ? $(replaceInput).addClass(theme).addClass(opts.className) : $([]),
            offsetElement = (shouldReplace) ? replacer : boundElement,
            previewElement = replacer.find(".sp-preview-inner"),
            initialColor = opts.color || (isInput && boundElement.val()),
            colorOnShow = false,
            preferredFormat = opts.preferredFormat,
            currentPreferredFormat = preferredFormat,
            clickoutFiresChange = !opts.showButtons || opts.clickoutFiresChange;


        function applyOptions() {

            if (opts.showPaletteOnly) {
                opts.showPalette = true;
            }

            container.toggleClass("sp-flat", flat);
            container.toggleClass("sp-input-disabled", !opts.showInput);
            container.toggleClass("sp-alpha-enabled", opts.showAlpha);
            container.toggleClass("sp-buttons-disabled", !opts.showButtons);
            container.toggleClass("sp-palette-disabled", !opts.showPalette);
            container.toggleClass("sp-palette-only", opts.showPaletteOnly);
            container.toggleClass("sp-initial-disabled", !opts.showInitial);
            container.addClass(opts.className);

            reflow();
        }

        function initialize() {

            if (IE) {
                container.find("*:not(input)").attr("unselectable", "on");
            }

            applyOptions();

            if (shouldReplace) {
                boundElement.after(replacer).hide();
            }

            if (flat) {
                boundElement.after(container).hide();
            }
            else {

                var appendTo = opts.appendTo === "parent" ? boundElement.parent() : $(opts.appendTo);
                if (appendTo.length !== 1) {
                    appendTo = $("body");
                }

                appendTo.append(container);
            }

            if (localStorageKey && window.localStorage) {

                // Migrate old palettes over to new format.  May want to remove this eventually.
                try {
                    var oldPalette = window.localStorage[localStorageKey].split(",#");
                    if (oldPalette.length > 1) {
                        delete window.localStorage[localStorageKey];
                        $.each(oldPalette, function(i, c) {
                             addColorToSelectionPalette(c);
                        });
                    }
                }
                catch(e) { }

                try {
                    selectionPalette = window.localStorage[localStorageKey].split(";");
                }
                catch (e) { }
            }

            offsetElement.bind("click.spectrum touchstart.spectrum", function (e) {
                if (!disabled) {
                    toggle();
                }

                e.stopPropagation();

                if (!$(e.target).is("input")) {
                    e.preventDefault();
                }
            });

            if(boundElement.is(":disabled") || (opts.disabled === true)) {
                disable();
            }

            // Prevent clicks from bubbling up to document.  This would cause it to be hidden.
            container.click(stopPropagation);

            // Handle user typed input
            textInput.change(setFromTextInput);
            textInput.bind("paste", function () {
                setTimeout(setFromTextInput, 1);
            });
            textInput.keydown(function (e) { if (e.keyCode == 13) { setFromTextInput(); } });

            cancelButton.text(opts.cancelText);
            cancelButton.bind("click.spectrum", function (e) {
                e.stopPropagation();
                e.preventDefault();
                hide("cancel");
            });

            chooseButton.text(opts.chooseText);
            chooseButton.bind("click.spectrum", function (e) {
                e.stopPropagation();
                e.preventDefault();

                if (isValid()) {
                    updateOriginalInput(true);
                    hide();
                }
            });

            draggable(alphaSlider, function (dragX, dragY, e) {
                currentAlpha = (dragX / alphaWidth);
                if (e.shiftKey) {
                    currentAlpha = Math.round(currentAlpha * 10) / 10;
                }

                move();
            });

            draggable(slider, function (dragX, dragY) {
                currentHue = parseFloat(dragY / slideHeight);
                move();
            }, dragStart, dragStop);

            draggable(dragger, function (dragX, dragY, e) {

                // shift+drag should snap the movement to either the x or y axis.
                if (!e.shiftKey) {
                    shiftMovementDirection = null;
                }
                else if (!shiftMovementDirection) {
                    var oldDragX = currentSaturation * dragWidth;
                    var oldDragY = dragHeight - (currentValue * dragHeight);
                    var furtherFromX = Math.abs(dragX - oldDragX) > Math.abs(dragY - oldDragY);

                    shiftMovementDirection = furtherFromX ? "x" : "y";
                }

                var setSaturation = !shiftMovementDirection || shiftMovementDirection === "x";
                var setValue = !shiftMovementDirection || shiftMovementDirection === "y";

                if (setSaturation) {
                    currentSaturation = parseFloat(dragX / dragWidth);
                }
                if (setValue) {
                    currentValue = parseFloat((dragHeight - dragY) / dragHeight);
                }

                move();

            }, dragStart, dragStop);

            if (!!initialColor) {
                set(initialColor);

                // In case color was black - update the preview UI and set the format
                // since the set function will not run (default color is black).
                updateUI();
                currentPreferredFormat = preferredFormat || tinycolor(initialColor).format;

                addColorToSelectionPalette(initialColor);
            }
            else {
                updateUI();
            }

            if (flat) {
                show();
            }

            function palletElementClick(e) {
                if (e.data && e.data.ignore) {
                    set($(this).data("color"));
                    move();
                }
                else {
                    set($(this).data("color"));
                    updateOriginalInput(true);
                    move();
                    hide();
                }

                return false;
            }

            var paletteEvent = IE ? "mousedown.spectrum" : "click.spectrum touchstart.spectrum";
            paletteContainer.delegate(".sp-thumb-el", paletteEvent, palletElementClick);
            initialColorContainer.delegate(".sp-thumb-el:nth-child(1)", paletteEvent, { ignore: true }, palletElementClick);
        }

        function addColorToSelectionPalette(color) {
            if (showSelectionPalette) {
                var colorRgb = tinycolor(color).toRgbString();
                if ($.inArray(colorRgb, selectionPalette) === -1) {
                    selectionPalette.push(colorRgb);
                    while(selectionPalette.length > maxSelectionSize) {
                        selectionPalette.shift();
                    }
                }

                if (localStorageKey && window.localStorage) {
                    try {
                        window.localStorage[localStorageKey] = selectionPalette.join(";");
                    }
                    catch(e) { }
                }
            }
        }

        function getUniqueSelectionPalette() {
            var unique = [];
            var p = selectionPalette;
            var paletteLookup = {};
            var rgb;

            if (opts.showPalette) {

                for (var i = 0; i < paletteArray.length; i++) {
                    for (var j = 0; j < paletteArray[i].length; j++) {
                        rgb = tinycolor(paletteArray[i][j]).toRgbString();
                        paletteLookup[rgb] = true;
                    }
                }

                for (i = 0; i < p.length; i++) {
                    rgb = tinycolor(p[i]).toRgbString();

                    if (!paletteLookup.hasOwnProperty(rgb)) {
                        unique.push(p[i]);
                        paletteLookup[rgb] = true;
                    }
                }
            }

            return unique.reverse().slice(0, opts.maxSelectionSize);
        }

        function drawPalette() {

            var currentColor = get();

            var html = $.map(paletteArray, function (palette, i) {
                return paletteTemplate(palette, currentColor, "sp-palette-row sp-palette-row-" + i);
            });

            if (selectionPalette) {
                html.push(paletteTemplate(getUniqueSelectionPalette(), currentColor, "sp-palette-row sp-palette-row-selection"));
            }

            paletteContainer.html(html.join(""));
        }

        function drawInitial() {
            if (opts.showInitial) {
                var initial = colorOnShow;
                var current = get();
                initialColorContainer.html(paletteTemplate([initial, current], current, "sp-palette-row-initial"));
            }
        }

        function dragStart() {
            if (dragHeight <= 0 || dragWidth <= 0 || slideHeight <= 0) {
                reflow();
            }
            container.addClass(draggingClass);
            shiftMovementDirection = null;
        }

        function dragStop() {
            container.removeClass(draggingClass);
        }

        function setFromTextInput() {
            var tiny = tinycolor(textInput.val());
            if (tiny.ok) {
                set(tiny);
            }
            else {
                textInput.addClass("sp-validation-error");
            }
        }

        function toggle() {
            if (visible) {
                hide();
            }
            else {
                show();
            }
        }

        function show() {
            var event = $.Event('beforeShow.spectrum');

            if (visible) {
                reflow();
                return;
            }

            colorOnShow = get();
            boundElement.trigger(event, [ colorOnShow ]);

            if (callbacks.beforeShow(colorOnShow) === false || event.isDefaultPrevented()) {
                return;
            }

            // if color has changed
            set(colorOnShow);

            hideAll();
            visible = true;

            $(doc).bind("mousedown.spectrum", onMousedown);

            if (!flat) {
                 // Piskel-specific : change the color as soon as the user does a mouseup
                $(doc).bind("mouseup.spectrum", updateColor);
            }

            $(window).bind("resize.spectrum", resize);
            replacer.addClass("sp-active");
            container.removeClass("sp-hidden");

            if (opts.showPalette) {
                drawPalette();
            }
            reflow();
            updateUI();

            drawInitial();
            callbacks.show(colorOnShow);
            boundElement.trigger('show.spectrum', [ colorOnShow ]);
        }

        function onMousedown (e) {
            var target = $(e.target);
            var parents = target.parents();
            var isClickOutsideWidget = !parents.is(container) && !target.is(container);

            if (isClickOutsideWidget) {
                hide(e);
            }
        }

        // Piskel-specific (code extracted to method)
        function updateColor(e) {
            var colorHasChanged = !tinycolor.equals(get(), colorOnShow);

            if (colorHasChanged) {
                if (clickoutFiresChange && e !== "cancel") {
                    updateOriginalInput(true);
                }
                else {
                    revert();
                }
            }
        }

        function hide(e) {

            // Return on right click
            if (e && e.type == "click" && e.button == 2) { return; }

            // Return if hiding is unnecessary
            if (!visible || flat) { return; }
            visible = false;

            $(doc).unbind("mousedown.spectrum", onMousedown);

            // Piskel-specific
            $(doc).unbind("mouseup.spectrum", updateColor);

            $(window).unbind("resize.spectrum", resize);

            replacer.removeClass("sp-active");
            container.addClass("sp-hidden");

            updateColor(e);

            // Piskel-specific
            addColorToSelectionPalette(get());

            callbacks.hide(get());
            boundElement.trigger('hide.spectrum', [ get() ]);
        }

        function revert() {
            set(colorOnShow, true);
        }

        function set(color, ignoreFormatChange) {
            if (tinycolor.equals(color, get())) {
                return;
            }

            var newColor = tinycolor(color);
            var newHsv = newColor.toHsv();

            currentHue = (newHsv.h % 360) / 360;
            currentSaturation = newHsv.s;
            currentValue = newHsv.v;
            currentAlpha = newHsv.a;

            updateUI();

            if (newColor.ok && !ignoreFormatChange) {
                currentPreferredFormat = preferredFormat || newColor.format;
            }
        }

        function get(opts) {
            opts = opts || { };
            return tinycolor.fromRatio({
                h: currentHue,
                s: currentSaturation,
                v: currentValue,
                a: Math.round(currentAlpha * 100) / 100
            }, { format: opts.format || currentPreferredFormat });
        }

        function isValid() {
            return !textInput.hasClass("sp-validation-error");
        }

        function move() {
            updateUI();

            callbacks.move(get());
            boundElement.trigger('move.spectrum', [ get() ]);
        }

        function updateUI() {

            textInput.removeClass("sp-validation-error");

            updateHelperLocations();

            // Update dragger background color (gradients take care of saturation and value).
            var flatColor = tinycolor.fromRatio({ h: currentHue, s: 1, v: 1 });
            dragger.css("background-color", flatColor.toHexString());

            // Get a format that alpha will be included in (hex and names ignore alpha)
            var format = currentPreferredFormat;
            if (currentAlpha < 1) {
                if (format === "hex" || format === "hex3" || format === "hex6" || format === "name") {
                    format = "rgb";
                }
            }

            var realColor = get({ format: format }),
                realHex = realColor.toHexString(),
                realRgb = realColor.toRgbString();

            // Update the replaced elements background color (with actual selected color)
            if (rgbaSupport || realColor.alpha === 1) {
                previewElement.css("background-color", realRgb);
            }
            else {
                previewElement.css("background-color", "transparent");
                previewElement.css("filter", realColor.toFilter());
            }

            if (opts.showAlpha) {
                var rgb = realColor.toRgb();
                rgb.a = 0;
                var realAlpha = tinycolor(rgb).toRgbString();
                var gradient = "linear-gradient(left, " + realAlpha + ", " + realHex + ")";

                if (IE) {
                    alphaSliderInner.css("filter", tinycolor(realAlpha).toFilter({ gradientType: 1 }, realHex));
                }
                else {
                    alphaSliderInner.css("background", "-webkit-" + gradient);
                    alphaSliderInner.css("background", "-moz-" + gradient);
                    alphaSliderInner.css("background", "-ms-" + gradient);
                    alphaSliderInner.css("background", gradient);
                }
            }

            // Update the text entry input as it changes happen
            if (opts.showInput) {
                var displayFormat = opts.getDisplayFormat();
                textInput.val(realColor.toString(displayFormat));
            }

            if (opts.showPalette) {
                drawPalette();
            }

            drawInitial();
        }

        function updateHelperLocations() {
            var s = currentSaturation;
            var v = currentValue;

            // Where to show the little circle in that displays your current selected color
            var dragX = s * dragWidth;
            var dragY = (dragHeight) - (v * dragHeight);
            dragX = Math.max(
                -dragHelperHeight/2,
                Math.min(dragWidth - dragHelperHeight/2, dragX - dragHelperHeight/2)
            );
            dragY = Math.max(
                -dragHelperHeight/2,
                Math.min(dragHeight - dragHelperHeight/2, dragY - dragHelperHeight/2)
            );
            dragHelper.css({
                "top": dragY,
                "left": dragX
            });

            var alphaX = currentAlpha * alphaWidth;
            alphaSlideHelper.css({
                "left": alphaX - (alphaSlideHelperWidth / 2)
            });

            // Where to show the bar that displays your current selected hue
            var slideY = (currentHue) * slideHeight;
            slideHelper.css({
                "top": slideY - (slideHelperHeight/2)
            });
        }

        function updateOriginalInput(fireCallback) {
            var color = get();

            if (isInput) {
                boundElement.val(color.toString(currentPreferredFormat));
            }

            var hasChanged = !tinycolor.equals(color, colorOnShow);
            colorOnShow = color;

            // Update the selection palette with the current color

            // Piskel-specific : commented-out, palette update is done on hide
            // addColorToSelectionPalette(color);

            if (fireCallback && hasChanged) {
                callbacks.change(color);
                boundElement.trigger('change', [ color ]);
            }
        }

        function reflow() {
            dragWidth = dragger.width();
            dragHeight = dragger.height();
            dragHelperHeight = dragHelper.height() + 4;
            slideWidth = slider.width();
            slideHeight = slider.height();
            slideHelperHeight = slideHelper.height() + 4;
            alphaWidth = alphaSlider.width();
            alphaSlideHelperWidth = alphaSlideHelper.width();

            if (!flat) {
                container.css("position", "absolute");
                container.offset(getOffset(container, offsetElement));
            }

            updateHelperLocations();
        }

        function destroy() {
            boundElement.show();
            offsetElement.unbind("click.spectrum touchstart.spectrum");
            container.remove();
            replacer.remove();
            spectrums[spect.id] = null;
        }

        function option(optionName, optionValue) {
            if (optionName === undefined) {
                return $.extend({}, opts);
            }
            if (optionValue === undefined) {
                return opts[optionName];
            }

            opts[optionName] = optionValue;
            applyOptions();
        }

        function enable() {
            disabled = false;
            boundElement.attr("disabled", false);
            offsetElement.removeClass("sp-disabled");
        }

        function disable() {
            hide();
            disabled = true;
            boundElement.attr("disabled", true);
            offsetElement.addClass("sp-disabled");
        }

        initialize();

        var spect = {
            show: show,
            hide: hide,
            toggle: toggle,
            reflow: reflow,
            option: option,
            enable: enable,
            disable: disable,
            set: function (c) {
                set(c);
                updateOriginalInput();
            },
            get: get,
            destroy: destroy,
            container: container
        };

        spect.id = spectrums.push(spect) - 1;

        return spect;
    }

    /**
    * checkOffset - get the offset below/above and left/right element depending on screen position
    * Thanks https://github.com/jquery/jquery-ui/blob/master/ui/jquery.ui.datepicker.js
    */
    function getOffset(picker, input) {
        var extraY = 0;
        var dpWidth = picker.outerWidth();
        var dpHeight = picker.outerHeight();
        var inputHeight = input.outerHeight();
        var doc = picker[0].ownerDocument;
        var docElem = doc.documentElement;
        var viewWidth = docElem.clientWidth + $(doc).scrollLeft();
        var viewHeight = docElem.clientHeight + $(doc).scrollTop();
        var offset = input.offset();
        offset.top += inputHeight;

        if (Math.min(offset.left, (offset.left + dpWidth > viewWidth && viewWidth > dpWidth))) {
            offset.left -= Math.abs(offset.left + dpWidth - viewWidth);
            picker.attr('data-x-position','right');
        } else {
            offset.left -= 0;
            picker.attr('data-x-position','left');
        }

        if (Math.min(offset.top, (offset.top + dpHeight > viewHeight && viewHeight > dpHeight))) {
            offset.top -= Math.abs(dpHeight + inputHeight - extraY);
            picker.attr('data-y-position','top');
        } else {
            offset.top -= extraY;
            picker.attr('data-y-position','bottom');
        }

        return offset;
    }

    /**
    * noop - do nothing
    */
    function noop() {

    }

    /**
    * stopPropagation - makes the code only doing this a little easier to read in line
    */
    function stopPropagation(e) {
        e.stopPropagation();
    }

    /**
    * Create a function bound to a given object
    * Thanks to underscore.js
    */
    function bind(func, obj) {
        var slice = Array.prototype.slice;
        var args = slice.call(arguments, 2);
        return function () {
            return func.apply(obj, args.concat(slice.call(arguments)));
        };
    }

    /**
    * Lightweight drag helper.  Handles containment within the element, so that
    * when dragging, the x is within [0,element.width] and y is within [0,element.height]
    */
    function draggable(element, onmove, onstart, onstop) {
        onmove = onmove || function () { };
        onstart = onstart || function () { };
        onstop = onstop || function () { };
        var doc = element.ownerDocument || document;
        var dragging = false;
        var offset = {};
        var maxHeight = 0;
        var maxWidth = 0;
        var hasTouch = ('ontouchstart' in window);

        var duringDragEvents = {};
        duringDragEvents["selectstart"] = prevent;
        duringDragEvents["dragstart"] = prevent;
        duringDragEvents["touchmove mousemove"] = move;
        duringDragEvents["touchend mouseup"] = stop;

        function prevent(e) {
            if (e.stopPropagation) {
                e.stopPropagation();
            }
            if (e.preventDefault) {
                e.preventDefault();
            }
            e.returnValue = false;
        }

        function move(e) {
            if (dragging) {
                // Mouseup happened outside of window
                if (IE && document.documentMode < 9 && !e.button) {
                    return stop();
                }

                var touches = e.originalEvent.touches;
                var pageX = touches ? touches[0].pageX : e.pageX;
                var pageY = touches ? touches[0].pageY : e.pageY;

                var dragX = Math.max(0, Math.min(pageX - offset.left, maxWidth));
                var dragY = Math.max(0, Math.min(pageY - offset.top, maxHeight));

                if (hasTouch) {
                    // Stop scrolling in iOS
                    prevent(e);
                }

                onmove.apply(element, [dragX, dragY, e]);
            }
        }
        function start(e) {
            var rightclick = (e.which) ? (e.which == 3) : (e.button == 2);
            var touches = e.originalEvent.touches;

            if (!rightclick && !dragging) {
                if (onstart.apply(element, arguments) !== false) {
                    dragging = true;
                    maxHeight = $(element).height();
                    maxWidth = $(element).width();
                    offset = $(element).offset();

                    $(doc).bind(duringDragEvents);
                    $(doc.body).addClass("sp-dragging");

                    if (!hasTouch) {
                        move(e);
                    }

                    prevent(e);
                }
            }
        }
        function stop() {
            if (dragging) {
                $(doc).unbind(duringDragEvents);
                $(doc.body).removeClass("sp-dragging");
                onstop.apply(element, arguments);
            }
            dragging = false;
        }

        $(element).bind("touchstart mousedown", start);
    }

    function throttle(func, wait, debounce) {
        var timeout;
        return function () {
            var context = this, args = arguments;
            var throttler = function () {
                timeout = null;
                func.apply(context, args);
            };
            if (debounce) clearTimeout(timeout);
            if (debounce || !timeout) timeout = setTimeout(throttler, wait);
        };
    }


    function log(){/* jshint -W021 */if(window.console){if(Function.prototype.bind)log=Function.prototype.bind.call(console.log,console);else log=function(){Function.prototype.apply.call(console.log,console,arguments);};log.apply(this,arguments);}}

    /**
    * Define a jQuery plugin
    */
    var dataID = "spectrum.id";
    $.fn.spectrum = function (opts, extra) {

        if (typeof opts == "string") {

            var returnValue = this;
            var args = Array.prototype.slice.call( arguments, 1 );

            this.each(function () {
                var spect = spectrums[$(this).data(dataID)];
                if (spect) {

                    var method = spect[opts];
                    if (!method) {
                        throw new Error( "Spectrum: no such method: '" + opts + "'" );
                    }

                    if (opts == "get") {
                        returnValue = spect.get();
                    }
                    else if (opts == "container") {
                        returnValue = spect.container;
                    }
                    else if (opts == "option") {
                        returnValue = spect.option.apply(spect, args);
                    }
                    else if (opts == "destroy") {
                        spect.destroy();
                        $(this).removeData(dataID);
                    }
                    else {
                        method.apply(spect, args);
                    }
                }
            });

            return returnValue;
        }

        // Initializing a new instance of spectrum
        return this.spectrum("destroy").each(function () {
            var spect = spectrum(this, opts);
            $(this).data(dataID, spect.id);
        });
    };

    $.fn.spectrum.load = true;
    $.fn.spectrum.loadOpts = {};
    $.fn.spectrum.draggable = draggable;
    $.fn.spectrum.defaults = defaultOpts;

    $.spectrum = { };
    $.spectrum.localization = { };
    $.spectrum.palettes = { };

    $.fn.spectrum.processNativeColorInputs = function () {
        var colorInput = $("<input type='color' value='!' />")[0];
        var supportsColor = colorInput.type === "color" && colorInput.value != "!";

        if (!supportsColor) {
            $("input[type=color]").spectrum({
                preferredFormat: "hex6"
            });
        }
    };

    // TinyColor v0.9.16
    // https://github.com/bgrins/TinyColor
    // 2013-08-10, Brian Grinstead, MIT License

    (function() {

    var trimLeft = /^[\s,#]+/,
        trimRight = /\s+$/,
        tinyCounter = 0,
        math = Math,
        mathRound = math.round,
        mathMin = math.min,
        mathMax = math.max,
        mathRandom = math.random;

    function tinycolor (color, opts) {

        color = (color) ? color : '';
        opts = opts || { };

        // If input is already a tinycolor, return itself
        if (typeof color == "object" && color.hasOwnProperty("_tc_id")) {
           return color;
        }

        var rgb = inputToRGB(color);
        var r = rgb.r,
            g = rgb.g,
            b = rgb.b,
            a = rgb.a,
            roundA = mathRound(100*a) / 100,
            format = opts.format || rgb.format;

        // Don't let the range of [0,255] come back in [0,1].
        // Potentially lose a little bit of precision here, but will fix issues where
        // .5 gets interpreted as half of the total, instead of half of 1
        // If it was supposed to be 128, this was already taken care of by `inputToRgb`
        if (r < 1) { r = mathRound(r); }
        if (g < 1) { g = mathRound(g); }
        if (b < 1) { b = mathRound(b); }

        return {
            ok: rgb.ok,
            format: format,
            _tc_id: tinyCounter++,
            alpha: a,
            getAlpha: function() {
                return a;
            },
            setAlpha: function(value) {
                a = boundAlpha(value);
                roundA = mathRound(100*a) / 100;
            },
            toHsv: function() {
                var hsv = rgbToHsv(r, g, b);
                return { h: hsv.h * 360, s: hsv.s, v: hsv.v, a: a };
            },
            toHsvString: function() {
                var hsv = rgbToHsv(r, g, b);
                var h = mathRound(hsv.h * 360), s = mathRound(hsv.s * 100), v = mathRound(hsv.v * 100);
                return (a == 1) ?
                  "hsv("  + h + ", " + s + "%, " + v + "%)" :
                  "hsva(" + h + ", " + s + "%, " + v + "%, "+ roundA + ")";
            },
            toHsl: function() {
                var hsl = rgbToHsl(r, g, b);
                return { h: hsl.h * 360, s: hsl.s, l: hsl.l, a: a };
            },
            toHslString: function() {
                var hsl = rgbToHsl(r, g, b);
                var h = mathRound(hsl.h * 360), s = mathRound(hsl.s * 100), l = mathRound(hsl.l * 100);
                return (a == 1) ?
                  "hsl("  + h + ", " + s + "%, " + l + "%)" :
                  "hsla(" + h + ", " + s + "%, " + l + "%, "+ roundA + ")";
            },
            toHex: function(allow3Char) {
                return rgbToHex(r, g, b, allow3Char);
            },
            toHexString: function(allow3Char) {
                return '#' + rgbToHex(r, g, b, allow3Char);
            },
            toRgb: function() {
                return { r: mathRound(r), g: mathRound(g), b: mathRound(b), a: a };
            },
            toRgbString: function() {
                return (a == 1) ?
                  "rgb("  + mathRound(r) + ", " + mathRound(g) + ", " + mathRound(b) + ")" :
                  "rgba(" + mathRound(r) + ", " + mathRound(g) + ", " + mathRound(b) + ", " + roundA + ")";
            },
            toPercentageRgb: function() {
                return { r: mathRound(bound01(r, 255) * 100) + "%", g: mathRound(bound01(g, 255) * 100) + "%", b: mathRound(bound01(b, 255) * 100) + "%", a: a };
            },
            toPercentageRgbString: function() {
                return (a == 1) ?
                  "rgb("  + mathRound(bound01(r, 255) * 100) + "%, " + mathRound(bound01(g, 255) * 100) + "%, " + mathRound(bound01(b, 255) * 100) + "%)" :
                  "rgba(" + mathRound(bound01(r, 255) * 100) + "%, " + mathRound(bound01(g, 255) * 100) + "%, " + mathRound(bound01(b, 255) * 100) + "%, " + roundA + ")";
            },
            toName: function() {
                if (a === 0) {
                    return "transparent";
                }

                return hexNames[rgbToHex(r, g, b, true)] || false;
            },
            toFilter: function(secondColor) {
                var hex = rgbToHex(r, g, b);
                var secondHex = hex;
                var alphaHex = Math.round(parseFloat(a) * 255).toString(16);
                var secondAlphaHex = alphaHex;
                var gradientType = opts && opts.gradientType ? "GradientType = 1, " : "";

                if (secondColor) {
                    var s = tinycolor(secondColor);
                    secondHex = s.toHex();
                    secondAlphaHex = Math.round(parseFloat(s.alpha) * 255).toString(16);
                }

                return "progid:DXImageTransform.Microsoft.gradient("+gradientType+"startColorstr=#" + pad2(alphaHex) + hex + ",endColorstr=#" + pad2(secondAlphaHex) + secondHex + ")";
            },
            toString: function(format) {
                var formatSet = !!format;
                format = format || this.format;

                var formattedString = false;
                var hasAlphaAndFormatNotSet = !formatSet && a < 1 && a > 0;
                var formatWithAlpha = hasAlphaAndFormatNotSet && (format === "hex" || format === "hex6" || format === "hex3" || format === "name");

                if (format === "rgb") {
                    formattedString = this.toRgbString();
                }
                if (format === "prgb") {
                    formattedString = this.toPercentageRgbString();
                }
                if (format === "hex" || format === "hex6") {
                    formattedString = this.toHexString();
                }
                if (format === "hex3") {
                    formattedString = this.toHexString(true);
                }
                if (format === "name") {
                    formattedString = this.toName();
                }
                if (format === "hsl") {
                    formattedString = this.toHslString();
                }
                if (format === "hsv") {
                    formattedString = this.toHsvString();
                }

                if (formatWithAlpha) {
                    return this.toRgbString();
                }

                return formattedString || this.toHexString();
            }
        };
    }

    // If input is an object, force 1 into "1.0" to handle ratios properly
    // String input requires "1.0" as input, so 1 will be treated as 1
    tinycolor.fromRatio = function(color, opts) {
        if (typeof color == "object") {
            var newColor = {};
            for (var i in color) {
                if (color.hasOwnProperty(i)) {
                    if (i === "a") {
                        newColor[i] = color[i];
                    }
                    else {
                        newColor[i] = convertToPercentage(color[i]);
                    }
                }
            }
            color = newColor;
        }

        return tinycolor(color, opts);
    };

    // Given a string or object, convert that input to RGB
    // Possible string inputs:
    //
    //     "red"
    //     "#f00" or "f00"
    //     "#ff0000" or "ff0000"
    //     "rgb 255 0 0" or "rgb (255, 0, 0)"
    //     "rgb 1.0 0 0" or "rgb (1, 0, 0)"
    //     "rgba (255, 0, 0, 1)" or "rgba 255, 0, 0, 1"
    //     "rgba (1.0, 0, 0, 1)" or "rgba 1.0, 0, 0, 1"
    //     "hsl(0, 100%, 50%)" or "hsl 0 100% 50%"
    //     "hsla(0, 100%, 50%, 1)" or "hsla 0 100% 50%, 1"
    //     "hsv(0, 100%, 100%)" or "hsv 0 100% 100%"
    //
    function inputToRGB(color) {

        var rgb = { r: 0, g: 0, b: 0 };
        var a = 1;
        var ok = false;
        var format = false;

        if (typeof color == "string") {
            color = stringInputToObject(color);
        }

        if (typeof color == "object") {
            if (color.hasOwnProperty("r") && color.hasOwnProperty("g") && color.hasOwnProperty("b")) {
                rgb = rgbToRgb(color.r, color.g, color.b);
                ok = true;
                format = String(color.r).substr(-1) === "%" ? "prgb" : "rgb";
            }
            else if (color.hasOwnProperty("h") && color.hasOwnProperty("s") && color.hasOwnProperty("v")) {
                color.s = convertToPercentage(color.s);
                color.v = convertToPercentage(color.v);
                rgb = hsvToRgb(color.h, color.s, color.v);
                ok = true;
                format = "hsv";
            }
            else if (color.hasOwnProperty("h") && color.hasOwnProperty("s") && color.hasOwnProperty("l")) {
                color.s = convertToPercentage(color.s);
                color.l = convertToPercentage(color.l);
                rgb = hslToRgb(color.h, color.s, color.l);
                ok = true;
                format = "hsl";
            }

            if (color.hasOwnProperty("a")) {
                a = color.a;
            }
        }

        a = boundAlpha(a);

        return {
            ok: ok,
            format: color.format || format,
            r: mathMin(255, mathMax(rgb.r, 0)),
            g: mathMin(255, mathMax(rgb.g, 0)),
            b: mathMin(255, mathMax(rgb.b, 0)),
            a: a
        };
    }


    // Conversion Functions
    // --------------------

    // `rgbToHsl`, `rgbToHsv`, `hslToRgb`, `hsvToRgb` modified from:
    // <http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript>

    // `rgbToRgb`
    // Handle bounds / percentage checking to conform to CSS color spec
    // <http://www.w3.org/TR/css3-color/>
    // *Assumes:* r, g, b in [0, 255] or [0, 1]
    // *Returns:* { r, g, b } in [0, 255]
    function rgbToRgb(r, g, b){
        return {
            r: bound01(r, 255) * 255,
            g: bound01(g, 255) * 255,
            b: bound01(b, 255) * 255
        };
    }

    // `rgbToHsl`
    // Converts an RGB color value to HSL.
    // *Assumes:* r, g, and b are contained in [0, 255] or [0, 1]
    // *Returns:* { h, s, l } in [0,1]
    function rgbToHsl(r, g, b) {

        r = bound01(r, 255);
        g = bound01(g, 255);
        b = bound01(b, 255);

        var max = mathMax(r, g, b), min = mathMin(r, g, b);
        var h, s, l = (max + min) / 2;

        if(max == min) {
            h = s = 0; // achromatic
        }
        else {
            var d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch(max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }

            h /= 6;
        }

        return { h: h, s: s, l: l };
    }

    // `hslToRgb`
    // Converts an HSL color value to RGB.
    // *Assumes:* h is contained in [0, 1] or [0, 360] and s and l are contained [0, 1] or [0, 100]
    // *Returns:* { r, g, b } in the set [0, 255]
    function hslToRgb(h, s, l) {
        var r, g, b;

        h = bound01(h, 360);
        s = bound01(s, 100);
        l = bound01(l, 100);

        function hue2rgb(p, q, t) {
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        if(s === 0) {
            r = g = b = l; // achromatic
        }
        else {
            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }

        return { r: r * 255, g: g * 255, b: b * 255 };
    }

    // `rgbToHsv`
    // Converts an RGB color value to HSV
    // *Assumes:* r, g, and b are contained in the set [0, 255] or [0, 1]
    // *Returns:* { h, s, v } in [0,1]
    function rgbToHsv(r, g, b) {

        r = bound01(r, 255);
        g = bound01(g, 255);
        b = bound01(b, 255);

        var max = mathMax(r, g, b), min = mathMin(r, g, b);
        var h, s, v = max;

        var d = max - min;
        s = max === 0 ? 0 : d / max;

        if(max == min) {
            h = 0; // achromatic
        }
        else {
            switch(max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        return { h: h, s: s, v: v };
    }

    // `hsvToRgb`
    // Converts an HSV color value to RGB.
    // *Assumes:* h is contained in [0, 1] or [0, 360] and s and v are contained in [0, 1] or [0, 100]
    // *Returns:* { r, g, b } in the set [0, 255]
     function hsvToRgb(h, s, v) {

        h = bound01(h, 360) * 6;
        s = bound01(s, 100);
        v = bound01(v, 100);

        var i = math.floor(h),
            f = h - i,
            p = v * (1 - s),
            q = v * (1 - f * s),
            t = v * (1 - (1 - f) * s),
            mod = i % 6,
            r = [v, q, p, p, t, v][mod],
            g = [t, v, v, q, p, p][mod],
            b = [p, p, t, v, v, q][mod];

        return { r: r * 255, g: g * 255, b: b * 255 };
    }

    // `rgbToHex`
    // Converts an RGB color to hex
    // Assumes r, g, and b are contained in the set [0, 255]
    // Returns a 3 or 6 character hex
    function rgbToHex(r, g, b, allow3Char) {

        var hex = [
            pad2(mathRound(r).toString(16)),
            pad2(mathRound(g).toString(16)),
            pad2(mathRound(b).toString(16))
        ];

        // Return a 3 character hex if possible
        if (allow3Char && hex[0].charAt(0) == hex[0].charAt(1) && hex[1].charAt(0) == hex[1].charAt(1) && hex[2].charAt(0) == hex[2].charAt(1)) {
            return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0);
        }

        return hex.join("");
    }

    // `equals`
    // Can be called with any tinycolor input
    tinycolor.equals = function (color1, color2) {
        if (!color1 || !color2) { return false; }
        return tinycolor(color1).toRgbString() == tinycolor(color2).toRgbString();
    };
    tinycolor.random = function() {
        return tinycolor.fromRatio({
            r: mathRandom(),
            g: mathRandom(),
            b: mathRandom()
        });
    };


    // Modification Functions
    // ----------------------
    // Thanks to less.js for some of the basics here
    // <https://github.com/cloudhead/less.js/blob/master/lib/less/functions.js>

    tinycolor.desaturate = function (color, amount) {
        amount = (amount === 0) ? 0 : (amount || 10);
        var hsl = tinycolor(color).toHsl();
        hsl.s -= amount / 100;
        hsl.s = clamp01(hsl.s);
        return tinycolor(hsl);
    };
    tinycolor.saturate = function (color, amount) {
        amount = (amount === 0) ? 0 : (amount || 10);
        var hsl = tinycolor(color).toHsl();
        hsl.s += amount / 100;
        hsl.s = clamp01(hsl.s);
        return tinycolor(hsl);
    };
    tinycolor.greyscale = function(color) {
        return tinycolor.desaturate(color, 100);
    };
    tinycolor.lighten = function(color, amount) {
        amount = (amount === 0) ? 0 : (amount || 10);
        var hsl = tinycolor(color).toHsl();
        hsl.l += amount / 100;
        hsl.l = clamp01(hsl.l);
        return tinycolor(hsl);
    };
    tinycolor.darken = function (color, amount) {
        amount = (amount === 0) ? 0 : (amount || 10);
        var hsl = tinycolor(color).toHsl();
        hsl.l -= amount / 100;
        hsl.l = clamp01(hsl.l);
        return tinycolor(hsl);
    };
    tinycolor.complement = function(color) {
        var hsl = tinycolor(color).toHsl();
        hsl.h = (hsl.h + 180) % 360;
        return tinycolor(hsl);
    };


    // Combination Functions
    // ---------------------
    // Thanks to jQuery xColor for some of the ideas behind these
    // <https://github.com/infusion/jQuery-xcolor/blob/master/jquery.xcolor.js>

    tinycolor.triad = function(color) {
        var hsl = tinycolor(color).toHsl();
        var h = hsl.h;
        return [
            tinycolor(color),
            tinycolor({ h: (h + 120) % 360, s: hsl.s, l: hsl.l }),
            tinycolor({ h: (h + 240) % 360, s: hsl.s, l: hsl.l })
        ];
    };
    tinycolor.tetrad = function(color) {
        var hsl = tinycolor(color).toHsl();
        var h = hsl.h;
        return [
            tinycolor(color),
            tinycolor({ h: (h + 90) % 360, s: hsl.s, l: hsl.l }),
            tinycolor({ h: (h + 180) % 360, s: hsl.s, l: hsl.l }),
            tinycolor({ h: (h + 270) % 360, s: hsl.s, l: hsl.l })
        ];
    };
    tinycolor.splitcomplement = function(color) {
        var hsl = tinycolor(color).toHsl();
        var h = hsl.h;
        return [
            tinycolor(color),
            tinycolor({ h: (h + 72) % 360, s: hsl.s, l: hsl.l}),
            tinycolor({ h: (h + 216) % 360, s: hsl.s, l: hsl.l})
        ];
    };
    tinycolor.analogous = function(color, results, slices) {
        results = results || 6;
        slices = slices || 30;

        var hsl = tinycolor(color).toHsl();
        var part = 360 / slices;
        var ret = [tinycolor(color)];

        for (hsl.h = ((hsl.h - (part * results >> 1)) + 720) % 360; --results; ) {
            hsl.h = (hsl.h + part) % 360;
            ret.push(tinycolor(hsl));
        }
        return ret;
    };
    tinycolor.monochromatic = function(color, results) {
        results = results || 6;
        var hsv = tinycolor(color).toHsv();
        var h = hsv.h, s = hsv.s, v = hsv.v;
        var ret = [];
        var modification = 1 / results;

        while (results--) {
            ret.push(tinycolor({ h: h, s: s, v: v}));
            v = (v + modification) % 1;
        }

        return ret;
    };


    // Readability Functions
    // ---------------------
    // <http://www.w3.org/TR/AERT#color-contrast>

    // `readability`
    // Analyze the 2 colors and returns an object with the following properties:
    //    `brightness`: difference in brightness between the two colors
    //    `color`: difference in color/hue between the two colors
    tinycolor.readability = function(color1, color2) {
        var a = tinycolor(color1).toRgb();
        var b = tinycolor(color2).toRgb();
        var brightnessA = (a.r * 299 + a.g * 587 + a.b * 114) / 1000;
        var brightnessB = (b.r * 299 + b.g * 587 + b.b * 114) / 1000;
        var colorDiff = (
            Math.max(a.r, b.r) - Math.min(a.r, b.r) +
            Math.max(a.g, b.g) - Math.min(a.g, b.g) +
            Math.max(a.b, b.b) - Math.min(a.b, b.b)
        );

        return {
            brightness: Math.abs(brightnessA - brightnessB),
            color: colorDiff
        };
    };

    // `readable`
    // http://www.w3.org/TR/AERT#color-contrast
    // Ensure that foreground and background color combinations provide sufficient contrast.
    // *Example*
    //    tinycolor.readable("#000", "#111") => false
    tinycolor.readable = function(color1, color2) {
        var readability = tinycolor.readability(color1, color2);
        return readability.brightness > 125 && readability.color > 500;
    };

    // `mostReadable`
    // Given a base color and a list of possible foreground or background
    // colors for that base, returns the most readable color.
    // *Example*
    //    tinycolor.mostReadable("#123", ["#fff", "#000"]) => "#000"
    tinycolor.mostReadable = function(baseColor, colorList) {
        var bestColor = null;
        var bestScore = 0;
        var bestIsReadable = false;
        for (var i=0; i < colorList.length; i++) {

            // We normalize both around the "acceptable" breaking point,
            // but rank brightness constrast higher than hue.

            var readability = tinycolor.readability(baseColor, colorList[i]);
            var readable = readability.brightness > 125 && readability.color > 500;
            var score = 3 * (readability.brightness / 125) + (readability.color / 500);

            if ((readable && ! bestIsReadable) ||
                (readable && bestIsReadable && score > bestScore) ||
                ((! readable) && (! bestIsReadable) && score > bestScore)) {
                bestIsReadable = readable;
                bestScore = score;
                bestColor = tinycolor(colorList[i]);
            }
        }
        return bestColor;
    };


    // Big List of Colors
    // ------------------
    // <http://www.w3.org/TR/css3-color/#svg-color>
    var names = tinycolor.names = {
        aliceblue: "f0f8ff",
        antiquewhite: "faebd7",
        aqua: "0ff",
        aquamarine: "7fffd4",
        azure: "f0ffff",
        beige: "f5f5dc",
        bisque: "ffe4c4",
        black: "000",
        blanchedalmond: "ffebcd",
        blue: "00f",
        blueviolet: "8a2be2",
        brown: "a52a2a",
        burlywood: "deb887",
        burntsienna: "ea7e5d",
        cadetblue: "5f9ea0",
        chartreuse: "7fff00",
        chocolate: "d2691e",
        coral: "ff7f50",
        cornflowerblue: "6495ed",
        cornsilk: "fff8dc",
        crimson: "dc143c",
        cyan: "0ff",
        darkblue: "00008b",
        darkcyan: "008b8b",
        darkgoldenrod: "b8860b",
        darkgray: "a9a9a9",
        darkgreen: "006400",
        darkgrey: "a9a9a9",
        darkkhaki: "bdb76b",
        darkmagenta: "8b008b",
        darkolivegreen: "556b2f",
        darkorange: "ff8c00",
        darkorchid: "9932cc",
        darkred: "8b0000",
        darksalmon: "e9967a",
        darkseagreen: "8fbc8f",
        darkslateblue: "483d8b",
        darkslategray: "2f4f4f",
        darkslategrey: "2f4f4f",
        darkturquoise: "00ced1",
        darkviolet: "9400d3",
        deeppink: "ff1493",
        deepskyblue: "00bfff",
        dimgray: "696969",
        dimgrey: "696969",
        dodgerblue: "1e90ff",
        firebrick: "b22222",
        floralwhite: "fffaf0",
        forestgreen: "228b22",
        fuchsia: "f0f",
        gainsboro: "dcdcdc",
        ghostwhite: "f8f8ff",
        gold: "ffd700",
        goldenrod: "daa520",
        gray: "808080",
        green: "008000",
        greenyellow: "adff2f",
        grey: "808080",
        honeydew: "f0fff0",
        hotpink: "ff69b4",
        indianred: "cd5c5c",
        indigo: "4b0082",
        ivory: "fffff0",
        khaki: "f0e68c",
        lavender: "e6e6fa",
        lavenderblush: "fff0f5",
        lawngreen: "7cfc00",
        lemonchiffon: "fffacd",
        lightblue: "add8e6",
        lightcoral: "f08080",
        lightcyan: "e0ffff",
        lightgoldenrodyellow: "fafad2",
        lightgray: "d3d3d3",
        lightgreen: "90ee90",
        lightgrey: "d3d3d3",
        lightpink: "ffb6c1",
        lightsalmon: "ffa07a",
        lightseagreen: "20b2aa",
        lightskyblue: "87cefa",
        lightslategray: "789",
        lightslategrey: "789",
        lightsteelblue: "b0c4de",
        lightyellow: "ffffe0",
        lime: "0f0",
        limegreen: "32cd32",
        linen: "faf0e6",
        magenta: "f0f",
        maroon: "800000",
        mediumaquamarine: "66cdaa",
        mediumblue: "0000cd",
        mediumorchid: "ba55d3",
        mediumpurple: "9370db",
        mediumseagreen: "3cb371",
        mediumslateblue: "7b68ee",
        mediumspringgreen: "00fa9a",
        mediumturquoise: "48d1cc",
        mediumvioletred: "c71585",
        midnightblue: "191970",
        mintcream: "f5fffa",
        mistyrose: "ffe4e1",
        moccasin: "ffe4b5",
        navajowhite: "ffdead",
        navy: "000080",
        oldlace: "fdf5e6",
        olive: "808000",
        olivedrab: "6b8e23",
        orange: "ffa500",
        orangered: "ff4500",
        orchid: "da70d6",
        palegoldenrod: "eee8aa",
        palegreen: "98fb98",
        paleturquoise: "afeeee",
        palevioletred: "db7093",
        papayawhip: "ffefd5",
        peachpuff: "ffdab9",
        peru: "cd853f",
        pink: "ffc0cb",
        plum: "dda0dd",
        powderblue: "b0e0e6",
        purple: "800080",
        red: "f00",
        rosybrown: "bc8f8f",
        royalblue: "4169e1",
        saddlebrown: "8b4513",
        salmon: "fa8072",
        sandybrown: "f4a460",
        seagreen: "2e8b57",
        seashell: "fff5ee",
        sienna: "a0522d",
        silver: "c0c0c0",
        skyblue: "87ceeb",
        slateblue: "6a5acd",
        slategray: "708090",
        slategrey: "708090",
        snow: "fffafa",
        springgreen: "00ff7f",
        steelblue: "4682b4",
        tan: "d2b48c",
        teal: "008080",
        thistle: "d8bfd8",
        tomato: "ff6347",
        turquoise: "40e0d0",
        violet: "ee82ee",
        wheat: "f5deb3",
        white: "fff",
        whitesmoke: "f5f5f5",
        yellow: "ff0",
        yellowgreen: "9acd32"
    };

    // Make it easy to access colors via `hexNames[hex]`
    var hexNames = tinycolor.hexNames = flip(names);


    // Utilities
    // ---------

    // `{ 'name1': 'val1' }` becomes `{ 'val1': 'name1' }`
    function flip(o) {
        var flipped = { };
        for (var i in o) {
            if (o.hasOwnProperty(i)) {
                flipped[o[i]] = i;
            }
        }
        return flipped;
    }

    // Return a valid alpha value [0,1] with all invalid values being set to 1
    function boundAlpha(a) {
        a = parseFloat(a);

        if (isNaN(a) || a < 0 || a > 1) {
            a = 1;
        }

        return a;
    }

    // Take input from [0, n] and return it as [0, 1]
    function bound01(n, max) {
        if (isOnePointZero(n)) { n = "100%"; }

        var processPercent = isPercentage(n);
        n = mathMin(max, mathMax(0, parseFloat(n)));

        // Automatically convert percentage into number
        if (processPercent) {
            n = parseInt(n * max, 10) / 100;
        }

        // Handle floating point rounding errors
        if ((math.abs(n - max) < 0.000001)) {
            return 1;
        }

        // Convert into [0, 1] range if it isn't already
        return (n % max) / parseFloat(max);
    }

    // Force a number between 0 and 1
    function clamp01(val) {
        return mathMin(1, mathMax(0, val));
    }

    // Parse an integer into hex
    function parseHex(val) {
        return parseInt(val, 16);
    }

    // Need to handle 1.0 as 100%, since once it is a number, there is no difference between it and 1
    // <http://stackoverflow.com/questions/7422072/javascript-how-to-detect-number-as-a-decimal-including-1-0>
    function isOnePointZero(n) {
        return typeof n == "string" && n.indexOf('.') != -1 && parseFloat(n) === 1;
    }

    // Check to see if string passed in is a percentage
    function isPercentage(n) {
        return typeof n === "string" && n.indexOf('%') != -1;
    }

    // Force a hex value to have 2 characters
    function pad2(c) {
        return c.length == 1 ? '0' + c : '' + c;
    }

    // Replace a decimal with it's percentage value
    function convertToPercentage(n) {
        if (n <= 1) {
            n = (n * 100) + "%";
        }

        return n;
    }

    var matchers = (function() {

        // <http://www.w3.org/TR/css3-values/#integers>
        var CSS_INTEGER = "[-\\+]?\\d+%?";

        // <http://www.w3.org/TR/css3-values/#number-value>
        var CSS_NUMBER = "[-\\+]?\\d*\\.\\d+%?";

        // Allow positive/negative integer/number.  Don't capture the either/or, just the entire outcome.
        var CSS_UNIT = "(?:" + CSS_NUMBER + ")|(?:" + CSS_INTEGER + ")";

        // Actual matching.
        // Parentheses and commas are optional, but not required.
        // Whitespace can take the place of commas or opening paren
        var PERMISSIVE_MATCH3 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?";
        var PERMISSIVE_MATCH4 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?";

        return {
            rgb: new RegExp("rgb" + PERMISSIVE_MATCH3),
            rgba: new RegExp("rgba" + PERMISSIVE_MATCH4),
            hsl: new RegExp("hsl" + PERMISSIVE_MATCH3),
            hsla: new RegExp("hsla" + PERMISSIVE_MATCH4),
            hsv: new RegExp("hsv" + PERMISSIVE_MATCH3),
            hex3: /^([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
            hex6: /^([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/
        };
    })();

    // `stringInputToObject`
    // Permissive string parsing.  Take in a number of formats, and output an object
    // based on detected format.  Returns `{ r, g, b }` or `{ h, s, l }` or `{ h, s, v}`
    function stringInputToObject(color) {

        color = color.replace(trimLeft,'').replace(trimRight, '').toLowerCase();
        var named = false;
        if (names[color]) {
            color = names[color];
            named = true;
        }
        else if (color == 'transparent') {
            return { r: 0, g: 0, b: 0, a: 0, format: "name" };
        }

        // Try to match string input using regular expressions.
        // Keep most of the number bounding out of this function - don't worry about [0,1] or [0,100] or [0,360]
        // Just return an object and let the conversion functions handle that.
        // This way the result will be the same whether the tinycolor is initialized with string or object.
        var match;
        if ((match = matchers.rgb.exec(color))) {
            return { r: match[1], g: match[2], b: match[3] };
        }
        if ((match = matchers.rgba.exec(color))) {
            return { r: match[1], g: match[2], b: match[3], a: match[4] };
        }
        if ((match = matchers.hsl.exec(color))) {
            return { h: match[1], s: match[2], l: match[3] };
        }
        if ((match = matchers.hsla.exec(color))) {
            return { h: match[1], s: match[2], l: match[3], a: match[4] };
        }
        if ((match = matchers.hsv.exec(color))) {
            return { h: match[1], s: match[2], v: match[3] };
        }
        if ((match = matchers.hex6.exec(color))) {
            return {
                r: parseHex(match[1]),
                g: parseHex(match[2]),
                b: parseHex(match[3]),
                format: named ? "name" : "hex"
            };
        }
        if ((match = matchers.hex3.exec(color))) {
            return {
                r: parseHex(match[1] + '' + match[1]),
                g: parseHex(match[2] + '' + match[2]),
                b: parseHex(match[3] + '' + match[3]),
                format: named ? "name" : "hex"
            };
        }

        return false;
    }

    // Expose tinycolor to window, does not need to run in non-browser context.
    window.tinycolor = tinycolor;

    })();
    var tinycolor = window.tinycolor;

    $(function () {
        if ($.fn.spectrum.load) {
            $.fn.spectrum.processNativeColorInputs();
        }
    });

})(window, jQuery);
;(function() {
	//#region src/js/app.ts
	/**
	* Holds the controllers and services of the application. It only declares them,
	* main.ts creates them during init, which keeps the modules free of import cycles.
	*/
	var app = {
		sessionId: void 0,
		shortcutService: void 0,
		corePiskelController: void 0,
		piskelController: void 0,
		paletteImportService: void 0,
		paletteService: void 0,
		selectedColorsService: void 0,
		mouseStateService: void 0,
		paletteController: void 0,
		currentColorsService: void 0,
		palettesListController: void 0,
		cursorCoordinatesController: void 0,
		drawingController: void 0,
		previewController: void 0,
		minimapController: void 0,
		framesListController: void 0,
		layersListController: void 0,
		settingsController: void 0,
		dialogsController: void 0,
		toolController: void 0,
		selectionManager: void 0,
		historyService: void 0,
		notificationController: void 0,
		transformationsController: void 0,
		progressBarController: void 0,
		canvasBackgroundController: void 0,
		indexedDbStorageService: void 0,
		localStorageService: void 0,
		fileDownloadStorageService: void 0,
		desktopStorageService: void 0,
		storageService: void 0,
		importService: void 0,
		savedStatusService: void 0,
		backupService: void 0,
		beforeUnloadService: void 0,
		headerController: void 0,
		penSizeService: void 0,
		penSizeController: void 0,
		fileDropperService: void 0,
		userWarningController: void 0,
		performanceReportService: void 0,
		clipboardService: void 0,
		drawingLoop: void 0,
		init: void 0,
		getFirstFrameAsPng: void 0,
		getFramesheetAsPng: void 0
	};
	//#endregion
	//#region src/js/Constants.ts
	var Constants = {
		DEFAULT: {
			HEIGHT: 32,
			WIDTH: 32,
			FPS: 12,
			LAYER_OPACITY: .2
		},
		MODEL_VERSION: 2,
		MAX_DEFAULT_HEIGHT: 4096,
		MAX_DEFAULT_WIDTH: 4096,
		MAX_PALETTE_COLORS: 256,
		MAX_WORKER_COLORS: 256,
		PREVIEW_FILM_SIZE: 96,
		ANIMATED_PREVIEW_WIDTH: 200,
		RIGHT_COLUMN_PADDING_LEFT: 10,
		DEFAULT_PEN_COLOR: "#000000",
		TRANSPARENT_COLOR: "rgba(0, 0, 0, 0)",
		SEAMLESS_MODE_OVERLAY_COLOR: "rgba(255, 255, 255, 0)",
		CURRENT_COLORS_PALETTE_ID: "__current-colors",
		SELECTION_TRANSPARENT_COLOR: "rgba(160, 215, 240, 0.6)",
		TOOL_HIGHLIGHT_COLOR_LIGHT: "rgba(255, 255, 255, 0.2)",
		TOOL_HIGHLIGHT_COLOR_DARK: "rgba(0, 0, 0, 0.2)",
		ZOOMED_OUT_BACKGROUND_COLOR: "#A0A0A0",
		LEFT_BUTTON: 0,
		MIDDLE_BUTTON: 1,
		RIGHT_BUTTON: 2,
		MOUSEMOVE_THROTTLING: 10,
		DRAWING_TEST_FOLDER: "drawing",
		CONFIRM_OVERWRITE: "This will replace your current animation, are you sure you want to continue?"
	};
	//#endregion
	//#region src/js/utils/core.ts
	/**
	* Convert a rgb(Number, Number, Number) color to hexadecimal representation
	* @param  {Number} r red value, between 0 and 255
	* @param  {Number} g green value, between 0 and 255
	* @param  {Number} b blue value, between 0 and 255
	* @return {String} hex representation of the color '#ABCDEF'
	*/
	function rgbToHex(r, g, b) {
		return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
	}
	/**
	* Convert a color component (as a Number between 0 and 255) to its string hexa representation
	* @param  {Number} c component value, between 0 and 255
	* @return {String} eg. '0A'
	*/
	function componentToHex(c) {
		const hex = c.toString(16);
		return hex.length == 1 ? "0" + hex : hex;
	}
	var intHexCache = {};
	function intToHex(int) {
		if (intHexCache[int]) return intHexCache[int];
		const hex = rgbToHex(int & 255, int >> 8 & 255, int >> 16 & 255);
		intHexCache[int] = hex;
		return hex;
	}
	function normalize(value, def) {
		if (typeof value === "undefined" || value === null) return def;
		else return value;
	}
	function copy(object) {
		return JSON.parse(JSON.stringify(object));
	}
	var entityMap = {
		"&": "&amp;",
		"<": "&lt;",
		">": "&gt;",
		"\"": "&quot;",
		"'": "&#39;",
		"/": "&#x2F;"
	};
	function escapeHtml(string) {
		return String(string).replace(/[&<>"'\/]/g, function(s) {
			return entityMap[s];
		});
	}
	var colorCache = {};
	var colorCacheReverse = {};
	function colorToInt(color) {
		if (typeof color === "number") return color;
		if (typeof colorCache[color] !== "undefined") return colorCache[color];
		const tc = window.tinycolor(color);
		if (tc && tc.ok) {
			const rgb = tc.toRgb();
			const a = Math.round(rgb.a * 255);
			let intValue = (a << 24 >>> 0) + (rgb.b << 16) + (rgb.g << 8) + rgb.r;
			if (a === 0) intValue = 0;
			colorCache[color] = intValue;
			colorCacheReverse[intValue] = color;
			return intValue;
		} else {
			const d = document.createElement("div");
			d.style.color = color;
			document.body.appendChild(d);
			color = window.getComputedStyle(d).color;
			document.body.removeChild(d);
			return colorToInt(color);
		}
	}
	function intToColor(input) {
		if (typeof input === "string") return input;
		const intValue = input === null ? 0 : input;
		if (typeof colorCacheReverse[intValue] !== "undefined") return colorCacheReverse[intValue];
		const r = intValue & 255;
		const g = intValue >> 8 & 255;
		const b = intValue >> 16 & 255;
		const a = (intValue >> 24 >>> 0 & 255) / 255;
		const color = "rgba(" + r + "," + g + "," + b + "," + a + ")";
		colorCache[color] = intValue;
		colorCacheReverse[intValue] = color;
		return color;
	}
	var reEntityMap = {};
	function unescapeHtml(string) {
		Object.keys(entityMap).forEach(function(key) {
			reEntityMap[key] = reEntityMap[key] || new RegExp(entityMap[key], "g");
			string = string.replace(reEntityMap[key], key);
		});
		return string;
	}
	/**
	* Returns a lazily initialized field, which must be set by the time it is
	* used. Throws an error naming it otherwise.
	*
	* Most Piskel classes set their fields in `init()` instead of the
	* constructor, because the constructor runs before the DOM and the other
	* services are ready. The `app` holder is filled the same way, in `main.ts`.
	* TypeScript types these fields `T | undefined` and can't tell that `init()`
	* ran, so every use has to handle `undefined`.
	*
	* Wrap a field in this function where it must be set, instead of using a
	* non-null assertion (`!`). The JavaScript code failed with a `TypeError` when
	* such a field was missing. This function still fails, with an error that
	* names the field.
	*/
	function assertInitialized(value, name) {
		if (value === null || value === void 0) throw new Error("Used before it was initialized: " + name);
		return value;
	}
	//#endregion
	//#region src/js/model/Frame.ts
	var __idCounter = 0;
	var _emptyPixelGridCache = {};
	/** True if the first item is a column of pixels, rather than a pixel. */
	var isPixelGrid = function(pixels) {
		const first = pixels[0];
		return typeof first !== "number" && Boolean(first.length);
	};
	var Frame = class Frame {
		constructor(width, height) {
			if (width && height) {
				this.width = width;
				this.height = height;
				this.id = __idCounter++;
				this.version = 0;
				this.pixels = Frame.createEmptyPixelGrid_(width, height);
				this.stateIndex = 0;
			} else throw "Bad arguments in pskl.model.Frame constructor : " + width + ", " + height;
		}
		static fromPixelGrid(pixels, width, height) {
			if (pixels.length) {
				let w;
				let h;
				let buffer;
				if (isPixelGrid(pixels)) {
					w = pixels.length;
					h = pixels[0].length;
					const grid = [];
					for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
						const pixel = pixels[x][y];
						if (typeof pixel == "string") grid[y * w + x] = colorToInt(pixel);
						else grid[y * w + x] = pixel;
					}
					buffer = grid;
				} else if (width && height) {
					w = width;
					h = height;
					buffer = pixels;
				} else throw "Bad arguments in pskl.model.frame.fromPixelGrid, missing width and height";
				const frame = new Frame(w, h);
				frame.setPixels(buffer);
				return frame;
			} else throw "Bad arguments in pskl.model.Frame.fromPixelGrid";
		}
		static createEmptyPixelGrid_(width, height) {
			let pixels;
			const key = width + "-" + height;
			if (_emptyPixelGridCache[key]) pixels = _emptyPixelGridCache[key];
			else {
				pixels = _emptyPixelGridCache[key] = new Uint32Array(width * height);
				const transparentColorInt = colorToInt(Constants.TRANSPARENT_COLOR);
				pixels.fill(transparentColorInt);
			}
			return new Uint32Array(pixels);
		}
		static createEmptyFromFrame(frame) {
			return new Frame(frame.getWidth(), frame.getHeight());
		}
		clone() {
			const clone = new Frame(this.width, this.height);
			clone.setPixels(this.pixels);
			return clone;
		}
		/**
		* Returns a copy of the pixels used by the frame
		*/
		getPixels() {
			return this.clonePixels_(this.pixels);
		}
		/**
		* Copies the passed pixels into the frame.
		*/
		setPixels(pixels) {
			this.pixels = this.clonePixels_(pixels);
			this.version++;
		}
		clear() {
			this.pixels = Frame.createEmptyPixelGrid_(this.getWidth(), this.getHeight());
			this.version++;
		}
		/**
		* Clone a set of pixels. Should be static utility method
		* @private
		*/
		clonePixels_(pixels) {
			return new Uint32Array(pixels);
		}
		getHash() {
			return [this.id, this.version].join("-");
		}
		setPixel(x, y, color) {
			if (this.containsPixel(x, y)) {
				const index = y * this.width + x;
				const p = this.pixels[index];
				color = colorToInt(color);
				if (p !== color) {
					this.pixels[index] = color || colorToInt(Constants.TRANSPARENT_COLOR);
					this.version++;
				}
			}
		}
		getPixel(x, y) {
			if (this.containsPixel(x, y)) return this.pixels[y * this.width + x];
			else return null;
		}
		forEachPixel(callback) {
			const width = this.getWidth();
			const length = width * this.getHeight();
			for (let i = 0; i < length; i++) callback(this.pixels[i], i % width, Math.floor(i / width), this);
		}
		getWidth() {
			return this.width;
		}
		getHeight() {
			return this.height;
		}
		containsPixel(col, row) {
			return col >= 0 && row >= 0 && col < this.width && row < this.height;
		}
		isSameSize(otherFrame) {
			return this.getHeight() == otherFrame.getHeight() && this.getWidth() == otherFrame.getWidth();
		}
	};
	//#endregion
	//#region src/js/model/Layer.ts
	var Layer = class Layer {
		constructor(name) {
			if (!name) throw "Invalid arguments in Layer constructor : 'name' is mandatory";
			else {
				this.name = name;
				this.frames = [];
				this.opacity = 1;
			}
		}
		/**
		* Create a Layer instance from an already existing set a Frames
		* @static
		* @param  {String} name layer's name
		* @param  {Array<pskl.model.Frame>} frames should all have the same dimensions
		* @return {pskl.model.Layer}
		*/
		static fromFrames(name, frames) {
			const layer = new Layer(name);
			frames.forEach(layer.addFrame.bind(layer));
			return layer;
		}
		getName() {
			return this.name;
		}
		setName(name) {
			this.name = name;
		}
		getOpacity() {
			return this.opacity;
		}
		setOpacity(input) {
			const opacity = typeof input == "string" ? parseFloat(input) : input;
			if (opacity === null || isNaN(opacity) || opacity < 0 || opacity > 1) return;
			this.opacity = +opacity.toFixed(3);
		}
		isTransparent() {
			return this.opacity < 1;
		}
		getFrames() {
			return this.frames;
		}
		getFrameAt(index) {
			return this.frames[index];
		}
		addFrame(frame) {
			this.frames.push(frame);
		}
		addFrameAt(frame, index) {
			this.frames.splice(index, 0, frame);
		}
		removeFrame(frame) {
			const index = this.frames.indexOf(frame);
			this.removeFrameAt(index);
		}
		removeFrameAt(index) {
			if (this.frames[index]) this.frames.splice(index, 1);
			else console.error("Invalid index in removeFrameAt : %s (size : %s)", index, this.size());
		}
		moveFrame(fromIndex, toIndex) {
			const frame = this.frames.splice(fromIndex, 1)[0];
			this.frames.splice(toIndex, 0, frame);
		}
		swapFramesAt(fromIndex, toIndex) {
			const fromFrame = this.frames[fromIndex];
			const toFrame = this.frames[toIndex];
			if (fromFrame && toFrame) {
				this.frames[toIndex] = fromFrame;
				this.frames[fromIndex] = toFrame;
			} else console.error("Frame not found in moveFrameAt (from %s, to %s)", fromIndex, toIndex);
		}
		duplicateFrame(frame) {
			const index = this.frames.indexOf(frame);
			this.duplicateFrameAt(index);
		}
		duplicateFrameAt(index) {
			const frame = this.frames[index];
			if (frame) {
				const clone = frame.clone();
				this.addFrameAt(clone, index);
			} else console.error("Frame not found in duplicateFrameAt (at %s)", index);
		}
		size() {
			return this.frames.length;
		}
		getHash() {
			return this.frames.map(function(frame) {
				return frame.getHash();
			}).join("-");
		}
	};
	//#endregion
	//#region src/js/Events.ts
	var Events = {
		TOOL_SELECTED: "TOOL_SELECTED",
		SELECT_TOOL: "SELECT_TOOL",
		TOOL_RELEASED: "TOOL_RELEASED",
		TOOL_PRESSED: "TOOL_PRESSED",
		SELECT_PRIMARY_COLOR: "SELECT_PRIMARY_COLOR",
		SELECT_SECONDARY_COLOR: "SELECT_SECONDARY_COLOR",
		PRIMARY_COLOR_SELECTED: "PRIMARY_COLOR_SELECTED",
		SECONDARY_COLOR_SELECTED: "SECONDARY_COLOR_SELECTED",
		CURSOR_MOVED: "CURSOR_MOVED",
		DRAG_START: "DRAG_START",
		DRAG_END: "DRAG_END",
		DIALOG_SHOW: "DIALOG_SHOW",
		DIALOG_HIDE: "DIALOG_HIDE",
		PALETTE_LIST_UPDATED: "PALETTE_LIST_UPDATED",
		USER_SETTINGS_CHANGED: "USER_SETTINGS_CHANGED",
		SHORTCUTS_CHANGED: "SHORTCUTS_CHANGED",
		CLOSE_SETTINGS_DRAWER: "CLOSE_SETTINGS_DRAWER",
		PISKEL_RESET: "PISKEL_RESET",
		PISKEL_SAVE_STATE: "PISKEL_SAVE_STATE",
		PISKEL_DESCRIPTOR_UPDATED: "PISKEL_DESCRIPTOR_UPDATED",
		PISKEL_SAVED_STATUS_UPDATE: "PISKEL_SAVED_STATUS_UPDATE",
		HISTORY_STATE_SAVED: "HISTORY_STATE_SAVED",
		HISTORY_STATE_LOADED: "HISTORY_STATE_LOADED",
		PEN_SIZE_CHANGED: "PEN_SIZE_CHANGED",
		PISKEL_SAVED: "PISKEL_SAVED",
		BEFORE_SAVING_PISKEL: "BEFORE_SAVING_PISKEL",
		AFTER_SAVING_PISKEL: "AFTER_SAVING_PISKEL",
		FRAME_SIZE_CHANGED: "FRAME_SIZE_CHANGED",
		FPS_CHANGED: "FPS_CHANGED",
		SELECTION_CREATED: "SELECTION_CREATED",
		SELECTION_MOVE_REQUEST: "SELECTION_MOVE_REQUEST",
		SELECTION_DISMISSED: "SELECTION_DISMISSED",
		CLIPBOARD_COPY: "CLIPBOARD_COPY",
		CLIPBOARD_CUT: "CLIPBOARD_CUT",
		CLIPBOARD_PASTE: "CLIPBOARD_PASTE",
		SHOW_NOTIFICATION: "SHOW_NOTIFICATION",
		HIDE_NOTIFICATION: "HIDE_NOTIFICATION",
		SHOW_PROGRESS: "SHOW_PROGRESS",
		UPDATE_PROGRESS: "UPDATE_PROGRESS",
		HIDE_PROGRESS: "HIDE_PROGRESS",
		ZOOM_CHANGED: "ZOOM_CHANGED",
		EXPORT_SCALE_CHANGED: "EXPORT_SCALE_CHANGED",
		CURRENT_COLORS_UPDATED: "CURRENT_COLORS_UPDATED",
		PERFORMANCE_REPORT_CHANGED: "PERFORMANCE_REPORT_CHANGED",
		PISKEL_FILE_IMPORT_FAILED: "PISKEL_FILE_IMPORT_FAILED",
		MOUSE_EVENT: "MOUSE_EVENT",
		KEYBOARD_EVENT: "KEYBOARD_EVENT",
		TRANSFORMATION_EVENT: "TRANSFORMATION_EVENT",
		EXTERNAL_PISKEL_READY: "EXTERNAL_PISKEL_READY"
	};
	//#endregion
	//#region src/js/utils/Math.ts
	var MathUtils = {
		minmax(val, min, max) {
			return Math.max(Math.min(val, max), min);
		},
		distance(x0, x1, y0, y1) {
			const dx = Math.abs(x1 - x0);
			const dy = Math.abs(y1 - y0);
			return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
		}
	};
	//#endregion
	//#region src/js/model/Piskel.ts
	/**
	* @constructor
	* @param {Number} width
	* @param {Number} height
	* @param {String} name
	* @param {String} description
	*/
	var Piskel = class Piskel {
		constructor(width, height, fps, descriptor) {
			if (width && height && descriptor) {
				this.layers = [];
				this.width = width;
				this.height = height;
				this.descriptor = descriptor;
				this.savePath = null;
				this.fps = fps;
				this.hiddenFrames = [];
			} else throw "Missing arguments in Piskel constructor : " + [
				width,
				height,
				fps,
				descriptor
			].join(",");
		}
		/**
		* Create a piskel instance from an existing set of (non empty) layers
		* Layers should all be synchronized : same number of frames, same dimensions
		* @param  {Array<pskl.model.Layer>} layers
		* @return {pskl.model.Piskel}
		*/
		static fromLayers(layers, fps, descriptor) {
			let piskel = null;
			if (layers.length > 0 && layers[0].size() > 0) {
				const sampleFrame = layers[0].getFrameAt(0);
				piskel = new Piskel(sampleFrame.getWidth(), sampleFrame.getHeight(), fps, descriptor);
				layers.forEach(piskel.addLayer.bind(piskel));
			} else throw "Piskel.fromLayers expects array of non empty pskl.model.Layer as first argument";
			return piskel;
		}
		getHeight() {
			return this.height;
		}
		getWidth() {
			return this.width;
		}
		getFPS() {
			return this.fps;
		}
		getLayers() {
			return this.layers;
		}
		getLayerAt(index) {
			return this.layers[index];
		}
		getLayersByName(name) {
			return this.layers.filter(function(l) {
				return l.getName() == name;
			});
		}
		getFrameCount() {
			return this.getLayerAt(0).size();
		}
		addLayer(layer) {
			this.layers.push(layer);
		}
		addLayerAt(layer, index) {
			this.layers.splice(index, 0, layer);
		}
		moveLayerUp(layer, toTop) {
			const index = this.layers.indexOf(layer);
			const toIndex = toTop ? this.layers.length - 1 : index + 1;
			this.moveLayer_(index, toIndex);
		}
		moveLayerDown(layer, toBottom) {
			const index = this.layers.indexOf(layer);
			const toIndex = toBottom ? 0 : index - 1;
			this.moveLayer_(index, toIndex);
		}
		/**
		* Move the layer at the provided index to the provided toIndex.
		*/
		moveLayer_(fromIndex, toIndex) {
			if (fromIndex == -1 || toIndex == -1 || fromIndex == toIndex) return;
			toIndex = MathUtils.minmax(toIndex, 0, this.layers.length - 1);
			const layer = this.layers.splice(fromIndex, 1)[0];
			this.layers.splice(toIndex, 0, layer);
		}
		removeLayer(layer) {
			const index = this.layers.indexOf(layer);
			if (index != -1) this.layers.splice(index, 1);
		}
		removeLayerAt(index) {
			this.layers.splice(index, 1);
		}
		getDescriptor() {
			return this.descriptor;
		}
		setDescriptor(descriptor) {
			this.descriptor = descriptor;
			$.publish(Events.PISKEL_DESCRIPTOR_UPDATED);
		}
		setName(name) {
			this.descriptor.name = name;
			$.publish(Events.PISKEL_DESCRIPTOR_UPDATED);
		}
		getHash() {
			return this.layers.map(function(layer) {
				return layer.getHash();
			}).join("-");
		}
	};
	//#endregion
	//#region src/js/utils/Uuid.ts
	var s4 = function() {
		return Math.floor((1 + Math.random()) * 65536).toString(16).substring(1);
	};
	var Uuid = { generate() {
		return "ss-s-s-s-sss".replace(/s/g, function() {
			return s4();
		});
	} };
	//#endregion
	//#region src/js/model/piskel/Descriptor.ts
	var Descriptor = class {
		constructor(name, description) {
			this.name = name;
			this.description = description;
		}
	};
	//#endregion
	//#region src/js/utils/Dom.ts
	var Dom = {
		getElement(selector, parent = document) {
			const element = parent.querySelector(selector);
			if (element === null) throw new Error("Missing element: " + selector);
			return element;
		},
		getContext2d(canvas) {
			const context = canvas.getContext("2d");
			if (context === null) throw new Error("The canvas has no 2d context");
			return context;
		},
		isParent(node, parent, excludeParent) {
			if (node && parent) {
				if (excludeParent) node = node.parentNode;
				while (node) {
					if (node === parent) return true;
					node = node.parentNode;
				}
			}
			return false;
		},
		getParentWithData(node, dataName) {
			while (node) {
				if (node.dataset && typeof node.dataset[dataName] !== "undefined") return node;
				node = node.parentNode;
			}
			return null;
		},
		getData(node, dataName) {
			const parent = Dom.getParentWithData(node, dataName);
			if (parent !== null) return parent.dataset[dataName];
		},
		removeClass(className, container) {
			const elements = (container || document).querySelectorAll("." + className);
			for (let i = 0; i < elements.length; i++) elements[i].classList.remove(className);
		}
	};
	//#endregion
	//#region src/js/model/frame/RenderedFrame.ts
	/**
	* Create a frame instance that provides an image getter. Can be faster
	* to use after merging using transparency. Transparent frames are merged to
	* an image and this allows to reuse the image rather than retransform into
	* a frame before calling the renderers.
	*
	* This rendered frame should only be used with renderers that support it.
	*
	* @param {Function} imageFn getter that will create the image
	* @param {Number} width image width in pixels
	* @param {Number} height image height in pixels
	* @param {String} id will be used as hash, so should be as unique as possible
	*/
	var RenderedFrame = class {
		constructor(renderFn, width, height, id) {
			this.width = width;
			this.height = height;
			this.id = id;
			this.renderFn = renderFn;
		}
		getRenderedFrame() {
			return this.renderFn();
		}
		getHash() {
			return this.id;
		}
		getWidth() {
			return this.width;
		}
		getHeight() {
			return this.height;
		}
	};
	//#endregion
	//#region src/js/utils/CanvasUtils.ts
	var CanvasUtils = {
		createCanvas(width, height, classList) {
			const canvas = document.createElement("canvas");
			canvas.setAttribute("width", String(width));
			canvas.setAttribute("height", String(height));
			const classes = typeof classList == "string" ? [classList] : classList;
			if (Array.isArray(classes)) for (let i = 0; i < classes.length; i++) canvas.classList.add(classes[i]);
			return canvas;
		},
		createFromImageData(imageData) {
			const canvas = CanvasUtils.createCanvas(imageData.width, imageData.height);
			Dom.getContext2d(canvas).putImageData(imageData, 0, 0);
			return canvas;
		},
		createFromImage(image) {
			const canvas = CanvasUtils.createCanvas(image.width, image.height);
			Dom.getContext2d(canvas).drawImage(image, 0, 0);
			return canvas;
		},
		createFramesFromImage(image, offsetX, offsetY, width, height, useHorizonalStrips, ignoreEmptyFrames) {
			const canvasArray = [];
			let x = offsetX;
			let y = offsetY;
			const blankData = CanvasUtils.createCanvas(width, height).toDataURL();
			while (x + width <= image.width && y + height <= image.height) {
				const canvas = CanvasUtils.createCanvas(width, height);
				Dom.getContext2d(canvas).drawImage(image, x, y, width, height, 0, 0, width, height);
				if (!ignoreEmptyFrames || canvas.toDataURL() !== blankData) canvasArray.push(canvas);
				if (useHorizonalStrips) {
					x += width;
					if (x + width > image.width) {
						x = offsetX;
						y += height;
					}
				} else {
					y += height;
					if (y + height > image.height) {
						x += width;
						y = offsetY;
					}
				}
			}
			return canvasArray;
		},
		disableImageSmoothing(canvas) {
			CanvasUtils.setImageSmoothing(canvas, false);
		},
		enableImageSmoothing(canvas) {
			CanvasUtils.setImageSmoothing(canvas, true);
		},
		setImageSmoothing(canvas, smoothing) {
			const context = Dom.getContext2d(canvas);
			context.imageSmoothingEnabled = smoothing;
			context.mozImageSmoothingEnabled = smoothing;
			context.oImageSmoothingEnabled = smoothing;
			context.webkitImageSmoothingEnabled = smoothing;
			context.msImageSmoothingEnabled = smoothing;
		},
		clear(canvas) {
			if (canvas) Dom.getContext2d(canvas).clearRect(0, 0, canvas.width, canvas.height);
		},
		clone(canvas) {
			const clone = CanvasUtils.createCanvas(canvas.width, canvas.height);
			Dom.getContext2d(clone).drawImage(canvas, 0, 0);
			return clone;
		},
		getImageDataFromCanvas(canvas) {
			return Dom.getContext2d(canvas).getImageData(0, 0, canvas.width, canvas.height).data;
		},
		getBase64FromCanvas(canvas, format) {
			format = format || "png";
			const data = canvas.toDataURL("image/" + format);
			return data.substr(data.indexOf(",") + 1);
		}
	};
	//#endregion
	//#region src/js/rendering/CanvasRenderer.ts
	var offCanvasPool = {};
	var imageDataPool = {};
	/**
	* Draw the provided frame in a 2d canvas
	*
	* @param {Frame|RenderedFrame} frame the frame to draw
	* @param {Canvas} canvas the canvas target
	* @param {String} transparentColor (optional) color to use to represent transparent pixels.
	* @param {String} globalAlpha (optional) global frame opacity
	*/
	function drawFrameToCanvas(frame, canvas, transparentColor, globalAlpha) {
		const context = Dom.getContext2d(canvas);
		globalAlpha = globalAlpha === void 0 || isNaN(globalAlpha) ? 1 : globalAlpha;
		context.globalAlpha = globalAlpha;
		transparentColor = transparentColor || Constants.TRANSPARENT_COLOR;
		if (frame instanceof RenderedFrame) context.drawImage(frame.getRenderedFrame(), 0, 0);
		else {
			const w = frame.getWidth();
			const h = frame.getHeight();
			let pixels = frame.pixels;
			const constantTransparentColorInt = colorToInt(Constants.TRANSPARENT_COLOR);
			const transparentColorInt = colorToInt(transparentColor);
			if (transparentColorInt != constantTransparentColorInt) {
				pixels = frame.getPixels();
				for (let i = 0, length = pixels.length; i < length; i++) if (pixels[i] == constantTransparentColorInt) pixels[i] = transparentColorInt;
			}
			const imageDataKey = w + "-" + h;
			let imageData;
			if (!imageDataPool[imageDataKey]) imageData = imageDataPool[imageDataKey] = context.createImageData(w, h);
			else imageData = imageDataPool[imageDataKey];
			const data = new Uint8ClampedArray(pixels.buffer);
			imageData.data.set(data);
			const offCanvasKey = w + "-" + h;
			let offCanvas;
			if (!offCanvasPool[offCanvasKey]) offCanvas = offCanvasPool[offCanvasKey] = CanvasUtils.createCanvas(w, h);
			else offCanvas = offCanvasPool[offCanvasKey];
			Dom.getContext2d(offCanvas).putImageData(imageData, 0, 0);
			context.drawImage(offCanvas, 0, 0, w, h);
			context.globalAlpha = 1;
		}
	}
	var CanvasRenderer = class {
		constructor(frame, zoom) {
			this.frame = frame;
			this.zoom = zoom;
			this.opacity_ = 1;
			this.transparentColor_ = "white";
		}
		/**
		* Decide which color should be used to represent transparent pixels
		* Default : white
		* @param  {String} color the color to use either as '#ABCDEF' or 'red' or 'rgb(x,y,z)' or 'rgba(x,y,z,a)'
		*/
		drawTransparentAs(color) {
			this.transparentColor_ = color;
		}
		setOpacity(opacity) {
			this.opacity_ = opacity;
		}
		render() {
			const canvas = this.createCanvas_();
			drawFrameToCanvas(this.frame, canvas, this.transparentColor_, this.opacity_);
			const scaledCanvas = this.createCanvas_(this.zoom);
			const scaledContext = Dom.getContext2d(scaledCanvas);
			CanvasUtils.disableImageSmoothing(scaledCanvas);
			scaledContext.scale(this.zoom, this.zoom);
			scaledContext.drawImage(canvas, 0, 0);
			return scaledCanvas;
		}
		createCanvas_(zoom) {
			zoom = zoom || 1;
			const width = this.frame.getWidth() * zoom;
			const height = this.frame.getHeight() * zoom;
			return CanvasUtils.createCanvas(width, height);
		}
	};
	//#endregion
	//#region src/js/utils/ImageResizer.ts
	var ImageResizer = {
		scale(image, factor, smoothingEnabled) {
			return ImageResizer.resize(image, image.width * factor, image.height * factor, smoothingEnabled);
		},
		resize(image, targetWidth, targetHeight, smoothingEnabled) {
			const canvas = CanvasUtils.createCanvas(targetWidth, targetHeight);
			const context = Dom.getContext2d(canvas);
			context.save();
			if (!smoothingEnabled) CanvasUtils.disableImageSmoothing(canvas);
			context.translate(canvas.width / 2, canvas.height / 2);
			context.scale(targetWidth / image.width, targetHeight / image.height);
			context.drawImage(image, -image.width / 2, -image.height / 2);
			context.restore();
			return canvas;
		}
	};
	//#endregion
	//#region src/js/utils/FrameUtils.ts
	var FrameUtils = {
		toImage(frame, zoom, opacity) {
			zoom = zoom || 1;
			opacity = opacity === void 0 || isNaN(opacity) ? 1 : opacity;
			const canvasRenderer = new CanvasRenderer(frame, zoom);
			canvasRenderer.drawTransparentAs(Constants.TRANSPARENT_COLOR);
			canvasRenderer.setOpacity(opacity);
			return canvasRenderer.render();
		},
		drawToCanvas(frame, canvas, transparentColor, globalAlpha) {
			drawFrameToCanvas(frame, canvas, transparentColor, globalAlpha);
		},
		renderLine_(color, x, y, width, context) {
			if (color === Constants.TRANSPARENT_COLOR || color === null) return;
			context.fillStyle = color;
			context.fillRect(x, y, 1, width);
		},
		merge(frames) {
			if (frames.length === 0) throw new Error("Cannot merge an empty list of frames");
			const merged = frames[0].clone();
			for (let i = 1; i < frames.length; i++) FrameUtils.mergeFrames_(merged, frames[i]);
			return merged;
		},
		mergeFrames_(frameA, frameB) {
			const transparentColorInt = colorToInt(Constants.TRANSPARENT_COLOR);
			for (let i = 0, length = frameA.getWidth() * frameA.getHeight(); i < length; ++i) if (frameB.pixels[i] != transparentColorInt && frameA.pixels[i] != frameB.pixels[i]) frameA.pixels[i] = frameB.pixels[i];
		},
		addImageToFrame(frame, image, x, y) {
			const imageFrame = FrameUtils.createFromImage(image);
			x = x - Math.floor(imageFrame.width / 2);
			y = y - Math.floor(imageFrame.height / 2);
			x = Math.max(0, x);
			y = Math.max(0, y);
			if (imageFrame.width <= frame.width) x = Math.min(x, frame.width - imageFrame.width);
			if (imageFrame.height <= frame.height) y = Math.min(y, frame.height - imageFrame.height);
			imageFrame.forEachPixel(function(color, frameX, frameY) {
				if (color != colorToInt(Constants.TRANSPARENT_COLOR)) frame.setPixel(x + frameX, y + frameY, color);
			});
		},
		resize(frame, targetWidth, targetHeight, smoothing) {
			const image = FrameUtils.toImage(frame);
			const resizedImage = ImageResizer.resize(image, targetWidth, targetHeight, smoothing);
			return FrameUtils.createFromImage(resizedImage);
		},
		removeTransparency(frame) {
			frame.forEachPixel(function(color, x, y) {
				const alpha = color >> 24 >>> 0 & 255;
				if (alpha && alpha !== 255) {
					const rounded = Math.round(alpha / 255) * 255;
					const roundedColor = color - (alpha << 24 >>> 0) + (rounded << 24 >>> 0);
					frame.setPixel(x, y, roundedColor);
				}
			});
		},
		createFromCanvas(canvas, x, y, w, h, preserveOpacity) {
			const imgData = Dom.getContext2d(canvas).getImageData(x, y, w, h).data;
			return FrameUtils.createFromImageData_(imgData, w, h, preserveOpacity);
		},
		createFromImageSrc(src, preserveOpacity, cb) {
			const image = new Image();
			image.addEventListener("load", function onImageLoaded() {
				image.removeEventListener("load", onImageLoaded);
				cb(FrameUtils.createFromImage(image, preserveOpacity));
			});
			image.src = src;
		},
		createFromImage(image, preserveOpacity) {
			const w = image.width;
			const h = image.height;
			const canvas = CanvasUtils.createCanvas(w, h);
			const context = Dom.getContext2d(canvas);
			context.drawImage(image, 0, 0, w, h, 0, 0, w, h);
			const imgData = context.getImageData(0, 0, w, h).data;
			return FrameUtils.createFromImageData_(imgData, w, h, preserveOpacity);
		},
		createFromImageData_(imageData, width, height, preserveOpacity) {
			const frame = new Frame(width, height);
			frame.pixels = new Uint32Array(imageData.buffer);
			if (!preserveOpacity) FrameUtils.removeTransparency(frame);
			return frame;
		},
		createFramesFromSpritesheet(image, frameCount) {
			const layout = [];
			for (let i = 0; i < frameCount; i++) layout.push([i]);
			return FrameUtils.createFramesFromChunk(image, layout).map(function(chunkFrame) {
				return chunkFrame.frame;
			});
		},
		createFramesFromChunk(image, layout) {
			const width = image.width;
			const height = image.height;
			const frameWidth = width / layout.length;
			const frameHeight = height / layout[0].length;
			const canvas = CanvasUtils.createCanvas(frameWidth, frameHeight);
			const context = Dom.getContext2d(canvas);
			const chunkFrames = [];
			for (let i = 0; i < layout.length; i++) {
				const row = layout[i];
				for (let j = 0; j < row.length; j++) {
					context.clearRect(0, 0, frameWidth, frameHeight);
					context.drawImage(image, frameWidth * i, frameHeight * j, frameWidth, frameHeight, 0, 0, frameWidth, frameHeight);
					const frame = FrameUtils.createFromCanvas(canvas, 0, 0, frameWidth, frameHeight);
					chunkFrames.push({
						index: layout[i][j],
						frame
					});
				}
			}
			return chunkFrames;
		},
		toFrameGrid(normalGrid) {
			const frameGrid = [];
			const w = normalGrid[0].length;
			const h = normalGrid.length;
			for (let x = 0; x < w; x++) {
				frameGrid[x] = [];
				for (let y = 0; y < h; y++) frameGrid[x][y] = normalGrid[y][x];
			}
			return frameGrid;
		}
	};
	//#endregion
	//#region src/js/utils/serialization/arraybuffer/ArrayBufferDeserializer.ts
	var ArrayBufferDeserializer = { deserialize(data, callback) {
		let i;
		let j;
		const arr8 = new Uint8Array(data);
		const arr16 = new Uint16Array(arr8.buffer);
		const width = arr16[1];
		const height = arr16[2];
		const fps = arr16[3];
		const descriptorNameLength = arr16[4];
		const descriptorDescriptionLength = arr16[5];
		const layerCount = arr16[6];
		const serializedHiddenFramesLength = arr16[7];
		let currentIndex = 8;
		let descriptorName = "";
		for (i = 0; i < descriptorNameLength; i++) descriptorName += String.fromCharCode(arr16[currentIndex + i]);
		currentIndex += descriptorNameLength;
		let descriptorDescription = "";
		for (i = 0; i < descriptorDescriptionLength; i++) descriptorDescription = String.fromCharCode(arr16[8 + descriptorNameLength + i]);
		currentIndex += descriptorDescriptionLength;
		let serializedHiddenFrames = "";
		for (i = 0; i < serializedHiddenFramesLength; i++) serializedHiddenFrames = String.fromCharCode(arr16[8 + descriptorNameLength + i]);
		const hiddenFrames = serializedHiddenFrames.split("-");
		currentIndex += serializedHiddenFramesLength;
		const layers = [];
		for (i = 0; i < layerCount; i++) {
			const layerNameLength = arr16[currentIndex];
			const opacity = arr16[currentIndex + 1] / 65535;
			const frameCount = arr16[currentIndex + 2];
			const dataUriLengthFirstHalf = arr16[currentIndex + 3];
			const dataUriLength = arr16[currentIndex + 4] >>> 0 | dataUriLengthFirstHalf << 16 >>> 0;
			let layerName = "";
			for (j = 0; j < layerNameLength; j++) layerName += String.fromCharCode(arr16[currentIndex + 5 + j]);
			let dataUri = "";
			for (j = 0; j < dataUriLength; j++) dataUri += String.fromCharCode(arr8[(currentIndex + 5 + layerNameLength) * 2 + j]);
			dataUri = "data:image/png;base64," + dataUri;
			currentIndex += Math.ceil(5 + layerNameLength + dataUriLength / 2);
			layers.push({
				name: layerName,
				opacity,
				frameCount,
				dataUri
			});
		}
		const piskel = new Piskel(width, height, fps, new Descriptor(descriptorName, descriptorDescription));
		Reflect.set(piskel, "hiddenFrames", hiddenFrames);
		let loadedLayers = 0;
		const loadLayerImage = function(layer, model, cb) {
			const image = new Image();
			image.onload = function() {
				FrameUtils.createFramesFromSpritesheet(image, layer.frameCount).forEach(function(frame) {
					model.addFrame(frame);
				});
				loadedLayers++;
				if (loadedLayers == layerCount) cb(piskel);
			};
			image.src = layer.dataUri;
		};
		for (i = 0; i < layerCount; i++) {
			const layer = layers[i];
			const nlayer = new Layer(layer.name);
			nlayer.setOpacity(layer.opacity);
			piskel.addLayer(nlayer);
			loadLayerImage(layer, nlayer, callback);
		}
	} };
	//#endregion
	//#region src/js/rendering/FramesheetRenderer.ts
	/**
	* Render an array of frames
	* @param {Array.<pskl.model.Frame>} frames
	*/
	var FramesheetRenderer = class {
		constructor(frames) {
			if (frames.length > 0) this.frames = frames;
			else throw "FramesheetRenderer : Invalid argument : frames is empty";
		}
		renderAsCanvas(columns) {
			columns = columns || this.frames.length;
			const rows = Math.ceil(this.frames.length / columns);
			const canvas = this.createCanvas_(columns, rows);
			for (let i = 0; i < this.frames.length; i++) {
				const frame = this.frames[i];
				const posX = i % columns * frame.getWidth();
				const posY = Math.floor(i / columns) * frame.getHeight();
				this.drawFrameInCanvas_(frame, canvas, posX, posY);
			}
			return canvas;
		}
		drawFrameInCanvas_(frame, canvas, offsetWidth, offsetHeight) {
			const context = Dom.getContext2d(canvas);
			const imageData = context.createImageData(frame.getWidth(), frame.getHeight());
			const pixels = frame.getPixels();
			const data = new Uint8ClampedArray(pixels.buffer);
			imageData.data.set(data);
			context.putImageData(imageData, offsetWidth, offsetHeight);
		}
		createCanvas_(columns, rows) {
			const sampleFrame = this.frames[0];
			const width = columns * sampleFrame.getWidth();
			const height = rows * sampleFrame.getHeight();
			return CanvasUtils.createCanvas(width, height);
		}
	};
	//#endregion
	//#region src/js/utils/serialization/arraybuffer/ArrayBufferSerializer.ts
	var ArrayBufferSerializer = {
		calculateRequiredBytes(piskel, framesData) {
			const descriptorNameLength = piskel.getDescriptor().name.length;
			const descriptorDescriptionLength = piskel.getDescriptor().description.length;
			let bytes = 0;
			bytes += 8;
			bytes += 4;
			bytes += 2;
			bytes += descriptorNameLength * 2;
			bytes += descriptorDescriptionLength * 2;
			for (let i = 0, layers = piskel.getLayers(); i < layers.length; i++) {
				bytes += 10;
				bytes += layers[i].name.length * 2;
				bytes += framesData[i].length;
				if (bytes % 2 == 1) bytes++;
			}
			return bytes;
		},
		serialize(piskel) {
			let i;
			let j;
			let layers;
			let dataUri;
			let dataUriLength;
			const framesData = [];
			for (i = 0, layers = piskel.getLayers(); i < layers.length; i++) {
				dataUri = new FramesheetRenderer(layers[i].getFrames()).renderAsCanvas().toDataURL().split(",")[1];
				dataUriLength = dataUri.length;
				framesData.push({
					uri: dataUri,
					length: dataUriLength
				});
			}
			const serializedHiddenFrames = piskel.hiddenFrames.join("-");
			const bytes = ArrayBufferSerializer.calculateRequiredBytes(piskel, framesData);
			const buffer = new ArrayBuffer(bytes);
			const arr8 = new Uint8Array(buffer);
			const arr16 = new Uint16Array(buffer);
			const width = piskel.getWidth();
			const height = piskel.getHeight();
			const descriptorName = piskel.getDescriptor().name;
			const descriptorNameLength = descriptorName.length;
			const descriptorDescription = piskel.getDescriptor().description;
			const descriptorDescriptionLength = descriptorDescription.length;
			arr16[0] = Constants.MODEL_VERSION;
			arr16[1] = width;
			arr16[2] = height;
			arr16[3] = assertInitialized(app.piskelController, "piskelController").getFPS();
			arr16[4] = descriptorNameLength;
			arr16[5] = descriptorDescriptionLength;
			arr16[6] = piskel.getLayers().length;
			arr16[7] = serializedHiddenFrames.length;
			let currentIndex = 8;
			for (i = 0; i < descriptorNameLength; i++) arr16[currentIndex + i] = descriptorName.charCodeAt(i);
			currentIndex = currentIndex + descriptorNameLength;
			for (i = 0; i < descriptorDescriptionLength; i++) arr16[currentIndex + i] = descriptorDescription.charCodeAt(i);
			currentIndex = currentIndex + descriptorDescriptionLength;
			for (i = 0; i < serializedHiddenFrames.length; i++) arr16[currentIndex + i] = serializedHiddenFrames.charCodeAt(i);
			currentIndex = currentIndex + serializedHiddenFrames.length;
			for (i = 0, layers = piskel.getLayers(); i < layers.length; i++) {
				const layer = layers[i];
				const frames = layer.getFrames();
				const layerName = layer.getName();
				const layerNameLength = layerName.length;
				const opacity = layer.getOpacity();
				const frameCount = frames.length;
				dataUri = framesData[i].uri;
				dataUriLength = framesData[i].length;
				arr16[currentIndex] = layerNameLength;
				arr16[currentIndex + 1] = Math.floor(opacity * 65535);
				arr16[currentIndex + 2] = frameCount;
				arr16[currentIndex + 3] = (dataUriLength & 4294901760) >> 16 >>> 0;
				arr16[currentIndex + 4] = (dataUriLength & 65535) >>> 0;
				for (j = 0; j < layerNameLength; j++) arr16[currentIndex + 5 + j] = layerName.charCodeAt(j);
				for (j = 0; j < dataUriLength; j++) arr8[(currentIndex + 5 + layerNameLength) * 2 + j] = dataUri.charCodeAt(j);
				currentIndex += Math.ceil(5 + layerNameLength + dataUriLength / 2);
			}
			return buffer;
		}
	};
	//#endregion
	//#region src/js/utils/UserSettings.ts
	/** Prefix of the keys under which the customized shortcuts are saved. */
	var SHORTCUT_SETTINGS_PREFIX = "shortcut.";
	var UserSettings = {
		GRID_COLOR: "GRID_COLOR",
		GRID_ENABLED: "GRID_ENABLED",
		GRID_WIDTH: "GRID_WIDTH",
		GRID_SPACING: "GRID_SPACING",
		MAX_FPS: "MAX_FPS",
		DEFAULT_SIZE: "DEFAULT_SIZE",
		CANVAS_BACKGROUND: "CANVAS_BACKGROUND",
		SELECTED_PALETTE: "SELECTED_PALETTE",
		SEAMLESS_OPACITY: "SEAMLESS_OPACITY",
		SEAMLESS_MODE: "SEAMLESS_MODE",
		PREVIEW_SIZE: "PREVIEW_SIZE",
		ONION_SKIN: "ONION_SKIN",
		LAYER_PREVIEW: "LAYER_PREVIEW",
		LAYER_OPACITY: "LAYER_OPACITY",
		EXPORT_SCALE: "EXPORT_SCALE",
		EXPORT_TAB: "EXPORT_TAB",
		EXPORT_GIF_REPEAT: "EXPORT_GIF_REPEAT",
		PEN_SIZE: "PEN_SIZE",
		RESIZE_SETTINGS: "RESIZE_SETTINGS",
		COLOR_FORMAT: "COLOR_FORMAT",
		TRANSFORM_SHOW_MORE: "TRANSFORM_SHOW_MORE",
		PREFERENCES_TAB: "PREFERENCES_TAB",
		KEY_TO_DEFAULT_VALUE_MAP_: {
			GRID_COLOR: Constants.TRANSPARENT_COLOR,
			GRID_ENABLED: false,
			GRID_WIDTH: 1,
			GRID_SPACING: 1,
			MAX_FPS: 24,
			DEFAULT_SIZE: {
				width: Constants.DEFAULT.WIDTH,
				height: Constants.DEFAULT.HEIGHT
			},
			CANVAS_BACKGROUND: "lowcont-dark-canvas-background",
			SELECTED_PALETTE: Constants.CURRENT_COLORS_PALETTE_ID,
			SEAMLESS_OPACITY: .3,
			SEAMLESS_MODE: false,
			PREVIEW_SIZE: "original",
			ONION_SKIN: false,
			LAYER_OPACITY: .2,
			LAYER_PREVIEW: true,
			EXPORT_SCALE: 1,
			EXPORT_TAB: "gif",
			EXPORT_GIF_REPEAT: true,
			PEN_SIZE: 1,
			RESIZE_SETTINGS: {
				maintainRatio: true,
				resizeContent: false,
				origin: "TOPLEFT"
			},
			COLOR_FORMAT: "hex",
			TRANSFORM_SHOW_MORE: false,
			PREFERENCES_TAB: "misc"
		},
		cache_: {},
		get(key) {
			this.checkKeyValidity_(key);
			if (!(key in this.cache_)) {
				const storedValue = this.readFromLocalStorage_(key);
				if (typeof storedValue !== "undefined" && storedValue !== null) this.cache_[key] = storedValue;
				else this.cache_[key] = this.readFromDefaults_(key);
			}
			const cache = this.cache_;
			return Reflect.get(cache, key);
		},
		set(key, value) {
			this.checkKeyValidity_(key);
			this.cache_[key] = value;
			this.writeToLocalStorage_(key, value);
			$.publish(Events.USER_SETTINGS_CHANGED, [key, value]);
		},
		readFromLocalStorage_(key) {
			let value = window.localStorage[key];
			if (typeof value != "undefined") value = JSON.parse(value);
			return value;
		},
		writeToLocalStorage_(key, value) {
			window.localStorage[key] = JSON.stringify(value);
		},
		readFromDefaults_(key) {
			const defaults = this.KEY_TO_DEFAULT_VALUE_MAP_;
			return Reflect.get(defaults, key);
		},
		checkKeyValidity_(key) {
			if (key.indexOf("shortcut.") === 0) return true;
			if (!(key in this.KEY_TO_DEFAULT_VALUE_MAP_)) console.error("UserSettings key <" + key + "> not found in supported keys.");
		}
	};
	//#endregion
	//#region src/js/utils/UserAgent.ts
	var ua = navigator.userAgent;
	var isEdge = /edge\//i.test(ua);
	var isOpera = /OPR\//.test(ua);
	var hasChrome = /Chrome/i.test(ua);
	var hasSafari = /Safari\//.test(ua);
	var isFirefox = /Firefox/i.test(ua);
	var isChrome = hasChrome && !isOpera && !isEdge;
	var isSafari = hasSafari && !isOpera && !isEdge;
	var getVersion = function() {
		let match;
		if (isChrome) match = /Chrome\/(\d+)/i.exec(ua);
		else if (isFirefox) match = /Firefox\/(\d+)/i.exec(ua);
		else return;
		return parseInt(match === null ? "" : match[1], 10);
	};
	var UserAgent = {
		isEdge,
		isFirefox,
		isMac: /Mac/.test(ua),
		isOpera,
		hasChrome,
		hasSafari,
		isChrome,
		isSafari,
		supportedUserAgents: [
			"isEdge",
			"isChrome",
			"isFirefox"
		],
		version: getVersion(),
		isUnsupported() {
			return UserAgent.supportedUserAgents.every(function(uaTest) {
				return !UserAgent[uaTest];
			});
		},
		getDisplayName() {
			if (UserAgent.isChrome) return "Chrome";
			else if (UserAgent.isFirefox) return "Firefox";
			else if (UserAgent.isSafari) return "Safari";
			else if (UserAgent.isOpera) return "Opera";
			else return ua;
		}
	};
	//#endregion
	//#region src/js/service/keyboard/KeycodeTranslator.ts
	var specialKeys = {
		8: "back",
		13: "enter",
		27: "esc",
		32: "space",
		37: "left",
		38: "up",
		39: "right",
		40: "down",
		46: "del",
		189: "-",
		109: "-",
		173: "-",
		187: "+",
		107: "+",
		61: "+",
		188: "<",
		190: ">",
		191: "?",
		219: "[",
		221: "]"
	};
	var KeycodeTranslator = { toChar(keycode) {
		if (keycode >= 48 && keycode <= 57) return keycode - 48 + "";
		else if (keycode >= 96 && keycode <= 105) return keycode - 96 + "";
		else if (keycode >= 65 && keycode <= 90) return (keycode - 65 + 10).toString(36);
		else return specialKeys[keycode];
	} };
	//#endregion
	//#region src/js/service/keyboard/KeyUtils.ts
	var KeyUtils = {
		createKeyFromString(shortcutKeyString) {
			shortcutKeyString = shortcutKeyString.toLowerCase();
			const modifiers = {
				alt: shortcutKeyString.indexOf("alt+") != -1,
				shift: shortcutKeyString.indexOf("shift+") != -1,
				ctrl: shortcutKeyString.indexOf("ctrl+") != -1
			};
			const parts = shortcutKeyString.split(/\+(?!$)/);
			return {
				key: parts[parts.length - 1].toUpperCase(),
				modifiers
			};
		},
		createKeyFromEvent(evt) {
			const keycode = evt.which || evt.keyCode;
			const key = KeycodeTranslator.toChar(keycode);
			if (!key) return null;
			return {
				key: key.toUpperCase(),
				modifiers: {
					alt: evt.altKey,
					shift: evt.shiftKey,
					ctrl: KeyUtils.isCtrlKeyPressed_(evt)
				}
			};
		},
		equals(key1, key2) {
			const a = typeof key1 === "string" ? KeyUtils.createKeyFromString(key1) : key1;
			const b = typeof key2 === "string" ? KeyUtils.createKeyFromString(key2) : key2;
			return a.key === b.key && a.modifiers.alt === b.modifiers.alt && a.modifiers.shift === b.modifiers.shift && a.modifiers.ctrl === b.modifiers.ctrl;
		},
		stringify(shortcutKeyObject) {
			const modifierString = KeyUtils.getModifiersString(shortcutKeyObject.modifiers);
			if (modifierString) return modifierString + "+" + shortcutKeyObject.key;
			return shortcutKeyObject.key;
		},
		getModifiersString(modifiers) {
			const keyBuffer = [];
			if (modifiers.alt) keyBuffer.push("alt");
			if (modifiers.ctrl) keyBuffer.push("ctrl");
			if (modifiers.shift) keyBuffer.push("shift");
			return keyBuffer.join("+");
		},
		isCtrlKeyPressed_(evt) {
			return UserAgent.isMac ? evt.metaKey : evt.ctrlKey;
		}
	};
	//#endregion
	//#region src/js/service/keyboard/Shortcut.ts
	var _Shortcut;
	/**
	* List of keys that cannot be remapped. Either alternate keys, which are not displayed.
	* Or really custom shortcuts such as the 1-9 for color palette shorctus
	*/
	var FORBIDDEN_KEYS = [
		"1",
		"2",
		"3",
		"4",
		"5",
		"6",
		"7",
		"8",
		"9",
		"?",
		"shift+?",
		"DEL",
		"BACK",
		"ENTER",
		"ctrl+Y",
		"ctrl+shift+Z"
	];
	/**
	* Keyboard shortcut wrapper, use it to register on the ShortcutService.
	*
	* @param {String} id          Shortcut identifier
	* @param {String} description Shortcut description
	* @param {String|Array<String>} defaultKeys  combination of modifiers + ([a-z0-9] or a special key)
	*                 Special keys are defined in KeycodeTranslator. If the shortcut supports several keys,
	*                 use an array of String keys
	*/
	var Shortcut = class Shortcut {
		constructor(id, description, defaultKeys, displayKey) {
			this.id_ = id;
			this.description_ = description;
			if (typeof defaultKeys === "string") defaultKeys = [defaultKeys];
			this.defaultKeys_ = defaultKeys;
			this.displayKey_ = displayKey;
		}
		getId() {
			return this.id_;
		}
		getDescription() {
			return this.description_;
		}
		/**
		* Retrieve the array of String keys that match this shortcut
		* @return {Array<String>} array of keys
		*/
		getKeys() {
			const keys = UserSettings.get(this.getLocalStorageKey_()) || this.defaultKeys_;
			if (typeof keys === "string") return [keys];
			if (!Array.isArray(keys)) return [];
			return keys;
		}
		/**
		* For now, only shortcuts with a single key mapped can be edited
		* @return {Boolean} true if the shortcut can be updated
		*/
		isEditable() {
			if (this.getKeys().length === 0) return true;
			if (this.getKeys().length === 1) return FORBIDDEN_KEYS.indexOf(this.getKeys()[0]) === -1;
			return false;
		}
		isCustom() {
			const keys = this.getKeys();
			if (keys.length !== this.defaultKeys_.length) return true;
			return this.defaultKeys_.some(function(defaultKey) {
				return !keys.some(function(key) {
					return KeyUtils.equals(key, defaultKey);
				});
			});
		}
		isUndefined() {
			return this.getKeys().length === 0;
		}
		/**
		* Get the key to be displayed for this shortcut, if
		* @return {[type]} [description]
		*/
		getDisplayKey() {
			if (this.isUndefined()) return "???";
			if (this.displayKey_) return this.displayKey_;
			return this.getKeys()[0];
		}
		restoreDefault() {
			UserSettings.set(this.getLocalStorageKey_(), "");
		}
		updateKeys(keys) {
			UserSettings.set(this.getLocalStorageKey_(), keys);
		}
		removeKeys(keysToRemove) {
			if (!this.isEditable()) return;
			const keys = this.getKeys();
			const updatedKeys = keys.filter(function(key) {
				return !keysToRemove.some(function(keyToRemove) {
					return KeyUtils.equals(key, keyToRemove);
				});
			});
			if (updatedKeys.length !== keys.length) {
				this.updateKeys(updatedKeys);
				return true;
			}
			return false;
		}
		getLocalStorageKey_() {
			return Shortcut.USER_SETTINGS_PREFIX + this.id_;
		}
	};
	_Shortcut = Shortcut;
	_Shortcut.USER_SETTINGS_PREFIX = SHORTCUT_SETTINGS_PREFIX;
	//#endregion
	//#region src/js/service/keyboard/Shortcuts.ts
	var createShortcut = function(id, description, defaultKey, displayKey) {
		return new Shortcut(id, description, defaultKey, displayKey);
	};
	var Shortcuts = {
		FORBIDDEN_KEYS,
		TOOL: {
			PEN: createShortcut("tool-pen", "Pen tool", "P"),
			MIRROR_PEN: createShortcut("tool-vertical-mirror-pen", "Vertical mirror pen tool", "V"),
			PAINT_BUCKET: createShortcut("tool-paint-bucket", "Paint bucket tool", "B"),
			COLORSWAP: createShortcut("tool-colorswap", "Magic bucket tool", "A"),
			ERASER: createShortcut("tool-eraser", "Eraser pen tool", "E"),
			STROKE: createShortcut("tool-stroke", "Stroke tool", "L"),
			RECTANGLE: createShortcut("tool-rectangle", "Rectangle tool", "R"),
			CIRCLE: createShortcut("tool-circle", "Circle tool", "C"),
			MOVE: createShortcut("tool-move", "Move tool", "M"),
			SHAPE_SELECT: createShortcut("tool-shape-select", "Shape selection", "Z"),
			RECTANGLE_SELECT: createShortcut("tool-rectangle-select", "Rectangle selection", "S"),
			LASSO_SELECT: createShortcut("tool-lasso-select", "Lasso selection", "H"),
			LIGHTEN: createShortcut("tool-lighten", "Lighten tool", "U"),
			DITHERING: createShortcut("tool-dithering", "Dithering tool", "T"),
			COLORPICKER: createShortcut("tool-colorpicker", "Color picker", "O")
		},
		SELECTION: {
			CUT: createShortcut("selection-cut", "Cut selection", "ctrl+X"),
			COPY: createShortcut("selection-copy", "Copy selection", "ctrl+C"),
			PASTE: createShortcut("selection-paste", "Paste selection", "ctrl+V"),
			DELETE: createShortcut("selection-delete", "Delete selection", ["DEL", "BACK"]),
			COMMIT: createShortcut("selection-commit", "Commit selection", ["ENTER"])
		},
		MISC: {
			RESET_ZOOM: createShortcut("reset-zoom", "Reset zoom level", "0"),
			INCREASE_ZOOM: createShortcut("increase-zoom", "Increase zoom level", "+"),
			DECREASE_ZOOM: createShortcut("decrease-zoom", "Decrease zoom level", "-"),
			INCREASE_PENSIZE: createShortcut("increase-pensize", "Increase pen size", "]"),
			DECREASE_PENSIZE: createShortcut("decrease-pensize", "Decrease pen size", "["),
			UNDO: createShortcut("undo", "Undo", "ctrl+Z"),
			REDO: createShortcut("redo", "Redo", ["ctrl+Y", "ctrl+shift+Z"]),
			PREVIOUS_FRAME: createShortcut("previous-frame", "Select previous frame", "up"),
			NEXT_FRAME: createShortcut("next-frame", "Select next frame", "down"),
			NEW_FRAME: createShortcut("new-frame", "Create new empty frame", "N"),
			DUPLICATE_FRAME: createShortcut("duplicate-frame", "Duplicate selected frame", "shift+N"),
			CHEATSHEET: createShortcut("cheatsheet", "Open the keyboard shortcut cheatsheet", ["?", "shift+?"]),
			X1_PREVIEW: createShortcut("x1-preview", "Select original size preview", "alt+1"),
			BEST_PREVIEW: createShortcut("best-preview", "Select best size preview", "alt+2"),
			FULL_PREVIEW: createShortcut("full-preview", "Select full size preview", "alt+3"),
			ONION_SKIN: createShortcut("onion-skin", "Toggle onion skin", "alt+O"),
			TOGGLE_GRID: createShortcut("toggle-grid", "Show/Hide grid", "alt+G"),
			LAYER_PREVIEW: createShortcut("layer-preview", "Toggle layer preview", "alt+L"),
			MERGE_ANIMATION: createShortcut("import-animation", "Open merge animation popup", "ctrl+shift+M"),
			CLOSE_POPUP: createShortcut("close-popup", "Close an opened popup", "ESC"),
			OFFSET_UP: createShortcut("move-up", "Move viewport up", "shift+up"),
			OFFSET_RIGHT: createShortcut("move-right", "Move viewport right", "shift+right"),
			OFFSET_DOWN: createShortcut("move-down", "Move viewport down", "shift+down"),
			OFFSET_LEFT: createShortcut("move-left", "Move viewport left", "shift+left")
		},
		STORAGE: {
			SAVE: createShortcut("save", "Save the current sprite", "ctrl+S"),
			OPEN: createShortcut("open", "(desktop) Open a .piskel file", "ctrl+O"),
			SAVE_AS: createShortcut("save-as", "(desktop) Save as new", "ctrl+shift+S")
		},
		COLOR: {
			SWAP: createShortcut("swap-colors", "Swap primary/secondary colors", "X"),
			RESET: createShortcut("reset-colors", "Reset default colors", "D"),
			CREATE_PALETTE: createShortcut("create-palette", "Open the palette creation popup", "alt+P"),
			PREVIOUS_COLOR: createShortcut("previous-color", "Select the previous color in the current palette", "<"),
			NEXT_COLOR: createShortcut("next-color", "Select the next color in the current palette", ">"),
			SELECT_COLOR: createShortcut("select-color", "Select a palette color in the current palette", "123456789".split(""), "1 to 9")
		},
		CATEGORIES: [
			"TOOL",
			"SELECTION",
			"MISC",
			"STORAGE",
			"COLOR"
		]
	};
	//#endregion
	//#region src/js/service/HistoryService.ts
	var _HistoryService;
	var HistoryService = class HistoryService {
		constructor(piskelController, shortcutService, deserializer, serializer) {
			this.piskelController = piskelController.getWrappedPiskelController();
			this.shortcutService = assertInitialized(shortcutService || app.shortcutService, "shortcutService");
			this.deserializer = deserializer || ArrayBufferDeserializer;
			this.serializer = serializer || ArrayBufferSerializer;
			this.stateQueue = [];
			this.currentIndex = -1;
			this.lastLoadState = -1;
		}
		init() {
			$.subscribe(Events.PISKEL_SAVE_STATE, this.onSaveStateEvent.bind(this));
			const shortcuts = Shortcuts;
			this.shortcutService.registerShortcut(shortcuts.MISC.UNDO, this.undo.bind(this));
			this.shortcutService.registerShortcut(shortcuts.MISC.REDO, this.redo.bind(this));
			this.saveState({ type: HistoryService.SNAPSHOT });
		}
		onSaveStateEvent(_evt, action) {
			this.saveState(action);
		}
		saveState(action) {
			this.stateQueue = this.stateQueue.slice(0, this.currentIndex + 1);
			this.currentIndex = this.currentIndex + 1;
			const state = {
				action,
				frameIndex: action.state ? action.state.frameIndex : this.piskelController.currentFrameIndex,
				layerIndex: action.state ? action.state.layerIndex : this.piskelController.currentLayerIndex,
				fps: this.piskelController.getFPS(),
				uuid: Uuid.generate()
			};
			const isSnapshot = action.type === HistoryService.SNAPSHOT;
			const isAtAutoSnapshotInterval = this.currentIndex % HistoryService.SNAPSHOT_PERIOD === 0;
			if (isSnapshot || isAtAutoSnapshotInterval) {
				const piskel = this.piskelController.getPiskel();
				state.piskel = this.serializer.serialize(piskel);
			}
			if (this.stateQueue.length > HistoryService.MAX_SAVED_STATES) {
				const firstSnapshotIndex = this.getNextSnapshotIndex_(1);
				this.stateQueue.splice(0, firstSnapshotIndex);
				this.currentIndex = this.currentIndex - firstSnapshotIndex;
			}
			this.stateQueue.push(state);
			$.publish(Events.HISTORY_STATE_SAVED);
		}
		getCurrentStateId() {
			const state = this.stateQueue[this.currentIndex];
			if (!state) return false;
			return state.uuid;
		}
		undo() {
			this.loadState(this.currentIndex - 1);
		}
		redo() {
			this.loadState(this.currentIndex + 1);
		}
		isLoadStateAllowed_(index) {
			const timeOk = Date.now() - this.lastLoadState > HistoryService.LOAD_STATE_INTERVAL;
			const indexInRange = index >= 0 && index < this.stateQueue.length;
			return timeOk && indexInRange;
		}
		getPreviousSnapshotIndex_(index) {
			while (this.stateQueue[index] && !this.stateQueue[index].piskel) index = index - 1;
			return index;
		}
		getNextSnapshotIndex_(index) {
			while (this.stateQueue[index] && !this.stateQueue[index].piskel) index = index + 1;
			return index;
		}
		loadState(index) {
			try {
				if (this.isLoadStateAllowed_(index)) {
					this.lastLoadState = Date.now();
					const snapshotIndex = this.getPreviousSnapshotIndex_(index);
					if (snapshotIndex < 0) throw "Could not find previous SNAPSHOT saved in history stateQueue";
					const serializedPiskel = assertInitialized(this.getSnapshotFromState_(snapshotIndex), "serializedPiskel");
					const onPiskelLoadedCb = this.onPiskelLoaded_.bind(this, index, snapshotIndex);
					this.deserializer.deserialize(serializedPiskel, onPiskelLoadedCb);
				}
			} catch (error) {
				console.error("[CRITICAL ERROR] : Unable to load a history state.");
				this.logError_(error);
				this.stateQueue = [];
				this.currentIndex = -1;
			}
		}
		logError_(error) {
			if (error instanceof Error) {
				console.error(error.message);
				console.error(error.stack);
			} else console.error(error);
		}
		getSnapshotFromState_(stateIndex) {
			const state = this.stateQueue[stateIndex];
			const piskelSnapshot = state.piskel;
			state.piskel = piskelSnapshot;
			return piskelSnapshot;
		}
		onPiskelLoaded_(index, snapshotIndex, piskel) {
			const originalSize = this.getPiskelSize_();
			piskel.setDescriptor(this.piskelController.getPiskel().getDescriptor());
			piskel.savePath = this.piskelController.getPiskel().savePath;
			this.piskelController.setPiskel(piskel);
			for (let i = snapshotIndex + 1; i <= index; i++) {
				const state = this.stateQueue[i];
				this.setupState(state);
				this.replayState(state);
			}
			const lastState = this.stateQueue[index + 1];
			if (lastState) this.setupState(lastState);
			this.currentIndex = index;
			$.publish(Events.PISKEL_RESET);
			$.publish(Events.HISTORY_STATE_LOADED);
			if (originalSize !== this.getPiskelSize_()) $.publish(Events.FRAME_SIZE_CHANGED);
		}
		getPiskelSize_() {
			return this.piskelController.getWidth() + "x" + this.piskelController.getHeight();
		}
		setupState(state) {
			this.piskelController.setCurrentFrameIndex(Number(state.frameIndex));
			this.piskelController.setCurrentLayerIndex(Number(state.layerIndex));
			this.piskelController.setFPS(state.fps);
		}
		replayState(state) {
			const action = state.action;
			const frame = this.piskelController.getLayerAt(Number(state.layerIndex)).getFrameAt(Number(state.frameIndex));
			assertInitialized(action.scope, "scope").replay(frame, action.replay);
		}
	};
	_HistoryService = HistoryService;
	_HistoryService.SNAPSHOT = "SNAPSHOT";
	_HistoryService.REPLAY = "REPLAY";
	_HistoryService.SNAPSHOT_PERIOD = 50;
	_HistoryService.LOAD_STATE_INTERVAL = 50;
	_HistoryService.MAX_SAVED_STATES = 500;
	//#endregion
	//#region src/js/bridge.ts
	window.pskl = {
		app,
		_releaseVersion: void 0,
		utils: {
			colorToInt,
			FrameUtils
		},
		model: {
			Frame,
			Layer,
			Piskel
		},
		service: { HistoryService }
	};
	//#endregion
	//#region src/js/controller/CanvasBackgroundController.ts
	var CanvasBackgroundController = class {
		constructor() {
			this.body = document.body;
		}
		init() {
			$.subscribe(Events.USER_SETTINGS_CHANGED, this.onUserSettingsChange_.bind(this));
			this.updateBackgroundClass_(UserSettings.get(UserSettings.CANVAS_BACKGROUND));
		}
		onUserSettingsChange_(_evt, settingName, settingValue) {
			if (settingName == UserSettings.CANVAS_BACKGROUND && typeof settingValue === "string") this.updateBackgroundClass_(settingValue);
		}
		updateBackgroundClass_(newClass) {
			const currentClass = this.body.dataset.currentBackgroundClass;
			if (currentClass) this.body.classList.remove(currentClass);
			this.body.classList.add(newClass);
			this.body.dataset.currentBackgroundClass = newClass;
		}
	};
	//#endregion
	//#region src/js/controller/CursorCoordinatesController.ts
	var CursorCoordinatesController = class {
		constructor(piskelController) {
			this.piskelController = piskelController;
			this.origin = null;
			this.coordinates = {
				x: -1,
				y: -1
			};
		}
		init() {
			this.coordinatesContainer = Dom.getElement(".cursor-coordinates");
			$.subscribe(Events.CURSOR_MOVED, this.onCursorMoved_.bind(this));
			$.subscribe(Events.DRAG_START, this.onDragStart_.bind(this));
			$.subscribe(Events.DRAG_END, this.onDragEnd_.bind(this));
			$.subscribe(Events.FRAME_SIZE_CHANGED, this.redraw.bind(this));
			$.subscribe(Events.ZOOM_CHANGED, this.redraw.bind(this));
			$.subscribe(Events.PISKEL_RESET, this.redraw.bind(this));
			this.redraw();
		}
		redraw() {
			let html = "";
			if (this.origin) html += this.origin.x + ":" + this.origin.y + " to ";
			const x = this.coordinates.x;
			const y = this.coordinates.y;
			if (this.piskelController.getCurrentFrame().containsPixel(x, y)) {
				html += x + ":" + y;
				if (this.origin) {
					const dX = Math.abs(x - this.origin.x) + 1;
					const dY = Math.abs(y - this.origin.y) + 1;
					html += " (" + dX + "x" + dY + ")";
				}
			}
			if (app.drawingController) {
				const zoom = app.drawingController.compositeRenderer.getZoom().toFixed(2);
				html += "<div class=\"drawing-zoom\">x" + zoom + "</div>";
			}
			assertInitialized(this.coordinatesContainer, "coordinatesContainer").innerHTML = this.getFrameSizeHTML_() + html + this.getCurrentFrameIndexHTML_();
		}
		getCurrentFrameIndexHTML_() {
			const currentFrameIndex = this.piskelController.getCurrentFrameIndex() + 1;
			const frameCount = this.piskelController.getFrameCount();
			return "<div class=\"frame-info\">" + currentFrameIndex + "/" + frameCount + "</div>";
		}
		getFrameSizeHTML_() {
			const w = this.piskelController.getWidth();
			const h = this.piskelController.getHeight();
			return "[" + w + "x" + h + "] ";
		}
		onCursorMoved_(_event, x, y) {
			this.coordinates = {
				x,
				y
			};
			this.redraw();
		}
		onDragStart_(_event, x, y) {
			this.origin = {
				x,
				y
			};
			this.redraw();
		}
		onDragEnd_() {
			this.origin = null;
			this.redraw();
		}
	};
	//#endregion
	//#region src/js/rendering/AbstractRenderer.ts
	var AbstractRenderer = class {};
	//#endregion
	//#region src/js/rendering/CompositeRenderer.ts
	var CompositeRenderer = class extends AbstractRenderer {
		constructor() {
			super();
			this.renderers = [];
		}
		add(renderer) {
			this.renderers.push(renderer);
			return this;
		}
		clear() {
			this.renderers.forEach(function(renderer) {
				renderer.clear();
			});
		}
		setZoom(zoom) {
			this.renderers.forEach(function(renderer) {
				renderer.setZoom(zoom);
			});
		}
		getZoom() {
			return this.getSampleRenderer_().getZoom();
		}
		setDisplaySize(w, h) {
			this.renderers.forEach(function(renderer) {
				renderer.setDisplaySize(w, h);
			});
		}
		getDisplaySize() {
			return this.getSampleRenderer_().getDisplaySize();
		}
		setOffset(x, y) {
			this.renderers.forEach(function(renderer) {
				renderer.setOffset(x, y);
			});
		}
		getOffset() {
			return this.getSampleRenderer_().getOffset();
		}
		setGridWidth(b) {
			this.renderers.forEach(function(renderer) {
				renderer.setGridWidth(b);
			});
		}
		getGridWidth() {
			return this.getSampleRenderer_().getGridWidth();
		}
		getSampleRenderer_() {
			if (this.renderers.length > 0) return this.renderers[0];
			else throw "Renderer manager is empty";
		}
	};
	//#endregion
	//#region src/js/rendering/frame/FrameRenderer.ts
	var FrameRenderer = class extends AbstractRenderer {
		constructor(container, renderingOptions, classList) {
			super();
			this.defaultRenderingOptions = {
				supportGridRendering: false,
				zoom: 1
			};
			const options = $.extend(true, {}, this.defaultRenderingOptions, renderingOptions);
			if (container === void 0) throw "Bad FrameRenderer initialization. <container> undefined.";
			if (isNaN(options.zoom)) throw "Bad FrameRenderer initialization. <zoom> not well defined.";
			this.container = container;
			this.zoom = options.zoom;
			this.offset = {
				x: 0,
				y: 0
			};
			this.margin = {
				x: 0,
				y: 0
			};
			this.supportGridRendering = options.supportGridRendering;
			this.classList = classList || [];
			this.classList.push("canvas");
			/**
			* Off dom canvas, will be used to draw the frame at 1:1 ratio
			* @type {HTMLElement}
			*/
			this.canvas = null;
			/**
			* Displayed canvas, scaled-up from the offdom canvas
			* @type {HTMLElement}
			*/
			this.displayCanvas = null;
			this.setDisplaySize(options.width, options.height);
			this.setGridWidth(this.getUserGridWidth_());
			this.setGridSpacing(this.getUserGridSpacing_());
			$.subscribe(Events.USER_SETTINGS_CHANGED, this.onUserSettingsChange_.bind(this));
		}
		render(frame) {
			if (frame) {
				this.clear();
				this.renderFrame_(frame);
			}
		}
		clear() {
			CanvasUtils.clear(this.canvas);
			CanvasUtils.clear(this.displayCanvas);
		}
		setZoom(zoom) {
			const minimumZoom = 1;
			const maximumZoom = Math.min(assertInitialized(this.displayWidth, "displayWidth"), assertInitialized(this.displayHeight, "displayHeight")) / 10;
			zoom = MathUtils.minmax(zoom, minimumZoom, maximumZoom);
			if (zoom == this.zoom) return;
			const displayWidth = assertInitialized(this.displayWidth, "displayWidth");
			const displayHeight = assertInitialized(this.displayHeight, "displayHeight");
			const centerX = this.offset.x + displayWidth / (2 * this.zoom);
			const centerY = this.offset.y + displayHeight / (2 * this.zoom);
			this.zoom = zoom;
			this.setOffset(centerX - displayWidth / (2 * this.zoom), centerY - displayHeight / (2 * this.zoom));
		}
		getZoom() {
			return this.zoom;
		}
		setDisplaySize(width, height) {
			this.displayWidth = width;
			this.displayHeight = height;
			if (this.displayCanvas) {
				assertInitialized(this.displayCanvas.parentNode, "parentNode").removeChild(this.displayCanvas);
				this.displayCanvas = null;
			}
			this.createDisplayCanvas_();
		}
		getDisplaySize() {
			return {
				height: assertInitialized(this.displayHeight, "displayHeight"),
				width: assertInitialized(this.displayWidth, "displayWidth")
			};
		}
		getOffset() {
			return {
				x: this.offset.x,
				y: this.offset.y
			};
		}
		setOffset(x, y) {
			const width = assertInitialized(app.piskelController, "piskelController").getWidth();
			const height = assertInitialized(app.piskelController, "piskelController").getHeight();
			const maxX = width - assertInitialized(this.displayWidth, "displayWidth") / this.zoom;
			x = MathUtils.minmax(x, 0, maxX);
			const maxY = height - assertInitialized(this.displayHeight, "displayHeight") / this.zoom;
			y = MathUtils.minmax(y, 0, maxY);
			this.offset.x = x;
			this.offset.y = y;
		}
		getGridColor() {
			return UserSettings.get(UserSettings.GRID_COLOR);
		}
		setGridWidth(value) {
			this.gridWidth_ = value;
		}
		setGridSpacing(value) {
			this.gridSpacing_ = value;
		}
		getGridWidth() {
			if (!this.supportGridRendering) return 0;
			return assertInitialized(this.gridWidth_, "gridWidth_");
		}
		getGridSpacing() {
			if (!this.supportGridRendering) return 0;
			return assertInitialized(this.gridSpacing_, "gridSpacing_");
		}
		/**
		* Compute a grid width value best suited to the current display context,
		* particularly for the current zoom level
		*/
		computeGridWidthForDisplay_() {
			const gridSpacing = this.getGridSpacing();
			if (this.zoom * gridSpacing < 6) return 0;
			let gridWidth = this.getGridWidth();
			while (gridWidth > 1 && this.zoom < 6 * gridWidth) gridWidth--;
			return gridWidth;
		}
		updateMargins_(frame) {
			const deltaX = assertInitialized(this.displayWidth, "displayWidth") - this.zoom * frame.getWidth();
			this.margin.x = Math.max(0, deltaX) / 2;
			const deltaY = assertInitialized(this.displayHeight, "displayHeight") - this.zoom * frame.getHeight();
			this.margin.y = Math.max(0, deltaY) / 2;
		}
		createDisplayCanvas_() {
			const height = assertInitialized(this.displayHeight, "displayHeight");
			const width = assertInitialized(this.displayWidth, "displayWidth");
			this.displayCanvas = CanvasUtils.createCanvas(width, height, this.classList);
			CanvasUtils.disableImageSmoothing(this.displayCanvas);
			this.container.appendChild(this.displayCanvas);
		}
		onUserSettingsChange_(_evt, settingName) {
			const settings = UserSettings;
			if (settingName == settings.GRID_WIDTH || settingName == settings.GRID_SPACING || settingName == settings.GRID_ENABLED) {
				this.setGridWidth(this.getUserGridWidth_());
				this.setGridSpacing(this.getUserGridSpacing_());
			}
		}
		getUserGridWidth_() {
			const gridEnabled = UserSettings.get(UserSettings.GRID_ENABLED);
			const width = UserSettings.get(UserSettings.GRID_WIDTH);
			return gridEnabled ? width : 0;
		}
		getUserGridSpacing_() {
			const gridEnabled = UserSettings.get(UserSettings.GRID_ENABLED);
			const spacing = UserSettings.get(UserSettings.GRID_SPACING);
			return gridEnabled ? spacing : 0;
		}
		/**
		* Transform a screen pixel-based coordinate (relative to the top-left corner of the rendered
		* frame) into a sprite coordinate in column and row.
		* @public
		*/
		getCoordinates(x, y) {
			const containerRect = this.container.getBoundingClientRect();
			x = x - containerRect.left;
			y = y - containerRect.top;
			x = x - this.margin.x;
			y = y - this.margin.y;
			const cellSize = this.zoom;
			x = x + this.offset.x * cellSize;
			y = y + this.offset.y * cellSize;
			return {
				x: Math.floor(x / cellSize),
				y: Math.floor(y / cellSize)
			};
		}
		reverseCoordinates(x, y) {
			const cellSize = this.zoom;
			x = x * cellSize;
			y = y * cellSize;
			x = x - this.offset.x * cellSize;
			y = y - this.offset.y * cellSize;
			x = x + this.margin.x;
			y = y + this.margin.y;
			const containerRect = this.container.getBoundingClientRect();
			x = x + containerRect.left;
			y = y + containerRect.top;
			return {
				x: x + cellSize / 2,
				y: y + cellSize / 2
			};
		}
		/**
		* @private
		*/
		renderFrame_(frame) {
			if (!this.canvas || frame.getWidth() != this.canvas.width || frame.getHeight() != this.canvas.height) this.canvas = CanvasUtils.createCanvas(frame.getWidth(), frame.getHeight());
			const w = this.canvas.width;
			const h = this.canvas.height;
			const z = this.zoom;
			FrameUtils.drawToCanvas(frame, this.canvas);
			this.updateMargins_(frame);
			const displayContext = Dom.getContext2d(assertInitialized(this.displayCanvas, "displayCanvas"));
			displayContext.save();
			const translateX = this.margin.x - this.offset.x * z;
			const translateY = this.margin.y - this.offset.y * z;
			if (translateX > 0 || translateY > 0) {
				displayContext.fillStyle = Constants.ZOOMED_OUT_BACKGROUND_COLOR;
				displayContext.fillRect(0, 0, assertInitialized(this.displayCanvas, "displayCanvas").width - 1, assertInitialized(this.displayCanvas, "displayCanvas").height - 1);
			}
			displayContext.translate(translateX, translateY);
			displayContext.scale(z, z);
			if (UserSettings.get("SEAMLESS_MODE")) displayContext.clearRect(-1 * w, -1 * h, 3 * w, 3 * h);
			else displayContext.clearRect(0, 0, w, h);
			if (UserSettings.get("SEAMLESS_MODE")) this.drawTiledFrames_(displayContext, this.canvas, w, h, 1);
			displayContext.drawImage(this.canvas, 0, 0);
			const gridWidth = this.computeGridWidthForDisplay_();
			const gridSpacing = this.getGridSpacing();
			if (gridWidth > 0) {
				const gridColor = this.getGridColor();
				displayContext.scale(1 / z, 1 / z);
				let drawOrClear;
				if (gridColor === Constants.TRANSPARENT_COLOR) drawOrClear = displayContext.clearRect.bind(displayContext);
				else {
					displayContext.fillStyle = gridColor;
					drawOrClear = displayContext.fillRect.bind(displayContext);
				}
				for (let i = 1; i < frame.getWidth(); i++) if (i % gridSpacing == 0) drawOrClear(i * z - gridWidth / 2, 0, gridWidth, h * z);
				for (let j = 1; j < frame.getHeight(); j++) if (j % gridSpacing == 0) drawOrClear(0, j * z - gridWidth / 2, w * z, gridWidth);
			}
			displayContext.restore();
		}
		/**
		* Draw repeatedly the provided image around the main drawing area. Used for seamless
		* drawing mode, to easily create seamless textures. A colored overlay is applied to
		* differentiate those additional frames from the main frame.
		*/
		drawTiledFrames_(context, image, w, h, z) {
			let opacity = UserSettings.get("SEAMLESS_OPACITY");
			opacity = MathUtils.minmax(opacity, 0, 1);
			context.fillStyle = "rgba(255, 255, 255, " + opacity + ")";
			[
				[0, -1],
				[0, 1],
				[-1, -1],
				[-1, 0],
				[-1, 1],
				[1, -1],
				[1, 0],
				[1, 1]
			].forEach(function(d) {
				context.drawImage(image, d[0] * w * z, d[1] * h * z);
				context.fillRect(d[0] * w * z, d[1] * h * z, w * z, h * z);
			});
		}
	};
	//#endregion
	//#region src/js/rendering/OnionSkinRenderer.ts
	var OnionSkinRenderer = class OnionSkinRenderer extends CompositeRenderer {
		constructor(renderer, piskelController) {
			super();
			this.piskelController = piskelController;
			this.renderer = renderer;
			this.add(this.renderer);
			this.hash = "";
		}
		static createInContainer(container, renderingOptions, piskelController) {
			return new OnionSkinRenderer(new FrameRenderer(container, renderingOptions, ["onion-skin-canvas"]), piskelController);
		}
		render() {
			const frames = this.getOnionFrames_();
			const hash = this.computeHash_(frames);
			if (this.hash != hash) {
				this.hash = hash;
				this.clear();
				if (frames.length > 0) {
					const mergedFrame = FrameUtils.merge(frames);
					this.renderer.render(mergedFrame);
				}
			}
		}
		getOnionFrames_() {
			const frames = [];
			const currentFrameIndex = this.piskelController.getCurrentFrameIndex();
			const layer = this.piskelController.getCurrentLayer();
			const previousIndex = currentFrameIndex - 1;
			const previousFrame = layer.getFrameAt(previousIndex);
			if (previousFrame) frames.push(previousFrame);
			const nextIndex = currentFrameIndex + 1;
			const nextFrame = layer.getFrameAt(nextIndex);
			if (nextFrame) frames.push(nextFrame);
			return frames;
		}
		computeHash_(frames) {
			const offset = this.getOffset();
			const size = this.getDisplaySize();
			const layers = this.piskelController.getLayers();
			return [
				this.getZoom(),
				this.getGridWidth(),
				offset.x,
				offset.y,
				size.width,
				size.height,
				frames.map(function(f) {
					return f.getHash();
				}).join("-"),
				layers.length
			].join("-");
		}
		/**
		* See @pskl.rendering.frame.CachedFrameRenderer
		* Same issue : FrameRenderer setDisplaySize destroys the canvas
		* @param {Number} width
		* @param {Number} height
		*/
		setDisplaySize(width, height) {
			const size = this.getDisplaySize();
			if (size.width !== width || size.height !== height) super.setDisplaySize(width, height);
		}
		flush() {
			this.hash = "";
		}
	};
	//#endregion
	//#region src/js/rendering/frame/CachedFrameRenderer.ts
	/**
	* FrameRenderer implementation that prevents unnecessary redraws.
	* @param {HtmlElement} container HtmlElement to use as parentNode of the Frame
	* @param {Object} renderingOptions
	* @param {Array} classList array of strings to use for css classes
	*/
	var CachedFrameRenderer = class extends FrameRenderer {
		constructor(container, renderingOptions, classList) {
			super(container, renderingOptions, classList);
			this.serializedFrame = "";
		}
		/**
		* Only call display size if provided values are different from current values.
		* FrameRenderer:setDisplaySize destroys the underlying canvas
		* If the canvas is destroyed, a rendering is mandatory.
		* (Alternatively we could find a way to force the rendering of the CachedFrameRenderer from the outside)
		* @param {Number} width
		* @param {Number} height
		*/
		setDisplaySize(width, height) {
			if (this.displayWidth !== width || this.displayHeight !== height) super.setDisplaySize(width, height);
		}
		render(frame) {
			const offset = this.getOffset();
			const size = this.getDisplaySize();
			const serializedFrame = [
				this.getZoom(),
				this.getGridWidth(),
				this.getGridSpacing(),
				this.getGridColor(),
				UserSettings.get("SEAMLESS_MODE"),
				UserSettings.get("SEAMLESS_OPACITY"),
				offset.x,
				offset.y,
				size.width,
				size.height,
				frame.getHash()
			].join("-");
			if (this.serializedFrame != serializedFrame) {
				this.serializedFrame = serializedFrame;
				super.render(frame);
			}
		}
	};
	//#endregion
	//#region src/js/utils/LayerUtils.ts
	var LayerUtils = {
		clone(layer) {
			const clonedFrames = layer.getFrames().map(function(frame) {
				return frame.clone();
			});
			return Layer.fromFrames(layer.getName() + " (clone)", clonedFrames);
		},
		mergeLayers(layerA, layerB) {
			const framesA = layerA.getFrames();
			const framesB = layerB.getFrames();
			const mergedFrames = [];
			framesA.forEach(function(frame, index) {
				const otherFrame = framesB[index];
				mergedFrames.push(FrameUtils.merge([otherFrame, frame]));
			});
			return Layer.fromFrames(layerA.getName(), mergedFrames);
		},
		getFrameHashAt(layers, index) {
			const hashBuffer = [];
			layers.forEach(function(l) {
				const frame = l.getFrameAt(index);
				hashBuffer.push(frame.getHash());
				hashBuffer.push(l.getOpacity());
				return frame;
			});
			return hashBuffer.join("-");
		},
		mergeFrameAt(layers, index) {
			if (layers.some(function(l) {
				return l.isTransparent();
			})) return LayerUtils.mergeTransparentFrameAt_(layers, index);
			else return LayerUtils.mergeOpaqueFrameAt_(layers, index);
		},
		mergeTransparentFrameAt_(layers, index) {
			const hash = LayerUtils.getFrameHashAt(layers, index);
			const width = layers[0].frames[0].getWidth();
			const height = layers[0].frames[0].getHeight();
			const renderFn = function() {
				return LayerUtils.flattenFrameAt(layers, index, true);
			};
			return new RenderedFrame(renderFn, width, height, hash);
		},
		mergeOpaqueFrameAt_(layers, index) {
			const hash = LayerUtils.getFrameHashAt(layers, index);
			const frames = layers.map(function(l) {
				return l.getFrameAt(index);
			});
			const mergedFrame = FrameUtils.merge(frames);
			mergedFrame.id = hash;
			mergedFrame.version = 0;
			return mergedFrame;
		},
		renderFrameAt(layer, index, preserveOpacity) {
			const opacity = preserveOpacity ? layer.getOpacity() : 1;
			const frame = layer.getFrameAt(index);
			return FrameUtils.toImage(frame, 1, opacity);
		},
		flattenFrameAt(layers, index, preserveOpacity) {
			const width = layers[0].getFrameAt(index).getWidth();
			const height = layers[0].getFrameAt(index).getHeight();
			const canvas = CanvasUtils.createCanvas(width, height);
			const context = Dom.getContext2d(canvas);
			layers.forEach(function(l) {
				const render = LayerUtils.renderFrameAt(l, index, preserveOpacity);
				context.drawImage(render, 0, 0, width, height, 0, 0, width, height);
			});
			return canvas;
		}
	};
	//#endregion
	//#region src/js/rendering/layer/LayersRenderer.ts
	var LayersRenderer = class extends CompositeRenderer {
		constructor(container, renderingOptions, piskelController) {
			super();
			this.piskelController = piskelController;
			this.belowRenderer = new FrameRenderer(container, renderingOptions, ["layers-canvas", "layers-below-canvas"]);
			this.aboveRenderer = new FrameRenderer(container, renderingOptions, ["layers-canvas", "layers-above-canvas"]);
			this.add(this.belowRenderer);
			this.add(this.aboveRenderer);
			this.serializedRendering = "";
			this.stylesheet_ = document.createElement("style");
			document.head.appendChild(this.stylesheet_);
			this.updateLayersCanvasOpacity_(UserSettings.get(UserSettings.LAYER_OPACITY));
			$.subscribe(Events.PISKEL_RESET, this.flush.bind(this));
			$.subscribe(Events.USER_SETTINGS_CHANGED, this.onUserSettingsChange_.bind(this));
		}
		render() {
			const offset = this.getOffset();
			const size = this.getDisplaySize();
			const layers = this.piskelController.getLayers();
			const frameIndex = this.piskelController.getCurrentFrameIndex();
			const layerIndex = this.piskelController.getCurrentLayerIndex();
			const belowLayers = layers.slice(0, layerIndex);
			const aboveLayers = layers.slice(layerIndex + 1, layers.length);
			const serializedRendering = [
				this.getZoom(),
				this.getGridWidth(),
				offset.x,
				offset.y,
				size.width,
				size.height,
				LayerUtils.getFrameHashAt(belowLayers, frameIndex),
				LayerUtils.getFrameHashAt(aboveLayers, frameIndex),
				layers.length
			].join("-");
			if (this.serializedRendering != serializedRendering) {
				this.serializedRendering = serializedRendering;
				this.clear();
				if (belowLayers.length > 0) {
					const belowFrame = LayerUtils.mergeFrameAt(belowLayers, frameIndex);
					this.belowRenderer.render(belowFrame);
				}
				if (aboveLayers.length > 0) {
					const aboveFrame = LayerUtils.mergeFrameAt(aboveLayers, frameIndex);
					this.aboveRenderer.render(aboveFrame);
				}
			}
		}
		/**
		* See @pskl.rendering.frame.CachedFrameRenderer
		* Same issue : FrameRenderer setDisplaySize destroys the canvas
		* @param {Number} width
		* @param {Number} height
		*/
		setDisplaySize(width, height) {
			const size = this.getDisplaySize();
			if (size.width !== width || size.height !== height) super.setDisplaySize(width, height);
		}
		onUserSettingsChange_(_evt, settingsName, settingsValue) {
			if (settingsName == UserSettings.LAYER_OPACITY && typeof settingsValue === "number") this.updateLayersCanvasOpacity_(settingsValue);
		}
		updateLayersCanvasOpacity_(opacity) {
			this.stylesheet_.innerHTML = ".layers-canvas { opacity : " + opacity + "}";
		}
		flush() {
			this.serializedRendering = "";
		}
	};
	//#endregion
	//#region src/js/controller/drawing/DragHandler.ts
	/**
	* Multiplier applied between the mouse movement and viewport movement
	* @type {Number}
	*/
	var MULTIPLIER = 2;
	/**
	* Dedicated handler to drag the drawing canvas using the mouse
	* Will store the initial coordinates as well as the status of the drag
	* @param {DrawingController} drawingController
	*/
	var DragHandler = class {
		constructor(drawingController) {
			this.drawingController = drawingController;
			this.isDragging_ = false;
			this.updateOrigin_(-1, -1);
		}
		/**
		* Initialize a drag session.
		* @param {Number} x : x coordinate of the mouse event that initiated the drag
		* @param {Number} y : y coordinate of the mouse event that initiated the drag
		*/
		startDrag(x, y) {
			const coords = this.drawingController.getSpriteCoordinates(x, y);
			this.updateOrigin_(coords.x, coords.y);
		}
		/**
		* Update the drag status
		* @param {Number} x : x coordinate of the mouse event that triggered the update
		* @param {Number} y : y coordinate of the mouse event that triggered the update
		*/
		updateDrag(x, y) {
			const currentOffset = this.drawingController.getOffset();
			const offset = this.calculateOffset_(x, y);
			if (currentOffset.y !== offset.y || currentOffset.x !== offset.x) {
				this.isDragging_ = true;
				this.drawingController.setOffset(offset.x, offset.y);
				const coords = this.drawingController.getSpriteCoordinates(x, y);
				this.updateOrigin_(coords.x, coords.y);
			}
		}
		/**
		* Stop the drag session
		*/
		stopDrag() {
			this.isDragging_ = false;
			this.origin = void 0;
		}
		/**
		* Will return true if the drag handler effectively MOVED the offset
		* during the current drag session
		*/
		isDragging() {
			return this.isDragging_;
		}
		calculateOffset_(x, y) {
			const coords = this.drawingController.getSpriteCoordinates(x, y);
			const currentOffset = this.drawingController.getOffset();
			return {
				x: currentOffset.x - MULTIPLIER * (coords.x - assertInitialized(this.origin, "origin").x),
				y: currentOffset.y - MULTIPLIER * (coords.y - assertInitialized(this.origin, "origin").y)
			};
		}
		updateOrigin_(x, y) {
			this.origin = this.origin || {
				x,
				y
			};
			this.origin.x = x;
			this.origin.y = y;
		}
	};
	//#endregion
	//#region src/js/controller/DrawingController.ts
	var computedLineheightForScrollEvents = parseFloat(getComputedStyle(document.documentElement).lineHeight) || 16;
	var DrawingController = class {
		constructor(piskelController, container) {
			/**
			* @public
			*/
			this.piskelController = piskelController;
			this.dragHandler = new DragHandler(this);
			/**
			* @public
			*/
			this.overlayFrame = Frame.createEmptyFromFrame(piskelController.getCurrentFrame());
			/**
			* @private
			*/
			this.container = container;
			const cfg = {
				zoom: this.calculateZoom_(),
				supportGridRendering: false,
				height: this.getContainerHeight_(),
				width: this.getContainerWidth_(),
				xOffset: 0,
				yOffset: 0
			};
			this.overlayRenderer = new CachedFrameRenderer(this.container, cfg, ["canvas-overlay"]);
			this.onionSkinRenderer = OnionSkinRenderer.createInContainer(this.container, cfg, piskelController);
			this.layersRenderer = new LayersRenderer(this.container, cfg, piskelController);
			cfg.supportGridRendering = true;
			this.renderer = new CachedFrameRenderer(this.container, cfg, ["drawing-canvas"]);
			this.compositeRenderer = new CompositeRenderer();
			this.compositeRenderer.add(this.overlayRenderer).add(this.renderer).add(this.layersRenderer).add(this.onionSkinRenderer);
			this.isClicked = false;
			this.previousMousemoveTime = 0;
			this.currentToolBehavior = null;
			this.resizeObserver = null;
		}
		init() {
			this.initMouseBehavior();
			$.subscribe(Events.TOOL_SELECTED, (_evt, toolBehavior) => {
				this.currentToolBehavior = toolBehavior;
				this.overlayFrame.clear();
			});
			$.subscribe(Events.USER_SETTINGS_CHANGED, this.onUserSettingsChange_.bind(this));
			$.subscribe(Events.FRAME_SIZE_CHANGED, this.onFrameSizeChange_.bind(this));
			const shortcuts = Shortcuts;
			assertInitialized(app.shortcutService, "shortcutService").registerShortcut(shortcuts.MISC.RESET_ZOOM, this.resetZoom_.bind(this));
			assertInitialized(app.shortcutService, "shortcutService").registerShortcut(shortcuts.MISC.INCREASE_ZOOM, this.updateZoom_.bind(this, 1));
			assertInitialized(app.shortcutService, "shortcutService").registerShortcut(shortcuts.MISC.DECREASE_ZOOM, this.updateZoom_.bind(this, -1));
			assertInitialized(app.shortcutService, "shortcutService").registerShortcut(shortcuts.MISC.OFFSET_UP, this.updateOffset_.bind(this, "up"));
			assertInitialized(app.shortcutService, "shortcutService").registerShortcut(shortcuts.MISC.OFFSET_RIGHT, this.updateOffset_.bind(this, "right"));
			assertInitialized(app.shortcutService, "shortcutService").registerShortcut(shortcuts.MISC.OFFSET_DOWN, this.updateOffset_.bind(this, "down"));
			assertInitialized(app.shortcutService, "shortcutService").registerShortcut(shortcuts.MISC.OFFSET_LEFT, this.updateOffset_.bind(this, "left"));
			window.setTimeout(() => {
				this.relayout_();
				this.resetZoom_();
			}, 100);
			this.resizeObserver = new ResizeObserver(() => {
				this.requestRelayout_();
			});
			const container = Dom.getElement("#main-wrapper");
			this.resizeObserver.observe(container);
		}
		initMouseBehavior() {
			this.container.addEventListener("mousedown", this.onMousedown_.bind(this));
			this.container.addEventListener("wheel", this.onMousewheel_.bind(this));
			window.addEventListener("mouseup", this.onMouseup_.bind(this));
			window.addEventListener("mousemove", this.onMousemove_.bind(this));
			window.addEventListener("keyup", this.onKeyup_.bind(this));
			window.addEventListener("touchstart", this.onTouchstart_.bind(this));
			window.addEventListener("touchmove", this.onTouchmove_.bind(this));
			window.addEventListener("touchend", this.onTouchend_.bind(this));
			document.body.addEventListener("contextmenu", this.onCanvasContextMenu_.bind(this));
		}
		requestRelayout_() {
			if (this.resizeTimer) window.clearInterval(this.resizeTimer);
			this.resizeTimer = window.setTimeout(this.relayout_.bind(this), 200);
		}
		relayout_() {
			const initialWidth = this.compositeRenderer.getDisplaySize().width;
			this.compositeRenderer.setDisplaySize(this.getContainerWidth_(), this.getContainerHeight_());
			const newZoom = this.compositeRenderer.getDisplaySize().width / initialWidth * this.compositeRenderer.getZoom();
			this.compositeRenderer.setZoom(newZoom);
			$.publish(Events.ZOOM_CHANGED);
		}
		/**
		* @private
		*/
		onUserSettingsChange_(_evt, settingsName) {
			if (settingsName == "SHOW_GRID") console.warn("DrawingController:onUserSettingsChange_ not implemented !");
			else if (settingsName == UserSettings.ONION_SKIN || settingsName == UserSettings.LAYER_PREVIEW) {
				this.onionSkinRenderer.clear();
				this.onionSkinRenderer.flush();
				this.layersRenderer.clear();
				this.layersRenderer.flush();
				this.render();
			}
		}
		onFrameSizeChange_() {
			this.compositeRenderer.setDisplaySize(this.getContainerWidth_(), this.getContainerHeight_());
			this.compositeRenderer.setZoom(this.calculateZoom_());
			this.compositeRenderer.setOffset(0, 0);
			$.publish(Events.ZOOM_CHANGED);
		}
		onTouchstart_(event) {
			this.onMousedown_(event);
		}
		onTouchmove_(event) {
			this.onMousemove_(event);
			event.preventDefault();
		}
		onTouchend_(event) {
			this.onMouseup_(event);
		}
		/**
		* @private
		*/
		onMousedown_(event) {
			$.publish(Events.MOUSE_EVENT, [event, this]);
			const frame = this.piskelController.getCurrentFrame();
			let coords = this.getSpriteCoordinates(event.clientX, event.clientY);
			if (event.changedTouches && event.changedTouches[0]) coords = this.getSpriteCoordinates(event.changedTouches[0].clientX, event.changedTouches[0].clientY);
			this.isClicked = true;
			if (event.button === Constants.MIDDLE_BUTTON) this.dragHandler.startDrag(event.clientX, event.clientY);
			else if (event.altKey && !assertInitialized(this.currentToolBehavior, "currentToolBehavior").supportsAlt()) {
				assertInitialized(this.currentToolBehavior, "currentToolBehavior").hideHighlightedPixel(this.overlayFrame);
				this.isPickingColor = true;
			} else {
				assertInitialized(this.currentToolBehavior, "currentToolBehavior").hideHighlightedPixel(this.overlayFrame);
				$.publish(Events.TOOL_PRESSED);
				assertInitialized(this.currentToolBehavior, "currentToolBehavior").applyToolAt(coords.x, coords.y, frame, this.overlayFrame, event);
			}
		}
		/**
		* @private
		*/
		onMousemove_(event) {
			this._clientX = event.clientX;
			this._clientY = event.clientY;
			if (event.changedTouches && event.changedTouches[0]) {
				this._clientX = event.changedTouches[0].clientX;
				this._clientY = event.changedTouches[0].clientY;
			}
			const currentTime = (/* @__PURE__ */ new Date()).getTime();
			if (currentTime - this.previousMousemoveTime > Constants.MOUSEMOVE_THROTTLING) {
				this.moveTool_(Number(this._clientX), Number(this._clientY), event);
				this.previousMousemoveTime = currentTime;
			}
		}
		/**
		* @private
		*/
		onKeyup_(event) {
			this.moveTool_(Number(this._clientX), Number(this._clientY), event);
		}
		moveTool_(x, y, event) {
			const coords = this.getSpriteCoordinates(x, y);
			const currentFrame = this.piskelController.getCurrentFrame();
			if (this.isClicked) if (assertInitialized(app.mouseStateService, "mouseStateService").isMiddleButtonPressed()) this.dragHandler.updateDrag(x, y);
			else if (this.isPickingColor) {} else {
				$.publish(Events.MOUSE_EVENT, [event, this]);
				assertInitialized(this.currentToolBehavior, "currentToolBehavior").moveToolAt(coords.x | 0, coords.y | 0, currentFrame, this.overlayFrame, event);
			}
			else assertInitialized(this.currentToolBehavior, "currentToolBehavior").moveUnactiveToolAt(coords.x, coords.y, currentFrame, this.overlayFrame, event);
			$.publish(Events.CURSOR_MOVED, [coords.x, coords.y]);
		}
		onMousewheel_(evt) {
			let delta;
			if (evt.deltaMode === 2) delta = -1 * evt.deltaY * window.innerHeight;
			else if (evt.deltaMode === 1) delta = -1 * evt.deltaY * computedLineheightForScrollEvents;
			else delta = -1 * evt.deltaY;
			delta = delta || 0;
			let modifier = delta / 120;
			if (UserAgent.isMac ? evt.metaKey : evt.ctrlKey) {
				modifier = modifier * 5;
				evt.preventDefault();
			}
			const coords = this.getSpriteCoordinates(evt.clientX, evt.clientY);
			this.updateZoom_(modifier, coords);
		}
		/**
		* Update the current viewport offset of 1 pixel in the provided direction.
		* Direction can be one of 'up', 'right', 'down', 'left'.
		* Callback for the OFFSET_${DIR} shortcuts.
		*/
		updateOffset_(direction) {
			const off = this.getOffset();
			if (direction === "up") off.y -= 1;
			else if (direction === "right") off.x += 1;
			else if (direction === "down") off.y += 1;
			else if (direction === "left") off.x -= 1;
			this.setOffset(off.x, off.y);
		}
		/**
		* Update the current zoom level by a given multiplier.
		*
		* @param {Number} zoomMultiplier: factor by which the zoom should be modified. Negative
		*        values will decrease the zoom, positive values will increase it.
		* @param {Object} centerCoords, optional:
		*        - {Number} x: x coordinate of the desired center the zoomed canvas
		*        - {Number} y: y coordinate of the desired center the zoomed canvas
		*/
		updateZoom_(zoomMultiplier, centerCoords) {
			if (zoomMultiplier === 0) return;
			const off = this.getOffset();
			const oldWidth = this.getContainerWidth_() / this.renderer.getZoom();
			const oldHeight = this.getContainerHeight_() / this.renderer.getZoom();
			const step = zoomMultiplier * this.getZoomStep_();
			this.setZoom_(this.renderer.getZoom() + step);
			if (typeof centerCoords === "object") {
				const xRatio = (centerCoords.x - off.x) / oldWidth;
				const yRatio = (centerCoords.y - off.y) / oldHeight;
				const newWidth = this.getContainerWidth_() / this.renderer.getZoom();
				const newHeight = this.getContainerHeight_() / this.renderer.getZoom();
				this.setOffset(off.x - (newWidth - oldWidth) * xRatio, off.y - (newHeight - oldHeight) * yRatio);
			}
		}
		/**
		* @private
		*/
		onMouseup_(event) {
			if (!this.isClicked) return;
			let coords = this.getSpriteCoordinates(event.clientX, event.clientY);
			if (event.changedTouches && event.changedTouches[0]) coords = this.getSpriteCoordinates(event.changedTouches[0].clientX, event.changedTouches[0].clientY);
			this.isClicked = false;
			const isMiddleButton = assertInitialized(app.mouseStateService, "mouseStateService").isMiddleButtonPressed();
			const isMiddleClick = isMiddleButton && !this.dragHandler.isDragging();
			const isMiddleDrag = isMiddleButton && this.dragHandler.isDragging();
			if (this.isPickingColor || isMiddleClick) {
				this.pickColorAt_(coords);
				this.isPickingColor = false;
				this.flashColorPicker_();
			} else if (isMiddleDrag) this.dragHandler.stopDrag();
			else {
				assertInitialized(this.currentToolBehavior, "currentToolBehavior").releaseToolAt(coords.x, coords.y, this.piskelController.getCurrentFrame(), this.overlayFrame, event);
				$.publish(Events.TOOL_RELEASED);
			}
			$.publish(Events.MOUSE_EVENT, [event, this]);
		}
		/**
		* Send a COLOR selection event for the color contained at the provided coordinates.
		* No-op if the coordinate is outside of the drawing canvas.
		* @param  {Object} coords {x: Number, y: Number}
		*/
		pickColorAt_(coords) {
			const frame = this.piskelController.getCurrentFrame();
			if (!frame.containsPixel(coords.x, coords.y)) return;
			const color = intToColor(frame.getPixel(coords.x, coords.y));
			const evt = assertInitialized(app.mouseStateService, "mouseStateService").isRightButtonPressed() ? Events.SELECT_SECONDARY_COLOR : Events.SELECT_PRIMARY_COLOR;
			$.publish(evt, [color]);
		}
		flashColorPicker_() {
			document.body.classList.add("tool-colorpicker");
			document.body.classList.remove(assertInitialized(assertInitialized(this.currentToolBehavior, "currentToolBehavior").toolId, "toolId"));
			window.clearTimeout(this.flashColorPickerTimer);
			this.flashColorPickerTimer = window.setTimeout(() => {
				document.body.classList.remove("tool-colorpicker");
				document.body.classList.add(assertInitialized(assertInitialized(this.currentToolBehavior, "currentToolBehavior").toolId, "toolId"));
			}, 200);
		}
		/**
		* Translate absolute x,y screen coordinates into sprite coordinates
		* @param  {Number} screenX
		* @param  {Number} screenY
		* @return {Object} {x:Number, y:Number}
		*/
		getSpriteCoordinates(screenX, screenY) {
			return this.renderer.getCoordinates(screenX, screenY);
		}
		getScreenCoordinates(spriteX, spriteY) {
			return this.renderer.reverseCoordinates(spriteX, spriteY);
		}
		/**
		* @private
		*/
		onCanvasContextMenu_(event) {
			if (event.target.closest && event.target.closest("#drawing-canvas-container")) {
				event.preventDefault();
				event.stopPropagation();
				event.cancelBubble = true;
				return false;
			}
		}
		render() {
			const currentFrame = this.piskelController.getCurrentFrame();
			if (!currentFrame.isSameSize(this.overlayFrame)) this.overlayFrame = Frame.createEmptyFromFrame(currentFrame);
			if (UserSettings.get(UserSettings.ONION_SKIN)) this.onionSkinRenderer.render();
			if (UserSettings.get(UserSettings.LAYER_PREVIEW)) this.layersRenderer.render();
			this.renderer.render(currentFrame);
			this.overlayRenderer.render(this.overlayFrame);
		}
		/**
		* @private
		*/
		calculateZoom_() {
			const frameHeight = this.piskelController.getCurrentFrame().getHeight();
			const frameWidth = this.piskelController.getCurrentFrame().getWidth();
			return Math.min(this.getAvailableWidth_() / frameWidth, this.getAvailableHeight_() / frameHeight);
		}
		getAvailableHeight_() {
			return Dom.getElement("#main-wrapper").getBoundingClientRect().height;
		}
		getSelectorWidth_(selector) {
			return Dom.getElement(selector).getBoundingClientRect().width;
		}
		getAvailableWidth_() {
			const leftSectionWidth = this.getSelectorWidth_(".left-column");
			const rightSectionWidth = this.getSelectorWidth_(".right-column");
			const toolsContainerWidth = this.getSelectorWidth_("#tool-section");
			const settingsContainerWidth = this.getSelectorWidth_("#application-action-section");
			const usedWidth = leftSectionWidth + rightSectionWidth + toolsContainerWidth + settingsContainerWidth;
			return this.getSelectorWidth_("#main-wrapper") - usedWidth - 10;
		}
		getContainerHeight_() {
			return this.getAvailableHeight_();
		}
		getContainerWidth_() {
			return this.getAvailableWidth_();
		}
		getRenderer() {
			return this.compositeRenderer;
		}
		getOffset() {
			return this.compositeRenderer.getOffset();
		}
		setOffset(x, y) {
			this.compositeRenderer.setOffset(x, y);
			$.publish(Events.ZOOM_CHANGED);
		}
		resetZoom_() {
			this.setZoom_(this.calculateZoom_());
		}
		getZoomStep_() {
			return Math.max(.1, this.renderer.getZoom() / 15);
		}
		setZoom_(zoom) {
			this.compositeRenderer.setZoom(zoom);
			$.publish(Events.ZOOM_CHANGED);
		}
	};
	//#endregion
	//#region src/js/model/frame/CachedFrameProcessor.ts
	var MAX_CACHE_ENTRIES = 100;
	var DEFAULT_NAMESPACE = "__cache_default__";
	var FrameCache = class {
		constructor() {
			this.cache_ = {};
			this.cacheQueue_ = [];
			this.defaultNamespace = DEFAULT_NAMESPACE;
		}
		clear() {
			this.cache_ = {};
		}
		/**
		* Set the cloner that will be called when there is a miss on the 1st level cache
		* but a hit on the 2nd level cache.
		* Function with 2 arguments : cached value, frame
		* @param {Function} outputCloner
		*/
		setOutputCloner(outputCloner) {
			this.outputCloner = outputCloner;
		}
	};
	var CachedFrameProcessor = class extends FrameCache {
		/**
		* Set the processor function that will be called when there is a cache miss
		* Function with 1 argument : pskl.model.Frame
		* @param {Function} frameProcessor
		*/
		setFrameProcessor(frameProcessor) {
			this.frameProcessor = frameProcessor;
		}
		/**
		* Retrieve the processed frame from the cache, in the (optional) namespace
		* If the first level cache is empty, attempt to clone it from 2nd level cache.
		* If second level cache is empty process the frame.
		* @param  {pskl.model.Frame} frame
		* @param  {String} namespace
		* @return {Object} the processed frame
		*/
		get(frame, namespace) {
			let processedFrame;
			const cacheNamespace = namespace || DEFAULT_NAMESPACE;
			if (!this.cache_[cacheNamespace]) this.cache_[cacheNamespace] = {};
			const cache = this.cache_[cacheNamespace];
			const cacheKey = frame.getHash();
			const cached = cache[cacheKey];
			if (cached) processedFrame = cached;
			else {
				processedFrame = assertInitialized(this.frameProcessor, "frameProcessor")(frame);
				cache[cacheKey] = processedFrame;
				this.cacheQueue_.unshift([cacheNamespace, cacheKey]);
				const oldestItem = this.cacheQueue_.length > MAX_CACHE_ENTRIES ? this.cacheQueue_.pop() : void 0;
				if (oldestItem !== void 0) this.cache_[oldestItem[0]][oldestItem[1]] = null;
			}
			return processedFrame;
		}
	};
	//#endregion
	//#region src/js/controller/FramesListController.ts
	var ACTION = {
		SELECT: "select",
		CLONE: "clone",
		DELETE: "delete",
		NEW_FRAME: "newframe",
		TOGGLE: "toggle"
	};
	var FramesListController = class {
		constructor(piskelController, container) {
			this.piskelController = piskelController;
			this.container = container;
			this.previewList = Dom.getElement("#preview-list", container);
			this.refreshZoom_();
			this.redrawFlag = true;
			this.regenerateDomFlag = true;
			this.justDropped = false;
			this.cachedFrameProcessor = new CachedFrameProcessor();
			this.cachedFrameProcessor.setFrameProcessor(this.frameToPreviewCanvas_.bind(this));
			this.cachedFrameProcessor.setOutputCloner(this.clonePreviewCanvas_.bind(this));
			this.initDragndropBehavior_();
		}
		init() {
			$.subscribe(Events.TOOL_RELEASED, this.flagForRedraw_.bind(this));
			$.subscribe(Events.PISKEL_RESET, () => this.flagForRedraw_(true));
			$.subscribe(Events.USER_SETTINGS_CHANGED, this.flagForRedraw_.bind(this));
			$.subscribe(Events.PISKEL_RESET, this.refreshZoom_.bind(this));
			this.previewListScroller = Dom.getElement("#preview-list-scroller");
			this.previewListScroller.addEventListener("scroll", this.updateScrollerOverflows.bind(this));
			this.container.addEventListener("click", this.onContainerClick_.bind(this));
			this.updateScrollerOverflows();
		}
		flagForRedraw_(regenerateDom) {
			this.redrawFlag = true;
			if (regenerateDom) this.regenerateDomFlag = true;
		}
		refreshZoom_() {
			this.zoom = this.calculateZoom_();
		}
		render() {
			if (this.redrawFlag) {
				if (this.regenerateDomFlag) {
					this.tiles = [];
					this.addFrameTile = null;
					this.createPreviews_();
					this.regenerateDomFlag = false;
				}
				this.updatePreviews_();
				this.redrawFlag = false;
			}
		}
		updateScrollerOverflows() {
			const scroller = assertInitialized(this.previewListScroller, "previewListScroller");
			const scrollerHeight = scroller.offsetHeight;
			const scrollTop = scroller.scrollTop;
			const scrollerContentHeight = this.previewList.offsetHeight;
			const treshold = Dom.getElement(".top-overflow", this.container).offsetHeight;
			let overflowTop = false;
			let overflowBottom = false;
			if (scrollerHeight < scrollerContentHeight) {
				if (scrollTop > treshold) overflowTop = true;
				if (scrollerContentHeight - scrollTop - scrollerHeight > treshold) overflowBottom = true;
			}
			this.container.classList.toggle("top-overflow-visible", overflowTop);
			this.container.classList.toggle("bottom-overflow-visible", overflowBottom);
		}
		onContainerClick_(event) {
			const target = Dom.getParentWithData(event.target, "tileAction");
			if (!target) return;
			const action = target.dataset.tileAction;
			const index = parseInt(String(target.dataset.tileNumber), 10);
			if (action === ACTION.CLONE) {
				this.piskelController.duplicateFrameAt(index);
				const clonedTile = this.createPreviewTile_(index + 1);
				this.previewList.insertBefore(clonedTile, assertInitialized(this.tiles, "tiles")[index].nextSibling);
				assertInitialized(this.tiles, "tiles").splice(index, 0, clonedTile);
				this.updateScrollerOverflows();
			} else if (action === ACTION.DELETE) {
				this.piskelController.removeFrameAt(index);
				this.previewList.removeChild(assertInitialized(this.tiles, "tiles")[index]);
				assertInitialized(this.tiles, "tiles").splice(index, 1);
				this.updateScrollerOverflows();
			} else if (action === ACTION.SELECT && !this.justDropped) this.piskelController.setCurrentFrameIndex(index);
			else if (action === ACTION.NEW_FRAME) {
				this.piskelController.addFrame();
				const newtile = this.createPreviewTile_(assertInitialized(this.tiles, "tiles").length);
				assertInitialized(this.tiles, "tiles").push(newtile);
				this.previewList.insertBefore(newtile, assertInitialized(this.addFrameTile, "addFrameTile"));
				this.updateScrollerOverflows();
			} else if (action == ACTION.TOGGLE) this.piskelController.toggleFrameVisibilityAt(index);
			this.flagForRedraw_();
		}
		updatePreviews_() {
			let i;
			let length;
			for (i = 0, length = assertInitialized(this.tiles, "tiles").length; i < length; i++) {
				assertInitialized(this.tiles, "tiles")[i].classList.remove("selected");
				Dom.getElement(".tile-count", assertInitialized(this.tiles, "tiles")[i]).classList.remove("toggled");
				assertInitialized(this.tiles, "tiles")[i].setAttribute("data-tile-number", String(i));
				Dom.getElement(".tile-count", assertInitialized(this.tiles, "tiles")[i]).innerHTML = String(i + 1);
				if (this.piskelController.hasVisibleFrameAt(i)) Dom.getElement(".tile-count", assertInitialized(this.tiles, "tiles")[i]).classList.add("toggled");
				const hash = this.piskelController.getCurrentLayer().getFrameAt(i).getHash();
				if (assertInitialized(this.tiles, "tiles")[i].getAttribute("data-tile-hash") !== hash) if (assertInitialized(this.tiles, "tiles")[i].querySelector("canvas")) Dom.getElement(".canvas-container", assertInitialized(this.tiles, "tiles")[i]).replaceChild(this.getCanvasForFrame(this.piskelController.getCurrentLayer().getFrameAt(i)), Dom.getElement("canvas", assertInitialized(this.tiles, "tiles")[i]));
				else Dom.getElement(".canvas-container", assertInitialized(this.tiles, "tiles")[i]).appendChild(this.getCanvasForFrame(this.piskelController.getCurrentLayer().getFrameAt(i)));
			}
			const buttons = this.container.querySelectorAll(".delete-frame-action, .dnd-action");
			const display = this.piskelController.getFrameCount() > 1 ? "block" : "none";
			for (i = 0, length = buttons.length; i < length; i++) buttons[i].style.display = display;
			assertInitialized(this.tiles, "tiles")[this.piskelController.getCurrentFrameIndex()].classList.add("selected");
		}
		createPreviews_() {
			this.previewList.innerHTML = "";
			const tooltips = document.querySelectorAll(".tooltip");
			Array.prototype.forEach.call(tooltips, function(tooltip) {
				tooltip.parentNode.removeChild(tooltip);
			});
			const frameCount = this.piskelController.getFrameCount();
			for (let i = 0; i < frameCount; i++) {
				const tile = this.createPreviewTile_(i);
				this.previewList.appendChild(tile);
				assertInitialized(this.tiles, "tiles")[i] = tile;
			}
			const newFrameButton = document.createElement("div");
			newFrameButton.id = "add-frame-action";
			newFrameButton.className = "add-frame-action";
			newFrameButton.setAttribute("data-tile-action", ACTION.NEW_FRAME);
			newFrameButton.setAttribute("data-test-id", "add-frame-button");
			newFrameButton.innerHTML = "<div class=\"add-frame-action-icon icon-frame-plus-white\"></div><div class=\"label\">Add new frame</div>";
			this.previewList.appendChild(newFrameButton);
			this.addFrameTile = newFrameButton;
			this.updateScrollerOverflows();
		}
		/**
		* @private
		*/
		initDragndropBehavior_() {
			$(this.previewList).sortable({
				placeholder: "preview-tile preview-tile-drop-proxy",
				update: this.onUpdate_.bind(this),
				stop: this.onSortableStop_.bind(this),
				items: ".preview-tile",
				axis: "y",
				tolerance: "pointer"
			});
			$(this.previewList).disableSelection();
		}
		/**
		* @private
		*/
		onUpdate_(_event, ui) {
			const movedItem = ui.item.get(0);
			const originFrameId = parseInt(String(movedItem.dataset.tileNumber), 10);
			const tiles = document.querySelectorAll(".preview-tile");
			const targetInsertionId = Array.prototype.indexOf.call(tiles, movedItem);
			this.piskelController.moveFrame(originFrameId, targetInsertionId);
			this.piskelController.setCurrentFrameIndex(targetInsertionId);
			const tile = assertInitialized(this.tiles, "tiles").splice(originFrameId, 1)[0];
			assertInitialized(this.tiles, "tiles").splice(targetInsertionId, 0, tile);
			this.flagForRedraw_();
		}
		/**
		* @private
		*/
		onSortableStop_() {
			this.justDropped = true;
			this.resizeTimer = window.setTimeout(() => {
				this.justDropped = false;
			}, 200);
		}
		/**
		* @private
		*/
		createPreviewTile_(tileNumber) {
			const currentFrame = this.piskelController.getCurrentLayer().getFrameAt(tileNumber);
			const previewTileRoot = document.createElement("li");
			previewTileRoot.setAttribute("data-tile-number", String(tileNumber));
			previewTileRoot.setAttribute("data-tile-hash", currentFrame.getHash());
			previewTileRoot.setAttribute("data-tile-action", ACTION.SELECT);
			previewTileRoot.classList.add("preview-tile");
			previewTileRoot.setAttribute("data-test-id", "frame-tile");
			if (this.piskelController.getCurrentFrame() == currentFrame) previewTileRoot.classList.add("selected");
			const canvasContainer = document.createElement("div");
			canvasContainer.classList.add("canvas-container", UserSettings.get(UserSettings.CANVAS_BACKGROUND));
			const height = assertInitialized(this.zoom, "zoom") * this.piskelController.getCurrentFrame().getHeight();
			const horizontalMargin = (Constants.PREVIEW_FILM_SIZE - height) / 2;
			canvasContainer.style.marginTop = horizontalMargin + "px";
			const width = assertInitialized(this.zoom, "zoom") * this.piskelController.getCurrentFrame().getWidth();
			const verticalMargin = (Constants.PREVIEW_FILM_SIZE - width) / 2;
			canvasContainer.style.marginLeft = verticalMargin + "px";
			canvasContainer.style.marginRight = verticalMargin + "px";
			const canvasBackground = document.createElement("div");
			canvasBackground.className = "canvas-background";
			canvasContainer.appendChild(canvasBackground);
			canvasContainer.appendChild(this.getCanvasForFrame(currentFrame));
			previewTileRoot.appendChild(canvasContainer);
			const cloneFrameButton = document.createElement("button");
			cloneFrameButton.setAttribute("rel", "tooltip");
			cloneFrameButton.setAttribute("data-placement", "right");
			cloneFrameButton.setAttribute("data-tile-number", String(tileNumber));
			cloneFrameButton.setAttribute("data-tile-action", ACTION.CLONE);
			cloneFrameButton.setAttribute("title", "Duplicate this frame");
			cloneFrameButton.className = "tile-overlay duplicate-frame-action icon-frame-duplicate-white";
			cloneFrameButton.setAttribute("data-test-id", "duplicate-frame-button");
			previewTileRoot.appendChild(cloneFrameButton);
			const deleteButton = document.createElement("button");
			deleteButton.setAttribute("rel", "tooltip");
			deleteButton.setAttribute("data-placement", "right");
			deleteButton.setAttribute("title", "Delete this frame");
			deleteButton.setAttribute("data-tile-number", String(tileNumber));
			deleteButton.setAttribute("data-tile-action", ACTION.DELETE);
			deleteButton.className = "tile-overlay delete-frame-action icon-frame-recyclebin-white";
			deleteButton.setAttribute("data-test-id", "delete-frame-button");
			previewTileRoot.appendChild(deleteButton);
			const dndHandle = document.createElement("div");
			dndHandle.className = "tile-overlay dnd-action icon-frame-dragndrop-white";
			previewTileRoot.appendChild(dndHandle);
			const tileCount = document.createElement("button");
			tileCount.setAttribute("rel", "tooltip");
			tileCount.setAttribute("title", "Toggle for preview");
			tileCount.setAttribute("data-tile-number", String(tileNumber));
			tileCount.setAttribute("data-tile-action", ACTION.TOGGLE);
			tileCount.className = "tile-overlay tile-count toggle-frame-action";
			tileCount.setAttribute("data-test-id", "toggle-frame-button");
			tileCount.innerHTML = String(tileNumber + 1);
			previewTileRoot.appendChild(tileCount);
			return previewTileRoot;
		}
		getCanvasForFrame(frame) {
			return this.cachedFrameProcessor.get(frame, this.zoom);
		}
		frameToPreviewCanvas_(frame) {
			const canvasRenderer = new CanvasRenderer(frame, assertInitialized(this.zoom, "zoom"));
			canvasRenderer.drawTransparentAs(Constants.TRANSPARENT_COLOR);
			const canvas = canvasRenderer.render();
			canvas.classList.add("tile-view", "canvas");
			return canvas;
		}
		clonePreviewCanvas_(canvas) {
			const clone = CanvasUtils.clone(canvas);
			clone.classList.add("tile-view", "canvas");
			return clone;
		}
		/**
		* Calculate the preview zoom depending on the piskel size
		*/
		calculateZoom_() {
			const frame = this.piskelController.getCurrentFrame();
			const frameSize = Math.max(frame.getHeight(), frame.getWidth());
			return Constants.PREVIEW_FILM_SIZE / frameSize;
		}
	};
	//#endregion
	//#region src/js/controller/HeaderController.ts
	/**
	* When embedded in piskelapp.com, the page adds a header containing the name of the currently edited sprite
	* This controller will keep the displayed name in sync with the actual piskel name
	*/
	var HeaderController = class {
		constructor(piskelController, savedStatusService) {
			this.piskelController = piskelController;
			this.savedStatusService = savedStatusService;
		}
		init() {
			this.piskelName_ = document.querySelector(".piskel-name");
			$.subscribe(Events.BEFORE_SAVING_PISKEL, this.onBeforeSavingPiskelEvent_.bind(this));
			$.subscribe(Events.AFTER_SAVING_PISKEL, this.onAfterSavingPiskelEvent_.bind(this));
			$.subscribe(Events.PISKEL_DESCRIPTOR_UPDATED, this.updateHeader_.bind(this));
			$.subscribe(Events.PISKEL_RESET, this.updateHeader_.bind(this));
			$.subscribe(Events.PISKEL_SAVED_STATUS_UPDATE, this.updateHeader_.bind(this));
			this.updateHeader_();
		}
		updateHeader_() {
			try {
				let name = this.piskelController.getPiskel().getDescriptor().name;
				if (this.savedStatusService.isDirty()) name = name + " *";
				if (this.piskelName_) this.piskelName_.textContent = name;
			} catch (e) {
				console.warn("Could not update header : " + (e instanceof Error ? e.message : String(e)));
			}
		}
		onBeforeSavingPiskelEvent_() {
			if (!this.piskelName_) return;
			this.piskelName_.classList.add("piskel-name-saving");
		}
		onAfterSavingPiskelEvent_() {
			if (!this.piskelName_) return;
			this.piskelName_.classList.remove("piskel-name-saving");
		}
	};
	//#endregion
	//#region src/js/utils/Template.ts
	var templates = {};
	var dummyElement;
	var Template = {
		get(templateId) {
			if (!templates[templateId]) {
				const template = document.getElementById(templateId);
				if (template) templates[templateId] = template.innerHTML;
				else console.error("Could not find template for id :", templateId);
			}
			return templates[templateId];
		},
		getAsHTML(templateId) {
			const template = Template.get(templateId);
			if (!template) return;
			return Template.createFromHTML(template);
		},
		createFromHTML(html) {
			const dummyEl = Template._getDummyEl();
			dummyEl.innerHTML = html;
			const element = dummyEl.children[0];
			dummyEl.innerHTML = "";
			return element;
		},
		replace(template, dict) {
			for (const key in dict) if (dict.hasOwnProperty(key)) {
				let value = dict[key];
				if (key.indexOf(":") !== -1) {
					if (value === true) value = key.split(":")[1];
					else if (value === false) value = "";
				}
				if (!/^!.*!$/.test(key)) value = Template.sanitize(value);
				template = template.replace(new RegExp("\\{\\{" + key + "\\}\\}", "g"), String(value));
			}
			return template;
		},
		getAndReplace(templateId, dict) {
			let result = "";
			const tpl = Template.get(templateId);
			if (tpl) result = Template.replace(tpl, dict);
			return result;
		},
		sanitize(string) {
			const dummyEl = Template._getDummyEl();
			dummyEl.textContent = string === null || string === void 0 ? null : String(string);
			const sanitizedString = dummyEl.innerHTML;
			dummyEl.innerHTML = "";
			return sanitizedString;
		},
		_getDummyEl() {
			if (!dummyElement) dummyElement = document.createElement("div");
			return dummyElement;
		}
	};
	//#endregion
	//#region src/js/utils/TooltipFormatter.ts
	var TooltipFormatter = {
		format(helpText, shortcut, descriptors) {
			const tpl = Template.get("tooltip-container-template");
			const shortcutText = shortcut ? "(" + shortcut.getDisplayKey() + ")" : "";
			return Template.replace(tpl, {
				helptext: helpText,
				shortcut: shortcutText,
				"!descriptors!": this.formatDescriptors_(descriptors)
			});
		},
		formatDescriptors_(descriptors) {
			return (descriptors || []).reduce((p, descriptor) => {
				return p += this.formatDescriptor_(descriptor);
			}, "");
		},
		formatDescriptor_(descriptor) {
			let tpl;
			if (descriptor.key) {
				tpl = Template.get("tooltip-modifier-descriptor-template");
				descriptor.key = descriptor.key.toUpperCase();
				if (UserAgent.isMac) {
					descriptor.key = descriptor.key.replace("CTRL", "CMD");
					descriptor.key = descriptor.key.replace("ALT", "OPTION");
				}
			} else tpl = Template.get("tooltip-simple-descriptor-template");
			return Template.replace(tpl, descriptor);
		}
	};
	//#endregion
	//#region src/js/controller/LayersListController.ts
	var LayersListController = class {
		constructor(piskelController) {
			this.piskelController = piskelController;
			this.layerPreviewShortcut = Shortcuts.MISC.LAYER_PREVIEW;
			this.startRenamingCurrentLayer_ = this.startRenamingCurrentLayer_.bind(this);
			this.onRenameInput_ = this.onRenameInput_.bind(this);
		}
		init() {
			this.isRenaming = false;
			this.layerItemTemplate_ = Template.get("layer-item-template");
			this.layerNameInputTemplate_ = Template.get("layer-name-input-template");
			this.rootEl = Dom.getElement(".layers-list-container");
			this.layersListEl = Dom.getElement(".layers-list");
			this.toggleLayerPreviewEl = Dom.getElement(".layers-toggle-preview");
			this.rootEl.addEventListener("click", this.onClick_.bind(this));
			this.toggleLayerPreviewEl.addEventListener("click", this.toggleLayerPreview_.bind(this));
			this.createButtonTooltips_();
			this.initToggleLayerPreview_();
			this.renderLayerList_();
			this.updateToggleLayerPreview_();
			$.subscribe(Events.PISKEL_RESET, this.renderLayerList_.bind(this));
			$.subscribe(Events.USER_SETTINGS_CHANGED, this.onUserSettingsChange_.bind(this));
		}
		renderLayerList_() {
			const scrollTop = assertInitialized(this.layersListEl, "layersListEl").scrollTop;
			assertInitialized(this.layersListEl, "layersListEl").innerHTML = "";
			this.piskelController.getLayers().forEach(this.addLayerItem.bind(this));
			this.updateButtonStatus_();
			assertInitialized(this.layersListEl, "layersListEl").scrollTop = scrollTop;
			const currentLayerEl = assertInitialized(this.layersListEl, "layersListEl").querySelector(".current-layer-item");
			if (currentLayerEl) currentLayerEl.scrollIntoView({ block: "nearest" });
		}
		createButtonTooltips_() {
			const addTooltip = TooltipFormatter.format("Create a layer", void 0, [{
				key: "shift",
				description: "Clone current layer"
			}]);
			Dom.getElement("[data-action=\"add\"]", this.rootEl).setAttribute("title", addTooltip);
			const moveDownTooltip = TooltipFormatter.format("Move layer down", void 0, [{
				key: "shift",
				description: "Move to the bottom"
			}]);
			Dom.getElement("[data-action=\"down\"]", this.rootEl).setAttribute("title", moveDownTooltip);
			const moveUpTooltip = TooltipFormatter.format("Move layer up", void 0, [{
				key: "shift",
				description: "Move to the top"
			}]);
			Dom.getElement("[data-action=\"up\"]", this.rootEl).setAttribute("title", moveUpTooltip);
		}
		initToggleLayerPreview_() {
			const descriptors = [{ description: "Opacity defined in PREFERENCES" }];
			const helpText = "Preview all layers";
			assertInitialized(app.shortcutService, "shortcutService").registerShortcut(this.layerPreviewShortcut, this.toggleLayerPreview_.bind(this));
			const tooltip = TooltipFormatter.format(helpText, this.layerPreviewShortcut, descriptors);
			assertInitialized(this.toggleLayerPreviewEl, "toggleLayerPreviewEl").setAttribute("title", tooltip);
		}
		updateButtonStatus_() {
			const layers = this.piskelController.getLayers();
			const index = this.piskelController.getCurrentLayerIndex();
			const isLast = index === 0;
			const isOnly = layers.length === 1;
			const isFirst = index === layers.length - 1;
			this.toggleButtonDisabledState_("up", isFirst);
			this.toggleButtonDisabledState_("down", isLast);
			this.toggleButtonDisabledState_("merge", isLast);
			this.toggleButtonDisabledState_("delete", isOnly);
		}
		toggleButtonDisabledState_(buttonAction, isDisabled) {
			const button = Dom.getElement(".layers-button[data-action=\"" + buttonAction + "\"]");
			if (isDisabled) {
				button.setAttribute("disabled", "disabled");
				button.blur();
			} else button.removeAttribute("disabled");
		}
		updateToggleLayerPreview_() {
			const enabledClassname = "layers-toggle-preview-enabled";
			if (UserSettings.get(UserSettings.LAYER_PREVIEW)) assertInitialized(this.toggleLayerPreviewEl, "toggleLayerPreviewEl").classList.add(enabledClassname);
			else assertInitialized(this.toggleLayerPreviewEl, "toggleLayerPreviewEl").classList.remove(enabledClassname);
		}
		onUserSettingsChange_(_evt, name) {
			if (name == UserSettings.LAYER_PREVIEW) this.updateToggleLayerPreview_();
		}
		addLayerItem(layer, index) {
			const isSelected = this.piskelController.getCurrentLayer() === layer;
			const isRenaming = isSelected && this.isRenaming;
			const layerItemHtml = Template.replace(assertInitialized(this.layerItemTemplate_, "layerItemTemplate_"), {
				layername: layer.getName(),
				layerindex: index,
				"isselected:current-layer-item": isSelected,
				opacity: layer.getOpacity()
			});
			const layerItem = Template.createFromHTML(layerItemHtml);
			assertInitialized(this.layersListEl, "layersListEl").insertBefore(layerItem, assertInitialized(this.layersListEl, "layersListEl").firstChild);
			if (layerItem.offsetWidth < layerItem.scrollWidth) {
				const layerNameEl = Dom.getElement(".layer-name", layerItem);
				layerNameEl.classList.add("overflowing-name");
				layerNameEl.setAttribute("title", layer.getName());
				layerNameEl.setAttribute("rel", "tooltip");
			}
			if (isSelected) {
				layerItem.removeEventListener("dblclick", this.startRenamingCurrentLayer_);
				layerItem.addEventListener("dblclick", this.startRenamingCurrentLayer_);
			}
			if (isRenaming) {
				const layerNameInputHtml = Template.replace(assertInitialized(this.layerNameInputTemplate_, "layerNameInputTemplate_"), { layername: layer.getName() });
				const layerNameInput = Template.createFromHTML(layerNameInputHtml);
				const layerNameEl = Dom.getElement(".layer-name", layerItem);
				layerItem.replaceChild(layerNameInput, layerNameEl);
				layerNameInput.removeEventListener("blur", this.onRenameInput_);
				layerNameInput.removeEventListener("keydown", this.onRenameInput_);
				layerNameInput.addEventListener("blur", this.onRenameInput_);
				layerNameInput.addEventListener("keydown", this.onRenameInput_);
				layerNameInput.focus();
				layerNameInput.select();
			}
			const opacity = layer.getOpacity();
			if (opacity == 1) Dom.getElement(".layer-item-opacity", layerItem).style.color = "#ffd700";
			else if (opacity == 0) Dom.getElement(".layer-item-opacity", layerItem).style.color = "#969696";
			else Dom.getElement(".layer-item-opacity", layerItem).style.color = "#ffffff";
		}
		onClick_(evt) {
			const el = evt.target || evt.srcElement;
			let index;
			if (el.classList.contains("layer-name")) {
				const currentIndex = this.piskelController.getCurrentLayerIndex();
				index = Dom.getData(el, "layerIndex");
				if (Number(index) != currentIndex) {
					Dom.getElement(".current-layer-item", assertInitialized(assertInitialized(el.parentElement, "parentElement").parentElement, "parentElement")).removeEventListener("dblclick", this.startRenamingCurrentLayer_);
					this.piskelController.setCurrentLayerIndex(parseInt(String(index), 10));
				}
			} else if (el.classList.contains("layer-item-opacity")) {
				index = Dom.getData(el, "layerIndex");
				const layerIndex = parseInt(String(index), 10);
				const layer = this.piskelController.getLayerAt(layerIndex);
				const opacity = window.prompt("Set layer opacity (value between 0 and 1)", String(layer.getOpacity()));
				this.piskelController.setLayerOpacityAt(layerIndex, opacity);
			} else {
				const containingButton = el.closest(".button");
				if (containingButton && containingButton.classList.contains("button")) this.onButtonClick_(containingButton, evt);
			}
		}
		startRenamingCurrentLayer_() {
			this.isRenaming = true;
			this.renderLayerList_();
		}
		onRenameInput_(evt) {
			const el = evt.target || evt.srcElement;
			const key = evt.key;
			if (key === "Enter") this.finishRenamingCurrentLayer_(el, el.value);
			else if (!key || key === "Escape") this.finishRenamingCurrentLayer_(el);
		}
		finishRenamingCurrentLayer_(input, newName) {
			if (newName) {
				const index = this.piskelController.getCurrentLayerIndex();
				this.piskelController.renameLayerAt(index, newName);
			}
			input.removeEventListener("blur", assertInitialized(this.onRenameInput_, "onRenameInput_"));
			input.removeEventListener("keydown", assertInitialized(this.onRenameInput_, "onRenameInput_"));
			this.isRenaming = false;
			this.renderLayerList_();
		}
		mergeDownCurrentLayer_() {
			const index = this.piskelController.getCurrentLayerIndex();
			this.piskelController.mergeDownLayerAt(index);
			this.renderLayerList_();
		}
		onButtonClick_(button, evt) {
			const action = button.getAttribute("data-action");
			if (action == "up") this.piskelController.moveLayerUp(evt.shiftKey);
			else if (action == "down") this.piskelController.moveLayerDown(evt.shiftKey);
			else if (action == "add") if (evt.shiftKey) this.piskelController.duplicateCurrentLayer();
			else this.piskelController.createLayer();
			else if (action == "delete") this.piskelController.removeCurrentLayer();
			else if (action == "merge") this.mergeDownCurrentLayer_();
			else if (action == "edit") this.startRenamingCurrentLayer_();
		}
		toggleLayerPreview_() {
			const currentValue = UserSettings.get(UserSettings.LAYER_PREVIEW);
			const currentLayerOpacity = UserSettings.get(UserSettings.LAYER_OPACITY);
			const showLayerPreview = !currentValue;
			UserSettings.set(UserSettings.LAYER_PREVIEW, showLayerPreview);
			if (showLayerPreview && currentLayerOpacity === 0) UserSettings.set(UserSettings.LAYER_OPACITY, Constants.DEFAULT.LAYER_OPACITY);
		}
	};
	//#endregion
	//#region src/js/controller/MinimapController.ts
	var MinimapController = class {
		constructor(piskelController, previewController, drawingController, container) {
			this.piskelController = piskelController;
			this.previewController = previewController;
			this.drawingController = drawingController;
			this.container = container;
			this.isClicked = false;
			this.isVisible = false;
		}
		init() {
			this.minimapEl = document.createElement("DIV");
			this.minimapEl.className = "minimap-crop-frame";
			this.minimapEl.style.display = "none";
			this.container.appendChild(this.minimapEl);
			this.container.addEventListener("mousedown", this.onMinimapMousedown_.bind(this));
			document.body.addEventListener("mousemove", this.onMinimapMousemove_.bind(this));
			document.body.addEventListener("mouseup", this.onMinimapMouseup_.bind(this));
			$.subscribe(Events.ZOOM_CHANGED, this.renderMinimap_.bind(this));
		}
		renderMinimap_() {
			const verticalRatio = this.getVerticalRatio_();
			const horizontalRatio = this.getHorizontalRatio_();
			if (verticalRatio > 1 || horizontalRatio > 1) this.displayMinimap_();
			else this.hideMinimap_();
		}
		displayMinimap_() {
			const minimapSize = this.getMinimapSize_();
			const previewSize = this.getPreviewSize_();
			const containerRect = this.container.getBoundingClientRect();
			const containerHeight = containerRect.height;
			const containerWidth = containerRect.width;
			const offset = this.drawingController.getRenderer().getOffset();
			const left = (containerWidth - Math.max(minimapSize.width, previewSize.width)) / 2 + offset.x * this.previewController.getZoom();
			const top = (containerHeight - Math.max(minimapSize.height, previewSize.height)) / 2 + offset.y * this.previewController.getZoom();
			assertInitialized(this.minimapEl, "minimapEl").style.display = "block";
			assertInitialized(this.minimapEl, "minimapEl").style.width = Math.min(minimapSize.width, containerWidth) + "px";
			assertInitialized(this.minimapEl, "minimapEl").style.height = Math.min(minimapSize.height, containerHeight) + "px";
			assertInitialized(this.minimapEl, "minimapEl").style.left = Math.max(0, left) + Constants.RIGHT_COLUMN_PADDING_LEFT + "px";
			assertInitialized(this.minimapEl, "minimapEl").style.top = Math.max(0, top) + "px";
			this.isVisible = true;
		}
		getMinimapSize_() {
			const ratio = this.drawingController.getRenderer().getZoom() / this.previewController.getZoom();
			const displaySize = this.drawingController.getRenderer().getDisplaySize();
			return {
				width: displaySize.width / ratio,
				height: displaySize.height / ratio
			};
		}
		getPreviewSize_() {
			const frame = this.piskelController.getCurrentFrame();
			return {
				width: frame.getWidth() * this.previewController.getZoom(),
				height: frame.getHeight() * this.previewController.getZoom()
			};
		}
		hideMinimap_() {
			assertInitialized(this.minimapEl, "minimapEl").style.display = "none";
			this.isVisible = false;
		}
		onMinimapMousemove_(evt) {
			if (this.isVisible && this.isClicked) {
				const coords = this.getCoordinatesCenteredAround_(evt.clientX, evt.clientY);
				this.drawingController.setOffset(coords.x, coords.y);
			}
		}
		onMinimapMousedown_() {
			this.isClicked = true;
		}
		onMinimapMouseup_() {
			this.isClicked = false;
		}
		getCoordinatesCenteredAround_(x, y) {
			const frameCoords = this.previewController.getCoordinates(x, y);
			const frameWidth = this.piskelController.getCurrentFrame().getWidth();
			const frameHeight = this.piskelController.getCurrentFrame().getHeight();
			const width = frameWidth / this.getHorizontalRatio_();
			const height = frameHeight / this.getVerticalRatio_();
			return {
				x: frameCoords.x - width / 2,
				y: frameCoords.y - height / 2
			};
		}
		getVerticalRatio_() {
			const drawingAreaZoom = this.drawingController.getRenderer().getZoom();
			return this.piskelController.getCurrentFrame().getHeight() * drawingAreaZoom / this.drawingController.getRenderer().getDisplaySize().height;
		}
		getHorizontalRatio_() {
			const drawingAreaZoom = this.drawingController.getRenderer().getZoom();
			return this.piskelController.getCurrentFrame().getWidth() * drawingAreaZoom / this.drawingController.getRenderer().getDisplaySize().width;
		}
	};
	//#endregion
	//#region src/js/controller/NotificationController.ts
	var NotificationController = class {
		/**
		* @public
		*/
		init() {
			$.subscribe(Events.SHOW_NOTIFICATION, this.displayMessage_.bind(this));
			$.subscribe(Events.HIDE_NOTIFICATION, this.removeMessage_.bind(this));
		}
		/**
		* @private
		*/
		displayMessage_(_evt, messageInfo) {
			this.removeMessage_();
			const message = document.createElement("div");
			message.id = "user-message";
			message.className = "user-message";
			message.innerHTML = messageInfo.content;
			message.innerHTML = message.innerHTML + "<div title=\"Close message\" class=\"close\">x</div>";
			document.body.appendChild(message);
			Dom.getElement(".close", message).addEventListener("click", this.removeMessage_.bind(this));
			if (messageInfo.hideDelay) window.setTimeout(this.removeMessage_.bind(this), messageInfo.hideDelay);
		}
		/**
		* @private
		*/
		removeMessage_() {
			const message = document.querySelector("#user-message");
			if (message) assertInitialized(message.parentNode, "parentNode").removeChild(message);
		}
	};
	//#endregion
	//#region src/js/controller/PaletteController.ts
	/**
	* The PaletteController is responsible for handling the two color picker
	* widgets found in the left column, below the tools.
	*/
	var PaletteController = class {
		/**
		* @public
		*/
		init() {
			$.subscribe(Events.SELECT_PRIMARY_COLOR, this.onColorSelected_.bind(this, { isPrimary: true }));
			$.subscribe(Events.SELECT_SECONDARY_COLOR, this.onColorSelected_.bind(this, { isPrimary: false }));
			const shortcuts = Shortcuts;
			assertInitialized(app.shortcutService, "shortcutService").registerShortcut(shortcuts.COLOR.SWAP, this.swapColors.bind(this));
			assertInitialized(app.shortcutService, "shortcutService").registerShortcut(shortcuts.COLOR.RESET, this.resetColors.bind(this));
			const spectrumCfg = {
				showPalette: true,
				showButtons: false,
				showInput: true,
				palette: [["rgba(0,0,0,0)"]],
				clickoutFiresChange: true,
				getDisplayFormat: function() {
					return UserSettings.get(UserSettings.COLOR_FORMAT);
				},
				beforeShow: function(tinycolor) {
					tinycolor.setAlpha(1);
				}
			};
			const colorPicker = $("#color-picker");
			colorPicker.spectrum($.extend({ color: Constants.DEFAULT_PEN_COLOR }, spectrumCfg));
			colorPicker.change({ isPrimary: true }, this.onPickerChange_.bind(this));
			this.setTitleOnPicker_(Constants.DEFAULT_PEN_COLOR, colorPicker.get(0));
			const secondaryColorPicker = $("#secondary-color-picker");
			secondaryColorPicker.spectrum($.extend({ color: Constants.TRANSPARENT_COLOR }, spectrumCfg));
			secondaryColorPicker.change({ isPrimary: false }, this.onPickerChange_.bind(this));
			this.setTitleOnPicker_(Constants.TRANSPARENT_COLOR, secondaryColorPicker.get(0));
			Dom.getElement(".swap-colors-button").addEventListener("click", this.swapColors.bind(this));
		}
		/**
		* @private
		*/
		onPickerChange_(evt) {
			let color = evt.target.value;
			if (color != Constants.TRANSPARENT_COLOR) color = window.tinycolor(color).toHexString();
			if (assertInitialized(evt.data, "data").isPrimary) this.setPrimaryColor_(color);
			else this.setSecondaryColor_(color);
		}
		/**
		* @private
		*/
		onColorSelected_(args, _evt, color) {
			if (args.isPrimary) this.setPrimaryColor_(color);
			else this.setSecondaryColor_(color);
		}
		setPrimaryColor_(color) {
			this.updateColorPicker_(color, Dom.getElement("#color-picker"));
			$.publish(Events.PRIMARY_COLOR_SELECTED, [color]);
		}
		setSecondaryColor_(color) {
			this.updateColorPicker_(color, Dom.getElement("#secondary-color-picker"));
			$.publish(Events.SECONDARY_COLOR_SELECTED, [color]);
		}
		swapColors() {
			const primaryColor = assertInitialized(app.selectedColorsService, "selectedColorsService").getPrimaryColor();
			this.setPrimaryColor_(assertInitialized(app.selectedColorsService, "selectedColorsService").getSecondaryColor());
			this.setSecondaryColor_(primaryColor);
		}
		resetColors() {
			this.setPrimaryColor_(Constants.DEFAULT_PEN_COLOR);
			this.setSecondaryColor_(Constants.TRANSPARENT_COLOR);
		}
		/**
		* @private
		*/
		updateColorPicker_(color, colorPicker) {
			const jqueryColorPicker = $(colorPicker);
			if (color == Constants.TRANSPARENT_COLOR) {
				jqueryColorPicker.spectrum("set", Constants.TRANSPARENT_COLOR);
				colorPicker.value = Constants.TRANSPARENT_COLOR;
			} else jqueryColorPicker.spectrum("set", color);
			this.setTitleOnPicker_(color, colorPicker);
		}
		setTitleOnPicker_(title, colorPicker) {
			const parent = assertInitialized(colorPicker.parentElement, "parentElement");
			title = parent.dataset.initialTitle + "<br/>" + title;
			parent.dataset.originalTitle = title;
		}
	};
	//#endregion
	//#region src/js/controller/PalettesListController.ts
	var PRIMARY_COLOR_CLASSNAME = "palettes-list-primary-color";
	var SECONDARY_COLOR_CLASSNAME = "palettes-list-secondary-color";
	var PalettesListController = class {
		constructor(usedColorService) {
			this.usedColorService = usedColorService;
			this.paletteService = app.paletteService;
		}
		init() {
			this.paletteColorTemplate_ = Template.get("palette-color-template");
			this.colorListContainer_ = Dom.getElement(".palettes-list-colors");
			this.colorPaletteSelect_ = Dom.getElement(".palettes-list-select");
			const createPaletteButton_ = Dom.getElement(".create-palette-button");
			const editPaletteButton_ = Dom.getElement(".edit-palette-button");
			assertInitialized(this.colorPaletteSelect_, "colorPaletteSelect_").addEventListener("change", this.onPaletteSelected_.bind(this));
			this.colorListContainer_.addEventListener("mouseup", this.onColorContainerMouseup.bind(this));
			this.colorListContainer_.addEventListener("contextmenu", this.onColorContainerContextMenu.bind(this));
			createPaletteButton_.addEventListener("click", this.onCreatePaletteClick_.bind(this));
			editPaletteButton_.addEventListener("click", this.onEditPaletteClick_.bind(this));
			$.subscribe(Events.PALETTE_LIST_UPDATED, this.onPaletteListUpdated.bind(this));
			$.subscribe(Events.CURRENT_COLORS_UPDATED, this.fillColorListContainer.bind(this));
			$.subscribe(Events.PRIMARY_COLOR_SELECTED, this.highlightSelectedColors.bind(this));
			$.subscribe(Events.SECONDARY_COLOR_SELECTED, this.highlightSelectedColors.bind(this));
			$.subscribe(Events.USER_SETTINGS_CHANGED, this.onUserSettingsChange_.bind(this));
			const shortcuts = Shortcuts;
			assertInitialized(app.shortcutService, "shortcutService").registerShortcut(shortcuts.COLOR.PREVIOUS_COLOR, this.selectPreviousColor_.bind(this));
			assertInitialized(app.shortcutService, "shortcutService").registerShortcut(shortcuts.COLOR.NEXT_COLOR, this.selectNextColor_.bind(this));
			assertInitialized(app.shortcutService, "shortcutService").registerShortcut(shortcuts.COLOR.SELECT_COLOR, this.selectColorForKey_.bind(this));
			this.fillPaletteList();
			this.updateFromUserSettings();
			this.fillColorListContainer();
		}
		fillPaletteList() {
			const html = assertInitialized(this.paletteService, "paletteService").getPalettes().map(function(palette) {
				return Template.replace("<option value=\"{{id}}\">{{name}}</option>", {
					id: palette.id,
					name: palette.name
				});
			}).join("");
			assertInitialized(this.colorPaletteSelect_, "colorPaletteSelect_").innerHTML = html;
		}
		fillColorListContainer() {
			const colors = this.getSelectedPaletteColors_();
			if (colors.length > 0) {
				const html = colors.filter(function(color) {
					return !!color;
				}).map((color, index) => {
					return Template.replace(assertInitialized(this.paletteColorTemplate_, "paletteColorTemplate_"), {
						color,
						index: index + 1,
						title: color.toUpperCase()
					});
				}).join("");
				assertInitialized(this.colorListContainer_, "colorListContainer_").innerHTML = html;
				this.highlightSelectedColors();
			} else assertInitialized(this.colorListContainer_, "colorListContainer_").innerHTML = Template.get("palettes-list-no-colors-partial");
			assertInitialized(this.colorListContainer_, "colorListContainer_").classList.toggle("tiny", colors.length > 10);
		}
		selectPalette(paletteId) {
			UserSettings.set(UserSettings.SELECTED_PALETTE, paletteId);
		}
		getSelectedPaletteColors_() {
			let colors = [];
			const palette = this.getSelectedPalette_();
			if (palette) colors = palette.getColors();
			if (colors.length > Constants.MAX_PALETTE_COLORS) colors = colors.slice(0, Constants.MAX_PALETTE_COLORS);
			return colors;
		}
		getSelectedPalette_() {
			const paletteId = UserSettings.get(UserSettings.SELECTED_PALETTE);
			return assertInitialized(this.paletteService, "paletteService").getPaletteById(paletteId);
		}
		selectNextColor_() {
			this.selectColor_(this.getCurrentColorIndex_() + 1);
		}
		selectPreviousColor_() {
			this.selectColor_(this.getCurrentColorIndex_() - 1);
		}
		getCurrentColorIndex_() {
			let currentIndex = 0;
			const selectedColor = document.querySelector("." + PRIMARY_COLOR_CLASSNAME);
			if (selectedColor) currentIndex = parseInt(String(selectedColor.dataset.colorIndex), 10) - 1;
			return currentIndex;
		}
		selectColorForKey_(key) {
			let index = parseInt(key, 10);
			index = (index + 9) % 10;
			this.selectColor_(index);
		}
		selectColor_(index) {
			const color = this.getSelectedPaletteColors_()[index];
			if (color) $.publish(Events.SELECT_PRIMARY_COLOR, [color]);
		}
		onUserSettingsChange_(_evt, name) {
			if (name == UserSettings.SELECTED_PALETTE) this.updateFromUserSettings();
		}
		updateFromUserSettings() {
			const paletteId = UserSettings.get(UserSettings.SELECTED_PALETTE);
			this.fillColorListContainer();
			assertInitialized(this.colorPaletteSelect_, "colorPaletteSelect_").value = paletteId;
		}
		onPaletteSelected_() {
			const paletteId = assertInitialized(this.colorPaletteSelect_, "colorPaletteSelect_").value;
			this.selectPalette(paletteId);
			assertInitialized(this.colorPaletteSelect_, "colorPaletteSelect_").blur();
		}
		onCreatePaletteClick_() {
			$.publish(Events.DIALOG_SHOW, { dialogId: "create-palette" });
		}
		onEditPaletteClick_() {
			const paletteId = assertInitialized(this.colorPaletteSelect_, "colorPaletteSelect_").value;
			$.publish(Events.DIALOG_SHOW, {
				dialogId: "create-palette",
				initArgs: paletteId
			});
		}
		onColorContainerContextMenu(event) {
			event.preventDefault();
		}
		onColorContainerMouseup(event) {
			const color = event.target.dataset.color;
			if (color) {
				if (event.button == Constants.LEFT_BUTTON) $.publish(Events.SELECT_PRIMARY_COLOR, [color]);
				else if (event.button == Constants.RIGHT_BUTTON) $.publish(Events.SELECT_SECONDARY_COLOR, [color]);
			}
		}
		highlightSelectedColors() {
			this.removeClass_(PRIMARY_COLOR_CLASSNAME);
			this.removeClass_(SECONDARY_COLOR_CLASSNAME);
			let colorContainer = this.getColorContainer_(assertInitialized(app.selectedColorsService, "selectedColorsService").getSecondaryColor());
			if (colorContainer) {
				colorContainer.classList.remove(PRIMARY_COLOR_CLASSNAME);
				colorContainer.classList.add(SECONDARY_COLOR_CLASSNAME);
			}
			colorContainer = this.getColorContainer_(assertInitialized(app.selectedColorsService, "selectedColorsService").getPrimaryColor());
			if (colorContainer) {
				colorContainer.classList.remove(SECONDARY_COLOR_CLASSNAME);
				colorContainer.classList.add(PRIMARY_COLOR_CLASSNAME);
			}
		}
		getColorContainer_(color) {
			return assertInitialized(this.colorListContainer_, "colorListContainer_").querySelector(".palettes-list-color[data-color=\"" + color + "\"]");
		}
		removeClass_(cssClass) {
			const element = document.querySelector("." + cssClass);
			if (element) element.classList.remove(cssClass);
		}
		onPaletteListUpdated() {
			this.fillPaletteList();
			this.updateFromUserSettings();
		}
	};
	//#endregion
	//#region src/js/utils/Event.ts
	var scopes = /* @__PURE__ */ new WeakMap();
	var EventUtils = {
		addEventListener(el, type, callback, scope, args) {
			const target = typeof el === "string" ? document.querySelector(el) : el;
			if (target === null) throw new Error("Missing element: " + el);
			const listener = {
				el: target,
				type,
				callback,
				handler: function(event) {
					Reflect.apply(callback, scope, args ? [args, event] : [event]);
				}
			};
			const listeners = scopes.get(scope) || [];
			scopes.set(scope, listeners);
			listeners.push(listener);
			target.addEventListener(type, listener.handler);
		},
		removeEventListener(el, type, callback, scope) {
			const listeners = scope && scopes.get(scope);
			if (listeners) for (let i = 0; i < listeners.length; i++) {
				const listener = listeners[i];
				if (listener.callback === callback && listener.el === el && listener.type === type) {
					el.removeEventListener(type, listeners[i].handler);
					listeners.splice(i, 1);
					break;
				}
			}
		},
		removeAllEventListeners(scope) {
			const listeners = scope && scopes.get(scope);
			if (listeners) {
				for (let i = 0; i < listeners.length; i++) {
					const listener = listeners[i];
					listener.el.removeEventListener(listener.type, listener.handler);
				}
				scopes.set(scope, []);
			}
		}
	};
	//#endregion
	//#region src/js/widgets/SizePicker.ts
	var SizePicker = class {
		constructor(onChange) {
			this.onChange = onChange;
		}
		init(container) {
			this.container = container;
			EventUtils.addEventListener(this.container, "click", this.onSizeOptionClick_, this);
		}
		destroy() {
			EventUtils.removeAllEventListeners(this);
		}
		getSize() {
			const selectedOption = assertInitialized(this.container, "container").querySelector(".selected");
			return selectedOption ? selectedOption.dataset.size : null;
		}
		setSize(size) {
			if (this.getSize() === size) return;
			Dom.removeClass("labeled", this.container);
			Dom.removeClass("selected", this.container);
			let selectedOption;
			selectedOption = assertInitialized(this.container, "container").querySelector("[data-size=\"" + size + "\"]");
			if (!selectedOption) {
				selectedOption = Dom.getElement("[data-size]:last-child", assertInitialized(this.container, "container"));
				selectedOption.classList.add("labeled");
				selectedOption.setAttribute("real-size", String(size));
			}
			if (selectedOption) selectedOption.classList.add("selected");
		}
		onSizeOptionClick_(e) {
			const size = e.target.dataset.size;
			if (size !== void 0 && !isNaN(Number(size))) {
				const parsedSize = parseInt(size, 10);
				this.onChange(parsedSize);
				this.setSize(parsedSize);
			}
		}
	};
	//#endregion
	//#region src/js/controller/PenSizeController.ts
	var PenSizeController = class {
		constructor() {
			this.sizePicker = new SizePicker(this.onSizePickerChanged_.bind(this));
		}
		init() {
			this.sizePicker.init(Dom.getElement(".pen-size-container"));
			$.subscribe(Events.PEN_SIZE_CHANGED, this.onPenSizeChanged_.bind(this));
			this.updateSelectedOption_();
		}
		onSizePickerChanged_(size) {
			assertInitialized(app.penSizeService, "penSizeService").setPenSize(size);
		}
		onPenSizeChanged_() {
			this.updateSelectedOption_();
		}
		updateSelectedOption_() {
			const size = assertInitialized(app.penSizeService, "penSizeService").getPenSize();
			this.sizePicker.setSize(size);
		}
	};
	//#endregion
	//#region src/js/controller/ProgressBarController.ts
	var ProgressBarController = class {
		constructor() {
			this.template = Template.get("progress-bar-template");
			this.progressBar = null;
			this.progressBarStatus = null;
			this.showProgressTimer_ = 0;
		}
		init() {
			$.subscribe(Events.SHOW_PROGRESS, this.showProgress_.bind(this));
			$.subscribe(Events.UPDATE_PROGRESS, this.updateProgress_.bind(this));
			$.subscribe(Events.HIDE_PROGRESS, this.hideProgress_.bind(this));
		}
		showProgress_(_event, progressInfo) {
			this.removeProgressBar_();
			this.showProgressTimer_ = window.setTimeout(this.onTimerExpired_.bind(this, progressInfo), 300);
		}
		onTimerExpired_(progressInfo) {
			const progressBarHtml = Template.replace(this.template, {
				name: progressInfo.name,
				status: 0
			});
			const progressBarEl = Template.createFromHTML(progressBarHtml);
			document.body.appendChild(progressBarEl);
			this.progressBar = document.querySelector(".progress-bar");
			this.progressBarStatus = Dom.getElement(".progress-bar-status");
		}
		updateProgress_(_event, progressInfo) {
			if (this.progressBar && this.progressBarStatus) {
				const progress = progressInfo.progress;
				const width = this.progressBar.offsetWidth;
				const progressWidth = width - Number(progress) * width / 100;
				this.progressBar.style.backgroundPosition = -progressWidth + "px 0";
				this.progressBarStatus.innerHTML = progress + "%";
			}
		}
		hideProgress_() {
			if (this.showProgressTimer_) window.clearTimeout(this.showProgressTimer_);
			this.removeProgressBar_();
		}
		removeProgressBar_() {
			const progressBarContainer = document.querySelector(".progress-bar-container");
			if (progressBarContainer) {
				assertInitialized(progressBarContainer.parentNode, "parentNode").removeChild(progressBarContainer);
				this.progressBar = null;
				this.progressBarStatus = null;
			}
		}
	};
	//#endregion
	//#region src/js/tools/ToolIconBuilder.ts
	var ToolIconBuilder = class {
		createIcon(tool, tooltipPosition) {
			tooltipPosition = tooltipPosition || "right";
			const tpl = Template.get("drawingTool-item-template");
			return Template.replace(tpl, {
				cssclass: ["tool-icon", "icon-" + tool.toolId].join(" "),
				toolid: tool.toolId,
				title: this.getTooltipText(tool),
				tooltipposition: tooltipPosition
			});
		}
		getTooltipText(tool) {
			const descriptors = tool.tooltipDescriptors;
			return TooltipFormatter.format(tool.getHelpText(), tool.shortcut, descriptors);
		}
	};
	//#endregion
	//#region src/js/utils/PixelUtils.ts
	var PixelUtils = {
		getRectanglePixels(x0, y0, x1, y1) {
			const rectangle = this.getOrderedRectangleCoordinates(x0, y0, x1, y1);
			const pixels = [];
			for (let x = rectangle.x0; x <= rectangle.x1; x++) for (let y = rectangle.y0; y <= rectangle.y1; y++) pixels.push({
				col: x,
				row: y
			});
			return pixels;
		},
		getOrderedRectangleCoordinates(x0, y0, x1, y1) {
			return {
				x0: Math.min(x0, x1),
				y0: Math.min(y0, y1),
				x1: Math.max(x0, x1),
				y1: Math.max(y0, y1)
			};
		},
		getSimilarConnectedPixelsFromFrame(frame, col, row) {
			const targetColor = frame.getPixel(col, row);
			if (targetColor === null) return [];
			const startPixel = {
				col,
				row
			};
			const visited = {};
			return PixelUtils.visitConnectedPixels(startPixel, frame, function(pixel) {
				const key = pixel.col + "-" + pixel.row;
				if (visited[key]) return false;
				visited[key] = true;
				return frame.getPixel(pixel.col, pixel.row) == targetColor;
			});
		},
		resizePixel(col, row, size) {
			const pixels = [];
			for (let j = 0; j < size; j++) for (let i = 0; i < size; i++) pixels.push([col - Math.floor(size / 2) + i, row - Math.floor(size / 2) + j]);
			return pixels;
		},
		resizePixels(pixels, size) {
			return pixels.reduce(function(p, pixel) {
				return p.concat(PixelUtils.resizePixel(pixel.col, pixel.row, size));
			}, []);
		},
		paintSimilarConnectedPixelsFromFrame(frame, col, row, replacementColor) {
			/**
			*  Queue linear Flood-fill (node, target-color, replacement-color):
			*   1. Set Q to the empty queue.
			*   2. If the color of node is not equal to target-color, return.
			*   3. Add node to Q.
			*   4. For each element n of Q:
			*   5.     If the color of n is equal to target-color:
			*   6.         Set w and e equal to n.
			*   7.         Move w to the west until the color of the node to the west of w no longer matches target-color.
			*   8.         Move e to the east until the color of the node to the east of e no longer matches target-color.
			*   9.         Set the color of nodes between w and e to replacement-color.
			*  10.         For each node n between w and e:
			*  11.             If the color of the node to the north of n is target-color, add that node to Q.
			*  12.             If the color of the node to the south of n is target-color, add that node to Q.
			*  13. Continue looping until Q is exhausted.
			*  14. Return.
			*/
			if (typeof replacementColor == "string") replacementColor = colorToInt(replacementColor);
			let targetColor = null;
			try {
				targetColor = frame.getPixel(col, row);
			} catch {}
			if (targetColor === null || targetColor == replacementColor) return;
			const startPixel = {
				col,
				row
			};
			return PixelUtils.visitConnectedPixels(startPixel, frame, function(pixel) {
				if (frame.getPixel(pixel.col, pixel.row) == targetColor) {
					frame.setPixel(pixel.col, pixel.row, replacementColor);
					return true;
				}
				return false;
			});
		},
		visitConnectedPixels(pixel, frame, pixelVisitor) {
			const queue = [];
			const visitedPixels = [];
			const dy = [
				-1,
				0,
				1,
				0
			];
			const dx = [
				0,
				1,
				0,
				-1
			];
			queue.push(pixel);
			visitedPixels.push(pixel);
			pixelVisitor(pixel);
			let loopCount = 0;
			const cellCount = frame.getWidth() * frame.getHeight();
			let currentItem = queue.pop();
			while (currentItem !== void 0) {
				loopCount++;
				for (let i = 0; i < 4; i++) {
					const nextCol = currentItem.col + dx[i];
					const nextRow = currentItem.row + dy[i];
					try {
						const connectedPixel = {
							col: nextCol,
							row: nextRow
						};
						if (pixelVisitor(connectedPixel)) {
							queue.push(connectedPixel);
							visitedPixels.push(connectedPixel);
						}
					} catch {}
				}
				if (loopCount > 10 * cellCount) {
					console.log("loop breaker called");
					break;
				}
				currentItem = queue.pop();
			}
			return visitedPixels;
		},
		getLinePixels(x0, x1, y0, y1) {
			const pixels = [];
			x1 = normalize(x1, 0);
			y1 = normalize(y1, 0);
			const dx = Math.abs(x1 - x0);
			const dy = Math.abs(y1 - y0);
			const sx = x0 < x1 ? 1 : -1;
			const sy = y0 < y1 ? 1 : -1;
			let err = dx - dy;
			while (true) {
				pixels.push({
					col: x0,
					row: y0
				});
				if (x0 == x1 && y0 == y1) break;
				const e2 = 2 * err;
				if (e2 > -dy) {
					err -= dy;
					x0 += sx;
				}
				if (e2 < dx) {
					err += dx;
					y0 += sy;
				}
			}
			return pixels;
		},
		getUniformLinePixels(x0, x1, y0, y1) {
			const pixels = [];
			x1 = normalize(x1, 0);
			y1 = normalize(y1, 0);
			const dx = Math.abs(x1 - x0) + 1;
			const dy = Math.abs(y1 - y0) + 1;
			const sx = x0 < x1 ? 1 : -1;
			const sy = y0 < y1 ? 1 : -1;
			const ratio = Math.max(dx, dy) / Math.min(dx, dy);
			let pixelStep = Math.round(ratio) || 0;
			if (pixelStep > Math.min(dx, dy)) pixelStep = Infinity;
			const maxDistance = MathUtils.distance(x0, x1, y0, y1);
			let x = x0;
			let y = y0;
			let i = 0;
			while (true) {
				i++;
				pixels.push({
					col: x,
					row: y
				});
				if (MathUtils.distance(x0, x, y0, y) >= maxDistance) break;
				const isAtStep = i % pixelStep === 0;
				if (dx >= dy || isAtStep) x += sx;
				if (dy >= dx || isAtStep) y += sy;
			}
			return pixels;
		}
	};
	//#endregion
	//#region src/js/tools/Tool.ts
	var Tool = class {
		getHelpText() {
			return this.helpText;
		}
		getId() {
			return this.toolId;
		}
		/**
		* Records an action in the history. Only tools that can replay their
		* actions record them, so this requires a `replay` method.
		*/
		raiseSaveStateEvent(replayData) {
			$.publish(Events.PISKEL_SAVE_STATE, {
				type: HistoryService.REPLAY,
				scope: this,
				replay: replayData
			});
		}
	};
	//#endregion
	//#region src/js/tools/drawing/BaseTool.ts
	var BaseTool = class extends Tool {
		applyToolAt(_col, _row, _frame, _overlay, _event) {}
		moveToolAt(_col, _row, _frame, _overlay, _event) {}
		supportsDynamicPenSize() {
			return false;
		}
		getToolColor() {
			if (assertInitialized(app.mouseStateService, "mouseStateService").isRightButtonPressed()) return assertInitialized(app.selectedColorsService, "selectedColorsService").getSecondaryColor();
			return assertInitialized(app.selectedColorsService, "selectedColorsService").getPrimaryColor();
		}
		moveUnactiveToolAt(col, row, frame, overlay, _event) {
			if (overlay.containsPixel(col, row)) this.updateHighlightedPixel(frame, overlay, col, row);
			else this.hideHighlightedPixel(overlay);
		}
		updateHighlightedPixel(frame, overlay, col, row) {
			if (!isNaN(Number(this.highlightedPixelCol)) && !isNaN(Number(this.highlightedPixelRow)) && (this.highlightedPixelRow != row || this.highlightedPixelCol != col)) overlay.clear();
			const frameColor = intToColor(frame.getPixel(col, row));
			const highlightColor = this.getHighlightColor_(frameColor);
			const size = this.supportsDynamicPenSize() ? assertInitialized(app.penSizeService, "penSizeService").getPenSize() : 1;
			PixelUtils.resizePixel(col, row, size).forEach(function(point) {
				overlay.setPixel(point[0], point[1], highlightColor);
			});
			this.highlightedPixelCol = col;
			this.highlightedPixelRow = row;
		}
		getHighlightColor_(frameColor) {
			if (!frameColor) return Constants.TOOL_HIGHLIGHT_COLOR_DARK;
			if (window.tinycolor(intToColor(frameColor)).toHsl().l > .5) return Constants.TOOL_HIGHLIGHT_COLOR_DARK;
			else return Constants.TOOL_HIGHLIGHT_COLOR_LIGHT;
		}
		hideHighlightedPixel(overlay) {
			if (this.highlightedPixelRow !== null && this.highlightedPixelCol !== null) {
				overlay.clear();
				this.highlightedPixelRow = null;
				this.highlightedPixelCol = null;
			}
		}
		releaseToolAt(_col, _row, _frame, _overlay, _event) {}
		/**
		* Does the tool support the ALT modifier. To be overridden by subclasses.
		*
		* @return {Boolean} true if the tool supports ALT.
		*/
		supportsAlt() {
			return false;
		}
	};
	//#endregion
	//#region src/js/tools/drawing/ShapeTool.ts
	var ShapeTool = class extends BaseTool {
		constructor() {
			super();
			this.startCol = null;
			this.startRow = null;
			this.tooltipDescriptors = [{
				key: "shift",
				description: "Keep 1 to 1 ratio"
			}];
		}
		supportsDynamicPenSize() {
			return true;
		}
		/**
		* @override
		*/
		applyToolAt(col, row, _frame, overlay) {
			$.publish(Events.DRAG_START, [col, row]);
			this.startCol = col;
			this.startRow = row;
			const penSize = assertInitialized(app.penSizeService, "penSizeService").getPenSize();
			this.draw(col, row, this.getToolColor(), overlay, penSize);
		}
		moveToolAt(col, row, _frame, overlay, event) {
			const coords = this.getCoordinates_(col, row, event);
			$.publish(Events.CURSOR_MOVED, [coords.col, coords.row]);
			overlay.clear();
			let color = this.getToolColor();
			if (color == Constants.TRANSPARENT_COLOR) color = Constants.SELECTION_TRANSPARENT_COLOR;
			const penSize = assertInitialized(app.penSizeService, "penSizeService").getPenSize();
			this.draw(coords.col, coords.row, color, overlay, penSize);
		}
		/**
		* @override
		*/
		releaseToolAt(col, row, frame, overlay, event) {
			overlay.clear();
			const coords = this.getCoordinates_(col, row, event);
			const color = this.getToolColor();
			const penSize = assertInitialized(app.penSizeService, "penSizeService").getPenSize();
			this.draw(coords.col, coords.row, color, frame, penSize);
			$.publish(Events.DRAG_END);
			this.raiseSaveStateEvent({
				col: coords.col,
				row: coords.row,
				startCol: this.startCol,
				startRow: this.startRow,
				color,
				penSize
			});
		}
		/**
		* @override
		*/
		replay(frame, replayData) {
			this.startCol = replayData.startCol;
			this.startRow = replayData.startRow;
			this.draw(replayData.col, replayData.row, replayData.color, frame, replayData.penSize);
		}
		/**
		* Transform the current coordinates based on the original event
		* @param {Number} col current col/x coordinate in the frame
		* @param {Number} row current row/y coordinate in the frame
		* @param {Event} event current event (can be mousemove, mouseup ...)
		* @return {Object} {row : Number, col : Number}
		*/
		getCoordinates_(col, row, event) {
			if (event.shiftKey) return this.getScaledCoordinates_(col, row);
			else return {
				col,
				row
			};
		}
		/**
		* Transform the coordinates to preserve a square 1:1 ratio from the origin of the shape
		* @param {Number} col current col/x coordinate in the frame
		* @param {Number} row current row/y coordinate in the frame
		* @return {Object} {row : Number, col : Number}
		*/
		getScaledCoordinates_(col, row) {
			const startCol = Number(this.startCol);
			const startRow = Number(this.startRow);
			const dX = startCol - col;
			const absX = Math.abs(dX);
			const dY = startRow - row;
			const absY = Math.abs(dY);
			const delta = Math.min(absX, absY);
			row = startRow - dY / absY * delta;
			col = startCol - dX / absX * delta;
			return {
				col,
				row
			};
		}
	};
	//#endregion
	//#region src/js/tools/drawing/Circle.ts
	var Circle = class extends ShapeTool {
		constructor() {
			super();
			this.toolId = "tool-circle";
			this.helpText = "Circle tool";
			this.shortcut = Shortcuts.TOOL.CIRCLE;
		}
		/**
		* @override
		*/
		draw(col, row, color, targetFrame, penSize) {
			this.getCirclePixels_(Number(this.startCol), Number(this.startRow), col, row, penSize).forEach(function(point) {
				targetFrame.setPixel(point[0], point[1], color);
			});
		}
		getCirclePixels_(x0, y0, x1, y1, penSize) {
			const coords = PixelUtils.getOrderedRectangleCoordinates(x0, y0, x1, y1);
			const pixels = [];
			const xC = Math.round((coords.x0 + coords.x1) / 2);
			const yC = Math.round((coords.y0 + coords.y1) / 2);
			const evenX = (coords.x0 + coords.x1) % 2;
			const evenY = (coords.y0 + coords.y1) % 2;
			const rX = coords.x1 - xC;
			const rY = coords.y1 - yC;
			let x;
			let y;
			let angle;
			let r;
			if (penSize == 1) {
				for (x = coords.x0; x <= xC; x++) {
					angle = Math.acos((x - xC) / rX);
					y = Math.round(rY * Math.sin(angle) + yC);
					pixels.push([x - evenX, y]);
					pixels.push([x - evenX, 2 * yC - y - evenY]);
					pixels.push([2 * xC - x, y]);
					pixels.push([2 * xC - x, 2 * yC - y - evenY]);
				}
				for (y = coords.y0; y <= yC; y++) {
					angle = Math.asin((y - yC) / rY);
					x = Math.round(rX * Math.cos(angle) + xC);
					pixels.push([x, y - evenY]);
					pixels.push([2 * xC - x - evenX, y - evenY]);
					pixels.push([x, 2 * yC - y]);
					pixels.push([2 * xC - x - evenX, 2 * yC - y]);
				}
				return pixels;
			}
			let iX = rX - penSize;
			let iY = rY - penSize;
			if (iX < 0) iX = 0;
			if (iY < 0) iY = 0;
			for (x = 0; x <= rX; x++) for (y = 0; y <= rY; y++) {
				angle = Math.atan(y / x);
				r = Math.sqrt(x * x + y * y);
				if ((rX <= penSize || rY <= penSize || r > iX * iY / Math.sqrt(iY * iY * Math.pow(Math.cos(angle), 2) + iX * iX * Math.pow(Math.sin(angle), 2)) + .5) && r < rX * rY / Math.sqrt(rY * rY * Math.pow(Math.cos(angle), 2) + rX * rX * Math.pow(Math.sin(angle), 2)) + .5) {
					pixels.push([xC + x, yC + y]);
					pixels.push([xC - x - evenX, yC + y]);
					pixels.push([xC + x, yC - y - evenY]);
					pixels.push([xC - x - evenX, yC - y - evenY]);
				}
			}
			return pixels;
		}
	};
	//#endregion
	//#region src/js/tools/drawing/ColorPicker.ts
	var ColorPicker = class extends BaseTool {
		constructor() {
			super();
			this.toolId = "tool-colorpicker";
			this.helpText = "Color picker";
			this.shortcut = Shortcuts.TOOL.COLORPICKER;
		}
		/**
		* @override
		*/
		applyToolAt(col, row, frame) {
			if (frame.containsPixel(col, row)) {
				const sampledColor = intToColor(frame.getPixel(col, row));
				if (assertInitialized(app.mouseStateService, "mouseStateService").isLeftButtonPressed()) $.publish(Events.SELECT_PRIMARY_COLOR, [sampledColor]);
				else if (assertInitialized(app.mouseStateService, "mouseStateService").isRightButtonPressed()) $.publish(Events.SELECT_SECONDARY_COLOR, [sampledColor]);
			}
		}
	};
	//#endregion
	//#region src/js/tools/drawing/ColorSwap.ts
	var ColorSwap = class extends BaseTool {
		constructor() {
			super();
			this.toolId = "tool-colorswap";
			this.helpText = "Paint all pixels of the same color";
			this.shortcut = Shortcuts.TOOL.COLORSWAP;
			this.tooltipDescriptors = [{
				key: "ctrl",
				description: "Apply to all layers"
			}, {
				key: "shift",
				description: "Apply to all frames"
			}];
		}
		/**
		* @override
		*/
		applyToolAt(col, row, frame, _overlay, event) {
			const oldColor = frame.getPixel(col, row);
			if (oldColor !== null) {
				const newColor = this.getToolColor();
				const allLayers = UserAgent.isMac ? event.metaKey : event.ctrlKey;
				const allFrames = event.shiftKey;
				this.swapColors_(oldColor, newColor, allLayers, allFrames);
				this.raiseSaveStateEvent({
					allLayers,
					allFrames,
					oldColor,
					newColor
				});
			}
		}
		replay(_frame, replayData) {
			this.swapColors_(replayData.oldColor, replayData.newColor, replayData.allLayers, replayData.allFrames);
		}
		swapColors_(oldColor, newColor, allLayers, allFrames) {
			const currentFrameIndex = assertInitialized(app.piskelController, "piskelController").getCurrentFrameIndex();
			(allLayers ? assertInitialized(app.piskelController, "piskelController").getLayers() : [assertInitialized(app.piskelController, "piskelController").getCurrentLayer()]).forEach((layer) => {
				(allFrames ? layer.getFrames() : [layer.getFrameAt(currentFrameIndex)]).forEach((frame) => {
					this.applyToolOnFrame_(frame, oldColor, newColor);
				});
			});
		}
		applyToolOnFrame_(frame, oldColor, newColor) {
			oldColor = colorToInt(oldColor);
			newColor = colorToInt(newColor);
			frame.forEachPixel(function(color, col, row) {
				if (color !== null && color == oldColor) frame.setPixel(col, row, newColor);
			});
		}
	};
	//#endregion
	//#region src/js/tools/drawing/SimplePen.ts
	var SimplePen = class extends BaseTool {
		constructor() {
			super();
			this.toolId = "tool-pen";
			this.helpText = "Pen tool";
			this.shortcut = Shortcuts.TOOL.PEN;
			this.previousCol = null;
			this.previousRow = null;
			this.pixels = [];
		}
		supportsDynamicPenSize() {
			return true;
		}
		/**
		* @override
		*/
		applyToolAt(col, row, frame, overlay, _event) {
			this.previousCol = col;
			this.previousRow = row;
			const color = this.getToolColor();
			this.drawUsingPenSize(color, col, row, frame, overlay);
		}
		drawUsingPenSize(color, col, row, frame, overlay) {
			const penSize = assertInitialized(app.penSizeService, "penSizeService").getPenSize();
			PixelUtils.resizePixel(col, row, penSize).forEach((point) => {
				this.draw(color, point[0], point[1], frame, overlay);
			});
		}
		draw(color, col, row, frame, overlay) {
			overlay.setPixel(col, row, color);
			if (color === Constants.TRANSPARENT_COLOR) frame.setPixel(col, row, color);
			this.pixels.push({
				col,
				row,
				color
			});
		}
		/**
		* @override
		*/
		moveToolAt(col, row, frame, overlay, event) {
			if (Math.abs(col - Number(this.previousCol)) > 1 || Math.abs(row - Number(this.previousRow)) > 1) {
				const interpolatedPixels = PixelUtils.getLinePixels(col, Number(this.previousCol), row, Number(this.previousRow));
				for (let i = 0, l = interpolatedPixels.length; i < l; i++) {
					const coords = interpolatedPixels[i];
					this.applyToolAt(coords.col, coords.row, frame, overlay, event);
				}
			} else this.applyToolAt(col, row, frame, overlay, event);
			this.previousCol = col;
			this.previousRow = row;
		}
		releaseToolAt(_col, _row, frame) {
			this.setPixelsToFrame_(frame, this.pixels);
			this.raiseSaveStateEvent({
				pixels: this.pixels.slice(0),
				color: this.getToolColor()
			});
			this.resetUsedPixels_();
		}
		replay(frame, replayData) {
			this.setPixelsToFrame_(frame, replayData.pixels);
		}
		setPixelsToFrame_(frame, pixels) {
			pixels.forEach(function(pixel) {
				frame.setPixel(pixel.col, pixel.row, pixel.color);
			});
		}
		resetUsedPixels_() {
			this.pixels = [];
		}
	};
	//#endregion
	//#region src/js/tools/drawing/DitheringTool.ts
	var DitheringTool = class extends SimplePen {
		constructor() {
			super();
			this.toolId = "tool-dithering";
			this.helpText = "Dithering tool";
			this.shortcut = Shortcuts.TOOL.DITHERING;
		}
		supportsDynamicPenSize() {
			return true;
		}
		/**
		* @override
		*/
		applyToolAt(col, row, frame, overlay) {
			this.previousCol = col;
			this.previousRow = row;
			const penSize = assertInitialized(app.penSizeService, "penSizeService").getPenSize();
			PixelUtils.resizePixel(col, row, penSize).forEach((point) => {
				this.applyToolOnPixel(point[0], point[1], frame, overlay);
			});
		}
		applyToolOnPixel(col, row, frame, overlay) {
			let usePrimaryColor = (col + row) % 2;
			if (assertInitialized(app.mouseStateService, "mouseStateService").isRightButtonPressed()) usePrimaryColor = !usePrimaryColor;
			const ditheringColor = usePrimaryColor ? assertInitialized(app.selectedColorsService, "selectedColorsService").getPrimaryColor() : assertInitialized(app.selectedColorsService, "selectedColorsService").getSecondaryColor();
			this.draw(ditheringColor, col, row, frame, overlay);
		}
	};
	//#endregion
	//#region src/js/tools/drawing/Eraser.ts
	var Eraser = class extends SimplePen {
		constructor() {
			super();
			this.toolId = "tool-eraser";
			this.helpText = "Eraser tool";
			this.shortcut = Shortcuts.TOOL.ERASER;
		}
		/**
		* @override
		*/
		getToolColor() {
			return Constants.TRANSPARENT_COLOR;
		}
	};
	//#endregion
	//#region src/js/tools/drawing/Lighten.ts
	var DEFAULT_STEP = 3;
	var Lighten = class extends SimplePen {
		constructor() {
			super();
			this.toolId = "tool-lighten";
			this.helpText = "Lighten";
			this.shortcut = Shortcuts.TOOL.LIGHTEN;
			this.tooltipDescriptors = [{
				key: "ctrl",
				description: "Darken"
			}, {
				key: "shift",
				description: "Apply only once per pixel"
			}];
		}
		/**
		* @Override
		*/
		applyToolAt(col, row, frame, overlay, event) {
			this.previousCol = col;
			this.previousRow = row;
			const penSize = assertInitialized(app.penSizeService, "penSizeService").getPenSize();
			PixelUtils.resizePixel(col, row, penSize).forEach((point) => {
				const modifiedColor = this.getModifiedColor_(point[0], point[1], frame, overlay, event);
				if (modifiedColor === null) return;
				this.draw(modifiedColor, point[0], point[1], frame, overlay);
			});
		}
		getModifiedColor_(col, row, frame, overlay, event) {
			const overlayColor = overlay.getPixel(col, row);
			const frameColor = frame.getPixel(col, row);
			const isPixelModified = overlayColor !== colorToInt(Constants.TRANSPARENT_COLOR);
			const pixelColor = isPixelModified ? overlayColor : frameColor;
			if (pixelColor === colorToInt(Constants.TRANSPARENT_COLOR)) return Constants.TRANSPARENT_COLOR;
			const oncePerPixel = event.shiftKey;
			if (oncePerPixel && isPixelModified) return pixelColor;
			const step = oncePerPixel ? DEFAULT_STEP * 2 : DEFAULT_STEP;
			const isDarken = UserAgent.isMac ? event.metaKey : event.ctrlKey;
			let color;
			if (isDarken) color = window.tinycolor.darken(intToColor(pixelColor), step);
			else color = window.tinycolor.lighten(intToColor(pixelColor), step);
			return color.toHexString();
		}
	};
	//#endregion
	//#region src/js/tools/ToolsHelper.ts
	var ToolsHelper = { getTargetFrames(useAllLayers, useAllFrames) {
		const currentFrameIndex = assertInitialized(app.piskelController, "piskelController").getCurrentFrameIndex();
		return (useAllLayers ? assertInitialized(app.piskelController, "piskelController").getLayers() : [assertInitialized(app.piskelController, "piskelController").getCurrentLayer()]).reduce(function(previous, layer) {
			const frames = useAllFrames ? layer.getFrames() : [layer.getFrameAt(currentFrameIndex)];
			return previous.concat(frames);
		}, []);
	} };
	//#endregion
	//#region src/js/tools/drawing/Move.ts
	var _Move;
	var Move = class Move extends BaseTool {
		constructor() {
			super();
			this.toolId = Move.TOOL_ID;
			this.helpText = "Move tool";
			this.shortcut = Shortcuts.TOOL.MOVE;
			this.tooltipDescriptors = [
				{
					key: "ctrl",
					description: "Apply to all layers"
				},
				{
					key: "shift",
					description: "Apply to all frames"
				},
				{
					key: "alt",
					description: "Wrap canvas borders"
				}
			];
			this.startCol = null;
			this.startRow = null;
		}
		/**
		* @override
		*/
		applyToolAt(col, row, frame) {
			this.startCol = col;
			this.startRow = row;
			this.currentFrame = frame;
			this.currentFrameClone = frame.clone();
		}
		moveToolAt(col, row, frame, _overlay, event) {
			const colDiff = col - Number(this.startCol);
			const rowDiff = row - Number(this.startRow);
			this.shiftFrame(colDiff, rowDiff, frame, assertInitialized(this.currentFrameClone, "currentFrameClone"), event);
		}
		shiftFrame(colDiff, rowDiff, frame, reference, event) {
			let color;
			const w = frame.getWidth();
			const h = frame.getHeight();
			for (let col = 0; col < w; col++) for (let row = 0; row < h; row++) {
				let x = col - colDiff;
				let y = row - rowDiff;
				if (event.altKey) {
					x = (x + w) % w;
					y = (y + h) % h;
				}
				const referenceColor = reference.getPixel(x, y);
				if (referenceColor !== null) color = referenceColor;
				else color = Constants.TRANSPARENT_COLOR;
				frame.setPixel(col, row, color);
			}
		}
		/**
		* @override
		*/
		releaseToolAt(col, row, _frame, _overlay, event) {
			const colDiff = col - Number(this.startCol);
			const rowDiff = row - Number(this.startRow);
			const ctrlKey = UserAgent.isMac ? event.metaKey : event.ctrlKey;
			ToolsHelper.getTargetFrames(ctrlKey, event.shiftKey).forEach((f) => {
				const reference = this.currentFrame == f ? assertInitialized(this.currentFrameClone, "currentFrameClone") : f.clone();
				this.shiftFrame(colDiff, rowDiff, f, reference, event);
			});
			this.raiseSaveStateEvent({
				colDiff,
				rowDiff,
				ctrlKey,
				altKey: event.altKey,
				shiftKey: event.shiftKey
			});
		}
		replay(_frame, replayData) {
			const event = {
				shiftKey: replayData.shiftKey,
				altKey: replayData.altKey,
				ctrlKey: replayData.ctrlKey
			};
			ToolsHelper.getTargetFrames(event.ctrlKey, event.shiftKey).forEach((frame) => {
				this.shiftFrame(replayData.colDiff, replayData.rowDiff, frame, frame.clone(), event);
			});
		}
		supportsAlt() {
			return true;
		}
	};
	_Move = Move;
	_Move.TOOL_ID = "tool-move";
	//#endregion
	//#region src/js/tools/drawing/PaintBucket.ts
	var PaintBucket = class extends BaseTool {
		constructor() {
			super();
			this.toolId = "tool-paint-bucket";
			this.helpText = "Paint bucket tool";
			this.shortcut = Shortcuts.TOOL.PAINT_BUCKET;
		}
		/**
		* @override
		*/
		applyToolAt(col, row, frame) {
			const color = this.getToolColor();
			PixelUtils.paintSimilarConnectedPixelsFromFrame(frame, col, row, color);
			this.raiseSaveStateEvent({
				col,
				row,
				color
			});
		}
		replay(frame, replayData) {
			PixelUtils.paintSimilarConnectedPixelsFromFrame(frame, replayData.col, replayData.row, replayData.color);
		}
	};
	//#endregion
	//#region src/js/tools/drawing/Rectangle.ts
	var Rectangle = class extends ShapeTool {
		constructor() {
			super();
			this.toolId = "tool-rectangle";
			this.helpText = "Rectangle tool";
			this.shortcut = Shortcuts.TOOL.RECTANGLE;
		}
		/**
		* @override
		*/
		draw(col, row, color, targetFrame, penSize) {
			const rectangle = PixelUtils.getOrderedRectangleCoordinates(Number(this.startCol), Number(this.startRow), col, row);
			for (let x = rectangle.x0; x <= rectangle.x1; x++) for (let y = rectangle.y0; y <= rectangle.y1; y++) if (x > rectangle.x1 - penSize || x < rectangle.x0 + penSize || y > rectangle.y1 - penSize || y < rectangle.y0 + penSize) targetFrame.setPixel(x, y, color);
		}
	};
	//#endregion
	//#region src/js/tools/drawing/Stroke.ts
	var Stroke = class extends BaseTool {
		constructor() {
			super();
			this.toolId = "tool-stroke";
			this.helpText = "Stroke tool";
			this.shortcut = Shortcuts.TOOL.STROKE;
			this.tooltipDescriptors = [{
				key: "shift",
				description: "Hold shift to draw straight lines"
			}];
			this.startCol = null;
			this.startRow = null;
		}
		supportsDynamicPenSize() {
			return true;
		}
		/**
		* @override
		*/
		applyToolAt(col, row, _frame, overlay) {
			this.startCol = col;
			this.startRow = row;
			overlay.setPixel(col, row, this.getToolColor());
		}
		moveToolAt(col, row, _frame, overlay, event) {
			overlay.clear();
			const penSize = assertInitialized(app.penSizeService, "penSizeService").getPenSize();
			const isStraight = event.shiftKey;
			let color = this.getToolColor();
			if (color == Constants.TRANSPARENT_COLOR) color = Constants.SELECTION_TRANSPARENT_COLOR;
			this.draw_(col, row, color, overlay, penSize, isStraight);
		}
		/**
		* @override
		*/
		releaseToolAt(col, row, frame, overlay, event) {
			const penSize = assertInitialized(app.penSizeService, "penSizeService").getPenSize();
			const isStraight = event.shiftKey;
			const color = this.getToolColor();
			this.draw_(col, row, color, frame, penSize, isStraight);
			overlay.clear();
			this.raiseSaveStateEvent({
				col,
				row,
				startCol: this.startCol,
				startRow: this.startRow,
				color,
				penSize,
				isStraight
			});
		}
		draw_(col, row, color, targetFrame, penSize, isStraight) {
			let linePixels;
			if (isStraight) linePixels = PixelUtils.getUniformLinePixels(Number(this.startCol), col, Number(this.startRow), row);
			else linePixels = PixelUtils.getLinePixels(col, Number(this.startCol), row, Number(this.startRow));
			PixelUtils.resizePixel(linePixels[0].col, linePixels[0].row, penSize).forEach(function(point) {
				targetFrame.setPixel(point[0], point[1], color);
			});
			PixelUtils.resizePixel(linePixels[linePixels.length - 1].col, linePixels[linePixels.length - 1].row, penSize).forEach(function(point) {
				targetFrame.setPixel(point[0], point[1], color);
			});
			linePixels.forEach(function(point) {
				for (let i = 0; i < penSize; i++) {
					targetFrame.setPixel(point.col - Math.floor(penSize / 2) + i, point.row - Math.floor(penSize / 2) + i, color);
					targetFrame.setPixel(point.col - Math.floor(penSize / 2) + i, point.row + Math.ceil(penSize / 2) - i - 1, color);
					if (i !== 0) {
						targetFrame.setPixel(point.col - Math.floor(penSize / 2) + i, point.row - Math.floor(penSize / 2) + i - 1, color);
						targetFrame.setPixel(point.col - Math.floor(penSize / 2) + i, point.row + Math.ceil(penSize / 2) - i, color);
					}
				}
			});
		}
		replay(frame, replayData) {
			this.startCol = replayData.startCol;
			this.startRow = replayData.startRow;
			this.draw_(replayData.col, replayData.row, replayData.color, frame, replayData.penSize, replayData.isStraight);
		}
	};
	//#endregion
	//#region src/js/tools/drawing/VerticalMirrorPen.ts
	var VerticalMirrorPen = class extends SimplePen {
		constructor() {
			super();
			this.toolId = "tool-vertical-mirror-pen";
			this.helpText = "Vertical Mirror pen";
			this.shortcut = Shortcuts.TOOL.MIRROR_PEN;
			this.tooltipDescriptors = [{
				key: "ctrl",
				description: "Use horizontal axis"
			}, {
				key: "shift",
				description: "Use horizontal and vertical axis"
			}];
		}
		/**
		* @override
		*/
		applyToolAt(col, row, frame, overlay, event) {
			const color = this.getToolColor();
			this.drawUsingPenSize(color, col, row, frame, overlay);
			const mirroredCol = this.getSymmetricCol_(col, frame);
			const mirroredRow = this.getSymmetricRow_(row, frame);
			const hasCtrlKey = UserAgent.isMac ? event.metaKey : event.ctrlKey;
			if (!hasCtrlKey) this.drawUsingPenSize(color, mirroredCol, row, frame, overlay);
			if (event.shiftKey || hasCtrlKey) this.drawUsingPenSize(color, col, mirroredRow, frame, overlay);
			if (event.shiftKey) this.drawUsingPenSize(color, mirroredCol, mirroredRow, frame, overlay);
			this.previousCol = col;
			this.previousRow = row;
		}
		getSymmetricCol_(col, frame) {
			return frame.getWidth() - col - this.getPenSizeOffset_();
		}
		getSymmetricRow_(row, frame) {
			return frame.getHeight() - row - this.getPenSizeOffset_();
		}
		/**
		* Depending on the pen size, the mirrored index need to have an offset of 1 pixel.
		*/
		getPenSizeOffset_() {
			return assertInitialized(app.penSizeService, "penSizeService").getPenSize() % 2;
		}
	};
	//#endregion
	//#region src/js/selection/BaseSelection.ts
	var BaseSelection = class {
		constructor() {
			this.pixels = [];
		}
		stringify() {
			return JSON.stringify({
				pixels: this.pixels,
				time: this.time
			});
		}
		parse(str) {
			const selectionData = JSON.parse(str);
			this.pixels = selectionData.pixels;
			this.time = selectionData.time;
		}
		reset() {
			this.pixels = [];
			this.hasPastedContent = false;
			this.time = -1;
		}
		move(colDiff, rowDiff) {
			const movedPixels = [];
			for (let i = 0, l = assertInitialized(this.pixels, "pixels").length; i < l; i++) {
				const movedPixel = assertInitialized(this.pixels, "pixels")[i];
				movedPixel.col += colDiff;
				movedPixel.row += rowDiff;
				movedPixels.push(movedPixel);
			}
			this.pixels = movedPixels;
		}
		fillSelectionFromFrame(targetFrame) {
			assertInitialized(this.pixels, "pixels").forEach(function(pixel) {
				pixel.color = targetFrame.getPixel(pixel.col, pixel.row) || Constants.TRANSPARENT_COLOR;
			});
			this.hasPastedContent = true;
			this.time = Date.now();
		}
	};
	//#endregion
	//#region src/js/selection/LassoSelection.ts
	var OUTSIDE = -1;
	var INSIDE = 1;
	var VISITED = 2;
	var LassoSelection = class extends BaseSelection {
		constructor(pixels, frame) {
			super();
			this.pixelsMap = {};
			pixels.forEach((pixel) => {
				this.setPixelInMap_(pixel, INSIDE);
			});
			this.pixels = this.getLassoPixels_(frame);
		}
		getLassoPixels_(frame) {
			const lassoPixels = [];
			frame.forEachPixel((_color, pixelCol, pixelRow) => {
				const pixel = {
					col: pixelCol,
					row: pixelRow
				};
				if (this.isInSelection_(pixel, frame)) lassoPixels.push(pixel);
			});
			return lassoPixels;
		}
		isInSelection_(pixel, frame) {
			if (!this.getPixelInMap_(pixel)) this.visitPixel_(pixel, frame);
			return this.getPixelInMap_(pixel) == INSIDE;
		}
		visitPixel_(pixel, frame) {
			let frameBorderReached = false;
			PixelUtils.visitConnectedPixels(pixel, frame, (connectedPixel) => {
				if (this.getPixelInMap_(connectedPixel)) return false;
				if (!frame.containsPixel(connectedPixel.col, connectedPixel.row)) {
					frameBorderReached = true;
					return false;
				}
				this.setPixelInMap_(connectedPixel, VISITED);
				return true;
			}).forEach((visitedPixel) => {
				this.setPixelInMap_(visitedPixel, frameBorderReached ? OUTSIDE : INSIDE);
			});
		}
		setPixelInMap_(pixel, value) {
			this.pixelsMap[pixel.col] = this.pixelsMap[pixel.col] || {};
			this.pixelsMap[pixel.col][pixel.row] = value;
		}
		getPixelInMap_(pixel) {
			return this.pixelsMap[pixel.col] && this.pixelsMap[pixel.col][pixel.row];
		}
	};
	//#endregion
	//#region src/js/selection/ShapeSelection.ts
	var ShapeSelection = class extends BaseSelection {
		constructor(pixels) {
			super();
			this.pixels = pixels;
		}
	};
	//#endregion
	//#region src/js/utils/FunctionUtils.ts
	var FunctionUtils = {
		memo(fn, cache, scope) {
			const memoized = function(...args) {
				const key = args.join("-");
				if (!cache[key]) cache[key] = fn.apply(scope, args);
				return cache[key];
			};
			return memoized;
		},
		throttle(fn, interval) {
			let last;
			let timer;
			return function() {
				const now = Date.now();
				if (last && now < last + interval) {
					window.clearTimeout(timer);
					timer = window.setTimeout(function() {
						last = now;
						fn();
					}, interval);
				} else {
					last = now;
					fn();
				}
			};
		}
	};
	//#endregion
	//#region src/js/tools/drawing/selection/BaseSelect.ts
	var transparentVariantMemo = FunctionUtils.memo(function(colorStr) {
		let color = window.tinycolor(colorStr);
		color = window.tinycolor.lighten(color, 10);
		color.setAlpha(.5);
		return color.toRgbString();
	}, {});
	var BaseSelect = class extends BaseTool {
		constructor() {
			super();
			this.secondaryToolId = Move.TOOL_ID;
			this.startCol = null;
			this.startRow = null;
			this.lastMoveCol = null;
			this.lastMoveRow = null;
			this.selection = null;
			this.hasSelection = false;
			this.tooltipDescriptors = [
				{ description: "Drag the selection to move it. You may switch to other layers and frames." },
				{
					key: "ctrl+c",
					description: "Copy the selected area"
				},
				{
					key: "ctrl+v",
					description: "Paste the copied area"
				},
				{
					key: "shift",
					description: "Hold to move the content"
				}
			];
			$.subscribe(Events.SELECTION_DISMISSED, this.onSelectionDismissed_.bind(this));
		}
		/**
		* @override
		*/
		applyToolAt(col, row, frame, overlay, event) {
			this.startCol = col;
			this.startRow = row;
			this.lastMoveCol = col;
			this.lastMoveRow = row;
			if (!this.isInSelection(col, row)) {
				this.mode = "select";
				this.onSelectStart_(col, row, frame, overlay);
			} else {
				this.mode = "moveSelection";
				if (event.shiftKey && !this.isMovingContent_) {
					this.isMovingContent_ = true;
					$.publish(Events.CLIPBOARD_CUT);
					this.drawSelectionOnOverlay_(overlay);
				}
				this.onSelectionMoveStart_();
			}
		}
		/**
		* @override
		*/
		moveToolAt(col, row, frame, overlay) {
			if (this.mode == "select") this.onSelect_(col, row, frame, overlay);
			else if (this.mode == "moveSelection") this.onSelectionMove_(col, row, overlay);
		}
		/**
		* @override
		*/
		releaseToolAt(col, row, frame, overlay) {
			if (this.mode == "select") this.onSelectEnd_(col, row, frame, overlay);
			else if (this.mode == "moveSelection") this.onSelectionMoveEnd_(col, row, overlay);
		}
		/**
		* If we mouseover the selection draw inside the overlay frame, show the 'move' cursor
		* instead of the 'select' one. It indicates that we can move the selection by dragndroping it.
		* @override
		*/
		moveUnactiveToolAt(col, row, frame, overlay, event) {
			if (overlay.containsPixel(col, row)) if (this.isInSelection(col, row)) {
				document.body.classList.add(this.secondaryToolId);
				document.body.classList.remove(assertInitialized(this.toolId, "toolId"));
			} else {
				document.body.classList.add(assertInitialized(this.toolId, "toolId"));
				document.body.classList.remove(this.secondaryToolId);
			}
			if (!this.hasSelection) super.moveUnactiveToolAt(col, row, frame, overlay, event);
		}
		isInSelection(col, row) {
			return this.selection && this.selection.pixels.some(function(pixel) {
				return pixel.col === col && pixel.row === row;
			});
		}
		/**
		* Protected method, should be called when the selection is committed,
		* typically by clicking outside of the selected area.
		*/
		commitSelection() {
			if (this.isMovingContent_) {
				$.publish(Events.CLIPBOARD_PASTE);
				this.isMovingContent_ = false;
			}
			$.publish(Events.SELECTION_DISMISSED);
		}
		/**
		* Protected method, should be called when the selection is dismissed.
		*/
		onSelectionDismissed_() {
			assertInitialized(app.drawingController, "drawingController").overlayFrame.clear();
			this.hasSelection = false;
		}
		/**
		* For each pixel in the selection draw it in white transparent on the tool overlay
		* @protected
		*/
		drawSelectionOnOverlay_(overlay) {
			const pixels = assertInitialized(this.selection, "selection").pixels;
			for (let i = 0, l = pixels.length; i < l; i++) {
				const pixel = pixels[i];
				const color = pixel.color && pixel.color !== Constants.TRANSPARENT_COLOR ? this.getTransparentVariant_(intToColor(assertInitialized(pixel.color, "color"))) : Constants.SELECTION_TRANSPARENT_COLOR;
				overlay.setPixel(pixels[i].col, pixels[i].row, color);
			}
		}
		getTransparentVariant_(colorStr) {
			return transparentVariantMemo(colorStr);
		}
		/** @protected */
		onSelectStart_(_col, _row, _frame, _overlay) {}
		/** @protected */
		onSelect_(_col, _row, _frame, _overlay) {}
		/** @protected */
		onSelectEnd_(_col, _row, _frame, _overlay) {}
		/** @private */
		onSelectionMoveStart_() {}
		/** @private */
		onSelectionMove_(col, row, overlay) {
			const deltaCol = col - Number(this.lastMoveCol);
			const deltaRow = row - Number(this.lastMoveRow);
			assertInitialized(this.selection, "selection").move(deltaCol, deltaRow);
			overlay.clear();
			this.drawSelectionOnOverlay_(overlay);
			this.lastMoveCol = col;
			this.lastMoveRow = row;
		}
		/** @private */
		onSelectionMoveEnd_(col, row, overlay) {
			this.onSelectionMove_(col, row, overlay);
		}
	};
	//#endregion
	//#region src/js/tools/drawing/selection/AbstractDragSelect.ts
	var AbstractDragSelect = class extends BaseSelect {
		/** @override */
		onSelectStart_(col, row, _frame, overlay) {
			if (this.hasSelection) {
				this.hasSelection = false;
				this.commitSelection();
			} else {
				this.hasSelection = true;
				this.onDragSelectStart_(col, row);
				overlay.setPixel(col, row, this.getTransparentVariant_(Constants.SELECTION_TRANSPARENT_COLOR));
			}
		}
		/** @override */
		onSelect_(col, row, frame, overlay) {
			if (!this.hasSelection && (this.startCol !== col || this.startRow !== row)) {
				this.hasSelection = true;
				this.onDragSelectStart_(col, row);
			}
			if (this.hasSelection) this.onDragSelect_(col, row, frame, overlay);
		}
		/** @override */
		onSelectEnd_(col, row, frame, overlay) {
			if (this.hasSelection) this.onDragSelectEnd_(col, row, frame, overlay);
		}
		/** @private */
		startDragSelection_(col, row, overlay) {
			this.hasSelection = true;
			this.onDragSelectStart_(col, row);
			overlay.setPixel(col, row, this.getTransparentVariant_(Constants.SELECTION_TRANSPARENT_COLOR));
		}
		/** @protected */
		onDragSelectStart_(_col, _row, _frame, _overlay) {}
		/** @protected */
		onDragSelect_(_col, _row, _frame, _overlay) {}
		/** @protected */
		onDragSelectEnd_(_col, _row, _frame, _overlay) {}
	};
	//#endregion
	//#region src/js/tools/drawing/selection/LassoSelect.ts
	var LassoSelect = class extends AbstractDragSelect {
		constructor() {
			super();
			this.toolId = "tool-lasso-select";
			this.helpText = "Lasso selection";
			this.shortcut = Shortcuts.TOOL.LASSO_SELECT;
		}
		/** @override */
		onDragSelectStart_(col, row) {
			this.pixels = [{
				col,
				row
			}];
			this.startCol = col;
			this.startRow = row;
			this.previousCol = col;
			this.previousRow = row;
			$.publish(Events.DRAG_START, [col, row]);
		}
		/** @override */
		onDragSelect_(col, row, frame, overlay) {
			this.addPixel_(col, row, frame);
			const selection = new ShapeSelection(this.getLassoPixels_());
			this.setSelection_(selection, overlay);
		}
		/** @override */
		onDragSelectEnd_(col, row, frame, overlay) {
			this.addPixel_(col, row, frame);
			const selection = new LassoSelection(this.getLassoPixels_(), frame);
			this.setSelection_(selection, overlay);
			$.publish(Events.DRAG_END);
		}
		/**
		* Retrieve the lasso shape as an array of pixels. A line is added between the origin of the selection
		* and the last known coordinate to make sure the shape is closed.
		*
		* @return {Array} array of pixels corresponding to the whole lasso shape
		* @private
		*/
		getLassoPixels_() {
			const line = PixelUtils.getLinePixels(Number(this.previousCol), Number(this.startCol), Number(this.previousRow), Number(this.startRow));
			return assertInitialized(this.pixels, "pixels").concat(line);
		}
		/**
		* Add the provided pixel to the lasso pixels Array.
		* @private
		*/
		addPixel_(col, row, frame) {
			col = MathUtils.minmax(col, 0, frame.getWidth() - 1);
			row = MathUtils.minmax(row, 0, frame.getHeight() - 1);
			const interpolatedPixels = PixelUtils.getLinePixels(col, Number(this.previousCol), row, Number(this.previousRow));
			this.pixels = assertInitialized(this.pixels, "pixels").concat(interpolatedPixels);
			this.previousCol = col;
			this.previousRow = row;
		}
		/** @private */
		setSelection_(selection, overlay) {
			this.selection = selection;
			$.publish(Events.SELECTION_CREATED, [this.selection]);
			overlay.clear();
			this.drawSelectionOnOverlay_(overlay);
		}
	};
	//#endregion
	//#region src/js/selection/RectangularSelection.ts
	var RectangularSelection = class extends BaseSelection {
		constructor(x0, y0, x1, y1) {
			super();
			this.pixels = PixelUtils.getRectanglePixels(x0, y0, x1, y1);
		}
	};
	//#endregion
	//#region src/js/tools/drawing/selection/RectangleSelect.ts
	var RectangleSelect = class extends AbstractDragSelect {
		constructor() {
			super();
			this.toolId = "tool-rectangle-select";
			this.helpText = "Rectangle selection";
			this.shortcut = Shortcuts.TOOL.RECTANGLE_SELECT;
		}
		/** @override */
		onDragSelectStart_(col, row) {
			$.publish(Events.DRAG_START, [col, row]);
		}
		/**
		* When creating the rectangle selection, we clear the current overlayFrame and
		* redraw the current rectangle based on the origin coordinate and
		* the current mouse coordinate in sprite.
		* @override
		*/
		onDragSelect_(col, row, _frame, overlay) {
			overlay.clear();
			this.selection = new RectangularSelection(Number(this.startCol), Number(this.startRow), col, row);
			$.publish(Events.SELECTION_CREATED, [this.selection]);
			this.drawSelectionOnOverlay_(overlay);
		}
		/** @override */
		onDragSelectEnd_(col, row, frame, overlay) {
			this.onSelect_(col, row, frame, overlay);
			$.publish(Events.DRAG_END);
		}
	};
	//#endregion
	//#region src/js/tools/drawing/selection/ShapeSelect.ts
	var ShapeSelect = class extends BaseSelect {
		constructor() {
			super();
			this.toolId = "tool-shape-select";
			this.helpText = "Shape selection";
			this.shortcut = Shortcuts.TOOL.SHAPE_SELECT;
		}
		/**
		* For the shape select tool, you just need to click one time to create a selection.
		* So we just need to implement onSelectStart_ (no need for onSelect_ & onSelectEnd_)
		* @override
		*/
		onSelectStart_(col, row, frame, overlay) {
			if (this.hasSelection) {
				this.hasSelection = false;
				this.commitSelection();
			} else {
				this.hasSelection = true;
				this.selection = new ShapeSelection(PixelUtils.getSimilarConnectedPixelsFromFrame(frame, col, row));
				$.publish(Events.SELECTION_CREATED, [this.selection]);
				this.drawSelectionOnOverlay_(overlay);
			}
		}
	};
	//#endregion
	//#region src/js/utils/Array.ts
	var ArrayUtils = {
		find(array, filterFn) {
			let match = null;
			const filtered = (Array.isArray(array) ? array : []).filter(filterFn);
			if (filtered.length) match = filtered[0];
			return match;
		},
		chunk(array, chunksCount) {
			const chunks = [];
			chunksCount = Math.min(chunksCount, array.length);
			chunksCount = Math.max(1, chunksCount);
			const step = Math.round(array.length / chunksCount);
			for (let i = 0; i < chunksCount; i++) {
				const end = i == chunksCount - 1 ? array.length : (i + 1) * step;
				chunks.push(array.slice(i * step, end));
			}
			return chunks;
		}
	};
	//#endregion
	//#region src/js/controller/ToolController.ts
	var ToolController = class {
		constructor() {
			this.tools = [
				new SimplePen(),
				new VerticalMirrorPen(),
				new PaintBucket(),
				new ColorSwap(),
				new Eraser(),
				new Stroke(),
				new Rectangle(),
				new Circle(),
				new Move(),
				new ShapeSelect(),
				new RectangleSelect(),
				new LassoSelect(),
				new Lighten(),
				new DitheringTool(),
				new ColorPicker()
			];
			this.toolIconBuilder = new ToolIconBuilder();
		}
		/**
		* @public
		*/
		init() {
			this.createToolsDom_();
			this.addKeyboardShortcuts_();
			this.selectTool_(this.tools[0]);
			Dom.getElement("#tool-section").addEventListener("mousedown", this.onToolIconClicked_.bind(this));
			$.subscribe(Events.SELECT_TOOL, this.onSelectToolEvent_.bind(this));
			$.subscribe(Events.SHORTCUTS_CHANGED, this.createToolsDom_.bind(this));
		}
		/**
		* @private
		*/
		activateToolOnStage_(tool) {
			const stage = document.body;
			const previousSelectedToolClass = stage.dataset.selectedToolClass;
			if (previousSelectedToolClass) {
				stage.classList.remove(previousSelectedToolClass);
				stage.classList.remove(Move.TOOL_ID);
			}
			const toolId = assertInitialized(tool.toolId, "toolId");
			stage.classList.add(toolId);
			stage.dataset.selectedToolClass = toolId;
		}
		onSelectToolEvent_(_event, toolId) {
			const tool = this.getToolById_(toolId);
			if (tool) this.selectTool_(tool);
		}
		/**
		* @private
		*/
		selectTool_(tool) {
			this.currentSelectedTool = tool;
			this.activateToolOnStage_(this.currentSelectedTool);
			const selectedToolElement = document.querySelector("#tool-section .tool-icon.selected");
			if (selectedToolElement) selectedToolElement.classList.remove("selected");
			Dom.getElement("[data-tool-id=" + tool.toolId + "]").classList.add("selected");
			$.publish(Events.TOOL_SELECTED, [tool]);
		}
		/**
		* @private
		*/
		onToolIconClicked_(evt) {
			const target = evt.target;
			const clickedTool = Dom.getParentWithData(target, "toolId");
			if (clickedTool) {
				const toolId = String(clickedTool.dataset.toolId);
				const tool = this.getToolById_(toolId);
				if (tool) this.selectTool_(tool);
			}
		}
		onKeyboardShortcut_(toolId) {
			const tool = this.getToolById_(toolId);
			if (tool !== null) this.selectTool_(tool);
		}
		getToolById_(toolId) {
			return ArrayUtils.find(this.tools, function(tool) {
				return tool.toolId == toolId;
			});
		}
		/**
		* @private
		*/
		createToolsDom_() {
			let html = "";
			for (let i = 0; i < this.tools.length; i++) {
				const tool = this.tools[i];
				html += this.toolIconBuilder.createIcon(tool);
			}
			Dom.getElement("#tools-container").innerHTML = html;
		}
		addKeyboardShortcuts_() {
			for (let i = 0; i < this.tools.length; i++) {
				const tool = this.tools[i];
				assertInitialized(app.shortcutService, "shortcutService").registerShortcut(assertInitialized(tool.shortcut, "shortcut"), this.onKeyboardShortcut_.bind(this, assertInitialized(tool.toolId, "toolId")));
			}
		}
	};
	//#endregion
	//#region src/js/tools/transform/AbstractTransformTool.ts
	var AbstractTransformTool = class extends Tool {
		applyTransformation(evt) {
			const allFrames = evt.shiftKey;
			const allLayers = UserAgent.isMac ? evt.metaKey : evt.ctrlKey;
			this.applyTool_(evt.altKey, allFrames, allLayers);
			$.publish(Events.PISKEL_RESET);
			this.raiseSaveStateEvent({
				altKey: evt.altKey,
				allFrames,
				allLayers
			});
		}
		applyTool_(altKey, allFrames, allLayers) {
			const currentFrameIndex = assertInitialized(app.piskelController, "piskelController").getCurrentFrameIndex();
			(allLayers ? assertInitialized(app.piskelController, "piskelController").getLayers() : [assertInitialized(app.piskelController, "piskelController").getCurrentLayer()]).forEach((layer) => {
				(allFrames ? layer.getFrames() : [layer.getFrameAt(currentFrameIndex)]).forEach((frame) => {
					this.applyToolOnFrame_(frame, altKey);
				});
			});
		}
		replay(_frame, replayData) {
			this.applyTool_(replayData.altKey, replayData.allFrames, replayData.allLayers);
		}
	};
	//#endregion
	//#region src/js/tools/transform/TransformUtils.ts
	var TransformUtils = {
		VERTICAL: "VERTICAL",
		HORIZONTAL: "HORIZONTAL",
		flip(frame, axis) {
			const clone = frame.clone();
			const w = frame.getWidth();
			const h = frame.getHeight();
			clone.forEachPixel(function(color, x, y) {
				if (axis === TransformUtils.VERTICAL) x = w - x - 1;
				else if (axis === TransformUtils.HORIZONTAL) y = h - y - 1;
				frame.setPixel(x, y, color);
			});
			return frame;
		},
		CLOCKWISE: "clockwise",
		COUNTERCLOCKWISE: "counterclockwise",
		rotate(frame, direction) {
			const clone = frame.clone();
			const w = frame.getWidth();
			const h = frame.getHeight();
			const max = Math.max(w, h);
			const xDelta = Math.ceil((max - w) / 2);
			const yDelta = Math.ceil((max - h) / 2);
			frame.forEachPixel(function(_color, x, y) {
				const _x = x;
				const _y = y;
				x = x + xDelta;
				y = y + yDelta;
				const tmpX = x;
				const tmpY = y;
				if (direction === TransformUtils.CLOCKWISE) {
					x = tmpY;
					y = max - 1 - tmpX;
				} else if (direction === TransformUtils.COUNTERCLOCKWISE) {
					y = tmpX;
					x = max - 1 - tmpY;
				}
				x = x - xDelta;
				y = y - yDelta;
				const clonedColor = clone.getPixel(x, y);
				frame.setPixel(_x, _y, clonedColor === null ? Constants.TRANSPARENT_COLOR : clonedColor);
			});
			return frame;
		},
		getBoundaries(frames) {
			let minx = Infinity;
			let miny = Infinity;
			let maxx = 0;
			let maxy = 0;
			const transparentColorInt = colorToInt(Constants.TRANSPARENT_COLOR);
			frames.forEach(function(frame) {
				frame.forEachPixel(function(color, x, y) {
					if (color !== transparentColorInt) {
						minx = Math.min(minx, x);
						maxx = Math.max(maxx, x);
						miny = Math.min(miny, y);
						maxy = Math.max(maxy, y);
					}
				});
			});
			return {
				minx,
				maxx,
				miny,
				maxy
			};
		},
		moveFramePixels(frame, dx, dy) {
			const clone = frame.clone();
			frame.forEachPixel(function(_color, x, y) {
				const _x = x;
				const _y = y;
				x -= dx;
				y -= dy;
				const clonedColor = clone.getPixel(x, y);
				frame.setPixel(_x, _y, clonedColor === null ? Constants.TRANSPARENT_COLOR : clonedColor);
			});
		},
		center(frame) {
			const boundaries = TransformUtils.getBoundaries([frame]);
			const bw = (boundaries.maxx - boundaries.minx + 1) / 2;
			const bh = (boundaries.maxy - boundaries.miny + 1) / 2;
			const fw = frame.width / 2;
			const fh = frame.height / 2;
			const dx = Math.floor(fw - bw - boundaries.minx);
			const dy = Math.floor(fh - bh - boundaries.miny);
			TransformUtils.moveFramePixels(frame, dx, dy);
			return frame;
		}
	};
	//#endregion
	//#region src/js/tools/transform/Center.ts
	var Center = class extends AbstractTransformTool {
		constructor() {
			super();
			this.toolId = "tool-center";
			this.helpText = "Align image to the center";
			this.tooltipDescriptors = [{
				key: "ctrl",
				description: "Apply to all layers"
			}, {
				key: "shift",
				description: "Apply to all frames"
			}];
		}
		applyToolOnFrame_(frame) {
			TransformUtils.center(frame);
		}
	};
	//#endregion
	//#region src/js/tools/transform/Clone.ts
	var Clone = class extends AbstractTransformTool {
		constructor() {
			super();
			this.toolId = "tool-clone";
			this.helpText = "Clone current layer to all frames";
			this.tooltipDescriptors = [];
		}
		applyToolOnFrame_() {
			throw new Error("Clone copies whole frames in applyTool_");
		}
		applyTool_() {
			const ref = assertInitialized(app.piskelController, "piskelController").getCurrentFrame();
			assertInitialized(app.piskelController, "piskelController").getCurrentLayer().getFrames().forEach(function(frame) {
				if (frame !== ref) frame.setPixels(ref.getPixels());
			});
		}
	};
	//#endregion
	//#region src/js/utils/ResizeUtils.ts
	var ResizeUtils = {
		resizePiskel(piskel, options) {
			const fps = piskel.getFPS();
			const resizedLayers = piskel.getLayers().map(function(layer) {
				return ResizeUtils.resizeLayer(layer, options);
			});
			const resizedPiskel = Piskel.fromLayers(resizedLayers, fps, piskel.getDescriptor());
			resizedPiskel.savePath = piskel.savePath;
			return resizedPiskel;
		},
		resizeLayer(layer, options) {
			const opacity = layer.getOpacity();
			const resizedFrames = layer.getFrames().map(function(frame) {
				return ResizeUtils.resizeFrame(frame, options);
			});
			const resizedLayer = Layer.fromFrames(layer.getName(), resizedFrames);
			resizedLayer.setOpacity(opacity);
			return resizedLayer;
		},
		resizeFrame(frame, options) {
			const width = options.width;
			const height = options.height;
			const origin = options.origin;
			if (options.resizeContent) return FrameUtils.resize(frame, width, height, false);
			else {
				const resizedFrame = new Frame(width, height);
				frame.forEachPixel(function(color, x, y) {
					const translated = ResizeUtils.translateCoordinates(x, y, frame, resizedFrame, origin);
					if (resizedFrame.containsPixel(translated.x, translated.y)) resizedFrame.setPixel(translated.x, translated.y, color);
				});
				return resizedFrame;
			}
		},
		sanitizeSize(width, height, fallback) {
			const parsedWidth = parseInt(String(width), 10);
			const parsedHeight = parseInt(String(height), 10);
			return {
				width: parsedWidth > 0 ? Math.min(parsedWidth, Constants.MAX_DEFAULT_WIDTH) : fallback.width,
				height: parsedHeight > 0 ? Math.min(parsedHeight, Constants.MAX_DEFAULT_HEIGHT) : fallback.height
			};
		},
		translateCoordinates(x, y, frame, resizedFrame, origin) {
			return {
				x: ResizeUtils.translateX(x, frame.width, resizedFrame.width, origin),
				y: ResizeUtils.translateY(y, frame.height, resizedFrame.height, origin)
			};
		},
		translateX(x, width, resizedWidth, origin) {
			if (origin.indexOf("LEFT") != -1) return x;
			else if (origin.indexOf("RIGHT") != -1) return x - (width - resizedWidth);
			else return x - Math.round((width - resizedWidth) / 2);
		},
		translateY(y, height, resizedHeight, origin) {
			if (origin.indexOf("TOP") != -1) return y;
			else if (origin.indexOf("BOTTOM") != -1) return y - (height - resizedHeight);
			else return y - Math.round((height - resizedHeight) / 2);
		}
	};
	//#endregion
	//#region src/js/tools/transform/Crop.ts
	var Crop = class extends Tool {
		constructor() {
			super();
			this.toolId = "tool-crop";
			this.helpText = "Crop the sprite";
			this.tooltipDescriptors = [{ description: "Crop to fit the content or the selection. Applies to all frames and layers!" }];
		}
		applyTransformation() {
			const frames = this.getFrames_();
			let boundaries;
			if (assertInitialized(app.selectionManager, "selectionManager").currentSelection) boundaries = this.getBoundariesForSelection_();
			else boundaries = TransformUtils.getBoundaries(frames);
			if (this.applyTool_(frames, boundaries)) this.raiseSaveStateEvent({ boundaries });
		}
		replay(_frame, replayData) {
			const frames = this.getFrames_();
			this.applyTool_(frames, replayData.boundaries);
		}
		applyTool_(frames, boundaries) {
			if (boundaries.minx >= boundaries.maxx) return false;
			const currentPiskel = assertInitialized(app.piskelController, "piskelController").getPiskel();
			const width = 1 + boundaries.maxx - boundaries.minx;
			const height = 1 + boundaries.maxy - boundaries.miny;
			if (width === currentPiskel.getWidth() && height === currentPiskel.getHeight()) return false;
			frames.forEach(function(frame) {
				TransformUtils.moveFramePixels(frame, -boundaries.minx, -boundaries.miny);
			});
			const piskel = ResizeUtils.resizePiskel(currentPiskel, {
				width: 1 + boundaries.maxx - boundaries.minx,
				height: 1 + boundaries.maxy - boundaries.miny,
				origin: "TOP-LEFT",
				resizeContent: false
			});
			$.publish(Events.SELECTION_DISMISSED);
			assertInitialized(app.piskelController, "piskelController").setPiskel(piskel, {
				preserveState: true,
				noSnapshot: true
			});
			return true;
		}
		/**
		* Retrieve the list of frames for the current piskel in a single flat array.
		*/
		getFrames_() {
			return assertInitialized(app.piskelController, "piskelController").getPiskel().getLayers().map(function(l) {
				return l.getFrames();
			}).reduce(function(p, n) {
				return p.concat(n);
			});
		}
		/**
		* Retrieve a boundaries object {minx, maxx, miny, maxy} for the current selection.
		*/
		getBoundariesForSelection_() {
			const pixels = assertInitialized(assertInitialized(assertInitialized(app.selectionManager, "selectionManager").currentSelection, "currentSelection").pixels, "pixels");
			const exampleFrame = assertInitialized(app.piskelController, "piskelController").getPiskel().getLayerAt(0).getFrameAt(0);
			const FAKE_COLOR = 1;
			return TransformUtils.getBoundaries([{ forEachPixel: function(callback) {
				for (let i = 0; i < pixels.length; i++) {
					const pixel = pixels[i];
					if (exampleFrame.containsPixel(pixel.col, pixel.row)) callback(FAKE_COLOR, pixel.col, pixel.row);
				}
			} }]);
		}
	};
	//#endregion
	//#region src/js/tools/transform/Flip.ts
	var Flip = class extends AbstractTransformTool {
		constructor() {
			super();
			this.toolId = "tool-flip";
			this.helpText = "Flip horizontally";
			this.tooltipDescriptors = [
				{
					key: "alt",
					description: "Flip vertically"
				},
				{
					key: "ctrl",
					description: "Apply to all layers"
				},
				{
					key: "shift",
					description: "Apply to all frames"
				}
			];
		}
		applyToolOnFrame_(frame, altKey) {
			let axis;
			if (altKey) axis = TransformUtils.HORIZONTAL;
			else axis = TransformUtils.VERTICAL;
			TransformUtils.flip(frame, axis);
		}
	};
	//#endregion
	//#region src/js/tools/transform/Rotate.ts
	var Rotate = class extends AbstractTransformTool {
		constructor() {
			super();
			this.toolId = "tool-rotate";
			this.helpText = "Counter-clockwise rotation";
			this.tooltipDescriptors = [
				{
					key: "alt",
					description: "Clockwise rotation"
				},
				{
					key: "ctrl",
					description: "Apply to all layers"
				},
				{
					key: "shift",
					description: "Apply to all frames"
				}
			];
		}
		applyToolOnFrame_(frame, altKey) {
			let direction;
			if (altKey) direction = TransformUtils.CLOCKWISE;
			else direction = TransformUtils.COUNTERCLOCKWISE;
			TransformUtils.rotate(frame, direction);
		}
	};
	//#endregion
	//#region src/js/controller/TransformationsController.ts
	var SHOW_MORE_CLASS = "show-more";
	var TransformationsController = class {
		constructor() {
			this.tools = [
				new Flip(),
				new Rotate(),
				new Clone(),
				new Center(),
				new Crop()
			];
			this.toolIconBuilder = new ToolIconBuilder();
		}
		init() {
			this.container = Dom.getElement(".transformations-container");
			this.container.addEventListener("click", this.onTransformationClick_.bind(this));
			this.showMoreLink = Dom.getElement(".transformations-show-more-link", this.container);
			this.showMoreLink.addEventListener("click", this.toggleShowMoreTools_.bind(this));
			this.createToolsDom_();
			this.updateShowMoreLink_();
			$.subscribe(Events.USER_SETTINGS_CHANGED, this.onUserSettingsChange_.bind(this));
		}
		applyTool(toolId, evt) {
			this.tools.forEach((tool) => {
				if (tool.toolId === toolId) {
					$.publish(Events.TRANSFORMATION_EVENT, [toolId, evt]);
					tool.applyTransformation(evt);
				}
			});
		}
		onTransformationClick_(evt) {
			const toolId = evt.target.dataset.toolId;
			if (toolId) this.applyTool(toolId, evt);
		}
		toggleShowMoreTools_() {
			const showMore = UserSettings.get(UserSettings.TRANSFORM_SHOW_MORE);
			UserSettings.set(UserSettings.TRANSFORM_SHOW_MORE, !showMore);
		}
		onUserSettingsChange_(_evt, settingName) {
			if (settingName == UserSettings.TRANSFORM_SHOW_MORE) this.updateShowMoreLink_();
		}
		updateShowMoreLink_() {
			const showMoreEnabled = UserSettings.get(UserSettings.TRANSFORM_SHOW_MORE);
			assertInitialized(this.container, "container").classList.toggle(SHOW_MORE_CLASS, showMoreEnabled);
			assertInitialized(this.showMoreLink, "showMoreLink").classList.toggle("hidden", this.tools.length < 5);
		}
		createToolsDom_() {
			const html = this.tools.reduce((p, tool) => {
				return p + this.toolIconBuilder.createIcon(tool, "left");
			}, "");
			const toolsContainer = Dom.getElement(".tools-wrapper", this.container);
			toolsContainer.innerHTML = html;
		}
	};
	//#endregion
	//#region src/js/controller/UserWarningController.ts
	var UserWarningController = class UserWarningController {
		constructor(piskelController, currentColorsService) {
			this.piskelController = piskelController;
			this.currentColorsService = currentColorsService;
		}
		static showPerformanceInfoDialog() {
			$.publish(Events.DIALOG_SHOW, { dialogId: "performance-info" });
		}
		init() {
			$.subscribe(Events.PERFORMANCE_REPORT_CHANGED, this.onPerformanceReportChanged_.bind(this));
			this.performanceLinkEl = Dom.getElement(".performance-link");
			EventUtils.addEventListener(this.performanceLinkEl, "click", UserWarningController.showPerformanceInfoDialog, this);
			EventUtils.addEventListener(document.body, "click", this.onDocumentClick_, this);
		}
		/** Handles the link of the notification, whose markup is a plain string. */
		onDocumentClick_(evt) {
			if (evt.target.dataset.performanceInfoLink) UserWarningController.showPerformanceInfoDialog();
		}
		destroy() {
			EventUtils.removeAllEventListeners(this);
			this.performanceLinkEl = null;
		}
		onPerformanceReportChanged_(_event, report) {
			const shouldDisplayWarning = report.hasProblem();
			const isWarningDisplayed = assertInitialized(this.performanceLinkEl, "performanceLinkEl").classList.contains("visible");
			if (shouldDisplayWarning) assertInitialized(this.performanceLinkEl, "performanceLinkEl").classList.add("visible");
			else assertInitialized(this.performanceLinkEl, "performanceLinkEl").classList.remove("visible");
			if (shouldDisplayWarning && !isWarningDisplayed) $.publish(Events.SHOW_NOTIFICATION, [{
				content: "Performance problem detected, <a href=\"#\" style=\"color:red;\" data-performance-info-link=\"true\">learn more?</a>",
				hideDelay: 5e3
			}]);
		}
	};
	//#endregion
	//#region src/js/utils/DateUtils.ts
	var pad = function(num) {
		if (num < 10) return "0" + num;
		else return "" + num;
	};
	var DateUtils = { format(date, format) {
		date = new Date(date);
		return Template.replace(format, {
			Y: date.getFullYear(),
			M: pad(date.getMonth() + 1),
			D: pad(date.getDate()),
			H: pad(date.getHours()),
			m: pad(date.getMinutes()),
			s: pad(date.getSeconds())
		});
	} };
	//#endregion
	//#region src/js/controller/dialogs/AbstractDialogController.ts
	var AbstractDialogController = class {
		init(_initArgs) {
			const closeButton = Dom.getElement(".dialog-close");
			this.addEventListener(closeButton, "click", this.closeDialog);
		}
		addEventListener(el, type, cb) {
			EventUtils.addEventListener(el, type, cb, this);
		}
		destroy() {
			EventUtils.removeAllEventListeners(this);
		}
		closeDialog() {
			$.publish(Events.DIALOG_HIDE);
		}
		setTitle(title) {
			const dialogTitle = document.querySelector(".dialog-title");
			if (dialogTitle) dialogTitle.innerText = title;
		}
	};
	//#endregion
	//#region src/js/controller/dialogs/BrowseLocalController.ts
	var BrowseLocalController = class extends AbstractDialogController {
		init() {
			super.init();
			this.localStorageItemTemplate_ = Template.get("local-storage-item-template");
			this.service_ = app.indexedDbStorageService;
			this.piskelList = Dom.getElement(".local-piskel-list");
			this.fillLocalPiskelsList_();
			this.piskelList.addEventListener("click", this.onPiskelsListClick_.bind(this));
		}
		onPiskelsListClick_(evt) {
			const action = evt.target.getAttribute("data-action");
			const name = evt.target.getAttribute("data-name");
			if (action === "load") {
				if (window.confirm("This will erase your current piskel. Continue ?")) {
					assertInitialized(this.service_, "service_").load(String(name));
					this.closeDialog();
				}
			} else if (action === "delete") {
				if (window.confirm("This will permanently DELETE this piskel from your computer. Continue ?")) {
					assertInitialized(this.service_, "service_").remove(String(name));
					this.fillLocalPiskelsList_();
				}
			}
		}
		fillLocalPiskelsList_() {
			assertInitialized(this.service_, "service_").getKeys().then((keys) => {
				let html = "";
				keys.sort(function(k1, k2) {
					if (k1.date < k2.date) return 1;
					if (k1.date > k2.date) return -1;
					return 0;
				});
				keys.forEach((key) => {
					const date = DateUtils.format(key.date, "{{Y}}/{{M}}/{{D}} {{H}}:{{m}}");
					html += Template.replace(assertInitialized(this.localStorageItemTemplate_, "localStorageItemTemplate_"), {
						name: key.name,
						date
					});
				});
				const tableBody_ = assertInitialized(this.piskelList, "piskelList").tBodies[0];
				tableBody_.innerHTML = html;
			});
		}
	};
	//#endregion
	//#region src/js/controller/dialogs/CheatsheetController.ts
	var SHORTCUT_EDITING_CLASSNAME = "cheatsheet-shortcut-editing";
	var CheatsheetController = class extends AbstractDialogController {
		init() {
			super.init();
			this.cheatsheetEl = Dom.getElement("#cheatsheetContainer");
			this.eventTrapInput = Dom.getElement("#cheatsheetEventTrap");
			this.addEventListener(".cheatsheet-restore-defaults", "click", this.onRestoreDefaultsClick_);
			this.addEventListener(this.cheatsheetEl, "click", this.onCheatsheetClick_);
			this.addEventListener(this.eventTrapInput, "keydown", this.onEventTrapKeydown_);
			this.onShortcutsChanged_ = this.onShortcutsChanged_.bind(this);
			$.subscribe(Events.SHORTCUTS_CHANGED, this.onShortcutsChanged_);
			this.initMarkup_();
			Dom.getElement(".cheatsheet-helptext").setAttribute("title", this.getHelptextTitle_());
		}
		destroy() {
			assertInitialized(this.eventTrapInput, "eventTrapInput").blur();
			$.unsubscribe(Events.SHORTCUTS_CHANGED, this.onShortcutsChanged_);
			this.cheatsheetEl = null;
			super.destroy();
		}
		onRestoreDefaultsClick_() {
			if (window.confirm("Replace all custom shortcuts by the default Piskel shortcuts ?")) assertInitialized(app.shortcutService, "shortcutService").restoreDefaultShortcuts();
		}
		onShortcutsChanged_() {
			this.initMarkup_();
		}
		onCheatsheetClick_(evt) {
			const shortcutEl = Dom.getParentWithData(evt.target, "shortcutId");
			if (!shortcutEl) {
				Dom.removeClass(SHORTCUT_EDITING_CLASSNAME);
				return;
			}
			const shortcutId = String(shortcutEl.dataset.shortcutId);
			const shortcut = assertInitialized(app.shortcutService, "shortcutService").getShortcutById(shortcutId);
			if (shortcut === null) throw new Error("Unknown shortcut: " + shortcutId);
			if (shortcutEl.classList.contains(SHORTCUT_EDITING_CLASSNAME)) {
				Dom.removeClass(SHORTCUT_EDITING_CLASSNAME);
				assertInitialized(this.eventTrapInput, "eventTrapInput").blur();
			} else if (shortcut.isEditable()) {
				Dom.removeClass(SHORTCUT_EDITING_CLASSNAME);
				shortcutEl.classList.add(SHORTCUT_EDITING_CLASSNAME);
				assertInitialized(this.eventTrapInput, "eventTrapInput").focus();
			}
		}
		onEventTrapKeydown_(evt) {
			const shortcutEl = document.querySelector("." + SHORTCUT_EDITING_CLASSNAME);
			if (!shortcutEl) return;
			const shortcutKeyObject = KeyUtils.createKeyFromEvent(evt);
			if (!shortcutKeyObject) return;
			const shortcutKeyString = KeyUtils.stringify(shortcutKeyObject);
			const shortcutId = String(shortcutEl.dataset.shortcutId);
			const shortcut = assertInitialized(app.shortcutService, "shortcutService").getShortcutById(shortcutId);
			if (shortcut === null) throw new Error("Unknown shortcut: " + shortcutId);
			assertInitialized(app.shortcutService, "shortcutService").updateShortcut(shortcut, shortcutKeyString);
			shortcutEl.classList.remove(SHORTCUT_EDITING_CLASSNAME);
			assertInitialized(this.eventTrapInput, "eventTrapInput").blur();
			evt.preventDefault();
		}
		initMarkup_() {
			this.initMarkupForCategory_("TOOL", ".cheatsheet-tool-shortcuts", this.getToolIconClass_);
			this.initMarkupForCategory_("MISC", ".cheatsheet-misc-shortcuts");
			this.initMarkupForCategory_("COLOR", ".cheatsheet-color-shortcuts");
			this.initMarkupForCategory_("SELECTION", ".cheatsheet-selection-shortcuts");
			this.initMarkupForCategory_("STORAGE", ".cheatsheet-storage-shortcuts");
		}
		getToolIconClass_(shortcut) {
			return "tool-icon cheatsheet-icon-" + shortcut.getId();
		}
		initMarkupForCategory_(category, container, iconClassProvider) {
			const shortcutMap = Shortcuts[category];
			const descriptors = Object.keys(shortcutMap).map((shortcutKey) => {
				return this.toDescriptor_(shortcutMap[shortcutKey], iconClassProvider);
			});
			this.initMarkupForDescriptors_(descriptors, container);
		}
		toDescriptor_(shortcut, iconClassProvider) {
			return {
				shortcut,
				iconClass: typeof iconClassProvider == "function" ? iconClassProvider(shortcut) : ""
			};
		}
		initMarkupForDescriptors_(descriptors, containerSelector) {
			const container = document.querySelector(containerSelector);
			if (!container) return;
			container.innerHTML = descriptors.map(this.getMarkupForDescriptor_.bind(this)).join("");
		}
		getMarkupForDescriptor_(descriptor) {
			const shortcutTemplate = Template.get("cheatsheet-shortcut-template");
			const shortcut = descriptor.shortcut;
			const description = shortcut.isCustom() ? shortcut.getDescription() + " *" : shortcut.getDescription();
			const shortcutClasses = [];
			if (shortcut.isUndefined()) shortcutClasses.push("cheatsheet-shortcut-undefined");
			if (shortcut.isEditable()) shortcutClasses.push("cheatsheet-shortcut-editable");
			const title = shortcut.isEditable() ? "Click to edit the key" : "Shortcut cannot be remapped";
			return Template.replace(shortcutTemplate, {
				id: shortcut.getId(),
				title,
				icon: descriptor.iconClass,
				description,
				"!key!": this.formatKey_(shortcut.getDisplayKey()),
				className: shortcutClasses.join(" ")
			});
		}
		formatKey_(key) {
			if (UserAgent.isMac) {
				key = key.replace("ctrl", "cmd");
				key = key.replace("alt", "option");
			}
			key = key.replace(/left/i, "&larr;");
			key = key.replace(/up/i, "&uarr;");
			key = key.replace(/right/i, "&rarr;");
			key = key.replace(/down/i, "&darr;");
			key = key.replace(/>/g, "&gt;");
			key = key.replace(/</g, "&lt;");
			key = key.replace(/([^ ])\+([^ ])/g, "$1 + $2");
			return key;
		}
		getHelptextTitle_() {
			let helptextTitle = [
				"Click on a shortcut to change the key.",
				"When the shortcut blinks, press the key on your keyboard to assign it.",
				"White shortcuts can not be edited.",
				"Click on 'Restore default shortcuts' to erase all custom shortcuts."
			].reduce(function(p, n) {
				return p + "<div class=\"cheatsheet-helptext-tooltip-item\">" + n + "</div>";
			}, "");
			helptextTitle = "<div class=\"cheatsheet-helptext-tooltip\">" + helptextTitle + "</div>";
			return helptextTitle;
		}
	};
	//#endregion
	//#region src/js/model/Palette.ts
	var Palette = class Palette {
		constructor(id, name, colors) {
			this.id = id;
			this.name = name;
			this.colors = colors;
		}
		static fromObject(paletteObj) {
			const colors = paletteObj.colors.slice(0, paletteObj.colors.length);
			return new Palette(paletteObj.id, paletteObj.name, colors);
		}
		getColors() {
			return this.colors;
		}
		setColors(colors) {
			this.colors = colors;
		}
		get(index) {
			return this.colors[index];
		}
		set(index, color) {
			this.colors[index] = color;
		}
		add(color) {
			this.colors.push(color);
		}
		size() {
			return this.colors.length;
		}
		removeAt(index) {
			this.colors.splice(index, 1);
		}
		move(oldIndex, newIndex) {
			this.colors.splice(newIndex, 0, this.colors.splice(oldIndex, 1)[0]);
		}
	};
	//#endregion
	//#region src/js/service/palette/PaletteGplWriter.ts
	var PaletteGplWriter = class {
		constructor(palette) {
			this.palette = palette;
		}
		write() {
			const lines = [];
			lines.push("GIMP Palette");
			lines.push("Name: " + this.palette.name);
			lines.push("Columns: 0");
			lines.push("#");
			this.palette.getColors().forEach((color) => {
				lines.push(this.writeColorLine(color));
			});
			lines.push("\r\n");
			return lines.join("\r\n");
		}
		writeColorLine(color) {
			const rgb = window.tinycolor(color).toRgb();
			const strBuffer = [];
			strBuffer.push(this.padString(rgb.r, 3));
			strBuffer.push(this.padString(rgb.g, 3));
			strBuffer.push(this.padString(rgb.b, 3));
			strBuffer.push("Untitled");
			return strBuffer.join(" ");
		}
		padString(value, size) {
			const str = value.toString();
			return new Array(1 + size - str.length).join(" ") + str;
		}
	};
	//#endregion
	//#region src/js/utils/Base64.ts
	var base64Ranks;
	if (Uint8Array) base64Ranks = new Uint8Array([
		62,
		-1,
		-1,
		-1,
		63,
		52,
		53,
		54,
		55,
		56,
		57,
		58,
		59,
		60,
		61,
		-1,
		-1,
		-1,
		0,
		-1,
		-1,
		-1,
		0,
		1,
		2,
		3,
		4,
		5,
		6,
		7,
		8,
		9,
		10,
		11,
		12,
		13,
		14,
		15,
		16,
		17,
		18,
		19,
		20,
		21,
		22,
		23,
		24,
		25,
		-1,
		-1,
		-1,
		-1,
		-1,
		-1,
		26,
		27,
		28,
		29,
		30,
		31,
		32,
		33,
		34,
		35,
		36,
		37,
		38,
		39,
		40,
		41,
		42,
		43,
		44,
		45,
		46,
		47,
		48,
		49,
		50,
		51
	]);
	var Base64 = {
		toText(base64) {
			return window.atob(base64.replace(/data\:.*?\;base64\,/, ""));
		},
		decode(base64) {
			let outptr = 0;
			const last = [0, 0];
			let state = 0;
			let save = 0;
			let undef;
			let len = base64.length;
			let i = 0;
			const buffer = new Uint8Array(len / 4 * 3 | 0);
			while (len--) {
				const code = base64.charCodeAt(i++);
				const rank = base64Ranks[code - 43];
				if (rank !== 255 && rank !== undef) {
					last[1] = last[0];
					last[0] = code;
					save = save << 6 | rank;
					state++;
					if (state === 4) {
						buffer[outptr++] = save >>> 16;
						if (last[1] !== 61) buffer[outptr++] = save >>> 8;
						if (last[0] !== 61) buffer[outptr++] = save;
						state = 0;
					}
				}
			}
			return buffer.buffer;
		}
	};
	//#endregion
	//#region src/js/utils/BlobUtils.ts
	var BASE64_REGEX = /\s*;\s*base64\s*(?:;|$)/i;
	var BlobUtils = {
		dataToBlob(dataURI, type, callback) {
			const headerEnd = dataURI.indexOf(",");
			const data = dataURI.substring(headerEnd + 1);
			const blobData = BASE64_REGEX.test(dataURI.substring(0, headerEnd)) ? Base64.decode(data) : decodeURIComponent(data);
			callback(new Blob([blobData], { type }));
		},
		canvasToBlob(canvas, callback, type, quality) {
			const mimeType = type || "image/png";
			if (canvas.mozGetAsFile) callback(canvas.mozGetAsFile("canvas", mimeType));
			else {
				const dataURI = canvas.toDataURL(mimeType, quality);
				BlobUtils.dataToBlob(dataURI, mimeType, callback);
			}
		},
		stringToBlob(string, callback, type) {
			const mimeType = type || "text/plain";
			BlobUtils.dataToBlob("data:" + mimeType + "," + string, mimeType, callback);
		}
	};
	//#endregion
	//#region src/js/utils/FileUtils.ts
	var stopPropagation = function(e) {
		e.stopPropagation();
	};
	var FileUtils = {
		readFile(file, callback) {
			const reader = new FileReader();
			reader.addEventListener("loadend", function() {
				callback(String(reader.result));
			});
			reader.readAsDataURL(file);
		},
		readFileAsArrayBuffer(file, callback) {
			const reader = new FileReader();
			reader.addEventListener("loadend", function() {
				callback(reader.result);
			});
			reader.readAsArrayBuffer(file);
		},
		readImageFile(file, callback) {
			FileUtils.readFile(file, function(content) {
				const image = new Image();
				image.onload = callback.bind(null, image);
				image.src = content;
			});
		},
		downloadAsFile(content, filename) {
			const downloadLink = document.createElement("a");
			const url = window.URL.createObjectURL(content);
			downloadLink.setAttribute("href", url);
			downloadLink.setAttribute("download", filename);
			document.body.appendChild(downloadLink);
			downloadLink.addEventListener("click", stopPropagation);
			downloadLink.click();
			downloadLink.removeEventListener("click", stopPropagation);
			document.body.removeChild(downloadLink);
		}
	};
	//#endregion
	//#region src/js/widgets/HslRgbColorPicker.ts
	var isTinyColor = function(color) {
		return typeof color == "object" && color.hasOwnProperty("_tc_id");
	};
	var isHsvColor = function(color) {
		return [
			"h",
			"s",
			"v"
		].every(color.hasOwnProperty.bind(color));
	};
	var HslRgbColorPicker = class {
		constructor(container, colorUpdatedCallback) {
			this.container = container;
			this.colorUpdatedCallback = colorUpdatedCallback;
			this.tinyColor = null;
			this.hsvColor = null;
			this.rgbColor = null;
			this.lastInputTimestamp_ = 0;
		}
		init() {
			const isFirefox = UserAgent.isFirefox;
			const changeEvent = UserAgent.isChrome || isFirefox ? "input" : "change";
			EventUtils.addEventListener(assertInitialized(this.container, "container"), changeEvent, this.onPickerChange_, this);
			EventUtils.addEventListener(assertInitialized(this.container, "container"), "keydown", this.onPickerChange_, this);
			this.onBlur_ = this.onBlur_.bind(this);
			assertInitialized(this.container, "container").addEventListener("blur", this.onBlur_, true);
			this.spectrumEl = Dom.getElement(".color-picker-spectrum", assertInitialized(this.container, "container"));
			$(this.spectrumEl).spectrum({
				flat: true,
				showButtons: false,
				move: this.setColor.bind(this),
				change: this.setColor.bind(this)
			});
			this.setColor("#000000");
		}
		destroy() {
			EventUtils.removeAllEventListeners(this);
			assertInitialized(this.container, "container").removeEventListener("blur", this.onBlur_, true);
			$(this.spectrumEl).spectrum("destroy");
			this.container = null;
			this.spectrumEl = null;
		}
		/**
		* Handle change event on all color inputs
		*/
		onPickerChange_(evt) {
			const target = evt.target;
			if (target.dataset.dimension) {
				const model = target.dataset.model;
				const dimension = target.dataset.dimension;
				const value = target.value;
				this.updateColor_(value, model, dimension);
			}
		}
		/**
		* Handle up/down arrow keydown on text inputs
		*/
		onKeydown_(evt) {
			const target = evt.target;
			const type = target.getAttribute("type");
			if (type === null) throw new Error("The color picker input has no type attribute");
			if (type.toLowerCase() === "text" && target.dataset.dimension) {
				const model = target.dataset.model;
				if (model === "rgb" || model === "hsv") {
					const increment = this.getIncrement_(evt);
					if (increment) {
						const dimension = target.dataset.dimension;
						const value = parseInt(target.value, 10);
						this.updateColor_(value + increment, model, dimension);
					}
				}
			}
		}
		getIncrement_(evt) {
			let increment = 0;
			const key = KeycodeTranslator.toChar(evt.keyCode);
			if (key === "up") increment = 1;
			else if (key === "down") increment = -1;
			if (evt.shiftKey) increment = increment * 5;
			return increment;
		}
		updateColor_(inputValue, model, dimension) {
			const value = this.toModelValue_(inputValue, model, dimension);
			if (model === "hsv" || model === "rgb") {
				if (typeof value === "number" && !isNaN(value)) {
					const color = this.getColor_(model);
					color[dimension] = this.normalizeDimension_(value, dimension);
					this.setColor(color);
				}
			} else if (model === "hex") {
				if (typeof value === "string" && /^#([a-f0-9]{3}){1,2}$/i.test(value)) this.setColor(value);
			}
		}
		onBlur_(evt) {
			const target = evt.target;
			const type = target.getAttribute("type");
			if (type === null) throw new Error("The color picker input has no type attribute");
			if (type.toLowerCase() === "text" && target.dataset.dimension) {
				const model = target.dataset.model;
				const dimension = target.dataset.dimension;
				target.value = String(this.toInputValue_(model, dimension));
			}
		}
		setColor(inputColor) {
			if (!this.unplugged) {
				this.unplugged = true;
				this.hsvColor = this.toHsvColor_(inputColor);
				const tinyColor = this.toTinyColor_(inputColor);
				this.tinyColor = tinyColor;
				this.rgbColor = tinyColor.toRgb();
				this.updateInputs();
				$(".color-picker-spectrum").spectrum("set", tinyColor);
				this.colorUpdatedCallback(tinyColor);
				this.unplugged = false;
			}
		}
		updateInputs() {
			const inputs = assertInitialized(this.container, "container").querySelectorAll("input");
			for (let i = 0; i < inputs.length; i++) {
				const input = inputs[i];
				const dimension = input.dataset.dimension;
				const model = input.dataset.model;
				const value = this.toInputValue_(model, dimension);
				if (input.value != value) input.value = String(value);
				if (input.getAttribute("type") === "range") this.updateSliderBackground(input);
			}
		}
		toInputValue_(model, dimension) {
			let value;
			if (model === "rgb" || model === "hsv") {
				value = this.getColor_(model)[assertInitialized(dimension, "dimension")];
				if (dimension === "v" || dimension === "s") value = 100 * value;
				value = Math.round(value);
			} else if (model === "hex") value = assertInitialized(this.tinyColor, "tinyColor").toHexString(true);
			return value;
		}
		toModelValue_(value, model, dimension) {
			let modelValue;
			if (model === "rgb" || model === "hsv") {
				modelValue = parseInt(String(value), 10);
				if (dimension === "v" || dimension === "s") modelValue = modelValue / 100;
			} else if (model === "hex") modelValue = value;
			return modelValue;
		}
		toTinyColor_(color) {
			if (isTinyColor(color)) return color;
			else return window.tinycolor(copy(color));
		}
		toHsvColor_(color) {
			if (isHsvColor(color)) return {
				h: this.normalizeDimension_(color.h, "h"),
				s: this.normalizeDimension_(color.s, "s"),
				v: this.normalizeDimension_(color.v, "v")
			};
			else return this.toTinyColor_(color).toHsv();
		}
		normalizeDimension_(value, dimension) {
			const range = this.getDimensionRange_(dimension);
			return Math.max(range[0], Math.min(range[1], value));
		}
		/**
		* Update background colors for range inputs
		*/
		updateSliderBackground(slider) {
			const dimension = assertInitialized(slider.dataset.dimension, "dimension");
			const model = slider.dataset.model;
			if (!(dimension === "h")) {
				const colors = this.getSliderBackgroundColors_(model, dimension);
				slider.style.backgroundImage = "linear-gradient(to right, " + colors.start + " 0, " + colors.end + " 100%)";
			}
		}
		getSliderBackgroundColors_(model, dimension) {
			const color = this.getColor_(model);
			const start = copy(color);
			const end = copy(color);
			const range = this.getDimensionRange_(dimension);
			start[dimension] = range[0];
			end[dimension] = range[1];
			return {
				start: window.tinycolor(start).toRgbString(),
				end: window.tinycolor(end).toRgbString()
			};
		}
		getDimensionRange_(d) {
			if (d === "h") return [0, 359];
			else if (d === "s" || d === "v") return [0, 1];
			else if (d === "r" || d === "g" || d === "b") return [0, 255];
			throw new Error("Unknown color dimension: " + d);
		}
		getColor_(model) {
			let color;
			if (model === "hsv") color = this.hsvColor;
			else if (model === "rgb") color = this.rgbColor;
			return assertInitialized(color, "color");
		}
	};
	//#endregion
	//#region src/js/widgets/ColorsList.ts
	var DEFAULT_COLOR = "#000000";
	var ColorsList = class {
		constructor(container) {
			this.selectedIndex = -1;
			this.palette = new Palette("tmp", "tmp", []);
			this.container = container;
			this.colorsList = Dom.getElement(".colors-list", this.container);
			this.colorPreviewEl = Dom.getElement(".color-preview", this.container);
			$(container).sortable({
				placeholder: "colors-list-drop-proxy",
				update: this.onColorDrop_.bind(this),
				items: ".create-palette-color"
			});
			EventUtils.addEventListener(this.colorsList, "click", this.onColorContainerClick_, this);
			this.hslRgbColorPicker = new HslRgbColorPicker(Dom.getElement(".color-picker-container", container), this.onColorUpdated_.bind(this));
			this.hslRgbColorPicker.init();
		}
		setColors(colors) {
			if (colors.length === 0) colors.push(DEFAULT_COLOR);
			this.palette.setColors(colors);
			this.selectColor_(0);
			this.refresh_();
		}
		getColors() {
			return this.palette.getColors();
		}
		destroy() {
			EventUtils.removeAllEventListeners(this);
			$(this.container).sortable("destroy");
			this.hslRgbColorPicker.destroy();
			this.container = null;
			this.colorsList = null;
			this.colorPreviewEl = null;
		}
		/**
		* Lightweight refresh only changing the color of one element of the palette color list
		*/
		refreshColorElement_(index) {
			const color = this.palette.get(this.selectedIndex);
			const element = document.querySelector("[data-palette-index=\"" + index + "\"]");
			if (element) {
				element.style.background = color;
				element.classList.toggle("light-color", this.isLight_(color));
			}
		}
		onColorContainerClick_(evt) {
			const target = evt.target;
			if (target.classList.contains("create-palette-color")) this.onPaletteColorClick_(target);
			else if (target.classList.contains("create-palette-new-color")) this.onNewColorClick_();
			else if (target.classList.contains("create-palette-remove-color")) this.onRemoveColorClick_(target);
			this.refresh_();
		}
		onColorUpdated_(color) {
			const strColor = color.toHexString();
			assertInitialized(this.colorPreviewEl, "colorPreviewEl").style.background = strColor;
			if (this.palette) {
				this.palette.set(this.selectedIndex, strColor);
				this.refreshColorElement_(this.selectedIndex);
			}
		}
		onPaletteColorClick_(target) {
			const index = parseInt(String(target.dataset.paletteIndex), 10);
			this.selectColor_(index);
		}
		onRemoveColorClick_(target) {
			const colorElement = assertInitialized(target.parentElement, "parentElement");
			const index = parseInt(String(colorElement.dataset.paletteIndex), 10);
			this.removeColor_(index);
		}
		onNewColorClick_() {
			const newColor = this.palette.get(this.selectedIndex) || "#000000";
			this.palette.add(newColor);
			this.selectColor_(this.palette.size() - 1);
		}
		refresh_() {
			let html = "";
			const tpl = Template.get("create-palette-color-template");
			this.palette.getColors().forEach((color, index) => {
				const isSelected = index === this.selectedIndex;
				html += Template.replace(tpl, {
					color,
					index,
					":selected": isSelected,
					":light-color": this.isLight_(String(color))
				});
			});
			html += "<li class=\"create-palette-new-color\">+</li>";
			assertInitialized(this.colorsList, "colorsList").innerHTML = html;
		}
		selectColor_(index) {
			this.selectedIndex = index;
			this.hslRgbColorPicker.setColor(this.palette.get(index));
		}
		removeColor_(index) {
			this.palette.removeAt(index);
			this.refresh_();
		}
		isLight_(color) {
			const rgb = window.tinycolor(color).toRgb();
			return rgb.r + rgb.b + rgb.g > 384;
		}
		onColorDrop_(_evt, drop) {
			const colorElement = drop.item.get(0);
			const oldIndex = parseInt(String(colorElement.dataset.paletteIndex), 10);
			const colors = document.querySelectorAll(".create-palette-color");
			const newIndex = Array.prototype.indexOf.call(colors, colorElement);
			this.palette.move(oldIndex, newIndex);
			this.selectedIndex = newIndex;
			this.refresh_();
		}
	};
	//#endregion
	//#region src/js/controller/dialogs/CreatePaletteController.ts
	var CreatePaletteController = class extends AbstractDialogController {
		constructor() {
			super();
			this.paletteService = app.paletteService;
			this.paletteImportService = app.paletteImportService;
		}
		init(paletteId) {
			super.init();
			this.hiddenFileInput = Dom.getElement(".create-palette-import-input");
			this.nameInput = Dom.getElement("input[name=\"palette-name\"]");
			const buttonsContainer = Dom.getElement(".create-palette-actions");
			const deleteButton = Dom.getElement(".create-palette-delete");
			const downloadButton = Dom.getElement(".create-palette-download-button");
			const importFileButton = Dom.getElement(".create-palette-import-button");
			this.addEventListener(this.nameInput, "input", this.onNameInputChange_);
			this.addEventListener(this.hiddenFileInput, "change", this.onFileInputChange_);
			this.addEventListener(buttonsContainer, "click", this.onButtonClick_);
			this.addEventListener(downloadButton, "click", this.onDownloadButtonClick_);
			this.addEventListener(importFileButton, "click", this.onImportFileButtonClick_);
			this.colorsListWidget = new ColorsList(Dom.getElement(".colors-container"));
			let palette;
			const isCurrentColorsPalette = paletteId == Constants.CURRENT_COLORS_PALETTE_ID;
			if (paletteId && !isCurrentColorsPalette) {
				importFileButton.style.display = "none";
				this.setTitle("Edit Palette");
				const paletteData = assertInitialized(assertInitialized(this.paletteService, "paletteService").getPaletteById(paletteId), "paletteObject");
				palette = new Palette(paletteData.id, paletteData.name, paletteData.getColors().slice());
			} else {
				downloadButton.style.display = "none";
				deleteButton.style.display = "none";
				this.setTitle("Create Palette");
				const uuid = Uuid.generate();
				if (isCurrentColorsPalette) palette = new Palette(uuid, "Current colors clone", this.getCurrentColors_());
				else palette = new Palette(uuid, "New palette", []);
			}
			this.setPalette_(palette);
		}
		getCurrentColors_() {
			return assertInitialized(assertInitialized(this.paletteService, "paletteService").getPaletteById(Constants.CURRENT_COLORS_PALETTE_ID), "palette").getColors();
		}
		setPalette_(palette) {
			this.palette = palette;
			assertInitialized(this.nameInput, "nameInput").value = unescapeHtml(palette.name);
			assertInitialized(this.colorsListWidget, "colorsListWidget").setColors(palette.getColors());
		}
		destroy() {
			assertInitialized(this.colorsListWidget, "colorsListWidget").destroy();
			super.destroy();
			this.nameInput = null;
			this.hiddenFileInput = null;
		}
		onButtonClick_(evt) {
			const target = evt.target;
			if (target.dataset.action === "submit") this.saveAndSelectPalette_();
			else if (target.dataset.action === "cancel") this.closeDialog();
			else if (target.dataset.action === "delete") this.deletePalette_();
		}
		saveAndSelectPalette_() {
			assertInitialized(this.palette, "palette").setColors(assertInitialized(this.colorsListWidget, "colorsListWidget").getColors());
			assertInitialized(this.paletteService, "paletteService").savePalette(assertInitialized(this.palette, "palette"));
			UserSettings.set(UserSettings.SELECTED_PALETTE, assertInitialized(this.palette, "palette").id);
			this.closeDialog();
		}
		deletePalette_() {
			if (window.confirm("Are you sure you want to delete palette " + assertInitialized(this.palette, "palette").name)) {
				assertInitialized(this.paletteService, "paletteService").deletePaletteById(assertInitialized(this.palette, "palette").id);
				UserSettings.set(UserSettings.SELECTED_PALETTE, Constants.CURRENT_COLORS_PALETTE_ID);
				this.closeDialog();
			}
		}
		onDownloadButtonClick_() {
			const paletteAsString = new PaletteGplWriter(assertInitialized(this.palette, "palette")).write();
			BlobUtils.stringToBlob(paletteAsString, (blob) => {
				FileUtils.downloadAsFile(blob, assertInitialized(this.palette, "palette").name + ".gpl");
			}, "application/json");
		}
		onImportFileButtonClick_() {
			assertInitialized(this.hiddenFileInput, "hiddenFileInput").click();
		}
		onFileInputChange_() {
			const files = assertInitialized(this.hiddenFileInput, "hiddenFileInput").files;
			if (files && files.length == 1) assertInitialized(this.paletteImportService, "paletteImportService").read(files[0], this.setPalette_.bind(this), this.displayErrorMessage_.bind(this));
		}
		displayErrorMessage_(message) {
			message = "Could not import palette : " + message;
			$.publish(Events.SHOW_NOTIFICATION, [{ content: message }]);
			window.setTimeout(function() {
				$.publish(Events.HIDE_NOTIFICATION);
			}, 2e3);
		}
		onNameInputChange_() {
			assertInitialized(this.palette, "palette").name = escapeHtml(assertInitialized(this.nameInput, "nameInput").value);
		}
	};
	//#endregion
	//#region src/js/controller/dialogs/PerformanceInfoController.ts
	var PerformanceInfoController = class extends AbstractDialogController {
		init() {
			super.init();
		}
	};
	//#endregion
	//#region src/js/controller/dialogs/UnsupportedBrowserController.ts
	var UnsupportedBrowserController = class extends AbstractDialogController {
		init() {
			super.init();
			const currentUserAgentElement = Dom.getElement("#current-user-agent");
			currentUserAgentElement.innerText = UserAgent.getDisplayName();
		}
	};
	//#endregion
	//#region src/js/widgets/Wizard.ts
	var TRANSITION_DURATION = 200;
	var Wizard = class {
		constructor(steps, container) {
			this.steps = steps;
			this.container = container;
			this.wrapper = document.createElement("div");
			this.wrapper.classList.add("wizard-wrapper");
			this.currentStep = null;
			this.previousSteps = [];
		}
		init() {
			Object.keys(this.steps).forEach((stepName) => {
				const step = this.steps[stepName];
				step.el.classList.add("wizard-step");
				this.wrapper.appendChild(step.el);
			});
			this.container.appendChild(this.wrapper);
		}
		getStep(stepName) {
			return this.steps[stepName];
		}
		getCurrentStep() {
			return assertInitialized(this.currentStep, "currentStep");
		}
		/**
		* Transition to the step cirresponding to the provided step name.
		* Animation will be skipped if no current step is displayed.
		*/
		goTo(stepName) {
			const step = this.steps[stepName];
			if (!step) {
				console.error("Wizard could not go to unknown step: " + stepName);
				return;
			}
			const previousStep = this.currentStep;
			this.currentStep = step;
			this.currentStep.instance.onShow();
			if (previousStep) {
				this.previousSteps.push(previousStep);
				this.currentStep.el.classList.add("current-step-in");
				const stepBefore = previousStep;
				window.setTimeout(() => {
					const currentStep = assertInitialized(this.currentStep, "currentStep");
					currentStep.el.classList.remove("current-step-in");
					stepBefore.el.classList.remove("current-step");
					currentStep.el.classList.add("current-step");
				}, TRANSITION_DURATION);
			} else this.currentStep.el.classList.add("current-step");
		}
		/**
		* Go back to the previous step displayed, if available.
		*/
		back() {
			const previousStep = this.previousSteps.pop();
			if (!previousStep) {
				console.error("Wizard has no previous step to go to.");
				return;
			}
			if (!this.currentStep) console.error("Wizard is in an invalid state");
			const backedStep = assertInitialized(this.currentStep, "backedStep");
			this.currentStep = previousStep;
			backedStep.el.classList.add("current-step-out");
			backedStep.el.classList.remove("current-step");
			this.currentStep.el.classList.add("current-step");
			window.setTimeout(() => {
				backedStep.el.classList.remove("current-step-out");
			}, TRANSITION_DURATION);
		}
	};
	//#endregion
	//#region src/js/controller/dialogs/backups/steps/SelectSession.ts
	var DELETE_TRANSITION_DURATION = 500;
	/**
	* Helper that returns a promise that will resolve after waiting for a
	* given time (in ms).
	*
	* @param {Number} time
	*        The time to wait.
	* @return {Promise} promise that resolves after time.
	*/
	var wait = function(time) {
		return new Promise(function(resolve) {
			setTimeout(resolve, time);
		});
	};
	var SelectSession = class {
		constructor(piskelController, backupsController, container) {
			this.piskelController = piskelController;
			this.backupsController = backupsController;
			this.container = container;
		}
		addEventListener(el, type, cb) {
			EventUtils.addEventListener(el, type, cb, this);
		}
		init() {
			this.addEventListener(this.container, "click", this.onContainerClick_);
		}
		onShow() {
			this.update();
		}
		update() {
			assertInitialized(app.backupService, "backupService").list().then((sessions) => {
				const html = this.getMarkupForSessions_(sessions);
				Dom.getElement(".session-list", this.container).innerHTML = html;
			}).catch(() => {
				const html = Template.get("session-list-error");
				Dom.getElement(".session-list", this.container).innerHTML = html;
			});
		}
		getMarkupForSessions_(sessions) {
			if (sessions.length === 0) return Template.get("session-list-empty");
			const sessionItemTemplate = Template.get("session-list-item");
			return sessions.reduce(function(previous, session) {
				if (session.id === app.sessionId) return previous;
				const view = {
					id: session.id,
					name: session.name,
					description: session.description ? "- " + session.description : "",
					date: DateUtils.format(session.endDate, "the {{Y}}/{{M}}/{{D}} at {{H}}:{{m}}"),
					count: session.count === 1 ? "1 snapshot" : session.count + " snapshots"
				};
				return previous + Template.replace(sessionItemTemplate, view);
			}, "");
		}
		destroy() {
			EventUtils.removeAllEventListeners(this);
		}
		onContainerClick_(evt) {
			const sessionId = evt.target.dataset.sessionId;
			if (!sessionId) return;
			const action = evt.target.dataset.action;
			if (action == "view") {
				this.backupsController.backupsData.selectedSession = sessionId;
				this.backupsController.next();
			} else if (action == "delete") {
				if (window.confirm("Are you sure you want to delete this session?")) {
					const sessionItem = evt.target.closest(".session-item");
					if (sessionItem === null) throw new Error("The deleted session has no .session-item element");
					sessionItem.classList.add("deleting");
					Promise.all([assertInitialized(app.backupService, "backupService").deleteSession(sessionId), wait(DELETE_TRANSITION_DURATION)]).then(() => {
						this.update();
					});
				}
			}
		}
	};
	//#endregion
	//#region src/js/utils/StringUtils.ts
	var StringUtils = {
		leftPad(input, length, pad) {
			return (new Array(length).join(pad) + input).slice(-length);
		},
		formatSize(width, height) {
			return width + "×" + height;
		}
	};
	//#endregion
	//#region src/js/utils/serialization/backward/Deserializer_v0.ts
	var Deserializer_v0 = class {
		constructor(data, callback) {
			this.data_ = data;
			this.callback_ = callback;
		}
		deserialize() {
			const frames = this.data_.map(function(grid) {
				return Frame.fromPixelGrid(grid);
			});
			const descriptor = new Descriptor("Deserialized piskel", "");
			const layer = Layer.fromFrames("Layer 1", frames);
			this.callback_(Piskel.fromLayers([layer], Constants.DEFAULT.FPS, descriptor));
		}
	};
	//#endregion
	//#region src/js/utils/serialization/backward/Deserializer_v1.ts
	var Deserializer_v1 = class {
		constructor(data, callback) {
			this.callback_ = callback;
			this.data_ = data;
		}
		deserialize() {
			const piskelData = this.data_.piskel;
			const descriptor = new Descriptor("Deserialized piskel", "");
			const piskel = new Piskel(piskelData.width, piskelData.height, Constants.DEFAULT.FPS, descriptor);
			piskelData.layers.forEach((serializedLayer) => {
				const layer = this.deserializeLayer(serializedLayer);
				piskel.addLayer(layer);
			});
			this.callback_(piskel);
		}
		deserializeLayer(layerString) {
			const layerData = JSON.parse(layerString);
			const layer = new Layer(layerData.name);
			layerData.frames.forEach((serializedFrame) => {
				const frame = this.deserializeFrame(serializedFrame);
				layer.addFrame(frame);
			});
			return layer;
		}
		deserializeFrame(frameString) {
			const framePixelGrid = JSON.parse(frameString);
			return Frame.fromPixelGrid(framePixelGrid);
		}
	};
	//#endregion
	//#region src/js/utils/serialization/Deserializer.ts
	var isCurrentVersion = function(data) {
		return !Array.isArray(data) && data.modelVersion == Constants.MODEL_VERSION;
	};
	var isVersion1 = function(data) {
		return !Array.isArray(data) && data.modelVersion == 1;
	};
	var Deserializer = class Deserializer {
		constructor(data, callback) {
			this.layersToLoad_ = 0;
			this.data_ = data;
			this.callback_ = callback;
			this.piskel_ = null;
			this.layers_ = [];
		}
		static deserialize(data, onSuccess, onError) {
			try {
				let deserializer;
				if (isCurrentVersion(data)) deserializer = new Deserializer(data, onSuccess);
				else if (isVersion1(data)) deserializer = new Deserializer_v1(data, onSuccess);
				else deserializer = new Deserializer_v0(data, onSuccess);
				deserializer.deserialize();
			} catch (e) {
				console.error(e);
				if (typeof onError === "function") onError(e);
			}
		}
		deserialize() {
			const piskelData = this.data_.piskel;
			const name = piskelData.name || "Deserialized piskel";
			const description = piskelData.description || "";
			const fps = typeof piskelData.fps != "undefined" ? piskelData.fps : 12;
			const descriptor = new Descriptor(name, description);
			this.piskel_ = new Piskel(piskelData.width, piskelData.height, fps, descriptor);
			this.hiddenFrames = piskelData.hiddenFrames || [];
			this.layersToLoad_ = piskelData.layers.length;
			piskelData.layers.forEach(this.deserializeLayer.bind(this));
		}
		deserializeLayer(layerString, index) {
			const layerData = JSON.parse(layerString);
			const layer = new Layer(layerData.name);
			layer.setOpacity(layerData.opacity);
			if (typeof layerData.chunks === "undefined" && layerData.base64PNG) this.normalizeLayerData_(layerData);
			const chunks = assertInitialized(layerData.chunks, "chunks");
			const frames = [];
			Promise.all(chunks.map(function(chunk) {
				return new Promise(function(resolve) {
					const image = new Image();
					image.onload = function() {
						FrameUtils.createFramesFromChunk(image, chunk.layout).forEach(function(chunkFrame) {
							frames[chunkFrame.index] = chunkFrame.frame;
						});
						resolve();
					};
					image.src = chunk.base64PNG;
				});
			})).then(() => {
				frames.forEach(function(frame) {
					layer.addFrame(frame);
				});
				this.layers_[index] = layer;
				this.onLayerLoaded_();
			}).catch(function(error) {
				console.error("Failed to deserialize layer");
				console.error(error);
			});
			return layer;
		}
		onLayerLoaded_() {
			this.layersToLoad_ = this.layersToLoad_ - 1;
			if (this.layersToLoad_ === 0) {
				this.layers_.forEach((layer) => {
					assertInitialized(this.piskel_, "piskel_").addLayer(layer);
				});
				const piskel = assertInitialized(this.piskel_, "piskel_");
				piskel.hiddenFrames = assertInitialized(this.hiddenFrames, "hiddenFrames");
				this.callback_(piskel);
			}
		}
		/**
		* Backward comptibility only. Create a chunk for layerData objects that only contain
		* an single base64PNG without chunk/layout information.
		*/
		normalizeLayerData_(layerData) {
			const layout = [];
			for (let i = 0; i < layerData.frameCount; i++) layout.push([i]);
			layerData.chunks = [{
				base64PNG: assertInitialized(layerData.base64PNG, "base64PNG"),
				layout
			}];
		}
	};
	//#endregion
	//#region src/js/controller/dialogs/backups/steps/SessionDetails.ts
	var PREVIEW_SIZE$1 = 60;
	var SessionDetails = class {
		constructor(piskelController, backupsController, container) {
			this.piskelController = piskelController;
			this.backupsController = backupsController;
			this.container = container;
		}
		init() {
			this.backButton = Dom.getElement(".back-button", this.container);
			this.addEventListener(this.backButton, "click", this.onBackClick_);
			this.addEventListener(this.container, "click", this.onContainerClick_);
		}
		destroy() {
			EventUtils.removeAllEventListeners(this);
		}
		addEventListener(el, type, cb) {
			EventUtils.addEventListener(el, type, cb, this);
		}
		onShow() {
			const sessionId = this.backupsController.backupsData.selectedSession;
			assertInitialized(app.backupService, "backupService").getSnapshotsBySessionId(String(sessionId)).then((snapshots) => {
				const html = this.getMarkupForSnapshots_(snapshots);
				Dom.getElement(".snapshot-list", this.container).innerHTML = html;
				snapshots.forEach((snapshot) => {
					this.updateSnapshotPreview_(snapshot);
				});
			}).catch(() => {
				const html = Template.get("snapshot-list-error");
				Dom.getElement(".snapshot-list", this.container).innerHTML = html;
			});
		}
		getMarkupForSnapshots_(snapshots) {
			if (snapshots.length === 0) {
				console.warn("Could not retrieve snapshots for a session");
				return Template.get("snapshot-list-empty");
			}
			const sessionItemTemplate = Template.get("snapshot-list-item");
			return snapshots.reduce(function(previous, snapshot) {
				const view = {
					id: snapshot.id,
					name: snapshot.name,
					description: snapshot.description ? "- " + snapshot.description : "",
					date: DateUtils.format(snapshot.date, "the {{Y}}/{{M}}/{{D}} at {{H}}:{{m}}"),
					frames: snapshot.frames === 1 ? "1 frame" : snapshot.frames + " frames",
					resolution: StringUtils.formatSize(snapshot.width, snapshot.height),
					fps: snapshot.fps
				};
				return previous + Template.replace(sessionItemTemplate, view);
			}, "");
		}
		updateSnapshotPreview_(snapshot) {
			Deserializer.deserialize(JSON.parse(snapshot.serialized), (piskel) => {
				const selector = ".snapshot-item[data-snapshot-id=\"" + snapshot.id + "\"] .snapshot-preview";
				const previewContainer = this.container.querySelector(selector);
				if (!previewContainer) return;
				const image = this.getFirstFrameAsImage_(piskel);
				previewContainer.appendChild(image);
			});
		}
		getFirstFrameAsImage_(piskel) {
			const frame = LayerUtils.mergeFrameAt(piskel.getLayers(), 0);
			const wZoom = PREVIEW_SIZE$1 / piskel.width;
			const hZoom = PREVIEW_SIZE$1 / piskel.height;
			const zoom = Math.min(hZoom, wZoom);
			return FrameUtils.toImage(frame, zoom);
		}
		onBackClick_() {
			this.backupsController.back();
		}
		onContainerClick_(evt) {
			if (evt.target.dataset.action == "load" && window.confirm(Constants.CONFIRM_OVERWRITE)) {
				const snapshotId = Number(evt.target.dataset.snapshotId);
				assertInitialized(app.backupService, "backupService").loadSnapshotById(snapshotId).then(function() {
					$.publish(Events.DIALOG_HIDE);
				});
			}
		}
	};
	//#endregion
	//#region src/js/controller/dialogs/backups/BrowseBackups.ts
	var stepDefinitions$1 = {
		SELECT_SESSION: {
			controller: SelectSession,
			template: "backups-select-session"
		},
		SESSION_DETAILS: {
			controller: SessionDetails,
			template: "backups-session-details"
		}
	};
	var BrowseBackups = class extends AbstractDialogController {
		constructor(piskelController) {
			super();
			this.piskelController = piskelController;
			this.backupsData = {
				sessions: [],
				selectedSession: null
			};
		}
		init() {
			super.init();
			this.steps = this.createSteps_();
			const wizardContainer = Dom.getElement(".backups-wizard-container");
			this.wizard = new Wizard(this.steps, wizardContainer);
			this.wizard.init();
			this.wizard.goTo("SELECT_SESSION");
		}
		back() {
			assertInitialized(this.wizard, "wizard").back();
			assertInitialized(this.wizard, "wizard").getCurrentStep().instance.onShow();
		}
		next() {
			if (assertInitialized(this.wizard, "wizard").getCurrentStep().name === "SELECT_SESSION") assertInitialized(this.wizard, "wizard").goTo("SESSION_DETAILS");
		}
		destroy() {
			const steps = assertInitialized(this.steps, "steps");
			Object.keys(steps).forEach((stepName) => {
				steps[stepName].instance.destroy();
			});
			super.destroy();
		}
		createSteps_() {
			const steps = {};
			Object.keys(stepDefinitions$1).forEach((stepName) => {
				const definition = stepDefinitions$1[stepName];
				const el = Template.getAsHTML(definition.template);
				if (el === void 0) throw new Error("Missing template: " + definition.template);
				const instance = new definition.controller(this.piskelController, this, el);
				instance.init();
				steps[stepName] = {
					name: stepName,
					el,
					instance
				};
			});
			return steps;
		}
	};
	//#endregion
	//#region src/js/utils/MergeUtils.ts
	var MergeUtils = {
		merge(piskel, importedPiskel, options) {
			if ((importedPiskel.getWidth() > piskel.getWidth() || importedPiskel.getHeight() > piskel.getHeight()) && options.resize === "expand") piskel = ResizeUtils.resizePiskel(piskel, {
				width: Math.max(piskel.getWidth(), importedPiskel.getWidth()),
				height: Math.max(piskel.getHeight(), importedPiskel.getHeight()),
				origin: options.origin,
				resizeContent: false
			});
			else importedPiskel = ResizeUtils.resizePiskel(importedPiskel, {
				width: piskel.getWidth(),
				height: piskel.getHeight(),
				origin: options.origin,
				resizeContent: false
			});
			let insertIndex = Number(options.insertIndex);
			if (options.insertMode === "insert") insertIndex = insertIndex - 1;
			const importedFrameCount = importedPiskel.getFrameCount();
			for (let i = 0; i < importedFrameCount; i++) {
				const index = i + insertIndex;
				if (options.insertMode === "add" || index >= piskel.getFrameCount()) MergeUtils.addFrameToLayers_(piskel, index);
			}
			importedPiskel.getLayers().forEach(function(layer) {
				const importedLayer = new Layer(layer.getName() + " (imported)");
				for (let i = 0; i < piskel.getFrameCount(); i++) {
					const importedIndex = i - insertIndex;
					let frame = layer.getFrameAt(importedIndex);
					if (!frame) frame = MergeUtils.createEmptyFrame_(piskel);
					importedLayer.addFrame(frame);
				}
				piskel.addLayer(importedLayer);
			});
			return piskel;
		},
		createEmptyFrame_(piskel) {
			return new Frame(piskel.getWidth(), piskel.getHeight());
		},
		addFrameToLayers_(piskel, index) {
			piskel.getLayers().forEach(function(l) {
				l.addFrameAt(MergeUtils.createEmptyFrame_(piskel), index);
			});
		}
	};
	//#endregion
	//#region src/js/utils/Environment.ts
	/**
	*  detection method from:
	*  http://videlais.com/2014/08/23/lessons-learned-from-detecting-node-webkit/
	*/
	var Environment = {
		detectNodeWebkit() {
			const isNode = typeof window.process !== "undefined" && typeof window.require !== "undefined";
			let isNodeWebkit = false;
			if (isNode) try {
				isNodeWebkit = typeof window.require("nw.gui") !== "undefined";
			} catch {
				isNodeWebkit = false;
			}
			return isNodeWebkit;
		},
		isIntegrationTest() {
			return window.location.href.indexOf("integration-test") !== -1;
		},
		isHttps() {
			return window.location.href.indexOf("https://") === 0;
		}
	};
	//#endregion
	//#region src/js/utils/PiskelFileUtils.ts
	var PiskelFileUtils = {
		FAILURE: {
			EMPTY: "No data found in piskel file",
			INVALID: "Invalid piskel file, contact us on twitter @piskelapp",
			DESERIALIZATION: "Piskel data deserialization failed"
		},
		loadFromFile(file, onSuccess, onError) {
			FileUtils.readFile(file, function(content) {
				const rawPiskel = Base64.toText(content);
				PiskelFileUtils.decodePiskelFile(rawPiskel, function(piskel) {
					if (Environment.detectNodeWebkit()) piskel.savePath = file.path;
					onSuccess(piskel);
				}, onError);
			});
		},
		decodePiskelFile(rawPiskel, onSuccess, onError) {
			let serializedPiskel;
			if (rawPiskel.length === 0) {
				onError(PiskelFileUtils.FAILURE.EMPTY);
				return;
			}
			try {
				serializedPiskel = JSON.parse(rawPiskel);
			} catch (_e) {
				onError(PiskelFileUtils.FAILURE.INVALID);
				return;
			}
			Deserializer.deserialize(serializedPiskel, onSuccess, function() {
				onError(PiskelFileUtils.FAILURE.DESERIALIZATION);
			});
		}
	};
	//#endregion
	//#region src/js/widgets/AnchorWidget.ts
	var _AnchorWidget;
	var OPTION_CLASSNAME = "anchor-option";
	var WIDGET_TEMPLATE = "<div class=\"anchor-option\"  title=\"top left\"      data-origin=\"TOPLEFT\"></div><div class=\"anchor-option\"  title=\"top\"           data-origin=\"TOP\"></div><div class=\"anchor-option\"  title=\"top right\"     data-origin=\"TOPRIGHT\"></div><div class=\"anchor-option\"  title=\"middle left\"   data-origin=\"MIDDLELEFT\"></div><div class=\"anchor-option\"  title=\"middle\"        data-origin=\"MIDDLE\"></div><div class=\"anchor-option\"  title=\"middle right\"  data-origin=\"MIDDLERIGHT\"></div><div class=\"anchor-option\"  title=\"bottom left\"   data-origin=\"BOTTOMLEFT\"></div><div class=\"anchor-option\"  title=\"bottom\"        data-origin=\"BOTTOM\"></div><div class=\"anchor-option\"  title=\"bottom right\"  data-origin=\"BOTTOMRIGHT\"></div>";
	var AnchorWidget = class AnchorWidget {
		constructor(container, onChangeCallback) {
			this.onChangeCallback = onChangeCallback;
			this.wrapper = document.createElement("div");
			this.wrapper.classList.add("anchor-wrapper");
			this.wrapper.innerHTML = WIDGET_TEMPLATE;
			container.innerHTML = "";
			container.appendChild(this.wrapper);
			this.disabled = false;
			EventUtils.addEventListener(this.wrapper, "click", this.onResizeOriginClick_, this);
		}
		destroy() {
			EventUtils.removeAllEventListeners(this);
			this.wrapper = null;
		}
		onResizeOriginClick_(evt) {
			const origin = evt.target.dataset.origin;
			if (origin && origin in AnchorWidget.ORIGIN && !this.disabled) this.setOrigin(origin);
		}
		setOrigin(origin) {
			this.origin = origin;
			const previous = assertInitialized(this.wrapper, "wrapper").querySelector("." + OPTION_CLASSNAME + ".selected");
			if (previous) previous.classList.remove("selected");
			const selected = assertInitialized(this.wrapper, "wrapper").querySelector("." + OPTION_CLASSNAME + "[data-origin=\"" + origin + "\"]");
			if (selected) {
				selected.classList.add("selected");
				this.refreshNeighbors_(selected);
			}
			if (typeof this.onChangeCallback === "function") this.onChangeCallback(origin);
		}
		getOrigin() {
			return this.origin;
		}
		disable() {
			this.disabled = true;
			assertInitialized(this.wrapper, "wrapper").classList.add("transition");
			assertInitialized(this.wrapper, "wrapper").classList.add("disabled");
		}
		enable() {
			this.disabled = false;
			assertInitialized(this.wrapper, "wrapper").classList.remove("disabled");
			window.setTimeout(assertInitialized(this.wrapper, "wrapper").classList.remove.bind(assertInitialized(this.wrapper, "wrapper").classList, "transition"), 250);
		}
		refreshNeighbors_(selected) {
			const options = assertInitialized(this.wrapper, "wrapper").querySelectorAll("." + OPTION_CLASSNAME);
			for (let i = 0; i < options.length; i++) options[i].removeAttribute("data-neighbor");
			const selectedIndex = Array.prototype.indexOf.call(options, selected);
			this.setNeighborhood_(options[selectedIndex - 1], "left");
			this.setNeighborhood_(options[selectedIndex + 1], "right");
			this.setNeighborhood_(options[selectedIndex - 3], "top");
			this.setNeighborhood_(options[selectedIndex + 3], "bottom");
		}
		setNeighborhood_(el, neighborhood) {
			if (assertInitialized(this.origin, "origin").toLowerCase().indexOf(neighborhood) === -1) el.setAttribute("data-neighbor", neighborhood);
		}
	};
	_AnchorWidget = AnchorWidget;
	_AnchorWidget.ORIGIN = {
		TOPLEFT: "TOPLEFT",
		TOP: "TOP",
		TOPRIGHT: "TOPRIGHT",
		MIDDLELEFT: "MIDDLELEFT",
		MIDDLE: "MIDDLE",
		MIDDLERIGHT: "MIDDLERIGHT",
		BOTTOMLEFT: "BOTTOMLEFT",
		BOTTOM: "BOTTOM",
		BOTTOMRIGHT: "BOTTOMRIGHT"
	};
	//#endregion
	//#region src/js/widgets/FramePicker.ts
	var WIDGET_MARKUP = "<div class=\"frame-viewer\"></div><div class=\"frame-nav\"><button class=\"button frame-nav-first\">&lt;&lt;</button><button class=\"button frame-nav-previous\">&lt;</button><input class=\"textfield frame-nav-input\" type=\"text\"><button class=\"button frame-nav-next\">&gt;</button><button class=\"button frame-nav-last\">&gt;&gt;</button></div>";
	/**
	* The frame picker widget displays a a simple UI to view the frames of a piskel.
	* UI controls allow the user to browser through the frames
	* @param {Piskel} piskel
	*        The piskel instance for which we want to preview frames.
	* @param {Node} container
	*        Node in which the widget should be inserted.
	*/
	var FramePicker = class {
		constructor(piskel, container) {
			this.piskel = piskel;
			this.container = container;
			this.firstFrameIndex = 1;
			this.wrapper = document.createElement("div");
			this.wrapper.innerHTML = WIDGET_MARKUP;
			this.wrapper.classList.add("frame-picker-wrapper");
			this.frameViewer = Dom.getElement(".frame-viewer", this.wrapper);
			this.firstButton = Dom.getElement(".frame-nav-first", this.wrapper);
			this.previousButton = Dom.getElement(".frame-nav-previous", this.wrapper);
			this.nextButton = Dom.getElement(".frame-nav-next", this.wrapper);
			this.lastButton = Dom.getElement(".frame-nav-last", this.wrapper);
			this.input = Dom.getElement(".frame-nav-input", this.wrapper);
		}
		init() {
			this.container.appendChild(this.wrapper);
			this.addEventListener(this.firstButton, "click", this.onFirstClicked_);
			this.addEventListener(this.previousButton, "click", this.onPreviousClicked_);
			this.addEventListener(this.nextButton, "click", this.onNextClicked_);
			this.addEventListener(this.lastButton, "click", this.onLastClicked_);
			this.addEventListener(this.input, "change", this.onInputChange_);
			this.setFrameIndex(1);
		}
		setFirstFrameIndex(index) {
			this.firstFrameIndex = index;
			this.setFrameIndex(assertInitialized(this.currentFrameIndex, "currentFrameIndex"));
		}
		destroy() {
			if (this.wrapper.parentNode) this.wrapper.parentNode.removeChild(this.wrapper);
			EventUtils.removeAllEventListeners(this);
		}
		onFirstClicked_() {
			this.setFrameIndex(this.firstFrameIndex);
		}
		onPreviousClicked_() {
			this.setFrameIndex(assertInitialized(this.currentFrameIndex, "currentFrameIndex") - 1);
		}
		onNextClicked_() {
			this.setFrameIndex(assertInitialized(this.currentFrameIndex, "currentFrameIndex") + 1);
		}
		onLastClicked_() {
			this.setFrameIndex(this.piskel.getFrameCount());
		}
		onInputChange_() {
			let index = parseInt(this.input.value, 10);
			if (isNaN(index)) {
				this.input.value = String(1);
				return;
			}
			index = Math.max(this.firstFrameIndex, index);
			index = Math.min(this.getFrameCount_(), index);
			if (index !== this.currentFrameIndex) this.setFrameIndex(index);
		}
		getFrameCount_() {
			return this.piskel.getLayerAt(0).getFrames().length;
		}
		addEventListener(el, type, callback) {
			EventUtils.addEventListener(el, type, callback, this);
		}
		getFrameIndex() {
			return this.currentFrameIndex;
		}
		setFrameIndex(frameIndex) {
			frameIndex = Math.max(this.firstFrameIndex, frameIndex);
			frameIndex = Math.min(this.getFrameCount_(), frameIndex);
			this.currentFrameIndex = frameIndex;
			this.input.value = String(frameIndex);
			const image = this.getFrameAsImage_(frameIndex);
			image.classList.add("canvas-background");
			this.frameViewer.innerHTML = "";
			this.frameViewer.appendChild(image);
			const frameCount = this.getFrameCount_();
			this.setEnabled_(this.firstButton, frameIndex !== this.firstFrameIndex);
			this.setEnabled_(this.previousButton, frameIndex !== this.firstFrameIndex);
			this.setEnabled_(this.nextButton, frameIndex !== frameCount);
			this.setEnabled_(this.lastButton, frameIndex !== frameCount);
			if (frameIndex === 0) {
				this.previousButton.setAttribute("disabled", String(true));
				this.firstButton.setAttribute("disabled", String(true));
			}
		}
		getFrameAsImage_(frameIndex) {
			if (frameIndex === 0) return new Image();
			const frame = LayerUtils.mergeFrameAt(this.piskel.getLayers(), frameIndex - 1);
			const zoom = this.getZoomLevel_();
			return FrameUtils.toImage(frame, zoom);
		}
		getZoomLevel_() {
			const viewerWidth = this.frameViewer.offsetWidth;
			const viewerHeight = this.frameViewer.offsetHeight;
			const wZoom = viewerWidth / this.piskel.width;
			const hZoom = viewerHeight / this.piskel.height;
			return Math.min(hZoom, wZoom);
		}
		/**
		* DOM helper to enable / disable as DOM element.
		* @param {Node} el
		*        The element to enable / disable.
		* @param {Boolean} enabled
		*        Should the element be disabled or enabled.
		*/
		setEnabled_(el, enabled) {
			if (enabled) el.removeAttribute("disabled");
			else el.setAttribute("disabled", String(true));
		}
	};
	//#endregion
	//#region src/js/controller/dialogs/importwizard/steps/AbstractImportStep.ts
	var AbstractImportStep = class {
		constructor(piskelController, importController, container) {
			this.piskelController = piskelController;
			this.container = container;
			this.importController = importController;
			this.mergeData = this.importController.mergeData;
		}
		init() {
			this.nextButton = Dom.getElement(".import-next-button", this.container);
			this.backButton = Dom.getElement(".import-back-button", this.container);
			this.addEventListener(this.nextButton, "click", this.onNextClick);
			this.addEventListener(this.backButton, "click", this.onBackClick);
		}
		addEventListener(el, type, cb) {
			EventUtils.addEventListener(el, type, cb, this);
		}
		destroy() {
			if (this.framePickerWidget) this.framePickerWidget.destroy();
			EventUtils.removeAllEventListeners(this);
		}
		onNextClick() {
			this.importController.next();
		}
		onBackClick() {
			this.importController.back();
		}
		onShow() {
			const mergePiskel = this.mergeData.mergePiskel;
			if (!mergePiskel) return;
			if (!this.framePickerWidget) {
				this.framePickerWidget = new FramePicker(mergePiskel, Dom.getElement(".import-preview", this.container));
				this.framePickerWidget.init();
			} else if (this.framePickerWidget.piskel != mergePiskel) {
				this.framePickerWidget.piskel = mergePiskel;
				this.framePickerWidget.setFrameIndex(1);
			}
			const metaHtml = Template.getAndReplace("import-meta-content", {
				name: mergePiskel.getDescriptor().name,
				dimensions: StringUtils.formatSize(mergePiskel.getWidth(), mergePiskel.getHeight()),
				frames: mergePiskel.getFrameCount(),
				layers: mergePiskel.getLayers().length
			});
			Dom.getElement(".import-meta", this.container).innerHTML = metaHtml;
		}
	};
	//#endregion
	//#region src/js/controller/dialogs/importwizard/steps/AdjustSize.ts
	var _AdjustSize;
	var AdjustSize = class AdjustSize extends AbstractImportStep {
		init() {
			super.init();
			this.anchorWidget = new AnchorWidget(Dom.getElement(".import-resize-anchor-container", this.container), this.onAnchorChange_.bind(this));
			this.anchorWidget.setOrigin("TOPLEFT");
			this.resizeInfoContainer = Dom.getElement(".import-resize-info", this.container);
			this.addEventListener(this.resizeInfoContainer, "change", this.onResizeOptionChange_);
			this.mergeData.resize = AdjustSize.OPTIONS.EXPAND;
		}
		destroy() {
			assertInitialized(this.anchorWidget, "anchorWidget").destroy();
			super.destroy();
		}
		onShow() {
			this.refresh_();
			super.onShow();
		}
		refresh_() {
			const isBigger = this.isImportedPiskelBigger_();
			const keep = this.mergeData.resize === AdjustSize.OPTIONS.KEEP;
			const size = this.formatPiskelSize_(this.piskelController.getPiskel());
			const newSize = this.formatPiskelSize_(assertInitialized(this.mergeData.mergePiskel, "mergePiskel"));
			let markup;
			if (isBigger) markup = Template.getAndReplace("import-resize-bigger-partial", {
				size,
				newSize,
				keepChecked: keep ? "checked=\"checked\"" : "",
				expandChecked: keep ? "" : "checked=\"checked\""
			});
			else markup = Template.getAndReplace("import-resize-smaller-partial", {
				size,
				newSize
			});
			assertInitialized(this.resizeInfoContainer, "resizeInfoContainer").innerHTML = markup;
			if (this.mergeData.origin) assertInitialized(this.anchorWidget, "anchorWidget").setOrigin(this.mergeData.origin);
			const anchorInfo = Dom.getElement(".import-resize-anchor-info", this.container);
			if (isBigger && keep) anchorInfo.innerHTML = [
				"<div class=\"import-resize-warning\">",
				"  Imported content will be cropped!",
				"</div>",
				"Select crop anchor:"
			].join("");
			else if (isBigger) anchorInfo.innerHTML = "Select resize anchor:";
			else anchorInfo.innerHTML = "Select position anchor:";
		}
		onAnchorChange_(origin) {
			this.mergeData.origin = origin;
		}
		onResizeOptionChange_() {
			const value = Dom.getElement(":checked", this.resizeInfoContainer).value;
			if (this.mergeData.resize != value) {
				this.mergeData.resize = value;
				this.refresh_();
			}
		}
		isImportedPiskelBigger_() {
			const piskel = this.mergeData.mergePiskel;
			if (!piskel) return false;
			return piskel.width > this.piskelController.getWidth() || piskel.height > this.piskelController.getHeight();
		}
		formatPiskelSize_(piskel) {
			return StringUtils.formatSize(piskel.width, piskel.height);
		}
	};
	_AdjustSize = AdjustSize;
	_AdjustSize.OPTIONS = {
		KEEP: "keep",
		EXPAND: "expand"
	};
	//#endregion
	//#region src/js/controller/dialogs/importwizard/steps/ImageImport.ts
	var ImageImport = class extends AbstractImportStep {
		constructor(piskelController, importController, container) {
			super(piskelController, importController, container);
			this.importedImage_ = null;
			this.file_ = null;
		}
		init() {
			super.init();
			this.file_ = this.mergeData.rawFiles[0];
			this.importPreview = Dom.getElement(".import-section-preview", this.container);
			this.fileNameContainer = Dom.getElement(".import-image-file-name", this.container);
			this.singleImportType = this.container.querySelector("[name=import-type][value=single]");
			this.sheetImportType = this.container.querySelector("[name=import-type][value=sheet]");
			this.resizeWidth = Dom.getElement("[name=resize-width]", this.container);
			this.resizeHeight = Dom.getElement("[name=resize-height]", this.container);
			this.smoothResize = Dom.getElement("[name=smooth-resize-checkbox]", this.container);
			this.frameSizeX = Dom.getElement("[name=frame-size-x]", this.container);
			this.frameSizeY = Dom.getElement("[name=frame-size-y]", this.container);
			this.frameOffsetX = Dom.getElement("[name=frame-offset-x]", this.container);
			this.frameOffsetY = Dom.getElement("[name=frame-offset-y]", this.container);
			this.addEventListener(assertInitialized(this.singleImportType, "singleImportType"), "change", this.onImportTypeChange_);
			this.addEventListener(assertInitialized(this.sheetImportType, "sheetImportType"), "change", this.onImportTypeChange_);
			this.addEventListener(this.resizeWidth, "keyup", this.onResizeInputKeyUp_);
			this.addEventListener(this.resizeHeight, "keyup", this.onResizeInputKeyUp_);
			this.addEventListener(this.frameSizeX, "keyup", this.onFrameInputKeyUp_);
			this.addEventListener(this.frameSizeY, "keyup", this.onFrameInputKeyUp_);
			this.addEventListener(this.frameOffsetX, "keyup", this.onFrameInputKeyUp_);
			this.addEventListener(this.frameOffsetY, "keyup", this.onFrameInputKeyUp_);
			FileUtils.readImageFile(assertInitialized(this.file_, "file_"), this.onImageLoaded_.bind(this));
			if (this.piskelController.isEmpty()) assertInitialized(this.nextButton, "nextButton").textContent = "import";
		}
		onNextClick() {
			this.container.classList.add("import-image-loading");
			this.createPiskelFromImage().then((piskel) => {
				this.mergeData.mergePiskel = piskel;
				this.container.classList.remove("import-image-loading");
				super.onNextClick();
			}).catch(function(e) {
				console.error(e);
			});
		}
		onShow() {
			this.container.classList.remove("import-image-loading");
		}
		createPiskelFromImage() {
			let name = this.extractFileNameFromPath_(assertInitialized(this.file_, "file_").name);
			name = name.replace(/\.[a-zA-Z]+$/, "");
			return new Promise((resolve) => {
				assertInitialized(app.importService, "importService").newPiskelFromImage(assertInitialized(this.importedImage_, "importedImage_"), {
					importType: this.getImportType_(),
					frameSizeX: this.getImportType_() === "single" ? Number(assertInitialized(this.resizeWidth, "resizeWidth").value) : this.sanitizeInputValue_(this.frameSizeX, 1),
					frameSizeY: this.getImportType_() === "single" ? Number(assertInitialized(this.resizeHeight, "resizeHeight").value) : this.sanitizeInputValue_(this.frameSizeY, 1),
					frameOffsetX: this.sanitizeInputValue_(this.frameOffsetX, 0),
					frameOffsetY: this.sanitizeInputValue_(this.frameOffsetY, 0),
					smoothing: !!assertInitialized(this.smoothResize, "smoothResize").checked,
					name
				}, resolve);
			});
		}
		onImportTypeChange_() {
			if (this.getImportType_() === "single") this.hideFrameGrid_();
			else {
				const x = this.sanitizeInputValue_(this.frameOffsetX, 0);
				const y = this.sanitizeInputValue_(this.frameOffsetY, 0);
				const w = this.sanitizeInputValue_(this.frameSizeX, 1);
				const h = this.sanitizeInputValue_(this.frameSizeY, 1);
				this.drawFrameGrid_(x, y, w, h);
			}
		}
		onResizeInputKeyUp_(evt) {
			const from = evt.target.getAttribute("name");
			if (this.importedImage_) this.synchronizeResizeFields_(evt.target.value, from);
		}
		onFrameInputKeyUp_(evt) {
			if (this.importedImage_) this.synchronizeFrameFields_(evt.target.value);
		}
		synchronizeResizeFields_(input, from) {
			let value = parseInt(input, 10);
			if (isNaN(value)) value = 0;
			const height = assertInitialized(this.importedImage_, "importedImage_").height;
			const width = assertInitialized(this.importedImage_, "importedImage_").width;
			assertInitialized(this.singleImportType, "singleImportType").checked = true;
			if (from === "resize-width") assertInitialized(this.resizeHeight, "resizeHeight").value = String(Math.round(value * height / width));
			else assertInitialized(this.resizeWidth, "resizeWidth").value = String(Math.round(value * width / height));
		}
		synchronizeFrameFields_(input) {
			let value = parseInt(input, 10);
			if (isNaN(value)) value = 0;
			const frameSizeX = this.sanitizeInputValue_(this.frameSizeX, 1);
			const frameSizeY = this.sanitizeInputValue_(this.frameSizeY, 1);
			const frameOffsetX = this.sanitizeInputValue_(this.frameOffsetX, 0);
			const frameOffsetY = this.sanitizeInputValue_(this.frameOffsetY, 0);
			assertInitialized(this.sheetImportType, "sheetImportType").checked = true;
			this.drawFrameGrid_(frameOffsetX, frameOffsetY, frameSizeX, frameSizeY);
		}
		sanitizeInputValue_(maybeInput, minValue) {
			const input = assertInitialized(maybeInput, "input");
			let value = parseInt(input.value, 10);
			if (value <= minValue || isNaN(value)) {
				input.value = String(minValue);
				value = minValue;
			}
			return value;
		}
		getImportType_() {
			if (assertInitialized(this.singleImportType, "singleImportType").checked) return assertInitialized(this.singleImportType, "singleImportType").value;
			else if (assertInitialized(this.sheetImportType, "sheetImportType").checked) return assertInitialized(this.sheetImportType, "sheetImportType").value;
			else throw "Could not find the currently selected import type";
		}
		onImageLoaded_(image) {
			this.importedImage_ = image;
			const w = this.importedImage_.width;
			const h = this.importedImage_.height;
			this.importedImage_.onload = function() {};
			const fileName = this.extractFileNameFromPath_(assertInitialized(this.file_, "file_").name);
			assertInitialized(this.fileNameContainer, "fileNameContainer").textContent = fileName;
			assertInitialized(this.fileNameContainer, "fileNameContainer").setAttribute("title", fileName);
			assertInitialized(this.resizeWidth, "resizeWidth").value = String(w);
			assertInitialized(this.resizeHeight, "resizeHeight").value = String(h);
			assertInitialized(this.frameSizeX, "frameSizeX").value = String(w);
			assertInitialized(this.frameSizeY, "frameSizeY").value = String(h);
			assertInitialized(this.frameOffsetX, "frameOffsetX").value = String(0);
			assertInitialized(this.frameOffsetY, "frameOffsetY").value = String(0);
			assertInitialized(this.importPreview, "importPreview").innerHTML = "";
			assertInitialized(this.importPreview, "importPreview").appendChild(this.createImagePreview_());
		}
		createImagePreview_() {
			const image = document.createElement("img");
			image.src = assertInitialized(this.importedImage_, "importedImage_").src;
			return image;
		}
		extractFileNameFromPath_(path) {
			let parts = [];
			if (path.indexOf("/") !== -1) parts = path.split("/");
			else if (path.indexOf("\\") !== -1) parts = path.split("\\");
			else parts = [path];
			return parts[parts.length - 1];
		}
		drawFrameGrid_(frameX, frameY, frameW, frameH) {
			if (!this.importedImage_) return;
			const width = this.importedImage_.width;
			const height = this.importedImage_.height;
			const image = Dom.getElement("img", this.importPreview);
			const previewWidth = image.offsetWidth;
			const previewHeight = image.offsetHeight;
			let canvas = assertInitialized(this.importPreview, "importPreview").querySelector("canvas");
			if (!canvas) {
				canvas = CanvasUtils.createCanvas(previewWidth + 1, previewHeight + 1);
				assertInitialized(this.importPreview, "importPreview").appendChild(canvas);
			}
			const context = Dom.getContext2d(canvas);
			context.clearRect(0, 0, canvas.width, canvas.height);
			context.beginPath();
			const countX = Math.floor((width - frameX) / frameW);
			const countY = Math.floor((height - frameY) / frameH);
			if (countX > 0 && countY > 0) {
				const scaleX = previewWidth / width;
				const scaleY = previewHeight / height;
				const maxWidth = countX * frameW + frameX;
				const maxHeight = countY * frameH + frameY;
				for (let x = frameX + .5; x < maxWidth + 1 && x < width + 1; x += frameW) {
					context.moveTo(x * scaleX, frameY * scaleY);
					context.lineTo(x * scaleX, maxHeight * scaleY);
				}
				for (let y = frameY + .5; y < maxHeight + 1 && y < height + 1; y += frameH) {
					context.moveTo(frameX * scaleX, y * scaleY);
					context.lineTo(maxWidth * scaleX, y * scaleY);
				}
				context.lineWidth = 1;
				context.strokeStyle = "gold";
				context.stroke();
				canvas.style.display = "block";
			} else this.hideFrameGrid_();
		}
		hideFrameGrid_() {
			const canvas = assertInitialized(this.importPreview, "importPreview").querySelector("canvas");
			if (canvas) canvas.style.display = "none";
		}
	};
	//#endregion
	//#region src/js/controller/dialogs/importwizard/steps/InsertLocation.ts
	var _InsertLocation;
	var InsertLocation = class InsertLocation extends AbstractImportStep {
		init() {
			super.init();
			this.framePreview = Dom.getElement(".insert-frame-preview", this.container);
			this.currentPiskelFramePickerWidget = new FramePicker(this.piskelController.getPiskel(), this.framePreview);
			this.insertModeContainer = Dom.getElement(".insert-mode-container", this.container);
			this.addEventListener(this.insertModeContainer, "change", this.onInsertModeChange_);
			this.mergeData.insertMode = InsertLocation.MODES.ADD;
		}
		onInsertModeChange_() {
			const value = Dom.getElement(":checked", this.insertModeContainer).value;
			this.mergeData.insertMode = value;
			if (this.mergeData.insertMode === InsertLocation.MODES.ADD) assertInitialized(this.currentPiskelFramePickerWidget, "currentPiskelFramePickerWidget").setFirstFrameIndex(0);
			else assertInitialized(this.currentPiskelFramePickerWidget, "currentPiskelFramePickerWidget").setFirstFrameIndex(1);
		}
		onShow() {
			assertInitialized(this.currentPiskelFramePickerWidget, "currentPiskelFramePickerWidget").init();
			const currentFrameIndex = this.piskelController.getCurrentFrameIndex();
			assertInitialized(this.currentPiskelFramePickerWidget, "currentPiskelFramePickerWidget").setFrameIndex(currentFrameIndex + 1);
			assertInitialized(this.currentPiskelFramePickerWidget, "currentPiskelFramePickerWidget").setFirstFrameIndex(0);
			super.onShow();
		}
		onNextClick() {
			const insertIndex = assertInitialized(this.currentPiskelFramePickerWidget, "currentPiskelFramePickerWidget").getFrameIndex();
			this.mergeData.insertIndex = insertIndex;
			super.onNextClick();
		}
		destroy() {
			assertInitialized(this.currentPiskelFramePickerWidget, "currentPiskelFramePickerWidget").destroy();
			super.destroy();
		}
	};
	_InsertLocation = InsertLocation;
	_InsertLocation.MODES = {
		ADD: "add",
		INSERT: "insert"
	};
	//#endregion
	//#region src/js/controller/dialogs/importwizard/steps/SelectMode.ts
	var _SelectMode;
	var SelectMode = class SelectMode extends AbstractImportStep {
		init() {
			super.init();
			const replaceButton = Dom.getElement(".import-mode-replace-button", this.container);
			const mergeButton = Dom.getElement(".import-mode-merge-button", this.container);
			this.addEventListener(replaceButton, "click", this.onReplaceButtonClick_);
			this.addEventListener(mergeButton, "click", this.onMergeButtonClick_);
		}
		onShow() {
			super.onShow();
		}
		destroy() {
			super.destroy();
		}
		onReplaceButtonClick_() {
			this.mergeData.importMode = SelectMode.MODES.REPLACE;
			this.onNextClick();
		}
		onMergeButtonClick_() {
			this.mergeData.importMode = SelectMode.MODES.MERGE;
			this.onNextClick();
		}
	};
	_SelectMode = SelectMode;
	_SelectMode.MODES = {
		REPLACE: "replace",
		MERGE: "merge"
	};
	//#endregion
	//#region src/js/controller/dialogs/importwizard/ImportWizard.ts
	var stepDefinitions = {
		IMAGE_IMPORT: {
			controller: ImageImport,
			template: "import-image-import"
		},
		ADJUST_SIZE: {
			controller: AdjustSize,
			template: "import-adjust-size"
		},
		INSERT_LOCATION: {
			controller: InsertLocation,
			template: "import-insert-location"
		},
		SELECT_MODE: {
			controller: SelectMode,
			template: "import-select-mode"
		}
	};
	var ImportWizard = class extends AbstractDialogController {
		constructor(piskelController) {
			super();
			this.piskelController = piskelController;
			this.mergeData = {
				rawFiles: [],
				mergePiskel: null,
				origin: null,
				resize: null,
				insertIndex: null,
				insertMode: null
			};
		}
		init(initArgs) {
			super.init();
			this.mergeData.rawFiles = initArgs.rawFiles;
			this.steps = this.createSteps_();
			const wizardContainer = Dom.getElement(".import-wizard-container");
			this.wizard = new Wizard(this.steps, wizardContainer);
			this.wizard.init();
			if (this.hasSingleImage_()) this.wizard.goTo("IMAGE_IMPORT");
			else if (this.hasSinglePiskelFile_()) PiskelFileUtils.loadFromFile(this.mergeData.rawFiles[0], (piskel) => {
				this.mergeData.mergePiskel = piskel;
				assertInitialized(this.wizard, "wizard").goTo("SELECT_MODE");
			}, (reason) => {
				this.closeDialog();
				$.publish(Events.PISKEL_FILE_IMPORT_FAILED, [reason]);
			});
			else {
				console.error("Unsupported import. Only single piskel or single image are supported at the moment.");
				this.closeDialog();
			}
		}
		back() {
			assertInitialized(this.wizard, "wizard").back();
			assertInitialized(this.wizard, "wizard").getCurrentStep().instance.onShow();
		}
		next() {
			const step = assertInitialized(this.wizard, "wizard").getCurrentStep();
			if (step.name === "IMAGE_IMPORT") if (this.piskelController.isEmpty()) {
				this.mergeData.importMode = SelectMode.MODES.REPLACE;
				this.finalizeImport_();
			} else assertInitialized(this.wizard, "wizard").goTo("SELECT_MODE");
			else if (step.name === "SELECT_MODE") if (this.mergeData.importMode === SelectMode.MODES.REPLACE) this.finalizeImport_();
			else if (this.hasSameSize_()) assertInitialized(this.wizard, "wizard").goTo("INSERT_LOCATION");
			else assertInitialized(this.wizard, "wizard").goTo("ADJUST_SIZE");
			else if (step.name === "ADJUST_SIZE") assertInitialized(this.wizard, "wizard").goTo("INSERT_LOCATION");
			else if (step.name === "INSERT_LOCATION") this.finalizeImport_();
		}
		destroy() {
			const steps = assertInitialized(this.steps, "steps");
			Object.keys(steps).forEach((stepName) => {
				steps[stepName].instance.destroy();
			});
			super.destroy();
		}
		createSteps_() {
			const hasSingleImage = this.hasSingleImage_();
			const steps = {};
			Object.keys(stepDefinitions).forEach((stepName) => {
				if (stepName === "IMAGE_IMPORT" && !hasSingleImage) return;
				const definition = stepDefinitions[stepName];
				const el = Template.getAsHTML(definition.template);
				if (el === void 0) throw new Error("Missing template: " + definition.template);
				const instance = new definition.controller(this.piskelController, this, el);
				instance.init();
				steps[stepName] = {
					name: stepName,
					el,
					instance
				};
			});
			if (hasSingleImage) steps.IMAGE_IMPORT.el.classList.add("import-first-step");
			else steps.SELECT_MODE.el.classList.add("import-first-step");
			return steps;
		}
		finalizeImport_() {
			const piskel = assertInitialized(this.mergeData.mergePiskel, "mergePiskel");
			const mode = this.mergeData.importMode;
			if (mode === SelectMode.MODES.REPLACE) {
				if (window.confirm(Constants.CONFIRM_OVERWRITE)) {
					this.piskelController.setPiskel(piskel);
					this.closeDialog();
				}
			} else if (mode === SelectMode.MODES.MERGE) {
				const merge = MergeUtils.merge(this.piskelController.getPiskel(), piskel, {
					insertIndex: this.mergeData.insertIndex,
					insertMode: this.mergeData.insertMode,
					origin: assertInitialized(this.mergeData.origin, "origin"),
					resize: this.mergeData.resize
				});
				this.piskelController.setPiskel(merge);
				const importedLayers = piskel.getLayers().length;
				const currentLayers = this.piskelController.getLayers().length;
				this.piskelController.setCurrentLayerIndex(currentLayers - importedLayers);
				this.closeDialog();
			}
		}
		hasSameSize_() {
			const piskel = assertInitialized(this.mergeData.mergePiskel, "mergePiskel");
			if (!piskel) return false;
			return piskel.width === this.piskelController.getWidth() && piskel.height === this.piskelController.getHeight();
		}
		hasSingleImage_() {
			if (this.mergeData.rawFiles.length !== 1) return false;
			return this.mergeData.rawFiles[0].type.indexOf("image") === 0;
		}
		hasSinglePiskelFile_() {
			if (this.mergeData.rawFiles.length !== 1) return false;
			const file = this.mergeData.rawFiles[0];
			return /\.piskel$/.test(file.name);
		}
	};
	//#endregion
	//#region src/js/controller/dialogs/DialogsController.ts
	var dialogs = {
		cheatsheet: {
			template: "templates/dialogs/cheatsheet.html",
			controller: CheatsheetController
		},
		"create-palette": {
			template: "templates/dialogs/create-palette.html",
			controller: CreatePaletteController
		},
		"browse-local": {
			template: "templates/dialogs/browse-local.html",
			controller: BrowseLocalController
		},
		import: {
			template: "templates/dialogs/import.html",
			controller: ImportWizard
		},
		"performance-info": {
			template: "templates/dialogs/performance-info.html",
			controller: PerformanceInfoController
		},
		"unsupported-browser": {
			template: "templates/dialogs/unsupported-browser.html",
			controller: UnsupportedBrowserController
		},
		"browse-backups": {
			template: "templates/dialogs/browse-backups.html",
			controller: BrowseBackups
		}
	};
	var DialogsController = class {
		constructor(piskelController) {
			this.piskelController = piskelController;
			this.closePopupShortcut = Shortcuts.MISC.CLOSE_POPUP;
			this.currentDialog_ = null;
		}
		init() {
			this.dialogContainer_ = Dom.getElement("#dialog-container");
			this.dialogWrapper_ = Dom.getElement("#dialog-container-wrapper");
			$.subscribe(Events.DIALOG_SHOW, this.onDialogDisplayEvent_.bind(this));
			$.subscribe(Events.DIALOG_HIDE, this.hideDialog.bind(this));
			const createPaletteShortcut = Shortcuts.COLOR.CREATE_PALETTE;
			assertInitialized(app.shortcutService, "shortcutService").registerShortcut(createPaletteShortcut, this.onCreatePaletteShortcut_.bind(this));
			const cheatsheetShortcut = Shortcuts.MISC.CHEATSHEET;
			assertInitialized(app.shortcutService, "shortcutService").registerShortcut(cheatsheetShortcut, this.onCheatsheetShortcut_.bind(this));
			EventUtils.addEventListener(".cheatsheet-link", "click", this.onCheatsheetShortcut_, this);
			this.dialogWrapper_.classList.add("animated");
			EventUtils.addEventListener(this.dialogWrapper_, "click", this.onWrapperClicked_, this);
		}
		onCreatePaletteShortcut_() {
			this.toggleDialog_("create-palette");
		}
		onCheatsheetShortcut_() {
			this.toggleDialog_("cheatsheet");
		}
		/**
		* If no dialog is currently displayed, the dialog with the provided id will be displayed.
		* If a dialog is displayed and has the same id as the provided id, hide it.
		* Otherwise, no-op.
		*/
		toggleDialog_(dialogId) {
			if (!this.isDisplayingDialog_()) this.showDialog(dialogId);
			else if (this.getCurrentDialogId_() === dialogId) this.hideDialog();
		}
		onDialogDisplayEvent_(_evt, args) {
			this.showDialog(args.dialogId, args.initArgs);
		}
		onWrapperClicked_(evt) {
			if (evt.target === this.dialogWrapper_) this.hideDialog();
		}
		showDialog(dialogId, initArgs) {
			if (this.isDisplayingDialog_()) return;
			const config = dialogs[dialogId];
			if (!config) {
				console.error("Could not find dialog configuration for dialogId : " + dialogId);
				return;
			}
			assertInitialized(this.dialogContainer_, "dialogContainer_").classList.add(dialogId);
			assertInitialized(this.dialogContainer_, "dialogContainer_").innerHTML = Template.get(config.template);
			const controller = new config.controller(this.piskelController);
			controller.init(initArgs);
			this.currentDialog_ = {
				id: dialogId,
				controller
			};
			assertInitialized(app.shortcutService, "shortcutService").registerShortcut(this.closePopupShortcut, this.hideDialog.bind(this));
			assertInitialized(this.dialogWrapper_, "dialogWrapper_").classList.add("show");
		}
		hideDialog() {
			if (this.isHiding_ || !this.isDisplayingDialog_()) return;
			assertInitialized(app.shortcutService, "shortcutService").unregisterShortcut(this.closePopupShortcut);
			assertInitialized(this.dialogWrapper_, "dialogWrapper_").classList.remove("show");
			window.setTimeout(this.cleanupDialogContainer_.bind(this), 500);
			this.isHiding_ = true;
		}
		cleanupDialogContainer_() {
			assertInitialized(this.dialogContainer_, "dialogContainer_").classList.remove(assertInitialized(this.currentDialog_, "currentDialog_").id);
			assertInitialized(this.currentDialog_, "currentDialog_").controller.destroy();
			this.currentDialog_ = null;
			assertInitialized(this.dialogContainer_, "dialogContainer_").innerHTML = "";
			this.isHiding_ = false;
		}
		isDisplayingDialog_() {
			return this.currentDialog_ !== null;
		}
		getCurrentDialogId_() {
			if (this.currentDialog_) return this.currentDialog_.id;
			return null;
		}
	};
	//#endregion
	//#region src/js/utils/serialization/Serializer.ts
	var areChunksValid = function(chunks) {
		return chunks.length > 0 && chunks.every(function(chunk) {
			return Boolean(chunk.base64PNG) && chunk.base64PNG !== "data:,";
		});
	};
	var createLineLayout = function(size, offset) {
		const layout = [];
		for (let i = 0; i < size; i++) layout.push([i + offset]);
		return layout;
	};
	var Serializer = {
		serialize(piskel) {
			const serializedLayers = piskel.getLayers().map(function(l) {
				return Serializer.serializeLayer(l);
			});
			return JSON.stringify({
				modelVersion: Constants.MODEL_VERSION,
				piskel: {
					name: piskel.getDescriptor().name,
					description: piskel.getDescriptor().description,
					fps: assertInitialized(app.piskelController, "piskelController").getFPS(),
					height: piskel.getHeight(),
					width: piskel.getWidth(),
					layers: serializedLayers,
					hiddenFrames: piskel.hiddenFrames
				}
			});
		},
		serializeLayer(layer) {
			const frames = layer.getFrames();
			const layerToSerialize = {
				name: layer.getName(),
				opacity: layer.getOpacity(),
				frameCount: frames.length
			};
			let chunks = [];
			while (!areChunksValid(chunks)) {
				if (chunks.length >= frames.length) {
					chunks = [];
					break;
				}
				const frameChunks = ArrayUtils.chunk(frames, chunks.length + 1);
				chunks = [];
				let offset = 0;
				for (let i = 0; i < frameChunks.length; i++) {
					const chunkFrames = frameChunks[i];
					chunks.push({
						layout: createLineLayout(chunkFrames.length, offset),
						base64PNG: Serializer.serializeFramesToBase64(chunkFrames)
					});
					offset += chunkFrames.length;
				}
			}
			layerToSerialize.chunks = chunks;
			return JSON.stringify(layerToSerialize);
		},
		serializeFramesToBase64(frames) {
			try {
				return new FramesheetRenderer(frames).renderAsCanvas().toDataURL();
			} catch {
				return "";
			}
		}
	};
	//#endregion
	//#region src/js/controller/piskel/PiskelController.ts
	var PiskelController = class {
		constructor(piskel) {
			if (piskel) this.setPiskel(piskel);
			else throw "A piskel instance is mandatory for instanciating PiskelController";
		}
		/**
		* Set the current piskel. Will reset the selected frame and layer unless specified
		* @param {Object} piskel
		* @param {Object} options:
		*                 preserveState {Boolean} if true, keep the selected frame and layer
		*                 noSnapshot {Boolean} if true, do not save a snapshot in the piskel
		*                            history for this call to setPiskel
		*/
		setPiskel(piskel, options) {
			this.piskel = piskel;
			if (!options || !options.preserveState) {
				this.currentLayerIndex = 0;
				this.currentFrameIndex = 0;
			}
			this.layerIdCounter = 1;
		}
		init() {}
		getHeight() {
			return assertInitialized(this.piskel, "piskel").getHeight();
		}
		getWidth() {
			return assertInitialized(this.piskel, "piskel").getWidth();
		}
		getFPS() {
			return assertInitialized(this.piskel, "piskel").fps;
		}
		setFPS(fps) {
			if (typeof fps !== "number") return;
			assertInitialized(this.piskel, "piskel").fps = fps;
			$.publish(Events.FPS_CHANGED);
		}
		getLayers() {
			return assertInitialized(this.piskel, "piskel").getLayers();
		}
		getCurrentLayer() {
			return this.getLayerAt(assertInitialized(this.currentLayerIndex, "currentLayerIndex"));
		}
		getLayerAt(index) {
			return assertInitialized(this.piskel, "piskel").getLayerAt(index);
		}
		hasLayerAt(index) {
			return !!this.getLayerAt(index);
		}
		getLayerByIndex(index) {
			const layers = this.getLayers();
			if (layers[index]) return layers[index];
			else return null;
		}
		getCurrentFrame() {
			return this.getCurrentLayer().getFrameAt(assertInitialized(this.currentFrameIndex, "currentFrameIndex"));
		}
		getCurrentLayerIndex() {
			return assertInitialized(this.currentLayerIndex, "currentLayerIndex");
		}
		getCurrentFrameIndex() {
			return assertInitialized(this.currentFrameIndex, "currentFrameIndex");
		}
		getPiskel() {
			return assertInitialized(this.piskel, "piskel");
		}
		isTransparent() {
			return this.getLayers().some(function(l) {
				return l.isTransparent();
			});
		}
		renderFrameAt(index, preserveOpacity) {
			return LayerUtils.flattenFrameAt(this.getLayers(), index, preserveOpacity);
		}
		hasFrameAt(index) {
			return !!this.getCurrentLayer().getFrameAt(index);
		}
		addFrame() {
			this.addFrameAt(this.getFrameCount());
		}
		addFrameAtCurrentIndex() {
			this.addFrameAt(this.getCurrentFrameIndex() + 1);
		}
		addFrameAt(index) {
			this.getLayers().forEach((l) => {
				l.addFrameAt(this.createEmptyFrame_(), index);
			});
			this.onFrameAddedAt_(index);
		}
		onFrameAddedAt_(index) {
			assertInitialized(this.piskel, "piskel").hiddenFrames = assertInitialized(this.piskel, "piskel").hiddenFrames.map(function(hiddenIndex) {
				if (hiddenIndex >= index) return hiddenIndex + 1;
				return hiddenIndex;
			});
			this.setCurrentFrameIndex(index);
		}
		createEmptyFrame_() {
			return new Frame(assertInitialized(this.piskel, "piskel").getWidth(), assertInitialized(this.piskel, "piskel").getHeight());
		}
		removeFrameAt(index) {
			this.getLayers().forEach(function(l) {
				l.removeFrameAt(index);
			});
			assertInitialized(this.piskel, "piskel").hiddenFrames = assertInitialized(this.piskel, "piskel").hiddenFrames.map(function(hiddenIndex) {
				if (hiddenIndex > index) return hiddenIndex - 1;
				return hiddenIndex;
			});
			const currentFrameIndex = this.getCurrentFrameIndex();
			if (currentFrameIndex >= index && currentFrameIndex > 0) this.setCurrentFrameIndex(currentFrameIndex - 1);
		}
		duplicateCurrentFrame() {
			this.duplicateFrameAt(assertInitialized(this.currentFrameIndex, "currentFrameIndex"));
		}
		duplicateFrameAt(index) {
			this.getLayers().forEach(function(l) {
				l.duplicateFrameAt(index);
			});
			this.onFrameAddedAt_(index + 1);
		}
		/**
		* Toggle frame visibility for the frame at the provided index.
		* A visible frame will be included in the animated preview.
		*/
		toggleFrameVisibilityAt(index) {
			let hiddenFrames = assertInitialized(this.piskel, "piskel").hiddenFrames;
			if (hiddenFrames.indexOf(index) === -1) hiddenFrames.push(index);
			else hiddenFrames = hiddenFrames.filter(function(i) {
				return i !== index;
			});
			assertInitialized(this.piskel, "piskel").hiddenFrames = hiddenFrames.sort();
		}
		moveFrame(fromIndex, toIndex) {
			this.getLayers().forEach(function(l) {
				l.moveFrame(fromIndex, toIndex);
			});
			assertInitialized(this.piskel, "piskel").hiddenFrames = assertInitialized(this.piskel, "piskel").hiddenFrames.map(function(index) {
				if (index === fromIndex) return toIndex;
				if (index >= Math.min(fromIndex, toIndex) && index <= Math.max(fromIndex, toIndex)) if (fromIndex < toIndex) return index - 1;
				else return index + 1;
				return index;
			});
		}
		hasVisibleFrameAt(index) {
			return assertInitialized(this.piskel, "piskel").hiddenFrames.indexOf(index) === -1;
		}
		getVisibleFrameIndexes() {
			return this.getCurrentLayer().getFrames().map(function(_frame, index) {
				return index;
			}).filter((index) => {
				return assertInitialized(this.piskel, "piskel").hiddenFrames.indexOf(index) === -1;
			});
		}
		getFrameCount() {
			return assertInitialized(this.piskel, "piskel").getFrameCount();
		}
		setCurrentFrameIndex(index) {
			if (this.hasFrameAt(index)) this.currentFrameIndex = index;
			else window.console.error("Could not set current frame index to " + index);
		}
		selectNextFrame() {
			const nextIndex = this.getCurrentFrameIndex() + 1;
			if (nextIndex < this.getFrameCount()) this.setCurrentFrameIndex(nextIndex);
		}
		selectPreviousFrame() {
			const nextIndex = this.getCurrentFrameIndex() - 1;
			if (nextIndex >= 0) this.setCurrentFrameIndex(nextIndex);
		}
		setCurrentLayerIndex(index) {
			if (this.hasLayerAt(index)) this.currentLayerIndex = index;
			else window.console.error("Could not set current layer index to " + index);
		}
		selectLayer(layer) {
			const index = this.getLayers().indexOf(layer);
			if (index != -1) this.setCurrentLayerIndex(index);
		}
		renameLayerAt(index, name) {
			const layer = this.getLayerByIndex(index);
			if (layer) layer.setName(name);
		}
		setLayerOpacityAt(index, opacity) {
			const layer = this.getLayerByIndex(index);
			if (layer) layer.setOpacity(opacity);
		}
		mergeDownLayerAt(index) {
			const layer = this.getLayerByIndex(index);
			const downLayer = this.getLayerByIndex(index - 1);
			if (layer && downLayer) {
				const mergedLayer = LayerUtils.mergeLayers(layer, downLayer);
				this.removeLayerAt(index);
				assertInitialized(this.piskel, "piskel").addLayerAt(mergedLayer, index);
				this.removeLayerAt(index - 1);
				this.selectLayer(mergedLayer);
			}
		}
		generateLayerName_() {
			let name = "Layer " + this.layerIdCounter;
			while (this.hasLayerForName_(name)) {
				this.layerIdCounter = assertInitialized(this.layerIdCounter, "layerIdCounter") + 1;
				name = "Layer " + this.layerIdCounter;
			}
			return name;
		}
		duplicateCurrentLayer() {
			const layer = this.getCurrentLayer();
			const clone = LayerUtils.clone(layer);
			const currentLayerIndex = this.getCurrentLayerIndex();
			assertInitialized(this.piskel, "piskel").addLayerAt(clone, currentLayerIndex + 1);
			this.setCurrentLayerIndex(currentLayerIndex + 1);
		}
		createLayer(name) {
			if (!name) name = this.generateLayerName_();
			if (!this.hasLayerForName_(name)) {
				const layer = new Layer(name);
				for (let i = 0; i < this.getFrameCount(); i++) layer.addFrame(this.createEmptyFrame_());
				const currentLayerIndex = this.getCurrentLayerIndex();
				assertInitialized(this.piskel, "piskel").addLayerAt(layer, currentLayerIndex + 1);
				this.setCurrentLayerIndex(currentLayerIndex + 1);
			} else throw "Layer name should be unique";
		}
		hasLayerForName_(name) {
			return assertInitialized(this.piskel, "piskel").getLayersByName(name).length > 0;
		}
		moveLayerUp(toTop) {
			const layer = this.getCurrentLayer();
			assertInitialized(this.piskel, "piskel").moveLayerUp(layer, toTop);
			this.selectLayer(layer);
		}
		moveLayerDown(toBottom) {
			const layer = this.getCurrentLayer();
			assertInitialized(this.piskel, "piskel").moveLayerDown(layer, toBottom);
			this.selectLayer(layer);
		}
		removeCurrentLayer() {
			const currentLayerIndex = this.getCurrentLayerIndex();
			this.removeLayerAt(currentLayerIndex);
		}
		removeLayerAt(index) {
			if (!this.hasLayerAt(index)) return;
			const layer = this.getLayerAt(index);
			assertInitialized(this.piskel, "piskel").removeLayer(layer);
			if (this.getCurrentLayerIndex() === index) this.setCurrentLayerIndex(Math.max(0, index - 1));
		}
		serialize() {
			return Serializer.serialize(assertInitialized(this.piskel, "piskel"));
		}
		/**
		* Check if the current sprite is empty. Emptiness here means no pixel has been filled
		* on any layer or frame for the current sprite.
		*/
		isEmpty() {
			return assertInitialized(app.currentColorsService, "currentColorsService").getCurrentColors().length === 0;
		}
	};
	//#endregion
	//#region src/js/controller/piskel/PublicPiskelController.ts
	/**
	* The PublicPiskelController is a decorator on PiskelController, provides the same API
	* but will fire RESET/SAVE events when appropriate so that other objects get notified
	* when important changes are made on the current Piskel.
	* @param {PiskelController} piskelController the wrapped PiskelController
	*/
	var PublicPiskelController = class {
		constructor(piskelController) {
			this.piskelController = piskelController;
		}
		init() {
			const shortcuts = Shortcuts;
			assertInitialized(app.shortcutService, "shortcutService").registerShortcut(shortcuts.MISC.PREVIOUS_FRAME, this.selectPreviousFrame.bind(this));
			assertInitialized(app.shortcutService, "shortcutService").registerShortcut(shortcuts.MISC.NEXT_FRAME, this.selectNextFrame.bind(this));
			assertInitialized(app.shortcutService, "shortcutService").registerShortcut(shortcuts.MISC.NEW_FRAME, this.addFrameAtCurrentIndex.bind(this));
			assertInitialized(app.shortcutService, "shortcutService").registerShortcut(shortcuts.MISC.DUPLICATE_FRAME, this.duplicateCurrentFrame.bind(this));
		}
		getWrappedPiskelController() {
			return this.piskelController;
		}
		/**
		* Set the current piskel. Will reset the selected frame and layer unless specified
		* @param {Object} piskel
		* @param {Object} options:
		*                 preserveState {Boolean} if true, keep the selected frame and layer
		*                 noSnapshot {Boolean} if true, do not save a snapshot in the piskel
		*                            history for this call to setPiskel
		*/
		setPiskel(piskel, options) {
			this.piskelController.setPiskel(piskel, options);
			$.publish(Events.FRAME_SIZE_CHANGED);
			$.publish(Events.PISKEL_RESET);
			if (!options || !options.noSnapshot) $.publish(Events.PISKEL_SAVE_STATE, { type: HistoryService.SNAPSHOT });
		}
		getStateInfo_() {
			return {
				frameIndex: this.piskelController.getCurrentFrameIndex(),
				layerIndex: this.piskelController.getCurrentLayerIndex()
			};
		}
		raiseSaveStateEvent_(fn, stateInfo) {
			$.publish(Events.PISKEL_SAVE_STATE, {
				type: HistoryService.REPLAY,
				scope: this,
				replay: { fn },
				state: stateInfo
			});
		}
		replay(_frame, replayData) {
			replayData.fn();
		}
		getHeight() {
			return this.piskelController.getHeight();
		}
		getWidth() {
			return this.piskelController.getWidth();
		}
		getFPS() {
			return this.piskelController.getFPS();
		}
		setFPS(fps) {
			return this.piskelController.setFPS(fps);
		}
		getLayers() {
			return this.piskelController.getLayers();
		}
		getCurrentLayer() {
			return this.piskelController.getCurrentLayer();
		}
		getLayerAt(index) {
			return this.piskelController.getLayerAt(index);
		}
		hasLayerAt(index) {
			return this.piskelController.hasLayerAt(index);
		}
		getLayerByIndex(index) {
			return this.piskelController.getLayerByIndex(index);
		}
		getCurrentFrame() {
			return this.piskelController.getCurrentFrame();
		}
		getCurrentLayerIndex() {
			return this.piskelController.getCurrentLayerIndex();
		}
		getCurrentFrameIndex() {
			return this.piskelController.getCurrentFrameIndex();
		}
		getPiskel() {
			return this.piskelController.getPiskel();
		}
		isTransparent() {
			return this.piskelController.isTransparent();
		}
		renderFrameAt(index, preserveOpacity) {
			return this.piskelController.renderFrameAt(index, preserveOpacity);
		}
		hasFrameAt(index) {
			return this.piskelController.hasFrameAt(index);
		}
		addFrame() {
			const stateInfo = this.getStateInfo_();
			this.piskelController.addFrame();
			this.raiseSaveStateEvent_(() => this.piskelController.addFrame(), stateInfo);
			$.publish(Events.PISKEL_RESET);
		}
		addFrameAtCurrentIndex() {
			const stateInfo = this.getStateInfo_();
			this.piskelController.addFrameAtCurrentIndex();
			this.raiseSaveStateEvent_(() => this.piskelController.addFrameAtCurrentIndex(), stateInfo);
			$.publish(Events.PISKEL_RESET);
		}
		addFrameAt(index) {
			const stateInfo = this.getStateInfo_();
			this.piskelController.addFrameAt(index);
			this.raiseSaveStateEvent_(() => this.piskelController.addFrameAt(index), stateInfo);
			$.publish(Events.PISKEL_RESET);
		}
		onFrameAddedAt_(index) {
			return this.piskelController.onFrameAddedAt_(index);
		}
		createEmptyFrame_() {
			return this.piskelController.createEmptyFrame_();
		}
		removeFrameAt(index) {
			const stateInfo = this.getStateInfo_();
			this.piskelController.removeFrameAt(index);
			this.raiseSaveStateEvent_(() => this.piskelController.removeFrameAt(index), stateInfo);
			$.publish(Events.PISKEL_RESET);
		}
		duplicateCurrentFrame() {
			const stateInfo = this.getStateInfo_();
			this.piskelController.duplicateCurrentFrame();
			this.raiseSaveStateEvent_(() => this.piskelController.duplicateCurrentFrame(), stateInfo);
			$.publish(Events.PISKEL_RESET);
		}
		duplicateFrameAt(index) {
			const stateInfo = this.getStateInfo_();
			this.piskelController.duplicateFrameAt(index);
			this.raiseSaveStateEvent_(() => this.piskelController.duplicateFrameAt(index), stateInfo);
			$.publish(Events.PISKEL_RESET);
		}
		toggleFrameVisibilityAt(index) {
			const stateInfo = this.getStateInfo_();
			this.piskelController.toggleFrameVisibilityAt(index);
			this.raiseSaveStateEvent_(() => this.piskelController.toggleFrameVisibilityAt(index), stateInfo);
			$.publish(Events.PISKEL_RESET);
		}
		moveFrame(fromIndex, toIndex) {
			const stateInfo = this.getStateInfo_();
			this.piskelController.moveFrame(fromIndex, toIndex);
			this.raiseSaveStateEvent_(() => this.piskelController.moveFrame(fromIndex, toIndex), stateInfo);
			$.publish(Events.PISKEL_RESET);
		}
		hasVisibleFrameAt(index) {
			return this.piskelController.hasVisibleFrameAt(index);
		}
		getVisibleFrameIndexes() {
			return this.piskelController.getVisibleFrameIndexes();
		}
		getFrameCount() {
			return this.piskelController.getFrameCount();
		}
		setCurrentFrameIndex(index) {
			this.piskelController.setCurrentFrameIndex(index);
			$.publish(Events.PISKEL_RESET);
		}
		selectNextFrame() {
			this.piskelController.selectNextFrame();
			$.publish(Events.PISKEL_RESET);
		}
		selectPreviousFrame() {
			this.piskelController.selectPreviousFrame();
			$.publish(Events.PISKEL_RESET);
		}
		setCurrentLayerIndex(index) {
			this.piskelController.setCurrentLayerIndex(index);
			$.publish(Events.PISKEL_RESET);
		}
		selectLayer(layer) {
			this.piskelController.selectLayer(layer);
			$.publish(Events.PISKEL_RESET);
		}
		renameLayerAt(index, name) {
			const stateInfo = this.getStateInfo_();
			this.piskelController.renameLayerAt(index, name);
			this.raiseSaveStateEvent_(() => this.piskelController.renameLayerAt(index, name), stateInfo);
		}
		setLayerOpacityAt(index, opacity) {
			const stateInfo = this.getStateInfo_();
			this.piskelController.setLayerOpacityAt(index, opacity);
			this.raiseSaveStateEvent_(() => this.piskelController.setLayerOpacityAt(index, opacity), stateInfo);
			$.publish(Events.PISKEL_RESET);
		}
		mergeDownLayerAt(index) {
			const stateInfo = this.getStateInfo_();
			this.piskelController.mergeDownLayerAt(index);
			this.raiseSaveStateEvent_(() => this.piskelController.mergeDownLayerAt(index), stateInfo);
			$.publish(Events.PISKEL_RESET);
		}
		generateLayerName_() {
			return this.piskelController.generateLayerName_();
		}
		duplicateCurrentLayer() {
			const stateInfo = this.getStateInfo_();
			this.piskelController.duplicateCurrentLayer();
			this.raiseSaveStateEvent_(() => this.piskelController.duplicateCurrentLayer(), stateInfo);
			$.publish(Events.PISKEL_RESET);
		}
		createLayer(name) {
			const stateInfo = this.getStateInfo_();
			this.piskelController.createLayer(name);
			this.raiseSaveStateEvent_(() => this.piskelController.createLayer(name), stateInfo);
			$.publish(Events.PISKEL_RESET);
		}
		hasLayerForName_(name) {
			return this.piskelController.hasLayerForName_(name);
		}
		moveLayerUp(toTop) {
			const stateInfo = this.getStateInfo_();
			this.piskelController.moveLayerUp(toTop);
			this.raiseSaveStateEvent_(() => this.piskelController.moveLayerUp(toTop), stateInfo);
			$.publish(Events.PISKEL_RESET);
		}
		moveLayerDown(toBottom) {
			const stateInfo = this.getStateInfo_();
			this.piskelController.moveLayerDown(toBottom);
			this.raiseSaveStateEvent_(() => this.piskelController.moveLayerDown(toBottom), stateInfo);
			$.publish(Events.PISKEL_RESET);
		}
		removeCurrentLayer() {
			const stateInfo = this.getStateInfo_();
			this.piskelController.removeCurrentLayer();
			this.raiseSaveStateEvent_(() => this.piskelController.removeCurrentLayer(), stateInfo);
			$.publish(Events.PISKEL_RESET);
		}
		removeLayerAt(index) {
			return this.piskelController.removeLayerAt(index);
		}
		serialize() {
			return this.piskelController.serialize();
		}
		isEmpty() {
			return this.piskelController.isEmpty();
		}
	};
	//#endregion
	//#region src/js/rendering/frame/BackgroundImageFrameRenderer.ts
	var BackgroundImageFrameRenderer = class {
		constructor(container, zoom) {
			this.container = container;
			this.setZoom(zoom);
			this.frameContainer = container.ownerDocument.createElement("div");
			this.frameContainer.classList.add("background-image-frame-container");
			container.appendChild(this.frameContainer);
			this.cachedFrameProcessor = new CachedFrameProcessor();
			this.cachedFrameProcessor.setFrameProcessor(this.frameToDataUrl_.bind(this));
		}
		frameToDataUrl_(frame) {
			let canvas;
			if (frame instanceof RenderedFrame) canvas = ImageResizer.scale(frame.getRenderedFrame(), Number(this.zoom));
			else canvas = FrameUtils.toImage(frame, this.zoom);
			return canvas.toDataURL("image/png");
		}
		render(frame) {
			const imageSrc = this.cachedFrameProcessor.get(frame, this.zoom);
			this.frameContainer.style.backgroundImage = "url(" + imageSrc + ")";
		}
		show() {
			if (this.frameContainer) this.frameContainer.style.display = "block";
		}
		setZoom(zoom) {
			this.zoom = zoom;
		}
		getZoom() {
			return this.zoom;
		}
		setRepeated(repeat) {
			let repeatValue;
			if (repeat) repeatValue = "repeat";
			else repeatValue = "no-repeat";
			this.frameContainer.style.backgroundRepeat = repeatValue;
		}
	};
	//#endregion
	//#region src/js/controller/preview/PopupPreviewController.ts
	var POPUP_TITLE = "Piskel - preview";
	var PopupPreviewController = class {
		constructor(piskelController) {
			this.piskelController = piskelController;
			this.popup = null;
			this.renderer = null;
			this.renderFlag = false;
		}
		init() {
			EventUtils.addEventListener(window, "pagehide", this.onMainWindowUnload_, this);
		}
		isOpen() {
			return !!this.popup;
		}
		open() {
			if (!this.isOpen()) {
				this.popup = window.open("about:blank", "", "width=320,height=320");
				window.setTimeout(this.onPopupLoaded.bind(this), 500);
			} else assertInitialized(this.popup, "popup").focus();
		}
		onPopupLoaded() {
			assertInitialized(this.popup, "popup").document.title = POPUP_TITLE;
			assertInitialized(this.popup, "popup").document.body.innerHTML = Template.get("popup-preview-partial");
			EventUtils.addEventListener(assertInitialized(this.popup, "popup"), "resize", this.onWindowResize_, this);
			EventUtils.addEventListener(assertInitialized(this.popup, "popup"), "pagehide", this.onPopupClosed_, this);
			this.renderer = new BackgroundImageFrameRenderer(Dom.getElement(".preview-container", assertInitialized(this.popup, "popup").document));
			this.updateZoom_();
			this.renderFlag = true;
		}
		render(frame) {
			if (this.isOpen() && this.renderer) {
				this.renderer.render(frame);
				this.renderFlag = false;
			}
		}
		onWindowResize_() {
			this.updateZoom_();
			this.renderFlag = true;
		}
		updateZoom_() {
			const documentElement = assertInitialized(this.popup, "popup").document.documentElement;
			const wZoom = documentElement.clientWidth / this.piskelController.getWidth();
			const hZoom = documentElement.clientHeight / this.piskelController.getHeight();
			const zoom = Math.min(wZoom, hZoom);
			assertInitialized(this.renderer, "renderer").setZoom(zoom);
			const height = this.piskelController.getHeight() * zoom;
			const width = this.piskelController.getWidth() * zoom;
			const container = Dom.getElement(".preview-container", assertInitialized(this.popup, "popup").document);
			container.style.height = height + "px";
			container.style.width = width + "px";
			const horizontalMargin = (documentElement.clientHeight - height) / 2;
			container.style.marginTop = horizontalMargin + "px";
			container.style.marginBottom = horizontalMargin + "px";
			const verticalMargin = (documentElement.clientWidth - width) / 2;
			container.style.marginLeft = verticalMargin + "px";
			container.style.marginRight = verticalMargin + "px";
		}
		onPopupClosed_() {
			this.popup = null;
		}
		onMainWindowUnload_() {
			if (this.isOpen()) {
				assertInitialized(this.popup, "popup").close();
				this.popup = null;
				this.renderer = null;
			}
		}
	};
	//#endregion
	//#region src/js/controller/preview/PreviewActionsController.ts
	var PreviewActionsController = class {
		constructor(previewController, container) {
			this.previewController = previewController;
			this.piskelController = previewController.piskelController;
			this.container = container;
			this.onionSkinShortcut = Shortcuts.MISC.ONION_SKIN;
			this.toggleGridShortcut = Shortcuts.MISC.TOGGLE_GRID;
			this.fpsRangeInput = Dom.getElement("#preview-fps");
			this.fpsCounterDisplay = Dom.getElement("#display-fps");
			this.openPopupPreview = Dom.getElement(".open-popup-preview-button");
			this.toggleGridButton = Dom.getElement(".toggle-grid-button");
			this.previewSizeDropdown = Dom.getElement(".preview-drop-down");
			this.previewSizes = {
				original: {
					button: Dom.getElement(".original-size-button"),
					shortcut: Shortcuts.MISC.X1_PREVIEW,
					tooltip: "Original size preview"
				},
				best: {
					button: Dom.getElement(".best-size-button"),
					shortcut: Shortcuts.MISC.BEST_PREVIEW,
					tooltip: "Best size preview"
				},
				full: {
					button: Dom.getElement(".full-size-button"),
					shortcut: Shortcuts.MISC.FULL_PREVIEW,
					tooltip: "Full size preview"
				}
			};
			this.toggleOnionSkinButton = Dom.getElement(".preview-toggle-onion-skin");
		}
		init() {
			this.fpsRangeInput.addEventListener("change", this.onFpsRangeInputUpdate_.bind(this));
			this.fpsRangeInput.addEventListener("input", this.onFpsRangeInputUpdate_.bind(this));
			const addEvent = EventUtils.addEventListener;
			addEvent(this.toggleOnionSkinButton, "click", this.toggleOnionSkin_, this);
			addEvent(this.openPopupPreview, "click", this.onOpenPopupPreviewClick_, this);
			addEvent(this.toggleGridButton, "click", this.toggleGrid_, this);
			const registerShortcut = assertInitialized(app.shortcutService, "shortcutService").registerShortcut.bind(app.shortcutService);
			registerShortcut(this.onionSkinShortcut, this.toggleOnionSkin_.bind(this));
			registerShortcut(this.toggleGridShortcut, this.toggleGrid_.bind(this));
			const onionSkinTooltip = TooltipFormatter.format("Toggle onion skin", this.onionSkinShortcut);
			this.toggleOnionSkinButton.setAttribute("title", onionSkinTooltip);
			for (const size in this.previewSizes) if (this.previewSizes.hasOwnProperty(size)) {
				const previewSize = this.previewSizes[size];
				addEvent(previewSize.button, "click", this.onChangePreviewSize_, this, size);
				registerShortcut(previewSize.shortcut, this.onChangePreviewSize_.bind(this, size));
				const tooltip = TooltipFormatter.format(previewSize.tooltip, previewSize.shortcut);
				previewSize.button.setAttribute("title", tooltip);
			}
			$.subscribe(Events.FRAME_SIZE_CHANGED, this.updatePreviewSizeButtons_.bind(this));
			$.subscribe(Events.USER_SETTINGS_CHANGED, this.onUserSettingsChange_.bind(this));
			$.subscribe(Events.FPS_CHANGED, this.updateFPS_.bind(this));
			$.subscribe(Events.PISKEL_RESET, this.updateFPS_.bind(this));
			this.updatePreviewSizeButtons_();
			this.updateOnionSkinPreview_();
			this.selectPreviewSizeButton_();
			this.updateFPS_();
			this.updateMaxFPS_();
			this.updateToggleGridButton_();
		}
		updateToggleGridButton_() {
			const gridEnabled = UserSettings.get(UserSettings.GRID_ENABLED);
			this.toggleGridButton.classList.toggle("icon-minimap-grid-white", !gridEnabled);
			this.toggleGridButton.classList.toggle("icon-minimap-grid-gold", gridEnabled);
			this.toggleGridButton.classList.toggle("preview-contextual-action-enabled", gridEnabled);
		}
		toggleGrid_() {
			const gridEnabled = UserSettings.get(UserSettings.GRID_ENABLED);
			UserSettings.set(UserSettings.GRID_ENABLED, !gridEnabled);
		}
		updatePreviewSizeButtons_() {
			const fullZoom = this.previewController.getZoom();
			const bestZoom = Math.floor(fullZoom);
			const seamlessModeEnabled = UserSettings.get(UserSettings.SEAMLESS_MODE);
			let validSizes;
			if (fullZoom < 1) {
				this.disablePreviewSizeWidget_("No other option available");
				validSizes = ["full"];
			} else if (fullZoom === 1) {
				this.disablePreviewSizeWidget_("No other option available");
				validSizes = ["original"];
			} else if (seamlessModeEnabled) {
				this.disablePreviewSizeWidget_("Disabled in tile mode");
				validSizes = ["original"];
			} else {
				this.enablePreviewSizeWidget_();
				if (fullZoom === bestZoom) validSizes = ["original", "best"];
				else if (bestZoom === 1) validSizes = ["full", "original"];
				else validSizes = [
					"full",
					"original",
					"best"
				];
			}
			this.previewSizes.best.button.textContent = Math.floor(fullZoom) + "x";
			for (const size in this.previewSizes) if (this.previewSizes.hasOwnProperty(size)) {
				const previewSize = this.previewSizes[size];
				const isSizeEnabled = validSizes.indexOf(size) != -1;
				previewSize.button.classList.toggle("preview-contextual-action-hidden", !isSizeEnabled);
			}
			const selectedSize = UserSettings.get(UserSettings.PREVIEW_SIZE);
			if (validSizes.indexOf(selectedSize) === -1) this.onChangePreviewSize_(validSizes[0]);
		}
		enablePreviewSizeWidget_() {
			this.previewSizeDropdown.classList.remove("preview-drop-down-disabled");
		}
		disablePreviewSizeWidget_(reason) {
			Dom.getElement(".preview-disable-overlay").setAttribute("data-original-title", reason);
			this.previewSizeDropdown.classList.add("preview-drop-down-disabled");
		}
		onOpenPopupPreviewClick_() {
			this.previewController.openPopupPreview();
		}
		onChangePreviewSize_(size) {
			if (!this.previewSizes[size].button.classList.contains("preview-contextual-action-hidden")) UserSettings.set(UserSettings.PREVIEW_SIZE, size);
		}
		onUserSettingsChange_(_evt, name) {
			if (name == UserSettings.ONION_SKIN) this.updateOnionSkinPreview_();
			else if (name == UserSettings.MAX_FPS) this.updateMaxFPS_();
			else if (name === UserSettings.SEAMLESS_MODE) this.updatePreviewSizeButtons_();
			else if (name === UserSettings.GRID_ENABLED) this.updateToggleGridButton_();
			else this.selectPreviewSizeButton_();
		}
		updateOnionSkinPreview_() {
			const enabledClassname = "preview-toggle-onion-skin-enabled";
			const isEnabled = UserSettings.get(UserSettings.ONION_SKIN);
			this.toggleOnionSkinButton.classList.toggle(enabledClassname, isEnabled);
		}
		selectPreviewSizeButton_() {
			const currentlySelected = document.querySelector(".size-button-selected");
			if (currentlySelected) currentlySelected.classList.remove("size-button-selected");
			const selectedSize = UserSettings.get(UserSettings.PREVIEW_SIZE);
			this.previewSizes[selectedSize].button.classList.add("size-button-selected");
		}
		updateMaxFPS_() {
			const maxFps = UserSettings.get(UserSettings.MAX_FPS);
			this.fpsRangeInput.setAttribute("max", String(maxFps));
			this.piskelController.setFPS(Math.min(maxFps, this.piskelController.getFPS()));
		}
		/**
		* Event handler triggered on 'input' or 'change' events.
		*/
		onFpsRangeInputUpdate_(evt) {
			const fps = parseInt(this.fpsRangeInput.value, 10);
			this.piskelController.setFPS(fps);
			if (evt.type === "change") this.fpsRangeInput.blur();
		}
		updateFPS_() {
			const fps = this.piskelController.getFPS();
			this.fpsRangeInput.value = String(0);
			this.fpsRangeInput.value = String(fps);
			this.fpsCounterDisplay.innerHTML = fps + " FPS";
		}
		toggleOnionSkin_() {
			const currentValue = UserSettings.get(UserSettings.ONION_SKIN);
			UserSettings.set(UserSettings.ONION_SKIN, !currentValue);
		}
	};
	//#endregion
	//#region src/js/controller/preview/PreviewController.ts
	var PREVIEW_SIZE = 200;
	var RENDER_MINIMUM_DELAY = 300;
	var PreviewController = class {
		constructor(piskelController, container) {
			this.piskelController = piskelController;
			this.container = container;
			this.elapsedTime = 0;
			this.currentIndex = 0;
			this.lastRenderTime = 0;
			this.renderFlag = true;
			this.renderer = new BackgroundImageFrameRenderer(this.container);
			this.popupPreviewController = new PopupPreviewController(piskelController);
			this.previewActionsController = new PreviewActionsController(this, container);
		}
		init() {
			const width = Constants.ANIMATED_PREVIEW_WIDTH + Constants.RIGHT_COLUMN_PADDING_LEFT;
			Dom.getElement(".right-column").style.width = width + "px";
			$.subscribe(Events.FRAME_SIZE_CHANGED, this.onFrameSizeChange_.bind(this));
			$.subscribe(Events.USER_SETTINGS_CHANGED, this.onUserSettingsChange_.bind(this));
			$.subscribe(Events.PISKEL_SAVE_STATE, this.setRenderFlag_.bind(this, true));
			$.subscribe(Events.PISKEL_RESET, this.setRenderFlag_.bind(this, true));
			this.popupPreviewController.init();
			this.previewActionsController.init();
			this.updateZoom_();
			this.updateContainerDimensions_();
		}
		openPopupPreview() {
			this.popupPreviewController.open();
		}
		onUserSettingsChange_(_evt, name) {
			if (name === UserSettings.SEAMLESS_MODE) this.onFrameSizeChange_();
			else {
				this.updateZoom_();
				this.updateContainerDimensions_();
			}
		}
		updateZoom_() {
			const previewSize = UserSettings.get(UserSettings.PREVIEW_SIZE);
			let zoom;
			if (previewSize === "original") zoom = 1;
			else if (previewSize === "best") zoom = Math.floor(this.calculateZoom_());
			else if (previewSize === "full") zoom = this.calculateZoom_();
			this.renderer.setZoom(assertInitialized(zoom, "zoom"));
			this.setRenderFlag_(true);
		}
		getZoom() {
			return this.calculateZoom_();
		}
		getCoordinates(x, y) {
			const containerRect = this.container.getBoundingClientRect();
			x = x - containerRect.left;
			y = y - containerRect.top;
			const zoom = this.getZoom();
			return {
				x: Math.floor(x / zoom),
				y: Math.floor(y / zoom)
			};
		}
		render(delta) {
			this.elapsedTime += delta;
			const index = this.getNextIndex_();
			if (this.shouldRender_() || this.currentIndex != index) {
				this.currentIndex = index;
				const frame = LayerUtils.mergeFrameAt(this.piskelController.getLayers(), index);
				this.renderer.render(frame);
				this.renderFlag = false;
				this.lastRenderTime = Date.now();
				this.popupPreviewController.render(frame);
			}
		}
		getNextIndex_() {
			const fps = this.piskelController.getFPS();
			if (fps === 0) return this.piskelController.getCurrentFrameIndex();
			else {
				let index = Math.floor(this.elapsedTime / (1e3 / fps));
				const frameIndexes = this.piskelController.getVisibleFrameIndexes();
				if (frameIndexes.length <= index) {
					this.elapsedTime = 0;
					index = frameIndexes.length ? frameIndexes[0] : this.piskelController.getCurrentFrameIndex();
					return index;
				}
				return frameIndexes[index];
			}
		}
		/**
		* Calculate the preview zoom depending on the framesheet size
		*/
		calculateZoom_() {
			const frame = this.piskelController.getCurrentFrame();
			const hZoom = PREVIEW_SIZE / frame.getHeight();
			const wZoom = PREVIEW_SIZE / frame.getWidth();
			return Math.min(hZoom, wZoom);
		}
		onFrameSizeChange_() {
			this.updateZoom_();
			this.updateContainerDimensions_();
		}
		updateContainerDimensions_() {
			const isSeamless = UserSettings.get(UserSettings.SEAMLESS_MODE);
			this.renderer.setRepeated(isSeamless);
			let width;
			let height;
			if (isSeamless) {
				height = PREVIEW_SIZE;
				width = PREVIEW_SIZE;
			} else {
				const zoom = this.getZoom();
				const frame = this.piskelController.getCurrentFrame();
				height = frame.getHeight() * zoom;
				width = frame.getWidth() * zoom;
			}
			const containerEl = this.container;
			containerEl.style.height = height + "px";
			containerEl.style.width = width + "px";
			const horizontalMargin = (PREVIEW_SIZE - height) / 2;
			containerEl.style.marginTop = horizontalMargin + "px";
			containerEl.style.marginBottom = horizontalMargin + "px";
			const verticalMargin = (PREVIEW_SIZE - width) / 2;
			containerEl.style.marginLeft = verticalMargin + "px";
			containerEl.style.marginRight = verticalMargin + "px";
		}
		setRenderFlag_(bool) {
			this.renderFlag = bool;
		}
		shouldRender_() {
			return (this.renderFlag || this.popupPreviewController.renderFlag) && Date.now() - this.lastRenderTime > RENDER_MINIMUM_DELAY;
		}
	};
	//#endregion
	//#region src/js/controller/settings/AbstractSettingController.ts
	var AbstractSettingController = class {
		addEventListener(el, type, callback) {
			EventUtils.addEventListener(el, type, callback, this);
		}
		destroy() {
			EventUtils.removeAllEventListeners(this);
			this.nullifyDomReferences_();
		}
		nullifyDomReferences_() {
			for (const key of Object.keys(this)) {
				const value = Reflect.get(this, key);
				if (typeof value === "object" && value !== null && "nodeName" in value && value.nodeName) Reflect.set(this, key, null);
			}
		}
	};
	//#endregion
	//#region src/js/controller/settings/ImportController.ts
	var ImportController = class extends AbstractSettingController {
		constructor(piskelController) {
			super();
			this.piskelController = piskelController;
		}
		init() {
			this.hiddenFileInput = Dom.getElement("[name=\"file-upload-input\"]");
			this.addEventListener(this.hiddenFileInput, "change", this.onFileUploadChange_);
			this.hiddenOpenPiskelInput = Dom.getElement("[name=\"open-piskel-input\"]");
			this.addEventListener(".browse-local-button", "click", this.onBrowseLocalClick_);
			this.addEventListener(".browse-backups-button", "click", this.onBrowseBackupsClick_);
			this.addEventListener(".file-input-button", "click", this.onFileInputClick_);
			if (Environment.detectNodeWebkit()) this.addEventListener(".open-piskel-button", "click", this.openPiskelDesktop_);
			else {
				this.addEventListener(this.hiddenOpenPiskelInput, "change", this.onOpenPiskelChange_);
				this.addEventListener(".open-piskel-button", "click", this.onOpenPiskelClick_);
			}
		}
		closeDrawer_() {
			$.publish(Events.CLOSE_SETTINGS_DRAWER);
		}
		onFileUploadChange_() {
			this.importPictureFromFile_();
		}
		onFileInputClick_() {
			assertInitialized(this.hiddenFileInput, "hiddenFileInput").click();
		}
		onOpenPiskelChange_() {
			const files = assertInitialized(this.hiddenOpenPiskelInput, "hiddenOpenPiskelInput").files;
			if (files && files.length == 1) this.openPiskelFile_(files[0]);
		}
		openPiskelDesktop_() {
			this.closeDrawer_();
			assertInitialized(app.desktopStorageService, "desktopStorageService").openPiskel();
		}
		onOpenPiskelClick_() {
			assertInitialized(this.hiddenOpenPiskelInput, "hiddenOpenPiskelInput").click();
		}
		onBrowseLocalClick_() {
			$.publish(Events.DIALOG_SHOW, { dialogId: "browse-local" });
			this.closeDrawer_();
		}
		onBrowseBackupsClick_() {
			$.publish(Events.DIALOG_SHOW, { dialogId: "browse-backups" });
			this.closeDrawer_();
		}
		openPiskelFile_(file) {
			if (this.isPiskel_(file)) {
				$.publish(Events.DIALOG_SHOW, {
					dialogId: "import",
					initArgs: { rawFiles: [file] }
				});
				this.closeDrawer_();
			} else {
				this.closeDrawer_();
				console.error("The selected file is not a piskel file");
			}
		}
		importPictureFromFile_() {
			const files = assertInitialized(this.hiddenFileInput, "hiddenFileInput").files;
			if (Array.prototype.every.call(files, function(file) {
				return file.type.indexOf("image") === 0;
			})) {
				$.publish(Events.DIALOG_SHOW, {
					dialogId: "import",
					initArgs: { rawFiles: files }
				});
				this.closeDrawer_();
			} else {
				this.closeDrawer_();
				console.error("Some files are not images");
			}
		}
		isPiskel_(file) {
			return /\.piskel$/.test(file.name);
		}
		onRestorePreviousSessionClick_() {
			if (window.confirm("This will erase your current workspace. Continue ?")) {
				assertInitialized(app.backupService, "backupService").load();
				$.publish(Events.CLOSE_SETTINGS_DRAWER);
			}
		}
	};
	//#endregion
	//#region src/js/widgets/Tabs.ts
	var Tabs = class {
		constructor(tabs, parentController, settingsName) {
			this.tabs = tabs;
			this.parentController = parentController;
			this.settingsName = settingsName;
			this.currentTab = null;
			this.currentController = null;
		}
		init(container) {
			this.tabListEl = Dom.getElement(".tab-list", container);
			this.tabContentlEl = Dom.getElement(".tab-content", container);
			EventUtils.addEventListener(this.tabListEl, "click", this.onTabsClicked_, this);
			const tab = UserSettings.get(this.settingsName);
			if (typeof tab === "string" && tab) this.selectTab(tab);
		}
		destroy() {
			if (this.currentController) this.currentController.destroy();
			EventUtils.removeAllEventListeners(this);
		}
		selectTab(tabId) {
			if (tabId === void 0 || !this.tabs[tabId] || this.currentTab == tabId) return;
			if (this.currentController) this.currentController.destroy();
			assertInitialized(this.tabContentlEl, "tabContentlEl").innerHTML = Template.get(this.tabs[tabId].template);
			const controller = new this.tabs[tabId].controller(assertInitialized(app.piskelController, "piskelController"), this.parentController);
			this.currentController = controller;
			controller.init();
			this.currentTab = tabId;
			UserSettings.set(this.settingsName, tabId);
			const selectedTab = assertInitialized(this.tabListEl, "tabListEl").querySelector(".selected");
			if (selectedTab) selectedTab.classList.remove("selected");
			Dom.getElement("[data-tab-id=\"" + tabId + "\"]", this.tabListEl).classList.add("selected");
		}
		onTabsClicked_(e) {
			const tabId = Dom.getData(e.target, "tabId");
			this.selectTab(tabId);
		}
	};
	//#endregion
	//#region src/js/controller/settings/preferences/GridPreferencesController.ts
	var colorsMap = {
		transparent: Constants.TRANSPARENT_COLOR,
		white: "#FFF1E8",
		"light-gray": "#C2C3C7",
		"dark-gray": "#5F574F",
		black: "#000000",
		blue: "#29ADFF",
		"dark-blue": "#1D2B53",
		green: "#00E436",
		"dark-green": "#008751",
		peach: "#FFCCAA",
		pink: "#FF77A8",
		yellow: "#FFEC27",
		orange: "#FFA300",
		red: "#FF004D"
	};
	var GridPreferencesController = class extends AbstractSettingController {
		constructor(piskelController, preferencesController) {
			super();
			this.piskelController = piskelController;
			this.preferencesController = preferencesController;
			this.sizePicker = new SizePicker(this.onSizePickerChanged_.bind(this));
			this.spacingPicker = new SizePicker(this.onSpacingPickerChanged_.bind(this));
		}
		init() {
			const isEnabled = UserSettings.get(UserSettings.GRID_ENABLED);
			const enableGridCheckbox = Dom.getElement(".enable-grid-checkbox");
			if (isEnabled) enableGridCheckbox.setAttribute("checked", "true");
			this.addEventListener(enableGridCheckbox, "change", this.onEnableGridChange_);
			const gridWidth = UserSettings.get(UserSettings.GRID_WIDTH);
			this.sizePicker.init(Dom.getElement(".grid-size-container"));
			this.sizePicker.setSize(gridWidth);
			const gridSpacing = UserSettings.get(UserSettings.GRID_SPACING);
			this.spacingPicker.init(Dom.getElement(".grid-spacing-container"));
			this.spacingPicker.setSize(gridSpacing);
			const colorListItemTemplate = Template.get("color-list-item-template");
			const gridColor = UserSettings.get(UserSettings.GRID_COLOR);
			let markup = "";
			Object.keys(colorsMap).forEach(function(key) {
				let background = colorsMap[key];
				if (key === "transparent") background = "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAIAAADZF8uwAAAAGUlEQVQYV2M4gwH+YwCGIasIUwhT25BVBADtzYNYrHvv4gAAAABJRU5ErkJggg==)";
				markup += Template.replace(colorListItemTemplate, {
					color: colorsMap[key],
					title: key,
					background,
					":selected": gridColor === colorsMap[key]
				});
			});
			this.gridColorList = Dom.getElement(".grid-colors-list");
			this.gridColorList.innerHTML = markup;
			this.addEventListener(this.gridColorList, "click", this.onGridColorClicked_.bind(this));
		}
		destroy() {
			this.sizePicker.destroy();
			this.spacingPicker.destroy();
			super.destroy();
		}
		onSizePickerChanged_(size) {
			UserSettings.set(UserSettings.GRID_WIDTH, size);
		}
		onSpacingPickerChanged_(size) {
			UserSettings.set(UserSettings.GRID_SPACING, size);
		}
		onEnableGridChange_(evt) {
			UserSettings.set(UserSettings.GRID_ENABLED, evt.currentTarget.checked);
		}
		onGridColorClicked_(evt) {
			const color = evt.target.dataset.color;
			if (color) {
				UserSettings.set(UserSettings.GRID_COLOR, color);
				Dom.getElement(".selected", this.gridColorList).classList.remove("selected");
				evt.target.classList.add("selected");
			}
		}
	};
	//#endregion
	//#region src/js/controller/settings/preferences/MiscPreferencesController.ts
	var MiscPreferencesController = class extends AbstractSettingController {
		constructor(piskelController, preferencesController) {
			super();
			this.piskelController = piskelController;
			this.preferencesController = preferencesController;
		}
		init() {
			this.backgroundContainer = Dom.getElement(".background-picker-wrapper");
			this.addEventListener(this.backgroundContainer, "click", this.onBackgroundClick_);
			const background = UserSettings.get(UserSettings.CANVAS_BACKGROUND);
			const selectedBackground = this.backgroundContainer.querySelector("[data-background=" + background + "]");
			if (selectedBackground) selectedBackground.classList.add("selected");
			const maxFpsInput = Dom.getElement(".max-fps-input");
			maxFpsInput.value = String(UserSettings.get(UserSettings.MAX_FPS));
			this.addEventListener(maxFpsInput, "change", this.onMaxFpsChange_);
			const colorFormat = UserSettings.get(UserSettings.COLOR_FORMAT);
			const colorFormatSelect = Dom.getElement(".color-format-select");
			const selectedColorFormatOption = colorFormatSelect.querySelector("option[value=\"" + colorFormat + "\"]");
			if (selectedColorFormatOption) selectedColorFormatOption.setAttribute("selected", "selected");
			this.addEventListener(colorFormatSelect, "change", this.onColorFormatChange_);
			const layerOpacityInput = Dom.getElement(".layer-opacity-input");
			layerOpacityInput.value = String(UserSettings.get(UserSettings.LAYER_OPACITY));
			this.addEventListener(layerOpacityInput, "change", this.onLayerOpacityChange_);
			this.addEventListener(layerOpacityInput, "input", this.onLayerOpacityChange_);
			this.updateLayerOpacityText_(layerOpacityInput.value);
		}
		onBackgroundClick_(evt) {
			const target = evt.target;
			const background = target.dataset.background;
			if (background) {
				UserSettings.set(UserSettings.CANVAS_BACKGROUND, background);
				const selected = assertInitialized(this.backgroundContainer, "backgroundContainer").querySelector(".selected");
				if (selected) selected.classList.remove("selected");
				target.classList.add("selected");
			}
		}
		onColorFormatChange_(evt) {
			UserSettings.set(UserSettings.COLOR_FORMAT, evt.target.value);
		}
		onMaxFpsChange_(evt) {
			const target = evt.target;
			const fps = parseInt(target.value, 10);
			if (fps && !isNaN(fps)) UserSettings.set(UserSettings.MAX_FPS, fps);
			else target.value = String(UserSettings.get(UserSettings.MAX_FPS));
		}
		onLayerOpacityChange_(evt) {
			const target = evt.target;
			const opacity = parseFloat(target.value);
			if (!isNaN(opacity)) {
				UserSettings.set(UserSettings.LAYER_OPACITY, opacity);
				UserSettings.set(UserSettings.LAYER_PREVIEW, opacity !== 0);
				this.updateLayerOpacityText_(opacity);
			} else target.value = String(UserSettings.get(UserSettings.LAYER_OPACITY));
		}
		updateLayerOpacityText_(opacity) {
			const layerOpacityText = Dom.getElement(".layer-opacity-text");
			layerOpacityText.innerHTML = Number(opacity).toFixed(2);
		}
	};
	//#endregion
	//#region src/js/controller/settings/preferences/TilePreferencesController.ts
	var TilePreferencesController = class extends AbstractSettingController {
		constructor(piskelController, preferencesController) {
			super();
			this.piskelController = piskelController;
			this.preferencesController = preferencesController;
		}
		init() {
			const tileMode = UserSettings.get(UserSettings.SEAMLESS_MODE);
			const tileModeCheckbox = Dom.getElement(".tile-mode-checkbox");
			if (tileMode) tileModeCheckbox.setAttribute("checked", String(tileMode));
			this.addEventListener(tileModeCheckbox, "change", this.onTileModeChange_);
			const tileMaskOpacityInput = Dom.getElement(".tile-mask-opacity-input");
			tileMaskOpacityInput.value = String(UserSettings.get(UserSettings.SEAMLESS_OPACITY));
			this.addEventListener(tileMaskOpacityInput, "change", this.onTileMaskOpacityChange_);
			this.addEventListener(tileMaskOpacityInput, "input", this.onTileMaskOpacityChange_);
			this.updateTileMaskOpacityText_(tileMaskOpacityInput.value);
		}
		onTileModeChange_(evt) {
			UserSettings.set(UserSettings.SEAMLESS_MODE, evt.currentTarget.checked);
		}
		onTileMaskOpacityChange_(evt) {
			const target = evt.target;
			const opacity = parseFloat(target.value);
			if (!isNaN(opacity)) {
				UserSettings.set(UserSettings.SEAMLESS_OPACITY, opacity);
				this.updateTileMaskOpacityText_(opacity);
			} else target.value = String(UserSettings.get(UserSettings.SEAMLESS_OPACITY));
		}
		updateTileMaskOpacityText_(opacity) {
			const seamlessOpacityText = Dom.getElement(".tile-mask-opacity-text");
			seamlessOpacityText.innerHTML = Number(opacity).toFixed(2);
		}
	};
	//#endregion
	//#region src/js/controller/settings/PreferencesController.ts
	var tabs$1 = {
		misc: {
			template: "templates/settings/preferences/misc.html",
			controller: MiscPreferencesController
		},
		grid: {
			template: "templates/settings/preferences/grid.html",
			controller: GridPreferencesController
		},
		tile: {
			template: "templates/settings/preferences/tile.html",
			controller: TilePreferencesController
		}
	};
	var PreferencesController = class extends AbstractSettingController {
		constructor() {
			super();
			this.tabsWidget = new Tabs(tabs$1, this, UserSettings.PREFERENCES_TAB);
		}
		init() {
			const container = Dom.getElement(".settings-section-preferences");
			this.tabsWidget.init(container);
		}
		destroy() {
			this.tabsWidget.destroy();
			super.destroy();
		}
	};
	//#endregion
	//#region src/js/controller/settings/SaveController.ts
	var PARTIALS = {
		DESKTOP: "save-desktop-partial",
		LOCALSTORAGE: "save-localstorage-partial",
		FILEDOWNLOAD: "save-file-download-partial"
	};
	var SaveController = class extends AbstractSettingController {
		constructor(piskelController) {
			super();
			this.piskelController = piskelController;
		}
		/**
		* @public
		*/
		init() {
			this.saveForm = Dom.getElement(".save-form");
			this.insertSavePartials_();
			this.piskelName = Dom.getElement(".piskel-name");
			this.descriptionInput = Dom.getElement("#save-description");
			this.nameInput = Dom.getElement("#save-name");
			this.updateDescriptorInputs_();
			this.saveLocalStorageButton = document.querySelector("#save-localstorage-button");
			this.saveDesktopButton = document.querySelector("#save-desktop-button");
			this.saveDesktopAsNewButton = document.querySelector("#save-desktop-as-new-button");
			this.saveFileDownloadButton = document.querySelector("#save-file-download-button");
			this.safeAddEventListener_(this.saveLocalStorageButton, "click", this.saveToIndexedDb_);
			this.safeAddEventListener_(this.saveDesktopButton, "click", this.saveToDesktop_);
			this.safeAddEventListener_(this.saveDesktopAsNewButton, "click", this.saveToDesktopAsNew_);
			this.safeAddEventListener_(this.saveFileDownloadButton, "click", this.saveToFileDownload_);
			this.addEventListener(this.saveForm, "submit", this.onSaveFormSubmit_);
			if (assertInitialized(app.storageService, "storageService").isSaving()) this.disableSaveButtons_();
			$.subscribe(Events.BEFORE_SAVING_PISKEL, this.disableSaveButtons_.bind(this));
			$.subscribe(Events.AFTER_SAVING_PISKEL, this.enableSaveButtons_.bind(this));
		}
		insertSavePartials_() {
			this.getPartials_().forEach((partial) => {
				assertInitialized(this.saveForm, "saveForm").insertAdjacentHTML("beforeend", Template.get(partial));
			});
		}
		getPartials_() {
			if (Environment.detectNodeWebkit()) return [PARTIALS.DESKTOP, PARTIALS.LOCALSTORAGE];
			return [PARTIALS.FILEDOWNLOAD, PARTIALS.LOCALSTORAGE];
		}
		updateDescriptorInputs_() {
			const descriptor = this.piskelController.getPiskel().getDescriptor();
			assertInitialized(this.descriptionInput, "descriptionInput").value = descriptor.description;
			assertInitialized(this.nameInput, "nameInput").value = descriptor.name;
		}
		onSaveFormSubmit_(evt) {
			evt.preventDefault();
			evt.stopPropagation();
			this.saveToIndexedDb_();
		}
		saveToFileDownload_() {
			this.saveTo_("saveToFileDownload", false);
		}
		saveToIndexedDb_() {
			this.saveTo_("saveToIndexedDb", false);
		}
		saveToDesktop_() {
			this.saveTo_("saveToDesktop", false);
		}
		saveToDesktopAsNew_() {
			this.saveTo_("saveToDesktop", true);
		}
		saveTo_(methodName, saveAsNew) {
			const piskel = this.piskelController.getPiskel();
			piskel.setDescriptor(this.getDescriptor_());
			const storageService = assertInitialized(app.storageService, "storageService");
			(methodName === "saveToDesktop" ? storageService.saveToDesktop(piskel, !!saveAsNew) : storageService[methodName](piskel)).then(this.onSaveSuccess_);
		}
		getDescriptor_() {
			const name = assertInitialized(this.nameInput, "nameInput").value;
			const description = assertInitialized(this.descriptionInput, "descriptionInput").value;
			return new Descriptor(name, description);
		}
		onSaveSuccess_() {
			$.publish(Events.CLOSE_SETTINGS_DRAWER);
		}
		disableSaveButtons_() {
			this.setDisabled_(this.saveLocalStorageButton, true);
			this.setDisabled_(this.saveDesktopButton, true);
			this.setDisabled_(this.saveDesktopAsNewButton, true);
			this.setDisabled_(this.saveFileDownloadButton, true);
		}
		enableSaveButtons_() {
			this.setDisabled_(this.saveLocalStorageButton, false);
			this.setDisabled_(this.saveDesktopButton, false);
			this.setDisabled_(this.saveDesktopAsNewButton, false);
			this.setDisabled_(this.saveFileDownloadButton, false);
		}
		setDisabled_(element, isDisabled) {
			if (!element) return;
			if (isDisabled) element.setAttribute("disabled", "disabled");
			else element.removeAttribute("disabled");
		}
		safeAddEventListener_(element, type, callback) {
			if (element) this.addEventListener(element, type, callback);
		}
	};
	//#endregion
	//#region src/js/widgets/SynchronizedInputs.ts
	var SynchronizedInputs = class {
		constructor(options) {
			this.leftInput = options.leftInput;
			this.rightInput = options.rightInput;
			this.synchronize = options.synchronize;
			this.syncEnabled = true;
			this.lastInput = this.leftInput;
			EventUtils.addEventListener(options.leftInput, "input", this.onInput_, this);
			EventUtils.addEventListener(options.rightInput, "input", this.onInput_, this);
		}
		destroy() {
			EventUtils.removeAllEventListeners(this);
			this.leftInput = null;
			this.rightInput = null;
			this.lastInput = null;
		}
		enableSync() {
			this.syncEnabled = true;
			this.synchronize(this.lastInput);
		}
		disableSync() {
			this.syncEnabled = false;
		}
		onInput_(evt) {
			const target = evt.target;
			if (this.syncEnabled) this.synchronize(target);
			this.lastInput = target;
		}
	};
	//#endregion
	//#region src/js/widgets/SizeInput.ts
	var SizeInput = class {
		constructor(options) {
			this.widthInput = options.widthInput;
			this.heightInput = options.heightInput;
			this.initWidth = options.initWidth;
			this.initHeight = options.initHeight;
			this.onChange = options.onChange;
			this.synchronizedInputs = new SynchronizedInputs({
				leftInput: this.widthInput,
				rightInput: this.heightInput,
				synchronize: this.synchronize_.bind(this)
			});
			this.disableSync = this.synchronizedInputs.disableSync.bind(this.synchronizedInputs);
			this.enableSync = this.synchronizedInputs.enableSync.bind(this.synchronizedInputs);
			assertInitialized(this.widthInput, "widthInput").value = String(this.initWidth);
			assertInitialized(this.heightInput, "heightInput").value = String(this.initHeight);
		}
		destroy() {
			this.synchronizedInputs.destroy();
			this.widthInput = null;
			this.heightInput = null;
		}
		setWidth(width) {
			assertInitialized(this.widthInput, "widthInput").value = String(width);
			this.synchronize_(this.widthInput);
		}
		setHeight(height) {
			assertInitialized(this.heightInput, "heightInput").value = String(height);
			this.synchronize_(this.heightInput);
		}
		/**
		* Based on the value of the provided sizeInput (considered as emitter)
		* update the value of the other sizeInput to match the current width/height ratio
		* @param  {HTMLElement} origin either widthInput or heightInput
		*/
		synchronize_(input) {
			const sizeInput = assertInitialized(input, "sizeInput");
			let value = parseInt(sizeInput.value, 10);
			if (isNaN(value)) value = 0;
			if (sizeInput === this.widthInput) assertInitialized(this.heightInput, "heightInput").value = String(Math.round(value * this.initHeight / this.initWidth));
			else if (sizeInput === this.heightInput) assertInitialized(this.widthInput, "widthInput").value = String(Math.round(value * this.initWidth / this.initHeight));
			if (this.onChange) this.onChange();
		}
	};
	//#endregion
	//#region src/js/utils/ColorUtils.ts
	var ColorUtils = { getUnusedColor(usedColors) {
		usedColors = usedColors || [];
		const colorMap = {};
		usedColors.forEach(function(color) {
			colorMap[color.toUpperCase()] = true;
		});
		const color = {
			r: 255,
			g: 255,
			b: 0
		};
		let match = null;
		while (true) {
			const hex = window.tinycolor(color).toHexString().toUpperCase();
			if (!colorMap[hex]) {
				match = hex;
				break;
			} else {
				const component = color.r && "r" || color.g && "g" || color.b && "b";
				if (component) color[component] = color[component] - 1;
				else break;
			}
		}
		return match;
	} };
	//#endregion
	//#region src/js/controller/settings/exportimage/GifExportController.ts
	var MAX_GIF_COLORS = 256;
	var MAGIC_PINK = "#FF00FF";
	var WHITE = "#FFFFFF";
	var GifExportController = class extends AbstractSettingController {
		constructor(piskelController, exportController) {
			super();
			this.piskelController = piskelController;
			this.exportController = exportController;
		}
		init() {
			this.uploadStatusContainerEl = document.querySelector(".gif-upload-status");
			this.downloadButton = Dom.getElement(".gif-download-button");
			this.repeatCheckbox = Dom.getElement(".gif-repeat-checkbox");
			this.repeatCheckbox.checked = this.getRepeatSetting_();
			this.addEventListener(this.downloadButton, "click", this.onDownloadButtonClick_);
			this.addEventListener(this.repeatCheckbox, "change", this.onRepeatCheckboxChange_);
			const tooManyColors = assertInitialized(app.currentColorsService, "currentColorsService").getCurrentColors().length >= MAX_GIF_COLORS;
			Dom.getElement(".gif-export-warning").classList.toggle("visible", tooManyColors);
		}
		getZoom_() {
			return this.exportController.getExportZoom();
		}
		onDownloadButtonClick_() {
			const zoom = this.getZoom_();
			const fps = this.piskelController.getFPS();
			this.renderAsImageDataAnimatedGIF(zoom, fps, this.downloadImageData_.bind(this));
		}
		downloadImageData_(imageData) {
			const fileName = this.piskelController.getPiskel().getDescriptor().name + ".gif";
			BlobUtils.dataToBlob(imageData, "image/gif", function(blob) {
				FileUtils.downloadAsFile(blob, fileName);
			});
		}
		updatePreview_(src) {
			assertInitialized(this.previewContainerEl, "previewContainerEl").innerHTML = "<div><img style=\"max-width:32px;\" src=\"" + src + "\"/></div>";
		}
		renderAsImageDataAnimatedGIF(zoom, fps, cb) {
			const currentColors = assertInitialized(app.currentColorsService, "currentColorsService").getCurrentColors();
			const preserveColors = !this.piskelController.getLayers().some(function(l) {
				return l.isTransparent();
			}) && currentColors.length < MAX_GIF_COLORS;
			let transparentColor;
			let transparent;
			if (preserveColors) {
				transparentColor = this.getTransparentColor(currentColors);
				transparent = parseInt(transparentColor.substring(1), 16);
			} else {
				transparentColor = WHITE;
				transparent = null;
			}
			const width = this.piskelController.getWidth();
			const height = this.piskelController.getHeight();
			const gif = new window.GIF({
				workers: 5,
				quality: 1,
				width: width * zoom,
				height: height * zoom,
				preserveColors,
				repeat: this.getRepeatSetting_() ? 0 : -1,
				transparent
			});
			const background = CanvasUtils.createCanvas(width, height);
			const context = Dom.getContext2d(background);
			context.fillStyle = transparentColor;
			for (let i = 0; i < this.piskelController.getFrameCount(); i++) {
				const render = this.piskelController.renderFrameAt(i, true);
				context.clearRect(0, 0, width, height);
				context.fillRect(0, 0, width, height);
				context.drawImage(render, 0, 0, width, height);
				const canvas = ImageResizer.scale(background, zoom);
				gif.addFrame(Dom.getContext2d(canvas), { delay: 1e3 / fps });
			}
			$.publish(Events.SHOW_PROGRESS, [{ name: "Building animated GIF ..." }]);
			gif.on("progress", (percentage) => {
				$.publish(Events.UPDATE_PROGRESS, [{ progress: (percentage * 100).toFixed(1) }]);
			});
			gif.on("finished", (blob) => {
				$.publish(Events.HIDE_PROGRESS);
				FileUtils.readFile(blob, cb);
			});
			gif.render();
		}
		getTransparentColor(currentColors) {
			let transparentColor = ColorUtils.getUnusedColor(currentColors);
			if (!transparentColor) {
				console.error("Unable to find unused color to use as transparent color in the current sprite");
				transparentColor = MAGIC_PINK;
			}
			return transparentColor;
		}
		onRepeatCheckboxChange_() {
			const checked = assertInitialized(this.repeatCheckbox, "repeatCheckbox").checked;
			UserSettings.set(UserSettings.EXPORT_GIF_REPEAT, checked);
		}
		getRepeatSetting_() {
			return UserSettings.get(UserSettings.EXPORT_GIF_REPEAT);
		}
	};
	//#endregion
	//#region src/js/controller/settings/exportimage/MiscExportController.ts
	var MiscExportController = class extends AbstractSettingController {
		constructor(piskelController) {
			super();
			this.piskelController = piskelController;
		}
		init() {
			const cDownloadButton = Dom.getElement(".c-download-button");
			this.addEventListener(cDownloadButton, "click", this.onDownloadCFileClick_);
		}
		onDownloadCFileClick_() {
			const fileName = this.getPiskelName_() + ".c";
			const cName = this.getPiskelName_().replace(" ", "_");
			const width = this.piskelController.getWidth();
			const height = this.piskelController.getHeight();
			const frameCount = this.piskelController.getFrameCount();
			let frameStr = "#include <stdint.h>\n\n";
			frameStr += "#define " + cName.toUpperCase() + "_FRAME_COUNT " + this.piskelController.getFrameCount() + "\n";
			frameStr += "#define " + cName.toUpperCase() + "_FRAME_WIDTH " + width + "\n";
			frameStr += "#define " + cName.toUpperCase() + "_FRAME_HEIGHT " + height + "\n\n";
			frameStr += "/* Piskel data for \"" + this.getPiskelName_() + "\" */\n\n";
			frameStr += "static const uint32_t " + cName.toLowerCase();
			frameStr += "_data[" + frameCount + "][" + width * height + "] = {\n";
			for (let i = 0; i < frameCount; i++) {
				const render = this.piskelController.renderFrameAt(i, true);
				const pix = Dom.getContext2d(render).getImageData(0, 0, width, height).data;
				frameStr += "{\n";
				for (let j = 0; j < pix.length; j += 4) {
					frameStr += this.rgbToCHex(pix[j], pix[j + 1], pix[j + 2], pix[j + 3]);
					if (j != pix.length - 4) frameStr += ", ";
					if ((j + 4) % (width * 4) === 0) frameStr += "\n";
				}
				if (i != frameCount - 1) frameStr += "},\n";
				else frameStr += "}\n";
			}
			frameStr += "};\n";
			BlobUtils.stringToBlob(frameStr, (blob) => {
				FileUtils.downloadAsFile(blob, fileName);
			}, "application/text");
		}
		getPiskelName_() {
			return this.piskelController.getPiskel().getDescriptor().name;
		}
		rgbToCHex(r, g, b, a) {
			let hexStr = "0x";
			hexStr += ("00" + a.toString(16)).substr(-2);
			hexStr += ("00" + b.toString(16)).substr(-2);
			hexStr += ("00" + g.toString(16)).substr(-2);
			hexStr += ("00" + r.toString(16)).substr(-2);
			return hexStr;
		}
	};
	//#endregion
	//#region src/js/rendering/PiskelRenderer.ts
	var PiskelRenderer = class {
		constructor(piskelController) {
			const frames = [];
			for (let i = 0; i < piskelController.getFrameCount(); i++) frames.push(piskelController.renderFrameAt(i, true));
			this.piskelController = piskelController;
			this.frames = frames;
		}
		renderAsCanvas(columns) {
			columns = columns || this.frames.length;
			const rows = Math.ceil(this.frames.length / columns);
			const canvas = this.createCanvas_(columns, rows);
			for (let i = 0; i < this.frames.length; i++) {
				const frame = this.frames[i];
				const posX = i % columns * this.piskelController.getWidth();
				const posY = Math.floor(i / columns) * this.piskelController.getHeight();
				this.drawFrameInCanvas_(frame, canvas, posX, posY);
			}
			return canvas;
		}
		drawFrameInCanvas_(frame, canvas, offsetWidth, offsetHeight) {
			Dom.getContext2d(canvas).drawImage(frame, offsetWidth, offsetHeight, frame.width, frame.height);
		}
		createCanvas_(columns, rows) {
			const width = columns * this.piskelController.getWidth();
			const height = rows * this.piskelController.getHeight();
			return CanvasUtils.createCanvas(width, height);
		}
	};
	//#endregion
	//#region src/js/controller/settings/exportimage/PngExportController.ts
	var dimensionInfoPattern = "{{width}} x {{height}} px, {{frames}}<br/>{{columns}}, {{rows}}.";
	var replace = Template.replace;
	var pluralize = function(word, count) {
		if (count === 1) return "1 " + word;
		return count + " " + word + "s";
	};
	var PngExportController = class extends AbstractSettingController {
		constructor(piskelController, exportController) {
			super();
			this.piskelController = piskelController;
			this.exportController = exportController;
			this.onScaleChanged_ = this.onScaleChanged_.bind(this);
		}
		init() {
			this.layoutContainer = Dom.getElement(".png-export-layout-section");
			this.dimensionInfo = Dom.getElement(".png-export-dimension-info");
			this.rowsInput = Dom.getElement("#png-export-rows");
			this.columnsInput = Dom.getElement("#png-export-columns");
			const downloadButton = Dom.getElement(".png-download-button");
			const downloadPixiButton = Dom.getElement(".png-pixi-download-button");
			const dataUriButton = Dom.getElement(".datauri-open-button");
			const selectedFrameDownloadButton = Dom.getElement(".selected-frame-download-button");
			this.pixiInlineImageCheckbox = document.querySelector(".png-pixi-inline-image-checkbox");
			this.initLayoutSection_();
			this.updateDimensionLabel_();
			this.addEventListener(this.columnsInput, "input", this.onColumnsInput_);
			this.addEventListener(downloadButton, "click", this.onDownloadClick_);
			this.addEventListener(downloadPixiButton, "click", this.onPixiDownloadClick_);
			this.addEventListener(dataUriButton, "click", this.onDataUriClick_);
			this.addEventListener(selectedFrameDownloadButton, "click", this.onDownloadSelectedFrameClick_);
			$.subscribe(Events.EXPORT_SCALE_CHANGED, this.onScaleChanged_);
		}
		destroy() {
			$.unsubscribe(Events.EXPORT_SCALE_CHANGED, this.onScaleChanged_);
			super.destroy();
		}
		/**
		* Initalize all controls related to the spritesheet layout.
		*/
		initLayoutSection_() {
			const frames = this.piskelController.getFrameCount();
			if (frames === 1) assertInitialized(this.layoutContainer, "layoutContainer").style.display = "none";
			else {
				assertInitialized(this.columnsInput, "columnsInput").setAttribute("max", String(frames));
				assertInitialized(this.columnsInput, "columnsInput").value = String(this.getBestFit_());
				this.onColumnsInput_();
			}
		}
		updateDimensionLabel_() {
			const zoom = this.exportController.getExportZoom();
			const frames = this.piskelController.getFrameCount();
			let width = this.piskelController.getWidth() * zoom;
			let height = this.piskelController.getHeight() * zoom;
			const columns = this.getColumns_();
			const rows = this.getRows_();
			width = columns * width;
			height = rows * height;
			assertInitialized(this.dimensionInfo, "dimensionInfo").innerHTML = replace(dimensionInfoPattern, {
				width,
				height,
				rows: pluralize("row", rows),
				columns: pluralize("column", columns),
				frames: pluralize("frame", frames)
			});
		}
		getColumns_() {
			return parseInt(assertInitialized(this.columnsInput, "columnsInput").value || "1", 10);
		}
		getRows_() {
			return parseInt(assertInitialized(this.rowsInput, "rowsInput").value || "1", 10);
		}
		getBestFit_() {
			const ratio = this.piskelController.getWidth() / this.piskelController.getHeight();
			const frameCount = this.piskelController.getFrameCount();
			const bestFit = Math.round(Math.sqrt(frameCount / ratio));
			return MathUtils.minmax(bestFit, 1, frameCount);
		}
		onScaleChanged_() {
			this.updateDimensionLabel_();
		}
		/**
		* Synchronise column and row inputs, called everytime a user input updates one of the
		* two inputs by the SynchronizedInputs widget.
		*/
		onColumnsInput_() {
			const value = assertInitialized(this.columnsInput, "columnsInput").value;
			if (value === "") return;
			let columns = parseInt(value, 10);
			if (isNaN(columns)) columns = 1;
			columns = MathUtils.minmax(columns, 1, this.piskelController.getFrameCount());
			assertInitialized(this.columnsInput, "columnsInput").value = String(columns);
			assertInitialized(this.rowsInput, "rowsInput").value = String(Math.ceil(this.piskelController.getFrameCount() / columns));
			this.updateDimensionLabel_();
		}
		createPngSpritesheet_() {
			let outputCanvas = new PiskelRenderer(this.piskelController).renderAsCanvas(this.getColumns_());
			const width = outputCanvas.width;
			const height = outputCanvas.height;
			const zoom = this.exportController.getExportZoom();
			if (zoom != 1) outputCanvas = ImageResizer.resize(outputCanvas, width * zoom, height * zoom, false);
			return outputCanvas;
		}
		onDownloadClick_() {
			const canvas = this.createPngSpritesheet_();
			this.downloadCanvas_(canvas);
		}
		downloadCanvas_(canvas, name) {
			name = name || this.piskelController.getPiskel().getDescriptor().name;
			const fileName = name + ".png";
			BlobUtils.canvasToBlob(canvas, function(blob) {
				FileUtils.downloadAsFile(blob, fileName);
			});
		}
		onPixiDownloadClick_() {
			const zip = new window.JSZip();
			const canvas = this.createPngSpritesheet_();
			const name = this.piskelController.getPiskel().getDescriptor().name;
			let image;
			if (assertInitialized(this.pixiInlineImageCheckbox, "pixiInlineImageCheckbox").checked) image = canvas.toDataURL("image/png");
			else {
				image = name + ".png";
				zip.file(image, CanvasUtils.getBase64FromCanvas(canvas) + "\n", { base64: true });
			}
			const width = canvas.width / this.getColumns_();
			const height = canvas.height / this.getRows_();
			const numFrames = this.piskelController.getFrameCount();
			const frames = {};
			for (let i = 0; i < numFrames; i++) {
				const column = i % this.getColumns_();
				const row = (i - column) / this.getColumns_();
				const frame = {
					frame: {
						x: width * column,
						y: height * row,
						w: width,
						h: height
					},
					rotated: false,
					trimmed: false,
					spriteSourceSize: {
						x: 0,
						y: 0,
						w: width,
						h: height
					},
					sourceSize: {
						w: width,
						h: height
					}
				};
				frames[name + i + ".png"] = frame;
			}
			const json = {
				frames,
				meta: {
					app: "https://github.com/piskelapp/piskel/",
					version: "1.0",
					image,
					format: "RGBA8888",
					size: {
						w: canvas.width,
						h: canvas.height
					}
				}
			};
			zip.file(name + ".json", JSON.stringify(json));
			const blob = zip.generate({ type: "blob" });
			FileUtils.downloadAsFile(blob, name + ".zip");
		}
		onDataUriClick_() {
			const popup = window.open("about:blank");
			const dataUri = this.createPngSpritesheet_().toDataURL("image/png");
			window.setTimeout(() => {
				const html = Template.getAndReplace("data-uri-export-partial", { src: dataUri });
				const target = assertInitialized(popup, "popup");
				target.document.title = dataUri;
				target.document.body.innerHTML = html;
			}, 500);
		}
		onDownloadSelectedFrameClick_() {
			const frameIndex = this.piskelController.getCurrentFrameIndex();
			const name = this.piskelController.getPiskel().getDescriptor().name;
			let canvas = this.piskelController.renderFrameAt(frameIndex, true);
			const zoom = this.exportController.getExportZoom();
			if (zoom != 1) canvas = ImageResizer.resize(canvas, canvas.width * zoom, canvas.height * zoom, false);
			const fileName = name + "-" + (frameIndex + 1) + ".png";
			this.downloadCanvas_(canvas, fileName);
		}
	};
	//#endregion
	//#region src/js/controller/settings/exportimage/ZipExportController.ts
	var ZipExportController = class extends AbstractSettingController {
		constructor(piskelController, exportController) {
			super();
			this.piskelController = piskelController;
			this.exportController = exportController;
		}
		init() {
			this.pngFilePrefixInput = Dom.getElement(".zip-prefix-name");
			this.pngFilePrefixInput.value = "sprite_";
			this.splitByLayersCheckbox = document.querySelector(".zip-split-layers-checkbox");
			this.addEventListener(assertInitialized(this.splitByLayersCheckbox, "splitByLayersCheckbox"), "change", this.onSplitLayersClick_);
			this.useLayerNamesContainer = Dom.getElement(".use-layer-names-container");
			this.useLayerNamesCheckbox = document.querySelector(".zip-use-layer-names-checkbox");
			this.toggleHideUseLayerNamesCheckbox();
			const zipButton = Dom.getElement(".zip-generate-button");
			this.addEventListener(zipButton, "click", this.onZipButtonClick_);
		}
		toggleHideUseLayerNamesCheckbox() {
			assertInitialized(this.useLayerNamesContainer, "useLayerNamesContainer").style.display = assertInitialized(this.splitByLayersCheckbox, "splitByLayersCheckbox").checked ? "block" : "none";
		}
		onSplitLayersClick_() {
			this.toggleHideUseLayerNamesCheckbox();
		}
		onZipButtonClick_() {
			const zip = new window.JSZip();
			if (assertInitialized(this.splitByLayersCheckbox, "splitByLayersCheckbox").checked) this.splittedExport_(zip);
			else this.mergedExport_(zip);
			const fileName = this.getPiskelName_() + ".zip";
			const blob = zip.generate({ type: "blob" });
			FileUtils.downloadAsFile(blob, fileName);
		}
		mergedExport_(zip) {
			const paddingLength = ("" + this.piskelController.getFrameCount()).length;
			const zoom = this.exportController.getExportZoom();
			for (let i = 0; i < this.piskelController.getFrameCount(); i++) {
				const render = this.piskelController.renderFrameAt(i, true);
				const canvas = ImageResizer.scale(render, zoom);
				const filename = assertInitialized(this.pngFilePrefixInput, "pngFilePrefixInput").value + StringUtils.leftPad(i, paddingLength, "0") + ".png";
				zip.file(filename, CanvasUtils.getBase64FromCanvas(canvas) + "\n", { base64: true });
			}
		}
		splittedExport_(zip) {
			const layers = this.piskelController.getLayers();
			const framePaddingLength = ("" + this.piskelController.getFrameCount()).length;
			const layerPaddingLength = ("" + layers.length).length;
			const zoom = this.exportController.getExportZoom();
			for (let j = 0; this.piskelController.hasLayerAt(j); j++) {
				const layer = this.piskelController.getLayerAt(j);
				const layerid = StringUtils.leftPad(j, layerPaddingLength, "0");
				for (let i = 0; i < this.piskelController.getFrameCount(); i++) {
					const render = LayerUtils.renderFrameAt(layer, i, true);
					const canvas = ImageResizer.scale(render, zoom);
					const basename = assertInitialized(this.pngFilePrefixInput, "pngFilePrefixInput").value;
					const frameid = StringUtils.leftPad(i + 1, framePaddingLength, "0");
					let filename = "l" + layerid + "_" + basename + frameid + ".png";
					if (assertInitialized(this.useLayerNamesCheckbox, "useLayerNamesCheckbox").checked) filename = layer.getName() + "_" + basename + frameid + ".png";
					zip.file(filename, CanvasUtils.getBase64FromCanvas(canvas) + "\n", { base64: true });
				}
			}
		}
		getPiskelName_() {
			return this.piskelController.getPiskel().getDescriptor().name;
		}
	};
	//#endregion
	//#region src/js/controller/settings/exportimage/ExportController.ts
	var tabs = {
		png: {
			template: "templates/settings/export/png.html",
			controller: PngExportController
		},
		gif: {
			template: "templates/settings/export/gif.html",
			controller: GifExportController
		},
		zip: {
			template: "templates/settings/export/zip.html",
			controller: ZipExportController
		},
		misc: {
			template: "templates/settings/export/misc.html",
			controller: MiscExportController
		}
	};
	var ExportController = class extends AbstractSettingController {
		constructor(piskelController) {
			super();
			this.piskelController = piskelController;
			this.tabsWidget = new Tabs(tabs, this, UserSettings.EXPORT_TAB);
			this.onSizeInputChange_ = this.onSizeInputChange_.bind(this);
		}
		init() {
			this.scaleInput = Dom.getElement(".export-scale .scale-input");
			this.addEventListener(this.scaleInput, "change", this.onScaleChange_);
			this.addEventListener(this.scaleInput, "input", this.onScaleChange_);
			this.widthInput = Dom.getElement(".export-resize .resize-width");
			this.heightInput = Dom.getElement(".export-resize .resize-height");
			const scale = UserSettings.get(UserSettings.EXPORT_SCALE);
			this.sizeInputWidget = new SizeInput({
				widthInput: this.widthInput,
				heightInput: this.heightInput,
				initWidth: this.piskelController.getWidth() * scale,
				initHeight: this.piskelController.getHeight() * scale,
				onChange: this.onSizeInputChange_
			});
			this.onSizeInputChange_();
			const container = Dom.getElement(".settings-section-export");
			this.tabsWidget.init(container);
		}
		destroy() {
			assertInitialized(this.sizeInputWidget, "sizeInputWidget").destroy();
			this.tabsWidget.destroy();
			super.destroy();
		}
		onScaleChange_() {
			const value = parseFloat(assertInitialized(this.scaleInput, "scaleInput").value);
			if (!isNaN(value)) {
				if (Math.round(this.getExportZoom()) != value) assertInitialized(this.sizeInputWidget, "sizeInputWidget").setWidth(this.piskelController.getWidth() * value);
				UserSettings.set(UserSettings.EXPORT_SCALE, value);
			}
		}
		updateScaleText_(scale) {
			const scaleValue = scale.toFixed(1);
			const scaleText = Dom.getElement(".export-scale .scale-text");
			scaleText.innerHTML = scaleValue + "x";
		}
		onSizeInputChange_() {
			const zoom = this.getExportZoom();
			if (isNaN(zoom)) return;
			this.updateScaleText_(zoom);
			$.publish(Events.EXPORT_SCALE_CHANGED);
			assertInitialized(this.scaleInput, "scaleInput").value = String(Math.round(zoom));
			if (zoom >= 1 && zoom <= 32) this.onScaleChange_();
		}
		getExportZoom() {
			return parseInt(assertInitialized(this.widthInput, "widthInput").value, 10) / this.piskelController.getWidth();
		}
	};
	//#endregion
	//#region src/js/controller/settings/resize/DefaultSizeController.ts
	var DefaultSizeController = class DefaultSizeController extends AbstractSettingController {
		constructor(piskelController) {
			super();
			this.piskelController = piskelController;
		}
		/**
		* Returns the default size from the user settings. The stored value is sanitized
		* since it may have been saved by an older version without any size limit.
		*/
		static getDefaultSize() {
			const defaultSize = UserSettings.get(UserSettings.DEFAULT_SIZE);
			return ResizeUtils.sanitizeSize(defaultSize.width, defaultSize.height, {
				width: Constants.DEFAULT.WIDTH,
				height: Constants.DEFAULT.HEIGHT
			});
		}
		init() {
			this.container = Dom.getElement(".settings-default-size");
			const defaultSize = DefaultSizeController.getDefaultSize();
			this.widthInput = Dom.getElement("[name=\"default-width\"]", this.container);
			this.heightInput = Dom.getElement("[name=\"default-height\"]", this.container);
			this.widthInput.value = String(defaultSize.width);
			this.heightInput.value = String(defaultSize.height);
			this.defaultSizeForm = Dom.getElement("form", this.container);
			this.addEventListener(this.defaultSizeForm, "submit", this.onFormSubmit_);
		}
		onFormSubmit_(evt) {
			evt.preventDefault();
			const size = ResizeUtils.sanitizeSize(assertInitialized(this.widthInput, "widthInput").value, assertInitialized(this.heightInput, "heightInput").value, DefaultSizeController.getDefaultSize());
			UserSettings.set(UserSettings.DEFAULT_SIZE, size);
			$.publish(Events.CLOSE_SETTINGS_DRAWER);
		}
	};
	//#endregion
	//#region src/js/controller/settings/resize/ResizeController.ts
	var ResizeController = class extends AbstractSettingController {
		constructor(piskelController) {
			super();
			this.piskelController = piskelController;
			this.container = Dom.getElement(".resize-canvas");
			this.anchorWidget = new AnchorWidget(Dom.getElement(".resize-anchor-container", this.container));
			this.defaultSizeController = new DefaultSizeController(piskelController);
		}
		init() {
			this.widthInput = Dom.getElement("[name=\"resize-width\"]", this.container);
			this.heightInput = Dom.getElement("[name=\"resize-height\"]", this.container);
			this.resizeForm = Dom.getElement("form", this.container);
			this.resizeContentCheckbox = Dom.getElement(".resize-content-checkbox", this.container);
			this.maintainRatioCheckbox = Dom.getElement(".resize-ratio-checkbox", this.container);
			this.sizeInputWidget = new SizeInput({
				widthInput: this.widthInput,
				heightInput: this.heightInput,
				initWidth: this.piskelController.getWidth(),
				initHeight: this.piskelController.getHeight()
			});
			const settings = UserSettings.get("RESIZE_SETTINGS");
			const origin = settings.origin in AnchorWidget.ORIGIN ? settings.origin : "TOPLEFT";
			this.anchorWidget.setOrigin(origin);
			if (settings.resizeContent) {
				this.resizeContentCheckbox.checked = true;
				this.anchorWidget.disable();
			}
			if (settings.maintainRatio) this.maintainRatioCheckbox.checked = true;
			else this.sizeInputWidget.disableSync();
			this.addEventListener(this.resizeForm, "submit", this.onResizeFormSubmit_);
			this.addEventListener(this.resizeContentCheckbox, "change", this.onResizeContentChange_);
			this.addEventListener(this.maintainRatioCheckbox, "change", this.onMaintainRatioChange_);
			this.defaultSizeController.init();
		}
		destroy() {
			this.updateUserPreferences_();
			this.anchorWidget.destroy();
			assertInitialized(this.sizeInputWidget, "sizeInputWidget").destroy();
			super.destroy();
		}
		onResizeFormSubmit_(evt) {
			evt.preventDefault();
			const currentPiskel = this.piskelController.getPiskel();
			const piskel = ResizeUtils.resizePiskel(currentPiskel, {
				width: parseInt(assertInitialized(this.widthInput, "widthInput").value, 10),
				height: parseInt(assertInitialized(this.heightInput, "heightInput").value, 10),
				origin: assertInitialized(this.anchorWidget.getOrigin(), "origin"),
				resizeContent: assertInitialized(this.resizeContentCheckbox, "resizeContentCheckbox").checked
			});
			assertInitialized(app.piskelController, "piskelController").setPiskel(piskel, { preserveState: true });
			$.publish(Events.CLOSE_SETTINGS_DRAWER);
		}
		onResizeContentChange_(evt) {
			if (evt.target.checked) this.anchorWidget.disable();
			else this.anchorWidget.enable();
		}
		onMaintainRatioChange_(evt) {
			if (evt.target.checked) assertInitialized(this.sizeInputWidget, "sizeInputWidget").enableSync();
			else assertInitialized(this.sizeInputWidget, "sizeInputWidget").disableSync();
		}
		updateUserPreferences_() {
			UserSettings.set("RESIZE_SETTINGS", {
				origin: assertInitialized(this.anchorWidget.getOrigin(), "origin"),
				resizeContent: !!assertInitialized(this.resizeContentCheckbox, "resizeContentCheckbox").checked,
				maintainRatio: !!assertInitialized(this.maintainRatioCheckbox, "maintainRatioCheckbox").checked
			});
		}
	};
	//#endregion
	//#region src/js/controller/settings/SettingsController.ts
	var settings = {
		user: {
			template: "templates/settings/preferences.html",
			controller: PreferencesController
		},
		resize: {
			template: "templates/settings/resize.html",
			controller: ResizeController
		},
		export: {
			template: "templates/settings/export.html",
			controller: ExportController
		},
		import: {
			template: "templates/settings/import.html",
			controller: ImportController
		},
		localstorage: {
			template: "templates/settings/localstorage.html",
			controller: void 0
		},
		save: {
			template: "templates/settings/save.html",
			controller: SaveController
		}
	};
	var SEL_SETTING_CLS = "has-expanded-drawer";
	var EXP_DRAWER_CLS = "expanded";
	var SettingsController = class {
		constructor(piskelController) {
			this.piskelController = piskelController;
			this.closeDrawerShortcut = Shortcuts.MISC.CLOSE_POPUP;
			this.settingsContainer = Dom.getElement("[data-pskl-controller=settings]");
			this.drawerContainer = Dom.getElement("#drawer-container");
			this.isExpanded = false;
			this.currentSetting = null;
		}
		/**
		* @public
		*/
		init() {
			EventUtils.addEventListener(this.settingsContainer, "click", this.onSettingsContainerClick_, this);
			EventUtils.addEventListener(document.body, "click", this.onBodyClick_, this);
			$.subscribe(Events.CLOSE_SETTINGS_DRAWER, this.closeDrawer_.bind(this));
		}
		onSettingsContainerClick_(evt) {
			const setting = Dom.getData(evt.target, "setting");
			if (!setting) return;
			if (this.currentSetting != setting) this.loadSetting_(setting);
			else this.closeDrawer_();
			evt.stopPropagation();
			evt.preventDefault();
		}
		onBodyClick_(evt) {
			const target = evt.target;
			const isInDrawerContainer = Dom.isParent(target, this.drawerContainer);
			const isInSettingsIcon = target.dataset.setting;
			const isInSettingsContainer = isInDrawerContainer || isInSettingsIcon;
			if (this.isExpanded && !isInSettingsContainer) this.closeDrawer_();
		}
		loadSetting_(setting) {
			this.drawerContainer.innerHTML = Template.get(settings[setting].template);
			this.destroyCurrentController_();
			this.currentSetting = setting;
			const controller = new (assertInitialized(settings[setting].controller, "controller"))(this.piskelController);
			this.currentController = controller;
			controller.init();
			assertInitialized(app.shortcutService, "shortcutService").registerShortcut(this.closeDrawerShortcut, this.closeDrawer_.bind(this));
			Dom.removeClass(SEL_SETTING_CLS);
			const selectedSettingButton = document.querySelector("[data-setting=" + setting + "]");
			if (selectedSettingButton) selectedSettingButton.classList.add(SEL_SETTING_CLS);
			this.settingsContainer.classList.add(EXP_DRAWER_CLS);
			this.isExpanded = true;
		}
		closeDrawer_() {
			Dom.removeClass(SEL_SETTING_CLS);
			this.settingsContainer.classList.remove(EXP_DRAWER_CLS);
			this.isExpanded = false;
			this.currentSetting = null;
			assertInitialized(document.activeElement, "activeElement").blur();
			this.destroyCurrentController_();
		}
		destroyCurrentController_() {
			if (this.currentController) {
				assertInitialized(app.shortcutService, "shortcutService").unregisterShortcut(this.closeDrawerShortcut);
				if (this.currentController.destroy) {
					this.currentController.destroy();
					this.currentController = null;
				}
			}
		}
	};
	//#endregion
	//#region src/js/rendering/DrawingLoop.ts
	var DrawingLoop = class {
		constructor() {
			this.requestAnimationFrame = this.getRequestAnimationFrameShim_();
			this.isRunning = false;
			this.previousTime = 0;
			this.callbacks = [];
			this.loop_ = this.loop_.bind(this);
		}
		addCallback(callback, scope, args) {
			const callbackObj = {
				fn: callback,
				scope,
				args
			};
			this.callbacks.push(callbackObj);
			return callbackObj;
		}
		removeCallback(callbackObj) {
			const index = this.callbacks.indexOf(callbackObj);
			if (index != -1) this.callbacks.splice(index, 1);
		}
		start() {
			this.isRunning = true;
			this.loop_();
		}
		loop_() {
			const currentTime = Date.now();
			const delta = Math.max(0, currentTime - this.previousTime);
			this.executeCallbacks_(delta);
			this.previousTime = currentTime;
			this.requestAnimationFrame.call(window, this.loop_);
		}
		executeCallbacks_(deltaTime) {
			for (let i = 0; i < this.callbacks.length; i++) {
				const cb = this.callbacks[i];
				cb.fn.call(cb.scope, deltaTime, cb.args);
			}
		}
		stop() {
			this.isRunning = false;
		}
		getRequestAnimationFrameShim_() {
			const prefixed = window;
			return prefixed.requestAnimationFrame || prefixed.mozRequestAnimationFrame || prefixed.webkitRequestAnimationFrame || prefixed.msRequestAnimationFrame || function(callback) {
				return window.setTimeout(callback, 1e3 / 60);
			};
		}
	};
	//#endregion
	//#region src/js/selection/SelectionManager.ts
	var SELECTION_REPLAY = {
		PASTE: "REPLAY_PASTE",
		ERASE: "REPLAY_ERASE"
	};
	var SelectionManager = class {
		constructor(piskelController) {
			this.piskelController = piskelController;
			this.currentSelection = null;
		}
		init() {
			$.subscribe(Events.SELECTION_CREATED, this.onSelectionCreated_.bind(this));
			$.subscribe(Events.SELECTION_DISMISSED, this.onSelectionDismissed_.bind(this));
			$.subscribe(Events.SELECTION_MOVE_REQUEST, this.onSelectionMoved_.bind(this));
			$.subscribe(Events.CLIPBOARD_COPY, this.copy.bind(this));
			$.subscribe(Events.CLIPBOARD_CUT, this.copy.bind(this));
			$.subscribe(Events.CLIPBOARD_PASTE, this.paste.bind(this));
			const shortcuts = Shortcuts;
			assertInitialized(app.shortcutService, "shortcutService").registerShortcut(shortcuts.SELECTION.DELETE, this.onDeleteShortcut_.bind(this));
			assertInitialized(app.shortcutService, "shortcutService").registerShortcut(shortcuts.SELECTION.COMMIT, this.commit.bind(this));
			$.subscribe(Events.TOOL_SELECTED, this.onToolSelected_.bind(this));
		}
		/**
		* @private
		*/
		cleanSelection_() {
			if (this.currentSelection) {
				this.currentSelection.reset();
				this.currentSelection = null;
			}
		}
		/**
		* @private
		*/
		onToolSelected_(_evt, tool) {
			if (!(tool instanceof BaseSelect)) this.cleanSelection_();
		}
		/**
		* @private
		*/
		onSelectionDismissed_() {
			this.cleanSelection_();
		}
		onDeleteShortcut_() {
			if (this.currentSelection) this.erase();
			else return true;
		}
		erase() {
			const pixels = assertInitialized(this.currentSelection, "currentSelection").pixels;
			const currentFrame = this.piskelController.getCurrentFrame();
			for (let i = 0, l = pixels.length; i < l; i++) currentFrame.setPixel(pixels[i].col, pixels[i].row, Constants.TRANSPARENT_COLOR);
			$.publish(Events.PISKEL_SAVE_STATE, {
				type: HistoryService.REPLAY,
				scope: this,
				replay: {
					type: SELECTION_REPLAY.ERASE,
					pixels: JSON.parse(JSON.stringify(pixels))
				}
			});
		}
		copy(event, domEvent) {
			if (this.currentSelection && this.piskelController.getCurrentFrame()) {
				this.currentSelection.fillSelectionFromFrame(this.piskelController.getCurrentFrame());
				if (domEvent) {
					assertInitialized(domEvent.clipboardData, "clipboardData").setData("text/plain", this.currentSelection.stringify());
					domEvent.preventDefault();
				}
				if (event.type === Events.CLIPBOARD_CUT) this.erase();
			}
		}
		paste(event, domEvent) {
			const items = domEvent ? assertInitialized(domEvent.clipboardData, "clipboardData").items : [];
			try {
				for (let i = 0; i < items.length; i++) {
					const item = items[i];
					if (/^image/i.test(item.type)) {
						this.pasteImage_(item);
						event.stopPropagation();
						return;
					}
					if (/^text\/plain/i.test(item.type)) {
						this.pasteText_(item);
						event.stopPropagation();
						return;
					}
				}
			} catch {}
			if (this.currentSelection && this.currentSelection.hasPastedContent) this.pastePixelsOnCurrentFrame_(this.currentSelection.pixels);
		}
		pasteImage_(clipboardItem) {
			const blob = clipboardItem.getAsFile();
			if (blob === null) throw new Error("The pasted clipboard item is not a file");
			FileUtils.readImageFile(blob, (image) => {
				assertInitialized(app.fileDropperService, "fileDropperService").dropPosition_ = {
					x: 0,
					y: 0
				};
				assertInitialized(app.fileDropperService, "fileDropperService").onImageLoaded_(image, blob);
			});
		}
		pasteText_(clipboardItem) {
			clipboardItem.getAsString((selectionString) => {
				let selectionData;
				try {
					selectionData = JSON.parse(selectionString);
				} catch {
					return;
				}
				if (!selectionData) return;
				const time = selectionData.time;
				let pixels = selectionData.pixels;
				const selectionTime = this.currentSelection && this.currentSelection.time;
				if (selectionTime !== void 0 && selectionTime !== null && selectionTime >= time) pixels = assertInitialized(this.currentSelection, "currentSelection").pixels;
				if (pixels) this.pastePixelsOnCurrentFrame_(pixels);
			});
		}
		pastePixelsOnCurrentFrame_(pixels) {
			const frame = this.piskelController.getCurrentFrame();
			this.pastePixels_(frame, pixels);
			$.publish(Events.PISKEL_SAVE_STATE, {
				type: HistoryService.REPLAY,
				scope: this,
				replay: {
					type: SELECTION_REPLAY.PASTE,
					pixels: JSON.parse(JSON.stringify(pixels.slice(0)))
				}
			});
		}
		/**
		* If the currently selected tool is a selection tool, call commitSelection handler on
		* the current tool instance.
		*/
		commit() {
			const tool = assertInitialized(app.drawingController, "drawingController").currentToolBehavior;
			if (tool instanceof BaseSelect) tool.commitSelection();
		}
		replay(frame, replayData) {
			if (replayData.type === SELECTION_REPLAY.PASTE) this.pastePixels_(frame, replayData.pixels);
			else if (replayData.type === SELECTION_REPLAY.ERASE) replayData.pixels.forEach(function(pixel) {
				frame.setPixel(pixel.col, pixel.row, Constants.TRANSPARENT_COLOR);
			});
		}
		pastePixels_(frame, pixels) {
			pixels.forEach(function(pixel) {
				if (pixel.color === Constants.TRANSPARENT_COLOR || pixel.color === null || pixel.color === void 0) return;
				frame.setPixel(pixel.col, pixel.row, pixel.color);
			});
		}
		/**
		* @private
		*/
		onSelectionCreated_(_evt, selection) {
			if (selection) this.currentSelection = selection;
			else console.error("No selection provided to SelectionManager");
		}
		/**
		* @private
		*/
		onSelectionMoved_(_evt, colDiff, rowDiff) {
			if (this.currentSelection) this.currentSelection.move(colDiff, rowDiff);
			else console.error("Bad state: No currentSelection set when trying to move it in SelectionManager");
		}
	};
	//#endregion
	//#region src/js/database/BackupDatabase.ts
	var _BackupDatabase;
	var DB_NAME$1 = "PiskelSessionsDatabase";
	var DB_VERSION$1 = 1;
	var _requestPromise$1 = function(req) {
		return new Promise(function(resolve, reject) {
			req.onsuccess = resolve;
			req.onerror = reject;
		});
	};
	var BackupDatabase = class {
		constructor() {
			this.db = null;
		}
		/**
		* Open and initialize the database.
		* Returns a promise that resolves when the database is opened.
		*/
		init() {
			const request = window.indexedDB.open(DB_NAME$1, DB_VERSION$1);
			request.onupgradeneeded = this.onUpgradeNeeded_.bind(this);
			return _requestPromise$1(request).then((event) => {
				this.db = event.target.result;
				return this.db;
			}).catch(function() {
				console.log("Could not initialize the piskel backup database");
			});
		}
		onUpgradeNeeded_(event) {
			const db = event.target.result;
			this.db = db;
			const objectStore = db.createObjectStore("snapshots", {
				keyPath: "id",
				autoIncrement: true
			});
			objectStore.createIndex("session_id", "session_id", { unique: false });
			objectStore.createIndex("date", "date", { unique: false });
			objectStore.createIndex("session_id, date", ["session_id", "date"], { unique: false });
			objectStore.transaction.oncomplete = () => {};
		}
		openObjectStore_() {
			return assertInitialized(this.db, "db").transaction(["snapshots"], "readwrite").objectStore("snapshots");
		}
		/**
		* Send an add request for the provided snapshot.
		* Returns a promise that resolves the request event.
		*/
		createSnapshot(snapshot) {
			return _requestPromise$1(this.openObjectStore_().add(snapshot));
		}
		/**
		* Send a put request for the provided snapshot.
		* Returns a promise that resolves the request event.
		*/
		updateSnapshot(snapshot) {
			return _requestPromise$1(this.openObjectStore_().put(snapshot));
		}
		/**
		* Send a delete request for the provided snapshot.
		* Returns a promise that resolves the request event.
		*/
		deleteSnapshot(snapshot) {
			return _requestPromise$1(this.openObjectStore_().delete(assertInitialized(snapshot.id, "id")));
		}
		/**
		* Send a get request for the provided snapshotId.
		* Returns a promise that resolves the request event.
		*/
		getSnapshot(snapshotId) {
			return _requestPromise$1(this.openObjectStore_().get(snapshotId)).then(function(event) {
				return event.target.result;
			});
		}
		/**
		* Get the last (most recent) snapshot that satisfies the accept filter provided.
		* Returns a promise that will resolve with the first matching snapshot (or null
		* if no valid snapshot is found).
		*
		* @param {Function} accept:
		*        Filter method that takes a snapshot as argument and should return true
		*        if the snapshot is valid.
		*/
		findLastSnapshot(accept) {
			const index = assertInitialized(this.db, "db").transaction(["snapshots"]).objectStore("snapshots").index("date");
			const range = IDBKeyRange.upperBound(Infinity);
			return new Promise(function(resolve) {
				index.openCursor(range, "prev").onsuccess = function(event) {
					const cursor = event.target.result;
					const snapshot = cursor && cursor.value;
					if (!snapshot) resolve(null);
					else if (accept(snapshot)) resolve(snapshot);
					else assertInitialized(cursor, "cursor").continue();
				};
			});
		}
		/**
		* Retrieve all the snapshots for a given session id, sorted by descending date order.
		* Returns a promise that resolves with an array of snapshots.
		*
		* @param {String} sessionId
		*        The session id
		*/
		getSnapshotsBySessionId(sessionId) {
			const index = assertInitialized(this.db, "db").transaction(["snapshots"]).objectStore("snapshots").index("session_id, date");
			const keyRange = IDBKeyRange.bound([sessionId, 0], [sessionId, Infinity]);
			const snapshots = [];
			return new Promise(function(resolve) {
				index.openCursor(keyRange, "prev").onsuccess = function(event) {
					const cursor = event.target.result;
					if (cursor) {
						snapshots.push(cursor.value);
						cursor.continue();
					} else resolve(snapshots);
				};
			});
		}
		getSessions() {
			const objectStore = assertInitialized(this.db, "db").transaction(["snapshots"]).objectStore("snapshots");
			const sessions = {};
			const _createSession = function(snapshot) {
				sessions[snapshot.session_id] = {
					startDate: snapshot.date,
					endDate: snapshot.date,
					name: snapshot.name,
					description: snapshot.description,
					id: snapshot.session_id,
					count: 1
				};
			};
			const _updateSession = function(snapshot) {
				const s = sessions[snapshot.session_id];
				s.startDate = Math.min(s.startDate, snapshot.date);
				s.endDate = Math.max(s.endDate, snapshot.date);
				s.count++;
				if (s.endDate === snapshot.date) {
					s.name = snapshot.name;
					s.description = snapshot.description;
				}
			};
			const index = objectStore.index("date");
			const range = IDBKeyRange.upperBound(Infinity);
			return new Promise(function(resolve) {
				index.openCursor(range, "prev").onsuccess = function(event) {
					const cursor = event.target.result;
					const snapshot = cursor && cursor.value;
					if (!snapshot) resolve(sessions);
					else {
						if (sessions[snapshot.session_id]) _updateSession(snapshot);
						else _createSession(snapshot);
						assertInitialized(cursor, "cursor").continue();
					}
				};
			}).then(function(sessions) {
				return Object.keys(sessions).map(function(key) {
					return sessions[key];
				});
			});
		}
		deleteSnapshotsForSession(sessionId) {
			const index = this.openObjectStore_().index("session_id");
			const keyRange = IDBKeyRange.only(sessionId);
			return new Promise(function(resolve) {
				index.openCursor(keyRange).onsuccess = function(event) {
					const cursor = event.target.result;
					if (cursor) {
						cursor.delete();
						cursor.continue();
					} else resolve();
				};
			});
		}
	};
	_BackupDatabase = BackupDatabase;
	_BackupDatabase.DB_NAME = DB_NAME$1;
	//#endregion
	//#region src/js/service/BackupService.ts
	var ONE_MINUTE = 60 * 1e3;
	var BACKUP_INTERVAL = ONE_MINUTE;
	var SNAPSHOT_INTERVAL = ONE_MINUTE * 5;
	var MAX_SNAPSHOTS_PER_SESSION = 12;
	var MAX_SESSIONS = 10;
	var BackupService = class {
		constructor(piskelController, backupDatabase) {
			this.piskelController = piskelController;
			this.lastHash = this.piskelController.getPiskel().getHash();
			this.nextSnapshotDate = -1;
			this.backupDatabase = backupDatabase || new BackupDatabase();
		}
		init() {
			this.backupDatabase.init().then(() => {
				window.setInterval(this.backup.bind(this), BACKUP_INTERVAL);
			});
		}
		currentDate_() {
			return Date.now();
		}
		backup() {
			const piskel = this.piskelController.getPiskel();
			const hash = piskel.getHash();
			if (hash === this.lastHash) return Promise.resolve();
			this.lastHash = hash;
			const descriptor = piskel.getDescriptor();
			const date = this.currentDate_();
			const snapshot = {
				session_id: assertInitialized(app.sessionId, "sessionId"),
				date,
				name: descriptor.name,
				description: descriptor.description,
				frames: piskel.getFrameCount(),
				width: piskel.getWidth(),
				height: piskel.getHeight(),
				fps: piskel.getFPS(),
				serialized: Serializer.serialize(piskel)
			};
			return this.getSnapshotsBySessionId(assertInitialized(app.sessionId, "sessionId")).then((snapshots) => {
				const latest = snapshots[0];
				if (latest && date < this.nextSnapshotDate) {
					snapshot.id = latest.id;
					return this.backupDatabase.updateSnapshot(snapshot);
				} else {
					this.nextSnapshotDate = date + SNAPSHOT_INTERVAL;
					return this.backupDatabase.createSnapshot(snapshot).then(() => {
						if (snapshots.length >= MAX_SNAPSHOTS_PER_SESSION) return this.backupDatabase.deleteSnapshot(snapshots[snapshots.length - 1]);
					}).then(() => {
						if (!!latest) return;
						return this.backupDatabase.getSessions().then((sessions) => {
							if (sessions.length <= MAX_SESSIONS) return;
							const sessionIdsToDelete = sessions.sort(function(s1, s2) {
								return s1.startDate - s2.startDate;
							}).map(function(s) {
								return s.id;
							}).slice(0, sessions.length - MAX_SESSIONS);
							return Promise.all(sessionIdsToDelete.map((id) => {
								return this.deleteSession(id);
							}));
						});
					});
				}
			}).catch(function(e) {
				console.error(e);
			});
		}
		getSnapshotsBySessionId(sessionId) {
			return this.backupDatabase.getSnapshotsBySessionId(sessionId);
		}
		deleteSession(sessionId) {
			return this.backupDatabase.deleteSnapshotsForSession(sessionId);
		}
		getPreviousPiskelInfo() {
			return this.backupDatabase.findLastSnapshot(function(snapshot) {
				return snapshot.session_id !== app.sessionId;
			});
		}
		list() {
			return this.backupDatabase.getSessions();
		}
		loadSnapshotById(snapshotId) {
			return new Promise((resolve) => {
				this.backupDatabase.getSnapshot(snapshotId).then(function(snapshot) {
					Deserializer.deserialize(JSON.parse(assertInitialized(snapshot, "snapshot").serialized), function(piskel) {
						assertInitialized(app.piskelController, "piskelController").setPiskel(piskel);
						resolve();
					});
				});
			});
		}
		load() {
			return new Promise((resolve) => {
				this.getPreviousPiskelInfo().then(function(snapshot) {
					Deserializer.deserialize(JSON.parse(assertInitialized(snapshot, "snapshot").serialized), function(piskel) {
						assertInitialized(app.piskelController, "piskelController").setPiskel(piskel);
						resolve();
					});
				});
			});
		}
	};
	//#endregion
	//#region src/js/service/BeforeUnloadService.ts
	var BeforeUnloadService = class {
		constructor(piskelController) {
			this.piskelController = piskelController;
		}
		init() {
			if (Environment.detectNodeWebkit()) {
				const win = window.require("nw.gui").Window.get();
				win.on("close", this.onNwWindowClose.bind(this, win));
			}
			window.addEventListener("beforeunload", this.onBeforeUnload.bind(this));
		}
		/**
		* In nw.js environment "onbeforeunload" is not triggered when closing the window.
		* Polyfill the behavior here.
		*/
		onNwWindowClose(win) {
			const msg = this.onBeforeUnload();
			if (msg) {
				if (!window.confirm(msg)) return false;
			}
			win.close(true);
		}
		onBeforeUnload(evt) {
			assertInitialized(app.backupService, "backupService").backup();
			if (assertInitialized(app.savedStatusService, "savedStatusService").isDirty()) {
				const confirmationMessage = "Your current sprite has unsaved changes. Are you sure you want to quit?";
				evt = evt || window.event;
				if (evt) evt.returnValue = confirmationMessage;
				return confirmationMessage;
			}
		}
	};
	//#endregion
	//#region src/js/service/ClipboardService.ts
	var ClipboardService = class {
		constructor(piskelController) {
			this.piskelController = piskelController;
		}
		init() {
			window.addEventListener("copy", this._onCopy.bind(this), true);
			window.addEventListener("cut", this._onCut.bind(this), true);
			window.addEventListener("paste", this._onPaste.bind(this), true);
		}
		_onCut(event) {
			$.publish(Events.CLIPBOARD_CUT, event);
		}
		_onCopy(event) {
			$.publish(Events.CLIPBOARD_COPY, event);
		}
		_onPaste(event) {
			$.publish(Events.CLIPBOARD_PASTE, event);
		}
	};
	//#endregion
	//#region src/js/model/frame/AsyncCachedFrameProcessor.ts
	var AsyncCachedFrameProcessor = class extends FrameCache {
		setFrameProcessor(frameProcessor) {
			this.frameProcessor = frameProcessor;
		}
		/**
		* Retrieve the processed frame from the cache, in the (optional) namespace
		* If the first level cache is empty, attempt to clone it from 2nd level cache.
		* If second level cache is empty process the frame.
		* @param  {pskl.model.Frame} frame
		* @param  {String} namespace
		* @return {Object} the processed frame
		*/
		get(frame, namespace) {
			const cacheNamespace = namespace || this.defaultNamespace;
			if (!this.cache_[cacheNamespace]) this.cache_[cacheNamespace] = {};
			const cache = this.cache_[cacheNamespace];
			const key1 = frame.getHash();
			const cached = cache[key1];
			if (cached) return Promise.resolve(cached);
			return new Promise((resolve) => {
				const callback = this.onProcessorComplete_.bind(this, resolve, cache, key1);
				assertInitialized(this.frameProcessor, "frameProcessor")(frame, callback);
			});
		}
		onProcessorComplete_(resolve, cache, key1, result) {
			cache[key1] = result;
			resolve(result);
		}
	};
	//#endregion
	//#region src/js/worker/framecolors/FrameColorsWorker.ts?worker&inline
	var jsContent$1 = "(function() {\n	//#region src/js/worker/framecolors/FrameColorsWorker.ts\n	const post = (message) => {\n		self.postMessage(message);\n	};\n	const getFrameColors = (frame, transparentColorInt, maxColors) => {\n		const frameColors = {};\n		let colors = 0;\n		for (let i = 0, length = frame.length; i < length && colors < maxColors; i++) {\n			const color = frame[i];\n			if (color !== transparentColorInt) {\n				if (!frameColors[color]) {\n					frameColors[color] = true;\n					colors++;\n				}\n			}\n		}\n		return frameColors;\n	};\n	self.onmessage = (event) => {\n		try {\n			const [transparentColor, maxColors, frame] = event.data;\n			post({\n				type: \"SUCCESS\",\n				colors: getFrameColors(frame, transparentColor, maxColors)\n			});\n		} catch (e) {\n			post({\n				type: \"ERROR\",\n				message: e instanceof Error ? e.message : String(e)\n			});\n		}\n	};\n	//#endregion\n})();\n\n//# sourceMappingURL=FrameColorsWorker-DGedz7ur.js.map";
	var blob$1 = typeof self !== "undefined" && self.Blob && new Blob(["(self.URL || self.webkitURL).revokeObjectURL(self.location.href);", jsContent$1], { type: "text/javascript;charset=utf-8" });
	function WorkerWrapper$1(options) {
		let objURL;
		try {
			objURL = blob$1 && (self.URL || self.webkitURL).createObjectURL(blob$1);
			if (!objURL) throw "";
			const worker = new Worker(objURL, { name: options?.name });
			worker.addEventListener("error", () => {
				(self.URL || self.webkitURL).revokeObjectURL(objURL);
			});
			return worker;
		} catch (e) {
			return new Worker("data:text/javascript;charset=utf-8," + encodeURIComponent(jsContent$1), { name: options?.name });
		}
	}
	//#endregion
	//#region src/js/worker/framecolors/FrameColors.ts
	if (Constants.TRANSPARENT_COLOR !== "rgba(0, 0, 0, 0)") throw "Constants.TRANSPARENT_COLOR, please update FrameColorsWorker";
	var FrameColors = class {
		constructor(frame, onSuccess, onStep, onError) {
			this.pixels = frame.pixels;
			this.onStep = onStep;
			this.onSuccess = onSuccess;
			this.onError = onError;
			this.worker = new WorkerWrapper$1();
			this.worker.onmessage = this.onWorkerMessage.bind(this);
		}
		process() {
			const request = [
				colorToInt(Constants.TRANSPARENT_COLOR),
				Constants.MAX_WORKER_COLORS,
				this.pixels
			];
			this.worker.postMessage(request);
		}
		onWorkerMessage(event) {
			if (event.data.type === "SUCCESS") {
				this.onSuccess(event);
				this.worker.terminate();
			} else if (event.data.type === "ERROR") {
				this.onError(event);
				this.worker.terminate();
			}
		}
	};
	//#endregion
	//#region src/js/service/CurrentColorsService.ts
	var batchAll = function(frames, job) {
		const batches = [];
		frames = frames.slice(0);
		while (frames.length) batches.push(frames.splice(0, 10));
		let result = Promise.resolve([]);
		batches.forEach(function(batch) {
			result = result.then(function(results) {
				return Promise.all(batch.map(job)).then(function(partials) {
					return results.concat(partials);
				});
			});
		});
		return result;
	};
	var CurrentColorsService = class {
		constructor(piskelController) {
			this.piskelController = piskelController;
			this.cache = {};
			this.currentColors = [];
			this.cachedFrameProcessor = new AsyncCachedFrameProcessor();
			this.cachedFrameProcessor.setFrameProcessor(this.getFrameColors_.bind(this));
			this.throttledUpdateCurrentColors_ = FunctionUtils.throttle(this.updateCurrentColors_.bind(this), 1e3);
			this.paletteService = app.paletteService;
		}
		init() {
			$.subscribe(Events.HISTORY_STATE_SAVED, this.throttledUpdateCurrentColors_);
			$.subscribe(Events.HISTORY_STATE_LOADED, this.loadColorsFromCache_.bind(this));
		}
		getCurrentColors() {
			return this.currentColors;
		}
		setCurrentColors(colors) {
			const historyIndex = assertInitialized(app.historyService, "historyService").currentIndex;
			this.cache[historyIndex] = colors;
			if (colors.join("") !== this.currentColors.join("")) {
				this.currentColors = colors;
				$.publish(Events.CURRENT_COLORS_UPDATED);
			}
		}
		updateCurrentColors_() {
			batchAll(this.piskelController.getLayers().map(function(l) {
				return l.getFrames();
			}).reduce(function(p, n) {
				return p.concat(n);
			}), (frame) => {
				return this.cachedFrameProcessor.get(frame);
			}).then((results) => {
				const colors = {};
				results.forEach(function(result) {
					Object.keys(result).forEach(function(color) {
						colors[color] = true;
					});
				});
				delete colors[colorToInt(Constants.TRANSPARENT_COLOR)];
				const hexColors = Object.keys(colors).map(function(color) {
					return intToHex(Number(color));
				});
				this.setCurrentColors(hexColors);
			});
		}
		isCurrentColorsPaletteSelected_() {
			const paletteId = UserSettings.get(UserSettings.SELECTED_PALETTE);
			const palette = assertInitialized(this.paletteService, "paletteService").getPaletteById(paletteId);
			return palette && palette.id === Constants.CURRENT_COLORS_PALETTE_ID;
		}
		loadColorsFromCache_() {
			const historyIndex = assertInitialized(app.historyService, "historyService").currentIndex;
			const colors = this.cache[historyIndex];
			if (colors) this.setCurrentColors(colors);
		}
		getFrameColors_(frame, processorCallback) {
			new FrameColors(frame, function(event) {
				if (event.data.type === "SUCCESS") processorCallback(event.data.colors);
			}, function() {}, function() {
				processorCallback({});
			}).process();
		}
	};
	//#endregion
	//#region src/js/service/FileDropperService.ts
	var FileDropperService = class {
		constructor(piskelController) {
			this.piskelController = piskelController;
			this.dropPosition_ = null;
		}
		init() {
			document.body.addEventListener("drop", this.onFileDrop.bind(this), false);
			document.body.addEventListener("dragover", this.onFileDragOver.bind(this), false);
		}
		onFileDragOver(event) {
			event.stopPropagation();
			event.preventDefault();
			assertInitialized(event.dataTransfer, "dataTransfer").dropEffect = "copy";
		}
		onFileDrop(event) {
			event.preventDefault();
			event.stopPropagation();
			this.dropPosition_ = {
				x: event.clientX,
				y: event.clientY
			};
			const files = assertInitialized(event.dataTransfer, "dataTransfer").files;
			this.isMultipleFiles_ = files.length > 1;
			for (let i = 0; i < files.length; i++) {
				const file = files[i];
				const isImage = file.type.indexOf("image") === 0;
				const isPiskel = /\.piskel$/i.test(file.name);
				const isPalette = /\.(gpl|txt|pal)$/i.test(file.name);
				if (isImage) FileUtils.readImageFile(file, (image) => {
					this.onImageLoaded_(image, file);
				});
				else if (isPiskel) PiskelFileUtils.loadFromFile(file, this.onPiskelFileLoaded_, this.onPiskelFileError_);
				else if (isPalette) assertInitialized(app.paletteImportService, "paletteImportService").read(file, this.onPaletteLoaded_.bind(this));
			}
		}
		onPaletteLoaded_(palette) {
			assertInitialized(app.paletteService, "paletteService").savePalette(palette);
			UserSettings.set(UserSettings.SELECTED_PALETTE, palette.id);
		}
		onPiskelFileLoaded_(piskel) {
			if (window.confirm(Constants.CONFIRM_OVERWRITE)) assertInitialized(app.piskelController, "piskelController").setPiskel(piskel);
		}
		onPiskelFileError_(reason) {
			$.publish(Events.PISKEL_FILE_IMPORT_FAILED, [reason]);
		}
		onImageLoaded_(importedImage, file) {
			const piskelWidth = assertInitialized(app.piskelController, "piskelController").getWidth();
			const piskelHeight = assertInitialized(app.piskelController, "piskelController").getHeight();
			if (this.isMultipleFiles_) {
				this.piskelController.addFrameAtCurrentIndex();
				this.piskelController.selectNextFrame();
			} else if (importedImage.width > piskelWidth || importedImage.height > piskelHeight) {
				$.publish(Events.DIALOG_SHOW, {
					dialogId: "import",
					initArgs: { rawFiles: [file] }
				});
				return;
			}
			const currentFrame = this.piskelController.getCurrentFrame();
			const spriteDropPosition = assertInitialized(app.drawingController, "drawingController").getSpriteCoordinates(assertInitialized(this.dropPosition_, "dropPosition_").x, assertInitialized(this.dropPosition_, "dropPosition_").y);
			const x = spriteDropPosition.x;
			const y = spriteDropPosition.y;
			FrameUtils.addImageToFrame(currentFrame, importedImage, x, y);
			$.publish(Events.PISKEL_RESET);
			$.publish(Events.PISKEL_SAVE_STATE, { type: HistoryService.SNAPSHOT });
		}
	};
	//#endregion
	//#region src/js/service/ImportService.ts
	var ImportService = class {
		constructor(piskelController) {
			this.piskelController_ = piskelController;
		}
		init() {
			$.subscribe(Events.PISKEL_FILE_IMPORT_FAILED, (_evt, reason) => {
				this.onPiskelFileImportFailed_(reason);
			});
		}
		/**
		* Called when a piskel load failed event is published. Display an appropriate error message.
		* TODO: for some failure reasons, we might want to display a dialog with more details.
		*/
		onPiskelFileImportFailed_(reason) {
			$.publish(Events.SHOW_NOTIFICATION, [{
				content: "Piskel file import failed (" + reason + ")",
				hideDelay: 1e4
			}]);
		}
		/**
		* Given an image object and some options, create a new Piskel and open it
		* for editing.
		* @param {Image} image
		* @param {Object} options
		*        - {String}  importType 'single' if not spritesheet
		*        - {String}  name
		*        - {Boolean} smoothing
		*        - {Number}  frameSizeX
		*        - {Number}  frameSizeY
		*        - {Number}  frameOffsetX (only used in spritesheet imports)
		*        - {Number}  frameOffsetY (only used in spritesheet imports)
		* @param {Function} onComplete
		*        Callback called when the new piskel has been created, with the new piskel
		*        as single argument.
		*/
		newPiskelFromImage(image, options, onComplete) {
			const importType = options.importType;
			const name = options.name;
			const smoothing = options.smoothing;
			const frameSizeX = options.frameSizeX;
			const frameSizeY = options.frameSizeY;
			const frameOffsetX = options.frameOffsetX;
			const frameOffsetY = options.frameOffsetY;
			const gifLoader = new window.SuperGif({ gif: image });
			gifLoader.load({
				success: () => {
					const images = gifLoader.getFrames().map(function(frame) {
						return CanvasUtils.createFromImageData(frame.data);
					});
					let piskel;
					if (importType === "single" || images.length > 1) piskel = this.createPiskelFromImages_(images, name, frameSizeX, frameSizeY, smoothing);
					else {
						const frameImages = this.createImagesFromSheet_(images[0], frameSizeX, frameSizeY, frameOffsetX, frameOffsetY);
						piskel = this.createPiskelFromImages_(frameImages, name, frameSizeX, frameSizeY, smoothing);
					}
					onComplete(piskel);
				},
				error: () => {
					let piskel;
					if (importType === "single") piskel = this.createPiskelFromImages_([image], name, frameSizeX, frameSizeY, smoothing);
					else {
						const frameImages = this.createImagesFromSheet_(image, frameSizeX, frameSizeY, frameOffsetX, frameOffsetY);
						piskel = this.createPiskelFromImages_(frameImages, name, frameSizeX, frameSizeY, smoothing);
					}
					onComplete(piskel);
				}
			});
		}
		/**
		* @param {!Image} image
		* @param {!number} frameSizeX
		* @param {!number} frameSizeY
		* @param {!number} frameOffsetX
		* @param {!number} frameOffsetY
		* @returns {canvas[]}
		* @private
		*/
		createImagesFromSheet_(image, frameSizeX, frameSizeY, frameOffsetX, frameOffsetY) {
			return CanvasUtils.createFramesFromImage(image, frameOffsetX, frameOffsetY, frameSizeX, frameSizeY, true, true);
		}
		/**
		* @param {canvas[]} images
		* @param {!number} frameSizeX
		* @param {!number} frameSizeY
		* @param {!boolean} smoothing
		* @private
		*/
		createPiskelFromImages_(images, name, frameSizeX, frameSizeY, smoothing) {
			name = name || "Imported piskel";
			const frames = this.createFramesFromImages_(images, frameSizeX, frameSizeY, smoothing);
			const layer = Layer.fromFrames("Layer 1", frames);
			const descriptor = new Descriptor(name, "");
			return Piskel.fromLayers([layer], Constants.DEFAULT.FPS, descriptor);
		}
		/**
		* @param {!canvas[]} images
		* @param {!number} frameSizeX
		* @param {!number} frameSizeY
		* @param {!boolean} smoothing
		* @returns {pskl.model.Frame[]}
		* @private
		*/
		createFramesFromImages_(images, frameSizeX, frameSizeY, smoothing) {
			return images.map(function(image) {
				const resizedImage = ImageResizer.resize(image, frameSizeX, frameSizeY, smoothing);
				return FrameUtils.createFromImage(resizedImage);
			});
		}
	};
	//#endregion
	//#region src/js/service/MouseStateService.ts
	var BUTTON_UNSET = null;
	/**
	* This service exists mostly due to a FF/IE bug.
	* For mousemove events, the button type is set to 0 (e.g. left button type) whatever was the
	* pressed button on mousedown. We use this service to cache the button type value on mousedown
	* and make it available to mousemove events.
	*/
	var MouseStateService = class {
		constructor() {
			this.lastButtonPressed_ = BUTTON_UNSET;
		}
		init() {
			$.subscribe(Events.MOUSE_EVENT, this.onMouseEvent_.bind(this));
		}
		isLeftButtonPressed() {
			return this.isMouseButtonPressed_(Constants.LEFT_BUTTON);
		}
		isRightButtonPressed() {
			return this.isMouseButtonPressed_(Constants.RIGHT_BUTTON);
		}
		isMiddleButtonPressed() {
			return this.isMouseButtonPressed_(Constants.MIDDLE_BUTTON);
		}
		isMouseButtonPressed_(mouseButton) {
			return this.lastButtonPressed_ != BUTTON_UNSET && this.lastButtonPressed_ == mouseButton;
		}
		onMouseEvent_(_evt, mouseEvent) {
			if (mouseEvent.type == "mousedown") this.lastButtonPressed_ = mouseEvent.button;
			else if (mouseEvent.type == "mouseup") this.lastButtonPressed_ = BUTTON_UNSET;
		}
	};
	//#endregion
	//#region src/js/service/SavedStatusService.ts
	var SavedStatusService = class {
		constructor(piskelController, historyService) {
			this.piskelController = piskelController;
			this.historyService = historyService;
			this.lastSavedStateIndex = "";
			this.publishStatusUpdateEvent_ = this.publishStatusUpdateEvent_.bind(this);
		}
		init() {
			$.subscribe(Events.TOOL_RELEASED, this.publishStatusUpdateEvent_);
			$.subscribe(Events.PISKEL_RESET, this.publishStatusUpdateEvent_);
			$.subscribe(Events.PISKEL_SAVED, this.onPiskelSaved.bind(this));
			this.lastSavedStateIndex = this.historyService.getCurrentStateId();
		}
		onPiskelSaved() {
			this.lastSavedStateIndex = this.historyService.getCurrentStateId();
			this.publishStatusUpdateEvent_();
		}
		publishStatusUpdateEvent_() {
			$.publish(Events.PISKEL_SAVED_STATUS_UPDATE);
		}
		isDirty() {
			return this.lastSavedStateIndex != this.historyService.getCurrentStateId();
		}
	};
	//#endregion
	//#region src/js/service/SelectedColorsService.ts
	var SelectedColorsService = class {
		constructor() {
			this.primaryColor_ = Constants.DEFAULT_PEN_COLOR;
			this.secondaryColor_ = Constants.TRANSPARENT_COLOR;
		}
		init() {
			$.subscribe(Events.PRIMARY_COLOR_SELECTED, this.onPrimaryColorUpdate_.bind(this));
			$.subscribe(Events.SECONDARY_COLOR_SELECTED, this.onSecondaryColorUpdate_.bind(this));
		}
		getPrimaryColor() {
			return this.primaryColor_;
		}
		getSecondaryColor() {
			return this.secondaryColor_;
		}
		onPrimaryColorUpdate_(_evt, color) {
			this.primaryColor_ = color;
		}
		onSecondaryColorUpdate_(_evt, color) {
			this.secondaryColor_ = color;
		}
	};
	//#endregion
	//#region src/js/service/keyboard/ShortcutService.ts
	var ShortcutService = class {
		constructor() {
			this.shortcuts_ = [];
		}
		/**
		* @public
		*/
		init() {
			document.body.addEventListener("keydown", this.onKeyDown_.bind(this));
		}
		/**
		* Add a keyboard shortcut
		* @param {pskl.service.keyboard.Shortcut} shortcut
		* @param {Function} callback should return true to let the original event perform its default action
		*/
		registerShortcut(shortcut, callback) {
			if (!(shortcut instanceof Shortcut)) throw "Invalid shortcut argument, please use instances of pskl.service.keyboard.Shortcut";
			if (typeof callback != "function") throw "Invalid callback argument, please provide a function";
			this.shortcuts_.push({
				shortcut,
				callback
			});
		}
		unregisterShortcut(shortcut) {
			let index = -1;
			this.shortcuts_.forEach(function(s, i) {
				if (s.shortcut === shortcut) index = i;
			});
			if (index != -1) this.shortcuts_.splice(index, 1);
		}
		/**
		* @private
		*/
		onKeyDown_(evt) {
			const eventKeyOrNull = KeyUtils.createKeyFromEvent(evt);
			if (this.isInInput_(evt) || !eventKeyOrNull) return;
			const eventKey = eventKeyOrNull;
			this.shortcuts_.forEach((shortcutInfo) => {
				shortcutInfo.shortcut.getKeys().forEach((shortcutKey) => {
					if (!KeyUtils.equals(shortcutKey, eventKey)) return;
					if (shortcutInfo.callback(eventKey.key) !== true) evt.preventDefault();
					$.publish(Events.KEYBOARD_EVENT, [evt]);
				});
			});
		}
		isInInput_(evt) {
			const targetTagName = evt.target.nodeName.toUpperCase();
			return targetTagName === "INPUT" || targetTagName === "TEXTAREA";
		}
		getShortcutById(id) {
			return ArrayUtils.find(this.getShortcuts(), function(shortcut) {
				return shortcut.getId() === id;
			});
		}
		getShortcuts() {
			const shortcuts = [];
			Shortcuts.CATEGORIES.forEach(function(category) {
				const shortcutMap = Shortcuts[category];
				Object.keys(shortcutMap).forEach(function(shortcutKey) {
					shortcuts.push(shortcutMap[shortcutKey]);
				});
			});
			return shortcuts;
		}
		updateShortcut(shortcut, keyAsString) {
			const key = keyAsString.replace(/\s/g, "");
			if (Shortcuts.FORBIDDEN_KEYS.indexOf(key) != -1) $.publish(Events.SHOW_NOTIFICATION, [{
				content: "Key cannot be remapped (" + keyAsString + ")",
				hideDelay: 5e3
			}]);
			else {
				this.removeKeyFromAllShortcuts_(key);
				shortcut.updateKeys([key]);
				$.publish(Events.SHORTCUTS_CHANGED);
			}
		}
		removeKeyFromAllShortcuts_(key) {
			this.getShortcuts().forEach(function(s) {
				if (s.removeKeys([key])) $.publish(Events.SHOW_NOTIFICATION, [{
					content: "Shortcut key removed for " + s.getId(),
					hideDelay: 5e3
				}]);
			});
		}
		/**
		* Restore the default piskel key for all shortcuts
		*/
		restoreDefaultShortcuts() {
			this.getShortcuts().forEach(function(shortcut) {
				shortcut.restoreDefault();
			});
			$.publish(Events.SHORTCUTS_CHANGED);
		}
	};
	//#endregion
	//#region src/js/service/color/ColorSorter.ts
	var LOW_SAT = .1;
	var LOW_LUM = .1;
	var HI_LUM = .9;
	var HUE_STEP = 36;
	var HUE_BAGS = 10;
	var HUE_BOUNDS = [];
	for (let i = 0; i < HUE_BAGS; i++) HUE_BOUNDS.push(i * HUE_STEP);
	var ColorSorter = class {
		constructor() {
			this.colorsHslMap_ = {};
		}
		sort(colors) {
			this.colorsHslMap_ = {};
			colors.forEach((color) => {
				this.colorsHslMap_[color] = window.tinycolor(color).toHsl();
			});
			let darkColors = colors.filter((c) => {
				return this.colorsHslMap_[c].l <= LOW_LUM;
			});
			let brightColors = colors.filter((c) => {
				return this.colorsHslMap_[c].l >= HI_LUM;
			});
			let desaturatedColors = colors.filter(function(c) {
				return brightColors.indexOf(c) === -1 && darkColors.indexOf(c) === -1;
			}).filter((c) => {
				return this.colorsHslMap_[c].s <= LOW_SAT;
			});
			darkColors = this.sortOnHslProperty_(darkColors, "l");
			brightColors = this.sortOnHslProperty_(brightColors, "l");
			desaturatedColors = this.sortOnHslProperty_(desaturatedColors, "h");
			const sortedColors = darkColors.concat(brightColors, desaturatedColors);
			const regularColors = colors.filter(function(c) {
				return sortedColors.indexOf(c) === -1;
			});
			const regularColorsBags = HUE_BOUNDS.map((hue) => {
				const bagColors = regularColors.filter((color) => {
					const hsl = this.colorsHslMap_[color];
					return hsl.h >= hue && hsl.h < hue + HUE_STEP;
				});
				return this.sortRegularColors_(bagColors);
			});
			return Array.prototype.concat.apply(sortedColors, regularColorsBags);
		}
		sortRegularColors_(colors) {
			return colors.sort((c1, c2) => {
				const hsl1 = this.colorsHslMap_[c1];
				const hsl2 = this.colorsHslMap_[c2];
				const hDiff = Math.abs(hsl1.h - hsl2.h);
				const sDiff = Math.abs(hsl1.s - hsl2.s);
				const lDiff = Math.abs(hsl1.l - hsl2.l);
				if (hDiff < 10) if (sDiff > lDiff) return this.compareValues_(hsl1.s, hsl2.s);
				else return this.compareValues_(hsl1.l, hsl2.l);
				else return this.compareValues_(hsl1.h, hsl2.h);
			});
		}
		sortOnHslProperty_(colors, property) {
			return colors.sort((c1, c2) => {
				const hsl1 = this.colorsHslMap_[c1];
				const hsl2 = this.colorsHslMap_[c2];
				return this.compareValues_(hsl1[property], hsl2[property]);
			});
		}
		compareValues_(v1, v2) {
			if (v1 > v2) return 1;
			else if (v1 < v2) return -1;
			return 0;
		}
	};
	//#endregion
	//#region src/js/service/palette/CurrentColorsPalette.ts
	var CurrentColorsPalette = class {
		constructor() {
			this.name = "Current colors";
			this.id = Constants.CURRENT_COLORS_PALETTE_ID;
			this.colorSorter = new ColorSorter();
		}
		getColors() {
			let currentColors = assertInitialized(app.currentColorsService, "currentColorsService").getCurrentColors();
			currentColors = currentColors.slice(0, Constants.MAX_PALETTE_COLORS);
			return this.colorSorter.sort(currentColors);
		}
	};
	//#endregion
	//#region src/js/service/palette/reader/AbstractPaletteFileReader.ts
	var AbstractPaletteFileReader = class {
		constructor(file, onSuccess, onError, colorLineRegexp) {
			this.file = file;
			this.onSuccess = onSuccess;
			this.onError = onError;
			this.colorLineRegexp = colorLineRegexp;
		}
		read() {
			FileUtils.readFile(this.file, this.onFileLoaded_.bind(this));
		}
		onFileLoaded_(content) {
			const lines = Base64.toText(content).match(/[^\r\n]+/g);
			if (lines === null) throw new Error("The palette file is empty: " + this.file.name);
			const colors = lines.filter((l) => {
				return this.colorLineRegexp.test(l);
			}).map(this.extractColorFromLine.bind(this));
			if (colors.length) {
				const palette = new Palette(Uuid.generate(), this.file.name, colors);
				this.onSuccess(palette);
			} else this.onError();
		}
	};
	//#endregion
	//#region src/js/service/palette/reader/PaletteGplReader.ts
	var RE_COLOR_LINE$2 = /^(\s*\d{1,3})(\s*\d{1,3})(\s*\d{1,3})/;
	var PaletteGplReader = class extends AbstractPaletteFileReader {
		constructor(file, onSuccess, onError) {
			super(file, onSuccess, onError, RE_COLOR_LINE$2);
		}
		extractColorFromLine(line) {
			const matches = line.match(RE_COLOR_LINE$2);
			if (matches === null) throw new Error("Not a color line: " + line);
			return window.tinycolor({
				r: parseInt(matches[1], 10),
				g: parseInt(matches[2], 10),
				b: parseInt(matches[3], 10)
			}).toHexString();
		}
	};
	//#endregion
	//#region src/js/worker/imageprocessor/ImageProcessorWorker.ts?worker&inline
	var jsContent = "(function() {\n	//#region src/js/worker/imageprocessor/ImageProcessorWorker.ts\n	const post = (message) => {\n		self.postMessage(message);\n	};\n	let currentStep = 0;\n	let currentProgress = \"\";\n	let currentTotal = 0;\n	const initStepCounter_ = (total) => {\n		currentStep = 0;\n		currentProgress = \"0\";\n		currentTotal = total;\n	};\n	const postStep_ = () => {\n		currentStep = currentStep + 1;\n		const progress = (currentStep / currentTotal * 100).toFixed(1);\n		if (progress !== currentProgress) {\n			currentProgress = progress;\n			post({\n				type: \"STEP\",\n				progress: currentProgress,\n				currentStep,\n				total: currentTotal\n			});\n		}\n	};\n	const componentToHex = (c) => {\n		const hex = c.toString(16);\n		return hex.length === 1 ? `0${hex}` : hex;\n	};\n	const rgbToHex = (r, g, b) => `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`;\n	const imageDataToGrid = (imageData, width, height, transparent) => {\n		const grid = [];\n		for (let x = 0; x < width; x++) {\n			grid[x] = [];\n			postStep_();\n			for (let y = 0; y < height; y++) {\n				const i = (y * width + x) * 4;\n				const r = imageData[i];\n				const g = imageData[i + 1];\n				const b = imageData[i + 2];\n				if (imageData[i + 3] < 125) grid[x][y] = transparent;\n				else grid[x][y] = rgbToHex(r, g, b);\n			}\n		}\n		return grid;\n	};\n	const getColorsMapFromImageData = (imageData, width, height) => {\n		const grid = imageDataToGrid(imageData, width, height, \"transparent\");\n		const colorsMap = {};\n		for (let i = 0; i < grid.length; i++) {\n			postStep_();\n			for (let j = 0; j < grid[i].length; j++) {\n				const color = grid[i][j];\n				if (color !== \"transparent\") colorsMap[color] = true;\n			}\n		}\n		return colorsMap;\n	};\n	self.onmessage = (event) => {\n		try {\n			const data = event.data;\n			initStepCounter_(data.width * 2);\n			post({\n				type: \"SUCCESS\",\n				colorsMap: getColorsMapFromImageData(data.imageData, data.width, data.height)\n			});\n		} catch (e) {\n			post({\n				type: \"ERROR\",\n				message: e instanceof Error ? e.message : String(e)\n			});\n		}\n	};\n	//#endregion\n})();\n\n//# sourceMappingURL=ImageProcessorWorker-B92PnPF8.js.map";
	var blob = typeof self !== "undefined" && self.Blob && new Blob(["(self.URL || self.webkitURL).revokeObjectURL(self.location.href);", jsContent], { type: "text/javascript;charset=utf-8" });
	function WorkerWrapper(options) {
		let objURL;
		try {
			objURL = blob && (self.URL || self.webkitURL).createObjectURL(blob);
			if (!objURL) throw "";
			const worker = new Worker(objURL, { name: options?.name });
			worker.addEventListener("error", () => {
				(self.URL || self.webkitURL).revokeObjectURL(objURL);
			});
			return worker;
		} catch (e) {
			return new Worker("data:text/javascript;charset=utf-8," + encodeURIComponent(jsContent), { name: options?.name });
		}
	}
	//#endregion
	//#region src/js/worker/imageprocessor/ImageProcessor.ts
	var ImageProcessor = class {
		constructor(image, onSuccess, onStep, onError) {
			this.image = image;
			this.onStep = onStep;
			this.onSuccess = onSuccess;
			this.onError = onError;
			this.worker = new WorkerWrapper();
			this.worker.onmessage = this.onWorkerMessage.bind(this);
		}
		process() {
			const canvas = CanvasUtils.createFromImage(this.image);
			const request = {
				imageData: CanvasUtils.getImageDataFromCanvas(canvas),
				width: this.image.width,
				height: this.image.height
			};
			this.worker.postMessage(request);
		}
		onWorkerMessage(event) {
			if (event.data.type === "STEP") this.onStep(event);
			else if (event.data.type === "SUCCESS") {
				this.onSuccess(event);
				this.worker.terminate();
			} else if (event.data.type === "ERROR") {
				this.onError(event);
				this.worker.terminate();
			}
		}
	};
	//#endregion
	//#region src/js/service/palette/reader/PaletteImageReader.ts
	var PaletteImageReader = class {
		constructor(file, onSuccess, onError) {
			this.file = file;
			this.onSuccess = onSuccess;
			this.onError = onError;
			this.colorSorter_ = new ColorSorter();
		}
		read() {
			FileUtils.readImageFile(this.file, this.onImageLoaded_.bind(this));
		}
		onImageLoaded_(image) {
			const imageProcessor = new ImageProcessor(image, this.onWorkerSuccess_.bind(this), this.onWorkerStep_.bind(this), this.onWorkerError_.bind(this));
			$.publish(Events.SHOW_PROGRESS, [{ name: "Processing image colors ..." }]);
			imageProcessor.process();
		}
		onWorkerSuccess_(event) {
			const data = event.data;
			if (data.type !== "SUCCESS") return;
			const colorsMap = data.colorsMap;
			const colors = Object.keys(colorsMap);
			if (colors.length > Constants.MAX_PALETTE_COLORS) this.onError("Too many colors : " + colors.length);
			else {
				const uuid = Uuid.generate();
				const sortedColors = this.colorSorter_.sort(colors);
				const palette = new Palette(uuid, this.file.name + " palette", sortedColors);
				this.onSuccess(palette);
			}
			$.publish(Events.HIDE_PROGRESS);
		}
		onWorkerStep_(event) {
			if (event.data.type !== "STEP") return;
			const progress = event.data.progress;
			$.publish(Events.UPDATE_PROGRESS, [{ progress }]);
		}
		onWorkerError_(event) {
			$.publish(Events.HIDE_PROGRESS);
			if (event.data.type === "ERROR") this.onError("Unable to process the image : " + event.data.message);
		}
	};
	//#endregion
	//#region src/js/service/palette/reader/PalettePalReader.ts
	var RE_COLOR_LINE$1 = /^(\d{1,3})\s+(\d{1,3})\s+(\d{1,3})/;
	var PalettePalReader = class extends AbstractPaletteFileReader {
		constructor(file, onSuccess, onError) {
			super(file, onSuccess, onError, RE_COLOR_LINE$1);
		}
		extractColorFromLine(line) {
			const matches = line.match(RE_COLOR_LINE$1);
			if (matches === null) throw new Error("Not a color line: " + line);
			const rgbColor = "rgb(" + matches[1] + "," + matches[2] + "," + matches[3] + ")";
			return window.tinycolor(rgbColor).toHexString();
		}
	};
	//#endregion
	//#region src/js/service/palette/reader/PaletteTxtReader.ts
	var RE_COLOR_LINE = /^[A-F0-9]{2}([A-F0-9]{2})([A-F0-9]{2})([A-F0-9]{2})/;
	var PaletteTxtReader = class extends AbstractPaletteFileReader {
		constructor(file, onSuccess, onError) {
			super(file, onSuccess, onError, RE_COLOR_LINE);
		}
		extractColorFromLine(line) {
			const matches = line.match(RE_COLOR_LINE);
			if (matches === null) throw new Error("Not a color line: " + line);
			return ("#" + matches[1] + matches[2] + matches[3]).toLowerCase();
		}
	};
	//#endregion
	//#region src/js/service/palette/PaletteImportService.ts
	var fileReaders = {
		gpl: PaletteGplReader,
		pal: PalettePalReader,
		txt: PaletteTxtReader,
		img: PaletteImageReader
	};
	var PaletteImportService = class {
		init() {}
		read(file, onSuccess, onError) {
			const reader = this.getReader_(file, onSuccess, onError);
			if (reader) reader.read();
			else console.error("Could not find reader for file : %s", file.name);
		}
		isImage_(file) {
			return file.type.indexOf("image") === 0;
		}
		getReader_(file, onSuccess, onError) {
			const ReaderClass = this.getReaderClass_(file);
			if (ReaderClass) return new ReaderClass(file, onSuccess, onError || function() {});
			else return null;
		}
		getReaderClass_(file) {
			let ReaderClass;
			if (this.isImage_(file)) ReaderClass = fileReaders.img;
			else ReaderClass = fileReaders[this.getExtension_(file)];
			return ReaderClass;
		}
		getExtension_(file) {
			const parts = file.name.split(".");
			return parts[parts.length - 1].toLowerCase();
		}
	};
	//#endregion
	//#region src/js/service/palette/PaletteService.ts
	var PaletteService = class {
		constructor() {
			this.dynamicPalettes = [];
			this.localStorageGlobal = window.localStorage;
		}
		getPalettes() {
			const palettesString = this.localStorageGlobal.getItem("piskel.palettes");
			const palettes = (JSON.parse(String(palettesString)) || []).map(function(palette) {
				return Palette.fromObject(palette);
			});
			return this.dynamicPalettes.concat(palettes);
		}
		getPaletteById(paletteId) {
			const palettes = this.getPalettes();
			return this.findPaletteInArray_(paletteId, palettes);
		}
		savePalette(palette) {
			const palettes = this.getPalettes();
			const existingPalette = this.findPaletteInArray_(palette.id, palettes);
			if (existingPalette) {
				const currentIndex = palettes.indexOf(existingPalette);
				palettes.splice(currentIndex, 1, palette);
			} else palettes.push(palette);
			this.savePalettes_(palettes);
			$.publish(Events.SHOW_NOTIFICATION, [{ content: "Palette " + palette.name + " successfully saved !" }]);
			window.setTimeout(function() {
				$.publish(Events.HIDE_NOTIFICATION);
			}, 2e3);
		}
		addDynamicPalette(palette) {
			this.dynamicPalettes.push(palette);
		}
		deletePaletteById(id) {
			const filteredPalettes = this.getPalettes().filter(function(palette) {
				return palette.id !== id;
			});
			this.savePalettes_(filteredPalettes);
		}
		savePalettes_(allPalettes) {
			const palettes = allPalettes.filter((palette) => {
				return this.dynamicPalettes.indexOf(palette) === -1;
			});
			this.localStorageGlobal.setItem("piskel.palettes", JSON.stringify(palettes));
			$.publish(Events.PALETTE_LIST_UPDATED);
		}
		findPaletteInArray_(paletteId, palettes) {
			let match = null;
			palettes.forEach(function(palette) {
				if (palette.id === paletteId) match = palette;
			});
			return match;
		}
	};
	//#endregion
	//#region src/js/service/pensize/PenSizeService.ts
	var MIN_PENSIZE = 1;
	var MAX_PENSIZE = 32;
	/**
	* Service to retrieve and modify the current pen size.
	*/
	var PenSizeService = class {
		constructor() {
			this.size = MIN_PENSIZE;
		}
		init() {
			this.size = UserSettings.get(UserSettings.PEN_SIZE);
			const shortcuts = Shortcuts;
			assertInitialized(app.shortcutService, "shortcutService").registerShortcut(shortcuts.MISC.INCREASE_PENSIZE, this.increasePenSize_.bind(this));
			assertInitialized(app.shortcutService, "shortcutService").registerShortcut(shortcuts.MISC.DECREASE_PENSIZE, this.decreasePenSize_.bind(this));
		}
		increasePenSize_() {
			this.setPenSize(this.size + 1);
		}
		decreasePenSize_() {
			this.setPenSize(this.size - 1);
		}
		getPenSize() {
			return this.size;
		}
		setPenSize(size) {
			if (this.isPenSizeValid_(size) && size != this.size) {
				this.size = size;
				UserSettings.set(UserSettings.PEN_SIZE, size);
				$.publish(Events.PEN_SIZE_CHANGED);
			}
		}
		isPenSizeValid_(size) {
			if (isNaN(size)) return false;
			return size >= MIN_PENSIZE && size <= MAX_PENSIZE;
		}
	};
	//#endregion
	//#region src/js/service/performance/PerformanceReport.ts
	/**
	* We consider that piskel should behave correctly for a sprite with the following specs:
	* - 256*256
	* - 30 frames
	* - 5 layers
	* - 30 colors
	* Based on these assumptions, as well as a few arbitrary hard limits we try to check
	* if the provided sprite might present a performance issue.
	*
	* @param {Piskel} piskel the sprite to analyze
	* @param {Number} colorsCount number of colors for the current sprite
	*        (not part of the piskel model so has to be provided separately).
	*/
	var PerformanceReport = class PerformanceReport {
		constructor(piskel, colorsCount) {
			const pixels = piskel.getWidth() * piskel.getHeight();
			this.resolution = pixels > 512 * 512;
			const layersCount = piskel.getLayers().length;
			this.layers = layersCount > 25;
			const framesCount = piskel.getLayerAt(0).size();
			this.frames = framesCount > 100;
			this.colors = colorsCount >= 256;
			this.overall = pixels / 2620 + layersCount * 4 + framesCount + colorsCount * 100 / 256 > 200;
		}
		equals(report) {
			return report instanceof PerformanceReport && this.resolution == report.resolution && this.layers == report.layers && this.frames == report.frames && this.colors == report.colors && this.overall == report.overall;
		}
		hasProblem() {
			return this.resolution || this.layers || this.frames || this.colors || this.overall;
		}
	};
	//#endregion
	//#region src/js/service/performance/PerformanceReportService.ts
	var PerformanceReportService = class {
		constructor(piskelController, currentColorsService) {
			this.piskelController = piskelController;
			this.currentColorsService = currentColorsService;
			this.currentReport = null;
		}
		init() {
			$.subscribe(Events.HISTORY_STATE_SAVED, this.createReport_.bind(this));
		}
		createReport_() {
			const report = new PerformanceReport(this.piskelController.getPiskel(), this.currentColorsService.getCurrentColors().length);
			if (!report.equals(this.currentReport)) {
				$.publish(Events.PERFORMANCE_REPORT_CHANGED, [report]);
				this.currentReport = report;
			}
		}
		hasProblem() {
			return this.currentReport && this.currentReport.hasProblem();
		}
	};
	//#endregion
	//#region src/js/utils/FileUtilsDesktop.ts
	var getFileInputElement = function(nwsaveas, accept) {
		const fileInputElement = document.createElement("input");
		fileInputElement.setAttribute("type", "file");
		fileInputElement.setAttribute("nwworkingdir", "");
		if (nwsaveas) fileInputElement.setAttribute("nwsaveas", String(nwsaveas));
		if (accept) fileInputElement.setAttribute("accept", accept);
		return fileInputElement;
	};
	var FileUtilsDesktop = {
		chooseFilenameDialog(nwsaveas, accept) {
			const fileInputElement = getFileInputElement(nwsaveas, accept);
			return new Promise(function(resolve) {
				const changeListener = function() {
					fileInputElement.removeEventListener("change", changeListener);
					document.removeEventListener("click", changeListener);
					resolve(fileInputElement.value);
				};
				window.setTimeout(function() {
					fileInputElement.click();
					fileInputElement.addEventListener("change", changeListener);
					document.addEventListener("mousedown", changeListener);
				}, 50);
			});
		},
		saveToFile(content, filename) {
			const fs = window.require("fs");
			return new Promise(function(resolve, reject) {
				fs.writeFile(filename, content, function(err) {
					if (err) reject("FileUtilsDesktop::savetoFile() - error saving file: " + filename + " Error: " + err);
					else resolve();
				});
			});
		},
		readFile(filename) {
			const fs = window.require("fs");
			return new Promise(function(resolve, reject) {
				fs.readFile(filename, "utf8", function(err, data) {
					if (err) reject("FileUtilsDesktop::readFile() - error reading file: " + filename + " Error: " + err);
					else resolve(data);
				});
			});
		}
	};
	//#endregion
	//#region src/js/service/storage/DesktopStorageService.ts
	var PISKEL_EXTENSION = ".piskel";
	var DesktopStorageService = class {
		constructor(piskelController) {
			this.piskelController = assertInitialized(piskelController || app.piskelController, "piskelController");
			this.hideNotificationTimeoutID = 0;
		}
		init() {}
		save(piskel, saveAsNew) {
			if (piskel.savePath && !saveAsNew) return this.saveAtPath_(piskel, piskel.savePath);
			else {
				const name = piskel.getDescriptor().name;
				return FileUtilsDesktop.chooseFilenameDialog(name, PISKEL_EXTENSION).then((savePath) => this.saveAtPath_(piskel, savePath));
			}
		}
		saveAtPath_(piskel, savePath) {
			if (!savePath) return Promise.reject("Invalid file name");
			const serialized = Serializer.serialize(piskel);
			savePath = this.addExtensionIfNeeded_(savePath);
			piskel.savePath = savePath;
			const fileName = this.extractFilename_(savePath);
			if (fileName !== void 0) piskel.setName(fileName);
			return FileUtilsDesktop.saveToFile(serialized, savePath);
		}
		openPiskel() {
			return FileUtilsDesktop.chooseFilenameDialog().then(this.load);
		}
		load(savePath) {
			FileUtilsDesktop.readFile(savePath).then(function(content) {
				PiskelFileUtils.decodePiskelFile(content, function(piskel) {
					piskel.savePath = savePath;
					assertInitialized(app.piskelController, "piskelController").setPiskel(piskel);
				}, function() {});
			});
		}
		addExtensionIfNeeded_(filename) {
			if (!(filename.substr(-7) === PISKEL_EXTENSION)) return filename + PISKEL_EXTENSION;
			return filename;
		}
		extractFilename_(savePath) {
			const matches = /[\/\\]([^\/\\]*)\.piskel$/gi.exec(savePath);
			if (matches && matches[1]) return matches[1];
		}
	};
	//#endregion
	//#region src/js/service/storage/FileDownloadStorageService.ts
	var FileDownloadStorageService = class {
		init() {}
		save(piskel) {
			const serialized = Serializer.serialize(piskel);
			return new Promise((resolve, reject) => {
				BlobUtils.stringToBlob(serialized, (blob) => {
					const piskelName = piskel.getDescriptor().name;
					const timestamp = DateUtils.format(/* @__PURE__ */ new Date(), "{{Y}}{{M}}{{D}}-{{H}}{{m}}{{s}}");
					const fileName = piskelName + "-" + timestamp + ".piskel";
					try {
						FileUtils.downloadAsFile(blob, fileName);
						resolve();
					} catch (e) {
						reject(e instanceof Error ? e.message : String(e));
					}
				}, "application/piskel+json");
			});
		}
	};
	//#endregion
	//#region src/js/database/migrate/MigrateLocalStorageToIndexedDb.ts
	var MigrateLocalStorageToIndexedDb = {
		migrate(piskelDatabase) {
			const localStorageService = assertInitialized(app.localStorageService, "localStorageService");
			const migrationData = localStorageService.getKeys().map(function(key) {
				return {
					name: key.name,
					description: key.description,
					date: key.date,
					serialized: localStorageService.getPiskel(key.name)
				};
			});
			return new Promise(function(resolve) {
				const migrateSprite = function(index) {
					const data = migrationData[index];
					if (!data) {
						console.log("Data migration from local storage to indexed db finished.");
						console.log("Local storage piskels successfully migrated. Old copies will be deleted.");
						MigrateLocalStorageToIndexedDb.deleteLocalStoragePiskels();
						resolve();
					} else MigrateLocalStorageToIndexedDb.save_(piskelDatabase, data).then(function() {
						migrateSprite(index + 1);
					}).catch(function() {
						console.error("Failed to migrate local storage sprite for name: " + data.name);
						migrateSprite(index + 1);
					});
				};
				migrateSprite(0);
			});
		},
		save_(piskelDatabase, piskelData) {
			return piskelDatabase.get(piskelData.name).then(function(data) {
				if (typeof data !== "undefined") return piskelDatabase.update(piskelData.name, piskelData.description, piskelData.date, piskelData.serialized);
				else return piskelDatabase.create(piskelData.name, piskelData.description, piskelData.date, piskelData.serialized);
			});
		},
		deleteLocalStoragePiskels() {
			assertInitialized(app.localStorageService, "localStorageService").getKeys().forEach(function(key) {
				window.localStorage.removeItem("piskel." + key.name);
			});
			window.localStorage.removeItem("piskel.keys");
		}
	};
	//#endregion
	//#region src/js/database/PiskelDatabase.ts
	var _PiskelDatabase;
	var DB_NAME = "PiskelDatabase";
	var DB_VERSION = 1;
	var _requestPromise = function(req) {
		return new Promise(function(resolve, reject) {
			req.onsuccess = resolve;
			req.onerror = reject;
		});
	};
	var PiskelDatabase = class {
		constructor() {
			this.db = null;
		}
		init() {
			const request = window.indexedDB.open(DB_NAME, DB_VERSION);
			request.onupgradeneeded = this.onUpgradeNeeded_.bind(this);
			return _requestPromise(request).then((event) => {
				this.db = event.target.result;
				return this.db;
			});
		}
		onUpgradeNeeded_(event) {
			const db = event.target.result;
			this.db = db;
			const objectStore = db.createObjectStore("piskels", { keyPath: "name" });
			objectStore.transaction.oncomplete = () => {
				MigrateLocalStorageToIndexedDb.migrate(this);
			};
		}
		openObjectStore_() {
			return assertInitialized(this.db, "db").transaction(["piskels"], "readwrite").objectStore("piskels");
		}
		/**
		* Send a get request for the provided name.
		* Returns a promise that resolves the request event.
		*/
		get(name) {
			return _requestPromise(this.openObjectStore_().get(name)).then(function(event) {
				return event.target.result;
			});
		}
		/**
		* List all locally saved piskels.
		* Returns a promise that resolves an array of objects:
		* - name: name of the piskel
		* - description: description of the piskel
		* - date: save date
		*
		* The sprite content is not contained in the object and
		* needs to be retrieved with a separate get.
		*/
		list() {
			const piskels = [];
			const cursor = this.openObjectStore_().openCursor();
			return new Promise(function(resolve, reject) {
				cursor.onsuccess = function(event) {
					const cursor = event.target.result;
					if (cursor) {
						piskels.push({
							name: cursor.value.name,
							date: cursor.value.date,
							description: cursor.value.description
						});
						cursor.continue();
					} else resolve(piskels);
				};
				cursor.onerror = function() {
					reject();
				};
			});
		}
		/**
		* Send an put request for the provided args.
		* Returns a promise that resolves the request event.
		*/
		update(name, description, date, serialized) {
			const data = {
				name,
				serialized,
				date,
				description
			};
			return _requestPromise(this.openObjectStore_().put(data));
		}
		/**
		* Send an add request for the provided args.
		* Returns a promise that resolves the request event.
		*/
		create(name, description, date, serialized) {
			const data = {
				name,
				serialized,
				date,
				description
			};
			return _requestPromise(this.openObjectStore_().add(data));
		}
		/**
		* Delete a saved piskel for the provided name.
		* Returns a promise that resolves the request event.
		*/
		delete(name) {
			return _requestPromise(this.openObjectStore_().delete(name));
		}
	};
	_PiskelDatabase = PiskelDatabase;
	_PiskelDatabase.DB_NAME = DB_NAME;
	//#endregion
	//#region src/js/service/storage/IndexedDbStorageService.ts
	var IndexedDbStorageService = class {
		constructor(piskelController) {
			this.piskelController = piskelController;
			this.piskelDatabase = new PiskelDatabase();
		}
		init() {
			this.piskelDatabase.init().catch(function() {
				console.log("Failed to initialize PiskelDatabase, local browser saves will be unavailable.");
			});
		}
		save(piskel) {
			const name = piskel.getDescriptor().name;
			const description = piskel.getDescriptor().description;
			const date = Date.now();
			const serialized = Serializer.serialize(piskel);
			return this.save_(name, description, date, serialized);
		}
		save_(name, description, date, serialized) {
			return this.piskelDatabase.get(name).then((piskelData) => {
				if (typeof piskelData !== "undefined") return this.piskelDatabase.update(name, description, date, serialized);
				else return this.piskelDatabase.create(name, description, date, serialized);
			});
		}
		load(name) {
			return this.piskelDatabase.get(name).then(function(piskelData) {
				if (typeof piskelData !== "undefined") {
					const serialized = piskelData.serialized;
					Deserializer.deserialize(JSON.parse(String(serialized)), function(piskel) {
						assertInitialized(app.piskelController, "piskelController").setPiskel(piskel);
					});
				} else console.log("no local browser save found for name: " + name);
			});
		}
		remove(name) {
			return this.piskelDatabase.delete(name);
		}
		getKeys() {
			return this.piskelDatabase.list();
		}
	};
	//#endregion
	//#region src/js/service/storage/LocalStorageService.ts
	var LocalStorageService = class {
		constructor(piskelController) {
			if (piskelController === void 0) throw "Bad LocalStorageService initialization: <undefined piskelController>";
			this.piskelController = piskelController;
		}
		init() {}
		save(piskel) {
			const name = piskel.getDescriptor().name;
			const description = piskel.getDescriptor().description;
			const serialized = Serializer.serialize(piskel);
			if (assertInitialized(app.localStorageService, "localStorageService").getPiskel(name)) {
				if (!window.confirm("There is already a piskel saved as " + name + ". Overwrite ?")) return Promise.reject("Cancelled by user, \"" + name + "\" already exists");
			}
			try {
				this.removeFromKeys_(name);
				this.addToKeys_(name, description, Date.now());
				window.localStorage.setItem("piskel." + name, serialized);
				return Promise.resolve();
			} catch (e) {
				return Promise.reject(e instanceof Error ? e.message : String(e));
			}
		}
		load(name) {
			const piskelString = this.getPiskel(name);
			Deserializer.deserialize(JSON.parse(String(piskelString)), function(piskel) {
				assertInitialized(app.piskelController, "piskelController").setPiskel(piskel);
			});
		}
		remove(name) {
			this.removeFromKeys_(name);
			window.localStorage.removeItem("piskel." + name);
		}
		saveKeys_(keys) {
			window.localStorage.setItem("piskel.keys", JSON.stringify(keys));
		}
		removeFromKeys_(name) {
			const otherKeys = this.getKeys().filter(function(key) {
				return key.name !== name;
			});
			this.saveKeys_(otherKeys);
		}
		getKey_(name) {
			const matches = this.getKeys().filter(function(key) {
				return key.name === name;
			});
			if (matches.length > 0) return matches[0];
			else return null;
		}
		addToKeys_(name, description, date) {
			const keys = this.getKeys();
			keys.push({
				name,
				description,
				date
			});
			this.saveKeys_(keys);
		}
		getPiskel(name) {
			return window.localStorage.getItem("piskel." + name);
		}
		getKeys() {
			const keysString = window.localStorage.getItem("piskel.keys");
			return JSON.parse(String(keysString)) || [];
		}
	};
	//#endregion
	//#region src/js/service/storage/StorageService.ts
	var StorageService = class {
		constructor(piskelController) {
			this.piskelController = piskelController;
			this.savingFlag_ = false;
			this.onSaveSuccess_ = this.onSaveSuccess_.bind(this);
			this.onSaveError_ = this.onSaveError_.bind(this);
		}
		init() {
			const shortcuts = Shortcuts;
			assertInitialized(app.shortcutService, "shortcutService").registerShortcut(shortcuts.STORAGE.OPEN, this.onOpenKey_.bind(this));
			assertInitialized(app.shortcutService, "shortcutService").registerShortcut(shortcuts.STORAGE.SAVE, this.onSaveKey_.bind(this));
			assertInitialized(app.shortcutService, "shortcutService").registerShortcut(shortcuts.STORAGE.SAVE_AS, this.onSaveAsKey_.bind(this));
			$.subscribe(Events.BEFORE_SAVING_PISKEL, this.setSavingFlag_.bind(this, true));
			$.subscribe(Events.AFTER_SAVING_PISKEL, this.setSavingFlag_.bind(this, false));
		}
		isSaving() {
			return this.savingFlag_;
		}
		saveToLocalStorage(piskel) {
			return this.delegateSave_(app.localStorageService, piskel);
		}
		saveToIndexedDb(piskel) {
			return this.delegateSave_(app.indexedDbStorageService, piskel);
		}
		saveToFileDownload(piskel) {
			return this.delegateSave_(app.fileDownloadStorageService, piskel);
		}
		saveToDesktop(piskel, saveAsNew) {
			return this.delegateSave_(app.desktopStorageService, piskel, saveAsNew);
		}
		delegateSave_(delegatedService, piskel, saveAsNew) {
			if (this.savingFlag_) return Promise.reject("Already saving");
			$.publish(Events.BEFORE_SAVING_PISKEL);
			return assertInitialized(delegatedService, "delegatedService").save(piskel, saveAsNew).then(this.onSaveSuccess_, this.onSaveError_);
		}
		onOpenKey_() {
			if (Environment.detectNodeWebkit()) assertInitialized(app.desktopStorageService, "desktopStorageService").openPiskel();
		}
		onSaveKey_() {
			if (Environment.detectNodeWebkit()) this.saveToDesktop(this.piskelController.getPiskel());
			else window.setTimeout(() => {
				this.saveToIndexedDb(this.piskelController.getPiskel());
			}, 0);
		}
		onSaveAsKey_() {
			if (Environment.detectNodeWebkit()) this.saveToDesktop(this.piskelController.getPiskel(), true);
		}
		onSaveSuccess_() {
			$.publish(Events.SHOW_NOTIFICATION, [{
				content: "Successfully saved !",
				hideDelay: 3e3
			}]);
			$.publish(Events.PISKEL_SAVED);
			this.afterSaving_();
		}
		onSaveError_(errorMessage) {
			let errorText = "Saving failed";
			if (errorMessage) errorText += " : " + errorMessage;
			$.publish(Events.SHOW_NOTIFICATION, [{
				content: errorText,
				hideDelay: 1e4
			}]);
			this.afterSaving_();
			return Promise.reject(errorMessage);
		}
		afterSaving_() {
			$.publish(Events.AFTER_SAVING_PISKEL);
		}
		setSavingFlag_(savingFlag) {
			this.savingFlag_ = savingFlag;
		}
	};
	//#endregion
	//#region src/js/main.ts
	function initTooltips_() {
		$("body").tooltip({ selector: "[rel=tooltip]" });
	}
	function init() {
		app.sessionId = Uuid.generate();
		const shortcutService = new ShortcutService();
		app.shortcutService = shortcutService;
		shortcutService.init();
		const size = DefaultSizeController.getDefaultSize();
		const fps = Constants.DEFAULT.FPS;
		const descriptor = new Descriptor("New Piskel", "");
		const piskel = new Piskel(size.width, size.height, fps, descriptor);
		const layer = new Layer("Layer 1");
		const frame = new Frame(size.width, size.height);
		layer.addFrame(frame);
		piskel.addLayer(layer);
		const corePiskelController = new PiskelController(piskel);
		app.corePiskelController = corePiskelController;
		corePiskelController.init();
		const piskelController = new PublicPiskelController(corePiskelController);
		app.piskelController = piskelController;
		piskelController.init();
		const paletteImportService = new PaletteImportService();
		app.paletteImportService = paletteImportService;
		paletteImportService.init();
		const paletteService = new PaletteService();
		app.paletteService = paletteService;
		paletteService.addDynamicPalette(new CurrentColorsPalette());
		const selectedColorsService = new SelectedColorsService();
		app.selectedColorsService = selectedColorsService;
		selectedColorsService.init();
		const mouseStateService = new MouseStateService();
		app.mouseStateService = mouseStateService;
		mouseStateService.init();
		const paletteController = new PaletteController();
		app.paletteController = paletteController;
		paletteController.init();
		const currentColorsService = new CurrentColorsService(piskelController);
		app.currentColorsService = currentColorsService;
		currentColorsService.init();
		const palettesListController = new PalettesListController(currentColorsService);
		app.palettesListController = palettesListController;
		palettesListController.init();
		const cursorCoordinatesController = new CursorCoordinatesController(piskelController);
		app.cursorCoordinatesController = cursorCoordinatesController;
		cursorCoordinatesController.init();
		const drawingController = new DrawingController(piskelController, Dom.getElement("#drawing-canvas-container"));
		app.drawingController = drawingController;
		drawingController.init();
		const previewController = new PreviewController(piskelController, Dom.getElement("#animated-preview-canvas-container"));
		app.previewController = previewController;
		previewController.init();
		const minimapController = new MinimapController(piskelController, previewController, drawingController, Dom.getElement(".minimap-container"));
		app.minimapController = minimapController;
		minimapController.init();
		const framesListController = new FramesListController(piskelController, Dom.getElement("#preview-list-wrapper"));
		app.framesListController = framesListController;
		framesListController.init();
		const layersListController = new LayersListController(piskelController);
		app.layersListController = layersListController;
		layersListController.init();
		const settingsController = new SettingsController(piskelController);
		app.settingsController = settingsController;
		settingsController.init();
		const dialogsController = new DialogsController(piskelController);
		app.dialogsController = dialogsController;
		dialogsController.init();
		const toolController = new ToolController();
		app.toolController = toolController;
		toolController.init();
		const selectionManager = new SelectionManager(piskelController);
		app.selectionManager = selectionManager;
		selectionManager.init();
		const historyService = new HistoryService(piskelController);
		app.historyService = historyService;
		historyService.init();
		const notificationController = new NotificationController();
		app.notificationController = notificationController;
		notificationController.init();
		const transformationsController = new TransformationsController();
		app.transformationsController = transformationsController;
		transformationsController.init();
		const progressBarController = new ProgressBarController();
		app.progressBarController = progressBarController;
		progressBarController.init();
		const canvasBackgroundController = new CanvasBackgroundController();
		app.canvasBackgroundController = canvasBackgroundController;
		canvasBackgroundController.init();
		const indexedDbStorageService = new IndexedDbStorageService(piskelController);
		app.indexedDbStorageService = indexedDbStorageService;
		indexedDbStorageService.init();
		const localStorageService = new LocalStorageService(piskelController);
		app.localStorageService = localStorageService;
		localStorageService.init();
		const fileDownloadStorageService = new FileDownloadStorageService();
		app.fileDownloadStorageService = fileDownloadStorageService;
		fileDownloadStorageService.init();
		const desktopStorageService = new DesktopStorageService(piskelController);
		app.desktopStorageService = desktopStorageService;
		desktopStorageService.init();
		const storageService = new StorageService(piskelController);
		app.storageService = storageService;
		storageService.init();
		const importService = new ImportService(piskelController);
		app.importService = importService;
		importService.init();
		const savedStatusService = new SavedStatusService(piskelController, historyService);
		app.savedStatusService = savedStatusService;
		savedStatusService.init();
		const backupService = new BackupService(piskelController);
		app.backupService = backupService;
		backupService.init();
		const beforeUnloadService = new BeforeUnloadService(piskelController);
		app.beforeUnloadService = beforeUnloadService;
		beforeUnloadService.init();
		const headerController = new HeaderController(piskelController, savedStatusService);
		app.headerController = headerController;
		headerController.init();
		const penSizeService = new PenSizeService();
		app.penSizeService = penSizeService;
		penSizeService.init();
		const penSizeController = new PenSizeController();
		app.penSizeController = penSizeController;
		penSizeController.init();
		const fileDropperService = new FileDropperService(piskelController);
		app.fileDropperService = fileDropperService;
		fileDropperService.init();
		const userWarningController = new UserWarningController(piskelController);
		app.userWarningController = userWarningController;
		userWarningController.init();
		const performanceReportService = new PerformanceReportService(piskelController, currentColorsService);
		app.performanceReportService = performanceReportService;
		performanceReportService.init();
		const clipboardService = new ClipboardService(piskelController);
		app.clipboardService = clipboardService;
		clipboardService.init();
		const drawingLoop = new DrawingLoop();
		app.drawingLoop = drawingLoop;
		drawingLoop.addCallback(render, void 0);
		drawingLoop.start();
		initTooltips_();
		$.subscribe(Events.EXTERNAL_PISKEL_READY, function() {
			const externalPiskel = window._externalPiskel;
			if (!externalPiskel) {
				console.error("No external piskel found");
				return;
			}
			Deserializer.deserialize(externalPiskel, (piskel) => {
				piskelController.setPiskel(piskel);
			});
		});
		if (Environment.detectNodeWebkit() && UserAgent.isMac) {
			const gui = window.require("nw.gui");
			const mb = new gui.Menu({ type: "menubar" });
			mb.createMacBuiltin("Piskel");
			gui.Window.get().menu = mb;
		}
		if (!Environment.isIntegrationTest() && UserAgent.isUnsupported()) $.publish(Events.DIALOG_SHOW, { dialogId: "unsupported-browser" });
		function render(delta) {
			drawingController.render();
			previewController.render(delta);
			framesListController.render();
		}
		app.getFirstFrameAsPng = function() {
			const frame = LayerUtils.mergeFrameAt(piskelController.getLayers(), 0);
			let canvas;
			if (frame instanceof RenderedFrame) canvas = CanvasUtils.createFromImage(frame.getRenderedFrame());
			else canvas = FrameUtils.toImage(frame);
			return canvas.toDataURL("image/png");
		};
		app.getFramesheetAsPng = function() {
			return new PiskelRenderer(piskelController).renderAsCanvas().toDataURL("image/png");
		};
	}
	app.init = init;
	//#endregion
})();

//# sourceMappingURL=_app.js.map
//# sourceMappingURL=piskel-packaged-2026-11-23-01-47.js.map