
/// <reference path="../../node_modules/immutable/dist/immutable.d.ts" />
import { Patch, Update } from '../../src/State/StateActions';
import ResourceTarget from '../../src/Addressing/ResourceTarget';
import ResourceFactory from '../../src/Addressing/ResourceFactory';
import StateStore from '../../src/State/StateStore';
import MyState from './MyState';
import Convertor from '../../src/Immutable/Convertor';
import EntityStorage from '../../src/Immutable/EntityStorage';
import { setEntityStorage } from '../../src/Immutable/Entity';
import Dispatcher from '../../src/Flux/Dispatcher';

describe('State.StateStore', () => {

	let dispatcher;
	const entityStorage = new EntityStorage();
	const convertor = new Convertor(entityStorage);
	const resourceFactory = new ResourceFactory();
	let stateStore;

	const clientStateBefore = new MyState({
		a: 1
	});
	const clientStateAfter = new MyState({
		a: 2
	});

	beforeEach(() => {
		setEntityStorage(entityStorage);
		dispatcher = new Dispatcher();
		stateStore = new StateStore(
			dispatcher,
			resourceFactory,
			convertor
		);
	});

	it('should dispatch patch action after got update action', (done: Function) => {
		let countOfCallbackExecuted = 0;
		const resourceTarget = new ResourceTarget('myClientId');
		const payload = {
			StateClass: MyState,
			resourceTarget,
			originalState: clientStateBefore,
			nextState: clientStateAfter
		};
		dispatcher.dispatch(new Update(payload));
		dispatcher.bind(Patch, (action: Patch) => {
			expect(action instanceof Patch);
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
