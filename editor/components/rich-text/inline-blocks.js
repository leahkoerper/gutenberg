/**
 * WordPress dependencies
 */
import { Component, Fragment, compose, renderToString } from '@wordpress/element';
import { withSelect, withDispatch } from '@wordpress/data';
import { withSafeTimeout } from '@wordpress/components';
import { getRectangleFromRange } from '@wordpress/dom';
import { getBlockType } from '@wordpress/blocks';

class InlineBlocks extends Component {
	constructor() {
		super( ...arguments );

		this.onSave = this.onSave.bind( this );
		this.getInsertPosition = this.getInsertPosition.bind( this );
	}

	componentDidMount() {
		const { setTimeout, setInsertAvailable } = this.props;

		// When moving between two different RichText with the keyboard, we need to
		// make sure `setInsertAvailable` is called after `setInsertUnavailable`
		// from previous RichText so that editor state is correct
		setTimeout( setInsertAvailable );
	}

	componentWillUnmount() {
		this.props.setInsertUnavailable();
	}

	getInsertPosition() {
		const { containerRef, editor } = this.props;

		// The container is relatively positioned.
		const containerPosition = containerRef.current.getBoundingClientRect();
		const rect = getRectangleFromRange( editor.selection.getRng() );

		return {
			top: rect.top - containerPosition.top,
			left: rect.right - containerPosition.left,
			height: rect.height,
		};
	}

	onSave( { save } ) {
		return ( attributes ) => {
			const {
				editor,
				completeInsert,
			} = this.props;

			if ( attributes ) {
				editor.insertContent( renderToString( save( attributes ) ) );
			}

			completeInsert();
		};
	}

	render() {
		const { isInlineInsertionPointVisible, inlineBlockForInsert } = this.props;
		const type = getBlockType( inlineBlockForInsert );

		return (
			<Fragment>
				{ isInlineInsertionPointVisible &&
					<div
						style={ { position: 'absolute', ...this.getInsertPosition() } }
						className="blocks-inline-insertion-point"
					/>
				}
				{ type &&
					<type.edit onSave={ this.onSave( type ) } />
				}
			</Fragment>
		);
	}
}

export default compose( [
	withSelect( ( select ) => {
		const {
			isInlineInsertionPointVisible,
			getInlineBlockForInsert,
		} = select( 'core/editor' );

		return {
			isInlineInsertionPointVisible: isInlineInsertionPointVisible(),
			inlineBlockForInsert: getInlineBlockForInsert(),
		};
	} ),
	withDispatch( ( dispatch ) => {
		const {
			setInlineInsertAvailable,
			setInlineInsertUnavailable,
			completeInlineInsert,
		} = dispatch( 'core/editor' );

		return {
			setInsertAvailable: setInlineInsertAvailable,
			setInsertUnavailable: setInlineInsertUnavailable,
			completeInsert: completeInlineInsert,
		};
	} ),
	withSafeTimeout,
] )( InlineBlocks );
