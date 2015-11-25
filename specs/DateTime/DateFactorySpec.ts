
import DateFactory from '../../src/DateTime/DateFactory';

describe('DateTime.DateFactory', () => {

	const dateTimeFactory = new DateFactory();

	it('should return current Date instance', () => {
		const toleranceMs = 1000;
		const expectedDate = new Date();
		const date = dateTimeFactory.now();
		expect(date instanceof Date).toBeTruthy();
		expect(date.getTime()).toBeGreaterThan(expectedDate.getTime() - toleranceMs);
		expect(date.getTime()).toBeLessThan(expectedDate.getTime() + toleranceMs);
	});
});
