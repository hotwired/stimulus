declare const ValueTests_base: any;
export default class ValueTests extends ValueTests_base {
    fixtureHTML: string;
    "test string values"(): void;
    "test numeric values"(): void;
    "test boolean values"(): void;
    "test array values"(): void;
    "test object values"(): void;
    "test accessing a string value returns the empty string when the attribute is missing"(): void;
    "test accessing a numeric value returns zero when the attribute is missing"(): void;
    "test accessing a boolean value returns false when the attribute is missing"(): void;
    "test accessing an array value returns an empty array when the attribute is missing"(): void;
    "test accessing an object value returns an empty object when the attribute is missing"(): void;
    "test changed callbacks"(): Promise<void>;
    "test changed callbacks for object"(): Promise<void>;
    "test default values trigger changed callbacks"(): Promise<void>;
    "test keys may be specified in kebab-case"(): void;
    has(name: string): any;
    get(name: string): any;
    set(name: string, value: string): any;
    attr(name: string): string;
    get element(): any;
}
export {};
