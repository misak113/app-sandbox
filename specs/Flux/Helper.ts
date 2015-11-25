
import EnumStatic from '../../src/Flux/EnumStatic';
import {normalize} from 'path';
/* tslint:disable */
require('coffee-script').register();
var paths = require('../../../../gulp/config/paths');
/* tslint:enable */

const baseSrcPath = normalize(paths.dist + '/js/src/');

export function getActionCreatorStatic<ActionName>(
	absoluteActionName: string,
	actionNameStatic: EnumStatic<ActionName>,
	actionName: ActionName
) {
	'use strict';
	const creatorPostfix = '.js';
	const creatorRelativePath = absoluteActionName
		.substring(0, absoluteActionName.length - actionNameStatic[<number><any>actionName].length - 1)
		.replace(/\./g, '/');
	const creatorNameParts = creatorRelativePath.split('/');
	const creatorName = creatorNameParts[creatorNameParts.length - 1];
	const creatorPath = baseSrcPath + creatorRelativePath + creatorPostfix;
	return require(creatorPath)[creatorName + 'Actions'];
};

export function getSignalCreatorStatic<ActionName>(
	absoluteActionName: string,
	actionNameStatic: EnumStatic<ActionName>,
	actionName: ActionName
) {
	'use strict';
	const creatorPostfix = '.js';
	const creatorRelativePath = absoluteActionName
		.substring(0, absoluteActionName.length - actionNameStatic[<number><any>actionName].length - 1)
		.replace(/\./g, '/');
	const creatorNameParts = creatorRelativePath.split('/');
	const creatorName = creatorNameParts[creatorNameParts.length - 1];
	const creatorPath = baseSrcPath + creatorRelativePath + creatorPostfix;
	return require(creatorPath)[creatorName + 'Signals'];
};
