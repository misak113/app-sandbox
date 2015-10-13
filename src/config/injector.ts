/// <reference path="../../node_modules/di-ts/di-ts.d.ts" />

var assign = (Object as any).assign;
import {Injector} from 'di-ts';
// TODO traceur of di-ts -> di bad override Object.assign function. This should set back right function body
(Object as any).assign = assign;

var injector = new Injector();
export default injector;
