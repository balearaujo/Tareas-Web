import { it, describe, expect } from "vitest";
import { generateSixDigitCode } from "../../../src/utils/generateCode.util";

describe("generate six digit code test", ()=>{
    it("should generate a numeric code with 6 digits", ()=>{
        const code = generateSixDigitCode();
        expect(typeof code).toBe("string");
        expect(code).toMatch(/^\d{6}$/);
    });

    it("should generate not null code", ()=>{
        const code = generateSixDigitCode();
        expect(code).toBeTruthy();
    });

    it("should generate different codes", ()=>{
        const codes = new Set<string>();
        for (let i = 0; i < 50; i++) {
        codes.add(generateSixDigitCode());
        }
        expect(codes.size).toBeGreaterThan(1);
    } );

    it("should generate codes between 100000 and 999999", ()=>{
        const code = Number(generateSixDigitCode());
        expect(code).toBeGreaterThanOrEqual(100000);
        expect(code).toBeLessThanOrEqual(999999);
    });
});