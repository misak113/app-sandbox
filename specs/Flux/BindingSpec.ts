
import Binding from '../../src/Flux/Binding';
import Action from '../../src/Flux/Action';
import Signal from '../../src/Flux/Signal';

describe('Flux.Binding', () => {

	it('should create instance of Binding with signals & callback', () => {
		var was = null;
		var binding = new Binding(
			[new Signal('My.Namespace:NAME')],
			(action: Action<any>) => { was = 'called: ' + action.getName(); }
		);
		expect(binding instanceof Binding).toBeTruthy();
		expect(binding.getSignals()).toEqual([new Signal('My.Namespace:NAME')]);
		expect(typeof binding.getCallback() === 'function').toBeTruthy();

		binding.getCallback()(new Action('My.Namespace:NAME'));
		expect(was).toBe('called: My.Namespace:NAME');
	});
});
