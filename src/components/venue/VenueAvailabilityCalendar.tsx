
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface VenueAvailabilityCalendarProps {
  bookedDates: string[];
  availableDates: string[];
}

const VenueAvailabilityCalendar: React.FC<VenueAvailabilityCalendarProps> = ({
  bookedDates,
  availableDates
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
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
  
  const formatDate = (day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };
  
  const isDateBooked = (day: number) => {
    return bookedDates.includes(formatDate(day));
  };
  
  const isDateAvailable = (day: number) => {
    return availableDates.includes(formatDate(day));
  };
  
  const isPastDate = (day: number) => {
    const date = new Date(year, month, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
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
      const isAvailable = isDateAvailable(day);
      const isPast = isPastDate(day);
      
      let dayClass = "h-10 w-10 rounded-lg text-sm font-medium transition-colors flex items-center justify-center ";
      
      if (isPast) {
        dayClass += "text-muted-foreground bg-gray-100";
      } else if (isBooked) {
        dayClass += "bg-red-100 text-red-600";
      } else if (isAvailable) {
        dayClass += "bg-green-100 text-green-600";
      } else {
        dayClass += "bg-gray-50 text-gray-400";
      }
      
      days.push(
        <div key={day} className={dayClass}>
          {day}
        </div>
      );
    }
    
    return days;
  };

  return (
    <div className="space-y-4">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(prev.getMonth() - 1);
            return newDate;
          })}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <span className="font-medium text-lg">
          {monthNames[month]} {year}
        </span>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(prev.getMonth() + 1);
            return newDate;
          })}
        >
          <ArrowLeft className="h-4 w-4 rotate-180" />
        </Button>
      </div>

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
      <div className="flex flex-wrap gap-4 pt-4 border-t text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-100 border border-green-300 rounded" />
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-100 border border-red-300 rounded" />
          <span>Booked</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded" />
          <span>Not Available</span>
        </div>
      </div>
    </div>
  );
};

export default VenueAvailabilityCalendar;
