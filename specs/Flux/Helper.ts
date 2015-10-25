
import ActionNameStatic from '../../src/Flux/ActionNameStatic';
import {normalize} from 'path';
/* tslint:disable */
require('coffee-script').register();
var paths = require('../../../../gulp/config/paths');
/* tslint:enable */

var baseSrcPath = normalize(paths.dist + '/js/src/');

export function getActionCreatorStatic<ActionName>(
	absoluteActionName: string,
	actionNameStatic: ActionNameStatic<ActionName>,
	actionName: ActionName
) {
	'use strict';
	var actionCreatorPostfix = 'ActionCreator.js';
	var actionCreatorRelativePath = absoluteActionName
		.substring(0, absoluteActionName.length - actionNameStatic[<number><any>actionName].length - 1)
		.replace(/\./g, '/');
	var actionCreatorPath = baseSrcPath + actionCreatorRelativePath + actionCreatorPostfix;
	return require(actionCreatorPath).default;
};
