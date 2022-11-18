import ticketsRepository from "@/repositories/tickets-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import { notFoundError, badRequestError } from "@/errors";
import { CreateTicketParams } from "@/repositories/tickets-repository";

export async function getTypes() {
  return await ticketsRepository.findTypes();
}

export async function getTicketByUserId(userId: number) {
  const enrollment = await enrollmentRepository.findByUserId(userId);
  const enrollmentId = enrollment.id;
  return await ticketsRepository.findTicket(enrollmentId); 
}

export async function postTicket(userId: number, ticketTypeId: number) {
  if(!ticketTypeId) {
    throw badRequestError();
  }
  const enrollment = await enrollmentRepository.findByUserId(userId);

  if(!enrollment.id) {
    throw notFoundError();
  }

  const data: CreateTicketParams = { status: "RESERVED", ticketTypeId: ticketTypeId, enrollmentId: enrollment.id };

  return await ticketsRepository.postTicket(data);
}

const ticketsService = {
  getTypes,
  postTicket,
  getTicketByUserId,
};

export default ticketsService;
