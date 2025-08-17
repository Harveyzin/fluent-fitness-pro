import * as React from "react"
import { Button, ButtonProps } from "./button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip"
import { Lock } from "lucide-react"

interface RestrictedButtonProps extends ButtonProps {
  isRestricted: boolean;
  tooltip?: string;
}

const RestrictedButton = React.forwardRef<HTMLButtonElement, RestrictedButtonProps>(
  ({ isRestricted, tooltip = "Disponível apenas no modo personal", children, ...props }, ref) => {
    if (isRestricted) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                {...props}
                ref={ref}
                disabled
                variant="outline"
                className="opacity-60 cursor-not-allowed"
              >
                <Lock size={16} className="mr-2" />
                {children}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-sm">{tooltip}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    }

    return (
      <Button {...props} ref={ref}>
        {children}
      </Button>
    )
  }
)

RestrictedButton.displayName = "RestrictedButton"

export { RestrictedButton }