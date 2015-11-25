
/// <reference path="../../node_modules/immutable/dist/immutable.d.ts" />
import { StateActions, StateSignals, IPatchPayload } from '../../src/State/State';
import ResourceTarget from '../../src/Addressing/ResourceTarget';
import ResourceFactory from '../../src/Addressing/ResourceFactory';
import StateStore from '../../src/State/StateStore';
import MyState from './MyState';
import Convertor from '../../src/Immutable/Convertor';
import EntityStorage from '../../src/Immutable/EntityStorage';
import { setEntityStorage } from '../../src/Immutable/Entity';
import Action from '../../src/Flux/Action';
import Dispatcher from '../../src/Flux/Dispatcher';

describe('State.StateStore', () => {

	let dispatcher;
	const entityStorage = new EntityStorage();
	const convertor = new Convertor(entityStorage);
	const stateActions = new StateActions(convertor);
	const stateSignals = new StateSignals();
	const resourceFactory = new ResourceFactory();
	let clientStateStore;

	const clientStateBefore = new MyState({
		a: 1
	});
	const clientStateAfter = new MyState({
		a: 2
	});

	beforeEach(() => {
		setEntityStorage(entityStorage);
		dispatcher = new Dispatcher();
		clientStateStore = new StateStore(
			dispatcher,
			stateActions,
			stateSignals,
			resourceFactory
		);
	});

	it('should dispatch patch action after got update action', (done: Function) => {
		let countOfCallbackExecuted = 0;
		const resourceTarget = new ResourceTarget('myClientId');
		dispatcher.dispatch(stateActions.update(MyState, clientStateBefore, clientStateAfter, resourceTarget));
		dispatcher.bind(stateSignals.patch(resourceTarget), (action: Action<IPatchPayload>) => {
			expect(action.getName()).toBe('State.State:patch');
			expect(action.getPayload()).toEqual([{
				op: 'replace',
				path: '/a',
				value: 2
			}]);
			expect(action.getTarget().getIdentifier()).toBe('myClientId');
			countOfCallbackExecuted++;
		});
		// wait 2 tick
		setTimeout(() => setTimeout(() => {
			expect(countOfCallbackExecuted).toBe(1);
			done();
		}));
	});
});
