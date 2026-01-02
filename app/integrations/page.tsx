"use client";

import { Loader } from "@/components/ui/loader";
import IntegrationCard from "./_components/integration-card";
import SetupForm from "./_components/setup-form";
import { useIntegrations } from "./hooks/useIntegrations";

const IntegrationPage = () => {
  const {
    integrations,
    loading,
    setupMode,
    setSetupMode,
    setupData,
    setSetupData,
    setupLoading,
    fetchSetupData,
    handleConnect,
    handleDisconnect,
    handleSetupSubmit,
  } = useIntegrations();

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-8">
        <div className="flex flex-col items-center gap-5">
          <div className="relative">
            <Loader />
          </div>
          <div className="flex flex-col items-center gap-1">
            <p className="text-sm font-semibold text-foreground tracking-tight">Loading integrations</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-10 lg:mt-0 flex flex-col lg:flex-row gap-10 p-6 sm:p-10 w-full min-h-screen">

      <div className="flex-2 min-w-0">
        <header className="mb-10">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
            Integrations
          </h2>
          <p className="text-muted-foreground max-w-2xl leading-relaxed italic">
            Connect your favorite tools to automatically sync action items from meetings.
            All your data remains secure and private.
          </p>
        </header>

        <div className="grid gap-5 grid-cols-1 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 pb-20">
          {integrations.map((integration) => (
            <IntegrationCard
              key={integration.platform}
              integration={integration}
              onConnect={handleConnect}
              onDisconnect={handleDisconnect}
              onSetup={(platform) => {
                setSetupMode(platform);
                fetchSetupData(platform);
              }}
            />
          ))}
        </div>
      </div>


      <div className="lg:w-[380px] shrink-0">
        <div className="lg:sticky lg:top-10">
          <div className="rounded-2xl bg-background border border-border p-6 sm:p-8 space-y-8">


            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-foreground">
                How it works
              </h3>
              <p className="text-sm text-muted-foreground">
                A simple flow to automate your tasks.
              </p>
            </div>


            <div className="space-y-6">
              {[
                {
                  title: "Connect tools",
                  description: "Authorize the productivity tools you already use."
                },
                {
                  title: "Choose destination",
                  description: "Pick boards, channels, or projects for each tool."
                },
                {
                  title: "Smart sync",
                  description: "Send AI insights directly into your apps in one click."
                },
                {
                  title: "Manage centrally",
                  description: "Control and track everything from one dashboard."
                }
              ].map((step, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex-none w-7 h-7 rounded-lg bg-muted text-xs font-medium text-muted-foreground flex items-center justify-center">
                    {i + 1}
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-medium text-foreground">
                      {step.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>


            <div className="pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Pro tip:</span>{" "}
                Google Calendar syncs automatically. Other tools need a one-time setup.
              </p>
            </div>

          </div>
        </div>

      </div>

      {setupMode && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-card rounded-xl p-6 border border-border max-w-md w-full shadow-2xl animate-in zoom-in duration-300">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-foreground">
                Setup {setupMode.charAt(0).toUpperCase() + setupMode.slice(1)}
              </h2>
              <p className="text-xs text-muted-foreground mt-1">Configure your sync destination</p>
            </div>

            <SetupForm
              platform={setupMode}
              data={setupData}
              onSubmit={handleSetupSubmit}
              onCancel={() => {
                setSetupMode(null);
                setSetupData(null);
                window.history.replaceState({}, "", "/integrations");
              }}
              loading={setupLoading}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default IntegrationPage;
