
import Store from '../../src/Flux/Store';

describe('Flux.Store', () => {

	class MyState {

		constructor(
			public params: { [name: string]: string }
		) {}
	}

	class MyStore extends Store<MyState> {

		constructor() {
			super(MyState);
		}

		getState(params: { [name: string]: string }) {
			return new MyState(params);
		}
	}

	const myStore = new MyStore();

	it('should return state by params', () => {
		const myState = myStore.getState({ name: 'what' });
		expect(myState).toEqual(new MyState({ name: 'what' }));
	});

	it('should return state class static', () => {
		expect(myStore.getStateClass()).toBe(MyState);
	});
});
