/**
 * WordPress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import * as inlineImage from './inline-image';

export const registerCoreInlineBlocks = () => {
	[
		inlineImage,
	].forEach( ( { name, settings } ) => {
		registerBlockType( name, settings );
	} );
};
