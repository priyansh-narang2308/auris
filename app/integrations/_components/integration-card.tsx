import Image from "next/image";
import { Integration, Platform } from "../hooks/useIntegrations";
import { Check, ExternalLink, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { toast } from "sonner";

interface IntegrationCardProps {
  integration: Integration;
  onConnect: (platform: Platform) => void;
  onDisconnect: (platform: Platform) => void;
  onSetup: (platform: Platform) => void;
}

const IntegrationCard = ({
  integration,
  onConnect,
  onDisconnect,
  onSetup,
}: IntegrationCardProps) => {
  const handleDisconnectConfirm = () => {
    onDisconnect(integration.platform);

    toast.warning(`${integration.name} has been disconnected successfully.`);
  };

  return (
    <div className="group flex flex-col h-full bg-card rounded-xl border border-border p-5 hover:bg-muted/50 transition-all duration-200">
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 relative bg-muted rounded-lg p-2 border border-border shrink-0">
            <Image
              src={integration.logo}
              alt={`${integration.name} logo`}
              fill
              className="object-contain p-0.5"
            />
          </div>
          <div className="flex flex-col min-w-0">
            <h3 className="font-semibold text-sm text-foreground truncate">
              {integration.name}
            </h3>
            {integration.connected && (
              <span className="text-[10px] font-medium text-green-500 uppercase tracking-wider">
                Connected
              </span>
            )}
          </div>
        </div>
        {integration.connected && (
          <div className="h-5 w-5 rounded-full bg-blue-500/10 flex items-center justify-center">
            <Check className="h-3 w-3 text-green-600 dark:text-green-400" />
          </div>
        )}
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed mb-6">
        {integration.description}
      </p>

      <div className="mt-auto space-y-4">
        {integration.connected && (
          <div className="space-y-2">
            {integration.platform !== "google-calendar" &&
              (integration.boardName ||
                integration.projectName ||
                integration.channelName) && (
                <div className="p-2 bg-muted/50 rounded-lg border border-border">
                  <div className="text-[9px] uppercase font-bold text-muted-foreground mb-0.5">
                    Target
                  </div>
                  <div className="text-[11px] font-medium text-foreground flex items-center gap-1.5 min-w-0">
                    <div className="w-1 h-1 rounded-full bg-blue-500 shrink-0" />
                    <span className="truncate">
                      {integration.platform === "slack" &&
                        integration.channelName
                        ? `#${integration.channelName}`
                        : integration.platform === "trello"
                          ? integration.boardName
                          : integration.platform === "jira"
                            ? integration.projectName
                            : integration.projectName}
                    </span>
                  </div>
                </div>
              )}

            {integration.platform === "google-calendar" && (
              <div className="p-2 bg-muted/50 rounded-lg border border-border">
                <div className="text-[9px] uppercase font-bold text-muted-foreground mb-0.5">
                  Status
                </div>
                <div className="text-[11px] font-medium text-foreground flex items-center gap-1.5">
                  <div className="w-1 h-1 rounded-full bg-blue-500" />
                  Auto-sync active
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex gap-2">
          {integration.connected ? (
            <>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 h-8  rounded-lg text-xs font-semibold hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20 cursor-pointer"
                    type="button"
                  >
                    Disconnect
                  </Button>
                </AlertDialogTrigger>

                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Disconnect {integration.name}?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This will stop all syncing and remove the current
                      configuration. You can reconnect anytime.
                    </AlertDialogDescription>
                  </AlertDialogHeader>

                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDisconnectConfirm}
                      className="bg-destructive cursor-pointer text-destructive-foreground hover:bg-destructive/90"
                    >
                      Disconnect
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              {integration.platform !== "google-calendar" && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onSetup(integration.platform)}
                  className="w-8 h-8 rounded-lg border-border hover:bg-muted cursor-pointer"
                  type="button"
                >
                  <Settings className="h-3.5 w-3.5 text-muted-foreground" />
                </Button>
              )}
            </>
          ) : (
            <Button
              size="sm"
              onClick={() => onConnect(integration.platform)}
              className="flex-1 h-8 rounded-lg bg-foreground text-background hover:bg-foreground/90 transition-all font-semibold text-xs flex items-center justify-center gap-2 group/btn cursor-pointer"
              type="button"
            >
              Connect
              <ExternalLink className="h-3 w-3 transition-transform" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default IntegrationCard;
