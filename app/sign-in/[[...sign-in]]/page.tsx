import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-100 to-pink-100 dark:from-[#0a1020] dark:via-[#181c2f] dark:to-[#2a1a3a] p-4">
      <div className="w-full max-w-md">
        <SignIn 
          appearance={{
            elements: {
              formButtonPrimary: "bg-green-600 hover:bg-green-700 text-white",
              card: "shadow-xl bg-white/95 dark:bg-[#181c2f]/95",
              headerTitle: "text-slate-800 dark:text-white",
              headerSubtitle: "text-slate-600 dark:text-slate-300",
              socialButtonsBlockButton: "border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800",
              formFieldInput: "border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white",
              footerActionLink: "text-green-600 hover:text-green-700",
              identityPreviewText: "text-slate-600 dark:text-slate-300",
              formFieldLabel: "text-slate-700 dark:text-slate-300"
            }
          }}
          redirectUrl="/"
          signUpUrl="/sign-up"
        />
      </div>
    </div>
  )
}
