import { describe, it, expect } from "vitest";
import { CANON_DATA, CANON_DATA_ENGLISH } from "./canon-data";

describe("canon-data", () => {
  describe("CANON_DATA", () => {
    it("should be an array", () => {
      expect(Array.isArray(CANON_DATA)).toBe(true);
    });

    it("should have elements", () => {
      expect(CANON_DATA.length).toBeGreaterThan(0);
    });

    it("each phase should have id, num, title, and theme", () => {
      CANON_DATA.forEach(phase => {
        expect(phase).toHaveProperty("id");
        expect(phase).toHaveProperty("num");
        expect(phase).toHaveProperty("title");
        expect(phase).toHaveProperty("theme");
      });
    });
  });

  describe("CANON_DATA_ENGLISH", () => {
    it("should be an array", () => {
      expect(Array.isArray(CANON_DATA_ENGLISH)).toBe(true);
    });

    it("should have elements", () => {
      expect(CANON_DATA_ENGLISH.length).toBeGreaterThan(0);
    });

    it("each phase should have id, num, title, and theme", () => {
      CANON_DATA_ENGLISH.forEach(phase => {
        expect(phase).toHaveProperty("id");
        expect(phase).toHaveProperty("num");
        expect(phase).toHaveProperty("title");
        expect(phase).toHaveProperty("theme");
      });
    });
  });
});
