
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { Edit, Trash2, RefreshCw } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import PaymentBreakdown from '../payment/PaymentBreakdown';
import RefundDialog from '../booking/RefundDialog';

const BookingManagement = () => {
  const [editingBooking, setEditingBooking] = useState<any>(null);
  const [viewingPayment, setViewingPayment] = useState<any>(null);
  const [refundingBooking, setRefundingBooking] = useState<any>(null);
  const queryClient = useQueryClient();

  // Fetch bookings
  const { data: bookings } = useQuery({
    queryKey: ['admin-bookings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          venues(name),
          service_providers(service_category)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const updateBookingMutation = useMutation({
    mutationFn: async (booking: any) => {
      const { error } = await supabase
        .from('bookings')
        .update(booking)
        .eq('id', booking.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-bookings'] });
      toast.success('Booking updated successfully');
      setEditingBooking(null);
    },
    onError: (error) => {
      toast.error('Failed to update booking: ' + error.message);
    }
  });

  const deleteBookingMutation = useMutation({
    mutationFn: async (bookingId: string) => {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', bookingId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-bookings'] });
      toast.success('Booking deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete booking: ' + error.message);
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Booking Management</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Service/Venue</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Commission</TableHead>
              <TableHead>Seller Gets</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Payout</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings?.map((booking) => {
              const commissionAmount = booking.commission_amount || (booking.total_amount * 0.1);
              const transactionFee = booking.transaction_fee || (booking.total_amount * 0.03);
              const sellerAmount = booking.seller_amount || (booking.total_amount - commissionAmount - transactionFee);
              
              return (
                <TableRow key={booking.id}>
                  <TableCell>
                    <Badge variant="outline">{booking.booking_type}</Badge>
                  </TableCell>
                  <TableCell>
                    {booking.venues?.name || booking.service_providers?.service_category || 'N/A'}
                  </TableCell>
                  <TableCell>
                    {new Date(booking.event_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>KSh {booking.total_amount?.toLocaleString()}</TableCell>
                  <TableCell className="text-blue-600">
                    KSh {commissionAmount.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-green-600">
                    KSh {sellerAmount.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant={booking.status === 'confirmed' ? "default" : booking.status === 'cancelled' ? "destructive" : "secondary"}>
                      {booking.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      booking.payment_status === 'paid' ? "default" : 
                      booking.payment_status === 'refunded' ? "destructive" : 
                      "secondary"
                    }>
                      {booking.payment_status || 'pending'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={booking.payout_status === 'processed' ? "default" : booking.payout_status === 'cancelled' ? "destructive" : "secondary"}>
                      {booking.payout_status || 'pending'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2 flex-wrap">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setViewingPayment(booking)}>
                            View Payment
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>Payment Breakdown</DialogTitle>
                          </DialogHeader>
                          {viewingPayment && (
                            <PaymentBreakdown
                              totalAmount={viewingPayment.total_amount}
                              commissionPercentage={viewingPayment.commission_percentage || 10}
                              transactionFeePercentage={3}
                            />
                          )}
                        </DialogContent>
                      </Dialog>

                      {booking.payment_status === 'paid' && booking.status !== 'cancelled' && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setRefundingBooking(booking)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <RefreshCw className="h-4 w-4 mr-1" />
                          Refund
                        </Button>
                      )}

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setEditingBooking(booking)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Booking</DialogTitle>
                          </DialogHeader>
                          {editingBooking && (
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="status">Status</Label>
                                <Select
                                  value={editingBooking.status}
                                  onValueChange={(value) => setEditingBooking({...editingBooking, status: value})}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="confirmed">Confirmed</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label htmlFor="payment_status">Payment Status</Label>
                                <Select
                                  value={editingBooking.payment_status}
                                  onValueChange={(value) => setEditingBooking({...editingBooking, payment_status: value})}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="paid">Paid</SelectItem>
                                    <SelectItem value="refunded">Refunded</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label htmlFor="total_amount">Total Amount</Label>
                                <Input
                                  id="total_amount"
                                  type="number"
                                  value={editingBooking.total_amount || ''}
                                  onChange={(e) => setEditingBooking({...editingBooking, total_amount: parseFloat(e.target.value)})}
                                />
                              </div>
                              <Button onClick={() => updateBookingMutation.mutate(editingBooking)}>
                                Save Changes
                              </Button>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the booking.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteBookingMutation.mutate(booking.id)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {refundingBooking && (
          <RefundDialog
            booking={refundingBooking}
            isOpen={!!refundingBooking}
            onClose={() => setRefundingBooking(null)}
            isAdmin={true}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default BookingManagement;
