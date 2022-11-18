import { prisma } from "@/config";
import { Ticket } from "@prisma/client";

async function findTypes() {
  return await prisma.ticketType.findMany();
}

async function findTicket(enrollmentId: number) {
  return await prisma.ticket.findFirst({ 
    where: { enrollmentId },
    include: {
      TicketType: true
    },
  });
}

export async function findTicketById(id: number) {
  return await prisma.ticket.findUnique({ where: { id }, include: { TicketType: true } });
}

async function postTicket(data: CreateTicketParams) {
  await prisma.ticket.create({ data, });

  return await findTicket(data.enrollmentId);
}

async function updateStatus(id: number) {
  await prisma.ticket.update({ 
    where: { id },
    data: {
      status: "PAID",
    },
  });
}

export type CreateTicketParams = Omit<Ticket, "id" | "createdAt" | "updatedAt">;

const ticketsRepository = {
  findTypes,
  postTicket,
  findTicket,
  findTicketById,
  updateStatus
};

export default ticketsRepository;
