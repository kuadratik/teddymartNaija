// global.d.ts
export {}

declare global {
  interface Window {
    google: any // You can change 'any' to more specific types if you know them
  }
}
