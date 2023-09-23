import { IsString, IsNumber, Min } from 'class-validator';

export class UpdateBikeDto {
  @IsString()
  brand: string;
  @IsString()
  model: string;
  @IsNumber()
  @Min(0)
  price: number;
}
