
import ResourceFactory from '../../src/Addressing/ResourceFactory';

describe('Addressing.ResourceFactory', () => {

	var resourceFactory = new ResourceFactory();

	class MyStore {}

	it('shoud return resource with string identifier of store state with params', () => {
		var resource = resourceFactory.get(MyStore, { my: 'param' });
		expect(resource.getIdentifier()).toBe('MyStore:{"my":"param"}');
	});
});
