
import Action from '../../src/Flux/Action';
import ActionCreator from '../../src/Flux/ActionCreator';

describe('Flux.ActionCreator', () => {

	class MyActions extends ActionCreator<MyActionName> {

		constructor() {
			super('Flux.My', MyActionName);
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

	const myActions = new MyActions();

	it('should return action name prefixed by ActionCreator name', () => {
		expect(myActions.lets().getName()).toBe('Flux.My:LETS');
		expect(myActions.try('done').getName()).toBe('Flux.My:TRY');
		expect(myActions.it('did', 'source').getName()).toBe('Flux.My:IT');
	});

	it('should return action instance', () => {
		const letsAction = myActions.lets();
		expect(letsAction instanceof Action).toBeTruthy();
		expect(letsAction.getName()).toBe('Flux.My:LETS');
		expect(letsAction.getPayload()).toEqual({ do: 'it' });

		const tryAction = myActions.try('you');
		expect(tryAction instanceof Action).toBeTruthy();
		expect(tryAction.getName()).toBe('Flux.My:TRY');
		expect(tryAction.getPayload()).toEqual({ done: 'you' });
		expect(tryAction.getSource()).toBe('you');
		expect(tryAction.getTarget()).toBe('he');

		const itAction = myActions.it('me', 'you');
		expect(itAction instanceof Action).toBeTruthy();
		expect(itAction.getName()).toBe('Flux.My:IT');
		expect(itAction.getPayload()).toEqual({ did: 'me' });
		expect(itAction.getSource()).toBe('me');
		expect(itAction.getTarget()).toBe('you');
	});
});
