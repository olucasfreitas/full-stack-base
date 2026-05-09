export type ItemRecord = {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type NewItemRecord = {
  title: string;
  description: string | null;
  completed: boolean;
};

export type UpdateItemRecord = Partial<NewItemRecord>;
