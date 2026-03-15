export default interface TocAnchor {
  id: string;
  textContent: string;
  level: number;
  isActive: boolean;
  isScrolledOver: boolean;
  pos: number;
  dom: HTMLElement;
}
