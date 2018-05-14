// External
import React from 'react';
import Waypoint from 'react-waypoint';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

// Internal
import Chapter from '../../containers/chapter';
import styles from './styles.scss';

function documentHeight() {
	const body = document.body;
	return Math.max( body.scrollHeight, body.offsetHeight );
}

const SingleReference = React.createClass( {
	handleWaypointEnter( event ) {
		if ( event.previousPosition === 'above' ) {
			this.props.setScrollChapterPrevious();
			this.props.addPreviousChapter();
		}
	},

	handleWaypointLeave( event ) {
		if ( event.currentPosition === 'above' ) {
			this.props.setScrollChapterNext();
			this.props.addNextChapter();
		}
	},

	render() {
		return (
			<div>
				<Waypoint onEnter={ this.handleWaypointEnter } onLeave={ this.handleWaypointLeave } />
				<h1 id={ this.props.book + '_' + this.props.chapter } className={ styles.heading }>{ this.props.book } { this.props.chapter }</h1>
				<div className="chapter">
					<Chapter book={ this.props.book } chapter={ this.props.chapter } highlightWord={ this.props.highlightWord } />
				</div>
			</div>
		);
	}
} );

export default withStyles( styles )( SingleReference );
