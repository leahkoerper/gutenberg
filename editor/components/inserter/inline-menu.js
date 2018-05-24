/**
 * WordPress dependencies
 */
import { Component, Fragment } from '@wordpress/element';
import { PanelBody } from '@wordpress/components';
import { registerCoreInlineBlocks } from '../../../core-inline-blocks';
import { getInlineBlockTypes } from '../../../inline-blocks';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import ItemList from './item-list';

// TODO: move this to lib/client-assets.php
registerCoreInlineBlocks();

export default class InserterInlineMenu extends Component {
	render() {
		const inlineBlocks = getInlineBlockTypes();

		return (
			<Fragment>
				<PanelBody
					key={ 'inline-blocks' }
					title={ __( 'Inline Blocks' ) }
					opened={ true }
				>
					<ItemList items={ inlineBlocks } onSelect={ this.props.onSelect } onHover={ () => {} } />
				</PanelBody>
			</Fragment>
		);
	}
}
