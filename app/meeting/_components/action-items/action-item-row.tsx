/* eslint-disable @next/next/no-img-element */
import { Button } from "@/components/ui/button";
import { ChevronDown, ExternalLink, Trash2, Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Integration } from "../../[meetingId]/hooks/useActionItems";

interface ActionItemRowProps {
  item: {
    id: number;
    text: string;
  };
  integrations: Integration[];
  loading: { [key: string]: boolean };
  isDeleting: boolean;
  addToIntegration: (
    platform: string,
    item: { id: number; text: string },
  ) => void;
  handleDeleteItem: (id: number) => void;
}

function ActionItemRow({
  item,
  integrations,
  loading,
  isDeleting,
  addToIntegration,
  handleDeleteItem,
}: ActionItemRowProps) {
  const hasConnectedIntegrations = integrations.length > 0;
  return (
    <div className="group relative">
      <div className="flex items-start gap-3">
        <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0"></div>

        <p className="flex-1 text-sm leading-relaxed text-foreground">
          {item.text}
        </p>

        {hasConnectedIntegrations && (
          <div className="transition-opacity relative text-slate-100">
            {integrations.length === 1 ? (
              <Button
                onClick={() => addToIntegration(integrations[0].platform, item)}
                disabled={loading[`${integrations[0].platform}-${item.id}`]}
                size="sm"
                className="px-3 py-1  text-xs flex items-center gap-1 cursor-pointer"
              >
                {loading[`${integrations[0].platform}-${item.id}`] ? (
                  "Adding..."
                ) : (
                  <>
                    Add to {integrations[0].name}
                    <ExternalLink className="h-3 w-3" />
                  </>
                )}
              </Button>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="sm"
                    variant="default"
                    className="px-3 py-1 text-xs flex items-center gap-1 cursor-pointer"
                  >
                    Add to
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="min-w-40">
                  {integrations.map((integration) => (
                    <DropdownMenuItem
                      key={integration.platform}
                      onClick={() =>
                        addToIntegration(integration.platform, item)
                      }
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <div className="w-4 h-4 relative shrink-0">
                        <img
                          src={integration.logo}
                          alt={integration.name}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      </div>

                      <span>
                        {loading[`${integration.platform}-${item.id}`]
                          ? "Adding..."
                          : `Add to ${integration.name}`}
                      </span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        )}

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              disabled={isDeleting}
              className="p-1 text-destructive rounded transition-all cursor-pointer hover:bg-destructive/10"
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                action item from this meeting recap.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="cursor-pointer">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => handleDeleteItem(item.id)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90 cursor-pointer"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}

export default ActionItemRow;
