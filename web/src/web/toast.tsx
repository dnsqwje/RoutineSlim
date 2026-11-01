import { useEffect, useState } from 'react';
export function notify(message: string) { window.dispatchEvent(new CustomEvent('routineslim:toast', {detail: message})); }
export function Toast() {
 const [message, setMessage] = useState('');
 useEffect(() => { let timer: ReturnType<typeof setTimeout>; const onMessage = (e: Event) => {setMessage((e as CustomEvent<string>).detail); clearTimeout(timer); timer = setTimeout(() => setMessage(''), 5000);}; window.addEventListener('routineslim:toast', onMessage); return () => {clearTimeout(timer); window.removeEventListener('routineslim:toast', onMessage);}; }, []);
 return message ? <div className="toast" role="status">{message}</div> : null;
}
