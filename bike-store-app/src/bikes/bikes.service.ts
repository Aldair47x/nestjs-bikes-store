import { Injectable } from '@nestjs/common';
import { CreateBikeDto } from './dto/create-bike.dto';
import { UpdateBikeDto } from './dto/update-bike.dto';
import { Bike } from './entities/bike.entity';
import { v4 as uuid } from 'uuid';

@Injectable()
export class BikesService {
  private bikes: Bike[] = [
    {
      id: uuid(),
      brand: 'Suzuki',
      model: 'Gsxs750',
      price: 14000,
    },
    {
      id: uuid(),
      brand: 'Yamaha',
      model: 'MT-07',
      price: 12000,
    },
    {
      id: uuid(),
      brand: 'Kawasaki',
      model: 'Z900',
      price: 15000,
    },
  ];

  create(createBikeDto: CreateBikeDto) {
    const newBike = {
      id: uuid(),
      ...createBikeDto,
    };
    this.bikes.push(newBike);
    return newBike;
  }

  findAll() {
    return this.bikes;
  }

  findOne(id: string) {
    const bike = this.bikes.find((bike) => bike.id === id);
    if (!bike) {
      throw new Error(`Bike with id ${id} not found`);
    }
    return bike;
  }

  update(id: string, updateBikeDto: UpdateBikeDto) {
    if (!updateBikeDto) {
      throw new Error('Bike format is not correct');
    }
    let bike = this.findOne(id);
    this.bikes = this.bikes.map((b) => {
      if (b.id === id) {
        bike = {
          ...bike,
          ...updateBikeDto,
        };
        return bike;
      }
      return b;
    });
    return bike;
  }

  remove(id: string) {
    const bike = this.findOne(id);
    this.bikes = this.bikes.filter((bike) => bike.id !== id);
    return bike;
  }
}
