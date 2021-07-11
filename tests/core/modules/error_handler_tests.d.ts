import { Controller } from "../..";
declare class ErrorWhileConnectingController extends Controller {
    connect(): void;
}
declare const ErrorHandlerTests_base: any;
export default class ErrorHandlerTests extends ErrorHandlerTests_base {
    controllerConstructor: typeof ErrorWhileConnectingController;
    setupApplication(): Promise<void>;
    "test errors in connect are thrown and handled by built in logger"(): Promise<void>;
    "test errors in connect are thrown and handled by window.onerror"(): Promise<void>;
}
export {};
