import { Integration } from '../../[meetingId]/hooks/useActionItems'
import ActionItemRow from './action-item-row'

interface ActionItemsListProps {
    actionItems: {
        id: number;
        text: string;
    }[];
    integrations: Integration[];
    loading: { [key: string]: boolean };
    deletingIds: number[];
    addToIntegration: (
        platform: string,
        item: { id: number; text: string },
    ) => void;
    handleDeleteItem: (id: number) => void;
}

function ActionItemsList(props: ActionItemsListProps) {
    return (
        <div className="space-y-4">
            {props.actionItems.map((item) => (
                <ActionItemRow
                    key={item.id}
                    item={item}
                    integrations={props.integrations}
                    loading={props.loading}
                    isDeleting={props.deletingIds.includes(item.id)}
                    addToIntegration={props.addToIntegration}
                    handleDeleteItem={props.handleDeleteItem}
                />
            ))}
        </div>
    );
}

export default ActionItemsList