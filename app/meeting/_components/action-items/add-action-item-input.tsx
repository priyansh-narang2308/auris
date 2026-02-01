import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Loader2 } from "lucide-react";

interface AddActionItemInputProps {
  showAddInput: boolean;
  setShowAddInput: (show: boolean) => void;
  newItemText: string;
  setNewItemText: (text: string) => void;
  isAdding: boolean;
  onAddItem: () => void;
}

function AddActionItemInput({
  showAddInput,
  setShowAddInput,
  newItemText,
  setNewItemText,
  isAdding,
  onAddItem,
}: AddActionItemInputProps) {
  if (showAddInput) {
    return (
      <div className="flex mt-5 items-center gap-2 p-3 bg-muted/30 rounded-lg">
        <Input
          type="text"
          value={newItemText}
          onChange={(e) => setNewItemText(e.target.value)}
          placeholder="Enter action item..."
          className="flex-1"
          disabled={isAdding}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onAddItem();
            }
            if (e.key === "Escape") {
              setShowAddInput(false);
              setNewItemText("");
            }
          }}
          autoFocus
        />
        <Button
          onClick={onAddItem}
          className="cursor-pointer"
          disabled={!newItemText.trim() || isAdding}
          size="sm"
        >
          {isAdding ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          {isAdding ? "Adding..." : "Add"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="cursor-pointer"
          disabled={isAdding}
          onClick={() => {
            setShowAddInput(false);
            setNewItemText("");
          }}
        >
          Cancel
        </Button>
      </div>
    );
  }
  return (
    <Button
      variant="secondary"
      className="flex items-center mt-5 cursor-pointer gap-3 w-full py-2 px-3 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors group"
      onClick={() => setShowAddInput(true)}
    >
      <Plus className="h-4 w-4" />
      <span>Add Action Item</span>
    </Button>
  );
}

export default AddActionItemInput;
