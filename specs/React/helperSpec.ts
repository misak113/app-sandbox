
import {classNames} from '../../src/React/helper';

describe('React.helper', () => {

	describe('classNames', () => {

		it('should return class names joined with space', () => {
			expect(classNames('a', 'b', 'c')).toBe('a b c');
		});

		it('should return class names filtered of nulls, empty & undefined', () => {
			expect(classNames('a', null, 'b', undefined, 'c', '', 'd')).toBe('a b c d');
		});
	});
});
