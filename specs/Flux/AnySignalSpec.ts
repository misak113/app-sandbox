
import AnySignal from '../../src/Flux/AnySignal';
import Signal from '../../src/Flux/Signal';

describe('Flux.AnySignal', () => {

	it('should create instance of AnySignal with asterisk name *', () => {
		const signal = new AnySignal();
		expect(signal instanceof Signal).toBeTruthy();
		expect(signal.getName()).toBe('*');
		expect(signal.getPayload()).toBeUndefined();
	});
});
