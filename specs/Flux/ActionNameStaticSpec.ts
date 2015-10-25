
import ActionNameStatic from '../../src/Flux/ActionNameStatic';

describe('Flux.ActionNameStatic', () => {

	enum MyActionName {
		WHAT,
		IF
	}

	it('should allow to store enum ActionName static to type ActionNameStatic', () => {
		var actionNameStatic: ActionNameStatic<MyActionName> = MyActionName;
		// enum has length doubled because of convertion both side string <-> number
		expect(Object.keys(actionNameStatic).length).toBe(4);
	});

	it('should allow to get enum ActionName value from ActionNameStatic type', () => {
		var actionNameStatic: ActionNameStatic<MyActionName> = MyActionName;

		var whatValue1 = actionNameStatic[MyActionName.WHAT];
		expect(whatValue1).toBe('WHAT');

		var whatValue2 = actionNameStatic[0];
		expect(whatValue2).toBe('WHAT');

		var whatInputEnum: number = 0;
		var whatValue3 = actionNameStatic[whatInputEnum];
		expect(whatValue3).toBe('WHAT');

		/* tslint:disable */
		var whatValue4 = actionNameStatic[actionNameStatic['WHAT']];
		/* tslint:enable */
		expect(whatValue4).toBe('WHAT');

		var whatEnum1 = (<any>actionNameStatic).WHAT;
		expect(whatEnum1).toBe(0);

		/* tslint:disable */
		var whatEnum2 = actionNameStatic['WHAT'];
		/* tslint:enable */
		expect(whatEnum1).toBe(0);

		var whatInputValue: string = 'WHAT';
		var whatEnum3 = actionNameStatic[whatInputValue];
		expect(whatEnum3).toBe(0);
	});
});
