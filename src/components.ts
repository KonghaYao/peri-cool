/**
 * MDX globals registry — components available inside MDX without `import`.
 * Wired via `<Content components={components} />` in `src/pages/[...slug].astro`
 * and the collection routes. Add new components here as you build (or install) them.
 */

import { Aside } from "./components/ui/aside";
import Render from "./components/Render.astro";
import { Card } from "./components/ui/card";
import { CardGrid } from "./components/ui/card-grid";
import { CodeGroup } from "./components/ui/code-group";
import { FileTree } from "./components/ui/file-tree";
import { LinkCard } from "./components/ui/link-card";
import { OpenUI } from "./components/openui";
import { PackageManagers } from "./components/ui/package-managers";
import { Step, Steps } from "./components/ui/steps";
import { Tabs, TabItem } from "./components/ui/tabs";

export const components = {
  Aside,
  Card,
  CardGrid,
  CodeGroup,
  FileTree,
  LinkCard,
  OpenUI,
  PackageManagers,
  Render,
  Step,
  Steps,
  TabItem,
  Tabs,
};
