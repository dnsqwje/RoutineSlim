import { useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
/** Browser portal that also works when React StrictMode replays mount effects. */
export function Modal({visible = true, children, onRequestClose, accessibilityLabel}: {
 visible?: boolean; children: ReactNode; onRequestClose?: () => void; accessibilityLabel?: string;
 transparent?: boolean; animationType?: string; statusBarTranslucent?: boolean;
}) {
 const ref = useRef<HTMLDivElement>(null);
 const close = useRef(onRequestClose); close.current = onRequestClose;
 useEffect(() => {
   if (!visible) return;
   const previous = document.activeElement as HTMLElement | null;
   const focusable = () => [...(ref.current?.querySelectorAll<HTMLElement>('button:not([disabled]),input,textarea,[tabindex="0"]') ?? [])];
   const timer = setTimeout(() => focusable()[0]?.focus(), 0);
   const key = (event: KeyboardEvent) => {
     if (event.key === 'Escape') close.current?.();
     if (event.key === 'Tab') {
       const items=focusable(), first=items[0], last=items.at(-1);
       if (event.shiftKey && document.activeElement === first) {event.preventDefault(); last?.focus();}
       else if (!event.shiftKey && document.activeElement === last) {event.preventDefault(); first?.focus();}
     }
   };
   document.addEventListener('keydown',key);
   return () => {clearTimeout(timer); document.removeEventListener('keydown',key); previous?.focus();};
 }, [visible]);
 return visible ? createPortal(<div ref={ref} role="dialog" aria-modal="true" aria-label={accessibilityLabel} className="app-modal">{children}</div>, document.body) : null;
}
