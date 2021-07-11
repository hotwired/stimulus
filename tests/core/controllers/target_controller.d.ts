import { Controller } from "../../controller";
declare class BaseTargetController extends Controller {
    static targets: string[];
    alphaTarget: Element | null;
    alphaTargets: Element[];
    hasAlphaTarget: boolean;
}
export declare class TargetController extends BaseTargetController {
    static classes: string[];
    static targets: string[];
    static values: {
        inputTargetConnectedCallCount: NumberConstructor;
        inputTargetDisconnectedCallCount: NumberConstructor;
    };
    betaTarget: Element | null;
    betaTargets: Element[];
    hasBetaTarget: boolean;
    inputTarget: Element | null;
    inputTargets: Element[];
    hasInputTarget: boolean;
    hasConnectedClass: boolean;
    hasDisconnectedClass: boolean;
    connectedClass: string;
    disconnectedClass: string;
    inputTargetConnectedCallCountValue: number;
    inputTargetDisconnectedCallCountValue: number;
    inputTargetConnected(element: Element): void;
    inputTargetDisconnected(element: Element): void;
}
export {};
