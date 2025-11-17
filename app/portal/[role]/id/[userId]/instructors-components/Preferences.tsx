"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format, formatInTimeZone } from "date-fns-tz";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Globe, Clock, Flag } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";
import { Badge } from "@/components/ui/badge";

// ————————————————————————————————————————
// User & Preferences Types
// ————————————————————————————————————————
interface User {
  id: Id<"users">;
  role: "student" | "instructor";
  name: string;
  email: string;
  image?: string;
  country: string;
  timezone: string;
}

interface Preferences {
  theme: "light" | "dark";
  notifications: boolean;
  language: "en" | "fr" | "es" | "rw"; // Added Kinyarwanda
  emailAlerts: boolean;
  autoSave: boolean;
  timezone: string;
}

// ————————————————————————————————————————
// Component
// ————————————————————————————————————————
const Preferences = ({ initialUser }: { initialUser?: User }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const [user, setUser] = useState<User | null>(null);

  const [preferences, setPreferences] = useState<Preferences>({
    theme: "light",
    notifications: true,
    language: "en",
    emailAlerts: true,
    autoSave: false,
    timezone: "Africa/Kigali",
  });

  const router = useRouter();

  // ————————————————————————————————————————
  // Mock User with Real Data
  // ————————————————————————————————————————
  useEffect(() => {
    const mockUser: User = initialUser || {
      id: "user_123" as Id<"users">,
      role: "instructor",
      name: "Jean Paul",
      email: "jean.paul@school.rw",
      country: "RW",
      timezone: "Africa/Kigali",
    };

    setUser(mockUser);
    setPreferences((prev) => ({
      ...prev,
      language: "en", // Default for Rwanda
      timezone: mockUser.timezone,
    }));
    setIsLoading(false);
  }, [initialUser]);

  // ————————————————————————————————————————
  // Live Clock (CAT = UTC+2 → Africa/Kigali)
  // ————————————————————————————————————————
  useEffect(() => {
    if (!user) return;

    const updateClock = () => {
      const now = new Date();
      const formatted = formatInTimeZone(now, user.timezone, "PPP 'at' p");
      setCurrentTime(formatted);
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, [user]);

  // ————————————————————————————————————————
  // Save Handler
  // ————————————————————————————————————————
  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 1200));
    console.log("Preferences saved:", { user, preferences });
    setIsSaving(false);
  };

  // ————————————————————————————————————————
  // Security Check (mock)
  // ————————————————————————————————————————
  useEffect(() => {
    if (!user || isLoading) return;
    const params = { role: user.role, userId: user.id };
    // In real app: compare with URL params
    console.log("Access verified for:", params);
  }, [user, isLoading]);

  // ————————————————————————————————————————
  // UI Helpers
  // ————————————————————————————————————————
  const getCountryFlag = (code: string) => {
    if (code === "RW") return "Rwanda";
    return code;
  };

  const avatarFallback = user?.name.charAt(0).toUpperCase() || "?";

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin mr-2" />
        <span>Loading preferences...</span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <span className="text-red-500">User not found</span>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header with Live Time */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Preferences</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your account settings and notifications
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{currentTime}</span>
          </div>
          <div className="flex items-center gap-2">
            <Flag className="h-4 w-4 text-muted-foreground" />
            <span>{getCountryFlag(user.country)}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* General Settings */}
        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <Globe className="h-5 w-5" />
              General
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Theme</Label>
              <Select
                value={preferences.theme}
                onValueChange={(v) => setPreferences({ ...preferences, theme: v as "light" | "dark" })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Language</Label>
              <Select
                value={preferences.language}
                onValueChange={(v) => setPreferences({ ...preferences, language: v as "en" | "fr" | "es" | "rw" })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="rw">Kinyarwanda</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Timezone</Label>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="text-sm font-medium">{user.timezone}</span>
                <Badge variant="secondary">CAT (UTC+2)</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-900">Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Push Notifications</Label>
                <p className="text-xs text-muted-foreground">In-app alerts for assignments</p>
              </div>
              <Switch
                checked={preferences.notifications}
                onCheckedChange={(c) => setPreferences({ ...preferences, notifications: c })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Email Alerts</Label>
                <p className="text-xs text-muted-foreground">Due dates, grades, messages</p>
              </div>
              <Switch
                checked={preferences.emailAlerts}
                onCheckedChange={(c) => setPreferences({ ...preferences, emailAlerts: c })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Advanced */}
        <Card className="md:col-span-2 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-900">Advanced</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Auto-Save Progress</Label>
                <p className="text-xs text-muted-foreground">Save answers every 5 minutes</p>
              </div>
              <Switch
                checked={preferences.autoSave}
                onCheckedChange={(c) => setPreferences({ ...preferences, autoSave: c })}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Save Button */}
      <div className="mt-8 flex justify-end">
        <Button onClick={handleSave} disabled={isSaving} size="lg" className="gap-2">
          {isSaving ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            "Save Preferences"
          )}
        </Button>
      </div>
    </main>
  );
};

export default Preferences;