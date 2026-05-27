"use client"

import { useState } from "react"
import { cn } from "~/lib/utils"
import { Button } from "~/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "~/components/ui/field"
import { Input } from "~/components/ui/input"
import { useSignup } from "~/hooks/api/auth"
import {useRouter} from "next/navigation"
export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const router = useRouter()
  const { createUserWithEmailAndPasswordAsync, status } = useSignup()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage(null)

    const formData = new FormData(event.currentTarget)
    const fullName = String(formData.get("fullName") ?? "").trim()
    const email = String(formData.get("email") ?? "").trim()
    const password = String(formData.get("password") ?? "")

    try {
      await createUserWithEmailAndPasswordAsync({
        fullName,
        email,
        password,
      })
      router.replace("/dashboard")
      event.currentTarget.reset()
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to create account",
      )
    }
  }

  return (
    <form className={cn("flex flex-col gap-6", className)} onSubmit={handleSubmit} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Fill in the form below to create your account
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="name">Full Name</FieldLabel>
          <Input id="name" name="fullName" type="text" placeholder="John Doe" required />
        </Field>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input id="email" name="email" type="email" placeholder="m@example.com" required />
          <FieldDescription>
            We&apos;ll use this to contact you. We will not share your email
            with anyone else.
          </FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input id="password" name="password" type="password" required />
          <FieldDescription>
            Must be at least 8 characters long.
          </FieldDescription>
        </Field>
        {/* <Field>
          <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
          <Input id="confirm-password" name="confirmPassword" type="password" required />
          <FieldDescription>Please confirm your password.</FieldDescription>
        </Field> */}
        {errorMessage ? (
          <p className="text-sm text-destructive text-center">{errorMessage}</p>
        ) : null}
        <Field>
          <Button type="submit" disabled={status === "pending"}>
            {status === "pending" ? "Creating..." : "Create Account"}
          </Button>
        </Field>
        <Field>
          <FieldDescription className="px-6 text-center">
            Already have an account? <a href="/login">Sign in</a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}
