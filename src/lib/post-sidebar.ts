import type { SidebarItem } from "@cloudflare/nimbus-docs/types";
import type { postSidebar } from "./content";

type PeriSidebarGroups = ReturnType<typeof postSidebar>;

/**
 * peri 的「主题 → 文章」两层侧栏（`lib/content.ts` 治理）→ Nimbus 的
 * `SidebarItem` 树。Nimbus 侧栏项是带判别标签的联合类型，`type` 与
 * `order` 必填；peri 侧只有 `label`/`link`，转换发生在这里。
 */
export function toNimbusSidebar(groups: PeriSidebarGroups): SidebarItem[] {
  return groups.map((group, groupIndex) => ({
    type: "group",
    label: group.label,
    order: groupIndex,
    children: group.items.map((item, itemIndex) => ({
      type: "link",
      label: item.label,
      href: item.link,
      order: itemIndex,
    })),
  }));
}
