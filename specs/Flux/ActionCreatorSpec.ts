
import Action from '../../src/Flux/Action';
import ActionCreator from '../../src/Flux/ActionCreator';

describe('Flux.ActionCreator', () => {

	class MyActionCreator extends ActionCreator<MyActionName> {

		protected getActionName() {
			return MyActionName;
		}

		protected getName() {
			return 'Flux.My';
		}

		lets() {
			return this.createAction(MyActionName.LETS, { do: 'it' }, 'me', 'it');
		}

		try(done: string) {
			return this.createAction(MyActionName.TRY, { done: done }, 'he', 'you');
		}

		it(did: string, source: string) {
			return this.createAction(MyActionName.IT, { did: did }, source, 'me');
		}
	}

	enum MyActionName {
		LETS,
		TRY,
		IT
	}

	var myActionCreator = new MyActionCreator();

	it('should return action name prefixed by ActionCreator name', () => {
		expect(myActionCreator.createActionName(MyActionName.LETS)).toBe('Flux.My:LETS');
		expect(myActionCreator.createActionName(MyActionName.TRY)).toBe('Flux.My:TRY');
		expect(myActionCreator.createActionName(MyActionName.IT)).toBe('Flux.My:IT');
	});

	it('should return action instance', () => {
		var letsAction = myActionCreator.lets();
		expect(letsAction instanceof Action).toBeTruthy();
		expect(letsAction.Name).toBe('Flux.My:LETS');
		expect(letsAction.Payload).toEqual({ do: 'it' });

		var tryAction = myActionCreator.try('you');
		expect(tryAction instanceof Action).toBeTruthy();
		expect(tryAction.Name).toBe('Flux.My:TRY');
		expect(tryAction.Payload).toEqual({ done: 'you' });
		expect(tryAction.Source).toBe('you');
		expect(tryAction.Target).toBe('he');

		var itAction = myActionCreator.it('me', 'you');
		expect(itAction instanceof Action).toBeTruthy();
		expect(itAction.Name).toBe('Flux.My:IT');
		expect(itAction.Payload).toEqual({ did: 'me' });
		expect(itAction.Source).toBe('me');
		expect(itAction.Target).toBe('you');
	});
});
