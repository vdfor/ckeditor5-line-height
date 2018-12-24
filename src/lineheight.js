import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import LineHeightEditing from './lineheight/lineheightediting';
import LineHeightUI from './lineheight/lineheightui';

export default class LineHeight extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get requires() {
		return [ LineHeightEditing, LineHeightUI ];
	}

	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'LineHeight';
	}
}
