
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Save } from 'lucide-react';

const Settings = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("general");
  const [isSaving, setIsSaving] = useState(false);
  
  // General Settings
  const [businessName, setBusinessName] = useState("MedPulse Pharmacy");
  const [address, setAddress] = useState("123 Health Street");
  const [phoneNumber, setPhoneNumber] = useState("123-456-7890");
  const [email, setEmail] = useState("info@medpulse.com");
  const [taxRate, setTaxRate] = useState("5");
  
  // Receipt Settings
  const [showLogo, setShowLogo] = useState(true);
  const [receiptFooter, setReceiptFooter] = useState("Thank you for choosing MedPulse Pharmacy!");
  const [printDuplicateReceipt, setPrintDuplicateReceipt] = useState(false);
  
  // Notification Settings
  const [lowStockAlert, setLowStockAlert] = useState(true);
  const [lowStockThreshold, setLowStockThreshold] = useState("10");
  const [expiryAlert, setExpiryAlert] = useState(true);
  const [expiryThreshold, setExpiryThreshold] = useState("30");
  const [emailNotifications, setEmailNotifications] = useState(true);
  
  // Backup Settings
  const [autoBackup, setAutoBackup] = useState(true);
  const [backupFrequency, setBackupFrequency] = useState("daily");
  const [backupLocation, setBackupLocation] = useState("cloud");

  const handleSaveSettings = (settingsType: string) => {
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      
      toast({
        title: "Settings updated",
        description: `${settingsType} settings have been saved successfully.`,
      });
    }, 1000);
  };

  const renderGeneralSettings = () => (
    <Card>
      <CardHeader>
        <CardTitle>General Settings</CardTitle>
        <CardDescription>
          Manage your pharmacy's basic information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="business-name">Business Name</Label>
          <Input
            id="business-name"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Textarea
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="tax-rate">Default Tax Rate (%)</Label>
          <Input
            id="tax-rate"
            type="number"
            value={taxRate}
            onChange={(e) => setTaxRate(e.target.value)}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={() => handleSaveSettings("General")} disabled={isSaving}>
          {isSaving ? 'Saving...' : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );

  const renderReceiptSettings = () => (
    <Card>
      <CardHeader>
        <CardTitle>Receipt Settings</CardTitle>
        <CardDescription>
          Configure how receipts are displayed and printed
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="show-logo" className="flex flex-col space-y-1">
            <span>Show Logo on Receipt</span>
            <span className="font-normal text-sm text-muted-foreground">
              Display your business logo on printed receipts
            </span>
          </Label>
          <Switch
            id="show-logo"
            checked={showLogo}
            onCheckedChange={setShowLogo}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="receipt-footer">Receipt Footer</Label>
          <Textarea
            id="receipt-footer"
            placeholder="Enter text to appear at the bottom of receipts"
            value={receiptFooter}
            onChange={(e) => setReceiptFooter(e.target.value)}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="duplicate-receipt" className="flex flex-col space-y-1">
            <span>Print Duplicate Receipt</span>
            <span className="font-normal text-sm text-muted-foreground">
              Automatically print a second copy of each receipt
            </span>
          </Label>
          <Switch
            id="duplicate-receipt"
            checked={printDuplicateReceipt}
            onCheckedChange={setPrintDuplicateReceipt}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={() => handleSaveSettings("Receipt")} disabled={isSaving}>
          {isSaving ? 'Saving...' : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );

  const renderNotificationSettings = () => (
    <Card>
      <CardHeader>
        <CardTitle>Notification Settings</CardTitle>
        <CardDescription>
          Configure alerts for inventory management
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="low-stock-alert" className="flex flex-col space-y-1">
            <span>Low Stock Alerts</span>
            <span className="font-normal text-sm text-muted-foreground">
              Receive notifications when items are running low
            </span>
          </Label>
          <Switch
            id="low-stock-alert"
            checked={lowStockAlert}
            onCheckedChange={setLowStockAlert}
          />
        </div>
        
        {lowStockAlert && (
          <div className="space-y-2 pl-6">
            <Label htmlFor="low-stock-threshold">Low Stock Threshold</Label>
            <Input
              id="low-stock-threshold"
              type="number"
              value={lowStockThreshold}
              onChange={(e) => setLowStockThreshold(e.target.value)}
            />
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <Label htmlFor="expiry-alert" className="flex flex-col space-y-1">
            <span>Expiry Date Alerts</span>
            <span className="font-normal text-sm text-muted-foreground">
              Receive notifications for items approaching expiration
            </span>
          </Label>
          <Switch
            id="expiry-alert"
            checked={expiryAlert}
            onCheckedChange={setExpiryAlert}
          />
        </div>
        
        {expiryAlert && (
          <div className="space-y-2 pl-6">
            <Label htmlFor="expiry-threshold">Days Before Expiry</Label>
            <Input
              id="expiry-threshold"
              type="number"
              value={expiryThreshold}
              onChange={(e) => setExpiryThreshold(e.target.value)}
            />
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <Label htmlFor="email-notifications" className="flex flex-col space-y-1">
            <span>Email Notifications</span>
            <span className="font-normal text-sm text-muted-foreground">
              Receive alert notifications via email
            </span>
          </Label>
          <Switch
            id="email-notifications"
            checked={emailNotifications}
            onCheckedChange={setEmailNotifications}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={() => handleSaveSettings("Notification")} disabled={isSaving}>
          {isSaving ? 'Saving...' : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );

  const renderBackupSettings = () => (
    <Card>
      <CardHeader>
        <CardTitle>Backup & Recovery</CardTitle>
        <CardDescription>
          Manage data backup settings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="auto-backup" className="flex flex-col space-y-1">
            <span>Automatic Backup</span>
            <span className="font-normal text-sm text-muted-foreground">
              Automatically backup your data
            </span>
          </Label>
          <Switch
            id="auto-backup"
            checked={autoBackup}
            onCheckedChange={setAutoBackup}
          />
        </div>
        
        {autoBackup && (
          <>
            <div className="space-y-2 pl-6">
              <Label htmlFor="backup-frequency">Backup Frequency</Label>
              <Select value={backupFrequency} onValueChange={setBackupFrequency}>
                <SelectTrigger id="backup-frequency">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2 pl-6">
              <Label htmlFor="backup-location">Backup Location</Label>
              <Select value={backupLocation} onValueChange={setBackupLocation}>
                <SelectTrigger id="backup-location">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="local">Local Storage</SelectItem>
                  <SelectItem value="cloud">Cloud Storage</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )}
        
        <div className="pt-4">
          <Button variant="outline" onClick={() => 
            toast({
              title: "Backup started",
              description: "Manual backup process has been initiated."
            })
          }>
            Backup Now
          </Button>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={() => handleSaveSettings("Backup")} disabled={isSaving}>
          {isSaving ? 'Saving...' : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your pharmacy system preferences
        </p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-8">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="receipt">Receipt</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="backup">Backup</TabsTrigger>
        </TabsList>
        <TabsContent value="general" className="mt-0">
          {renderGeneralSettings()}
        </TabsContent>
        <TabsContent value="receipt" className="mt-0">
          {renderReceiptSettings()}
        </TabsContent>
        <TabsContent value="notifications" className="mt-0">
          {renderNotificationSettings()}
        </TabsContent>
        <TabsContent value="backup" className="mt-0">
          {renderBackupSettings()}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
