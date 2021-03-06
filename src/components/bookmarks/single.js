// External dependencies
import React, { useRef } from 'react';
import { useDispatch } from 'react-redux';

// Internal dependencies
import { removeBookmark, toggleBookmark } from '../../actions';
import ReferenceText from '../reference-text';
import { createReferenceLink } from '../../lib/reference.js';
import Collapsible from '../collapsible';
import ReferenceLink from '../reference-link';

const getCrossReferences = ( reference ) => {
	if ( ! reference ) {
		return [];
	}
	const bookId = bible.getBookId( reference.book );
	const referenceString = bible.Data.books[ bookId - 1 ][ 1 ] + '.' + reference.chapter + '.' + reference.verse;
	return crossReferences[ referenceString ] ? crossReferences[ referenceString ] : [];
};

const getReferenceFromCrossReference = ( referenceString ) => {
	const referenceArray = referenceString.split('.'),
	bookId = bible.getBookId( referenceArray[0] ),
	referenceObject = {
		book: bible.Data.books[bookId - 1][0],
		chapter: referenceArray[1],
		verse: referenceArray[2]
	};
	return referenceObject;
};

const Single = ( { bookmark, index } ) => {
	const bookmarkRef = useRef();
	const dispatch = useDispatch();

	const handleToggle = () => {
		dispatch( toggleBookmark( bookmark ) );
	};

	const crossReferences = getCrossReferences( bookmark );

	const header = (
		<ReferenceLink reference={ bookmark } />
	);

	return (
		<Collapsible
			key={ index }
			header={ header }
			open={ bookmark.open }
			onToggle={ () => handleToggle() }
			textToCopy={ bookmarkRef }
			onRemove={ () => dispatch( removeBookmark( bookmark ) ) }
		>
			<div ref={ bookmarkRef }>
				{ crossReferences.length > 0 ? 'Cross references:' : 'No cross references' }
				{ crossReferences.map( ( reference, index2 ) => {
					const referenceSections = reference.split('-');
					const referenceArrays = referenceSections.map( ( referenceSection ) => getReferenceFromCrossReference( referenceSection ) );

					return (
						<div key={ index2 }>
							<a href={ '#' + createReferenceLink( referenceArrays[ 0 ] ) }>
								{ index2 + 1 }. <ReferenceText reference={ referenceArrays[ 0 ] } />
								{ referenceArrays[ 1 ] && ( <span> - <ReferenceText reference={ referenceArrays[ 1 ] } /></span> ) }
							</a>
						</div>
					);
				} ) }
			</div>
		</Collapsible>
	);
};

export default Single;
