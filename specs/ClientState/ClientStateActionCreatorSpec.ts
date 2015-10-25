
/// <reference path="../../node_modules/immutable/dist/immutable.d.ts" />
import ClientStateActionCreator, {ClientStateActionName} from '../../src/ClientState/ClientStateActionCreator';
import IClientState from '../../src/ClientState/IClientState';
import Action from '../../src/Flux/Action';
import {getActionCreatorStatic} from '../Flux/Helper';
import {Map} from 'immutable';

describe('ClientState.ClientStateActionCreator', () => {

	var clientStateActionCreator = new ClientStateActionCreator();

	var updateCallback = (clientState: IClientState, clientId: string) => {
		expect(clientState instanceof Map).toBeTruthy();
		expect(clientId).toBe('myClientId');
		return clientState;
	};

	it('should create UPDATE action', () => {
		var action = clientStateActionCreator.update(updateCallback);
		expect(action instanceof Action).toBeTruthy();
		expect(ClientStateActionCreator).toBe(getActionCreatorStatic(action.Name, ClientStateActionName, ClientStateActionName.UPDATE));
		expect(action.Payload).toBe(updateCallback);
		var clientState = Map({});
		expect(action.Payload(clientState, 'myClientId')).toBe(clientState);
	});

	it('should create UPDATE_CLIENT action', () => {
		var action = clientStateActionCreator.updateClient('myClientId', updateCallback);
		expect(action instanceof Action).toBeTruthy();
		expect(ClientStateActionCreator).toBe(getActionCreatorStatic(action.Name, ClientStateActionName, ClientStateActionName.UPDATE_CLIENT));
		expect(action.Payload.updateCallback).toBe(updateCallback);
		expect(action.Payload.clientId).toBe('myClientId');
		var clientState = Map({});
		expect(action.Payload.updateCallback(clientState, 'myClientId')).toBe(clientState);
	});

	it('should create CREATE_IF_NOT_EXISTS action', () => {
		var action = clientStateActionCreator.createIfNotExists('myClientId');
		expect(action instanceof Action).toBeTruthy();
		expect(ClientStateActionCreator)
			.toBe(getActionCreatorStatic(action.Name, ClientStateActionName, ClientStateActionName.CREATE_IF_NOT_EXISTS));
		expect(action.Payload.clientId).toBe('myClientId');
	});

	it('should create CREATED_IF_NOT_EXISTS action', () => {
		var action = clientStateActionCreator.createdIfNotExists('myClientId');
		expect(action instanceof Action).toBeTruthy();
		expect(ClientStateActionCreator)
			.toBe(getActionCreatorStatic(action.Name, ClientStateActionName, ClientStateActionName.CREATED_IF_NOT_EXISTS));
		expect(action.Payload.clientId).toBe('myClientId');
	});

	it('should create SEND_DIFF action', () => {
		var clientStateBefore = Map({
			a: 1
		});
		var clientStateAfter = Map({
			a: 2
		});
		var action = clientStateActionCreator.sendDiff(clientStateBefore, clientStateAfter, 'myClientId');
		expect(action instanceof Action).toBeTruthy();
		expect(ClientStateActionCreator)
			.toBe(getActionCreatorStatic(action.Name, ClientStateActionName, ClientStateActionName.SEND_DIFF));
		expect(action.Payload).toEqual([{
			op: 'replace',
			path: '/a',
			value: 2
		}]);
		expect(action.Target.Id).toBe('myClientId');
	});

	it('should create CREATED action', () => {
		var action = clientStateActionCreator.created('myClientId');
		expect(action instanceof Action).toBeTruthy();
		expect(ClientStateActionCreator)
			.toBe(getActionCreatorStatic(action.Name, ClientStateActionName, ClientStateActionName.CREATED));
		expect(action.Payload.clientId).toBe('myClientId');
	});
});
