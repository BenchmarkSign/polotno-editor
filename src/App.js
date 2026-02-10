import React from "react";
import { PolotnoContainer, SidePanelWrap, WorkspaceWrap } from "polotno";
import { Toolbar } from "polotno/toolbar/toolbar";
import { PagesTimeline } from "polotno/pages-timeline";
import { ZoomButtons } from "polotno/toolbar/zoom-buttons";
import { SidePanel } from "polotno/side-panel";
import { Workspace } from "polotno/canvas/workspace";

import "@blueprintjs/core/lib/css/blueprint.css";
import { createStore } from "polotno/model/store";
// ===== SIGN SIZE SETTINGS =====
const DPI = 300;

const inches = (wIn, hIn) => ({
  width: Math.round(wIn * DPI),
  height: Math.round(hIn * DPI),
});

const PRESETS = {
  yard_24x18: inches(24, 18),
  banner_48x24: inches(48, 24),
};

const store = createStore({
  key: "demo",
  showCredit: true,
});

store.addPage(PRESETS.yard_24x18);
 // <-- IMPORTANT: without a page you can get a blank workspace

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
