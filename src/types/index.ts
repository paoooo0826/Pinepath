export type Category = 'Nature'|'Parks'|'Culture'|'Food'|'Cafés'|'Shopping'|'Views'|'Family'|'Adventure'
export type Interest = Category | 'Photography'
export type Pace = 'Relaxed'|'Balanced'|'Packed'
export interface Destination {
  id: string; name: string; slug: string; category: Category; tags: Interest[]; shortDescription: string; description: string;
  image: string; imageCredit: string; photoIllustrative?: boolean; latitude: number; longitude: number; entranceFee: number; activityCost?: number;
  duration: number; openingTime: number; closingTime: number; location: string; bestTime: string; indoor: boolean;
  familyFriendly: boolean; seniorFriendly: boolean; rainFriendly: boolean; popularity: number; tips: string[]; accessibility: string;
}
export interface Preferences {
  startDate: string; days: number; travelers: number; budget: number; pace: Pace; interests: Interest[];
  withKids: boolean; seniorFriendly: boolean; rainyDay: boolean; lowBudget: boolean;
}
export interface Stop { id: string; time: number; travelMinutes: number }
export interface DayPlan { date: string; stops: Stop[] }
export interface Trip { id: string; name: string; preferences: Preferences; days: DayPlan[]; updatedAt: string }
export interface Weather { temperature: number; condition: string; rain: number; high: number; low: number; forecast: {date:string; high:number; low:number; rain:number; condition:string}[] }
