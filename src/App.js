import React from "react";
import { PolotnoContainer, SidePanelWrap, WorkspaceWrap } from "polotno";
import { Toolbar } from "polotno/toolbar/toolbar";
import { PagesTimeline } from "polotno/pages-timeline";
import { ZoomButtons } from "polotno/toolbar/zoom-buttons";
import { SidePanel } from "polotno/side-panel";
import { Workspace } from "polotno/canvas/workspace";
import { createStore } from "polotno/model/store";
import "@blueprintjs/core/lib/css/blueprint.css";

// =====================================
// SIZE HELPERS (supports per-product DPI)
// =====================================
const inches = (wIn, hIn, dpi) => ({
  width: Math.round(wIn * dpi),
  height: Math.round(hIn * dpi),
});

// =====================================
// PRODUCT PRESETS
// =====================================
const PRESETS = {
  // Yard sign: 24x18 @ 300 DPI
  yard: inches(24, 18, 300),      // 7200 x 5400 px

  // Banner: 4ft x 2ft (48x24) @ 150 DPI
  banner: inches(48, 24, 150),    // 7200 x 3600 px
};

// =====================================
// STORE
// =====================================
const store = createStore({
  key: "demo",
  showCredit: true,
});

// =====================================
// PAGE SETUP (URL-BASED + FORCED SIZE)
// =====================================
const params = new URLSearchParams(window.location.search);
const product = params.get("product"); // "yard" | "banner"

const preset = product === "banner" ? PRESETS.banner : PRESETS.yard;

// Always force correct size (prevents square/default canvas)
if (store.pages.length) {
  store.pages[0].set({
    width: preset.width,
    height: preset.height,
  });
} else {
  store.addPage({
    width: preset.width,
    height: preset.height,
  });
}

// =====================================
// APP
// =====================================
export default function App() {
  return (
    <PolotnoContainer style={{ width: "100vw", height: "100vh" }}>
      <SidePanelWrap>
        <SidePanel store={store} />
      </SidePanelWrap>

      <WorkspaceWrap>
        <Toolbar store={store} downloadButtonEnabled />
        <Workspace store={store} />
        <ZoomButtons store={store} />
        <PagesTimeline store={store} />
      </WorkspaceWrap>
    </PolotnoContainer>
  );
}
