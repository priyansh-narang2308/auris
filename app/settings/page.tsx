"use client";

import { Loader } from "@/components/ui/loader";
import { useAuth, useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Bot, Save, Upload, User, Zap, Shield, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { cn } from "@/lib/utils";
import Link from "next/link";

const SettingsPage = () => {
  const { user } = useUser();
  const { userId } = useAuth();

  const [botName, setBotName] = useState("Aurisia");
  const [botImageUrl, setBotImageUrl] = useState<string | null>(null);
  const [userPlan, setUserPlan] = useState("free");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchBotSettings();
    }
  }, [userId]);

  const fetchBotSettings = async () => {
    try {
      const resp = await fetch("/api/user/bot-settings");
      if (resp.ok) {
        const data = await resp.json();
        setBotName(data.botName || "Aurisia");
        setBotImageUrl(data.botImageUrl || null);
        setUserPlan(data.plan || "free");
      }
    } catch (error) {
      console.error("Error fetching bot settings:", error);
      toast.error("Error fetching bot settings");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBotNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBotName(e.target.value);
    setHasChanges(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const resp = await fetch("/api/upload/bot-avatar", {
        method: "POST",
        body: formData,
      });

      if (resp.ok) {
        const data = await resp.json();
        setBotImageUrl(data.imageUrl);
        setHasChanges(true);
        toast.success("Image uploaded successfully");
      } else {
        toast.error("Error uploading image");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Error uploading image");
    } finally {
      setIsUploading(false);
    }
  };

  const saveBotSettings = async () => {
    setIsSaving(true);

    try {
      const resp = await fetch("/api/user/bot-settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          botName,
          botImageUrl,
        }),
      });

      if (resp.ok) {
        toast.success("Bot settings saved successfully");
        setHasChanges(false);
      } else {
        toast.error("Error saving bot settings");
      }
    } catch (error) {
      console.error("Error saving bot settings:", error);
      toast.error("Error saving bot settings");
    } finally {
      setIsSaving(false);
    }
  };

  const getPlanBadge = (plan: string) => {
    const p = plan.toLowerCase();
    if (p === "free") {
      return (
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs font-medium">
          <Zap className="w-3 h-3" />
          Free Plan
        </div>
      );
    }
    if (p === "starter") {
      return (
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-900/30 border border-blue-500/30 text-blue-400 text-xs font-medium">
          <Shield className="w-3 h-3" />
          Starter Plan
        </div>
      );
    }
    if (p === "pro" || p === "premium") {
      return (
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-900/30 border border-amber-500/30 text-amber-400 text-xs font-medium shadow-[0_0_10px_rgba(245,158,11,0.2)]">
          <Crown className="w-3 h-3" />
          Pro Plan
        </div>
      );
    }
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-800 text-zinc-300 text-xs font-medium">
        {plan}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-100px)]">
        <Loader className="w-8 h-8 text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black/95 p-6 lg:p-10 animate-in fade-in duration-500">
      <div className="max-w-4xl mx-auto space-y-8">

        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Account Settings</h1>
          <p className="text-zinc-400 mt-2">Manage your account profile and bot preferences.</p>
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-zinc-900/50 border border-white/5 p-1">
          <div className="absolute inset-0 bg-linear-to-r from-blue-500/10 via-purple-500/10 to-transparent opacity-50" />
          <div className="relative bg-zinc-950/80 rounded-xl p-6 sm:p-8 backdrop-blur-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">

              <div className="flex items-center gap-5">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white/10 ring-4 ring-black shadow-2xl">
                    {user?.imageUrl ? (
                      <Image
                        src={user.imageUrl}
                        alt="Profile"
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                        <User className="h-8 w-8 text-zinc-400" />
                      </div>
                    )}
                  </div>

                </div>

                <div>
                  <h2 className="text-xl font-semibold text-white">{user?.fullName || "User"}</h2>
                  <p className="text-sm text-zinc-400 mt-1">{user?.primaryEmailAddress?.emailAddress}</p>
                  <div className="mt-3">
                    {getPlanBadge(userPlan)}
                  </div>
                </div>
              </div>

              <Link href={"/pricing"}>
                <Button
                  variant="outline"
                  className="border-white/10 cursor-pointer hover:bg-white/5 text-zinc-300 hover:text-white transition-all"
                >
                  Manage Subscription
                </Button>
              </Link>

            </div>
          </div>
        </div>

        <div className="grid gap-6">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            Bot Customization
          </h3>

          <div className="rounded-2xl border border-white/5 bg-zinc-900/30 backdrop-blur-sm p-6 sm:p-8 space-y-8">

            <div className="flex flex-col sm:flex-row gap-8 items-start sm:items-center">
              <div className="relative group cursor-pointer">
                < Label htmlFor="bot-image-upload" className="cursor-pointer">
                  <div className="w-24 h-24 rounded-2xl bg-zinc-800 border-2 border-dashed border-zinc-600 flex items-center justify-center overflow-hidden transition-all group-hover:border-purple-500 group-hover:shadow-[0_0_20px_rgba(168,85,247,0.2)]">
                    {botImageUrl ? (
                      <Image
                        src={botImageUrl}
                        alt="Bot"
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Bot className="w-10 h-10 text-zinc-500 group-hover:text-purple-400 transition-colors" />
                    )}

                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <Upload className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </Label>
                <Input
                  type="file"
                  id="bot-image-upload"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUploading}
                  className="hidden"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-base font-medium text-white">Bot Avatar</Label>
                <p className="text-sm text-zinc-400">
                  This image will appear in Slack and on the dashboard.
                  <br />
                  <span className="text-xs text-zinc-500">Recommended: 500x500px (JPG, PNG)</span>
                </p>
              </div>
            </div>

            <div className="max-w-md space-y-3">
              <Label htmlFor="bot-name" className="text-base font-medium text-white">Bot Name</Label>
              <div className="relative">
                <Input
                  id="bot-name"
                  value={botName}
                  onChange={handleBotNameChange}
                  placeholder="e.g. Aurisia"
                  className="bg-black/40 border-white/10 text-white placeholder:text-zinc-600 focus:border-purple-500/50 focus:ring-purple-500/20 h-11 pl-11"
                />
                <Bot className="absolute left-3.5 top-3 w-5 h-5 text-zinc-500" />
              </div>
              <p className="text-xs text-zinc-500">
                Give your assistant a unique personality with a custom name.
              </p>
            </div>

            <div className="pt-6 flex justify-end">
              <Button
                onClick={saveBotSettings}
                disabled={!hasChanges || isSaving}
                className={cn(
                  "px-8 transition-all duration-300 cursor-pointer",
                  hasChanges
                    ? "bg-white text-black hover:bg-zinc-200 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                    : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                )}
              >
                {isSaving ? (
                  <>
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default SettingsPage;
