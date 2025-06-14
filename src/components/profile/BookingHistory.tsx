
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';

interface BookingHistoryProps {
  bookingHistory: Array<{
    id: string;
    type: string;
    name: string;
    date: string;
    status: string;
    amount: number;
  }>;
}

const BookingHistory: React.FC<BookingHistoryProps> = ({ bookingHistory }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'upcoming': return 'bg-blue-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Booking History</CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {bookingHistory.map((booking) => (
            <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center gap-2">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <Badge className={getStatusColor(booking.status)}>
                    {booking.status}
                  </Badge>
                </div>
                
                <div>
                  <h4 className="font-medium">{booking.name}</h4>
                  <p className="text-sm text-muted-foreground capitalize">
                    {booking.type} • {new Date(booking.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <p className="font-semibold">KSh {booking.amount.toLocaleString()}</p>
                <Button variant="ghost" size="sm">
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingHistory;
