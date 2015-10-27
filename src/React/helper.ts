
export function classNames (...classNames: string[]) {
	'use strict';
	return classNames.filter((className: string) => !!className).join(' ');
};
