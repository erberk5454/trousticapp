"use client"

import React from "react"
import { DateRange, Range, RangeKeyDict } from "react-date-range"
import "react-date-range/dist/styles.css"
import "react-date-range/dist/theme/default.css"
import { tr } from 'date-fns/locale';
import { addYears } from "date-fns"


type CalendarProps={
    value:Range
    onChange:(value:RangeKeyDict)=>void
    disabledDates?:Date[]
}

const Calendar:React.FC<CalendarProps> = ({value,onChange,disabledDates}) => {
 
  const today = new Date();
  const twoYearsFromNow = addYears(today, 2);
 
  return (

 <DateRange  monthDisplayFormat="MMMM" showMonthAndYearPickers={false} rangeColors={["#262626"]} ranges={[value]} date={new Date() } locale={tr}
 onChange={onChange} direction="vertical" showDateDisplay={false}
 minDate={new Date()} disabledDates={disabledDates} maxDate={twoYearsFromNow}/>
  )
}

export default Calendar
