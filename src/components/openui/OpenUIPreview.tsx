import { installOpenUITheme } from "@peri-code/sdk/openui";
import { OpenUIErrorBoundary, OpenUIProgram } from "@peri-code/sdk/openui/renderer";
import { useEffect, useState } from "react";

// 主题桥只读 document 上的三个 CSS 变量。放到 effect 里安装：SSR 产物与客户端
// 首次渲染都用 SDK 的浅色默认值，避免暗色站点上 hydration 前后样式不一致；
// 水合后再按站点当前主题重放。
let themeInstalled = false;

interface Props {
  program: string;
}

/**
 * OpenUI 渲染岛。
 *
 * `actionsEnabled={false}`：文档站没有会话通道，表单控件与按钮保持禁用。
 * `fallbackText` + 错误边界：解析或渲染失败时回退到原文，不白屏。
 */
export default function OpenUIPreview({ program }: Props) {
  // 跨 ClientRouter 导航时 SDK 的模块级主题 store 保留为上一页的颜色，
  // 而新页面的 SSR HTML 仍是 SDK 浅色默认值。React 19 水合只警告、不修补
  // 属性差异，所以已安装过主题的 island 需要重建一次子树，用当前 store
  // 重新渲染；首次安装时 store 变化会触发正常更新，无需重建。
  // 水合阶段的 React 开发警告仍可能出现，这里保证的是水合后的 DOM 正确。
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    if (!themeInstalled) {
      themeInstalled = true;
      installOpenUITheme();
      return;
    }
    setRevision((value) => value + 1);
  }, []);

  return (
    <OpenUIErrorBoundary
      fallback={<pre className="openui-fallback">{program}</pre>}
      resetKey={program}
    >
      <OpenUIProgram
        key={revision}
        program={program}
        isStreaming={false}
        actionsEnabled={false}
        fallbackText={program}
      />
    </OpenUIErrorBoundary>
  );
}
