import { Token, ValueListObserverDelegate } from "../..";
import { ObserverTestCase } from "../observer_test_case";
export interface Value {
    id: number;
    token: Token;
}
export default class ValueListObserverTests extends ObserverTestCase implements ValueListObserverDelegate<Value> {
    attributeName: string;
    fixtureHTML: string;
    observer: any;
    lastValueId: number;
    "test elementMatchedValue"(): Promise<void>;
    "test adding a token to the right"(): Promise<void>;
    "test adding a token to the left"(): Promise<void>;
    "test removing a token from the right"(): Promise<void>;
    "test removing a token from the left"(): Promise<void>;
    "test removing the only token"(): Promise<void>;
    "test removing and re-adding a token produces a new value"(): Promise<void>;
    get element(): any;
    set valueString(value: string);
    parseValueForToken(token: Token): {
        id: number;
        token: any;
    };
    elementMatchedValue(element: Element, value: Value): void;
    elementMatchedNoValue(token: Token): void;
    elementUnmatchedValue(element: Element, value: Value): void;
}
