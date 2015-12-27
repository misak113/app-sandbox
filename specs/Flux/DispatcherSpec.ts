
import Dispatcher from '../../src/Flux/Dispatcher';
import Action from '../../src/Flux/Action';
import {FluxDispatcherUnbindException} from '../../src/Flux/exceptions';

describe('Flux.Dispatcher', () => {

	class MyAction extends Action<{}> { }
	class AnotherAction extends Action<{}> { }
	class DifferentAction extends Action<{}> { }

	it('should dispatch action to binded callbacks', (done: Function) => {
		let countOfExecutionOne = 0;
		let countOfExecutionTwo = 0;
		const dispatcher = new Dispatcher();
		dispatcher.bind(MyAction, (action: MyAction) => {
			expect(action instanceof MyAction).toBeTruthy();
			expect(action.getPayload()).toBe('MyPayload');
			expect(action.getSource()).toBe('MySource');
			expect(action.getTarget()).toBe('MyTarget');
			countOfExecutionOne++;
		});
		dispatcher.bind(MyAction, (action: MyAction) => {
			countOfExecutionTwo++;
		});
		dispatcher.dispatch(new MyAction('MyPayload', 'MySource', 'MyTarget'));
		// wait 1 tick
		setTimeout(() => {
			expect(countOfExecutionOne).toBe(1);
			expect(countOfExecutionTwo).toBe(1);
			done();
		});
	});

	it('should not dispatch action to binded callbacks with other name', (done: Function) => {
		let countOfExecutionOne = 0;
		let countOfExecutionTwo = 0;
		const dispatcher = new Dispatcher();
		dispatcher.bind(MyAction, (action: MyAction) => {
			countOfExecutionOne++;
		});
		dispatcher.bind(AnotherAction, (action: AnotherAction) => {
			countOfExecutionTwo++;
		});
		dispatcher.dispatch(new MyAction());
		// wait 1 tick
		setTimeout(() => {
			expect(countOfExecutionOne).toBe(1);
			expect(countOfExecutionTwo).toBe(0);
			done();
		});
	});

	it('should dispatch action to binded * asterisk callback', (done: Function) => {
		let countOfExecutionOne = 0;
		let countOfExecutionTwo = 0;
		const dispatcher = new Dispatcher();
		dispatcher.bind(MyAction, (action: MyAction) => {
			countOfExecutionOne++;
		});
		dispatcher.bind(Action, (action: Action<any>) => {
			countOfExecutionTwo++;
		});
		dispatcher.dispatch(new MyAction());
		dispatcher.dispatch(new AnotherAction());
		// wait 1 tick
		setTimeout(() => {
			expect(countOfExecutionOne).toBe(1);
			expect(countOfExecutionTwo).toBe(2);
			done();
		});
	});

	it('should dispatch action to binded callbacks does not depend on order of bind/dispatch call', (done: Function) => {
		let countOfExecutionOne = 0;
		let countOfExecutionTwo = 0;
		let countOfExecutionThree = 0;
		const dispatcher = new Dispatcher();
		dispatcher.dispatch(new MyAction());
		dispatcher.dispatch(new AnotherAction());
		dispatcher.dispatch(new DifferentAction());
		dispatcher.bind(MyAction, (action: MyAction) => {
			countOfExecutionOne++;
		});
		dispatcher.bind(AnotherAction, (action: AnotherAction) => {
			countOfExecutionTwo++;
		});
		dispatcher.bind(Action, (action: Action<any>) => {
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
		let countOfExecutionOne = 0;
		let countOfExecutionTwo = 0;
		let countOfExecutionThree = 0;
		const dispatcher = new Dispatcher();
		dispatcher.bind([MyAction, AnotherAction], (action: MyAction|AnotherAction) => {
			if (action instanceof MyAction) {
				countOfExecutionOne++;
			}
			if (action instanceof AnotherAction) {
				countOfExecutionTwo++;
			}
		});
		dispatcher.bind(Action, (action: Action<any>) => {
			countOfExecutionThree++;
		});
		dispatcher.dispatch(new MyAction());
		dispatcher.dispatch(new AnotherAction());
		dispatcher.dispatch(new DifferentAction());
		// wait 1 tick
		setTimeout(() => {
			expect(countOfExecutionOne).toBe(1);
			expect(countOfExecutionTwo).toBe(1);
			expect(countOfExecutionThree).toBe(3);
			done();
		});
	});

	it('should unbind binded callbacks', (done: Function) => {
		let countOfExecutionOne = 0;
		const dispatcher = new Dispatcher();
		const oneActionBinding = dispatcher.bind(MyAction, (action: MyAction) => {
			countOfExecutionOne++;
		});
		dispatcher.dispatch(new MyAction());
		// wait 1 tick
		setTimeout(() => {
			expect(countOfExecutionOne).toBe(1);
			dispatcher.unbind(oneActionBinding);
			dispatcher.dispatch(new MyAction());
			// wait 1 tick
			setTimeout(() => {
				expect(countOfExecutionOne).toBe(1);
				done();
			});
		});
	});

	it('should unbind multiple binded callbacks', (done: Function) => {
		let countOfExecutionOne = 0;
		let countOfExecutionTwo = 0;
		const dispatcher = new Dispatcher();
		const bothActionBinding = dispatcher.bind([MyAction, AnotherAction], (action: MyAction|AnotherAction) => {
			if (action instanceof MyAction) {
				countOfExecutionOne++;
			}
			if (action instanceof AnotherAction) {
				countOfExecutionTwo++;
			}
		});
		dispatcher.dispatch(new MyAction());
		dispatcher.dispatch(new AnotherAction());
		// wait 1 tick
		setTimeout(() => {
			expect(countOfExecutionOne).toBe(1);
			expect(countOfExecutionTwo).toBe(1);
			dispatcher.unbind(bothActionBinding);
			dispatcher.dispatch(new MyAction());
			dispatcher.dispatch(new AnotherAction());
			// wait 1 tick
			setTimeout(() => {
				expect(countOfExecutionOne).toBe(1);
				expect(countOfExecutionTwo).toBe(1);
				done();
			});
		});
	});

	it('should unbind asterisk * binded callback', (done: Function) => {
		let countOfExecutionOne = 0;
		const dispatcher = new Dispatcher();
		const asteriskActionBinding = dispatcher.bind(Action, (action: Action<any>) => {
			countOfExecutionOne++;
		});
		dispatcher.dispatch(new MyAction());
		dispatcher.dispatch(new AnotherAction());
		// wait 1 tick
		setTimeout(() => {
			expect(countOfExecutionOne).toBe(2);
			dispatcher.unbind(asteriskActionBinding);
			dispatcher.dispatch(new MyAction());
			dispatcher.dispatch(new AnotherAction());
			// wait 1 tick
			setTimeout(() => {
				expect(countOfExecutionOne).toBe(2);
				done();
			});
		});
	});

	it('should throw exception if unbind more than once', (done: Function) => {
		let countOfExecutionOne = 0;
		const dispatcher = new Dispatcher();
		const asteriskActionBinding = dispatcher.bind(MyAction, (action: MyAction) => {
			countOfExecutionOne++;
		});
		dispatcher.dispatch(new MyAction());
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
