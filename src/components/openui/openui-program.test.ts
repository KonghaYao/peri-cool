import { describe, expect, test } from "bun:test";
import { looksLikeOpenUIProgram, splitOpenUI } from "@peri-code/sdk/openui";
import { OpenUIProgram } from "@peri-code/sdk/openui/renderer";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

const SAMPLE = `root = Stack([t, s])
t = H2("测试")
s = Stat("42", "指标", "success")`;

describe("OpenUI 示例程序", () => {
	test("围栏程序可切分且完整", () => {
		const doc = splitOpenUI("```openui\n" + SAMPLE + "\n```", false);
		expect(doc.program).toBe(SAMPLE);
		expect(doc.complete).toBe(true);
	});

	test("裸程序可识别", () => {
		expect(looksLikeOpenUIProgram(SAMPLE)).toBe(true);
	});
});

describe("OpenUI 程序回退", () => {
	test("空内容不产生程序", () => {
		const doc = splitOpenUI("", false);
		expect(doc.program).toBeNull();
		expect(doc.complete).toBe(false);
		expect(doc.status).toBe("none");
		expect(doc.before).toBe("");
	});

	test("未闭合围栏保留片段并标记 open", () => {
		const doc = splitOpenUI("说明文字\n```openui\n" + SAMPLE, false);
		expect(doc.program).toBe(SAMPLE);
		expect(doc.complete).toBe(false);
		expect(doc.status).toBe("open");
		expect(doc.before).toBe("说明文字\n");
	});

	test("多个 OpenUI 围栏整体回退", () => {
		const fence = "```openui\n" + SAMPLE + "\n```";
		const doc = splitOpenUI(fence + "\n\n" + fence, false);
		expect(doc.program).toBeNull();
		expect(doc.complete).toBe(false);
		expect(doc.status).toBe("multiple");
		expect(doc.before).toBe(fence + "\n\n" + fence);
	});

	test("普通代码围栏里的 openui 标记不误识别", () => {
		const doc = splitOpenUI("```text\n```openui\nroot = Stack([])\n```", false);
		expect(doc.program).toBeNull();
		expect(doc.status).toBe("none");
	});

	test("非程序文本不识别为裸程序", () => {
		expect(looksLikeOpenUIProgram("")).toBe(false);
		expect(looksLikeOpenUIProgram("root = Card([])")).toBe(false);
	});

	test("校验失败时回退显示原文", () => {
		// Stat 的第一个参数在 parser 层可通过，但 zod 校验要求字符串。
		const program = 'root = Stack([s])\ns = Stat(true, "指标", "success")';
		const html = renderToStaticMarkup(
			createElement(OpenUIProgram, {
				program,
				isStreaming: false,
				actionsEnabled: false,
				fallbackText: program,
			}),
		);
		expect(html).toContain('data-openui-fallback="validation-failed"');
		expect(html).toContain("Stat(true");
		expect(html).not.toContain('data-slot="peri-openui"');
	});
});
