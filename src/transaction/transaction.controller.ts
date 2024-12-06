import { Body, Controller, InternalServerErrorException, Post } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { CreateTransactionBca } from './dto/virtual_account/create-transaction.bca';
import { CreateTransactionBni } from './dto/virtual_account/create-transaction.bni';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  public async create(@Body() createTransactionDto: CreateTransactionDto ) {
    try {
      return await this.transactionService.createTransaction(createTransactionDto);
  } catch (error) {
      console.error('Error creating transaction:', error);
      throw new InternalServerErrorException('Internal Server Error');
  }
  }

  @Post('/bca')
  public async createTransactionBca(@Body() createTransaction: CreateTransactionBca) {
    try {
      return this.transactionService.createTransactionBca(createTransaction)
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  @Post('/bni')
  public async createTransactionBni(@Body() createTransactionBni: CreateTransactionBni ) {
    try {
      return this.transactionService.createTransactionBca(createTransactionBni)
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw new InternalServerErrorException('Internal Server Error');
    }
  }
} 
