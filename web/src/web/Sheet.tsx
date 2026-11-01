import { useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
export function Sheet({title, onClose, children}: {title: string; onClose: () => void; children: ReactNode}) {
 const ref = useRef<HTMLElement>(null);
 const closeRef = useRef(onClose); closeRef.current = onClose;
 useEffect(() => {
   const previous = document.activeElement as HTMLElement | null;
   const node = ref.current!;
   const focusable = () => [...node.querySelectorAll<HTMLElement>('button:not([disabled]), input, textarea, select, [tabindex="0"]')];
   focusable()[0]?.focus();
   const key = (e: KeyboardEvent) => {
     if (e.key === 'Escape') closeRef.current();
     if (e.key === 'Tab') { const items = focusable(); const first = items[0]; const last = items.at(-1); if (e.shiftKey && document.activeElement === first) {e.preventDefault(); last?.focus();} else if (!e.shiftKey && document.activeElement === last) {e.preventDefault(); first?.focus();} }
   };
   document.addEventListener('keydown', key);
   return () => {document.removeEventListener('keydown', key); previous?.focus();};
 }, []);
 return createPortal(<div className="sheet-backdrop" onClick={onClose}><section ref={ref} role="dialog" aria-modal="true" aria-label={title} className="web-sheet" onClick={e => e.stopPropagation()}><div className="sheet-handle"/><header><h2>{title}</h2><button className="icon-button" aria-label="닫기" onClick={onClose}>×</button></header><div className="sheet-content">{children}</div></section></div>, document.body);
}
