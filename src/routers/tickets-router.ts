import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { getTicketTypes, postTicket, getTicket } from "@/controllers";

const ticketsRouter = Router();

ticketsRouter
  .all("/*", authenticateToken)
  .get("/types", getTicketTypes)
  .get("/", getTicket)
  .post("/", postTicket);

export { ticketsRouter };
