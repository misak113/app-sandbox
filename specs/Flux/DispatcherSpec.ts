
import Dispatcher from '../../src/Flux/Dispatcher';
import Action from '../../src/Flux/Action';
import {FluxDispatcherUnbindException} from '../../src/Flux/exceptions';

describe('Flux.Dispatcher', () => {

	it('should dispatch action to binded callbacks', (done: Function) => {
		var countOfExecutionOne = 0;
		var countOfExecutionTwo = 0;
		var dispatcher = new Dispatcher();
		dispatcher.bind('MyName', (action: Action) => {
			expect(action.Name).toBe('MyName');
			expect(action.Payload).toBe('MyPayload');
			expect(action.Source).toBe('MySource');
			expect(action.Target).toBe('MyTarget');
			countOfExecutionOne++;
		});
		dispatcher.bind('MyName', (action: Action) => {
			countOfExecutionTwo++;
		});
		dispatcher.dispatch(new Action('MyName', 'MyPayload', 'MySource', 'MyTarget'));
		// wait 1 tick
		setTimeout(() => {
			expect(countOfExecutionOne).toBe(1);
			expect(countOfExecutionTwo).toBe(1);
			done();
		});
	});

	it('should not dispatch action to binded callbacks with other name', (done: Function) => {
		var countOfExecutionOne = 0;
		var countOfExecutionTwo = 0;
		var dispatcher = new Dispatcher();
		dispatcher.bind('MyName', (action: Action) => {
			countOfExecutionOne++;
		});
		dispatcher.bind('AnotherName', (action: Action) => {
			countOfExecutionTwo++;
		});
		dispatcher.dispatch(new Action('MyName'));
		// wait 1 tick
		setTimeout(() => {
			expect(countOfExecutionOne).toBe(1);
			expect(countOfExecutionTwo).toBe(0);
			done();
		});
	});

	it('should dispatch action to binded * asterisk callback', (done: Function) => {
		var countOfExecutionOne = 0;
		var countOfExecutionTwo = 0;
		var dispatcher = new Dispatcher();
		dispatcher.bind('MyName', (action: Action) => {
			countOfExecutionOne++;
		});
		dispatcher.bind('*', (action: Action) => {
			countOfExecutionTwo++;
		});
		dispatcher.dispatch(new Action('MyName'));
		dispatcher.dispatch(new Action('AnotherNotBindedDirectly'));
		// wait 1 tick
		setTimeout(() => {
			expect(countOfExecutionOne).toBe(1);
			expect(countOfExecutionTwo).toBe(2);
			done();
		});
	});

	it('should dispatch action to binded callbacks does not depend on order of bind/dispatch call', (done: Function) => {
		var countOfExecutionOne = 0;
		var countOfExecutionTwo = 0;
		var countOfExecutionThree = 0;
		var dispatcher = new Dispatcher();
		dispatcher.dispatch(new Action('MyName'));
		dispatcher.dispatch(new Action('OtherName'));
		dispatcher.dispatch(new Action('AnotherNotBindedDirectly'));
		dispatcher.bind('MyName', (action: Action) => {
			countOfExecutionOne++;
		});
		dispatcher.bind('OtherName', (action: Action) => {
			countOfExecutionTwo++;
		});
		dispatcher.bind('*', (action: Action) => {
			countOfExecutionThree++;
		});
		// wait 1 tick
		setTimeout(() => {
			expect(countOfExecutionOne).toBe(1);
			expect(countOfExecutionTwo).toBe(1);
			expect(countOfExecutionThree).toBe(3);
			done();
		});
	});

	it('should dispatch action to multiple binded callbacks', (done: Function) => {
		var countOfExecutionOne = 0;
		var countOfExecutionTwo = 0;
		var countOfExecutionThree = 0;
		var dispatcher = new Dispatcher();
		dispatcher.bind(['MyName', 'OtherName'], (action: Action) => {
			if (action.Name === 'MyName') {
				countOfExecutionOne++;
			}
			if (action.Name === 'OtherName') {
				countOfExecutionTwo++;
			}
		});
		dispatcher.bind('*', (action: Action) => {
			countOfExecutionThree++;
		});
		dispatcher.dispatch(new Action('MyName'));
		dispatcher.dispatch(new Action('OtherName'));
		dispatcher.dispatch(new Action('AnotherNotBindedDirectly'));
		// wait 1 tick
		setTimeout(() => {
			expect(countOfExecutionOne).toBe(1);
			expect(countOfExecutionTwo).toBe(1);
			expect(countOfExecutionThree).toBe(3);
			done();
		});
	});

	it('should unbind binded callbacks', (done: Function) => {
		var countOfExecutionOne = 0;
		var dispatcher = new Dispatcher();
		var oneActionBinding = dispatcher.bind('MyName', (action: Action) => {
			countOfExecutionOne++;
		});
		dispatcher.dispatch(new Action('MyName'));
		// wait 1 tick
		setTimeout(() => {
			expect(countOfExecutionOne).toBe(1);
			dispatcher.unbind(oneActionBinding);
			dispatcher.dispatch(new Action('MyName'));
			// wait 1 tick
			setTimeout(() => {
				expect(countOfExecutionOne).toBe(1);
				done();
			});
		});
	});

	it('should unbind multiple binded callbacks', (done: Function) => {
		var countOfExecutionOne = 0;
		var countOfExecutionTwo = 0;
		var dispatcher = new Dispatcher();
		var bothActionBinding = dispatcher.bind(['MyName', 'OtherName'], (action: Action) => {
			if (action.Name === 'MyName') {
				countOfExecutionOne++;
			}
			if (action.Name === 'OtherName') {
				countOfExecutionTwo++;
			}
		});
		dispatcher.dispatch(new Action('MyName'));
		dispatcher.dispatch(new Action('OtherName'));
		// wait 1 tick
		setTimeout(() => {
			expect(countOfExecutionOne).toBe(1);
			expect(countOfExecutionTwo).toBe(1);
			dispatcher.unbind(bothActionBinding);
			dispatcher.dispatch(new Action('MyName'));
			dispatcher.dispatch(new Action('OtherName'));
			// wait 1 tick
			setTimeout(() => {
				expect(countOfExecutionOne).toBe(1);
				expect(countOfExecutionTwo).toBe(1);
				done();
			});
		});
	});

	it('should unbind asterisk * binded callback', (done: Function) => {
		var countOfExecutionOne = 0;
		var dispatcher = new Dispatcher();
		var asteriskActionBinding = dispatcher.bind('*', (action: Action) => {
			countOfExecutionOne++;
		});
		dispatcher.dispatch(new Action('MyName'));
		dispatcher.dispatch(new Action('OtherName'));
		// wait 1 tick
		setTimeout(() => {
			expect(countOfExecutionOne).toBe(2);
			dispatcher.unbind(asteriskActionBinding);
			dispatcher.dispatch(new Action('MyName'));
			dispatcher.dispatch(new Action('OtherName'));
			// wait 1 tick
			setTimeout(() => {
				expect(countOfExecutionOne).toBe(2);
				done();
			});
		});
	});

	it('should throw exception if unbind more than once', (done: Function) => {
		var countOfExecutionOne = 0;
		var dispatcher = new Dispatcher();
		var asteriskActionBinding = dispatcher.bind('MyName', (action: Action) => {
			countOfExecutionOne++;
		});
		dispatcher.dispatch(new Action('MyName'));
		// wait 1 tick
		setTimeout(() => {
			expect(countOfExecutionOne).toBe(1);
			dispatcher.unbind(asteriskActionBinding);
			expect(() => dispatcher.unbind(asteriskActionBinding))
				.toThrow(new FluxDispatcherUnbindException('Try to unbind not binded ActionBinding'));
			done();
		});
	});
});
