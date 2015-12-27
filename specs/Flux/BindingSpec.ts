
import Binding from '../../src/Flux/Binding';
import Action from '../../src/Flux/Action';

describe('Flux.Binding', () => {

	class MyAction extends Action<{}> {}

	it('should create instance of Binding with signals & callback', () => {
		let was = null;
		const binding = new Binding(
			[MyAction],
			(action: Action<any>) => { was = 'called'; }
		);
		expect(binding instanceof Binding).toBeTruthy();
		expect(binding.getActionStatics()).toEqual([MyAction]);
		expect(typeof binding.getCallback() === 'function').toBeTruthy();

		binding.getCallback()(new MyAction());
		expect(was).toBe('called');
	});
});
