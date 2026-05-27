import { IWhatsAppPort, WhatsAppMessage } from '@application/ports/IWhatsAppPort'

export class WhatsAppAdapter implements IWhatsAppPort {
  buildLink({ to, text }: WhatsAppMessage): string {
    const phone = to.replace(/\D/g, '')
    return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`
  }

  // Evolution API integration — implemented in v2
  async send(_message: WhatsAppMessage): Promise<void> {
    throw new Error('Direct send not available in MVP — use buildLink()')
  }
}
