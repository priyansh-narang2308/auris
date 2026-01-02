"use client"

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Platform } from "../hooks/useIntegrations";

/* eslint-disable @typescript-eslint/no-explicit-any */
interface SetupFormProps {
  platform: Platform;
  data: any;
  onSubmit: (platform: Platform, config: any) => void; //this all project name id andal will be config
  onCancel: () => void;
  loading: boolean;
}

const SetupForm = ({
  platform,
  data,
  onSubmit,
  onCancel,
  loading,
}: SetupFormProps) => {
  const [selectedId, setSelectedId] = useState("");
  const [selectedName, setSelectedName] = useState("");
  const [createNew, setCreateNew] = useState(false);
  const [newName, setNewName] = useState("");

  //  Fetch respective item for respective field
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

  //  tO HAndle the config as well
  const handleSubmit = () => {
    if (createNew) {
      onSubmit(platform, {
        createNew: true,
        [`${itemLabel}Name`]: newName,
        workspaceId: data?.workspaceId,
      });
    } else {
      onSubmit(platform, {
        [`${itemLabel}Id`]: selectedId,
        [`${itemLabel}Name`]: selectedName,
        projectKey: selectedId,
        workspaceId: data?.workspaceId,
      });
    }
  };
  return (
    <div>
      <div className="mb-4">
        <Label className="block text-sm font-medium text-foreground mb-2">
          Select {itemLabel} for action items:{" "}
        </Label>

        {!createNew ? (
          <Select
            value={selectedId}
            onValueChange={(value) => {
              const selected = items?.find(
                (item: any) =>
                  item.id === value || item.key === value || item.gid === value //key=trello, gid=asana and rest for jira and slackll
              );
              setSelectedId(value);
              setSelectedName(selected?.name || "");
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={`Choose existing ${itemLabel}...`} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>
                  {itemLabel.charAt(0).toUpperCase() + itemLabel.slice(1)}s
                </SelectLabel>
                {items?.map((item: any) => (
                  <SelectItem
                    key={item.id || item.key || item.gid}
                    value={item.id || item.key || item.gid}
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
          />
        )}
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm">
          <Checkbox
            id="create-new"
            checked={createNew}
            onCheckedChange={(checked) => setCreateNew(!!checked)}
          />

          <Label htmlFor="create-new">Create new {itemLabel}</Label>
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={onCancel}
          className="flex-1 cursor-pointer"
          type="button"
        >
          Cancel
        </Button>

        <Button
          onClick={handleSubmit}
          disabled={
            loading || (!createNew && !selectedId) || (createNew && !newName)
          }
          className="flex-1 cursor-pointer"
          type="button"
        >
          {loading ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );
};

export default SetupForm;
