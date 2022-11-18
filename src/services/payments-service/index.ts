import ticketsRepository from "@/repositories/tickets-repository";
import ticketsService from "../tickets-service";
import paymentsRepository from "@/repositories/payments-repository";
import { notFoundError, badRequestError, unauthorizedError } from "@/errors";
import { CreatePaymentParams } from "@/repositories/payments-repository";
import { CardData } from "@/protocols";

export async function getById(ticketId: number, userId: number) {
  if (isNaN(ticketId)) {
    throw badRequestError();
  }
  const payment = await  paymentsRepository.getByTicketId(ticketId);
  const ticketByUser = await ticketsService.getTicketByUserId(userId);
  const ticket = await ticketsRepository.findTicketById(ticketId);
  if(ticket == null) {
    throw notFoundError();
  } else if(ticketByUser == null) {
    throw unauthorizedError();
  }
  return payment;
}

export async function postProcess(ticketId: number, userId: number, cardData: CardData) {
  const cardIssuer = cardData.issuer;
  const cardLastDigits: string =  getLastDigits(cardData.number);
  const ticket = await ticketsRepository.findTicketById(ticketId);
  const ticketByUser = await ticketsService.getTicketByUserId(userId);
  if(ticket == null) {
    throw notFoundError();
  } else if(ticketByUser == null) {
    throw unauthorizedError();
  }
  const value = ticket.TicketType.price;
  const payment: CreatePaymentParams = {
    ticketId,
    value,
    cardIssuer,
    cardLastDigits
  };
  await paymentsRepository.postPayment(payment);
  await ticketsRepository.updateStatus(ticketId);
  return await paymentsRepository.getPayment(ticketId);
}

function getLastDigits(cardNumber: number): string {
  const toString = cardNumber.toString();
  const number = toString[toString.length - 4] + toString[toString.length - 3] + toString[toString.length - 2] + toString[toString.length - 1];
  return number;
}

const paymentsService = {
  getById,
  postProcess,
};

export default paymentsService;
