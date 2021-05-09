import { formatDistanceToNowStrict } from "date-fns";

export function formatCreatedAt(date) {
    return formatDistanceToNowStrict(new Date(date), { addSuffix: true})
}
