/**
 * Bun 测试运行器的本地类型声明。
 *
 * 仓库用 `bun test` 运行测试，但没有安装 `bun-types` / `@types/bun`；
 * `astro check` 会因此报 “Cannot find module 'bun:test'”。这里只声明测试
 * 实际用到的 API，运行时仍由 Bun 提供模块实现。若之后引入官方类型包，
 * 删除本文件即可。
 */
declare module "bun:test" {
  type OpenUITestCallback = () => void | Promise<void>;

  export function describe(name: string, fn: OpenUITestCallback): void;
  export function test(name: string, fn: OpenUITestCallback): void;

  interface OpenUITestMatchers {
    toBe(expected: unknown): void;
    toEqual(expected: unknown): void;
    toThrow(expected?: string | RegExp): void;
    toBeGreaterThan(expected: number): void;
    toBeTruthy(): void;
    toBeFalsy(): void;
    toBeNull(): void;
    toContain(expected: unknown): void;
    readonly not: OpenUITestMatchers;
  }

  export function expect(actual: unknown): OpenUITestMatchers;
}
