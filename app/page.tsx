"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { GraduationCap, Users, BarChart3 } from "lucide-react";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (
    e: React.FormEvent,
    userType: "student" | "faculty" | "admin"
  ) => {
    e.preventDefault();
    setIsLoading(true);

    // Mock authentication - redirect based on user type
    setTimeout(() => {
      if (userType === "student") {
        window.location.href = "/dashboard/student";
      } else if (userType === "faculty") {
        window.location.href = "/dashboard/faculty";
      } else {
        window.location.href = "/dashboard/admin";
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4 dark">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <GraduationCap className="h-12 w-12 text-blue-500" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Smart Student Hub
          </h1>
          <p className="text-slate-400">
            Academic Achievement Management Platform
          </p>
        </div>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Sign In</CardTitle>
            <CardDescription className="text-slate-400">
              Choose your role to access the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="student" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-slate-700">
                <TabsTrigger
                  value="student"
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-300 hover:text-white"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Student
                </TabsTrigger>
                <TabsTrigger
                  value="faculty"
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-300 hover:text-white"
                >
                  <GraduationCap className="h-4 w-4 mr-2" />
                  Faculty
                </TabsTrigger>
                <TabsTrigger
                  value="admin"
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-300 hover:text-white"
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Admin
                </TabsTrigger>
              </TabsList>

              {["student", "faculty", "admin"].map((userType) => (
                <TabsContent
                  key={userType}
                  value={userType}
                  className="space-y-4 mt-4"
                >
                  <form
                    onSubmit={(e) => handleLogin(e, userType as any)}
                  >
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor={`${userType}-email`}
                          className="text-slate-200"
                        >
                          Email
                        </Label>
                        <Input
                          id={`${userType}-email`}
                          type="email"
                          placeholder={`${userType}@university.edu`}
                          required
                          className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor={`${userType}-password`}
                          className="text-slate-200"
                        >
                          Password
                        </Label>
                        <Input
                          id={`${userType}-password`}
                          type="password"
                          required
                          className="bg-slate-700 border-slate-600 text-white"
                        />
                      </div>
                      <Button
                        type="submit"
                        className="w-full bg-blue-600 text-white hover:bg-blue-700"
                        disabled={isLoading}
                      >
                        {isLoading
                          ? "Signing in..."
                          : `Sign in as ${
                              userType.charAt(0).toUpperCase() +
                              userType.slice(1)
                            }`}
                      </Button>
                    </div>
                  </form>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        <div className="mt-6 text-center text-sm text-slate-400">
          <p>Demo credentials: Use any email/password combination</p>
        </div>
      </div>
    </div>
  );
}
