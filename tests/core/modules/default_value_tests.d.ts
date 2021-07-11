declare const DefaultValueTests_base: any;
export default class DefaultValueTests extends DefaultValueTests_base {
    fixtureHTML: string;
    "test custom default boolean values"(): void;
    "test should be able to set a new value for custom default boolean values"(): void;
    "test should override custom default boolean value with given data-attribute"(): void;
    "test custom default string values"(): void;
    "test should be able to set a new value for custom default string values"(): void;
    "test should override custom default string value with given data-attribute"(): void;
    "test custom default number values"(): void;
    "test should be able to set a new value for custom default number values"(): void;
    "test should override custom default number value with given data-attribute"(): void;
    "test custom default array values"(): void;
    "test should be able to set a new value for custom default array values"(): void;
    "test should override custom default array value with given data-attribute"(): void;
    "test custom default object values"(): void;
    "test should be able to set a new value for custom default object values"(): void;
    "test should override custom default object value with given data-attribute"(): void;
    has(name: string): any;
    get(name: string): any;
    set(name: string, value: string): any;
    attr(name: string): string;
    get element(): any;
}
export {};
