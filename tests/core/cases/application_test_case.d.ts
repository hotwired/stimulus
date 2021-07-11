import { Application } from "../../application";
import { DOMTestCase } from "@stimulus/test";
import { Schema } from "../../schema";
export declare class ApplicationTestCase extends DOMTestCase {
    schema: Schema;
    application: Application;
    runTest(testName: string): Promise<void>;
    setupApplication(): void;
}
