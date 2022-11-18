import { Response } from "express";
import { AuthenticatedRequest } from "@/middlewares";
import paymentsService from "@/services/payments-service";
import httpStatus from "http-status";

export async function getPayment(req: AuthenticatedRequest, res: Response) {
  const id = req.query.ticketId;
  const ticketId = Number(id);
  const { userId } = req;
  try {
    const payment = await paymentsService.getById(ticketId, userId);
    res.status(httpStatus.OK).send(payment);
  } catch (error) {
    if(error.name === "NotFoundError") {
      return res.status(httpStatus.NOT_FOUND).send(error);
    }
    if(error.name === "UnauthorizedError") {
      return res.status(httpStatus.UNAUTHORIZED).send(error);
    }
    return res.status(httpStatus.BAD_REQUEST).send(error);
  }
}

export async function postPayment(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { ticketId, cardData } = req.body;

  try {
    const payment = await paymentsService.postProcess(ticketId, userId, cardData);
    res.status(httpStatus.OK).send(payment);
  } catch (error) {
    if(error.name === "NotFoundError") {
      return res.status(httpStatus.NOT_FOUND).send(error);
    }
    if(error.name === "UnauthorizedError") {
      return res.status(httpStatus.UNAUTHORIZED).send(error);
    }
    return res.status(httpStatus.BAD_REQUEST).send(error);
  }
}
