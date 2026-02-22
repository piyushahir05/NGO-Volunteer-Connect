import * as React from "react"
import { cn } from "@/lib/utils"
import { cva } from "class-variance-authority"

const cardVariants = cva(
  "relative overflow-hidden rounded-2xl transition-all duration-300 ease-out",
  {
    variants: {
      variant: {
        default:
          "bg-white border border-slate-200 shadow-md hover:shadow-xl hover:-translate-y-1",
        elevated:
          "bg-white border border-transparent shadow-lg hover:shadow-2xl hover:-translate-y-2",
        gradient:
          "bg-white border border-transparent shadow-md hover:shadow-xl before:absolute before:inset-0 before:-z-10 before:rounded-2xl before:bg-gradient-to-r before:from-primary/20 before:via-secondary/20 before:to-accent/20 before:blur-xl",
        glass:
          "backdrop-blur-xl bg-white/60 border border-white/30 shadow-lg hover:shadow-2xl",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Card = React.forwardRef(
  ({ className, variant, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant }), className)}
      {...props}
    />
  )
)
Card.displayName = "Card"

const CardHeader = React.forwardRef(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-2 p-6", className)}
      {...props}
    />
  )
)
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn("text-lg font-semibold tracking-tight text-slate-900", className)}
      {...props}
    />
  )
)
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("text-sm text-slate-500 leading-relaxed", className)}
      {...props}
    />
  )
)
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("px-6 pb-6", className)}
      {...props}
    />
  )
)
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center px-6 pb-6 pt-2", className)}
      {...props}
    />
  )
)
CardFooter.displayName = "CardFooter"

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
}