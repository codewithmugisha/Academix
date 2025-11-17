// app/portal/[role]/id/[userId]/profile.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Loader2, Camera, Save, X, User, Mail, Shield } from "lucide-react";
import { GetCurrentUser } from "@/app/features/auth/api/get-current-user";
import { UseCurrentUserParams } from "@/app/features/hooks/use-current-user-in-url";
import { useAuthActions } from "@convex-dev/auth/react";
import { Id } from "@/convex/_generated/dataModel";

interface User {
  id: Id<"users">;
  role: string | undefined;
  name: string | undefined;
  image: string | undefined;
  email: string | undefined;
}

interface Props {
  user: User;
}

const Profile = ({ user: initialUser }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(initialUser?.image || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: initialUser?.name || "",
    email: initialUser?.email || "",
  });

  const { data: user, isLoading: userLoading } = GetCurrentUser();
  const finalUser = initialUser || user;
  const { signOut } = useAuthActions();
  const params = UseCurrentUserParams();
  const router = useRouter();

  // Security redirect
  useEffect(() => {
    if (userLoading || !finalUser) return;
    if (params.userId !== finalUser.id || params.role !== finalUser.role) {
      router.replace(`/portal/${finalUser.role}/id/${finalUser.id}`);
    }
  }, [router, finalUser, userLoading, params]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // TODO: Upload to Convex storage
    // const { storage } = useConvex();
    // const upload = await storage.upload(file);
    // await updateUser({ id: finalUser.id, image: upload });
  };

  const handleSave = async () => {
    if (!finalUser?.id) return;
    setIsSaving(true);
    try {
      // await updateUser({ id: finalUser.id, ...formData, image: imagePreview });
      await new Promise((resolve) => setTimeout(resolve, 800)); // Mock delay
      toast({
        title: "Profile updated",
        description: "Your changes have been saved.",
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const avatarFallback = finalUser?.name?.charAt(0)?.toUpperCase() || "?";

  /* ------------------------------------------------------------------ */
  /* SKELETON – matches final layout                                    */
  /* ------------------------------------------------------------------ */
  if (userLoading && !initialUser) {
    return (
      <main className="container mx-auto p-6 max-w-4xl space-y-8">
        <Skeleton className="h-10 w-48" />

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="md:col-span-1">
            <CardHeader className="flex flex-col items-center pb-4">
              <Skeleton className="h-32 w-32 rounded-full mb-4" />
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-5 w-24 mt-1" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-10 w-full" />
              </div>
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-64 mt-1" />
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  /* ------------------------------------------------------------------ */
  /* MAIN UI                                                            */
  /* ------------------------------------------------------------------ */
  return (
    <>
      <main className="container mx-auto p-6 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground">Manage your account information and preferences.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Left: Avatar + Basic Info */}
          <Card>
            <CardHeader className="flex flex-col items-center pb-4">
              <div className="relative group">
                <Avatar className="h-32 w-32">
                  <AvatarImage src={imagePreview || finalUser?.image} alt={finalUser?.name} />
                  <AvatarFallback className="text-2xl">{avatarFallback}</AvatarFallback>
                </Avatar>
                {isEditing && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Camera className="h-6 w-6 text-white" />
                  </button>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <h2 className="mt-4 text-xl font-semibold">{finalUser?.name}</h2>
              <Badge variant={finalUser?.role === "instructor" ? "secondary" : "default"} className="mt-1">
                <Shield className="h-3 w-3 mr-1" />
                {finalUser?.role || "Student"}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>{finalUser?.email}</span>
              </div>
            </CardContent>
          </Card>

          {/* Right: Editable Form */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Account Details</CardTitle>
              <CardDescription>
                {isEditing ? "Make changes to your profile." : "Your current profile information."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">
                  <User className="inline h-4 w-4 mr-1" />
                  Full Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="Enter your name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">
                  <Mail className="inline h-4 w-4 mr-1" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="Enter your email"
                />
              </div>

              <div className="space-y-2">
                <Label>Role</Label>
                <Input
                  value={finalUser?.role || "Student"}
                  disabled
                  className="bg-muted"
                />
              </div>

              <div className="flex gap-2 pt-4">
                {isEditing ? (
                  <>
                    <Button onClick={handleSave} disabled={isSaving}>
                      {isSaving ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                    <Button variant="outline" onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        name: finalUser?.name || "",
                        email: finalUser?.email || "",
                      });
                      setImagePreview(finalUser?.image || null);
                    }}>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => setIsEditing(true)} className="w-full sm:w-auto">
                    Edit Profile
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Optional: Additional Sections */}
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full justify-start">
                Change Password
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sign Out</CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="destructive" onClick={() => signOut()} className="w-full">
                Sign Out from All Devices
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
};

export default Profile;