'use client';

import { useState } from 'react';
import { Moon, Sun, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function SettingsPage() {
  const [isDark, setIsDark] = useState(true);

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    if (!newDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  };

  const handleExportCSV = () => {
    // TODO: Implement CSV export of clients
    console.log('Export CSV placeholder');
  };

  return (
    <div className="p-8 space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your application preferences</p>
      </div>

      {/* Theme Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Theme</CardTitle>
          <CardDescription>Customize the appearance of your application</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Dark Mode</p>
              <p className="text-sm text-muted-foreground">Currently {isDark ? 'enabled' : 'disabled'}</p>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Status Labels Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Client Status Labels</CardTitle>
          <CardDescription>Current status types available for clients</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {['Lead', 'Active', 'Inactive', 'Closed'].map((status) => (
              <div key={status} className="flex items-center justify-between p-3 border rounded-md">
                <span className="font-medium">{status}</span>
                <span className="text-xs text-muted-foreground">Default</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            Status labels are currently fixed. Custom labels coming soon.
          </p>
        </CardContent>
      </Card>

      {/* Data Export */}
      <Card>
        <CardHeader>
          <CardTitle>Data Export</CardTitle>
          <CardDescription>Export your data for backup or analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleExportCSV} variant="outline" className="gap-2 bg-transparent">
            <Download className="h-4 w-4" />
            Export Clients to CSV
          </Button>
          <p className="text-xs text-muted-foreground mt-4">
            This will export all client records with their details to a CSV file.
          </p>
        </CardContent>
      </Card>

      {/* About */}
      <Card>
        <CardHeader>
          <CardTitle>About</CardTitle>
          <CardDescription>Application information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-sm text-muted-foreground">Version</p>
            <p className="font-medium">1.0.0</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Last Updated</p>
            <p className="font-medium">January 2026</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
