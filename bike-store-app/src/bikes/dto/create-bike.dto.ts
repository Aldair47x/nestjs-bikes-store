import { IsNumber, IsString, Min } from 'class-validator';

export class CreateBikeDto {
  @IsString()
  brand: string;
  @IsString()
  model: string;
  @IsNumber()
  @Min(0)
  price: number;
}
