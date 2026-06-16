// TypeScript 6 requires explicit type declarations for side-effect CSS imports.
// Next.js 15 does not include this declaration in its bundled types.
declare module '*.css' {}
