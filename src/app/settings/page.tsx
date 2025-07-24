"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useTheme } from "next-themes"
import { useAuth } from "@/context/auth-context"
import { verifyBeforeUpdateEmail, PhoneAuthProvider, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth"
import { auth } from "@/lib/firebase"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

const emailSchema = z.object({
  newEmail: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(1, { message: "Password is required for security." }),
})

const phoneSchema = z.object({
  phoneNumber: z.string().min(10, { message: "Please enter a valid phone number." }),
})

export default function SettingsPage() {
  const [mounted, setMounted] = useState(false)
  const { setTheme, theme } = useTheme()
  const { user, loading } = useAuth()
  const { toast } = useToast()
  const [isEmailLoading, setIsEmailLoading] = useState(false)
  const [isPhoneLoading, setIsPhoneLoading] = useState(false)
  const router = useRouter()

  const emailForm = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: { newEmail: "", password: "" },
  })

  const phoneForm = useForm<z.infer<typeof phoneSchema>>({
    resolver: zodResolver(phoneSchema),
    defaultValues: { phoneNumber: user?.phoneNumber || "" },
  })
  
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    } else if(user) {
        setMounted(true)
    }
  }, [user, loading, router])

  const handleEmailChange = async (data: z.infer<typeof emailSchema>) => {
    setIsEmailLoading(true)
    if (!user || !user.email) {
      toast({ variant: "destructive", title: "Not authenticated" })
      setIsEmailLoading(false)
      return
    }

    try {
      const credential = EmailAuthProvider.credential(user.email, data.password)
      await reauthenticateWithCredential(user, credential)
      await verifyBeforeUpdateEmail(user, data.newEmail)
      toast({ title: "Verification email sent", description: "Please check your new email address to verify the change." })
      emailForm.reset()
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error updating email", description: error.message })
    } finally {
      setIsEmailLoading(false)
    }
  }

  const handlePhoneChange = async (data: z.infer<typeof phoneSchema>) => {
    setIsPhoneLoading(true)
    if (!user) {
        toast({ variant: "destructive", title: "Not authenticated" });
        setIsPhoneLoading(false);
        return;
    }
    // This is a placeholder for a more complex flow involving verification
    // For now we will just update the phone number directly in auth profile
    try {
        const phoneAuthProvider = new PhoneAuthProvider(auth);
        // In a real app, you would use phoneAuthProvider.verifyPhoneNumber to send a code
        // and then update the profile. For simplicity, we are skipping that here.
        // This is not a recommended production pattern.
        // await updatePhoneNumber(user, data.phoneNumber);
        toast({ title: "Phone number update not fully implemented", description: "This is a placeholder for a real verification flow." });
    } catch (error: any) {
        toast({ variant: "destructive", title: "Error updating phone number", description: error.message });
    } finally {
        setIsPhoneLoading(false);
    }
  }
  
  if (!mounted) {
    return <div className="flex items-center justify-center h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account and app preferences.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Customize the look and feel of the app.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
              <Label>Theme</Label>
              <RadioGroup onValueChange={setTheme} defaultValue={theme} className="flex space-x-4">
              <div className="flex items-center space-x-2">
                  <RadioGroupItem value="light" id="light" />
                  <Label htmlFor="light">Light</Label>
              </div>
              <div className="flex items-center space-x-2">
                  <RadioGroupItem value="dark" id="dark" />
                  <Label htmlFor="dark">Dark</Label>
              </div>
              <div className="flex items-center space-x-2">
                  <RadioGroupItem value="system" id="system" />
                  <Label htmlFor="system">System</Label>
              </div>
              </RadioGroup>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>Update your account details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <form onSubmit={emailForm.handleSubmit(handleEmailChange)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newEmail">Change Email Address</Label>
              <Input id="newEmail" type="email" placeholder="new.email@example.com" {...emailForm.register("newEmail")} />
               {emailForm.formState.errors.newEmail && <p className="text-destructive text-sm mt-1">{emailForm.formState.errors.newEmail.message}</p>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="password">Current Password</Label>
                <Input id="password" type="password" placeholder="Enter your current password" {...emailForm.register("password")} />
                {emailForm.formState.errors.password && <p className="text-destructive text-sm mt-1">{emailForm.formState.errors.password.message}</p>}
            </div>
            <Button type="submit" disabled={isEmailLoading}>
              {isEmailLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Email
            </Button>
          </form>

          <form onSubmit={phoneForm.handleSubmit(handlePhoneChange)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input id="phoneNumber" type="tel" placeholder="+1234567890" {...phoneForm.register("phoneNumber")} />
              {phoneForm.formState.errors.phoneNumber && <p className="text-destructive text-sm mt-1">{phoneForm.formState.errors.phoneNumber.message}</p>}
            </div>
            <Button type="submit" disabled={isPhoneLoading}>
              {isPhoneLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Phone Number
            </Button>
             <p className="text-xs text-muted-foreground">Phone number updates require verification (not implemented in this demo).</p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
