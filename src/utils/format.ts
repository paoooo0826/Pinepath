export const peso = (n:number) => new Intl.NumberFormat('en-PH',{style:'currency',currency:'PHP',maximumFractionDigits:0}).format(n)
export const timeLabel = (n:number) => new Date(2020,0,1,Math.floor(n/60),n%60).toLocaleTimeString('en-PH',{hour:'numeric',minute:'2-digit'})
export const dateLabel = (s:string, opts:Intl.DateTimeFormatOptions={month:'short',day:'numeric',weekday:'short'}) => new Date(`${s}T12:00:00`).toLocaleDateString('en-PH',opts)
export function addDays(s:string,n:number){const d=new Date(`${s}T12:00:00`);d.setDate(d.getDate()+n);return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-')}
export const todayLocal = () => {const d=new Date();return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-')}
export function distanceKm(a:{latitude:number;longitude:number},b:{latitude:number;longitude:number}){const r=6371, rad=Math.PI/180, x=(b.latitude-a.latitude)*rad, y=(b.longitude-a.longitude)*rad;return 2*r*Math.asin(Math.sqrt(Math.sin(x/2)**2+Math.cos(a.latitude*rad)*Math.cos(b.latitude*rad)*Math.sin(y/2)**2))}
export function travelMinutes(a:{latitude:number;longitude:number},b:{latitude:number;longitude:number}){return Math.max(10,Math.min(55,Math.round(8+distanceKm(a,b)*7)))}
