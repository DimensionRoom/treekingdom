import { createPortal } from "react-dom";

/**
 * Renders children into <body>, escaping the caller's stacking context.
 *
 * The detail pages are `fixed inset-0 top-16 z-20`, and a positioned element
 * with a z-index creates a stacking context — so every overlay rendered inside
 * one of them is pinned to that z-20 layer no matter how high its own z-index
 * goes, and the z-50 header paints over it. That is why a z-[60] sheet still
 * ended up with its top 64px hidden behind the navbar.
 *
 * Portalling lifts the overlay into the root stacking context, where the
 * z-[60]/z-[70] values it already declares finally mean what they say.
 *
 * No `document` guard: the app is client-rendered throughout — scripts/seoPlugin.ts
 * only rewrites <head> at build time and never renders a React tree.
 */
const Portal = ({ children }: { children: React.ReactNode }) => createPortal(children, document.body);

export default Portal;
