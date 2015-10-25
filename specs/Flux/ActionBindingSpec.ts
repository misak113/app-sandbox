
import ActionBinding from '../../src/Flux/ActionBinding';
import Action from '../../src/Flux/Action';

describe('Flux.ActionBinding', () => {

	it('should create instance of ActionBinding with names & callback', () => {
		var was = null;
		var actionBinding = new ActionBinding(
			['My.Namespace:NAME'],
			(action: Action) => { was = 'called: ' + action.Name; }
		);
		expect(actionBinding instanceof ActionBinding).toBeTruthy();
		expect(actionBinding.ActionNames).toEqual(['My.Namespace:NAME']);
		expect(typeof actionBinding.ActionCallback === 'function').toBeTruthy();

		actionBinding.ActionCallback(new Action('My.Namespace:NAME'));
		expect(was).toBe('called: My.Namespace:NAME');
	});
});
