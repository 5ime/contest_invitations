declare module 'opentype.js' {
  export interface Font {
    getPath(text: string, x: number, y: number, fontSize: number): {
      getBoundingBox(): { x1: number, y1: number, x2: number, y2: number }
      toPathData(decimalPlaces?: number): string
    }
    charToGlyph(char: string): {
      index: number
      path?: { commands?: unknown[] }
    }
  }

  export function parse(buffer: ArrayBuffer): Font
}
