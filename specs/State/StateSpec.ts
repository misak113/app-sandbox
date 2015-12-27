
/// <reference path="../../node_modules/immutable/dist/immutable.d.ts" />
import { Patch, Update, Subscribe } from '../../src/State/StateActions';
import ResourceTarget from '../../src/Addressing/ResourceTarget';
import MyState from './MyState';
import Action from '../../src/Flux/Action';
import EntityStorage from '../../src/Immutable/EntityStorage';
import { setEntityStorage } from '../../src/Immutable/Entity';
import Convertor from '../../src/Immutable/Convertor';

describe('State', () => {

	const entityStorage = new EntityStorage();
	setEntityStorage(entityStorage);
	const convertor = new Convertor(entityStorage);

	beforeEach(() => {
		setEntityStorage(entityStorage);
	});

	describe('StateActions', () => {

		const clientStateBefore = new MyState({
			a: 1
		});
		const clientStateAfter = new MyState({
			a: 2
		});

		it('should create patch action', () => {
			const opsList = convertor.diff(MyState, clientStateBefore, clientStateAfter);
			const action = new Patch(opsList, new ResourceTarget('myClientId'));
			expect(action instanceof Action).toBeTruthy();
			expect(action.getPayload()).toEqual([{
				op: 'replace',
				path: '/a',
				value: 2
			}]);
			expect(action.getTarget().getIdentifier()).toBe('myClientId');
		});

		it('should create update action', () => {
			const payload = {
				StateClass: MyState,
				resourceTarget: new ResourceTarget('myClientId'),
				originalState: clientStateBefore,
				nextState: clientStateAfter
			};
			const action = new Update(payload);
			expect(action instanceof Action).toBeTruthy();
			expect(action.getPayload().StateClass).toBe(MyState);
			expect(action.getPayload().originalState).toBe(clientStateBefore);
			expect(action.getPayload().nextState).toBe(clientStateAfter);
			expect(action.getPayload().resourceTarget.getIdentifier()).toBe('myClientId');
		});

		it('should create subscribe action', () => {
			const action = new Subscribe(new ResourceTarget('myClientId'));
			expect(action instanceof Action).toBeTruthy();
			expect(action.getPayload().identifier).toBe('myClientId');
		});
	});
});
