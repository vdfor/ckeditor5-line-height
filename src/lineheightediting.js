import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import LineHeightCommand from './lineheightcommand';
import { normalizeOptions, buildDefinition } from './utils';

const LINE_HEIGHT = 'lineHeight';

export default class LineHeightEditing extends Plugin {
	constructor( editor ) {
		super( editor );

		editor.config.define( LINE_HEIGHT, {
			options: [
				1,
				1.25,
				1.5,
				1.75,
				2
			]
		} );

		// Define view to model conversion.
		const options = normalizeOptions( this.editor.config.get( 'lineHeight.options' ) ).filter( item => item.model );
		const definition = buildDefinition( LINE_HEIGHT, options );

		// Set-up the two-way conversion.
		editor.conversion.attributeToElement( definition );

		// Add LineHeight command.
		editor.commands.add( LINE_HEIGHT, new LineHeightCommand( editor ) );
	}

	/**
	 * @inheritDoc
	 */
	init() {
		const editor = this.editor;

		// Allow LineHeight attribute on text nodes.
		editor.model.schema.extend( '$text', { allowAttributes: LINE_HEIGHT } );
	}
}
