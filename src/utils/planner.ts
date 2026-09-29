import { byId, destinations } from '../data/destinations'
import type { DayPlan, Destination, Preferences, Stop, Trip } from '../types'
import { addDays, distanceKm, todayLocal, travelMinutes } from './format'

export const defaultPreferences = ():Preferences => ({startDate:todayLocal(),days:2,travelers:2,budget:5000,pace:'Balanced',interests:['Nature','Food','Culture'],withKids:false,seniorFriendly:false,rainyDay:false,lowBudget:false})
export const limitFor = (pace:Preferences['pace']) => ({Relaxed:2,Balanced:3,Packed:4})[pace]

function score(d:Destination,p:Preferences,previous:Destination|undefined,used:Set<string>,day:number,variation:number){
  if(used.has(d.id)||d.openingTime>=19) return -999
  let n=d.popularity/20 + d.tags.filter(t=>p.interests.includes(t)).length*3 + (p.interests.includes(d.category)?4:0)
  if(p.withKids&&!d.familyFriendly) n-=9
  if(p.seniorFriendly&&!d.seniorFriendly) n-=12
  if(p.rainyDay) n+=d.rainFriendly?7:-5
  if(p.lowBudget||p.budget<1800*p.days) n-=d.entranceFee/28
  if(previous) n-=distanceKm(previous,d)*2.2
  n+=((d.id.length*7+day*11+variation*13)%17)/18
  return n
}

export function schedule(ids:string[],date:string):DayPlan{
  let cursor=9*60,previous:Destination|undefined
  const stops:Stop[]=[]
  for(const id of ids){
    const d=byId(id);if(!d)continue
    const transfer=previous?travelMinutes(previous,d):0
    let arrival=Math.max(cursor+transfer,d.openingTime*60)
    if(arrival<12*60 && arrival+d.duration>12*60) arrival=13*60
    else if(arrival>=12*60&&arrival<13*60)arrival=13*60
    if(d.openingTime>=19)arrival=Math.max(arrival,d.openingTime*60)
    if(arrival+d.duration>d.closingTime*60)continue
    if(previous&&stops.length)stops[stops.length-1].travelMinutes=transfer
    stops.push({id,time:arrival,travelMinutes:0});cursor=arrival+d.duration;previous=d
  }
  return {date,stops}
}

export function generateTrip(p:Preferences,variation=0,excludeIds:string[]=[]):Trip{
  const used=new Set(excludeIds),days:DayPlan[]=[]
  for(let day=0;day<p.days;day++){
    const ids:string[]=[];let previous:Destination|undefined
    for(let slot=0;slot<limitFor(p.pace);slot++){
      const candidates=destinations.map(d=>({d,n:score(d,p,previous,used,day,variation+slot)})).sort((a,b)=>b.n-a.n)
      let chosen:Destination|undefined
      for(const {d,n} of candidates){if(n< -20)break;const trial=schedule([...ids,d.id],addDays(p.startDate,day));if(trial.stops.length===ids.length+1&&trial.stops.at(-1)!.time<17*60){chosen=d;break}}
      if(!chosen)break
      ids.push(chosen.id);used.add(chosen.id);previous=chosen
    }
    days.push(schedule(ids,addDays(p.startDate,day)))
  }
  return {id:crypto.randomUUID(),name:`Baguio escape · ${addDays(p.startDate,0)}`,preferences:p,days,updatedAt:new Date().toISOString()}
}

export function updateDay(trip:Trip,index:number,ids:string[]):Trip{
  const days=trip.days.map((day,i)=>i===index?schedule(ids,day.date):day)
  return {...trip,days,updatedAt:new Date().toISOString()}
}

export function regenerateDay(trip:Trip,index:number,variation:number):Trip{
  const used=trip.days.flatMap((d,i)=>i===index?[]:d.stops.map(s=>s.id))
  const p={...trip.preferences,days:1,startDate:trip.days[index].date}
  const current=trip.days[index].stops.map(s=>s.id)
  const freshFirst=generateTrip(p,variation,[...used,...current]).days[0]
  const fresh=freshFirst.stops.length?freshFirst:generateTrip(p,variation,used).days[0]
  return {...trip,days:trip.days.map((d,i)=>i===index?fresh:d),updatedAt:new Date().toISOString()}
}

export function dailyCost(day:DayPlan,p:Preferences){
  const stops=day.stops.map(s=>byId(s.id)).filter((d):d is Destination=>!!d)
  const entrance=stops.reduce((sum,d)=>sum+d.entranceFee*p.travelers,0)
  const activities=stops.reduce((sum,d)=>sum+(d.activityCost??0)*p.travelers,0)
  const food=350*p.travelers
  const km=stops.slice(1).reduce((sum,d,i)=>sum+distanceKm(stops[i],d),0)
  const transport=Math.round((100*p.travelers+km*32)/10)*10
  const miscellaneous=100
  return {entrance,activities,food,transport,miscellaneous,total:entrance+activities+food+transport+miscellaneous}
}
export function tripCost(trip:Trip){
  const rows=trip.days.map(d=>dailyCost(d,trip.preferences))
  return {entrance:rows.reduce((n,r)=>n+r.entrance,0),food:rows.reduce((n,r)=>n+r.food,0),transport:rows.reduce((n,r)=>n+r.transport,0),activities:rows.reduce((n,r)=>n+r.activities,0),miscellaneous:rows.reduce((n,r)=>n+r.miscellaneous,0),total:rows.reduce((n,r)=>n+r.total,0)}
}

export function validateTrip(value:unknown):Trip|null{
  if(!value||typeof value!=='object')return null
  const t=value as Partial<Trip>
  if(typeof t.id!=='string'||typeof t.name!=='string'||!t.preferences||!Array.isArray(t.days)||t.days.length>7)return null
  const p=t.preferences
  if(typeof p.startDate!=='string'||typeof p.travelers!=='number'||p.travelers<1||p.travelers>20||typeof p.budget!=='number'||!Array.isArray(p.interests))return null
  if(!t.days.every(d=>typeof d.date==='string'&&Array.isArray(d.stops)&&d.stops.length<=8&&d.stops.every(s=>typeof s.id==='string'&&!!byId(s.id))))return null
  return t as Trip
}

export function tripSummary(t:Trip){
  const lines=[`${t.name} | Pinepath`,`${t.preferences.days} days · ${t.preferences.travelers} traveler(s) · budget ${Math.round(t.preferences.budget)} PHP`,...t.days.flatMap((d,i)=>[`Day ${i+1} — ${d.date}`,...d.stops.map(s=>`  ${new Date(2020,0,1,Math.floor(s.time/60),s.time%60).toLocaleTimeString('en-PH',{hour:'numeric',minute:'2-digit'})} ${byId(s.id)?.name??''}`)]),`Estimated trip cost: ${Math.round(tripCost(t).total)} PHP`,'Costs, hours and travel times are planning estimates. Verify before visiting.']
  return lines.join('\n')
}
