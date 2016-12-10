/*global javascripture*/
var createSearchReferencesPanel, createTrackingBoxId, searchOnClick, startDate, searchHelperFunction;

( function ( $ ) {
	$.fn.serializeObject = function () {
		var o = {},
			a = this.serializeArray();
		$.each(a, function () {
			if (o[this.name] !== undefined) {
				if (!o[this.name].push) {
					o[this.name] = [o[this.name]];
				}
				o[this.name].push(this.value || '');
			} else {
				o[this.name] = this.value || '';
			}
		});
		return o;
	};

	createSearchReferencesPanel = function( data, target ) {
		startDate = new Date();

		if ( data.word ) {
			data.word = data.word.trim();
		}
		if ( data.lemma ) {
			data.lemma = data.lemma.trim();
		}
		if ( data.morph ) {
			data.morph = data.morph.trim();
		}

		if ( 'undefined' === typeof data.clusivity ) {
			data.clusivity = 'exclusive';
		}


		var strongsNumberAsId;
		if ( data.lemma ) {
			strongsNumberAsId = data.lemma.replace( / /gi, "" );
		}
		var trackingBoxId = createTrackingBoxId( data, '_' );

		var targetElement = '#referenceTracking';
		if ( target === 'word' ) {
			targetElement = '#wordDetailsPanel';
		}

		createTrackingBox( data, targetElement );
		strongsNumberArray = [];
		if ( data.lemma ) {
			data.lemma.split(' ');
		}

		//collapse all the others
		$( targetElement + ' .collapsable' ).addClass('closed');
		$( targetElement + ' #' + trackingBoxId ).removeClass('closed');

		// Send data to our worker.
		worker.postMessage( {
			task: 'search',
			parameters: data
		} );

		return trackingBoxId;
	};

	var createReferenceList = function(referenceArray) {
		var referenceList = "";
		$.each(referenceArray, function(index, value){
			referenceList += createReferenceListItem(value);
		});
		return referenceList;
	};


	function createTrackingBoxString( data, separator ) {
		var string = '';
		if ( data.word ) {
			string += data.word.replace( / /gi, separator );
		}
		if ( data.lemma ) {
			string += separator + data.lemma.replace( / /gi, separator );
			if ( javascripture.data.strongsDictionary[ data.lemma ] ) {
				string += separator + javascripture.modules.hebrew.stripPointing( javascripture.data.strongsDictionary[ data.lemma ].lemma );
			}
		}
		if ( data.morph ) {
			string += separator + data.morph.replace( / /gi, separator );
		}
		return string;
	}

	createTrackingBoxId = function( data ) {
		var string = '';
		$.each( data, function ( key, value ) {
			if ( value && typeof value === 'string' && value !== '' ) {
				string += value.replace( / /gi, '_' ) + '_';
			}
		} );
		return string;
	}

	function getStrongsTracking( trackingBoxId, family, data, title, header ) {
		var strongsTracking = '';
		strongsTracking += '<div class="collapsable" id="' + trackingBoxId + '" class="' + family + '-family ' + data.lemma + '"><style></style><h2 class="' + family + '-family ' + data.lemma + '" title="' + title + '">' + header;
		strongsTracking += '<a aria-hidden="true" class="icon-cross remove"></a></h2><div class="reference-tracking-panel"><div class="wordDetails"></div><div class="referenceList"><div id="searchLoading">Searching...</div></div></div></div>';
		return strongsTracking;
	}

	function createTrackingBox( data, targetElement ) {
		var trackingBoxId = createTrackingBoxId( data );
		var strongsTracking = '';
		if( $('#'+trackingBoxId).length === 0 ) {
			var header = createTrackingBoxString( data, ' ' ),
			    family = '',
			    familyInt = '',
				title = '';
			if ( data.lemma ) {
				family = javascripture.api.word.getFamily( data.lemma);
				familyInt = parseFloat( family.substring( 1, family.length ), 10 );
			}
			$.each( data, function ( key, value ) {
				title += key + ': ' + value + '\r\n';
			} );

			strongsTracking = getStrongsTracking( trackingBoxId, family, data, title, header );

			$( targetElement + ' .searchResults' ).append( strongsTracking );
			if ( data.lemma ) {

				var strongsStyle = '';
				if(familyInt > 0) {
					strongsStyle = javascripture.modules.colors.getStrongsStyle( data.lemma );
				}

				if(familyInt > 0) {
					$('#' + trackingBoxId + ' style').html(strongsStyle);
				}
			}
        }
	}

	function createReferenceListItem(referenceArray) {
		var book = referenceArray.book;
		var chapter = referenceArray.chapter;
		var verse = referenceArray.verse;
		var result = '<li>';
		result += '<a href="#' + javascripture.modules.reference.createReferenceLink( referenceArray ) + '">'+book+' '+(chapter)+':'+(verse)+'</a><br />';
		//result += createSnippet( referenceArray.snippet );
		result += '</li>';
		return result;
	}

	function createSnippet( snippet ) {
		var result = '';
		snippet.forEach( function( word ) {
			result += word[ 0 ] + ' ';
		} );
		return  result;
	}

	searchOnClick = function( element, target ) {
		// Deep copy the data from the element
		var searchParameters = jQuery.extend(true, {}, $( element ).data());
		searchParameters.word = '';
		searchParameters.morph = '';
		searchParameters.lemma = searchParameters.lemma.replace('G3588 ','');
		return createSearchReferencesPanel( searchParameters, target );
	}

	// Search parameters are clusivity, family, language, lemma, morph, range, word
	searchHelperFunction = function( searchParameters, target ) {
		searchParameters.lemma = searchParameters.lemma.replace('G3588 ','');
		javascripture.reactHelpers.dispatch( javascripture.reactHelpers.setTrayVisibilityFilter( target ) );
		return createSearchReferencesPanel( searchParameters, target );
	}

	worker.addEventListener('message', function(e) {
		if( e.data.task === 'search' ) {
			var referenceArray = e.data.result;

			var references = '<form><ol class="references">';
			var wordCount = 0;
			var trackingBoxId = createTrackingBoxId( e.data.parameters, '_' );

			var searchObject = javascripture.data.english;
			if($("select[name=searchLanguage]").val() === "hebrew") {
				searchObject = javascripture.data.hebrew;
				$.each(strongsNumberArray, function(index, strongsNumber) {
					if(parseFloat(strongsNumber.substring(1, strongsNumber.length)) > 0) { //this is a number
						strongsNumberArray[index] = strongsNumber.substring(2, strongsNumber.length); //strip off the H and the 0 for hebrew searches
					}
				});
			}

			if ( referenceArray.length > 0 ) {
				references += createReferenceList( referenceArray );
			} else {
				references += 'No results';
			}
			references += '</ol></form>';

			if( $( '#' + trackingBoxId + ' form' ).length <= 0 ) {
				$( '#' + trackingBoxId + ' .referenceList' ).html( references );
			}

			if( ! $('#referenceTracking').hasClass('top') ) {
				$('#searchPanelLink').click();
			}

			var endDate = new Date();
			timer(startDate, endDate);
		}
	}, false);

} )( jQuery );

javascripture.modules.createSearchReferencesPanel = createSearchReferencesPanel;
