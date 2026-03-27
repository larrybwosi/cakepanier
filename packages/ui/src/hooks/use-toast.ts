import { toast as sonnerToast } from "sonner"

interface ToastProps {
  title?: string
  description?: string
  variant?: "default" | "destructive"
  action?: React.ReactNode
}

export function toast({ title, description, variant, action }: ToastProps) {
  if (variant === "destructive") {
    return sonnerToast.error(title, {
      description,
      action: action as any,
    })
  }

  return sonnerToast(title, {
    description,
    action: action as any,
  })
}

export function useToast() {
  return {
    toast,
    dismiss: (id?: string | number) => sonnerToast.dismiss(id),
  }
}
