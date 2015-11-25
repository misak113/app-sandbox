
import Signal from '../../src/Flux/Signal';

describe('Flux.Signal', () => {

	it('should create instance of Signal with required properties', () => {
		const signal = new Signal(
			'My.Namespace:NAME'
		);
		expect(signal instanceof Signal).toBeTruthy();
		expect(signal.getName()).toBe('My.Namespace:NAME');
		expect(signal.getPayload()).toBeUndefined();
	});

	it('should create instance of Signal with optional properties', () => {
		const signal = new Signal(
			'My.Namespace:NAME',
			{ whatever: 'you want' }
		);
		expect(signal instanceof Signal).toBeTruthy();
		expect(signal.getName()).toBe('My.Namespace:NAME');
		expect(signal.getPayload()).toEqual({ whatever: 'you want' });
	});
});
