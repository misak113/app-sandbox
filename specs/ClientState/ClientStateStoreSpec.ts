
/// <reference path="../../node_modules/immutable/dist/immutable.d.ts" />
import ClientStateActionCreator, {ClientStateActionName} from '../../src/ClientState/ClientStateActionCreator';
import ClientStateStore from '../../src/ClientState/ClientStateStore';
import ClientState from './ClientState';
import Convertor from '../../src/Immutable/Convertor';
import EntityStorage from '../../src/Immutable/EntityStorage';
import { setEntityStorage } from '../../src/Immutable/Entity';
import Action from '../../src/Flux/Action';
import Dispatcher from '../../src/Flux/Dispatcher';

describe('ClientState.ClientStateStore', () => {

	var dispatcher;
	var entityStorage = new EntityStorage();
	var convertor = new Convertor(entityStorage);
	var clientStateActionCreator = new ClientStateActionCreator(convertor);
	var clientStateStore;

	beforeEach(() => {
		setEntityStorage(entityStorage);
		dispatcher = new Dispatcher();
		clientStateStore = new ClientStateStore(
			dispatcher,
			clientStateActionCreator
		);
	});

	it('should create clientState by CREATE_IF_NOT_EXISTS action', (done: Function) => {
		dispatcher.dispatch(clientStateActionCreator.createIfNotExists(ClientState, 'myClientId'));
		// wait 1 tick
		setTimeout(() => {
			var clientState = clientStateStore.getById('myClientId');
			expect(clientState instanceof ClientState).toBeTruthy();
			done();
		});
	});

	it('should emit CREATED_IF_NOT_EXISTS action after CREATE_IF_NOT_EXISTS', (done: Function) => {
		var countOfCallbackExecuted = 0;
		dispatcher.dispatch(clientStateActionCreator.createIfNotExists(ClientState, 'myClientId'));
		dispatcher.bind(clientStateActionCreator.createActionName(ClientStateActionName.CREATED_IF_NOT_EXISTS), (action: Action) => {
			expect(action.Name).toBe('ClientState.ClientState:CREATED_IF_NOT_EXISTS');
			expect(action.Payload.clientId).toBe('myClientId');
			countOfCallbackExecuted++;
		});
		// wait 3 ticks
		setTimeout(() => setTimeout(() => setTimeout(() => {
			expect(countOfCallbackExecuted).toBe(1);
			done();
		})));
	});

	it('should emit CREATED action after CREATE_IF_NOT_EXISTS created', (done: Function) => {
		var countOfCallbackExecuted = 0;
		dispatcher.dispatch(clientStateActionCreator.createIfNotExists(ClientState, 'myClientId'));
		dispatcher.bind(clientStateActionCreator.createActionName(ClientStateActionName.CREATED), (action: Action) => {
			expect(action.Name).toBe('ClientState.ClientState:CREATED');
			expect(action.Payload.clientId).toBe('myClientId');
			countOfCallbackExecuted++;
		});
		// wait 2 ticks
		setTimeout(() => setTimeout(() => {
			expect(countOfCallbackExecuted).toBe(1);
			done();
		}));
	});

	it('should update all clientStates by UPDATE action & emit SEND_DIFF actions for every clientState', (done: Function) => {
		var countOfCallbackExecuted = 0;
		dispatcher.dispatch(clientStateActionCreator.createIfNotExists(ClientState, 'myClientId'));
		dispatcher.dispatch(clientStateActionCreator.createIfNotExists(ClientState, 'yourClientId'));
		// wait 1 tick
		setTimeout(() => {
			var updateCallback = (clientState: ClientState, clientId: string) => {
				clientState = clientState.set('storedClientId', clientId);
				clientState = clientState.set('shared', 113);
				return clientState;
			};
			dispatcher.dispatch(clientStateActionCreator.update(ClientState, updateCallback));
			dispatcher.bind(clientStateActionCreator.createActionName(ClientStateActionName.SEND_DIFF), (action: Action) => {
				countOfCallbackExecuted++;
				expect(action.Name).toBe('ClientState.ClientState:SEND_DIFF');
			});
			// wait 2 ticks
			setTimeout(() => setTimeout(() => {
				expect(countOfCallbackExecuted).toBe(2);

				var myClientState = clientStateStore.getById('myClientId');
				expect(myClientState.get('shared')).toBe(113);
				expect(myClientState.get('storedClientId')).toBe('myClientId');

				var yourClientState = clientStateStore.getById('yourClientId');
				expect(yourClientState.get('shared')).toBe(113);
				expect(yourClientState.get('storedClientId')).toBe('yourClientId');

				done();
			}));
		});
	});

	it('should update specific clientState by UPDATE_CLIENT action & emit SEND_DIFF actions for every clientState', (done: Function) => {
		var countOfCallbackExecuted = 0;
		dispatcher.dispatch(clientStateActionCreator.createIfNotExists(ClientState, 'myClientId'));
		dispatcher.dispatch(clientStateActionCreator.createIfNotExists(ClientState, 'yourClientId'));
		// wait 1 tick
		setTimeout(() => {
			dispatcher.dispatch(clientStateActionCreator.updateClient(ClientState, 'myClientId', (clientState: ClientState, clientId: string) => {
				clientState = clientState.set('storedClientId', clientId);
				clientState = clientState.set('specific', 'my');
				return clientState;
			}));
			dispatcher.dispatch(clientStateActionCreator.updateClient(ClientState, 'yourClientId', (clientState: ClientState, clientId: string) => {
				clientState = clientState.set('storedClientId', clientId);
				clientState = clientState.set('specific', 'your');
				return clientState;
			}));
			dispatcher.dispatch(clientStateActionCreator.updateClient(ClientState, 'yourClientId', (clientState: ClientState, clientId: string) => {
				clientState = clientState.set('nextSet', 'OK');
				return clientState;
			}));
			dispatcher.bind(clientStateActionCreator.createActionName(ClientStateActionName.SEND_DIFF), (action: Action) => {
				countOfCallbackExecuted++;
				expect(action.Name).toBe('ClientState.ClientState:SEND_DIFF');
			});
			// wait 2 ticks
			setTimeout(() => setTimeout(() => {
				expect(countOfCallbackExecuted).toBe(3);

				var myClientState = clientStateStore.getById('myClientId');
				expect(myClientState.get('specific')).toBe('my');
				expect(myClientState.get('storedClientId')).toBe('myClientId');

				var yourClientState = clientStateStore.getById('yourClientId');
				expect(yourClientState.get('specific')).toBe('your');
				expect(yourClientState.get('storedClientId')).toBe('yourClientId');
				expect(yourClientState.get('nextSet')).toBe('OK');

				done();
			}));
		});
	});

	it('should emit SEND_DIFF action after every UPDATE_CLIENT action with OPS changes using RFC 6902', (done: Function) => {
		var countOfCallbackExecuted = 0;
		var opsList = [];
		dispatcher.dispatch(clientStateActionCreator.createIfNotExists(ClientState, 'myClientId'));
		// wait 1 tick
		setTimeout(() => {
			dispatcher.dispatch(clientStateActionCreator.updateClient(ClientState, 'myClientId', (clientState: ClientState, clientId: string) => {
				clientState = clientState.set('storedClientId', clientId);
				clientState = clientState.set('specific', 'your');
				return clientState;
			}));
			dispatcher.dispatch(clientStateActionCreator.updateClient(ClientState, 'myClientId', (clientState: ClientState) => {
				clientState = clientState.set('another', 'OK');
				return clientState;
			}));
			dispatcher.bind(clientStateActionCreator.createActionName(ClientStateActionName.SEND_DIFF), (action: Action) => {
				expect(action.Name).toBe('ClientState.ClientState:SEND_DIFF');
				expect(action.Target.Id).toBe('myClientId');
				opsList.push(action.Payload);
				countOfCallbackExecuted++;
			});
			// wait 2 ticks
			setTimeout(() => setTimeout(() => {
				expect(countOfCallbackExecuted).toBe(2);
				expect(opsList).toEqual([
					[
						{ op: 'add', path: '/storedClientId', value: 'myClientId' },
						{ op: 'add', path: '/specific', value: 'your' },
					],
					[
						{ op: 'add', path: '/another', value: 'OK' }
					],
				]);
				done();
			}));
		});
	});
});
