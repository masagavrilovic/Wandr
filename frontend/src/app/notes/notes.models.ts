export interface Note {
    id: number;
    tripId: number;
    title: string;
    content?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateUpdateNotePayload {
    title?: string;
    content?: string | null;
}