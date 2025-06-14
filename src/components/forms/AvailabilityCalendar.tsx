
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, X, CalendarX, CalendarCheck } from 'lucide-react';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';

interface AvailabilityCalendarProps {
  blockedDates: string[];
  setBlockedDates: (dates: string[]) => void;
  onDatesChange: (dates: string[]) => void;
}

const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({
  blockedDates,
  setBlockedDates,
  onDatesChange
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>();

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    
    const dateString = format(date, 'yyyy-MM-dd');
    const isBlocked = blockedDates.includes(dateString);
    
    let newBlockedDates;
    if (isBlocked) {
      // Remove from blocked dates (make available)
      newBlockedDates = blockedDates.filter(d => d !== dateString);
    } else {
      // Add to blocked dates (make unavailable)
      newBlockedDates = [...blockedDates, dateString];
    }
    
    setBlockedDates(newBlockedDates);
    onDatesChange(newBlockedDates);
    setSelectedDate(date);
  };

  const clearAllBlockedDates = () => {
    setBlockedDates([]);
    onDatesChange([]);
  };

  const isDateBlocked = (date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    return blockedDates.includes(dateString);
  };

  const isPastDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Availability Management
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-red-50">
              <CalendarX className="h-3 w-3 mr-1" />
              {blockedDates.length} blocked dates
            </Badge>
            {blockedDates.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllBlockedDates}
              >
                Clear All
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground mb-4">
          Click on dates to block/unblock them for bookings. Blocked dates will not be available for customers to book.
        </div>

        <div className="flex justify-center">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full max-w-sm">
                <Calendar className="h-4 w-4 mr-2" />
                Manage Availability
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="center">
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                className="rounded-md border-0"
                modifiers={{
                  blocked: (date) => isDateBlocked(date),
                  past: (date) => isPastDate(date)
                }}
                modifiersStyles={{
                  blocked: {
                    backgroundColor: '#fee2e2',
                    color: '#dc2626',
                    fontWeight: 'bold'
                  },
                  past: {
                    color: '#9ca3af',
                    textDecoration: 'line-through'
                  }
                }}
                disabled={(date) => isPastDate(date)}
              />
            </PopoverContent>
          </Popover>
        </div>

        {blockedDates.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Blocked Dates:</h4>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
              {blockedDates.map((date) => (
                <Badge key={date} variant="destructive" className="flex items-center gap-1">
                  {format(new Date(date), 'MMM dd, yyyy')}
                  <button
                    onClick={() => {
                      const newDates = blockedDates.filter(d => d !== date);
                      setBlockedDates(newDates);
                      onDatesChange(newDates);
                    }}
                    className="ml-1 hover:bg-red-700 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-4 pt-4 border-t text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-100 border border-red-300 rounded" />
            <span>Blocked (Unavailable)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-100 border border-green-300 rounded" />
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded" />
            <span>Past dates (cannot modify)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AvailabilityCalendar;
