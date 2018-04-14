// External dependencies
import React, { PropTypes } from 'react';

import strongsColor from '../strongs-color.js';

const WordHighlight = React.createClass( {
	render() {
		return (
			<style>
				{ this.props.word.split('/').map( word => (
					'.' + word + ' { background: ' + strongsColor.get( word.slice( 1 ) ) + '; color: white; margin: 0 -3px; padding: 0 3px; }'
				) ) }
			</style>
		);
	}
} );

WordHighlight.propTypes = {};

export default WordHighlight;