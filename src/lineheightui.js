import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import Model from '@ckeditor/ckeditor5-ui/src/model';
import Collection from '@ckeditor/ckeditor5-utils/src/collection';

import { createDropdown, addListToDropdown } from '@ckeditor/ckeditor5-ui/src/dropdown/utils';
import { normalizeOptions } from './utils';

import lineHeightIcon from '../theme/line-height.svg';

export default class LineHeightUI extends Plugin {
	/**
	 * @inheritDoc
	 */
	init() {
		const editor = this.editor;
		const t = editor.t;

		const options = this._getLocalizedOptions();

		const command = editor.commands.get('lineHeight');

		// Register UI component.
		editor.ui.componentFactory.add('lineHeight', locale => {
			const dropdownView = createDropdown(locale);
			addListToDropdown(dropdownView, _prepareListOptions(options, command));

			// Create dropdown model.
			dropdownView.buttonView.set({
				label: t('Line Height'),
				icon: lineHeightIcon,
				tooltip: true
			});

			dropdownView.extendTemplate({
				attributes: {
					class: [
						'vdfor-ck-line-height-dropdown'
					]
				}
			});

			dropdownView.bind('isEnabled').to(command);

			// Execute command when an item from the dropdown is selected.
			this.listenTo(dropdownView, 'execute', evt => {
				editor.execute(evt.source.commandName, { value: evt.source.commandParam });
				editor.editing.view.focus();
			});

			return dropdownView;
		});
	}

	_getLocalizedOptions() {
		const editor = this.editor;
		const t = editor.t;

		const localizedTitles = {
			Default: t('Default')
		};

		const options = normalizeOptions(editor.config.get('lineHeight.options'));

		return options.map(option => {
			const title = localizedTitles[option.title];

			if (title && title != option.title) {
				// Clone the option to avoid altering the original `namedPresets` from `./utils.js`.
				option = Object.assign({}, option, { title });
			}

			return option;
		});
	}
}

// Prepares LineHeight dropdown items.
function _prepareListOptions(options, command) {
	const itemDefinitions = new Collection();

	for (const option of options) {
		const def = {
			type: 'button',
			model: new Model({
				commandName: 'lineHeight',
				commandParam: option.model,
				label: option.title,
				class: 'vador-ck-line-height-option',
				withText: true
			})
		};

		if (option.view && option.view.classes) {
			def.model.set('class', `${def.model.class} ${option.view.classes}`);
		}

		def.model.bind('isOn').to(command, 'value', value => {
			const newValue = value ? parseFloat(value) : value;
			return newValue === option.model;
		});

		// Add the option to the collection.
		itemDefinitions.add(def);
	}

	return itemDefinitions;
}
