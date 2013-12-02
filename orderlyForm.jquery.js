/**
 * OrderlyForm - Rob Huzzey <robert.huzzey@holidayextras.com>
 * @description Forces the user to fill in a form in the order you require
 * @description Adds a class and/or disables inputs (depending on how you pass options in)
 * @usage 	$( "#formId" ).orderlyForm({
				"elements" : elements, // See code comments for example
				"className" : "greyedOut"
			});
 * 
 */

(function ( $ ) {
	$.fn.orderlyForm = function( options ) {

		var settings = $.extend({
			// This is purely for documentations sake, just an example "elements" object
			"elements" : [
				{ 
					"selector" : "#firstThing",
					"event" : "change"
				},
				{
					"selector" : ".secondThing", // The element you want to be listening to
					"event" : "blur", // Which event the listener should listen to
					"selectorForStyle" : ".wrapperOfSecondThing", // We want to style the outer container in this case
					"disabled" : true, // Do you want this element to be disabled until ready to use?
					"trigger" : "secondThingIsReady" // The event to fire when this element is ready to interact with.
				},
				{ 
					"selector" : "button.thirdThing",
					"event" : "click",
					"disabled" : true,
					"trigger" : "thirdThingIsReady"
				}
			],
			"className" : "queuedUpButNotReadyYet"
		}, options );

		// Loop over each form, there could be many.
		return this.each( function() {

			// It's a lot easier dealing with "this" when it's "self" ;)
			var $self = $( this );

			// Go over each of our elements & attach event listeners etc for each form
			for( var i = 0, len = settings.elements.length; i < len; i++ ) {
				// Needs a closure here to preserve item scope
				(function( i ) {

					// Storing the jQuery selectors to save on jumping up & down the DOM.
					var $currentItem = $( settings.elements[i].selector, $self );
					// I don't like this naming... however, we may want to style a different element to the one we are listening to.
					var $currentVisualItem = $( settings.elements[i].selectorForStyle || settings.elements[i].selector, $self );
					
					// Set the state for each of our elements (or "style" element if we are modifying a different element than the one we're listening on)
					// We wouldn't want the first item to be affected, should add this as an option we pass in later.
					if( i > 0 ) {
						if( settings.elements[i].disabled ) {
							$currentItem.attr( "disabled", "disabled" );
						}
						
						if( settings.className ) {
							$currentVisualItem.addClass( settings.className );
						}
					}

					// As this is a queuing system, we need to know the next item
					// (order determined by the array order of elements object passed in).
					var nextElement = settings.elements[i + 1] || null;

					// This may be the last item in the list (no next item)... no need to do anything if so.
					if( nextElement ) {
						// Storing the jQuery selectors to save on jumping up & down the DOM.
						var $nextItem = $( nextElement.selector, $self );
						// I don't like this naming... however, we may want to style a different element to the one we are listening to.
						var $nextVisualItem = $( nextElement.selectorForStyle || nextElement.selector, $self );

						// Ok, so here we are listening on our element for the event specified
						// and then interacting with the next element in our list.
						$currentItem.on( settings.elements[i].event, function() {
							
							if( nextElement.trigger ) {
								$nextItem.trigger( nextElement.trigger );
							}
							
							if( nextElement.disabled ) {
								$nextItem.removeAttr( "disabled" );
							}

							if( settings.className ) {
								$nextVisualItem.removeClass( settings.className );
							}
						});
					}

				})( i );
			}
		} );

	};
}( jQuery ));