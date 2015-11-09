
/// <reference path="../../node_modules/immutable/dist/immutable.d.ts" />
import { State, StateActions, StateSignals } from '../../src/State/State';
import ResourceTarget from '../../src/Addressing/ResourceTarget';
import MyState from './MyState';
import Action from '../../src/Flux/Action';
import Signal from '../../src/Flux/Signal';
import Convertor from '../../src/Immutable/Convertor';
import EntityStorage from '../../src/Immutable/EntityStorage';
import { setEntityStorage } from '../../src/Immutable/Entity';
import { getActionCreatorStatic, getSignalCreatorStatic } from '../Flux/Helper';

describe('State', () => {

	var entityStorage = new EntityStorage();
	setEntityStorage(entityStorage);

	beforeEach(() => {
		setEntityStorage(entityStorage);
	});

	describe('StateActions', () => {

		var convertor = new Convertor(entityStorage);
		var stateActions = new StateActions(convertor);

		const clientStateBefore = new MyState({
			a: 1
		});
		const clientStateAfter = new MyState({
			a: 2
		});

		it('should create patch action', () => {
			var action = stateActions.patch(MyState, clientStateBefore, clientStateAfter, new ResourceTarget('myClientId'));
			expect(action instanceof Action).toBeTruthy();
			expect(StateActions)
				.toBe(getActionCreatorStatic(action.getName(), State, State.patch));
			expect(action.getPayload()).toEqual([{
				op: 'replace',
				path: '/a',
				value: 2
			}]);
			expect(action.getTarget().getIdentifier()).toBe('myClientId');
		});

		it('should create update action', () => {
			var action = stateActions.update(MyState, clientStateBefore, clientStateAfter, new ResourceTarget('myClientId'));
			expect(action instanceof Action).toBeTruthy();
			expect(StateActions).toBe(getActionCreatorStatic(action.getName(), State, State.update));
			expect(action.getPayload().StateClass).toBe(MyState);
			expect(action.getPayload().originalState).toBe(clientStateBefore);
			expect(action.getPayload().nextState).toBe(clientStateAfter);
			expect(action.getPayload().resource.getIdentifier()).toBe('myClientId');
		});

		it('should create subscribe action', () => {
			var action = stateActions.subscribe(new ResourceTarget('myClientId'));
			expect(action instanceof Action).toBeTruthy();
			expect(action.getPayload().identifier).toBe('myClientId');
		});
	});

	describe('StateSignals', () => {

		var stateSignals = new StateSignals();

		it('should create patch signal', () => {
			var signal = stateSignals.patch();
			expect(signal instanceof Signal).toBeTruthy();
			expect(StateSignals)
				.toBe(getSignalCreatorStatic(signal.getName(), State, State.patch));
			expect(signal.getPayload()).toBeUndefined();
		});

		it('should create update signal', () => {
			var signal = stateSignals.update();
			expect(signal instanceof Signal).toBeTruthy();
			expect(StateSignals)
				.toBe(getSignalCreatorStatic(signal.getName(), State, State.update));
			expect(signal.getPayload()).toBeUndefined();
		});

		it('should create subscribe signal', () => {
			var signal = stateSignals.subscribe();
			expect(signal instanceof Signal).toBeTruthy();
			expect(StateSignals)
				.toBe(getSignalCreatorStatic(signal.getName(), State, State.subscribe));
			expect(signal.getPayload()).toBeUndefined();
		});
	});
});
