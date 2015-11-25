
import EnumStatic from '../../src/Flux/EnumStatic';

describe('Flux.EnumStatic', () => {

	enum MyActionName {
		WHAT,
		IF
	}

	it('should allow to store enum ActionName static to type ActionNameStatic', () => {
		const actionNameStatic: EnumStatic<MyActionName> = MyActionName;
		// enum has length doubled because of convertion both side string <-> number
		expect(Object.keys(actionNameStatic).length).toBe(4);
	});

	it('should allow to get enum ActionName value from ActionNameStatic type', () => {
		const actionNameStatic: EnumStatic<MyActionName> = MyActionName;

		const whatValue1 = actionNameStatic[MyActionName.WHAT];
		expect(whatValue1).toBe('WHAT');

		const whatValue2 = actionNameStatic[0];
		expect(whatValue2).toBe('WHAT');

		const whatInputEnum: number = 0;
		const whatValue3 = actionNameStatic[whatInputEnum];
		expect(whatValue3).toBe('WHAT');

		/* tslint:disable */
		const whatValue4 = actionNameStatic[actionNameStatic['WHAT']];
		/* tslint:enable */
		expect(whatValue4).toBe('WHAT');

		const whatEnum1 = (<any>actionNameStatic).WHAT;
		expect(whatEnum1).toBe(0);

		/* tslint:disable */
		const whatEnum2 = actionNameStatic['WHAT'];
		/* tslint:enable */
		expect(whatEnum1).toBe(0);

		const whatInputValue: string = 'WHAT';
		const whatEnum3 = actionNameStatic[whatInputValue];
		expect(whatEnum3).toBe(0);
	});
});
