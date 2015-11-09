
import Dispatcher from '../../src/Flux/Dispatcher';
import Action from '../../src/Flux/Action';
import Signal from '../../src/Flux/Signal';
import {FluxDispatcherUnbindException} from '../../src/Flux/exceptions';

describe('Flux.Dispatcher', () => {

	it('should dispatch action to binded callbacks', (done: Function) => {
		var countOfExecutionOne = 0;
		var countOfExecutionTwo = 0;
		var dispatcher = new Dispatcher();
		dispatcher.bind(new Signal('MyName'), (action: Action<any>) => {
			expect(action.getName()).toBe('MyName');
			expect(action.getPayload()).toBe('MyPayload');
			expect(action.getSource()).toBe('MySource');
			expect(action.getTarget()).toBe('MyTarget');
			countOfExecutionOne++;
		});
		dispatcher.bind(new Signal('MyName'), (action: Action<any>) => {
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
		dispatcher.bind(new Signal('MyName'), (action: Action<any>) => {
			countOfExecutionOne++;
		});
		dispatcher.bind(new Signal('AnotherName'), (action: Action<any>) => {
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
		dispatcher.bind(new Signal('MyName'), (action: Action<any>) => {
			countOfExecutionOne++;
		});
		dispatcher.bind(new Signal('*'), (action: Action<any>) => {
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
		dispatcher.bind(new Signal('MyName'), (action: Action<any>) => {
			countOfExecutionOne++;
		});
		dispatcher.bind(new Signal('OtherName'), (action: Action<any>) => {
			countOfExecutionTwo++;
		});
		dispatcher.bind(new Signal('*'), (action: Action<any>) => {
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
		dispatcher.bind([new Signal('MyName'), new Signal('OtherName')], (action: Action<any>) => {
			if (action.getName() === 'MyName') {
				countOfExecutionOne++;
			}
			if (action.getName() === 'OtherName') {
				countOfExecutionTwo++;
			}
		});
		dispatcher.bind(new Signal('*'), (action: Action<any>) => {
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
		var oneActionBinding = dispatcher.bind(new Signal('MyName'), (action: Action<any>) => {
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
		var bothActionBinding = dispatcher.bind([new Signal('MyName'), new Signal('OtherName')], (action: Action<any>) => {
			if (action.getName() === 'MyName') {
				countOfExecutionOne++;
			}
			if (action.getName() === 'OtherName') {
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
		var asteriskActionBinding = dispatcher.bind(new Signal('*'), (action: Action<any>) => {
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
		var asteriskActionBinding = dispatcher.bind(new Signal('MyName'), (action: Action<any>) => {
			countOfExecutionOne++;
		});
		dispatcher.dispatch(new Action('MyName'));
		// wait 1 tick
		setTimeout(() => {
			expect(countOfExecutionOne).toBe(1);
			dispatcher.unbind(asteriskActionBinding);
			expect(() => dispatcher.unbind(asteriskActionBinding))
				.toThrow(new FluxDispatcherUnbindException('Try to unbind not binded Binding'));
			done();
		});
	});
});
