declare module 'react-big-calendar' {
  import { ComponentType } from 'react'

  export interface Event {
    id: number
    title: string
    start: Date
    end: Date
    desc?: string
    location?: string
    colorId?: string
    estado?: string
  }

  export interface CalendarProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    localizer: any
    events: Event[]
    startAccessor: string | ((event: Event) => Date)
    endAccessor: string | ((event: Event) => Date)
    style?: React.CSSProperties
    culture?: string
    view?: 'month' | 'week' | 'day' | 'agenda'
    date?: Date
    onView?: (view: string) => void
    onNavigate?: (date: Date) => void
    messages?: Record<string, string | ((total: number) => string)>
    eventPropGetter?: (event: Event) => { className?: string; style?: React.CSSProperties }
    onSelectEvent?: (event: Event) => void
    views?: string[]
    defaultView?: string
    popup?: boolean
    selectable?: boolean
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSelectSlot?: (slotInfo: any) => void
    components?: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      toolbar?: ComponentType<any>
      event?: ComponentType<{ event: Event }>
    }
  }

  export const Calendar: ComponentType<CalendarProps>
  
  export function dateFnsLocalizer(config: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    format: (date: Date, format: string, options?: any) => string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    parse: (str: string, format: string, options?: any) => Date
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    startOfWeek: (date: Date, options?: any) => Date
    getDay: (date: Date) => number
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    locales?: Record<string, any>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }): any
}
