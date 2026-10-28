export enum NoteColor {
    DEFAULT = 'default',
    YELLOW = 'yellow',
    GREEN = 'green',
    BLUE = 'blue',
    PINK = 'pink',
    PURPLE = 'purple',
}
export interface Note {
    id: number;
    tripId: number;
    title: string;
    color: NoteColor;
    content: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface CreateUpdateNotePayload {
    title?: string;
    content?: string | null;
    color?: NoteColor;
}

export const NOTE_COLOR_STYLES: Record<NoteColor, { bg: string; border: string }> = {
    default: { bg: '#FFFFFF', border: '#E5E7EB' },
    yellow: { bg: '#FEF3C7', border: '#FDE68A' },
    green: { bg: '#D1FAE5', border: '#A7F3D0' },
    blue: { bg: '#DBEAFE', border: '#BFDBFE' },
    pink: { bg: '#FCE7F3', border: '#FBCFE8' },
    purple: { bg: '#EDE9FE', border: '#DDD6FE' },
};