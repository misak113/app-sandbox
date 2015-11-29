
import ResourceFactory from '../../src/Addressing/ResourceFactory';
import resource from '../../src/Addressing/resource';

describe('Addressing.ResourceFactory', () => {

	const resourceFactory = new ResourceFactory();

	@resource('/my-state')
	class MyState {}

	it('shoud return resource with string identifier of store state with params', () => {
		const resource = resourceFactory.get(MyState, { my: 'param' });
		expect(resource.getIdentifier()).toBe('/my-state:{"my":"param"}');
	});
});
