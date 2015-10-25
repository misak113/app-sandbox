
import Action from '../../src/Flux/Action';

describe('Flux.Action', () => {

	it('should create instance of Action with required properties', () => {
		var action = new Action(
			'My.Namespace:NAME'
		);
		expect(action instanceof Action).toBeTruthy();
		expect(action.Name).toBe('My.Namespace:NAME');
		expect(action.Payload).toBeUndefined();
		expect(action.Source).toBeUndefined();
		expect(action.Target).toBeUndefined();
	});

	it('should create instance of Action with optional properties', () => {
		var action = new Action(
			'My.Namespace:NAME',
			{ whatever: 'you want' },
			{ sourceType: 'Client', clientId: 'Client1' },
			{ targetType: 'Server', serverId: 'Shard1' }
		);
		expect(action instanceof Action).toBeTruthy();
		expect(action.Name).toBe('My.Namespace:NAME');
		expect(action.Payload).toEqual({ whatever: 'you want' });
		expect(action.Source.sourceType).toBe('Client');
		expect(action.Source.clientId).toBe('Client1');
		expect(action.Target.targetType).toBe('Server');
		expect(action.Target.serverId).toBe('Shard1');
	});
});
