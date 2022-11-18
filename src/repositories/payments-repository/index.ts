import { prisma } from "@/config";
import { Payment } from "@prisma/client";

async function getByTicketId(ticketId: number) {
  return await prisma.payment.findFirst({ 
    where: { ticketId }
  });
}

async function postPayment(data: CreatePaymentParams) {
  return await prisma.payment.create({ 
    data,
  });
}

async function getPayment(ticketId: number) {
  return await prisma.payment.findFirst({ 
    where: { ticketId }
  });
}

export type CreatePaymentParams = Omit<Payment, "id" | "createdAt" | "updatedAt">;

const paymentsRepository = {
  getByTicketId,
  postPayment,
  getPayment
};
  
export default paymentsRepository;
