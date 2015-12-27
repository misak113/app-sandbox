
import Action from '../../src/Flux/Action';

describe('Flux.Action', () => {

	class MyAction extends Action<{}> { }
	class YourAction extends Action<{ whatever: string }> { }

	it('should create instance of Action with required properties', () => {
		const action = new MyAction();
		expect(action instanceof Action).toBeTruthy();
		expect(action.getPayload()).toBeUndefined();
		expect(action.getSource()).toBeUndefined();
		expect(action.getTarget()).toBeUndefined();
	});

	it('should create instance of Action with optional properties', () => {
		const action = new YourAction(
			{ whatever: 'you want' },
			{ sourceType: 'Client', clientId: 'Client1' },
			{ targetType: 'Server', serverId: 'Shard1' }
		);
		expect(action instanceof Action).toBeTruthy();
		expect(action.getPayload()).toEqual({ whatever: 'you want' });
		expect(action.getSource().sourceType).toBe('Client');
		expect(action.getSource().clientId).toBe('Client1');
		expect(action.getTarget().targetType).toBe('Server');
		expect(action.getTarget().serverId).toBe('Shard1');
	});
});
