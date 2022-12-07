export interface CreateMetadata {
  name: string;
  description: string;
  image: string;
}

export interface UpdatedMetadata extends CreateMetadata {
  someNewField?: string;
}
