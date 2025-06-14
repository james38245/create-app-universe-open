
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

interface CalendarProps {
  bookedDates?: string[];
  onDateSelect?: (date: string) => void;
  selectedDate?: string;
}

const Calendar: React.FC<CalendarProps> = ({ 
  bookedDates = [], 
  onDateSelect,
  selectedDate 
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const today = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const firstDayWeekday = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };
  
  const formatDate = (day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };
  
  const isDateBooked = (day: number) => {
    return bookedDates.includes(formatDate(day));
  };
  
  const isDateSelected = (day: number) => {
    return selectedDate === formatDate(day);
  };
  
  const isPastDate = (day: number) => {
    const date = new Date(year, month, day);
    return date < today;
  };
  
  const handleDateClick = (day: number) => {
    if (!isPastDate(day) && !isDateBooked(day) && onDateSelect) {
      onDateSelect(formatDate(day));
    }
  };
  
  const renderCalendarDays = () => {
    const days = [];
    
    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDayWeekday; i++) {
      days.push(<div key={`empty-${i}`} className="h-10" />);
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isBooked = isDateBooked(day);
      const isSelected = isDateSelected(day);
      const isPast = isPastDate(day);
      
      days.push(
        <button
          key={day}
          onClick={() => handleDateClick(day)}
          disabled={isPast || isBooked}
          className={`
            h-10 w-10 rounded-lg text-sm font-medium transition-colors
            ${isSelected 
              ? 'bg-primary text-primary-foreground' 
              : isBooked 
                ? 'bg-red-100 text-red-500 cursor-not-allowed' 
                : isPast 
                  ? 'text-muted-foreground cursor-not-allowed'
                  : 'hover:bg-muted'
            }
          `}
        >
          {day}
        </button>
      );
    }
    
    return days;
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Availability Calendar
          </CardTitle>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigateMonth('prev')}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="min-w-[140px] text-center font-medium">
              {monthNames[month]} {year}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigateMonth('next')}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1">
            {dayNames.map(day => (
              <div key={day} className="h-8 flex items-center justify-center text-sm font-medium text-muted-foreground">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {renderCalendarDays()}
          </div>
          
          {/* Legend */}
          <div className="flex flex-wrap gap-4 pt-4 border-t">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-primary rounded" />
              <span className="text-sm">Selected</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-100 rounded" />
              <span className="text-sm">Booked</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-muted rounded" />
              <span className="text-sm">Available</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Calendar;
