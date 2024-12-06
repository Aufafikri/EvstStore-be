import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/lib/prisma.service';
import * as midtransClient from 'midtrans-client'
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { CreateTransactionBca } from './dto/virtual_account/create-transaction.bca';
import { CreateTransactionBni } from './dto/virtual_account/create-transaction.bni';

@Injectable()
export class TransactionService {
    constructor(private readonly prisma: PrismaService) {}

    public async createTransaction (createTransactionDto: CreateTransactionDto) {
        const { email, grossAmount, name, orderId, productId, productName, productPrice, quantity, userId, merchantName, addressId, addressCity, addressCountry } = createTransactionDto

        if (!grossAmount || !orderId) {
            throw new BadRequestException('grossAmount dan orderId harus diisi.');
        }

        const snap = new midtransClient.Snap({
            isProduction: false,
            serverKey: process.env.MIDTRANS_CLIENT_SERVER,
            clientKey: process.env.MIDTRANS_CLIENT_KEY
        })

        const calculatedGrossAmount = productPrice * quantity

        const parameter = {
            transaction_details: {
                order_id: orderId,
                gross_amount: calculatedGrossAmount
            },
            item_details: [
                {
                    id: productId,
                    price: productPrice,
                    quantity: quantity,
                    name: productName,
                    merhant_name: merchantName
                }
            ],
            customer_details: {
                first_name: name,
                email: email,
                shipping_address: {
                    first_name: name,
                    phone: 12345678,
                    address: 'jatimakmur pride',
                    city: addressCity,
                    postal_code: '12212',
                    country_code: addressCountry,
                }
            }
        }

        try {
            const transaction = await snap.createTransaction(parameter)
            await this.prisma.order.create({
                data: {
                    id: orderId,
                    totalAmount: grossAmount,
                    userId,
                    productId,
                    status: 'PENDING',
                    addressId: addressId
                }
            })

            return { token: transaction.token }
        } catch (error) {
            throw new BadRequestException(
                'Transaction creation failed: ' + error.message,
            );
        }
    }

    public async createTransactionBca(createTransaction: CreateTransactionBca) {
        const { grossAmount, orderId, quantity, productPrice } = createTransaction

        if (!grossAmount || !orderId) {
            throw new BadRequestException('grossAmount dan orderId harus diisi.');
        }

        const snap = new midtransClient.Snap({
            isProduction: false,
            serverKey: process.env.MIDTRANS_CLIENT_SERVER,
            clientKey: process.env.MIDTRANS_CLIENT_KEY
        })

        const calculatedGrossAmount = productPrice * quantity

        const parameter = {
            payment_type: "bank_transfer",
            transaction_details: {
                order_id: orderId,
                gross_amount: calculatedGrossAmount
            },
            bank_transfer: {
                bank: "bca"
            },
            enabled_payments: ['bca_va'],
            expiry: {
                // start_time: "2024-11-29 07:58:00 +0700",
                unit: "minutes",
                duration: 60
            }
        }

        try {
            const transaction = await snap.createTransaction(parameter)
            return { token: transaction.token }
        } catch (error) {
            throw new BadRequestException(
                'Transaction creation failed: ' + error.message,
            );
        }
    }

    public async createTransactionBni(createTransactionBni: CreateTransactionBni) {
        const { grossAmount, orderId, productPrice, quantity } = createTransactionBni

        if (!grossAmount || !orderId) {
            throw new BadRequestException('grossAmount dan orderId harus diisi.');
        }

        const snap = new midtransClient.Snap({
            isProduction: false,
            serverKey: process.env.MIDTRANS_CLIENT_SERVER,
            clientKey: process.env.MIDTRANS_CLIENT_KEY
        })

        const calculatedGrossAmount = productPrice * quantity

        const parameter = {
            payment_type: "bank_transfer",
            transaction_details: {
                order_id: orderId,
                gross_amount: calculatedGrossAmount,
            },
            bank_transfer: {
                bank: "bni"
            },
            enabled_payments: ["bni_va"],
            expiry: {
                // start_time: "2024-11-29 07:58:00 +0700",
                unit: "minutes",
                duration: 60
            }
        }

        try {
            const transaction = await snap.createTransaction(parameter)
            return { token: transaction.token }
        } catch (error) {
            throw new BadRequestException(
                'Transaction creation failed: ' + error.message,
            );
        }
    }
}
