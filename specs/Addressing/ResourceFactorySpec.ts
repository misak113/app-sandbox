
import ResourceFactory from '../../src/Addressing/ResourceFactory';
import name from '../../src/Addressing/name';

describe('Addressing.ResourceFactory', () => {

	var resourceFactory = new ResourceFactory();

	@name('/my-state')
	class MyState {}

	it('shoud return resource with string identifier of store state with params', () => {
		var resource = resourceFactory.get(MyState, { my: 'param' });
		expect(resource.getIdentifier()).toBe('/my-state:{"my":"param"}');
	});
});
