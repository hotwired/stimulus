import { ActionLogEntry } from "../controllers/log_controller";
import { ControllerConstructor } from "../..";
declare const LogControllerTestCase_base: any;
export declare class LogControllerTestCase extends LogControllerTestCase_base {
    controllerConstructor: ControllerConstructor & {
        actionLog: ActionLogEntry[];
    };
    setup(): Promise<void>;
    assertActions(...actions: any[]): void;
    assertNoActions(): void;
    get actionLog(): ActionLogEntry[];
}
export {};
