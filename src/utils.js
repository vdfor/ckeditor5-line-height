function getOptionDefinition(option) {
	if (typeof option === 'object') {
		return option;
	}

	// 'Default' lineHeight. It will be used to remove the lineHeight attribute.
	if (option === 'default') {
		return {
			model: undefined,
			title: 'Default'
		};
	}

	// At this stage we probably have numerical value to generate a preset so parse it's value.
	const sizePreset = parseFloat(option);

	// Discard any faulty values.
	if (isNaN(sizePreset)) {
		return;
	}

	return generatePixelPreset(sizePreset);
}

function generatePixelPreset(size) {
	const sizeName = String(size);

	return {
		title: sizeName,
		model: size,
		view: {
			name: 'span',
			styles: {
				'line-height': size
			},
			priority: 5
		}
	};
}

export function normalizeOptions(configuredOptions) {
	return configuredOptions.map(getOptionDefinition).filter(option => !!option);
}

export function buildDefinition( modelAttributeKey, options ) {
	const definition = {
		model: {
			key: modelAttributeKey,
			values: []
		},
		view: {},
		upcastAlso: {}
	};

	for ( const option of options ) {
		definition.model.values.push( option.model );
		definition.view[ option.model ] = option.view;

		if ( option.upcastAlso ) {
			definition.upcastAlso[ option.model ] = option.upcastAlso;
		}
	}

	return definition;
}
