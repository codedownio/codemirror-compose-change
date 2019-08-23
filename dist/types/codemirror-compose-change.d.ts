import * as CoordinateChanges from "./CoordinateChanges";
import * as ComposeChanges from "./ComposeChanges";
export declare class TestRunner {
    static runFixedTests(): void;
    static runRandomTests(repeats?: number, delay?: number): void;
    static repeatLastTest(): void;
}
export declare const composeChanges: typeof ComposeChanges.composeChanges;
export declare const preEditToPostEditChangeRange: typeof CoordinateChanges.preEditToPostEditChangeRange;
