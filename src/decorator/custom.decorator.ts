import { SetMetadata } from '@nestjs/common';

export const Is_Public = 'isPublic';
export const Public = () => SetMetadata(Is_Public, true);
