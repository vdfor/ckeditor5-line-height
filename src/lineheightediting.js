import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import LineHeightCommand from './lineheightcommand';
import { upcastElementToAttribute } from '@ckeditor/ckeditor5-engine/src/conversion/upcast-converters';
import { normalizeOptions, buildDefinition } from './utils';

const LINE_HEIGHT = 'lineHeight';

export default class LineHeightEditing extends Plugin {
	constructor( editor ) {
		super( editor );

		editor.config.define( LINE_HEIGHT, {
			options: [
				'1',
				'1.25',
				'1.5',
				'1.75',
				'2',
				'2.25',
				'2.5'
			]
		} );
	}

	/**
	 * @inheritDoc
	 */
	init() {
		const editor = this.editor;

		// Allow LineHeight attribute on text nodes.
		editor.model.schema.extend('$text', { allowAttributes: LINE_HEIGHT });

		// Define view to model conversion.
		const options = normalizeOptions(this.editor.config.get('lineHeight.options')).filter(item => item.model);
		const definition = buildDefinition(LINE_HEIGHT, options);

		// Set-up the two-way conversion.
		editor.conversion.attributeToElement(definition);

		editor.conversion.for('upcast')
			.add(upcastElementToAttribute({
				view: {
					name: 'span',
					styles: {
						'line-height': /^\d+(.\d+)?$/ // 非负浮点数
					}
				},
				model: {
					key: LINE_HEIGHT,
					value: viewElement => {
						const lineHeight = viewElement.getStyle('line-height');
						return lineHeight;
					}
				}
			}));

		// Add LineHeight command.
		editor.commands.add(LINE_HEIGHT, new LineHeightCommand(editor));
	}
}
