// External
import mousetrap from 'mousetrap';
import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

// Internal
import styles from './styles.scss';
import WordTray from './word';
import GotoTray from './goto';
import SearchTray from './search';
import BookmarksTray from './bookmarks';
import SettingsTray from './settings';

function getComponent( componentString ) {
	switch ( componentString ) {
		case 'WordTray':
			return <WordTray />

		case 'GotoTray':
			return <GotoTray />

		case 'SearchTray':
			return <SearchTray />

		case 'BookmarksTray':
			return <BookmarksTray />

		case 'SettingsTray':
			return <SettingsTray />
	}
}

class TrayList extends React.Component{
	goToNextCurrentVerse() {
		this.props.goToReference( this.props.nextReference );
		this.props.markNextCurrentReference();
	}

	goToPreviousCurrentVerse() {
		this.props.goToReference( this.props.previousReference );
		this.props.markPreviousCurrentReference();
	}

	componentDidMount() {
		mousetrap.bind( [ '=' ], () => this.goToNextCurrentVerse( false ) );
		mousetrap.bind( [ '-' ], () => this.goToPreviousCurrentVerse( false ) );
	}

	componentWillUnmount() {
		mousetrap.unbind( [ '=' ], () => this.goToNextCurrentVerse( false ) );
		mousetrap.unbind( [ '-' ], () => this.goToPreviousCurrentVerse( false ) );
	}

	render() {
		const { trays, filter, onTrayClick } = this.props;

		return (
			<div>
				{ trays.map( tray =>
					<div
						key={ tray.id }
						className={ tray.visible ? styles.visible : styles.hidden }
						{ ...tray }
					>
						{ getComponent( tray.component ) }
					</div>
				) }
			</div>
		);
	}
};

TrayList.propTypes = {
	trays: PropTypes.arrayOf(PropTypes.shape({
		id: PropTypes.string.isRequired,
		visible: PropTypes.bool.isRequired,
		text: PropTypes.string.isRequired
	}).isRequired).isRequired
};

export default withStyles( styles )( TrayList );
