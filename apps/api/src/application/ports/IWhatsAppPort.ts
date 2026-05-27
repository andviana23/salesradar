export interface WhatsAppMessage {
  to: string
  text: string
}

export interface IWhatsAppPort {
  buildLink(message: WhatsAppMessage): string
  send(message: WhatsAppMessage): Promise<void>
}
