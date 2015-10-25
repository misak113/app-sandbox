
import DateFactory from '../../src/DateTime/DateFactory';

describe('DateTime.DateFactory', () => {

	var dateTimeFactory = new DateFactory();

	it('should return current Date instance', () => {
		var toleranceMs = 1000;
		var expectedDate = new Date();
		var date = dateTimeFactory.now();
		expect(date instanceof Date).toBeTruthy();
		expect(date.getTime()).toBeGreaterThan(expectedDate.getTime() - toleranceMs);
		expect(date.getTime()).toBeLessThan(expectedDate.getTime() + toleranceMs);
	});
});
