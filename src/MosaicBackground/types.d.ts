interface ElementCords {
  y: { top: number; bottom: number };
  x: { left: number; right: number };
  size: { width: number; height: number };
}

interface BasicRefData {
  range: number;
  elSquaresWithRange: SquaresObj[];
  grid?: [number, number];
  centerGrid?: number;
}

interface OpenMosaicData extends BasicRefData {
  minSize: number;
}
interface GlowData extends BasicRefData {
  color: string;
  duration: number;
  delay: number;
  loopDelay: number;
}

interface AnimationData {
  id: string;
  cords: ElementCords;
  glow?: GlowData;
  openMosaic: OpenMosaicData;
}
