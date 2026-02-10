import React, { useEffect, useState } from "react";
import { PolotnoContainer, SidePanelWrap, WorkspaceWrap } from "polotno";
import { Toolbar } from "polotno/toolbar/toolbar";
import { PagesTimeline } from "polotno/pages-timeline";
import { ZoomButtons } from "polotno/toolbar/zoom-buttons";
import { SidePanel } from "polotno/side-panel";
import { Workspace } from "polotno/canvas/workspace";
import { createStore } from "polotno/model/store";

import "@blueprintjs/core/lib/css/blueprint.css";
import { Button, ButtonGroup } from "@blueprintjs/core";

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
  yard: inches(24, 18, 300), // 7200 x 5400 px
  // Banner: 4ft x 2ft (48x24) @ 150 DPI
  banner: inches(48, 24, 150), // 7200 x 3600 px
};

// =====================================
// STORE
// =====================================
const store = createStore({
  key: "demo",
  showCredit: true,
});

// Ensure at least one page exists (default yard sign)
if (!store.pages.length) {
  store.addPage({ width: PRESETS.yard.width, height: PRESETS.yard.height });
}

// =====================================
// HELPERS
// =====================================
const getProductFromUrl = () => {
  const params = new URLSearchParams(window.location.search);
  const product = params.get("product");
  return product === "banner" ? "banner" : "yard";
};

const setUrlProduct = (product) => {
  const url = new URL(window.location.href);
  url.searchParams.set("product", product);
  window.history.replaceState({}, "", url.toString());
};

const applyPresetToFirstPage = (preset) => {
  const page = store.pages[0];
  if (!page) return;

  page.set({
    width: preset.width,
    height: preset.height,
  });
};

// =====================================
// APP
// =====================================
export default function App() {
  const [product, setProduct] = useState(getProductFromUrl());
  const [allowResize, setAllowResize] = useState(false);

  // On first load: apply correct size based on URL and lock sizing by default
  useEffect(() => {
    const initialProduct = getProductFromUrl();
    setProduct(initialProduct);
    applyPresetToFirstPage(PRESETS[initialProduct]);

    // Lock sizing by default (Option A)
    store.set({ pageControlsEnabled: false });
    setAllowResize(false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const choose = (nextProduct) => {
    setProduct(nextProduct);
    setUrlProduct(nextProduct);
    applyPresetToFirstPage(PRESETS[nextProduct]);

    // When switching presets, re-lock sizing (users can unlock again if they want)
    store.set({ pageControlsEnabled: false });
    setAllowResize(false);
  };

  const toggleCustomSize = () => {
    const next = !allowResize;
    setAllowResize(next);
    store.set({ pageControlsEnabled: next });
  };

  return (
    <PolotnoContainer style={{ width: "100vw", height: "100vh" }}>
      <SidePanelWrap>
        <SidePanel store={store} />
      </SidePanelWrap>

      <WorkspaceWrap>
        {/* Top selector bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "8px 10px",
            borderBottom: "1px solid rgba(0,0,0,0.08)",
          }}
        >
          <ButtonGroup>
            <Button
              intent={product === "yard" ? "primary" : "none"}
              onClick={() => choose("yard")}
            >
              Yard Sign (24×18)
            </Button>
            <Button
              intent={product === "banner" ? "primary" : "none"}
              onClick={() => choose("banner")}
            >
              Banner (4×2)
            </Button>
          </ButtonGroup>

          <Button
            intent={allowResize ? "warning" : "none"}
            onClick={toggleCustomSize}
          >
            {allowResize ? "Sizing Unlocked (Custom)" : "Custom Size"}
          </Button>

          <div style={{ marginLeft: "auto", opacity: 0.7, fontSize: 12 }}>
            Standard: Yard Signs 300 DPI • Banners 150 DPI
          </div>
        </div>

        <Toolbar store={store} downloadButtonEnabled />
        <Workspace store={store} />
        <ZoomButtons store={store} />
        <PagesTimeline store={store} />
      </WorkspaceWrap>
    </PolotnoContainer>
  );
}
