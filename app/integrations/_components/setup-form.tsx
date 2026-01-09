/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Platform } from "../hooks/useIntegrations";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface SetupFormProps {
  platform: Platform;
  data: any;
  onSubmit: (platform: Platform, config: any) => void;
  onCancel: () => void;
  loading: boolean;
  isFetching?: boolean;
}

const SetupForm = ({
  platform,
  data,
  onSubmit,
  onCancel,
  loading,
  isFetching = false,
}: SetupFormProps) => {
  const [selectedId, setSelectedId] = useState("");
  const [selectedName, setSelectedName] = useState("");
  const [createNew, setCreateNew] = useState(false);
  const [newName, setNewName] = useState("");

  const items =
    platform === "trello"
      ? data?.boards
      : platform === "slack"
        ? data?.channels
        : data?.projects;

  const itemLabel =
    platform === "trello"
      ? "board"
      : platform === "slack"
        ? "channel"
        : "project";

  const handleSubmit = () => {
    const config: any = { createNew };

    if (platform === "trello") {
      if (createNew) {
        config.boardName = newName;
      } else {
        config.boardId = selectedId;
        config.boardName = selectedName;
      }
    } else if (platform === "asana") {
      config.workspaceId = data?.workspaceId;
      if (createNew) {
        config.projectName = newName;
      } else {
        config.projectId = selectedId;
        config.projectName = selectedName;
      }
    } else if (platform === "jira") {
      if (createNew) {
        config.projectName = newName;
      } else {
        config.projectId = selectedId;
        config.projectName = selectedName;
      }
    } else if (platform === "slack") {
      if (createNew) {
        config.channelName = newName;
      } else {
        config.channelId = selectedId;
        config.channelName = selectedName;
      }
    }

    onSubmit(platform, config);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="space-y-1.5">
          <Label className="text-sm font-semibold text-foreground">
            Target {itemLabel.charAt(0).toUpperCase() + itemLabel.slice(1)}
          </Label>
          <p className="text-xs text-muted-foreground">
            Select where action items should be synced.
          </p>
        </div>

        {!createNew ? (
          <Select
            value={selectedId}
            onValueChange={(value) => {
              const selected = items?.find(
                (item: any) =>
                  item.id === value || item.key === value || item.gid === value
              );
              setSelectedId(value);
              setSelectedName(selected?.name || "");
            }}
          >
            <SelectTrigger className="w-full h-9 bg-muted/30 border-border rounded-lg">
              <SelectValue placeholder={isFetching ? "Loading options..." : `Select existing ${itemLabel}...`} />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-border shadow-2xl">
              <SelectGroup>
                <SelectLabel className="text-[10px] uppercase tracking-widest text-muted-foreground pt-2 pb-1 bg-muted/30 border-b border-border/50 mb-1">
                  Available {itemLabel}s
                </SelectLabel>
                {items?.map((item: any) => (
                  <SelectItem
                    key={item.id || item.key || item.gid}
                    value={item.id || item.key || item.gid}
                    className="cursor-pointer focus:bg-blue-500/5 focus:text-blue-600 py-2 rounded-md"
                  >
                    {item.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        ) : (
          <Input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder={`Enter new ${itemLabel} name...`}
            className="h-9 bg-muted/30 border-border rounded-lg focus-visible:ring-1 focus-visible:ring-blue-500/50"
          />
        )}
      </div>

      <div
        className="flex items-center gap-2.5 p-3.5 bg-muted/20 border border-border rounded-lg group/check cursor-pointer hover:bg-muted/40 transition-colors"
        onClick={() => setCreateNew(!createNew)}
      >
        <Checkbox
          id="create-new"
          checked={createNew}
          onCheckedChange={(checked) => setCreateNew(!!checked)}
          className="rounded border-border data-[state=checked]:bg-foreground data-[state=checked]:border-foreground transition-all"
        />
        <Label
          htmlFor="create-new"
          className="text-[13px] text-muted-foreground font-medium group-hover/check:text-foreground transition-colors cursor-pointer select-none"
        >
          Create a new {itemLabel} instead
        </Label>
      </div>

      <div className="flex gap-2.5 pt-2">
        <Button
          variant="outline"
          onClick={onCancel}
          className="flex-1 h-9 rounded-lg border-border text-xs font-semibold hover:bg-muted transition-all cursor-pointer"
          type="button"
        >
          Cancel
        </Button>

        <Button
          onClick={handleSubmit}
          disabled={
            loading || (!createNew && !selectedId) || (createNew && !newName)
          }
          className="flex-1 h-9 rounded-lg bg-foreground text-background hover:bg-foreground/90 disabled:opacity-50 transition-all font-semibold text-xs cursor-pointer"
          type="button"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full border-2 border-background/30 border-t-background animate-spin" />
              <span>Saving...</span>
            </div>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </div>
  );
};

export default SetupForm;
