// External dependencies
import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

// Internal dependencies
import Search from '../../containers/search';
import styles from './styles.scss';

const SearchTray = () => (
	<div className={ styles.tray }>
		<div id="referenceTracking">
			<Search />
			<div className="searchResults"></div>
		</div>
	</div>
);

SearchTray.propTypes = {};

export default withStyles( styles )( SearchTray );
