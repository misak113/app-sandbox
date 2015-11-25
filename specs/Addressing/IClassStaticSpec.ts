
import IClassStatic from '../../src/Addressing/IClassStatic';

describe('Addressing.IClassStatic', () => {

	it('shoud type static class with constructor', () => {
		class MyClass {}
		const ClassStatic: IClassStatic<MyClass> = MyClass;
		expect(new ClassStatic() instanceof MyClass).toBeTruthy();
	});
});
