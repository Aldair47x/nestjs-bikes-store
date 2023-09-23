# Getting Started with NestJS Application

### Step 1: Install Nest CLI

To create a NestJS application, you'll need the Nest CLI. Install it globally using npm:

```bash
$ npm install -g @nestjs/cli
```
### Step 2: Create a New NestJS Project

Use the Nest CLI to generate a new NestJS project. Replace bike-store-app with your preferred project name and select your preferred package installer:

```bash
nest new bike-store-app  
```

### Step 3: Project structure & clean up files

NestJS projects follow a specific directory structure. You'll find directories like src for your source code, main.ts as the entry point, and app.module.ts as the root module.
For this exercise, we will remove the `app.controller.ts, app.spec.ts and app.service.ts`.
After deleting the corresponding files, is necessary to fix the import call in the app.module.ts

### Step 4: Creating a resource with Nest CLI

In NestJS, resources typically refer to various components and modules that you use to build your application. These resources include controllers, services, modules, and other parts of your NestJS application. 

let's create our bike resource:

```bash
nest g resource bikes --no-spec
```

![vscode-hint-1](https://i.ibb.co/dmh27h5/Screenshot-5.jpg)

### Step 5: Creating our bike structure 

For this step, we're going to define the properties for the entity created in the resource

In my case:

```bash
export class Bike {
  id: string;
  brand: string;
  model: string;
  price: number;
}
```
And for the purpose of using ids as a unique identifier, we are going to use the uuid library.

```bash
$ npm i uuid
```

### Step 6: Changing DTOs

At this stage, we'll define our DTOs adding some @decorators to extend the class-validator library.

```bash
$ npm i --save class-validator class-transformer
```

Selecting `create-bike.dto.ts`:

```bash
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
```
Selecting `update-bike.dto.ts`:

```bash
import { IsNumber, IsString, Min } from 'class-validator';

export class UpdateBikeDto {
  @IsString()
  brand: string;
  @IsString()
  model: string;
  @IsNumber()
  @Min(0)
  price: number;
}
```

### Step 7 Creating our logic through dependency injection

In this step, it is necessary to inject the `bikes.service.ts` service into the controller. NestJS utilizes dependency injection to handle the connections between the components within the application.

*For this we'll be aware of the `bikes.module.ts` is using as a provider the `bikes.service.ts`*

![vscode-hint-2](https://i.ibb.co/wSCwBKT/Screenshot-6.jpg)

#### Database Integration

If your application requires database interaction, you can use libraries like TypeORM or Sequelize to connect to your database.
However, for this example we are going to use a local collection for handle the data.


```bash
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
  .
  .
  .
  .
}
```
#### CRUD methods definition

* **create**

```bash
create(createBikeDto: CreateBikeDto) {
  const newBike = {
    id: uuid(),
    ...createBikeDto,
  };
  this.bikes.push(newBike);
  return newBike;
}
```

* **findAll**

```bash
findAll() {
  return this.bikes;
}
```

* **findOne**

```bash
findOne(id: string) {
  const bike = this.bikes.find((bike) => bike.id === id);
  if (!bike) {
    throw new Error(`Bike with id ${id} not found`);
  }
  return bike;
}
```

* **update**

```bash
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
```

* **remove**
```bash
remove(id: string) {
  const bike = this.findOne(id);
  this.bikes = this.bikes.filter((bike) => bike.id !== id);
  return bike;
}
```

### Step 8 Bikes controller

In the controller, you can use decorators such as @Get(), @Post(), etc., to specify routes and link them to controller methods. Here, we'll inject the functions previously defined in the `bikes.service.ts`.

* ***@Post()***

```bash
create(@Body() createBikeDto: CreateBikeDto) {
  return this.bikesService.create(createBikeDto);
}
```

* ***@Get()***

```bash
findAll() {
  return this.bikesService.findAll();
}
```

* ***@Get(':id')***

```bash
findOne(@Param('id', ParseUUIDPipe) id: string) {
  return this.bikesService.findOne(id);
}
```

* ***@Patch(':id')***

```bash
update(
  @Param('id', ParseUUIDPipe) id: string,
  @Body() updateBikeDto: UpdateBikeDto,
) {
  return this.bikesService.update(id, updateBikeDto);
}
```

* ***@Delete(':id')***
```bash
remove(@Param('id', ParseUUIDPipe) id: string) {
  return this.bikesService.remove(id);
}
```

### Step 9 useGlobalPipes method

In NestJS, the useGlobalPipes() method is used to configure global pipes for request data transformation and validation. Pipes in NestJS are responsible for processing incoming request data, such as parameters, query strings, request bodies, and headers, before it reaches the route handler method. 

Using useGlobalPipes() is a way to apply a specific set of pipes globally to all routes or to specific contexts within your application. Here's how we can use useGlobalPipes() in the `main.ts` file.

```bash
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configure a global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: false, // Automatically transforms input data to the DTO class
      whitelist: true, // Strips any properties that are not defined in the DTO class
      forbidNonWhitelisted: true, // Throws an error if non-whitelisted properties are present
    }),
  );

  await app.listen(3000);
}
```

### Step 10 Starting the Application

After completing the previous steps, we should finally have our bikes API up and running. It has been created from scratch and is now ready to be tested in our client API.

*To start your NestJS application, run:*

```bash
$ npm run start
```

![vscode-hint-3](https://i.ibb.co/TBzhnHK/Screenshot-7.jpg)


## *GET*

![vscode-hint-4](https://i.ibb.co/wLDGcSQ/Screenshot-8.jpg)

## *POST*

![vscode-hint-5](https://i.ibb.co/W6W1R1M/Screenshot-9.jpg)

## *POST intentional error*

![vscode-hint-6](https://i.ibb.co/khkSRkf/Screenshot-10.jpg)

## Authors

* **Aldair Bernal** - *Full work* - [Aldair47x](https://github.com/Aldair47x)

Follow me! – [aldair47x@Twitter](https://twitter.com/aldair47x) – aldair47x@gmail.com

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

