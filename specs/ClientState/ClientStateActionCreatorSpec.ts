
/// <reference path="../../node_modules/immutable/dist/immutable.d.ts" />
import ClientStateActionCreator, {ClientStateActionName} from '../../src/ClientState/ClientStateActionCreator';
import ClientState from './ClientState';
import Action from '../../src/Flux/Action';
import Convertor from '../../src/Immutable/Convertor';
import EntityStorage from '../../src/Immutable/EntityStorage';
import { setEntityStorage } from '../../src/Immutable/Entity';
import {getActionCreatorStatic} from '../Flux/Helper';
import {Map} from 'immutable';

describe('ClientState.ClientStateActionCreator', () => {

	var entityStorage = new EntityStorage();
	var convertor = new Convertor(entityStorage);
	var clientStateActionCreator = new ClientStateActionCreator(convertor);

	beforeEach(() => {
		setEntityStorage(entityStorage);
	});

	var updateCallback = (clientState: ClientState, clientId: string) => {
		expect(clientState instanceof Map).toBeTruthy();
		expect(clientId).toBe('myClientId');
		return clientState;
	};

	it('should create UPDATE action', () => {
		var action = clientStateActionCreator.update(ClientState, updateCallback);
		expect(action instanceof Action).toBeTruthy();
		expect(ClientStateActionCreator).toBe(getActionCreatorStatic(action.Name, ClientStateActionName, ClientStateActionName.UPDATE));
		expect(action.Payload.updateCallback).toBe(updateCallback);
		var clientState = Map({});
		expect(action.Payload.updateCallback(clientState, 'myClientId')).toBe(clientState);
	});

	it('should create UPDATE_CLIENT action', () => {
		var action = clientStateActionCreator.updateClient(ClientState, 'myClientId', updateCallback);
		expect(action instanceof Action).toBeTruthy();
		expect(ClientStateActionCreator).toBe(getActionCreatorStatic(action.Name, ClientStateActionName, ClientStateActionName.UPDATE_CLIENT));
		expect(action.Payload.updateCallback).toBe(updateCallback);
		expect(action.Payload.clientId).toBe('myClientId');
		var clientState = Map({});
		expect(action.Payload.updateCallback(clientState, 'myClientId')).toBe(clientState);
	});

	it('should create CREATE_IF_NOT_EXISTS action', () => {
		var action = clientStateActionCreator.createIfNotExists(ClientState, 'myClientId');
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
		var clientStateBefore = new ClientState({
			a: 1
		});
		var clientStateAfter = new ClientState({
			a: 2
		});
		var action = clientStateActionCreator.sendDiff(ClientState, clientStateBefore, clientStateAfter, 'myClientId');
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
