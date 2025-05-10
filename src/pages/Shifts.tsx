import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Plus,
  Search,
  User
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Mock data
const mockUsers = [
  { id: 'usr-001', name: 'John Doe', role: 'pharmacist' },
  { id: 'usr-002', name: 'Jane Smith', role: 'pharmacist' },
  { id: 'usr-003', name: 'Robert Johnson', role: 'cashier' },
  { id: 'usr-004', name: 'Sarah Brown', role: 'pharmacist' },
  { id: 'usr-005', name: 'Michael Lee', role: 'cashier' }
];

// Generate a week of shifts for demonstration
const generateMockShifts = () => {
  const shifts = [];
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay()); // Start from Sunday
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    
    // Add morning shift
    shifts.push({
      id: `shift-${i}-1`,
      userId: mockUsers[i % 3].id,
      userName: mockUsers[i % 3].name,
      date: date.toISOString().slice(0, 10),
      startTime: '09:00',
      endTime: '14:00',
      status: 'scheduled'
    });
    
    // Add evening shift
    shifts.push({
      id: `shift-${i}-2`,
      userId: mockUsers[(i + 2) % 5].id,
      userName: mockUsers[(i + 2) % 5].name,
      date: date.toISOString().slice(0, 10),
      startTime: '14:00',
      endTime: '19:00',
      status: i < 2 ? 'completed' : 'scheduled'
    });
  }
  
  return shifts;
};

const mockShifts = generateMockShifts();

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// Shift form schema
const shiftFormSchema = z.object({
  userId: z.string({
    required_error: "Please select a staff member",
  }),
  date: z.string({
    required_error: "Please select a date",
  }),
  startTime: z.string({
    required_error: "Please select a start time",
  }),
  endTime: z.string({
    required_error: "Please select an end time",
  }),
  shiftType: z.string({
    required_error: "Please select a shift type",
  }),
  notes: z.string().optional(),
});

type ShiftFormValues = z.infer<typeof shiftFormSchema>;

const Shifts = () => {
  const { toast } = useToast();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'day' | 'week'>('week');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form definition
  const form = useForm<ShiftFormValues>({
    resolver: zodResolver(shiftFormSchema),
    defaultValues: {
      userId: "",
      date: new Date().toISOString().slice(0, 10),
      startTime: "09:00",
      endTime: "17:00",
      shiftType: "regular",
      notes: "",
    },
  });
  
  // Get the start and end of the current week
  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - currentDate.getDay()); // Start from Sunday
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6); // End on Saturday
  
  // Format the date range for display
  const dateRangeText = `${startOfWeek.getDate()} ${monthNames[startOfWeek.getMonth()]} - ${endOfWeek.getDate()} ${monthNames[endOfWeek.getMonth()]} ${endOfWeek.getFullYear()}`;
  
  // Navigate to previous/next week
  const navigateToPreviousWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 7);
    setCurrentDate(newDate);
  };
  
  const navigateToNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 7);
    setCurrentDate(newDate);
  };
  
  const navigateToToday = () => {
    setCurrentDate(new Date());
  };
  
  // Get shifts for the current week
  const currentWeekShifts = mockShifts.filter(shift => {
    const shiftDate = new Date(shift.date);
    return shiftDate >= startOfWeek && shiftDate <= endOfWeek;
  });
  
  // Group shifts by date
  const shiftsGroupedByDate = currentWeekShifts.reduce((acc, shift) => {
    acc[shift.date] = [...(acc[shift.date] || []), shift];
    return acc;
  }, {} as Record<string, typeof mockShifts>);
  
  // Filter shifts by search term
  const filteredShifts = searchTerm
    ? currentWeekShifts.filter(shift => 
        shift.userName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : currentWeekShifts;
  
  // Generate array of dates for the current week
  const weekDates = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    weekDates.push(date);
  }
  
  // Handle adding a new shift
  const handleAddShift = (values: ShiftFormValues) => {
    console.log("New shift:", values);
    setShowAddDialog(false);
    toast({
      title: "Shift Created",
      description: `The shift for ${mockUsers.find(user => user.id === values.userId)?.name} on ${new Date(values.date).toLocaleDateString()} has been scheduled.`
    });
    
    // Reset form when closing
    form.reset({
      userId: "",
      date: new Date().toISOString().slice(0, 10),
      startTime: "09:00",
      endTime: "17:00",
      shiftType: "regular",
      notes: "",
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Staff Shifts</h1>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Schedule Shift
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <Button variant="outline" size="icon" onClick={navigateToPreviousWeek}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="font-medium">{dateRangeText}</div>
              <Button variant="outline" size="icon" onClick={navigateToNextWeek}>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={navigateToToday}>
                Today
              </Button>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search by staff name..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select defaultValue="week" onValueChange={(v) => setViewMode(v as 'day' | 'week')}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="View" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Day</SelectItem>
                  <SelectItem value="week">Week</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {viewMode === 'week' ? (
            <div className="border rounded-md overflow-x-auto">
              <table className="w-full min-w-max">
                <thead>
                  <tr>
                    {weekDates.map((date, index) => (
                      <th key={index} className="p-2 text-center border-b">
                        <div className="font-medium">{daysOfWeek[date.getDay()]}</div>
                        <div className={`text-sm ${date.toDateString() === new Date().toDateString() ? 'bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex items-center justify-center mx-auto' : ''}`}>
                          {date.getDate()}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {weekDates.map((date, index) => {
                      const dateStr = date.toISOString().slice(0, 10);
                      const shifts = shiftsGroupedByDate[dateStr] || [];
                      
                      return (
                        <td key={index} className="p-2 border align-top min-h-48 h-48">
                          <div className="space-y-2">
                            {shifts.length === 0 ? (
                              <div className="text-center text-gray-400 text-sm py-2">
                                No shifts scheduled
                              </div>
                            ) : (
                              shifts.map(shift => (
                                <div 
                                  key={shift.id} 
                                  className={`p-2 rounded text-sm ${shift.status === 'completed' ? 'bg-gray-100' : 'bg-blue-50'}`}
                                >
                                  <div className="font-medium">{shift.userName}</div>
                                  <div className="text-xs flex items-center">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {shift.startTime} - {shift.endTime}
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Staff Member</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Shift Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredShifts.map((shift) => (
                    <TableRow key={shift.id}>
                      <TableCell className="font-medium">{shift.userName}</TableCell>
                      <TableCell>{new Date(shift.date).toLocaleDateString()}</TableCell>
                      <TableCell>{shift.startTime} - {shift.endTime}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${shift.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                          {shift.status === 'completed' ? 'Completed' : 'Scheduled'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          
          {filteredShifts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8">
              <User className="h-12 w-12 text-gray-300" />
              <h3 className="mt-2 text-lg font-medium">No shifts found</h3>
              <p className="text-sm text-gray-500">Try adjusting your search or schedule new shifts</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Schedule Shift Dialog with Form */}
      <Dialog open={showAddDialog} onOpenChange={(open) => {
        setShowAddDialog(open);
        if (!open) form.reset();
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule a New Shift</DialogTitle>
            <DialogDescription>
              Assign a staff member to a work shift
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAddShift)} className="space-y-4">
              <FormField
                control={form.control}
                name="userId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Staff Member</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select staff member" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {mockUsers.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.name} ({user.role})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="space-y-2 md:col-span-1">
                      <FormLabel>Date</FormLabel>
                      <div className="flex">
                        <CalendarIcon className="h-4 w-4 mr-2 self-center" />
                        <FormControl>
                          <Input 
                            type="date" 
                            {...field}
                          />
                        </FormControl>
                      </div>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Time</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="endTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Time</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="shiftType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Shift Type</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select shift type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="regular">Regular</SelectItem>
                        <SelectItem value="overtime">Overtime</SelectItem>
                        <SelectItem value="holiday">Holiday</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Input placeholder="Any additional information" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end space-x-4 pt-4">
                <Button variant="outline" type="button" onClick={() => setShowAddDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit">Schedule Shift</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Shifts;
